import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wallet, 
  Zap, 
  Clock, 
  CheckCircle2, 
  History,
  ExternalLink,
  Loader2,
  Sparkles,
  TrendingUp,
  Calendar
} from 'lucide-react';
import { useStore, Employee, ClaimHistory } from '../store/useStore';
import { mockClaimHistory, formatAddress, formatDate, formatTimeRemaining, simulateTransaction, NEURA_TESTNET } from '../utils/mockData';

export const EmployeeDashboard: React.FC = () => {
  const { 
    isConnected, 
    address, 
    employeeData, 
    setEmployeeData, 
    claimHistory, 
    setClaimHistory,
    employees 
  } = useStore();
  
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(false);
  const [lastTxHash, setLastTxHash] = useState<string | null>(null);

  useEffect(() => {
    if (isConnected && address && employees.length > 0) {
      // Find if current user is an employee
      const emp = employees.find(e => e.wallet.toLowerCase() === address.toLowerCase());
      if (emp) {
        setEmployeeData(emp);
      } else {
        // Mock employee data for demo
        setEmployeeData({
          wallet: address,
          weeklySalary: '500.00',
          lastClaimTime: Date.now() / 1000 - 8 * 24 * 60 * 60,
          isActive: true,
          totalClaimed: '2000.00',
          nextClaimTime: Date.now() / 1000 - 1 * 24 * 60 * 60,
          canClaim: true,
        });
      }
      setClaimHistory(mockClaimHistory);
    }
  }, [isConnected, address, employees, setEmployeeData, setClaimHistory]);

  const handleGaslessClaim = async () => {
    if (!employeeData?.canClaim) return;
    
    setIsClaiming(true);
    
    // Simulate gasless transaction
    const txHash = await simulateTransaction();
    
    setLastTxHash(txHash);
    setIsClaiming(false);
    setClaimSuccess(true);
    
    // Update employee data
    const newClaim: ClaimHistory = {
      id: Date.now().toString(),
      amount: employeeData.weeklySalary,
      timestamp: Date.now(),
      txHash,
      gasless: true,
    };
    
    setClaimHistory([newClaim, ...claimHistory]);
    setEmployeeData({
      ...employeeData,
      lastClaimTime: Date.now() / 1000,
      totalClaimed: (parseFloat(employeeData.totalClaimed) + parseFloat(employeeData.weeklySalary)).toFixed(2),
      nextClaimTime: Date.now() / 1000 + 7 * 24 * 60 * 60,
      canClaim: false,
    });
    
    // Reset success state after animation
    setTimeout(() => setClaimSuccess(false), 3000);
  };

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
          Connect your wallet to view your salary and claim your earnings.
        </p>
      </motion.div>
    );
  }

  if (!employeeData) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-20"
      >
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-neura-card border border-neura-border flex items-center justify-center">
          <Wallet className="w-10 h-10 text-gray-500" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Not Registered</h2>
        <p className="text-gray-400 max-w-md mx-auto">
          Your wallet is not registered as an employee. Contact your employer to get added to the payroll.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Claim Success Overlay */}
      <AnimatePresence>
        {claimSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="glass-card border border-green-500/30 rounded-2xl p-8 text-center max-w-md mx-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', bounce: 0.5 }}
                className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center"
              >
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-2">Claim Successful!</h3>
              <p className="text-gray-400 mb-4">
                ${employeeData.weeklySalary} USN has been sent to your wallet
              </p>
              <div className="flex items-center justify-center gap-2 text-neura-cyan">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm">Zero gas fees paid!</span>
              </div>
              {lastTxHash && (
                <a
                  href={`${NEURA_TESTNET.explorer}/tx/${lastTxHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-4 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  View Transaction <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Claim Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden"
      >
        <div className="glass-card rounded-3xl border border-neura-border p-8 relative">
          {/* Background glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-neura-cyan/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-neura-purple/10 rounded-full blur-[80px]" />
          
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div>
                <p className="text-gray-400 text-sm mb-2">Your Weekly Salary</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl sm:text-6xl font-bold bg-neura-gradient bg-clip-text text-transparent">
                    ${employeeData.weeklySalary}
                  </span>
                  <span className="text-xl text-gray-500">USN</span>
                </div>
                
                <div className="mt-6 flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-neura-dark/50 border border-neura-border">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-400">Total Earned:</span>
                    <span className="text-sm font-medium text-white">${employeeData.totalClaimed}</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-neura-dark/50 border border-neura-border">
                    <Calendar className="w-4 h-4 text-neura-cyan" />
                    <span className="text-sm text-gray-400">Next Claim:</span>
                    <span className="text-sm font-medium text-white">
                      {employeeData.canClaim ? 'Available Now' : formatTimeRemaining(employeeData.nextClaimTime)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center">
                <motion.button
                  onClick={handleGaslessClaim}
                  disabled={!employeeData.canClaim || isClaiming}
                  className={`relative group w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-lg overflow-hidden ${
                    employeeData.canClaim 
                      ? 'bg-neura-gradient neon-glow' 
                      : 'bg-gray-700 cursor-not-allowed'
                  }`}
                  whileHover={employeeData.canClaim ? { scale: 1.02 } : {}}
                  whileTap={employeeData.canClaim ? { scale: 0.98 } : {}}
                >
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    {isClaiming ? (
                      <>
                        <Loader2 className="w-6 h-6 animate-spin" />
                        Processing...
                      </>
                    ) : employeeData.canClaim ? (
                      <>
                        <Zap className="w-6 h-6" />
                        Claim Gasless
                      </>
                    ) : (
                      <>
                        <Clock className="w-6 h-6" />
                        Not Available
                      </>
                    )}
                  </span>
                  {employeeData.canClaim && !isClaiming && (
                    <div className="absolute inset-0 bg-neura-gradient-hover opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </motion.button>
                
                {employeeData.canClaim && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-1 mt-3 text-sm text-neura-cyan"
                  >
                    <Sparkles className="w-4 h-4" />
                    Employer pays gas fees
                  </motion.p>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Claim History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-2xl border border-neura-border overflow-hidden"
      >
        <div className="p-6 border-b border-neura-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neura-purple/10 flex items-center justify-center">
              <History className="w-5 h-5 text-neura-purple" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Claim History</h3>
              <p className="text-sm text-gray-400">Your past salary claims</p>
            </div>
          </div>
        </div>

        {claimHistory.length === 0 ? (
          <div className="p-12 text-center">
            <History className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No claims yet</p>
            <p className="text-sm text-gray-500 mt-1">Your claim history will appear here</p>
          </div>
        ) : (
          <div className="divide-y divide-neura-border">
            {claimHistory.map((claim, index) => (
              <motion.div
                key={claim.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 sm:p-6 hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      claim.gasless ? 'bg-neura-cyan/10' : 'bg-gray-700'
                    }`}>
                      {claim.gasless ? (
                        <Zap className="w-5 h-5 text-neura-cyan" />
                      ) : (
                        <Wallet className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-white">${claim.amount} USN</p>
                      <p className="text-xs text-gray-500">{formatDate(claim.timestamp / 1000)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {claim.gasless && (
                      <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-neura-cyan/10 text-neura-cyan text-xs">
                        <Sparkles className="w-3 h-3" />
                        Gasless
                      </span>
                    )}
                    <a
                      href={`${NEURA_TESTNET.explorer}/tx/${claim.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-gray-400 hover:text-neura-cyan transition-colors"
                    >
                      <span className="font-mono">{formatAddress(claim.txHash)}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};
