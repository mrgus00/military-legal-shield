import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Trophy, 
  Star, 
  Award, 
  Target, 
  Zap, 
  Crown, 
  Shield, 
  BookOpen,
  Users,
  Clock
} from "lucide-react";
import type { Achievement, UserAchievement } from "@shared/schema";

interface AchievementBadgeProps {
  achievement: Achievement;
  userAchievement?: UserAchievement;
  isEarned?: boolean;
  showProgress?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function AchievementBadge({ 
  achievement, 
  userAchievement, 
  isEarned = false, 
  showProgress = false,
  size = "md" 
}: AchievementBadgeProps) {
  const getIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'trophy':
        return Trophy;
      case 'star':
        return Star;
      case 'award':
        return Award;
      case 'target':
        return Target;
      case 'zap':
        return Zap;
      case 'crown':
        return Crown;
      case 'shield':
        return Shield;
      case 'bookopen':
        return BookOpen;
      case 'users':
        return Users;
      case 'clock':
        return Clock;
      default:
        return Award;
    }
  };

  const getColorClasses = (color: string, earned: boolean) => {
    if (!earned) {
      return {
        card: "bg-gray-100 border-gray-200",
        icon: "bg-gray-300 text-gray-500",
        badge: "bg-gray-100 text-gray-500"
      };
    }

    switch (color) {
      case 'gold':
        return {
          card: "bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-300",
          icon: "bg-gradient-to-br from-yellow-400 to-yellow-600 text-white",
          badge: "bg-yellow-100 text-yellow-800"
        };
      case 'silver':
        return {
          card: "bg-gradient-to-br from-gray-50 to-gray-100 border-gray-300",
          icon: "bg-gradient-to-br from-gray-400 to-gray-600 text-white",
          badge: "bg-gray-100 text-gray-800"
        };
      case 'bronze':
        return {
          card: "bg-gradient-to-br from-orange-50 to-orange-100 border-orange-300",
          icon: "bg-gradient-to-br from-orange-400 to-orange-600 text-white",
          badge: "bg-orange-100 text-orange-800"
        };
      case 'purple':
        return {
          card: "bg-gradient-to-br from-purple-50 to-purple-100 border-purple-300",
          icon: "bg-gradient-to-br from-purple-400 to-purple-600 text-white",
          badge: "bg-purple-100 text-purple-800"
        };
      case 'green':
        return {
          card: "bg-gradient-to-br from-green-50 to-green-100 border-green-300",
          icon: "bg-gradient-to-br from-green-400 to-green-600 text-white",
          badge: "bg-green-100 text-green-800"
        };
      default:
        return {
          card: "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-300",
          icon: "bg-gradient-to-br from-blue-400 to-blue-600 text-white",
          badge: "bg-blue-100 text-blue-800"
        };
    }
  };

  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'sm':
        return {
          card: "p-3",
          icon: "w-8 h-8 p-1.5",
          iconSize: "w-5 h-5",
          title: "text-sm font-medium",
          description: "text-xs",
          points: "text-xs"
        };
      case 'lg':
        return {
          card: "p-6",
          icon: "w-16 h-16 p-3",
          iconSize: "w-10 h-10",
          title: "text-xl font-bold",
          description: "text-base",
          points: "text-base"
        };
      default:
        return {
          card: "p-4",
          icon: "w-12 h-12 p-2.5",
          iconSize: "w-7 h-7",
          title: "text-lg font-semibold",
          description: "text-sm",
          points: "text-sm"
        };
    }
  };

  const IconComponent = getIcon(achievement.icon);
  const colors = getColorClasses(achievement.badgeColor || 'blue', isEarned);
  const sizes = getSizeClasses(size);

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString();
  };

  return (
    <Card className={`${colors.card} transition-all duration-300 hover:shadow-lg ${
      isEarned ? 'hover:scale-105' : 'opacity-75'
    }`}>
      <CardContent className={sizes.card}>
        <div className="flex items-start gap-3">
          <div className={`${colors.icon} ${sizes.icon} rounded-full flex items-center justify-center flex-shrink-0`}>
            <IconComponent className={sizes.iconSize} />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h3 className={`${sizes.title} text-gray-900 truncate`}>
                {achievement.title}
              </h3>
              <Badge variant="secondary" className={`${colors.badge} ml-2 flex-shrink-0`}>
                +{achievement.points}
              </Badge>
            </div>
            
            <p className={`${sizes.description} text-gray-600 mb-2`}>
              {achievement.description}
            </p>
            
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-xs">
                {achievement.category}
              </Badge>
              
              {isEarned && userAchievement?.earnedAt && (
                <span className="text-xs text-gray-500">
                  Earned {formatDate(userAchievement.earnedAt)}
                </span>
              )}
            </div>
            
            {showProgress && userAchievement?.progress !== undefined && (
              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Progress</span>
                  <span>{userAchievement.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      achievement.badgeColor === 'gold' ? 'bg-yellow-500' :
                      achievement.badgeColor === 'silver' ? 'bg-gray-500' :
                      achievement.badgeColor === 'bronze' ? 'bg-orange-500' :
                      'bg-blue-500'
                    }`}
                    style={{ width: `${userAchievement.progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}