import { Employee, ClaimHistory } from '../store/useStore';

// Mock contract address
export const CONTRACT_ADDRESS = '0x1234567890abcdef1234567890abcdef12345678';
export const USN_TOKEN_ADDRESS = '0xabcdef1234567890abcdef1234567890abcdef12';

// Neura Testnet config
export const NEURA_TESTNET = {
  chainId: 267,
  name: 'Neura Testnet',
  rpcUrl: 'https://rpc.neura.network',
  symbol: 'NEURA',
  explorer: 'https://explorer.neura.network',
};

// Mock employees data
export const mockEmployees: Employee[] = [
  {
    wallet: '0x742d35Cc6634C0532925a3b844Bc9e7595f8fE21',
    weeklySalary: '500.00',
    lastClaimTime: Date.now() / 1000 - 8 * 24 * 60 * 60,
    isActive: true,
    totalClaimed: '2000.00',
    nextClaimTime: Date.now() / 1000 - 1 * 24 * 60 * 60,
    canClaim: true,
  },
  {
    wallet: '0x8ba1f109551bD432803012645Ac136ddd64DBA72',
    weeklySalary: '750.00',
    lastClaimTime: Date.now() / 1000 - 3 * 24 * 60 * 60,
    isActive: true,
    totalClaimed: '3000.00',
    nextClaimTime: Date.now() / 1000 + 4 * 24 * 60 * 60,
    canClaim: false,
  },
  {
    wallet: '0xdD2FD4581271e230360230F9337D5c0430Bf44C0',
    weeklySalary: '1000.00',
    lastClaimTime: Date.now() / 1000 - 7 * 24 * 60 * 60,
    isActive: true,
    totalClaimed: '8000.00',
    nextClaimTime: Date.now() / 1000,
    canClaim: true,
  },
];

// Mock claim history
export const mockClaimHistory: ClaimHistory[] = [
  {
    id: '1',
    amount: '500.00',
    timestamp: Date.now() - 7 * 24 * 60 * 60 * 1000,
    txHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    gasless: true,
  },
  {
    id: '2',
    amount: '500.00',
    timestamp: Date.now() - 14 * 24 * 60 * 60 * 1000,
    txHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    gasless: true,
  },
  {
    id: '3',
    amount: '500.00',
    timestamp: Date.now() - 21 * 24 * 60 * 60 * 1000,
    txHash: '0x567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234',
    gasless: false,
  },
  {
    id: '4',
    amount: '500.00',
    timestamp: Date.now() - 28 * 24 * 60 * 60 * 1000,
    txHash: '0x890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456',
    gasless: true,
  },
];

// Format address for display
export const formatAddress = (address: string): string => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// Format timestamp to readable date
export const formatDate = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Format time remaining
export const formatTimeRemaining = (targetTimestamp: number): string => {
  const now = Date.now() / 1000;
  const diff = targetTimestamp - now;
  
  if (diff <= 0) return 'Available now';
  
  const days = Math.floor(diff / (24 * 60 * 60));
  const hours = Math.floor((diff % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((diff % (60 * 60)) / 60);
  
  if (days > 0) return `${days}d ${hours}h remaining`;
  if (hours > 0) return `${hours}h ${minutes}m remaining`;
  return `${minutes}m remaining`;
};

// Simulate transaction delay
export const simulateTransaction = (): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const txHash = '0x' + Array.from({ length: 64 }, () => 
        Math.floor(Math.random() * 16).toString(16)
      ).join('');
      resolve(txHash);
    }, 2000);
  });
};
