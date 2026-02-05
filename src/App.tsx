import React from 'react';
import { motion } from 'framer-motion';
import { Background } from './components/Background';
import { Header } from './components/Header';
import { TabSwitcher } from './components/TabSwitcher';
import { EmployerDashboard } from './components/EmployerDashboard';
import { EmployeeDashboard } from './components/EmployeeDashboard';
import { useStore } from './store/useStore';

function App() {
  const { activeTab, isConnected } = useStore();

  return (
    <div className="min-h-screen relative">
      <Background />
      <Header />
      
      <main className="relative z-10 pt-24 sm:pt-28 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-neura-border mb-6"
            >
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm text-gray-400">Live on Neura Testnet</span>
            </motion.div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
              <span className="text-white">Gasless Payroll for</span>
              <br />
              <span className="bg-neura-gradient bg-clip-text text-transparent neon-text">
                Global Web3 Teams
              </span>
            </h1>
            
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Pay your team in $USN with zero gas fees. Employees claim their salary 
              with one click—employer covers all transaction costs.
            </p>
          </motion.div>

          {/* Tab Switcher */}
          {isConnected && <TabSwitcher />}

          {/* Dashboard Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'employer' ? (
              <EmployerDashboard />
            ) : (
              <EmployeeDashboard />
            )}
          </motion.div>

          {/* Footer */}
          <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-16 text-center"
          >
            <div className="glass-card inline-flex items-center gap-4 px-6 py-3 rounded-2xl border border-neura-border">
              <span className="text-sm text-gray-500">Powered by</span>
              <span className="text-sm font-semibold bg-neura-gradient bg-clip-text text-transparent">
                Neura Network
              </span>
              <span className="text-gray-600">•</span>
              <span className="text-sm text-gray-500">$USN Stablecoin</span>
            </div>
          </motion.footer>
        </div>
      </main>
    </div>
  );
}

export default App;
