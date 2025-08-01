import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "@/contexts/AppContext";
import GoogleAnalytics from "@/components/google-analytics";
import GoogleTagManager from "@/components/google-tag-manager";
import GoogleSearchConsole, { GoogleBusinessProfile } from "@/components/google-search-console";
import BackToTop from "@/components/back-to-top";
import LegalAssistantChatbot from "@/components/legal-assistant-chatbot";
import { FloatingWhatsAppButton } from "@/components/whatsapp-connector";
import MilitaryLoadingScreen from "@/components/military-loading-screen";
import PWAInstaller from "@/components/pwa-installer";


import { useEffect } from "react";
import { initGA } from "./lib/analytics";
import { useAnalytics } from "./hooks/use-analytics";
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
import Widgets from "@/pages/widgets";
import JargonWizard from "@/pages/jargon-wizard";
import EmergencyConsultation from "@/pages/emergency-consultation";
import ScheduleFollowUp from "@/pages/schedule-followup";
import Leaderboard from "@/pages/leaderboard";
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
import AICaseAnalysis from "@/pages/ai-case-analysis";
import LegalRoadmap from "@/pages/legal-roadmap";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import Dashboard from "@/pages/dashboard";
import PerformanceDashboard from "@/pages/PerformanceDashboard";
import SimpleCommunicationHub from "@/pages/SimpleCommunicationHub";
import SecureMessaging from "@/pages/SecureMessaging";
import MobileDashboard from "@/pages/MobileDashboard";
import EmergencyBooking from "@/pages/EmergencyBooking";
import HolographicGuidance from "@/pages/HolographicGuidance";
import MarketingDashboard from "@/pages/MarketingDashboard";

function Router() {
  // Track page views when routes change
  // useAnalytics(); // Temporarily disabled to fix hook issue
  
  return (
    <Switch>
      <Route path="/" component={() => (
        <div className="p-8 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">Welcome to Military Legal Shield</h2>
          <p className="mb-6 text-lg text-gray-600">Your comprehensive legal support platform is now active!</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <a href="/emergency-booking" className="p-4 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors">
              <h3 className="font-semibold text-red-800 mb-2">🚨 Emergency Booking</h3>
              <p className="text-sm text-red-700">One-click emergency legal consultation system</p>
            </a>
            
            <a href="/holographic-guidance" className="p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors">
              <h3 className="font-semibold text-purple-800 mb-2">✨ Holographic Assistant</h3>
              <p className="text-sm text-purple-700">AI-powered immersive legal guidance</p>
            </a>
            
            <a href="/mobile-dashboard" className="p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors">
              <h3 className="font-semibold text-blue-800 mb-2">📱 Mobile Dashboard</h3>
              <p className="text-sm text-blue-700">PWA features and mobile optimization</p>
            </a>
            
            <a href="/secure-messaging" className="p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors">
              <h3 className="font-semibold text-green-800 mb-2">🔐 Secure Messaging</h3>
              <p className="text-sm text-green-700">Signal-like encrypted communications</p>
            </a>
            
            <a href="/marketing-dashboard" className="p-4 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors">
              <h3 className="font-semibold text-orange-800 mb-2">📊 Marketing Dashboard</h3>
              <p className="text-sm text-orange-700">SEO analytics, social media tracking & referrals</p>
            </a>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Platform Status</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>✅ Emergency booking system deployed</li>
              <li>✅ Holographic legal guidance assistant active</li>
              <li>✅ Mobile PWA enhancements active</li>
              <li>✅ End-to-end encryption enabled</li>
              <li>✅ Marketing integration system deployed</li>
              <li>✅ SEO tracking and social media analytics active</li>
              <li>✅ Referral tracking and UTM campaign support active</li>
              <li>✅ Dynamic port configuration implemented</li>
              <li>✅ Context providers restored</li>
            </ul>
          </div>
        </div>
      )} />
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
      <Route path="/communication-hub" component={SimpleCommunicationHub} />
      <Route path="/secure-messaging" component={SecureMessaging} />
      <Route path="/mobile-dashboard" component={MobileDashboard} />
      <Route path="/emergency-booking" component={EmergencyBooking} />
      <Route path="/holographic-guidance" component={HolographicGuidance} />
      <Route path="/marketing-dashboard" component={MarketingDashboard} />
      <Route path="/emergency-defense" component={EmergencyDefense} />
      <Route path="/military-justice" component={MilitaryJustice} />
      <Route path="/injury-claims" component={InjuryClaims} />
      <Route path="/video-consultation/:id" component={() => 
        <VideoConsultation 
          consultationId="CONS-123" 
          attorneyName="Col. Sarah Mitchell" 
          scheduledTime="Today 3:00 PM" 
          duration={60} 
        />
      } />
      <Route path="/schedule-followup" component={ScheduleFollowUp} />
      <Route path="/leave-review" component={LeaveReview} />
      <Route path="/financial-wizard" component={FinancialWizard} />
      <Route path="/storytelling-corner" component={StorytellingCorner} />
      <Route path="/jargon-wizard" component={JargonWizard} />
      <Route path="/benefits-calculator" component={BenefitsCalculator} />
      <Route path="/benefits-eligibility" component={BenefitsEligibility} />
      <Route path="/lawyer-database" component={LawyerDatabase} />
      <Route path="/court-martial-defense" component={CourtMartialDefense} />
      <Route path="/family-law-poas" component={FamilyLawPOAs} />
      <Route path="/family-legal" component={FamilyLawPOAs} />
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
      <Route path="/leaderboard" component={Leaderboard} />
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
      <Route path="/performance-dashboard" component={PerformanceDashboard} />
      <Route path="/mobile-dashboard" component={MobileDashboard} />
      <Route path="/accessibility-audit" component={AccessibilityAudit} />
      <Route path="/google-console" component={GoogleSearchConsoleDashboard} />
      <Route path="/ai-case-analysis" component={AICaseAnalysis} />
      <Route path="/legal-roadmap" component={LegalRoadmap} />
      <Route path="/widgets" component={Widgets} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/dashboard" component={Dashboard} />
      <Route component={NotFound} />
    </Switch>
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
      <AppProvider>
        <TooltipProvider>
          <div className="min-h-screen bg-gray-50">
            <h1 className="text-2xl font-bold p-8">Military Legal Shield</h1>
            <Router />
          </div>
          <Toaster />
        </TooltipProvider>
      </AppProvider>
    </QueryClientProvider>
  );
}



export default App;
