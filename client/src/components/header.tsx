import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Shield, Menu } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function Header() {
  const [location] = useLocation();

  const navigation = [
    { name: "Urgent Matching", href: "/urgent-match" },
    { name: "Case Tracking", href: "/case-tracking" },
    { name: "Legal Resources", href: "/resources" },
    { name: "Find Attorneys", href: "/attorneys" },
    { name: "Education", href: "/education" },
    { name: "Pricing", href: "/pricing" },
    { name: "Support", href: "#support" },
  ];

  const isActive = (href: string) => {
    if (href.startsWith("#")) return false;
    return location === href;
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Shield className="text-red-600 w-8 h-8 mr-3" />
              <h1 className="text-xl font-bold text-red-600">Soldier on Fire</h1>
            </Link>
            <nav className="hidden md:ml-10 md:flex space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3 py-2 text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? "text-navy-800 border-b-2 border-navy-800"
                      : "text-gray-700 hover:text-navy-800"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="text-navy-800 hover:text-navy-900 font-medium text-sm">
              Sign In
            </Button>
            <Button className="bg-navy-800 hover:bg-navy-900 text-white">
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
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="text-gray-700 hover:text-navy-800 font-medium"
                      >
                        {item.name}
                      </Link>
                    ))}
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
  );
}
