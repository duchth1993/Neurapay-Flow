import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, Zap, ChevronDown, ExternalLink, Copy, Check } from 'lucide-react';
import { useStore } from '../store/useStore';
import { formatAddress, NEURA_TESTNET } from '../utils/mockData';

export const Header: React.FC = () => {
  const { 
    isConnected, 
    address, 
    balance, 
    usnBalance,
    setConnected, 
    setAddress, 
    setBalance,
    setUsnBalance,
    setIsEmployer,
    setIsEmployee,
    reset 
  } = useStore();
  
  const [showDropdown, setShowDropdown] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [isConnecting, setIsConnecting] = React.useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    
    // Simulate wallet connection
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockAddress = '0x742d35Cc6634C0532925a3b844Bc9e7595f8fE21';
    setAddress(mockAddress);
    setBalance('1.234');
    setUsnBalance('5000.00');
    setConnected(true);
    setIsEmployer(true);
    setIsEmployee(true);
    setIsConnecting(false);
  };

  const handleDisconnect = () => {
    reset();
    setShowDropdown(false);
  };

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="glass-card border-b border-neura-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <motion.div 
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="relative">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-neura-gradient flex items-center justify-center neon-glow">
                  <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-neura-dark" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold bg-neura-gradient bg-clip-text text-transparent">
                  NeuraPay Flow
                </h1>
                <p className="text-[10px] sm:text-xs text-gray-500 font-mono">Gasless Payroll</p>
              </div>
            </motion.div>

            {/* Network Badge */}
            <motion.div 
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-neura-card border border-neura-border"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-gray-400">{NEURA_TESTNET.name}</span>
            </motion.div>

            {/* Wallet Connection */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {!isConnected ? (
                <motion.button
                  onClick={handleConnect}
                  disabled={isConnecting}
                  className="relative group px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-neura-gradient font-semibold text-sm sm:text-base overflow-hidden disabled:opacity-70"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {isConnecting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span className="hidden sm:inline">Connecting...</span>
                      </>
                    ) : (
                      <>
                        <Wallet className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="hidden sm:inline">Connect Wallet</span>
                        <span className="sm:hidden">Connect</span>
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-neura-gradient-hover opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.button>
              ) : (
                <div className="relative">
                  <motion.button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl glass-card border border-neura-border hover:border-neura-cyan/50 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="w-8 h-8 rounded-lg bg-neura-gradient flex items-center justify-center">
                      <Wallet className="w-4 h-4 text-white" />
                    </div>
                    <div className="hidden sm:block text-left">
                      <p className="text-sm font-medium text-white">{formatAddress(address!)}</p>
                      <p className="text-xs text-gray-500">{usnBalance} $USN</p>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                  </motion.button>

                  {/* Dropdown */}
                  {showDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-64 rounded-xl glass-card border border-neura-border overflow-hidden"
                    >
                      <div className="p-4 border-b border-neura-border">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-gray-500">Wallet Address</span>
                          <button
                            onClick={copyAddress}
                            className="text-neura-cyan hover:text-neura-cyan/80 transition-colors"
                          >
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                        <p className="font-mono text-sm text-white">{formatAddress(address!)}</p>
                      </div>
                      
                      <div className="p-4 space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-400">NEURA Balance</span>
                          <span className="text-sm font-medium text-white">{balance} NEURA</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-400">$USN Balance</span>
                          <span className="text-sm font-medium text-neura-cyan">{usnBalance} $USN</span>
                        </div>
                      </div>

                      <div className="p-2 border-t border-neura-border">
                        <a
                          href={`${NEURA_TESTNET.explorer}/address/${address}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-sm text-gray-400 hover:text-white"
                        >
                          <ExternalLink className="w-4 h-4" />
                          View on Explorer
                        </a>
                        <button
                          onClick={handleDisconnect}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-500/10 transition-colors text-sm text-red-400 hover:text-red-300"
                        >
                          <Wallet className="w-4 h-4" />
                          Disconnect
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </header>
  );
};
