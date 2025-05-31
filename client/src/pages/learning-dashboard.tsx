import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, 
  Star, 
  Clock, 
  Target,
  TrendingUp,
  BookOpen,
  Award,
  Filter,
  Search,
  Zap,
  Calendar,
  Users
} from "lucide-react";
import LearningPathCard from "@/components/learning-path-card";
import AchievementBadge from "@/components/achievement-badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { 
  LearningPath, 
  UserProgress, 
  Achievement, 
  UserAchievement, 
  LearningStats 
} from "@shared/schema";

export default function LearningDashboard() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: learningPaths = [], isLoading: pathsLoading } = useQuery<LearningPath[]>({
    queryKey: ['/api/learning-paths'],
  });

  const { data: userProgress = [] } = useQuery<UserProgress[]>({
    queryKey: ['/api/user-progress'],
  });

  const { data: achievements = [] } = useQuery<Achievement[]>({
    queryKey: ['/api/achievements'],
  });

  const { data: userAchievements = [] } = useQuery<UserAchievement[]>({
    queryKey: ['/api/user-achievements'],
  });

  const { data: learningStats } = useQuery<LearningStats>({
    queryKey: ['/api/learning-stats'],
  });

  // Create progress map
  const progressMap = userProgress.reduce((acc, progress) => {
    if (progress.pathId) {
      acc[progress.pathId] = progress;
    }
    return acc;
  }, {} as Record<number, UserProgress>);

  // Create achievements map
  const achievementsMap = userAchievements.reduce((acc, userAch) => {
    if (userAch.achievementId) {
      acc[userAch.achievementId] = userAch;
    }
    return acc;
  }, {} as Record<number, UserAchievement>);

  // Filter learning paths
  const filteredPaths = learningPaths.filter(path => {
    const matchesSearch = path.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         path.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || path.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Calculate statistics
  const totalPaths = learningPaths.length;
  const completedPaths = userProgress.filter(p => p.completedAt).length;
  const totalAchievements = achievements.length;
  const earnedAchievements = userAchievements.length;
  const currentLevel = learningStats?.level || 1;
  const experiencePoints = learningStats?.experiencePoints || 0;
  const currentStreak = learningStats?.currentStreak || 0;

  // XP needed for next level (example calculation)
  const xpForNextLevel = currentLevel * 1000;
  const xpProgress = (experiencePoints % 1000) / 10; // Convert to percentage

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Learning Dashboard</h1>
              <p className="text-blue-100">
                Master military law through gamified learning paths and earn achievements
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{currentLevel}</div>
                <div className="text-sm text-blue-200">Level</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{experiencePoints}</div>
                <div className="text-sm text-blue-200">XP</div>
              </div>
            </div>
          </div>

          {/* Level Progress */}
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-2">
              <span>Level {currentLevel}</span>
              <span>{experiencePoints} / {xpForNextLevel} XP</span>
            </div>
            <Progress value={xpProgress} className="h-3 bg-blue-700" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="bg-green-500 p-3 rounded-lg">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-900">{completedPaths}</p>
                  <p className="text-sm text-green-700">Paths Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="bg-yellow-500 p-3 rounded-lg">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-yellow-900">{earnedAchievements}</p>
                  <p className="text-sm text-yellow-700">Achievements</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="bg-purple-500 p-3 rounded-lg">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-900">{currentStreak}</p>
                  <p className="text-sm text-purple-700">Day Streak</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="bg-blue-500 p-3 rounded-lg">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-900">{learningStats?.totalHoursLearned || 0}</p>
                  <p className="text-sm text-blue-700">Hours Learned</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Achievements */}
        {earnedAchievements > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Trophy className="h-6 w-6 text-yellow-500" />
              Recent Achievements
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.slice(0, 3).map((achievement) => (
                <AchievementBadge
                  key={achievement.id}
                  achievement={achievement}
                  userAchievement={achievementsMap[achievement.id]}
                  isEarned={!!achievementsMap[achievement.id]}
                  size="sm"
                />
              ))}
            </div>
          </div>
        )}

        {/* Learning Paths Section */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-blue-600" />
            Learning Paths
          </h2>
          
          <div className="flex gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search paths..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Learning Paths Grid */}
        {pathsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <Skeleton className="h-3 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredPaths.length === 0 ? (
          <Card className="p-8 text-center">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No learning paths found</h3>
            <p className="text-gray-600">
              {searchTerm || selectedCategory !== "all" 
                ? "Try adjusting your search or filters" 
                : "Learning paths will appear here when available"}
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPaths.map((path) => (
              <LearningPathCard
                key={path.id}
                path={path}
                userProgress={progressMap[path.id]}
                isLocked={false} // You can implement prerequisite logic here
              />
            ))}
          </div>
        )}

        {/* All Achievements Section */}
        {achievements.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Award className="h-6 w-6 text-purple-600" />
              All Achievements
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map((achievement) => (
                <AchievementBadge
                  key={achievement.id}
                  achievement={achievement}
                  userAchievement={achievementsMap[achievement.id]}
                  isEarned={!!achievementsMap[achievement.id]}
                  showProgress={!achievementsMap[achievement.id]}
                  size="sm"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}