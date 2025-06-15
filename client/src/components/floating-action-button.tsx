import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  Phone, 
  MessageSquare, 
  AlertTriangle,
  Plus,
  X,
  Shield,
  Users,
  FileText
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show/hide based on scroll direction
      if (currentScrollY < lastScrollY || currentScrollY < 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
        setIsOpen(false); // Close menu when hiding
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const actionItems = [
    {
      name: "Emergency",
      href: "/emergency-consultation",
      icon: AlertTriangle,
      color: "bg-red-500 hover:bg-red-600",
      description: "Urgent legal help"
    },
    {
      name: "Chat",
      href: "#",
      icon: MessageSquare,
      color: "bg-blue-500 hover:bg-blue-600",
      description: "Legal assistant",
      onClick: () => {
        // Trigger chatbot opening
        const chatButton = document.querySelector('[data-chatbot-trigger]');
        if (chatButton) {
          (chatButton as HTMLElement).click();
        }
      }
    },
    {
      name: "Attorneys",
      href: "/attorneys",
      icon: Users,
      color: "bg-green-500 hover:bg-green-600",
      description: "Find lawyers"
    },
    {
      name: "Documents",
      href: "/document-prep",
      icon: FileText,
      color: "bg-purple-500 hover:bg-purple-600",
      description: "Legal documents"
    }
  ];

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute bottom-16 right-0 space-y-3"
          >
            {actionItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: 20, y: 10 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  exit={{ opacity: 0, x: 20, y: 10 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="bg-white px-3 py-2 rounded-lg shadow-lg text-sm font-medium text-gray-700 whitespace-nowrap">
                    {item.description}
                  </div>
                  {item.onClick ? (
                    <button
                      onClick={() => {
                        item.onClick();
                        setIsOpen(false);
                      }}
                      aria-label={`${item.name} - ${item.description}`}
                      title={item.description}
                      className={`w-12 h-12 rounded-full ${item.color} text-white shadow-lg hover:shadow-xl transform transition hover:scale-110 flex items-center justify-center`}
                    >
                      <IconComponent className="w-6 h-6" aria-hidden="true" />
                      <span className="sr-only">{item.name}</span>
                    </button>
                  ) : (
                    <Link href={item.href}>
                      <button
                        onClick={() => setIsOpen(false)}
                        aria-label={`${item.name} - ${item.description}`}
                        title={item.description}
                        className={`w-12 h-12 rounded-full ${item.color} text-white shadow-lg hover:shadow-xl transform transition hover:scale-110 flex items-center justify-center`}
                      >
                        <IconComponent className="w-6 h-6" aria-hidden="true" />
                        <span className="sr-only">{item.name}</span>
                      </button>
                    </Link>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main FAB */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close quick actions menu" : "Open quick actions menu - Emergency, Chat, Attorneys, Documents"}
        aria-expanded={isOpen}
        title="Quick Actions Menu"
        className="w-14 h-14 military-gradient rounded-full shadow-lg hover:shadow-xl text-white flex items-center justify-center transform transition hover:scale-110 animate-military-pulse"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {isOpen ? (
            <X className="w-6 h-6" aria-hidden="true" />
          ) : (
            <Plus className="w-6 h-6" aria-hidden="true" />
          )}
        </motion.div>
        <span className="sr-only">
          {isOpen ? "Close menu" : "Open quick actions"}
        </span>
      </motion.button>
    </div>
  );
}