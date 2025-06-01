import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Clock, Info } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { imageService } from "@/lib/imageService";
import AttorneyVerificationBadge from "./attorney-verification-badge";
import SocialShare, { SharePresets } from "./social-share";
import type { Attorney } from "@shared/schema";

interface AttorneyCardProps {
  attorney: Attorney;
}

export default function AttorneyCard({ attorney }: AttorneyCardProps) {
  const { data: attorneyImages } = useQuery({
    queryKey: ["attorney-images"],
    queryFn: () => imageService.getAttorneyImages(),
  });

  const getAttorneyImage = () => {
    if (!attorneyImages || attorneyImages.length === 0) {
      return null;
    }
    // Use attorney ID to get consistent image
    const imageIndex = attorney.id % attorneyImages.length;
    return attorneyImages[imageIndex];
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
      />
    ));
  };

  const getSpecialtyColor = (specialty: string) => {
    switch (specialty) {
      case "Court-Martial Defense":
        return "bg-navy-100 text-navy-800";
      case "Security Clearance":
        return "bg-military-gold-100 text-military-gold-800";
      case "Appeals":
        return "bg-emerald-100 text-emerald-800";
      case "Administrative Law":
      case "Admin Separation":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="bg-gray-50 hover:shadow-lg transition-shadow border border-gray-200 h-full">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          {(() => {
            const attorneyImage = getAttorneyImage();
            return attorneyImage ? (
              <img 
                src={attorneyImage.urls.small}
                alt={attorneyImage.alt_description || `${attorney.firstName} ${attorney.lastName}`}
                className="w-16 h-16 rounded-full object-cover mr-4 bg-gray-200"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-navy-800 flex items-center justify-center mr-4">
                <span className="text-white font-semibold text-lg">
                  {attorney.firstName[0]}{attorney.lastName[0]}
                </span>
              </div>
            );
          })()}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-semibold text-lg text-gray-900">{attorney.title}</h4>
              <AttorneyVerificationBadge attorney={attorney} />
            </div>
            <p className="text-sm text-gray-600">Military Law Attorney</p>
            <div className="flex items-center mt-1">
              <div className="flex">
                {renderStars(attorney.rating)}
              </div>
              <span className="text-xs text-gray-500 ml-2">
                ({attorney.reviewCount} reviews)
              </span>
            </div>
          </div>
        </div>
        
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Specialties:</p>
          <div className="flex flex-wrap gap-2">
            {attorney.specialties.map((specialty, index) => (
              <Badge 
                key={index}
                variant="secondary" 
                className={`text-xs ${getSpecialtyColor(specialty)}`}
              >
                {specialty}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <span className="flex items-center">
            <MapPin className="w-4 h-4 mr-1" />
            {attorney.location}
          </span>
          <span className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {attorney.experience}
          </span>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            className="flex-1 bg-navy-800 hover:bg-navy-900 text-white text-sm font-medium"
          >
            Contact Attorney
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3"
          >
            <Info className="w-4 h-4" />
          </Button>
          <SocialShare 
            {...SharePresets.attorney(
              `${attorney.firstName} ${attorney.lastName}`,
              attorney.specialties.join(", ")
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
