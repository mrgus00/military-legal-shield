import { useState, useRef, useEffect } from "react";
import { Search, X, FileText, Users, GraduationCap, MessageSquare, Heart, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useMood } from "@/contexts/MoodContext";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";

interface SearchResult {
  id: string;
  type: "resource" | "attorney" | "education" | "story" | "forum";
  title: string;
  description: string;
  url: string;
  category?: string;
  metadata?: any;
}

export default function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const { colors } = useMood();
  const [, setLocation] = useLocation();
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Focus input when dialog opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Global keyboard shortcut (Ctrl/Cmd + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const { data: searchResults = [], isLoading } = useQuery<SearchResult[]>({
    queryKey: ["/api/search", debouncedQuery],
    enabled: debouncedQuery.length > 2,
    staleTime: 30000, // Cache results for 30 seconds
  });

  const handleResultClick = (result: SearchResult) => {
    setLocation(result.url);
    setIsOpen(false);
    setSearchQuery("");
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case "resource": return <FileText className="w-4 h-4" style={{ color: colors.primary }} />;
      case "attorney": return <Users className="w-4 h-4" style={{ color: colors.primary }} />;
      case "education": return <GraduationCap className="w-4 h-4" style={{ color: colors.primary }} />;
      case "story": return <Heart className="w-4 h-4" style={{ color: colors.primary }} />;
      case "forum": return <MessageSquare className="w-4 h-4" style={{ color: colors.primary }} />;
      default: return <Search className="w-4 h-4" style={{ color: colors.primary }} />;
    }
  };

  const getResultTypeName = (type: string) => {
    switch (type) {
      case "resource": return "Legal Resource";
      case "attorney": return "Attorney";
      case "education": return "Education";
      case "story": return "Veteran Story";
      case "forum": return "Forum Post";
      default: return "Content";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="relative w-64 justify-start text-sm font-normal"
          style={{ borderColor: colors.border }}
        >
          <Search className="w-4 h-4 mr-2 opacity-70" />
          <span className="opacity-70">Search platform...</span>
          <kbd className="pointer-events-none absolute right-2 top-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl p-0 overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b" style={{ borderColor: colors.border }}>
          <DialogTitle className="sr-only">Search Platform</DialogTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50" />
            <Input
              ref={inputRef}
              placeholder="Search resources, attorneys, education, stories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10 text-base border-0 focus-visible:ring-0"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 p-0"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="max-h-96 overflow-y-auto">
          {searchQuery.length === 0 && (
            <div className="p-6 text-center">
              <div className="space-y-3">
                <Search className="w-12 h-12 mx-auto opacity-50" style={{ color: colors.primary }} />
                <div>
                  <h4 className="font-semibold mb-2" style={{ color: colors.text }}>
                    Search the Platform
                  </h4>
                  <p className="text-sm opacity-75">
                    Find legal resources, attorneys, educational content, veteran stories, and forum discussions
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Badge variant="outline" className="text-xs">Legal Resources</Badge>
                  <Badge variant="outline" className="text-xs">Attorneys</Badge>
                  <Badge variant="outline" className="text-xs">Education</Badge>
                  <Badge variant="outline" className="text-xs">Stories</Badge>
                  <Badge variant="outline" className="text-xs">Forum</Badge>
                </div>
              </div>
            </div>
          )}

          {searchQuery.length > 0 && searchQuery.length < 3 && (
            <div className="p-6 text-center">
              <p className="text-sm opacity-75">
                Type at least 3 characters to search
              </p>
            </div>
          )}

          {debouncedQuery.length >= 3 && (
            <div className="p-2">
              {isLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i} className="p-4">
                      <div className="animate-pulse space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : searchResults.length > 0 ? (
                <div className="space-y-1">
                  {searchResults.map((result: SearchResult) => (
                    <Card 
                      key={result.id}
                      className="p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => handleResultClick(result)}
                    >
                      <CardContent className="p-0">
                        <div className="flex items-start space-x-3">
                          <div className="mt-1">
                            {getResultIcon(result.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-medium text-sm truncate pr-2">
                                {result.title}
                              </h4>
                              <Badge variant="outline" className="text-xs flex-shrink-0">
                                {getResultTypeName(result.type)}
                              </Badge>
                            </div>
                            <p className="text-xs opacity-75 line-clamp-2">
                              {result.description}
                            </p>
                            {result.category && (
                              <div className="mt-2">
                                <Badge variant="secondary" className="text-xs">
                                  {result.category}
                                </Badge>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center">
                  <AlertTriangle className="w-8 h-8 mx-auto mb-3 opacity-50" style={{ color: colors.primary }} />
                  <h4 className="font-semibold mb-2" style={{ color: colors.text }}>
                    No results found
                  </h4>
                  <p className="text-sm opacity-75">
                    Try different keywords or browse categories directly
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {searchResults.length > 0 && (
          <div className="px-4 py-3 border-t text-xs text-muted-foreground" style={{ borderColor: colors.border }}>
            <div className="flex items-center justify-between">
              <span>Navigate with ↑↓ • Select with ↵</span>
              <span>{searchResults.length} results</span>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}