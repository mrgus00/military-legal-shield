import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  Menu, 
  X, 
  Phone, 
  Users, 
  FileText, 
  AlertTriangle,
  Scale,
  Calculator,
  MessageSquare,
  Zap,
  ChevronDown,
  Gavel,
  BookOpen,
  Award,
  Clock,
  Heart
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function EnhancedNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.dropdown-container')) {
        setOpenDropdown(null);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navigationItems = [
    {
      name: "Legal Services",
      hasDropdown: true,
      items: [
        {
          name: "Emergency Defense",
          href: "/emergency-defense",
          icon: AlertTriangle,
          description: "24/7 urgent legal matching for critical situations"
        },
        {
          name: "Military Justice",
          href: "/military-justice",
          icon: Scale,
          description: "UCMJ expertise and court-martial defense"
        },
        {
          name: "Document Prep",
          href: "/document-prep",
          icon: FileText,
          description: "AI-powered legal document generation"
        },
        {
          name: "Injury Claims",
          href: "/injury-claims",
          icon: Heart,
          description: "VA disability and personal injury representation"
        }
      ]
    },
    {
      name: "Resources",
      hasDropdown: true,
      items: [
        {
          name: "Legal Resource Hub",
          href: "/legal-resources",
          icon: BookOpen,
          description: "Comprehensive guides, FAQs, and worldwide legal navigator"
        },
        {
          name: "Find Attorneys",
          href: "/attorneys",
          icon: Users,
          description: "Military legal experts directory"
        },
        {
          name: "Benefits Calculator",
          href: "/benefits-calculator",
          icon: Calculator,
          description: "VA benefits estimation"
        },
        {
          name: "Legal Challenges",
          href: "/legal-challenges",
          icon: Scale,
          description: "Interactive legal scenarios"
        },
        {
          name: "Video Consultation",
          href: "/video-consultation",
          icon: Phone,
          description: "Secure virtual meetings"
        },
        {
          name: "Legal Assistant",
          href: "#",
          icon: MessageSquare,
          description: "AI legal chatbot",
          onClick: () => {
            const chatButton = document.querySelector('[data-chatbot-trigger]');
            if (chatButton) (chatButton as HTMLElement).click();
          }
        }
      ]
    }
  ];

  const isActive = (path: string) => location === path;

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-white/95 backdrop-blur-lg shadow-xl border-b border-gray-200/50" 
          : "bg-transparent"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/">
              <motion.div 
                className="flex items-center gap-3 cursor-pointer group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="military-gradient w-10 h-10 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold text-navy-900 group-hover:text-blue-600 transition-colors">
                    MilitaryLegalShield
                  </h1>
                  <p className="text-xs text-gray-500">Defending Our Defenders</p>
                </div>
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navigationItems.map((item) => (
                <div 
                  key={item.name} 
                  className="relative dropdown-container"
                  onMouseEnter={() => setOpenDropdown(item.name)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <motion.div
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all cursor-pointer group ${
                      openDropdown === item.name
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setOpenDropdown(openDropdown === item.name ? null : item.name)}
                  >
                    <span className="font-medium">{item.name}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${
                      openDropdown === item.name ? "rotate-180" : ""
                    }`} />
                  </motion.div>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {openDropdown === item.name && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-[100]"
                      >
                        {item.items.map((subItem, index) => {
                          const IconComponent = subItem.icon;
                          return (
                            <motion.div
                              key={subItem.name}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                            >
                              {subItem.onClick ? (
                                <button
                                  onClick={() => {
                                    subItem.onClick();
                                    setOpenDropdown(null);
                                  }}
                                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-blue-50 transition-colors"
                                >
                                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                                    <IconComponent className="w-4 h-4 text-blue-600" />
                                  </div>
                                  <div>
                                    <div className="font-medium text-gray-900">{subItem.name}</div>
                                    <div className="text-sm text-gray-500">{subItem.description}</div>
                                  </div>
                                </button>
                              ) : (
                                <Link href={subItem.href}>
                                  <div 
                                    className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors"
                                    onClick={() => setOpenDropdown(null)}
                                  >
                                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                                      <IconComponent className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <div>
                                      <div className="font-medium text-gray-900">{subItem.name}</div>
                                      <div className="text-sm text-gray-500">{subItem.description}</div>
                                    </div>
                                  </div>
                                </Link>
                              )}
                            </motion.div>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Link href="/emergency-consultation">
                <Button className="emergency-gradient text-white px-4 py-2 rounded-lg hover:shadow-lg transform transition hover:scale-105">
                  <Zap className="w-4 h-4 mr-2" />
                  Emergency
                </Button>
              </Link>
              <Link href="/loading-demo">
                <Button variant="outline" className="border-blue-300 text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg">
                  Demo
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden p-2"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white/95 backdrop-blur-lg border-t border-gray-200"
            >
              <div className="px-4 py-6 space-y-4">
                {navigationItems.map((category, categoryIndex) => (
                  <motion.div
                    key={category.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: categoryIndex * 0.1 }}
                    className="space-y-2"
                  >
                    {/* Category Header */}
                    <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide px-3">
                      {category.name}
                    </div>
                    
                    {/* Category Items */}
                    {category.items.map((item, itemIndex) => {
                      const IconComponent = item.icon;
                      return (
                        <motion.div
                          key={item.name}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: (categoryIndex * 0.1) + (itemIndex * 0.05) }}
                        >
                          {item.onClick ? (
                            <button
                              onClick={() => {
                                item.onClick();
                                setIsOpen(false);
                              }}
                              className="w-full flex items-center gap-3 p-3 rounded-xl transition-all text-gray-700 hover:bg-gray-100"
                            >
                              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                <IconComponent className="w-5 h-5" />
                              </div>
                              <div className="text-left">
                                <div className="font-medium">{item.name}</div>
                                <div className="text-sm text-gray-500">{item.description}</div>
                              </div>
                            </button>
                          ) : (
                            <Link href={item.href}>
                              <div 
                                className={`flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer ${
                                  isActive(item.href)
                                    ? "bg-blue-100 text-blue-700"
                                    : "text-gray-700 hover:bg-gray-100"
                                }`}
                                onClick={() => setIsOpen(false)}
                              >
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                  isActive(item.href) ? "bg-blue-200" : "bg-gray-100"
                                }`}>
                                  <IconComponent className="w-5 h-5" />
                                </div>
                                <div>
                                  <div className="font-medium">{item.name}</div>
                                  <div className="text-sm text-gray-500">{item.description}</div>
                                </div>
                              </div>
                            </Link>
                          )}
                        </motion.div>
                      );
                    })}
                  </motion.div>
                ))}

                {/* Mobile CTA Buttons */}
                <div className="pt-4 border-t border-gray-200 space-y-3">
                  <Link href="/emergency-consultation">
                    <Button className="w-full emergency-gradient text-white py-3 rounded-xl">
                      <AlertTriangle className="w-5 h-5 mr-2" />
                      Emergency Consultation
                    </Button>
                  </Link>
                  <Link href="/loading-demo">
                    <Button variant="outline" className="w-full border-blue-300 text-blue-600 py-3 rounded-xl">
                      <Shield className="w-5 h-5 mr-2" />
                      View Demo
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Spacer for fixed navbar */}
      <div className="h-16"></div>
    </>
  );
}