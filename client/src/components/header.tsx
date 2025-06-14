import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { Menu, ChevronDown, User, LogOut, Home, Shield, Scale, BookOpen, Users, Phone, Award, Mail } from "lucide-react";
import { Link, useLocation } from "wouter";
import Logo from "@/components/logo";
import GlobalSearch from "@/components/global-search";
import { useAuth } from "@/hooks/useAuth";
import { formatEmergencyContact, mobileButtonClasses, trackMobileInteraction } from "@/lib/mobile-optimization";

interface MenuItem {
  name: string;
  href: string;
  badge?: string;
  icon?: any;
}

export default function Header() {
  const [location] = useLocation();
  const { isAuthenticated, user, isLoading } = useAuth();
  
  // Emergency contact links
  const emergencyContact = formatEmergencyContact();

  const menuItems: MenuItem[] = [
    { name: "Home", href: "/", icon: Home },
    { name: "Emergency Consultation", href: "/urgent-match", badge: "24/7", icon: Shield },
    { name: "One-Click Emergency Booking", href: "/emergency-consultation", badge: "NEW", icon: Phone },
    { name: "Find Attorneys", href: "/attorneys", icon: Scale },
    { name: "Book Consultation", href: "/consultation-booking", icon: Phone },
    { name: "Video Consultation", href: "/video-consultation", icon: Users },
    { name: "Case Tracking", href: "/case-tracking", icon: BookOpen },
    { name: "Benefits Calculator", href: "/benefits-calculator", badge: "Real-time", icon: Users },
    { name: "Legal Resources", href: "/resources", icon: BookOpen },
    { name: "Document Generator", href: "/document-generator", badge: "AI", icon: BookOpen },
    { name: "Education Center", href: "/education", icon: BookOpen },
    { name: "AI Scenarios", href: "/scenarios", badge: "Interactive", icon: BookOpen },
    { name: "Learning Dashboard", href: "/learning-dashboard", icon: BookOpen },
    { name: "Micro Challenges", href: "/micro-challenges", badge: "Daily", icon: BookOpen },
    { name: "Weekend Safety", href: "/weekend-safety", icon: Shield },
    { name: "Career Assessment", href: "/career-assessment", badge: "AI", icon: Users },
    { name: "Veteran Services", href: "/veteran-services", icon: Users },
    { name: "Financial Planning", href: "/financial-planning", icon: Users },
    { name: "Forum", href: "/forum", badge: "Active", icon: Users },
    { name: "Veterans Stories", href: "/storytelling-corner", icon: BookOpen },
    { name: "Pricing", href: "/pricing", icon: Scale },
  ];

  const isActive = (href: string) => {
    if (href === "/" && location === "/") return true;
    if (href !== "/" && location.startsWith(href)) return true;
    return location === href;
  };

  return (
    <>
      {/* Skip to main content link for screen readers */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-navy-800 text-white px-4 py-2 rounded">
        Skip to main content
      </a>
      
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50 w-full overflow-hidden">
        <div className="w-full max-w-full mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex justify-between items-center h-14 sm:h-16">
            
            {/* Logo */}
            <div className="flex items-center flex-shrink-0">
              <div className="w-28 sm:w-32 lg:w-36">
                <Logo width={140} height={50} />
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              <Link
                href="/"
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive("/")
                    ? "bg-navy-800 text-white"
                    : "text-gray-700 hover:text-navy-800 hover:bg-gray-50"
                }`}
              >
                Home
              </Link>
              
              {/* Legal Services Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-navy-800 hover:bg-gray-50 flex items-center">
                    Legal Services
                    <ChevronDown className="ml-1 h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link href="/urgent-match" className="flex items-center text-red-600 font-medium">
                      <Shield className="mr-2 h-4 w-4" />
                      Emergency Consultation
                      <span className="ml-auto bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">24/7</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/emergency-consultation" className="flex items-center">
                      <Phone className="mr-2 h-4 w-4" />
                      One-Click Emergency Booking
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/consultation-booking" className="flex items-center">
                      <Phone className="mr-2 h-4 w-4" />
                      Schedule Consultation
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/video-consultation" className="flex items-center">
                      <Users className="mr-2 h-4 w-4" />
                      Video Consultation
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/attorneys" className="flex items-center">
                      <Scale className="mr-2 h-4 w-4" />
                      Find Attorneys
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/case-tracking" className="flex items-center">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Track Your Case
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Resources Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-navy-800 hover:bg-gray-50 flex items-center">
                    Resources
                    <ChevronDown className="ml-1 h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link href="/resources" className="flex items-center">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Legal Resources Library
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/document-generator" className="flex items-center">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Document Generator
                      <span className="ml-auto bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full">AI</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/benefits-calculator" className="flex items-center">
                      <Users className="mr-2 h-4 w-4" />
                      Benefits Calculator
                      <span className="ml-auto bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full">Live</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/forum" className="flex items-center">
                      <Users className="mr-2 h-4 w-4" />
                      Community Forum
                      <span className="ml-auto bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full">Active</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/storytelling-corner" className="flex items-center">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Veterans Stories
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/legal-challenges" className="flex items-center">
                      <Award className="mr-2 h-4 w-4" />
                      Legal Challenges
                      <span className="ml-auto bg-purple-500 text-white text-xs px-1.5 py-0.5 rounded-full">New</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Education Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-navy-800 hover:bg-gray-50 flex items-center">
                    Education
                    <ChevronDown className="ml-1 h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link href="/education" className="flex items-center">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Education Center
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/scenarios" className="flex items-center">
                      <BookOpen className="mr-2 h-4 w-4" />
                      AI Legal Scenarios
                      <span className="ml-auto bg-purple-500 text-white text-xs px-1.5 py-0.5 rounded-full">AI</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/learning-dashboard" className="flex items-center">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Learning Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/micro-challenges" className="flex items-center">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Daily Challenges
                      <span className="ml-auto bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded-full">Daily</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/weekend-safety" className="flex items-center">
                      <Shield className="mr-2 h-4 w-4" />
                      Weekend Safety Briefings
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Veterans Services Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-navy-800 hover:bg-gray-50 flex items-center">
                    Veteran Services
                    <ChevronDown className="ml-1 h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link href="/veteran-services" className="flex items-center">
                      <Users className="mr-2 h-4 w-4" />
                      Transition Support
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/career-assessment" className="flex items-center">
                      <Users className="mr-2 h-4 w-4" />
                      Career Assessment
                      <span className="ml-auto bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full">AI</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/skill-translation" className="flex items-center">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Skill Translation
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/resume-builder" className="flex items-center">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Resume Builder
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/financial-planning" className="flex items-center">
                      <Users className="mr-2 h-4 w-4" />
                      Financial Planning
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/networking-hub" className="flex items-center">
                      <Users className="mr-2 h-4 w-4" />
                      Networking Hub
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Link
                href="/pricing"
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive("/pricing")
                    ? "bg-navy-800 text-white"
                    : "text-gray-700 hover:text-navy-800 hover:bg-gray-50"
                }`}
              >
                Pricing
              </Link>
            </nav>

            {/* Right Side - Emergency Contact, Search, User Menu, Mobile Menu */}
            <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
              
              {/* Emergency Contact - Mobile Optimized */}
              <div className="flex items-center space-x-1">
                <a 
                  href={emergencyContact.callLink}
                  onClick={() => trackMobileInteraction('emergency_call', 'header_button')}
                  className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 bg-red-600 hover:bg-red-700 text-white rounded-full transition-all duration-200 touch-manipulation focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                  aria-label="Emergency Legal Call - 24/7 Support"
                  title="Call Emergency Legal Support: 1-800-645-4357"
                >
                  <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </a>
                <a 
                  href={emergencyContact.emailLink}
                  onClick={() => trackMobileInteraction('emergency_email', 'header_button')}
                  className="hidden sm:flex items-center justify-center w-9 h-9 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-all duration-200 touch-manipulation focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                  aria-label="Emergency Legal Email"
                  title="Email Emergency Legal Support"
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>
              
              {/* Global Search - Hidden on mobile */}
              <div className="hidden md:block">
                <GlobalSearch />
              </div>

              {/* User Menu or Auth Buttons */}
              {isLoading ? (
                <div className="animate-pulse flex space-x-2">
                  <div className="h-8 w-16 bg-gray-200 rounded"></div>
                  <div className="h-8 w-20 bg-gray-200 rounded"></div>
                </div>
              ) : isAuthenticated && user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span className="hidden sm:inline">{(user as any).firstName || (user as any).email || "User"}</span>
                      <ChevronDown className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <a href="/api/logout" className="flex items-center w-full">
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </a>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" asChild>
                    <a href="/api/login">Login</a>
                  </Button>
                  <Button asChild>
                    <a href="/api/login">Get Started</a>
                  </Button>
                </div>
              )}

              {/* Mobile Menu */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="lg:hidden">
                    <Menu className="w-5 h-5" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[280px] sm:w-[320px] max-w-[85vw]">
                  <div className="flex flex-col space-y-4 mt-6">
                    
                    {/* Mobile Search */}
                    <div className="px-4">
                      <GlobalSearch />
                    </div>
                    
                    {/* Mobile Navigation Links */}
                    <nav className="flex flex-col space-y-2 px-4">
                      {menuItems.map((item) => {
                        const IconComponent = item.icon;
                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors ${
                              isActive(item.href)
                                ? "bg-navy-800 text-white"
                                : "text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            {IconComponent && <IconComponent className="w-5 h-5" />}
                            <span className="font-medium">{item.name}</span>
                            {item.badge && (
                              <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                {item.badge}
                              </span>
                            )}
                          </Link>
                        );
                      })}
                    </nav>

                    {/* Mobile User Section */}
                    {isAuthenticated ? (
                      <div className="border-t pt-4 px-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <User className="w-8 h-8 text-gray-400" />
                          <div>
                            <p className="font-medium">{(user as any)?.firstName || "User"}</p>
                            <p className="text-sm text-gray-500">{(user as any)?.email}</p>
                          </div>
                        </div>
                        <Button variant="outline" className="w-full" asChild>
                          <a href="/api/logout">Logout</a>
                        </Button>
                      </div>
                    ) : (
                      <div className="border-t pt-4 px-4 space-y-2">
                        <Button className="w-full" asChild>
                          <a href="/api/login">Get Started</a>
                        </Button>
                        <Button variant="outline" className="w-full" asChild>
                          <a href="/api/login">Login</a>
                        </Button>
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}