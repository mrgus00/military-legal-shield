import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BranchTheme, getBranchTheme, applyBranchTheme, getCurrentBranch } from '@/lib/branchThemes';

interface BranchContextType {
  selectedBranch: string;
  branchTheme: BranchTheme;
  setBranch: (branchId: string) => void;
  getTerminology: (key: keyof BranchTheme['terminology']) => string;
  getRanks: (type: 'enlisted' | 'officers' | 'warrantOfficers') => Array<{payGrade: string; rank: string; abbreviation: string}>;
  getMotto: () => string;
  getValues: () => string[];
}

const BranchContext = createContext<BranchContextType | undefined>(undefined);

export function BranchProvider({ children }: { children: ReactNode }) {
  const [selectedBranch, setSelectedBranch] = useState<string>('army');
  const [branchTheme, setBranchTheme] = useState<BranchTheme>(getBranchTheme('army'));

  const setBranch = (branchId: string) => {
    setSelectedBranch(branchId);
    const theme = getBranchTheme(branchId);
    setBranchTheme(theme);
    applyBranchTheme(branchId);
  };

  const getTerminology = (key: keyof BranchTheme['terminology']): string => {
    return branchTheme.terminology[key];
  };

  const getRanks = (type: 'enlisted' | 'officers' | 'warrantOfficers'): Array<{payGrade: string; rank: string; abbreviation: string}> => {
    if (type === 'warrantOfficers' && branchTheme.ranks.warrantOfficers) {
      return branchTheme.ranks.warrantOfficers;
    }
    return branchTheme.ranks[type as 'enlisted' | 'officers'];
  };

  const getMotto = (): string => {
    return branchTheme.motto;
  };

  const getValues = (): string[] => {
    return branchTheme.culture.values;
  };

  useEffect(() => {
    // Initialize from localStorage after component mounts
    const savedBranch = getCurrentBranch();
    if (savedBranch !== selectedBranch) {
      setSelectedBranch(savedBranch);
      setBranchTheme(getBranchTheme(savedBranch));
    }
    
    // Apply initial theme
    applyBranchTheme(selectedBranch);

    // Listen for branch theme changes from other components
    const handleBranchChange = (event: CustomEvent) => {
      setSelectedBranch(event.detail.branchId);
      setBranchTheme(event.detail.theme);
    };

    window.addEventListener('branchThemeChanged', handleBranchChange as EventListener);
    
    return () => {
      window.removeEventListener('branchThemeChanged', handleBranchChange as EventListener);
    };
  }, [selectedBranch]);

  return (
    <BranchContext.Provider value={{
      selectedBranch,
      branchTheme,
      setBranch,
      getTerminology,
      getRanks,
      getMotto,
      getValues
    }}>
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