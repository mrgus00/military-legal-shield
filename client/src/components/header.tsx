import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { Menu, ChevronDown, User, LogOut, Home, Shield, Scale, BookOpen, Users, Phone } from "lucide-react";
import { Link, useLocation } from "wouter";
import Logo from "@/components/logo";
import GlobalSearch from "@/components/global-search";
import { useAuth } from "@/hooks/useAuth";

interface MenuItem {
  name: string;
  href: string;
  badge?: string;
  icon?: any;
}

export default function Header() {
  const [location] = useLocation();
  const { isAuthenticated, user, isLoading } = useAuth();

  const menuItems: MenuItem[] = [
    { name: "Home", href: "/", icon: Home },
    { name: "Urgent Matching", href: "/urgent-match", badge: "24/7", icon: Shield },
    { name: "Find Attorneys", href: "/attorneys", icon: Scale },
    { name: "Book Consultation", href: "/consultation-booking", icon: Phone },
    { name: "Legal Resources", href: "/resources", icon: BookOpen },
    { name: "Education Center", href: "/education", icon: BookOpen },
    { name: "AI Scenarios", href: "/scenarios", badge: "Interactive", icon: BookOpen },
    { name: "Career Assessment", href: "/career-assessment", badge: "AI", icon: Users },
    { name: "Forum", href: "/forum", badge: "Active", icon: Users },
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
      
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50 w-full">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center" aria-label="Go to MilitaryLegalShield homepage">
                <Logo width={140} height={50} />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6">
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
              
              <Link
                href="/urgent-match"
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive("/urgent-match")
                    ? "bg-red-600 text-white"
                    : "text-red-600 hover:text-red-700 hover:bg-red-50"
                }`}
              >
                Emergency <span className="ml-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">24/7</span>
              </Link>
              
              <Link
                href="/attorneys"
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive("/attorneys")
                    ? "bg-navy-800 text-white"
                    : "text-gray-700 hover:text-navy-800 hover:bg-gray-50"
                }`}
              >
                Find Attorneys
              </Link>
              
              <Link
                href="/resources"
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive("/resources")
                    ? "bg-navy-800 text-white"
                    : "text-gray-700 hover:text-navy-800 hover:bg-gray-50"
                }`}
              >
                Resources
              </Link>
              
              <Link
                href="/education"
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive("/education")
                    ? "bg-navy-800 text-white"
                    : "text-gray-700 hover:text-navy-800 hover:bg-gray-50"
                }`}
              >
                Education
              </Link>
              
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

            {/* Right Side - Search, User Menu, Mobile Menu */}
            <div className="flex items-center space-x-4">
              
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
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
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