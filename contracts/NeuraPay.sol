// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Permit.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title NeuraPay Flow
 * @notice Gasless payroll system for Web3 teams using $USN on Neura Testnet
 * @dev Implements weekly payment cycles with meta-transaction support
 */
contract NeuraPay is Ownable, ReentrancyGuard {
    // USN Token address on Neura Testnet
    IERC20 public immutable usnToken;
    
    // Relayer address that can execute gasless claims
    address public relayer;
    
    // Employee struct
    struct Employee {
        address wallet;
        uint256 weeklySalary;
        uint256 lastClaimTime;
        bool isActive;
        uint256 totalClaimed;
    }
    
    // Mapping from employee address to their data
    mapping(address => Employee) public employees;
    
    // Array of all employee addresses for enumeration
    address[] public employeeList;
    
    // Treasury balance tracking
    uint256 public treasuryBalance;
    
    // Claim interval (7 days in seconds)
    uint256 public constant CLAIM_INTERVAL = 7 days;
    
    // Nonces for gasless transactions
    mapping(address => uint256) public nonces;
    
    // Domain separator for EIP-712
    bytes32 public DOMAIN_SEPARATOR;
    
    // Typehash for claim signature
    bytes32 public constant CLAIM_TYPEHASH = keccak256(
        "Claim(address employee,uint256 nonce,uint256 deadline)"
    );
    
    // Events
    event EmployeeAdded(address indexed employee, uint256 weeklySalary);
    event EmployeeRemoved(address indexed employee);
    event SalaryUpdated(address indexed employee, uint256 newSalary);
    event TreasuryFunded(address indexed funder, uint256 amount);
    event TreasuryWithdrawn(address indexed owner, uint256 amount);
    event SalaryClaimed(address indexed employee, uint256 amount, bool gasless);
    event RelayerUpdated(address indexed oldRelayer, address indexed newRelayer);
    
    constructor(address _usnToken, address _relayer) {
        require(_usnToken != address(0), "Invalid token address");
        usnToken = IERC20(_usnToken);
        relayer = _relayer;
        
        // Initialize EIP-712 domain separator
        DOMAIN_SEPARATOR = keccak256(
            abi.encode(
                keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"),
                keccak256(bytes("NeuraPay Flow")),
                keccak256(bytes("1")),
                block.chainid,
                address(this)
            )
        );
    }
    
    /**
     * @notice Add a new employee to the payroll
     * @param _employee Employee wallet address
     * @param _weeklySalary Weekly salary amount in USN (with decimals)
     */
    function addEmployee(address _employee, uint256 _weeklySalary) external onlyOwner {
        require(_employee != address(0), "Invalid employee address");
        require(_weeklySalary > 0, "Salary must be greater than 0");
        require(!employees[_employee].isActive, "Employee already exists");
        
        employees[_employee] = Employee({
            wallet: _employee,
            weeklySalary: _weeklySalary,
            lastClaimTime: block.timestamp - CLAIM_INTERVAL, // Allow immediate first claim
            isActive: true,
            totalClaimed: 0
        });
        
        employeeList.push(_employee);
        
        emit EmployeeAdded(_employee, _weeklySalary);
    }
    
    /**
     * @notice Remove an employee from the payroll
     * @param _employee Employee wallet address
     */
    function removeEmployee(address _employee) external onlyOwner {
        require(employees[_employee].isActive, "Employee not found");
        
        employees[_employee].isActive = false;
        
        // Remove from employee list
        for (uint256 i = 0; i < employeeList.length; i++) {
            if (employeeList[i] == _employee) {
                employeeList[i] = employeeList[employeeList.length - 1];
                employeeList.pop();
                break;
            }
        }
        
        emit EmployeeRemoved(_employee);
    }
    
    /**
     * @notice Update an employee's salary
     * @param _employee Employee wallet address
     * @param _newSalary New weekly salary amount
     */
    function updateSalary(address _employee, uint256 _newSalary) external onlyOwner {
        require(employees[_employee].isActive, "Employee not found");
        require(_newSalary > 0, "Salary must be greater than 0");
        
        employees[_employee].weeklySalary = _newSalary;
        
        emit SalaryUpdated(_employee, _newSalary);
    }
    
    /**
     * @notice Fund the treasury with USN tokens
     * @param _amount Amount of USN to deposit
     */
    function fundTreasury(uint256 _amount) external {
        require(_amount > 0, "Amount must be greater than 0");
        
        require(
            usnToken.transferFrom(msg.sender, address(this), _amount),
            "Transfer failed"
        );
        
        treasuryBalance += _amount;
        
        emit TreasuryFunded(msg.sender, _amount);
    }
    
    /**
     * @notice Withdraw USN from treasury (owner only)
     * @param _amount Amount to withdraw
     */
    function withdrawTreasury(uint256 _amount) external onlyOwner {
        require(_amount <= treasuryBalance, "Insufficient treasury balance");
        
        treasuryBalance -= _amount;
        
        require(usnToken.transfer(msg.sender, _amount), "Transfer failed");
        
        emit TreasuryWithdrawn(msg.sender, _amount);
    }
    
    /**
     * @notice Claim salary (direct call by employee)
     */
    function claimSalary() external nonReentrant {
        _processClaim(msg.sender, false);
    }
    
    /**
     * @notice Gasless claim via relayer with signature
     * @param _employee Employee address
     * @param _deadline Signature deadline
     * @param _v Signature v
     * @param _r Signature r
     * @param _s Signature s
     */
    function claimSalaryGasless(
        address _employee,
        uint256 _deadline,
        uint8 _v,
        bytes32 _r,
        bytes32 _s
    ) external nonReentrant {
        require(msg.sender == relayer, "Only relayer can execute");
        require(block.timestamp <= _deadline, "Signature expired");
        
        // Verify signature
        bytes32 structHash = keccak256(
            abi.encode(CLAIM_TYPEHASH, _employee, nonces[_employee]++, _deadline)
        );
        
        bytes32 digest = keccak256(
            abi.encodePacked("\x19\x01", DOMAIN_SEPARATOR, structHash)
        );
        
        address signer = ecrecover(digest, _v, _r, _s);
        require(signer == _employee, "Invalid signature");
        
        _processClaim(_employee, true);
    }
    
    /**
     * @notice Internal function to process salary claims
     * @param _employee Employee address
     * @param _gasless Whether this is a gasless transaction
     */
    function _processClaim(address _employee, bool _gasless) internal {
        Employee storage emp = employees[_employee];
        
        require(emp.isActive, "Not an active employee");
        require(
            block.timestamp >= emp.lastClaimTime + CLAIM_INTERVAL,
            "Claim not yet available"
        );
        require(treasuryBalance >= emp.weeklySalary, "Insufficient treasury");
        
        emp.lastClaimTime = block.timestamp;
        emp.totalClaimed += emp.weeklySalary;
        treasuryBalance -= emp.weeklySalary;
        
        require(
            usnToken.transfer(_employee, emp.weeklySalary),
            "Transfer failed"
        );
        
        emit SalaryClaimed(_employee, emp.weeklySalary, _gasless);
    }
    
    /**
     * @notice Update the relayer address
     * @param _newRelayer New relayer address
     */
    function setRelayer(address _newRelayer) external onlyOwner {
        address oldRelayer = relayer;
        relayer = _newRelayer;
        emit RelayerUpdated(oldRelayer, _newRelayer);
    }
    
    /**
     * @notice Get employee details
     * @param _employee Employee address
     */
    function getEmployee(address _employee) external view returns (
        address wallet,
        uint256 weeklySalary,
        uint256 lastClaimTime,
        bool isActive,
        uint256 totalClaimed,
        uint256 nextClaimTime,
        bool canClaim
    ) {
        Employee memory emp = employees[_employee];
        return (
            emp.wallet,
            emp.weeklySalary,
            emp.lastClaimTime,
            emp.isActive,
            emp.totalClaimed,
            emp.lastClaimTime + CLAIM_INTERVAL,
            block.timestamp >= emp.lastClaimTime + CLAIM_INTERVAL && emp.isActive
        );
    }
    
    /**
     * @notice Get all employees
     */
    function getAllEmployees() external view returns (address[] memory) {
        return employeeList;
    }
    
    /**
     * @notice Get employee count
     */
    function getEmployeeCount() external view returns (uint256) {
        return employeeList.length;
    }
    
    /**
     * @notice Check if address is an employee
     */
    function isEmployee(address _address) external view returns (bool) {
        return employees[_address].isActive;
    }
}
