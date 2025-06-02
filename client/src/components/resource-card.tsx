import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bookmark, Clock, FileText, Video } from "lucide-react";
import type { LegalResource } from "@shared/schema";

interface ResourceCardProps {
  resource: LegalResource;
}

export default function ResourceCard({ resource }: ResourceCardProps) {
  const getIcon = () => {
    if (resource.readTime.includes("course") || resource.readTime.includes("video")) {
      return <Video className="w-4 h-4 mr-1" />;
    }
    if (resource.readTime.includes("forms")) {
      return <FileText className="w-4 h-4 mr-1" />;
    }
    return <Clock className="w-4 h-4 mr-1" />;
  };

  return (
    <Card className="bg-white hover:shadow-lg transition-shadow border border-gray-200 overflow-hidden h-full hover-lift animate-fade-in transition-smooth">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Badge 
              variant="secondary" 
              className={resource.isPremium 
                ? "bg-military-gold-100 text-military-gold-800" 
                : "bg-emerald-100 text-emerald-800"
              }
            >
              {resource.isPremium ? "PREMIUM" : "FREE"}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {resource.category}
            </Badge>
          </div>
          <Button variant="ghost" size="sm" className="p-0 hover-scale transition-smooth">
            <Bookmark className="w-4 h-4 text-gray-300 hover:text-navy-800 transition-smooth" />
          </Button>
        </div>
        
        <h4 className="font-semibold text-lg text-gray-900 mb-3 line-clamp-2">
          {resource.title}
        </h4>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {resource.content}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-xs text-gray-500">
            {getIcon()}
            <span>{resource.readTime}</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            className="text-navy-800 hover:text-navy-900 font-medium text-sm p-0 hover-glow transition-smooth"
          >
            {resource.isPremium && resource.readTime.includes("course") 
              ? "View Course →" 
              : resource.readTime.includes("forms")
              ? "Access Forms →"
              : "Read More →"
            }
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
