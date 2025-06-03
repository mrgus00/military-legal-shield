import { useState, useEffect, useRef } from "react";
import { Search, FileText, Users, BookOpen, Calculator, Calendar, MessageSquare, ArrowRight, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useBranch } from "@/contexts/BranchContext";
import { Link } from "wouter";

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'page' | 'feature' | 'resource' | 'benefit' | 'attorney' | 'education';
  url: string;
  category: string;
  tags: string[];
  relevance: number;
}

const searchableContent: SearchResult[] = [
  // Main Pages
  {
    id: "home",
    title: "Home - Legal Defense for Military Personnel",
    description: "Main platform for military legal support and veteran services",
    type: "page",
    url: "/",
    category: "Navigation",
    tags: ["home", "main", "legal", "defense", "military"],
    relevance: 100
  },
  {
    id: "attorneys",
    title: "Find Military Attorneys",
    description: "Search and connect with specialized military defense attorneys",
    type: "page",
    url: "/attorneys",
    category: "Legal Services",
    tags: ["attorneys", "lawyers", "defense", "military", "legal", "representation"],
    relevance: 95
  },
  {
    id: "urgent-match",
    title: "Emergency Legal Match",
    description: "Immediate attorney matching for urgent legal situations",
    type: "feature",
    url: "/urgent-match",
    category: "Emergency Services",
    tags: ["urgent", "emergency", "immediate", "crisis", "help"],
    relevance: 90
  },
  {
    id: "benefits-calculator",
    title: "Benefits Eligibility Calculator",
    description: "Real-time calculation of VA benefits eligibility and compensation rates",
    type: "feature",
    url: "/benefits-calculator",
    category: "Veterans Services",
    tags: ["benefits", "calculator", "va", "compensation", "eligibility", "disability"],
    relevance: 88
  },
  {
    id: "scenarios",
    title: "Legal Scenario Training",
    description: "Interactive legal scenarios and decision-making exercises",
    type: "education",
    url: "/scenarios",
    category: "Training",
    tags: ["scenarios", "training", "legal", "education", "simulation"],
    relevance: 85
  },
  {
    id: "case-tracking",
    title: "Legal Case Tracking",
    description: "Track your legal cases and communicate with attorneys",
    type: "feature",
    url: "/case-tracking",
    category: "Case Management",
    tags: ["cases", "tracking", "status", "legal", "progress"],
    relevance: 82
  },
  {
    id: "consultation-booking",
    title: "Book Legal Consultation",
    description: "Schedule consultations with military attorneys",
    type: "feature",
    url: "/consultation-booking",
    category: "Appointments",
    tags: ["consultation", "booking", "appointment", "schedule", "attorney"],
    relevance: 80
  },
  {
    id: "video-consultation",
    title: "Video Consultation",
    description: "Secure video consultations with legal professionals",
    type: "feature",
    url: "/video-consultation",
    category: "Appointments",
    tags: ["video", "consultation", "online", "secure", "attorney"],
    relevance: 78
  },
  {
    id: "financial-wizard",
    title: "Financial Planning Wizard",
    description: "Comprehensive financial planning for military personnel",
    type: "feature",
    url: "/financial-wizard",
    category: "Financial Planning",
    tags: ["financial", "planning", "money", "budget", "military"],
    relevance: 75
  },
  {
    id: "career-assessment",
    title: "Career Transition Assessment",
    description: "AI-powered career assessment for transitioning service members",
    type: "feature",
    url: "/career-assessment",
    category: "Career Services",
    tags: ["career", "transition", "assessment", "civilian", "jobs"],
    relevance: 73
  },
  {
    id: "resume-builder",
    title: "Military Resume Builder",
    description: "AI-powered resume builder for veterans and service members",
    type: "feature",
    url: "/resume-builder",
    category: "Career Services",
    tags: ["resume", "cv", "military", "civilian", "translation"],
    relevance: 70
  },
  {
    id: "skill-translation",
    title: "Military Skill Translation",
    description: "Translate military experience into civilian job qualifications",
    type: "feature",
    url: "/skill-translation",
    category: "Career Services",
    tags: ["skills", "translation", "military", "civilian", "mos"],
    relevance: 68
  },
  {
    id: "forum",
    title: "Legal Discussion Forum",
    description: "Community forum for legal questions and discussions",
    type: "page",
    url: "/forum",
    category: "Community",
    tags: ["forum", "community", "questions", "discussion", "legal"],
    relevance: 65
  },
  {
    id: "resources",
    title: "Legal Resources Library",
    description: "Comprehensive library of military legal resources and guides",
    type: "resource",
    url: "/resources",
    category: "Resources",
    tags: ["resources", "library", "guides", "legal", "information"],
    relevance: 63
  },
  {
    id: "education",
    title: "Legal Education Hub",
    description: "Educational courses and training modules for military law",
    type: "education",
    url: "/education",
    category: "Education",
    tags: ["education", "training", "courses", "learning", "legal"],
    relevance: 60
  },
  {
    id: "weekend-safety",
    title: "Weekend Safety Briefings",
    description: "Interactive safety briefings and risk awareness training",
    type: "education",
    url: "/weekend-safety",
    category: "Safety",
    tags: ["safety", "weekend", "briefings", "risk", "awareness"],
    relevance: 58
  },
  {
    id: "micro-challenges",
    title: "Legal Micro-Challenges",
    description: "Quick legal knowledge challenges and daily questions",
    type: "education",
    url: "/micro-challenges",
    category: "Training",
    tags: ["challenges", "quiz", "daily", "legal", "knowledge"],
    relevance: 55
  },
  {
    id: "networking-hub",
    title: "Professional Networking Hub",
    description: "Connect with other veterans and military professionals",
    type: "feature",
    url: "/networking-hub",
    category: "Networking",
    tags: ["networking", "professional", "veterans", "connections"],
    relevance: 53
  },
  {
    id: "emotional-support",
    title: "Emotional Support Resources",
    description: "Mental health and emotional support resources for service members",
    type: "resource",
    url: "/emotional-support",
    category: "Support Services",
    tags: ["emotional", "mental", "health", "support", "counseling"],
    relevance: 50
  },
  {
    id: "veteran-services",
    title: "Veteran Services Directory",
    description: "Comprehensive directory of veteran services and benefits",
    type: "resource",
    url: "/veteran-services",
    category: "Veterans Services",
    tags: ["veteran", "services", "benefits", "directory", "va"],
    relevance: 48
  },
  {
    id: "storytelling-corner",
    title: "Veterans' Storytelling Corner",
    description: "Share and read inspiring veteran stories and experiences",
    type: "page",
    url: "/storytelling-corner",
    category: "Community",
    tags: ["stories", "veterans", "experiences", "inspiration", "community"],
    relevance: 45
  }
];

