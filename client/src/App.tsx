import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BranchProvider } from "@/contexts/BranchContext";
import { MoodProvider } from "@/contexts/MoodContext";
import { LoadingProvider } from "@/contexts/LoadingContext";
import GoogleAnalytics from "@/components/google-analytics";
import GoogleTagManager from "@/components/google-tag-manager";
import GoogleSearchConsole, { GoogleBusinessProfile } from "@/components/google-search-console";
import BackToTop from "@/components/back-to-top";
import LegalAssistantChatbot from "@/components/legal-assistant-chatbot";
import { FloatingWhatsAppButton } from "@/components/whatsapp-connector";
import MilitaryLoadingScreen from "@/components/military-loading-screen";
import { useLoading } from "@/contexts/LoadingContext";
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
import VideoConsultation from "@/pages/video-consultation";
import BenefitsCalculator from "@/pages/benefits-calculator";
import BenefitsEligibility from "@/pages/benefits-eligibility";
import LawyerDatabase from "@/pages/lawyer-database-simple";
import CourtMartialDefense from "@/pages/court-martial-defense";
import FamilyLawPOAs from "@/pages/family-law-poas";
import UCMJSupport from "@/pages/ucmj-support";
import VABenefitsClaims from "@/pages/va-benefits-claims";
import LegalDocuments from "@/pages/legal-documents";
import CommunityForum from "@/pages/community-forum";
import ForumCategory from "@/pages/forum-category";
import ForumTopic from "@/pages/forum-topic";
import EducationCenter from "@/pages/education-center";
import WhatsAppSupport from "@/pages/whatsapp-support";
import DocumentGenerator from "@/pages/document-generator";
import DocumentPrep from "@/pages/document-prep";
import EmergencyConsultation from "@/pages/emergency-consultation";
import EmergencyDefense from "@/pages/emergency-defense";
import MobileLanding from "@/pages/mobile-landing";
import MobileTestDashboard from "@/components/mobile-test-dashboard";
import LegalResources from "@/pages/legal-resources";
import MilitaryJustice from "@/pages/military-justice";
import InjuryClaims from "@/pages/injury-claims";
import LegalChallengesBasic from "@/pages/legal-challenges-basic";
import LegalChallenges from "@/pages/legal-challenges";
import LoadingDemoPage from "@/pages/loading-demo";
import FindAttorneys from "@/pages/find-attorneys";
import SubscriptionSuccess from "@/pages/subscription-success";
import SMSCenter from "@/pages/sms-center";
import CDNDashboard from "@/pages/cdn-dashboard";
import AccessibilityAudit from "@/pages/accessibility-audit";
import GoogleSearchConsoleDashboard from "@/pages/google-search-console-dashboard";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/urgent-match" component={UrgentMatch} />
      <Route path="/messages" component={Messages} />
      <Route path="/case-tracking" component={CaseTracking} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/subscription-success" component={SubscriptionSuccess} />
      <Route path="/resources" component={Resources} />
      <Route path="/attorneys" component={FindAttorneys} />
      <Route path="/find-attorneys" component={FindAttorneys} />
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
      <Route path="/emergency-consultation" component={EmergencyConsultation} />
      <Route path="/emergency-defense" component={EmergencyDefense} />
      <Route path="/military-justice" component={MilitaryJustice} />
      <Route path="/injury-claims" component={InjuryClaims} />
      <Route path="/video-consultation" component={VideoConsultation} />
      <Route path="/leave-review" component={LeaveReview} />
      <Route path="/financial-wizard" component={FinancialWizard} />
      <Route path="/storytelling-corner" component={StorytellingCorner} />
      <Route path="/benefits-calculator" component={BenefitsCalculator} />
      <Route path="/benefits-eligibility" component={BenefitsEligibility} />
      <Route path="/lawyer-database" component={LawyerDatabase} />
      <Route path="/court-martial-defense" component={CourtMartialDefense} />
      <Route path="/family-law-poas" component={FamilyLawPOAs} />
      <Route path="/ucmj-support" component={UCMJSupport} />
      <Route path="/va-benefits-claims" component={VABenefitsClaims} />
      <Route path="/legal-documents" component={LegalDocuments} />
      <Route path="/help-center" component={HelpCenter} />
      <Route path="/community-forum" component={CommunityForum} />
      <Route path="/forum/category/:category" component={ForumCategory} />
      <Route path="/forum/topic/:topicId" component={ForumTopic} />
      <Route path="/forum/new-topic" component={CommunityForum} />
      <Route path="/forum/all-topics" component={CommunityForum} />
      <Route path="/forum/guidelines" component={CommunityForum} />
      <Route path="/forum/expert/:expertName" component={CommunityForum} />
      <Route path="/forum/register" component={CommunityForum} />
      <Route path="/contact-support" component={ContactSupport} />
      <Route path="/whatsapp-support" component={WhatsAppSupport} />
      <Route path="/chat-support" component={ContactSupport} />
      <Route path="/video-consultation" component={ConsultationBooking} />
      <Route path="/legal-challenges" component={LegalChallenges} />
      <Route path="/education-center" component={EducationCenter} />
      <Route path="/document-wizard" component={DocumentGenerator} />
      <Route path="/document-generator" component={DocumentPrep} />
      <Route path="/document-prep" component={DocumentPrep} />
      <Route path="/legal-resources" component={LegalResources} />
      <Route path="/legal-challenges" component={LegalChallenges} />
      <Route path="/mobile" component={MobileLanding} />
      <Route path="/mobile-test" component={MobileTestDashboard} />
      <Route path="/loading-demo" component={LoadingDemoPage} />
      <Route path="/sms-center" component={SMSCenter} />
      <Route path="/cdn-dashboard" component={CDNDashboard} />
      <Route path="/accessibility-audit" component={AccessibilityAudit} />
      <Route path="/google-console" component={GoogleSearchConsoleDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LoadingProvider>
        <MoodProvider>
          <BranchProvider>
            <TooltipProvider>
              <GoogleAnalytics />
              <GoogleTagManager />
              <GoogleSearchConsole />
              <GoogleBusinessProfile />
              <Toaster />
              <Router />
              <BackToTop />
              <LegalAssistantChatbot />
              <FloatingWhatsAppButton />
              <AppLoadingScreen />
            </TooltipProvider>
          </BranchProvider>
        </MoodProvider>
      </LoadingProvider>
    </QueryClientProvider>
  );
}

function AppLoadingScreen() {
  const { loadingState } = useLoading();
  
  return (
    <MilitaryLoadingScreen 
      isLoading={loadingState.isLoading}
      loadingText={loadingState.loadingText}
      variant={loadingState.variant}
      progress={loadingState.progress}
      showProgress={loadingState.showProgress}
    />
  );
}

export default App;
