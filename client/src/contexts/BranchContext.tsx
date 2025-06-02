import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BranchConfig, getBranchConfig, getDefaultBranch } from '@/lib/branchContext';

interface BranchContextType {
  selectedBranch: string;
  branchConfig: BranchConfig;
  setSelectedBranch: (branchId: string) => void;
  isPersonalized: boolean;
}

const BranchContext = createContext<BranchContextType | undefined>(undefined);

interface BranchProviderProps {
  children: ReactNode;
}

export function BranchProvider({ children }: BranchProviderProps) {
  const [selectedBranch, setSelectedBranchState] = useState<string>(() => {
    // Load from localStorage or use default
    if (typeof window !== 'undefined') {
      return localStorage.getItem('selectedBranch') || getDefaultBranch();
    }
    return getDefaultBranch();
  });

  const [branchConfig, setBranchConfig] = useState<BranchConfig>(() => 
    getBranchConfig(selectedBranch)
  );

  const [isPersonalized, setIsPersonalized] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('branchPersonalized') === 'true';
    }
    return false;
  });

  const setSelectedBranch = (branchId: string) => {
    setSelectedBranchState(branchId);
    setBranchConfig(getBranchConfig(branchId));
    setIsPersonalized(true);
    
    // Persist to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedBranch', branchId);
      localStorage.setItem('branchPersonalized', 'true');
    }
  };

  useEffect(() => {
    // Update branch config when selected branch changes
    setBranchConfig(getBranchConfig(selectedBranch));
  }, [selectedBranch]);

  const value: BranchContextType = {
    selectedBranch,
    branchConfig,
    setSelectedBranch,
    isPersonalized
  };

  return (
    <BranchContext.Provider value={value}>
      {children}
    </BranchContext.Provider>
  );
}

export function useBranch(): BranchContextType {
  const context = useContext(BranchContext);
  if (context === undefined) {
    throw new Error('useBranch must be used within a BranchProvider');
  }
  return context;
}

// Hook for getting branch-specific terminology
export function useBranchTerminology() {
  const { branchConfig } = useBranch();
  return branchConfig.terminology;
}

// Hook for getting branch-specific ranks
export function useBranchRanks() {
  const { branchConfig } = useBranch();
  return branchConfig.ranks;
}

// Hook for getting branch-specific culture
export function useBranchCulture() {
  const { branchConfig } = useBranch();
  return branchConfig.culture;
}

// Hook for getting branch-specific colors
export function useBranchColors() {
  const { branchConfig } = useBranch();
  return branchConfig.colors;
}