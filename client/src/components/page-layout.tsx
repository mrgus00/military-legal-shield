import { ReactNode } from "react";
import HeaderLegalShield from "@/components/header-legalshield";
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
      <div className={`min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 hw-accelerated safari-fix relative overflow-hidden w-full max-w-full ${className}`}>
        {/* Dynamic particle background */}
        <ParticleBackground 
          density={30} 
          speed={0.3} 
          colors={['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b']}
          className="opacity-30"
        />
        
        <div className="relative z-10 w-full max-w-full overflow-hidden">
          <HeaderLegalShield />
          
          <main id="main-content" role="main" className="hw-accelerated w-full max-w-full overflow-hidden">
            {children}
          </main>

          {showFooter && <Footer />}
          
          {/* Legal Assistant Chatbot - Available on all pages */}
          <LegalAssistantChatbot />
          
          {/* Floating Action Button for quick access */}
          <FloatingActionButton />
        </div>
      </div>
    </MobileContainer>
  );
}