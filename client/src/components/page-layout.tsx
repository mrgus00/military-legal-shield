import { ReactNode } from "react";
import EnhancedNavbar from "@/components/enhanced-navbar";
import Footer from "@/components/footer";
import MobileContainer from "@/components/mobile-container";
import LegalAssistantChatbot from "@/components/legal-assistant-chatbot";
import FloatingActionButton from "@/components/floating-action-button";
import ParticleBackground from "@/components/particle-background";

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
  showFooter?: boolean;
}

export default function PageLayout({ children, className = "", showFooter = true }: PageLayoutProps) {
  return (
    <MobileContainer>
      <div className={`min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 hw-accelerated safari-fix ${className}`}>
        <EnhancedNavbar />
        
        <main id="main-content" role="main" className="hw-accelerated">
          {children}
        </main>

        {showFooter && <Footer />}
        
        {/* Legal Assistant Chatbot - Available on all pages */}
        <LegalAssistantChatbot />
        
        {/* Floating Action Button for quick access */}
        <FloatingActionButton />
      </div>
    </MobileContainer>
  );
}