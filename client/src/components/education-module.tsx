import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { GraduationCap, Clock, Users, IdCard, Video, Crown } from "lucide-react";
import type { EducationModule as EducationModuleType } from "@shared/schema";

interface EducationModuleProps {
  module: EducationModuleType;
}

export default function EducationModule({ module }: EducationModuleProps) {
  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-emerald-100 text-emerald-800";
      case "Intermediate":
        return "bg-orange-100 text-orange-800";
      case "Advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getGradientColor = () => {
    if (module.isPremium) {
      return "from-military-gold-500 to-military-gold-400";
    }
    return "from-navy-800 to-navy-600";
  };

  const getIconColor = () => {
    if (module.isPremium) {
      return "text-navy-800";
    }
    return "text-white";
  };

  return (
    <Card className="bg-white hover:shadow-lg transition-shadow border border-gray-200 overflow-hidden h-full">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-12 h-12 bg-gradient-to-br ${getGradientColor()} rounded-lg flex items-center justify-center`}>
            <GraduationCap className={`${getIconColor()} w-6 h-6`} />
          </div>
          <div className="flex items-center space-x-2">
            <Badge 
              variant="secondary" 
              className={module.isPremium 
                ? "bg-military-gold-100 text-military-gold-800" 
                : "bg-emerald-100 text-emerald-800"
              }
            >
              {module.isPremium && <Crown className="w-3 h-3 mr-1" />}
              {module.isPremium ? "PREMIUM" : "FREE"}
            </Badge>
            <Badge variant="secondary" className={getLevelColor(module.level)}>
              {module.level}
            </Badge>
          </div>
        </div>
        
        <h4 className="font-semibold text-xl text-gray-900 mb-3">
          {module.title}
        </h4>
        
        <p className="text-gray-600 mb-4">
          {module.description}
        </p>
        
        <div className="flex items-center text-sm text-gray-500 mb-4 flex-wrap gap-4">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            <span>{module.duration}</span>
          </div>
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-2" />
            <span>{module.studentCount.toLocaleString()} students</span>
          </div>
          {module.hasVideo && (
            <div className="flex items-center">
              <Video className="w-4 h-4 mr-2" />
              <span>Video</span>
            </div>
          )}
          {module.hasCertificate && (
            <div className="flex items-center">
              <IdCard className="w-4 h-4 mr-2" />
              <span>IdCard</span>
            </div>
          )}
        </div>
        
        <div className="bg-gray-100 rounded-lg p-4 mb-4">
          <div className="flex justify-between items-center text-sm mb-2">
            <span className="text-gray-600">
              {module.isPremium ? "Requires Premium" : "Progress"}
            </span>
            <span className={module.isPremium ? "text-military-gold-600 font-medium" : "text-gray-600"}>
              {module.isPremium ? "Upgrade" : "0%"}
            </span>
          </div>
          <Progress 
            value={module.isPremium ? 0 : 0} 
            className="w-full h-2"
          />
        </div>
        
        <Button 
          className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
            module.isPremium 
              ? "bg-military-gold-500 hover:bg-military-gold-600 text-navy-800"
              : "bg-navy-800 hover:bg-navy-900 text-white"
          }`}
        >
          {module.isPremium ? "Upgrade to Access" : "Start Learning"}
        </Button>
      </CardContent>
    </Card>
  );
}
