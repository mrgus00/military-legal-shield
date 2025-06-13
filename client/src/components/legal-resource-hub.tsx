import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Search, BookOpen, Gavel, FileText, Globe, Clock, Star, ArrowRight, Scale, Shield, AlertTriangle, Users, MessageSquare } from "lucide-react";
import { Link } from "wouter";

interface LegalResource {
  id: string;
  title: string;
  description: string;
  category: string;
  type: "article" | "form" | "guide" | "faq" | "video";
  urgency: "high" | "medium" | "low";
  languages: string[];
  readTime: string;
  lastUpdated: string;
  popularity: number;
}

const legalResources: LegalResource[] = [
  {
    id: "ucmj-overview",
    title: "UCMJ Complete Guide",
    description: "Comprehensive overview of the Uniform Code of Military Justice covering all 146 articles with practical applications",
    category: "Military Law",
    type: "guide",
    urgency: "high",
    languages: ["English", "Spanish", "German", "Japanese", "Korean"],
    readTime: "15 min",
    lastUpdated: "2024-12-01",
    popularity: 95
  },
  {
    id: "article-15-defense",
    title: "Article 15 Defense Strategy",
    description: "Your rights and options when facing Non-Judicial Punishment proceedings",
    category: "Administrative Law",
    type: "guide",
    urgency: "high",
    languages: ["English", "Spanish", "German"],
    readTime: "8 min",
    lastUpdated: "2024-11-28",
    popularity: 88
  },
  {
    id: "security-clearance-sf86",
    title: "SF-86 Completion Guide",
    description: "Step-by-step instructions for completing your security clearance application accurately",
    category: "Security Clearance",
    type: "guide",
    urgency: "medium",
    languages: ["English", "Spanish"],
    readTime: "12 min",
    lastUpdated: "2024-11-25",
    popularity: 92
  },
  {
    id: "sharp-reporting",
    title: "SHARP Incident Reporting",
    description: "Understanding your options for reporting sexual harassment and assault",
    category: "SHARP/EO",
    type: "guide",
    urgency: "high",
    languages: ["English", "Spanish", "German", "Japanese"],
    readTime: "6 min",
    lastUpdated: "2024-12-02",
    popularity: 87
  },
  {
    id: "overseas-legal-rights",
    title: "Legal Rights for Personnel Abroad",
    description: "Understanding jurisdiction, local laws, and your rights when stationed overseas",
    category: "International Law",
    type: "guide",
    urgency: "medium",
    languages: ["English", "Spanish", "German", "Japanese", "Korean", "Italian"],
    readTime: "10 min",
    lastUpdated: "2024-11-30",
    popularity: 79
  },
  {
    id: "family-law-military",
    title: "Military Family Law Essentials",
    description: "Divorce, custody, and family support in military context",
    category: "Family Law",
    type: "guide",
    urgency: "medium",
    languages: ["English", "Spanish", "German"],
    readTime: "14 min",
    lastUpdated: "2024-11-27",
    popularity: 83
  },
  {
    id: "court-martial-prep",
    title: "Court-Martial Preparation Checklist",
    description: "Essential steps to take when facing court-martial proceedings",
    category: "Court-Martial",
    type: "guide",
    urgency: "high",
    languages: ["English", "Spanish", "German", "Japanese"],
    readTime: "7 min",
    lastUpdated: "2024-12-01",
    popularity: 91
  },
  {
    id: "financial-crimes-defense",
    title: "Financial Crimes in Military Context",
    description: "Understanding charges related to fraud, theft, and financial misconduct",
    category: "Criminal Defense",
    type: "guide",
    urgency: "high",
    languages: ["English", "Spanish"],
    readTime: "11 min",
    lastUpdated: "2024-11-29",
    popularity: 76
  }
];

const categories = [
  "All Categories",
  "Military Law",
  "Administrative Law", 
  "Security Clearance",
  "SHARP/EO",
  "International Law",
  "Family Law",
  "Court-Martial",
  "Criminal Defense"
];

const languages = [
  "All Languages",
  "English",
  "Spanish", 
  "German",
  "Japanese",
  "Korean",
  "Italian"
];

export default function LegalResourceHub() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedLanguage, setSelectedLanguage] = useState("All Languages");
  const [sortBy, setSortBy] = useState<"popularity" | "recent" | "relevance">("popularity");

  const filteredResources = legalResources
    .filter(resource => {
      const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           resource.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "All Categories" || resource.category === selectedCategory;
      const matchesLanguage = selectedLanguage === "All Languages" || resource.languages.includes(selectedLanguage);
      return matchesSearch && matchesCategory && matchesLanguage;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "popularity":
          return b.popularity - a.popularity;
        case "recent":
          return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
        default:
          return 0;
      }
    });

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "low": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "guide": return <BookOpen className="h-4 w-4" />;
      case "form": return <FileText className="h-4 w-4" />;
      case "faq": return <Users className="h-4 w-4" />;
      case "video": return <Users className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <BookOpen className="h-8 w-8 text-blue-600" />
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Legal Resource Hub
          </h2>
        </div>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Comprehensive legal resources, guides, and forms to support military personnel worldwide. 
          Available in multiple languages with regular updates from military legal experts.
        </p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search legal resources, guides, and forms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-800"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Language</label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-800"
                >
                  {languages.map(language => (
                    <option key={language} value={language}>{language}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "popularity" | "recent" | "relevance")}
                  className="w-full p-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-800"
                >
                  <option value="popularity">Most Popular</option>
                  <option value="recent">Most Recent</option>
                  <option value="relevance">Most Relevant</option>
                </select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Showing {filteredResources.length} of {legalResources.length} resources
        </p>
        <div className="flex items-center space-x-2">
          <Globe className="h-4 w-4 text-blue-600" />
          <span className="text-sm text-gray-600 dark:text-gray-300">
            Available in {languages.length - 1} languages
          </span>
        </div>
      </div>

      {/* Resource Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((resource) => (
          <Card key={resource.id} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  {getTypeIcon(resource.type)}
                  <Badge variant="outline" className="text-xs">
                    {resource.category}
                  </Badge>
                </div>
                <Badge className={`text-xs ${getUrgencyColor(resource.urgency)}`}>
                  {resource.urgency}
                </Badge>
              </div>
              
              <CardTitle className="text-lg leading-tight">
                {resource.title}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <CardDescription className="text-sm line-clamp-3">
                {resource.description}
              </CardDescription>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{resource.readTime}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-3 w-3 fill-current text-yellow-500" />
                    <span>{resource.popularity}%</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {resource.languages.slice(0, 3).map(lang => (
                    <Badge key={lang} variant="secondary" className="text-xs">
                      {lang}
                    </Badge>
                  ))}
                  {resource.languages.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{resource.languages.length - 3}
                    </Badge>
                  )}
                </div>
              </div>

              <Button className="w-full" size="sm">
                <span>Access Resource</span>
                <ArrowRight className="ml-2 h-3 w-3" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <h3 className="text-xl font-semibold">Need Immediate Legal Assistance?</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Connect with SGT Legal Ready for instant guidance or find a qualified defense attorney
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button className="bg-green-600 hover:bg-green-700">
                <MessageSquare className="mr-2 h-4 w-4" />
                Chat with SGT Legal Ready
              </Button>
              <Button variant="outline" asChild>
                <Link href="/find-attorneys">
                  <Scale className="mr-2 h-4 w-4" />
                  Find Defense Attorney
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}