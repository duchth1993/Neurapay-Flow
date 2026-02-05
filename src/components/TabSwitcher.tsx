import React from 'react';
import { motion } from 'framer-motion';
import { Building2, User } from 'lucide-react';
import { useStore } from '../store/useStore';

export const TabSwitcher: React.FC = () => {
  const { activeTab, setActiveTab, isEmployer, isEmployee } = useStore();

  const tabs = [
    { id: 'employer' as const, label: 'Employer', icon: Building2, enabled: isEmployer },
    { id: 'employee' as const, label: 'Employee', icon: User, enabled: isEmployee },
  ];

  return (
    <div className="flex justify-center mb-8">
      <div className="inline-flex p-1.5 rounded-2xl glass-card border border-neura-border">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => tab.enabled && setActiveTab(tab.id)}
            disabled={!tab.enabled}
            className={`relative flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-colors ${
              !tab.enabled 
                ? 'opacity-40 cursor-not-allowed' 
                : activeTab === tab.id 
                  ? 'text-white' 
                  : 'text-gray-400 hover:text-white'
            }`}
            whileHover={tab.enabled ? { scale: 1.02 } : {}}
            whileTap={tab.enabled ? { scale: 0.98 } : {}}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-neura-gradient rounded-xl"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};
