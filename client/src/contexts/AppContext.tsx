import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Branch context for military branch selection
interface BranchContextType {
  selectedBranch: string;
  setSelectedBranch: (branch: string) => void;
}

const BranchContext = createContext<BranchContextType | undefined>(undefined);

export const useBranch = () => {
  const context = useContext(BranchContext);
  if (!context) {
    throw new Error('useBranch must be used within a BranchProvider');
  }
  return context;
};

// Loading context for global loading states
interface LoadingContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  loadingMessage?: string;
  setLoadingMessage: (message?: string) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

// Mood context for user experience personalization
interface MoodContextType {
  mood: 'urgent' | 'routine' | 'emergency';
  setMood: (mood: 'urgent' | 'routine' | 'emergency') => void;
}

const MoodContext = createContext<MoodContextType | undefined>(undefined);

export const useMood = () => {
  const context = useContext(MoodContext);
  if (!context) {
    throw new Error('useMood must be used within a MoodProvider');
  }
  return context;
};

// Combined provider component to avoid hook violations
interface AppContextProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppContextProps> = ({ children }) => {
  // Branch state
  const [selectedBranch, setSelectedBranch] = useState<string>('');

  // Loading state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string | undefined>();

  // Mood state
  const [mood, setMood] = useState<'urgent' | 'routine' | 'emergency'>('routine');

  // Initialize branch from localStorage on mount
  useEffect(() => {
    const savedBranch = localStorage.getItem('selectedBranch');
    if (savedBranch) {
      setSelectedBranch(savedBranch);
    }
  }, []);

  // Save branch to localStorage when it changes
  useEffect(() => {
    if (selectedBranch) {
      localStorage.setItem('selectedBranch', selectedBranch);
    }
  }, [selectedBranch]);

  return (
    <BranchContext.Provider value={{ selectedBranch, setSelectedBranch }}>
      <LoadingContext.Provider value={{ 
        isLoading, 
        setIsLoading, 
        loadingMessage, 
        setLoadingMessage 
      }}>
        <MoodContext.Provider value={{ mood, setMood }}>
          {children}
        </MoodContext.Provider>
      </LoadingContext.Provider>
    </BranchContext.Provider>
  );
};