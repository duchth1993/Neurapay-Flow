import { create } from 'zustand';

export interface Employee {
  wallet: string;
  weeklySalary: string;
  lastClaimTime: number;
  isActive: boolean;
  totalClaimed: string;
  nextClaimTime: number;
  canClaim: boolean;
}

export interface ClaimHistory {
  id: string;
  amount: string;
  timestamp: number;
  txHash: string;
  gasless: boolean;
}

interface AppState {
  // Wallet state
  isConnected: boolean;
  address: string | null;
  chainId: number | null;
  balance: string;
  usnBalance: string;
  
  // Role state
  isEmployer: boolean;
  isEmployee: boolean;
  
  // Employer data
  employees: Employee[];
  treasuryBalance: string;
  
  // Employee data
  employeeData: Employee | null;
  claimHistory: ClaimHistory[];
  
  // UI state
  isLoading: boolean;
  activeTab: 'employer' | 'employee';
  
  // Actions
  setConnected: (connected: boolean) => void;
  setAddress: (address: string | null) => void;
  setChainId: (chainId: number | null) => void;
  setBalance: (balance: string) => void;
  setUsnBalance: (balance: string) => void;
  setIsEmployer: (isEmployer: boolean) => void;
  setIsEmployee: (isEmployee: boolean) => void;
  setEmployees: (employees: Employee[]) => void;
  setTreasuryBalance: (balance: string) => void;
  setEmployeeData: (data: Employee | null) => void;
  setClaimHistory: (history: ClaimHistory[]) => void;
  setIsLoading: (loading: boolean) => void;
  setActiveTab: (tab: 'employer' | 'employee') => void;
  reset: () => void;
}

const initialState = {
  isConnected: false,
  address: null,
  chainId: null,
  balance: '0',
  usnBalance: '0',
  isEmployer: false,
  isEmployee: false,
  employees: [],
  treasuryBalance: '0',
  employeeData: null,
  claimHistory: [],
  isLoading: false,
  activeTab: 'employer' as const,
};

export const useStore = create<AppState>((set) => ({
  ...initialState,
  
  setConnected: (connected) => set({ isConnected: connected }),
  setAddress: (address) => set({ address }),
  setChainId: (chainId) => set({ chainId }),
  setBalance: (balance) => set({ balance }),
  setUsnBalance: (balance) => set({ usnBalance: balance }),
  setIsEmployer: (isEmployer) => set({ isEmployer }),
  setIsEmployee: (isEmployee) => set({ isEmployee }),
  setEmployees: (employees) => set({ employees }),
  setTreasuryBalance: (balance) => set({ treasuryBalance: balance }),
  setEmployeeData: (data) => set({ employeeData: data }),
  setClaimHistory: (history) => set({ claimHistory: history }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  reset: () => set(initialState),
}));
