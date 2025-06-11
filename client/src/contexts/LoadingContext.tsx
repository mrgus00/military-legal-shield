import { createContext, useContext, useState, ReactNode } from "react";

interface LoadingState {
  isLoading: boolean;
  loadingText?: string;
  variant?: "default" | "security" | "legal" | "emergency" | "tactical";
  progress?: number;
  showProgress?: boolean;
}

interface LoadingContextType {
  loadingState: LoadingState;
  showLoading: (options?: Partial<LoadingState>) => void;
  hideLoading: () => void;
  updateProgress: (progress: number) => void;
  updateLoadingText: (text: string) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: false,
    loadingText: undefined,
    variant: "default",
    progress: 0,
    showProgress: false,
  });

  const showLoading = (options: Partial<LoadingState> = {}) => {
    setLoadingState(prev => ({
      ...prev,
      isLoading: true,
      ...options,
    }));
  };

  const hideLoading = () => {
    setLoadingState(prev => ({
      ...prev,
      isLoading: false,
      progress: 0,
    }));
  };

  const updateProgress = (progress: number) => {
    setLoadingState(prev => ({
      ...prev,
      progress: Math.min(100, Math.max(0, progress)),
    }));
  };

  const updateLoadingText = (loadingText: string) => {
    setLoadingState(prev => ({
      ...prev,
      loadingText,
    }));
  };

  return (
    <LoadingContext.Provider value={{
      loadingState,
      showLoading,
      hideLoading,
      updateProgress,
      updateLoadingText,
    }}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
}