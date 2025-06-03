import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBranch } from "@/contexts/BranchContext";

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const { branchTheme } = useBranch();

  // Show button when page is scrolled down
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <Button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full p-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
      style={{ 
        backgroundColor: `hsl(${branchTheme.colors.primary})`,
        borderColor: `hsl(${branchTheme.colors.primary})`
      }}
      aria-label="Back to top"
      title="Back to top"
    >
      <ArrowUp className="w-5 h-5 text-white" />
    </Button>
  );
}