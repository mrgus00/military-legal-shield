import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BranchProvider } from "@/contexts/BranchContext";
import { MoodProvider } from "@/contexts/MoodContext";
import { LoadingProvider } from "@/contexts/LoadingContext";
import { useEffect } from "react";
import { initGA } from "./lib/analytics";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Login from "@/pages/login";
import Signup from "@/pages/signup";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/signin" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  return (
    <>
      <Toaster />
      <Router />
    </>
  );
}

function App() {
  // Initialize Google Analytics when app loads
  useEffect(() => {
    if (!import.meta.env.VITE_GA_MEASUREMENT_ID) {
      console.warn('Missing required Google Analytics key: VITE_GA_MEASUREMENT_ID');
    } else {
      initGA();
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <LoadingProvider>
        <MoodProvider>
          <BranchProvider>
            <TooltipProvider>
              <AppContent />
            </TooltipProvider>
          </BranchProvider>
        </MoodProvider>
      </LoadingProvider>
    </QueryClientProvider>
  );
}

export default App;