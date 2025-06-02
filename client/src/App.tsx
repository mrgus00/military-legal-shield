import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BranchProvider } from "@/contexts/BranchContext";
import { MoodProvider } from "@/contexts/MoodContext";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Resources from "@/pages/resources";
import Attorneys from "@/pages/attorneys";
import Education from "@/pages/education";
import UrgentMatch from "@/pages/urgent-match";
import Pricing from "@/pages/pricing";
import CaseTracking from "@/pages/case-tracking";
import Messages from "@/pages/messages";
import Scenarios from "@/pages/scenarios";
import WeekendSafety from "@/pages/weekend-safety";
import Forum from "@/pages/forum";
import LearningDashboard from "@/pages/learning-dashboard";
import MicroChallenges from "@/pages/micro-challenges";
import TerminologyDemo from "@/pages/terminology-demo";
import HelpCenter from "@/pages/help-center";
import ContactSupport from "@/pages/contact-support";
import PrivacyPolicy from "@/pages/privacy-policy";
import TermsOfService from "@/pages/terms-of-service";
import LegalDisclaimers from "@/pages/legal-disclaimers";
import EmotionalSupport from "@/pages/emotional-support";
import VeteranServices from "@/pages/veteran-services";
import FinancialPlanning from "@/pages/financial-planning";
import CareerAssessment from "@/pages/career-assessment";
import SkillTranslation from "@/pages/skill-translation";
import NetworkingHub from "@/pages/networking-hub";
import ResumeBuilder from "@/pages/resume-builder";
import Checkout from "@/pages/checkout";
import ConsultationBooking from "@/pages/consultation-booking";
import LeaveReview from "@/pages/leave-review";
import FinancialWizard from "@/pages/financial-wizard";
import StorytellingCorner from "@/pages/storytelling-corner";

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
      <Route path="/scenarios" component={Scenarios} />
      <Route path="/weekend-safety" component={WeekendSafety} />
      <Route path="/forum" component={Forum} />
      <Route path="/learning-dashboard" component={LearningDashboard} />
      <Route path="/micro-challenges" component={MicroChallenges} />
      <Route path="/terminology-demo" component={TerminologyDemo} />
      <Route path="/help-center" component={HelpCenter} />
      <Route path="/contact-support" component={ContactSupport} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/terms-of-service" component={TermsOfService} />
      <Route path="/legal-disclaimers" component={LegalDisclaimers} />
      <Route path="/emotional-support" component={EmotionalSupport} />
      <Route path="/veteran-services" component={VeteranServices} />
      <Route path="/financial-planning" component={FinancialPlanning} />
      <Route path="/career-assessment" component={CareerAssessment} />
      <Route path="/skill-translation" component={SkillTranslation} />
      <Route path="/networking-hub" component={NetworkingHub} />
      <Route path="/resume-builder" component={ResumeBuilder} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/consultation-booking" component={ConsultationBooking} />
      <Route path="/leave-review" component={LeaveReview} />
      <Route path="/financial-wizard" component={FinancialWizard} />
      <Route path="/storytelling-corner" component={StorytellingCorner} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MoodProvider>
        <BranchProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </BranchProvider>
      </MoodProvider>
    </QueryClientProvider>
  );
}

export default App;
