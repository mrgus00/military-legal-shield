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
import Dashboard from "@/pages/dashboard";
import Attorneys from "@/pages/attorneys";
import FindAttorneys from "@/pages/find-attorneys";
import EmergencyConsultation from "@/pages/emergency-consultation";
import DocumentGenerator from "@/pages/document-generator";
import LegalResources from "@/pages/legal-resources";
import BenefitsCalculator from "@/pages/benefits-calculator";
import CareerAssessment from "@/pages/career-assessment";
import Pricing from "@/pages/pricing";
import ContactSupport from "@/pages/contact-support";
import HelpCenter from "@/pages/help-center";
import Forum from "@/pages/forum";
import CommunityForum from "@/pages/community-forum";
import EducationCenter from "@/pages/education-center";
import LegalChallenges from "@/pages/legal-challenges";
import ConsultationBooking from "@/pages/consultation-booking";
import CaseTracking from "@/pages/case-tracking";
import PrivacyPolicy from "@/pages/privacy-policy";
import TermsOfService from "@/pages/terms-of-service";
import LegalDisclamers from "@/pages/legal-disclaimers";
import VaBenefitsClaims from "@/pages/va-benefits-claims";
import VeteranServices from "@/pages/veteran-services";
import CourtMartialDefense from "@/pages/court-martial-defense";
import MilitaryJustice from "@/pages/military-justice";
import UcmjSupport from "@/pages/ucmj-support";
import EmergencyDefense from "@/pages/emergency-defense";
import InjuryClaims from "@/pages/injury-claims";
import FinancialPlanning from "@/pages/financial-planning";
import SkillTranslation from "@/pages/skill-translation";
import ResumeBuilder from "@/pages/resume-builder";
import LegalRoadmap from "@/pages/legal-roadmap";
import DocumentPrep from "@/pages/document-prep";
import ChatSupport from "@/pages/chat-support";
import VideoConsultationPage from "@/pages/video-consultation";
import Resources from "@/pages/resources";
import Scenarios from "@/pages/scenarios";
import MicroChallenges from "@/pages/micro-challenges";
import StorytellingCorner from "@/pages/storytelling-corner";
import Leaderboard from "@/pages/leaderboard";
import Analytics from "@/pages/analytics";
import Checkout from "@/pages/checkout";
import SubscriptionSuccess from "@/pages/subscription-success";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/signin" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/attorneys" component={Attorneys} />
      <Route path="/find-attorneys" component={FindAttorneys} />
      <Route path="/emergency-consultation" component={EmergencyConsultation} />
      <Route path="/emergency" component={EmergencyConsultation} />
      <Route path="/document-generator" component={DocumentGenerator} />
      <Route path="/documents" component={DocumentGenerator} />
      <Route path="/legal-resources" component={LegalResources} />
      <Route path="/resources" component={Resources} />
      <Route path="/benefits-calculator" component={BenefitsCalculator} />
      <Route path="/benefits" component={BenefitsCalculator} />
      <Route path="/career-assessment" component={CareerAssessment} />
      <Route path="/career" component={CareerAssessment} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/contact" component={ContactSupport} />
      <Route path="/contact-support" component={ContactSupport} />
      <Route path="/help" component={HelpCenter} />
      <Route path="/help-center" component={HelpCenter} />
      <Route path="/forum" component={Forum} />
      <Route path="/community" component={CommunityForum} />
      <Route path="/community-forum" component={CommunityForum} />
      <Route path="/education" component={EducationCenter} />
      <Route path="/education-center" component={EducationCenter} />
      <Route path="/challenges" component={LegalChallenges} />
      <Route path="/legal-challenges" component={LegalChallenges} />
      <Route path="/consultation" component={ConsultationBooking} />
      <Route path="/consultation-booking" component={ConsultationBooking} />
      <Route path="/case-tracking" component={CaseTracking} />
      <Route path="/cases" component={CaseTracking} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/privacy" component={PrivacyPolicy} />
      <Route path="/terms-of-service" component={TermsOfService} />
      <Route path="/terms" component={TermsOfService} />
      <Route path="/legal-disclaimers" component={LegalDisclamers} />
      <Route path="/disclaimers" component={LegalDisclamers} />
      <Route path="/va-benefits" component={VaBenefitsClaims} />
      <Route path="/va-benefits-claims" component={VaBenefitsClaims} />
      <Route path="/veteran-services" component={VeteranServices} />
      <Route path="/veterans" component={VeteranServices} />
      <Route path="/court-martial" component={CourtMartialDefense} />
      <Route path="/court-martial-defense" component={CourtMartialDefense} />
      <Route path="/military-justice" component={MilitaryJustice} />
      <Route path="/ucmj" component={UcmjSupport} />
      <Route path="/ucmj-support" component={UcmjSupport} />
      <Route path="/emergency-defense" component={EmergencyDefense} />
      <Route path="/injury-claims" component={InjuryClaims} />
      <Route path="/financial-planning" component={FinancialPlanning} />
      <Route path="/financial" component={FinancialPlanning} />
      <Route path="/skill-translation" component={SkillTranslation} />
      <Route path="/skills" component={SkillTranslation} />
      <Route path="/resume-builder" component={ResumeBuilder} />
      <Route path="/resume" component={ResumeBuilder} />
      <Route path="/legal-roadmap" component={LegalRoadmap} />
      <Route path="/roadmap" component={LegalRoadmap} />
      <Route path="/document-prep" component={DocumentPrep} />
      <Route path="/chat-support" component={ChatSupport} />
      <Route path="/chat" component={ChatSupport} />
      <Route path="/video-consultation" component={VideoConsultationPage} />
      <Route path="/video" component={VideoConsultationPage} />
      <Route path="/scenarios" component={Scenarios} />
      <Route path="/micro-challenges" component={MicroChallenges} />
      <Route path="/micro" component={MicroChallenges} />
      <Route path="/storytelling" component={StorytellingCorner} />
      <Route path="/storytelling-corner" component={StorytellingCorner} />
      <Route path="/leaderboard" component={Leaderboard} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/subscription-success" component={SubscriptionSuccess} />
      <Route path="/success" component={SubscriptionSuccess} />
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