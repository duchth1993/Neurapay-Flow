import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Wallet, 
  Plus, 
  Trash2, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  XCircle,
  ArrowUpRight,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useStore, Employee } from '../store/useStore';
import { mockEmployees, formatAddress, formatTimeRemaining, simulateTransaction } from '../utils/mockData';

export const EmployerDashboard: React.FC = () => {
  const { employees, setEmployees, treasuryBalance, setTreasuryBalance, isConnected } = useStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFundModal, setShowFundModal] = useState(false);
  const [newEmployee, setNewEmployee] = useState({ wallet: '', salary: '' });
  const [fundAmount, setFundAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingAction, setProcessingAction] = useState<string | null>(null);

  useEffect(() => {
    if (isConnected && employees.length === 0) {
      setEmployees(mockEmployees);
      setTreasuryBalance('15000.00');
    }
  }, [isConnected, employees.length, setEmployees, setTreasuryBalance]);

  const handleAddEmployee = async () => {
    if (!newEmployee.wallet || !newEmployee.salary) return;
    
    setIsProcessing(true);
    setProcessingAction('Adding employee...');
    
    await simulateTransaction();
    
    const employee: Employee = {
      wallet: newEmployee.wallet,
      weeklySalary: newEmployee.salary,
      lastClaimTime: Date.now() / 1000 - 7 * 24 * 60 * 60,
      isActive: true,
      totalClaimed: '0.00',
      nextClaimTime: Date.now() / 1000,
      canClaim: true,
    };
    
    setEmployees([...employees, employee]);
    setNewEmployee({ wallet: '', salary: '' });
    setShowAddModal(false);
    setIsProcessing(false);
    setProcessingAction(null);
  };

  const handleRemoveEmployee = async (wallet: string) => {
    setIsProcessing(true);
    setProcessingAction('Removing employee...');
    
    await simulateTransaction();
    
    setEmployees(employees.filter(e => e.wallet !== wallet));
    setIsProcessing(false);
    setProcessingAction(null);
  };

  const handleFundTreasury = async () => {
    if (!fundAmount) return;
    
    setIsProcessing(true);
    setProcessingAction('Funding treasury...');
    
    await simulateTransaction();
    
    const newBalance = (parseFloat(treasuryBalance) + parseFloat(fundAmount)).toFixed(2);
    setTreasuryBalance(newBalance);
    setFundAmount('');
    setShowFundModal(false);
    setIsProcessing(false);
    setProcessingAction(null);
  };

  const totalWeeklySalaries = employees.reduce((sum, e) => sum + parseFloat(e.weeklySalary), 0);
  const weeksOfRunway = totalWeeklySalaries > 0 ? Math.floor(parseFloat(treasuryBalance) / totalWeeklySalaries) : 0;

  if (!isConnected) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-20"
      >
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-neura-card border border-neura-border flex items-center justify-center">
          <Wallet className="w-10 h-10 text-gray-500" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Connect Your Wallet</h2>
        <p className="text-gray-400 max-w-md mx-auto">
          Connect your wallet to access the employer dashboard and manage your team's payroll.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Processing Overlay */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card border border-neura-border rounded-2xl p-8 text-center"
            >
              <Loader2 className="w-12 h-12 text-neura-cyan mx-auto mb-4 animate-spin" />
              <p className="text-white font-medium">{processingAction}</p>
              <p className="text-gray-400 text-sm mt-2">Please wait for confirmation...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-6 border border-neura-border hover:border-neura-cyan/30 transition-colors group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-neura-cyan/10 flex items-center justify-center group-hover:bg-neura-cyan/20 transition-colors">
              <DollarSign className="w-6 h-6 text-neura-cyan" />
            </div>
            <button
              onClick={() => setShowFundModal(true)}
              className="text-neura-cyan hover:text-neura-cyan/80 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <p className="text-gray-400 text-sm mb-1">Treasury Balance</p>
          <p className="text-3xl font-bold text-white">${treasuryBalance}</p>
          <p className="text-xs text-gray-500 mt-2">$USN</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl p-6 border border-neura-border hover:border-neura-purple/30 transition-colors group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-neura-purple/10 flex items-center justify-center group-hover:bg-neura-purple/20 transition-colors">
              <Users className="w-6 h-6 text-neura-purple" />
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="text-neura-purple hover:text-neura-purple/80 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <p className="text-gray-400 text-sm mb-1">Active Employees</p>
          <p className="text-3xl font-bold text-white">{employees.length}</p>
          <p className="text-xs text-gray-500 mt-2">${totalWeeklySalaries.toFixed(2)}/week total</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-2xl p-6 border border-neura-border hover:border-green-500/30 transition-colors group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
              <Clock className="w-6 h-6 text-green-500" />
            </div>
          </div>
          <p className="text-gray-400 text-sm mb-1">Runway</p>
          <p className="text-3xl font-bold text-white">{weeksOfRunway} weeks</p>
          <p className="text-xs text-gray-500 mt-2">At current payroll rate</p>
        </motion.div>
      </div>

      {/* Employee List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card rounded-2xl border border-neura-border overflow-hidden"
      >
        <div className="p-6 border-b border-neura-border flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">Employee Roster</h3>
            <p className="text-sm text-gray-400">Manage your team's payroll</p>
          </div>
          <motion.button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neura-gradient text-white font-medium text-sm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="w-4 h-4" />
            Add Employee
          </motion.button>
        </div>

        {employees.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No employees added yet</p>
            <p className="text-sm text-gray-500 mt-1">Add your first team member to get started</p>
          </div>
        ) : (
          <div className="divide-y divide-neura-border">
            {employees.map((employee, index) => (
              <motion.div
                key={employee.wallet}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 sm:p-6 hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-neura-gradient flex items-center justify-center text-white font-bold">
                      {employee.wallet.slice(2, 4).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-mono text-sm text-white">{formatAddress(employee.wallet)}</p>
                      <p className="text-xs text-gray-500">Total claimed: ${employee.totalClaimed}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-lg font-semibold text-white">${employee.weeklySalary}</p>
                      <p className="text-xs text-gray-500">per week</p>
                    </div>

                    <div className="flex items-center gap-2">
                      {employee.canClaim ? (
                        <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-green-500/10 text-green-400 text-xs">
                          <CheckCircle2 className="w-3 h-3" />
                          Claimable
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-yellow-500/10 text-yellow-400 text-xs">
                          <Clock className="w-3 h-3" />
                          {formatTimeRemaining(employee.nextClaimTime)}
                        </span>
                      )}
                    </div>

                    <motion.button
                      onClick={() => handleRemoveEmployee(employee.wallet)}
                      className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Add Employee Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md glass-card rounded-2xl border border-neura-border p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-white mb-6">Add New Employee</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Wallet Address</label>
                  <input
                    type="text"
                    value={newEmployee.wallet}
                    onChange={(e) => setNewEmployee({ ...newEmployee, wallet: e.target.value })}
                    placeholder="0x..."
                    className="w-full px-4 py-3 rounded-xl bg-neura-dark border border-neura-border focus:border-neura-cyan/50 focus:outline-none text-white font-mono text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Weekly Salary ($USN)</label>
                  <input
                    type="number"
                    value={newEmployee.salary}
                    onChange={(e) => setNewEmployee({ ...newEmployee, salary: e.target.value })}
                    placeholder="500.00"
                    className="w-full px-4 py-3 rounded-xl bg-neura-dark border border-neura-border focus:border-neura-cyan/50 focus:outline-none text-white"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-3 rounded-xl border border-neura-border text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <motion.button
                  onClick={handleAddEmployee}
                  disabled={!newEmployee.wallet || !newEmployee.salary}
                  className="flex-1 px-4 py-3 rounded-xl bg-neura-gradient text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Add Employee
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fund Treasury Modal */}
      <AnimatePresence>
        {showFundModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowFundModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md glass-card rounded-2xl border border-neura-border p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-white mb-6">Fund Treasury</h3>
              
              <div className="p-4 rounded-xl bg-neura-cyan/5 border border-neura-cyan/20 mb-6">
                <div className="flex items-center gap-2 text-neura-cyan mb-2">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Current Balance</span>
                </div>
                <p className="text-2xl font-bold text-white">${treasuryBalance} USN</p>
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">Amount to Deposit ($USN)</label>
                <input
                  type="number"
                  value={fundAmount}
                  onChange={(e) => setFundAmount(e.target.value)}
                  placeholder="1000.00"
                  className="w-full px-4 py-3 rounded-xl bg-neura-dark border border-neura-border focus:border-neura-cyan/50 focus:outline-none text-white"
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowFundModal(false)}
                  className="flex-1 px-4 py-3 rounded-xl border border-neura-border text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <motion.button
                  onClick={handleFundTreasury}
                  disabled={!fundAmount}
                  className="flex-1 px-4 py-3 rounded-xl bg-neura-gradient text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ArrowUpRight className="w-4 h-4" />
                  Fund Treasury
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
