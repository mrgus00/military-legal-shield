import { ReactNode } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import MobileContainer from "@/components/mobile-container";
import LegalAssistantChatbot from "@/components/legal-assistant-chatbot";

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
  showFooter?: boolean;
}

export default function PageLayout({ children, className = "", showFooter = true }: PageLayoutProps) {
  return (
    <MobileContainer>
      <div className={`min-h-screen bg-gradient-to-br from-navy-50 to-white hw-accelerated safari-fix ${className}`}>
        <Header />
        
        <main id="main-content" role="main" className="hw-accelerated">
          {children}
        </main>

        {showFooter && <Footer />}
        
        {/* Legal Assistant Chatbot - Available on all pages */}
        <LegalAssistantChatbot />
      </div>
    </MobileContainer>
  );
}