interface GlobalSearchProps {
  className?: string;
}

export default function GlobalSearch({ className = "" }: GlobalSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const { branchTheme } = useBranch();
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Save recent searches to localStorage
  const saveRecentSearch = (query: string) => {
    if (query.trim() && !recentSearches.includes(query.trim())) {
      const updated = [query.trim(), ...recentSearches.slice(0, 4)];
      setRecentSearches(updated);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
    }
  };

  // Perform search
  useEffect(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      const results = searchableContent
        .map(item => {
          let relevance = 0;
          
          // Title match (highest weight)
          if (item.title.toLowerCase().includes(query)) {
            relevance += 50;
          }
          
          // Description match
          if (item.description.toLowerCase().includes(query)) {
            relevance += 30;
          }
          
          // Tags match
          const tagMatches = item.tags.filter(tag => tag.toLowerCase().includes(query)).length;
          relevance += tagMatches * 20;
          
          // Category match
          if (item.category.toLowerCase().includes(query)) {
            relevance += 25;
          }
          
          // Exact word matches get bonus
          const words = query.split(' ');
          words.forEach(word => {
            if (item.title.toLowerCase().includes(word) || 
                item.description.toLowerCase().includes(word) ||
                item.tags.some(tag => tag.toLowerCase() === word)) {
              relevance += 15;
            }
          });
          
          return { ...item, relevance };
        })
        .filter(item => item.relevance > 0)
        .sort((a, b) => b.relevance - a.relevance)
        .slice(0, 8);
      
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      saveRecentSearch(query);
    }
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'page': return <FileText className="w-4 h-4" />;
      case 'feature': return <Calculator className="w-4 h-4" />;
      case 'resource': return <BookOpen className="w-4 h-4" />;
      case 'attorney': return <Users className="w-4 h-4" />;
      case 'education': return <BookOpen className="w-4 h-4" />;
      default: return <Search className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'page': return 'bg-blue-100 text-blue-800';
      case 'feature': return 'bg-green-100 text-green-800';
      case 'resource': return 'bg-purple-100 text-purple-800';
      case 'attorney': return 'bg-red-100 text-red-800';
      case 'education': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Keyboard shortcut (Ctrl/Cmd + K)
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
        setTimeout(() => searchInputRef.current?.focus(), 100);
      }
    };

    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className={`flex items-center space-x-2 ${className}`}
          onClick={() => setIsOpen(true)}
        >
          <Search className="w-4 h-4" />
          <span className="hidden md:block">Search platform...</span>
          <Badge variant="secondary" className="hidden lg:block text-xs">
            Ctrl+K
          </Badge>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="flex items-center space-x-2">
            <Search className="w-5 h-5" />
            <span>Search Mil-Legal Platform</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="px-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              ref={searchInputRef}
              placeholder="Search legal services, benefits, attorneys..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 pr-4 py-3 text-lg"
              autoComplete="off"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {/* Recent Searches */}
          {!searchQuery && recentSearches.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>Recent Searches</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSearch(search)}
                    className="text-xs"
                  >
                    {search}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Search Results */}
          {searchQuery && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for "{searchQuery}"
              </h3>
              
              {searchResults.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No results found for "{searchQuery}"</p>
                  <p className="text-sm mt-2">Try different keywords or browse our main sections</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {searchResults.map((result) => (
                    <Link key={result.id} href={result.url}>
                      <Card 
                        className="hover:shadow-md transition-all duration-200 cursor-pointer group"
                        onClick={() => setIsOpen(false)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                {getResultIcon(result.type)}
                                <h4 className="font-medium text-gray-900 group-hover:text-navy-700">
                                  {result.title}
                                </h4>
                                <Badge 
                                  variant="secondary" 
                                  className={`text-xs ${getTypeColor(result.type)}`}
                                >
                                  {result.category}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 line-clamp-2">
                                {result.description}
                              </p>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {result.tags.slice(0, 3).map((tag, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-navy-600 ml-4" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Quick Access */}
          {!searchQuery && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Access</h3>
              <div className="grid grid-cols-2 gap-2">
                <Link href="/attorneys">
                  <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => setIsOpen(false)}>
                    <Users className="w-4 h-4 mr-2" />
                    Find Attorneys
                  </Button>
                </Link>
                <Link href="/benefits-calculator">
                  <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => setIsOpen(false)}>
                    <Calculator className="w-4 h-4 mr-2" />
                    Benefits Calculator
                  </Button>
                </Link>
                <Link href="/urgent-match">
                  <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => setIsOpen(false)}>
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Emergency Help
                  </Button>
                </Link>
                <Link href="/consultation-booking">
                  <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => setIsOpen(false)}>
                    <Calendar className="w-4 h-4 mr-2" />
                    Book Consultation
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}