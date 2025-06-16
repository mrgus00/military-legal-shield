import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { Menu, ChevronDown, User, LogOut, Shield, Scale, BookOpen, Users, Phone, FileText } from "lucide-react";
import { Link, useLocation } from "wouter";
import Logo from "@/components/logo";
import { useAuth } from "@/hooks/useAuth";

export default function Header() {
  const [location] = useLocation();
  const { isAuthenticated, user, isLoading } = useAuth();

  const isActive = (href: string) => {
    if (href === "/" && location === "/") return true;
    if (href !== "/" && location.startsWith(href)) return true;
    return location === href;
  };

  return (
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-navy-800 text-white px-4 py-2 rounded">
        Skip to main content
      </a>
      
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            <div className="flex items-center">
              <div className="w-32 lg:w-36">
                <Logo width={140} height={50} />
              </div>
            </div>

            <nav className="hidden lg:flex items-center space-x-8">
              <Link
                href="/"
                className={`px-1 py-2 text-sm font-medium transition-colors border-b-2 ${
                  isActive("/")
                    ? "text-navy-800 border-navy-800"
                    : "text-gray-700 hover:text-navy-800 border-transparent hover:border-gray-300"
                }`}
              >
                Home
              </Link>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="px-1 py-2 text-sm font-medium text-gray-700 hover:text-navy-800 flex items-center border-b-2 border-transparent hover:border-gray-300">
                    Services
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-64">
                  <DropdownMenuItem asChild>
                    <Link href="/urgent-match" className="flex items-center text-red-600 font-medium">
                      <Shield className="mr-3 h-4 w-4" />
                      Court-Martial Defense
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/emergency-consultation" className="flex items-center">
                      <Phone className="mr-3 h-4 w-4" />
                      DUI/DWI Assistance
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/document-generator" className="flex items-center">
                      <FileText className="mr-3 h-4 w-4" />
                      POAs & Family Docs
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/military-justice" className="flex items-center">
                      <Scale className="mr-3 h-4 w-4" />
                      UCMJ Support
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/consultation-booking" className="flex items-center">
                      <Users className="mr-3 h-4 w-4" />
                      PCS & Deployment Legal
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/benefits-eligibility" className="flex items-center">
                      <FileText className="mr-3 h-4 w-4" />
                      Benefits Calculator
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/legal-challenges" className="flex items-center">
                      <BookOpen className="mr-3 h-4 w-4" />
                      Legal Challenges
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/lawyer-database" className="flex items-center">
                      <Users className="mr-3 h-4 w-4" />
                      Find Military Attorneys
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Link
                href="/pricing"
                className={`px-1 py-2 text-sm font-medium transition-colors border-b-2 ${
                  isActive("/pricing")
                    ? "text-navy-800 border-navy-800"
                    : "text-gray-700 hover:text-navy-800 border-transparent hover:border-gray-300"
                }`}
              >
                Plans
              </Link>

              <Link
                href="/education"
                className={`px-1 py-2 text-sm font-medium transition-colors border-b-2 ${
                  isActive("/education")
                    ? "text-navy-800 border-navy-800"
                    : "text-gray-700 hover:text-navy-800 border-transparent hover:border-gray-300"
                }`}
              >
                How It Works
              </Link>

              <Link
                href="/help-center"
                className={`px-1 py-2 text-sm font-medium transition-colors border-b-2 ${
                  isActive("/help-center")
                    ? "text-navy-800 border-navy-800"
                    : "text-gray-700 hover:text-navy-800 border-transparent hover:border-gray-300"
                }`}
              >
                FAQ
              </Link>

              <Link
                href="/contact-support"
                className={`px-1 py-2 text-sm font-medium transition-colors border-b-2 ${
                  isActive("/contact-support")
                    ? "text-navy-800 border-navy-800"
                    : "text-gray-700 hover:text-navy-800 border-transparent hover:border-gray-300"
                }`}
              >
                Contact
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <Link href="/urgent-match">
                <Button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 font-medium hidden sm:inline-flex">
                  Connect with a Lawyer
                </Button>
              </Link>

              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span className="hidden sm:inline">Account</span>
                      <ChevronDown className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link href="/case-tracking" className="flex items-center">
                        <BookOpen className="mr-2 h-4 w-4" />
                        My Cases
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <a href="/api/logout" className="flex items-center">
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                      </a>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" asChild>
                    <a href="/api/login">Sign In</a>
                  </Button>
                  <Button asChild className="bg-navy-800 hover:bg-navy-900">
                    <a href="/api/login">Sign Up</a>
                  </Button>
                </div>
              )}

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="lg:hidden">
                    <Menu className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <div className="flex flex-col space-y-4 mt-4">
                    <Link href="/" className="text-lg font-medium">Home</Link>
                    <div className="border-l-2 border-gray-200 pl-4 space-y-2">
                      <div className="font-medium text-gray-900">Services</div>
                      <Link href="/urgent-match" className="block text-sm text-red-600">Court-Martial Defense</Link>
                      <Link href="/emergency-consultation" className="block text-sm">DUI/DWI Assistance</Link>
                      <Link href="/document-generator" className="block text-sm">POAs & Family Docs</Link>
                      <Link href="/military-justice" className="block text-sm">UCMJ Support</Link>
                      <Link href="/consultation-booking" className="block text-sm">PCS & Deployment Legal</Link>
                    </div>
                    <Link href="/pricing" className="text-lg font-medium">Plans</Link>
                    <Link href="/education" className="text-lg font-medium">How It Works</Link>
                    <Link href="/help-center" className="text-lg font-medium">FAQ</Link>
                    <Link href="/contact-support" className="text-lg font-medium">Contact</Link>
                    
                    <div className="pt-4 border-t">
                      <Link href="/urgent-match">
                        <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white mb-3">
                          Connect with a Lawyer
                        </Button>
                      </Link>
                      {!isAuthenticated && (
                        <div className="space-y-2">
                          <Button variant="outline" className="w-full" asChild>
                            <a href="/api/login">Sign In</a>
                          </Button>
                          <Button className="w-full bg-navy-800 hover:bg-navy-900" asChild>
                            <a href="/api/login">Sign Up</a>
                          </Button>
                        </div>
                      )}
                    </div>
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