import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { Menu, ChevronDown } from "lucide-react";
import { Link, useLocation } from "wouter";
import Logo from "@/components/logo";
import GlobalSearch from "@/components/global-search";

interface MenuItem {
  name: string;
  href: string;
  badge?: string;
}

export default function Header() {
  const [location] = useLocation();

  const menuGroups: Record<string, MenuItem[]> = {
    emergency: [
      { name: "Urgent Matching", href: "/urgent-match", badge: "24/7" },
      { name: "Weekend Safety", href: "/weekend-safety", badge: "Free" },
      { name: "Emotional Support", href: "/emotional-support", badge: "Wellness" }
    ],
    legal: [
      { name: "Find Attorneys", href: "/attorneys" },
      { name: "Book Consultation", href: "/consultation-booking", badge: "One-Click" },
      { name: "Video Consultation", href: "/video-consultation", badge: "Live" },
      { name: "Legal Resources", href: "/resources" },
      { name: "Case Tracking", href: "/case-tracking" },
      { name: "Secure Messages", href: "/messages" }
    ],
    education: [
      { name: "Education Center", href: "/education" },
      { name: "AI Scenarios", href: "/scenarios", badge: "Interactive" },
      { name: "Learning Dashboard", href: "/learning-dashboard" },
      { name: "Micro-Challenges", href: "/micro-challenges" }
    ],
    veteran: [
      { name: "Veteran Services", href: "/veteran-services", badge: "Veterans" },
      { name: "Financial Planning", href: "/financial-planning", badge: "Money" },
      { name: "Career Assessment", href: "/career-assessment", badge: "AI" },
      { name: "Skill Translation", href: "/skill-translation", badge: "Interactive" },
      { name: "Resume Builder", href: "/resume-builder", badge: "AI" },
      { name: "Networking Hub", href: "/networking-hub", badge: "Community" },
      { name: "Storytelling Corner", href: "/storytelling-corner" }
    ],
    community: [
      { name: "Forum", href: "/forum", badge: "Active" },
      { name: "Help Center", href: "/help-center" },
      { name: "Contact Support", href: "/contact-support" }
    ]
  };

  const isActive = (href: string) => {
    if (href.startsWith("#")) return false;
    if (href === "/" && location === "/") return true;
    if (href !== "/" && location.startsWith(href)) return true;
    return location === href;
  };

  return (
    <>
      {/* Skip to main content link for screen readers */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50" role="banner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
            <Link href="/" className="flex items-center focus:ring-2 focus:ring-navy-500 focus:ring-offset-2 rounded" aria-label="Go to Mil-Legal homepage">
              <Logo width={140} height={50} />
            </Link>
            <nav className="hidden md:ml-10 md:flex space-x-6" role="navigation" aria-label="Main navigation">
              {/* Home Button */}
              <Link
                href="/"
                className={`px-4 py-2 text-sm font-medium transition-smooth hover-lift rounded-md border focus:ring-2 focus:ring-navy-500 focus:ring-offset-2 ${
                  isActive("/")
                    ? "bg-navy-800 text-white border-navy-800"
                    : "text-navy-700 border-navy-200 hover:text-navy-800 hover:bg-navy-50 hover:border-navy-300"
                }`}
                aria-label="Navigate to homepage"
              >
                🏠 Home
              </Link>

              {/* Emergency Services */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className={`px-3 py-2 text-sm font-medium hover-lift transition-smooth focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
                      menuGroups.emergency.some(item => isActive(item.href))
                        ? "text-red-700 bg-red-50"
                        : "text-gray-700 hover:text-navy-800"
                    }`}
                    aria-label="Emergency services menu"
                  >
                    Emergency
                    <ChevronDown className="ml-1 w-4 h-4" aria-hidden="true" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  {menuGroups.emergency.map((item) => (
                    <DropdownMenuItem key={item.name} asChild>
                      <Link href={item.href} className="flex items-center justify-between w-full">
                        {item.name}
                        {item.badge && (
                          <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Legal Services */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className={`px-3 py-2 text-sm font-medium hover-lift transition-smooth focus:ring-2 focus:ring-navy-500 focus:ring-offset-2 ${
                      menuGroups.legal.some(item => isActive(item.href))
                        ? "text-navy-700 bg-navy-50"
                        : "text-gray-700 hover:text-navy-800"
                    }`}
                    aria-label="Legal services menu"
                  >
                    Legal Services
                    <ChevronDown className="ml-1 w-4 h-4" aria-hidden="true" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  {menuGroups.legal.map((item) => (
                    <DropdownMenuItem key={item.name} asChild>
                      <Link href={item.href} className="flex items-center justify-between w-full">
                        {item.name}
                        {item.badge && (
                          <span className="bg-navy-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Education */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className={`px-3 py-2 text-sm font-medium hover-lift transition-smooth focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      menuGroups.education.some(item => isActive(item.href))
                        ? "text-blue-700 bg-blue-50"
                        : "text-gray-700 hover:text-navy-800"
                    }`}
                    aria-label="Education and learning menu"
                  >
                    Education
                    <ChevronDown className="ml-1 w-4 h-4" aria-hidden="true" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  {menuGroups.education.map((item) => (
                    <DropdownMenuItem key={item.name} asChild>
                      <Link href={item.href} className="flex items-center justify-between w-full">
                        {item.name}
                        {item.badge && (
                          <span className="bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Veteran Services */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className={`px-3 py-2 text-sm font-medium hover-lift transition-smooth focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                      menuGroups.veteran.some(item => isActive(item.href))
                        ? "text-green-700 bg-green-50"
                        : "text-gray-700 hover:text-navy-800"
                    }`}
                    aria-label="Veteran services and transition support menu"
                  >
                    Veteran Services
                    <ChevronDown className="ml-1 w-4 h-4" aria-hidden="true" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  {menuGroups.veteran.map((item) => (
                    <DropdownMenuItem key={item.name} asChild>
                      <Link href={item.href} className="flex items-center justify-between w-full">
                        {item.name}
                        {item.badge && (
                          <span className="bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Community */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className={`px-3 py-2 text-sm font-medium hover-lift transition-smooth focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                      menuGroups.community.some(item => isActive(item.href))
                        ? "text-purple-700 bg-purple-50"
                        : "text-gray-700 hover:text-navy-800"
                    }`}
                    aria-label="Community and support menu"
                  >
                    Community
                    <ChevronDown className="ml-1 w-4 h-4" aria-hidden="true" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  {menuGroups.community.map((item) => (
                    <DropdownMenuItem key={item.name} asChild>
                      <Link href={item.href} className="flex items-center justify-between w-full">
                        {item.name}
                        {item.badge && (
                          <span className="bg-purple-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Pricing - Direct Link */}
              <Link
                href="/pricing"
                className={`px-3 py-2 text-sm font-medium transition-smooth hover-lift focus:ring-2 focus:ring-navy-500 focus:ring-offset-2 ${
                  isActive("/pricing")
                    ? "text-navy-800 border-b-2 border-navy-800"
                    : "text-gray-700 hover:text-navy-800"
                }`}
                aria-label="View pricing plans"
              >
                Pricing
              </Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <GlobalSearch className="hidden md:block" />
            <Button variant="ghost" className="text-navy-800 hover:text-navy-900 font-medium text-sm hover-scale transition-smooth">
              Sign In
            </Button>
            <Button className="bg-navy-800 hover:bg-navy-900 text-white click-ripple hover-glow transition-smooth">
              Get Started
            </Button>
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <div className="flex flex-col space-y-4 mt-6">
                    {/* Home Button */}
                    <Link
                      href="/"
                      className={`px-4 py-3 text-lg font-medium rounded-md transition-smooth ${
                        isActive("/")
                          ? "bg-navy-800 text-white"
                          : "text-gray-700 hover:text-navy-800 hover:bg-navy-50"
                      }`}
                    >
                      🏠 Home
                    </Link>

                    {/* Emergency Services */}
                    <div className="space-y-2">
                      <h4 className="font-semibold text-red-600 text-sm">Emergency</h4>
                      {menuGroups.emergency.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="flex items-center justify-between text-gray-700 hover:text-navy-800 font-medium pl-2"
                        >
                          {item.name}
                          {item.badge && (
                            <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>

                    {/* Legal Services */}
                    <div className="space-y-2">
                      <h4 className="font-semibold text-navy-600 text-sm">Legal Services</h4>
                      {menuGroups.legal.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="flex items-center justify-between text-gray-700 hover:text-navy-800 font-medium pl-2"
                        >
                          {item.name}
                          {item.badge && (
                            <span className="bg-navy-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>

                    {/* Education */}
                    <div className="space-y-2">
                      <h4 className="font-semibold text-blue-600 text-sm">Education</h4>
                      {menuGroups.education.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="flex items-center justify-between text-gray-700 hover:text-navy-800 font-medium pl-2"
                        >
                          {item.name}
                          {item.badge && (
                            <span className="bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>

                    {/* Veteran Services */}
                    <div className="space-y-2">
                      <h4 className="font-semibold text-green-600 text-sm">Veteran Services</h4>
                      {menuGroups.veteran.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="flex items-center justify-between text-gray-700 hover:text-navy-800 font-medium pl-2"
                        >
                          {item.name}
                          {item.badge && (
                            <span className="bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>

                    {/* Community */}
                    <div className="space-y-2">
                      <h4 className="font-semibold text-purple-600 text-sm">Community</h4>
                      {menuGroups.community.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="flex items-center justify-between text-gray-700 hover:text-navy-800 font-medium pl-2"
                        >
                          {item.name}
                          {item.badge && (
                            <span className="bg-purple-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>

                    {/* Pricing */}
                    <Link
                      href="/pricing"
                      className="text-gray-700 hover:text-navy-800 font-medium"
                    >
                      Pricing
                    </Link>

                    <div className="pt-4 border-t border-gray-200">
                      <Button variant="ghost" className="w-full justify-start text-navy-800 mb-2">
                        Sign In
                      </Button>
                      <Button className="w-full bg-navy-800 hover:bg-navy-900">
                        Get Started
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
    </>
  );
}
