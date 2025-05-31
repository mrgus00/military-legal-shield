import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Play, 
  Clock, 
  BookOpen, 
  Award, 
  Star,
  Users,
  CheckCircle,
  Lock,
  Trophy
} from "lucide-react";
import { Link } from "wouter";
import type { LearningPath, UserProgress } from "@shared/schema";

interface LearningPathCardProps {
  path: LearningPath;
  userProgress?: UserProgress;
  isLocked?: boolean;
}

export default function LearningPathCard({ path, userProgress, isLocked = false }: LearningPathCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const completionPercentage = userProgress 
    ? Math.round((userProgress.completedModules?.length || 0) / path.totalModules * 100)
    : 0;

  const isCompleted = userProgress?.completedAt !== null;
  const isStarted = userProgress?.currentModule && userProgress.currentModule > 1;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'hard':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'beginner':
        return BookOpen;
      case 'intermediate':
        return Star;
      case 'advanced':
        return Trophy;
      default:
        return BookOpen;
    }
  };

  const CategoryIcon = getCategoryIcon(path.category);

  return (
    <Card 
      className={`transition-all duration-300 hover:shadow-xl ${
        isHovered ? 'transform scale-105' : ''
      } ${isLocked ? 'opacity-60' : ''} ${isCompleted ? 'border-green-300 bg-green-50' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="relative">
        {isLocked && (
          <div className="absolute top-4 right-4">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
        )}
        
        {isCompleted && (
          <div className="absolute top-4 right-4">
            <div className="bg-green-500 rounded-full p-1">
              <CheckCircle className="h-4 w-4 text-white" />
            </div>
          </div>
        )}

        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-lg ${
              isCompleted ? 'bg-green-500' : 'bg-blue-500'
            }`}>
              <CategoryIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <Badge variant="outline" className={getDifficultyColor(path.difficulty)}>
                {path.difficulty}
              </Badge>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
          {path.title}
        </h3>
        
        <p className="text-gray-600 text-sm line-clamp-3 mb-4">
          {path.description}
        </p>

        {userProgress && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Progress</span>
              <span className="font-medium text-gray-900">{completionPercentage}%</span>
            </div>
            <Progress value={completionPercentage} className="h-2" />
            <div className="text-xs text-gray-500">
              {userProgress.completedModules?.length || 0} of {path.totalModules} modules completed
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <BookOpen className="h-4 w-4" />
            <span>{path.totalModules} modules</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="h-4 w-4" />
            <span>{path.estimatedHours}h total</span>
          </div>
        </div>

        {path.prerequisites && path.prerequisites.length > 0 && (
          <div>
            <p className="text-xs font-medium text-gray-700 mb-2">Prerequisites:</p>
            <div className="flex flex-wrap gap-1">
              {path.prerequisites.map((prereq, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {prereq}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {path.badge && (
          <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200">
            <Award className="h-5 w-5 text-yellow-600" />
            <div>
              <p className="text-sm font-medium text-yellow-800">Completion Reward</p>
              <p className="text-xs text-yellow-700">{path.badge} Badge</p>
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-gray-100">
          {isLocked ? (
            <Button disabled className="w-full">
              <Lock className="h-4 w-4 mr-2" />
              Complete Prerequisites
            </Button>
          ) : isCompleted ? (
            <Link href={`/learning-paths/${path.id}`}>
              <Button variant="outline" className="w-full">
                <Trophy className="h-4 w-4 mr-2" />
                Review Path
              </Button>
            </Link>
          ) : isStarted ? (
            <Link href={`/learning-paths/${path.id}`}>
              <Button className="w-full">
                <Play className="h-4 w-4 mr-2" />
                Continue Learning
              </Button>
            </Link>
          ) : (
            <Link href={`/learning-paths/${path.id}`}>
              <Button className="w-full">
                <Play className="h-4 w-4 mr-2" />
                Start Path
              </Button>
            </Link>
          )}
        </div>

        {userProgress && userProgress.totalScore > 0 && (
          <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-100">
            <span className="text-gray-600">Your Score</span>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="font-medium">{userProgress.totalScore} pts</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}