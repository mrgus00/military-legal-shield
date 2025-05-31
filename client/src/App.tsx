import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Resources from "@/pages/resources";
import Attorneys from "@/pages/attorneys";
import Education from "@/pages/education";
import UrgentMatch from "@/pages/urgent-match";
import Pricing from "@/pages/pricing";
import CaseTracking from "@/pages/case-tracking";
import Messages from "@/pages/messages";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/urgent-match" component={UrgentMatch} />
      <Route path="/messages" component={Messages} />
      <Route path="/case-tracking" component={CaseTracking} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/resources" component={Resources} />
      <Route path="/attorneys" component={Attorneys} />
      <Route path="/education" component={Education} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
