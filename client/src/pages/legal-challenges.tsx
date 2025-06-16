import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { 
  Trophy, 
  Star, 
  Clock, 
  Target, 
  Award, 
  BookOpen,
  Zap,
  Shield,
  CheckCircle,
  Lock,
  Play,
  Users,
  TrendingUp,
  Calendar,
  Search,
  Filter,
  Flame
} from "lucide-react";
import { Link } from "wouter";
import { apiRequest } from "@/lib/queryClient";

interface Challenge {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  branch: string;
  pointsValue: number;
  timeLimit: number;
  questions: any[];
  isCompleted: boolean;
  userScore?: number;
  userProgress?: any;
}

interface UserStats {
  totalPoints: number;
  currentStreak: number;
  longestStreak: number;
  totalChallengesCompleted: number;
  totalBadgesEarned: number;
  rank: string;
  level: number;
  experiencePoints: number;
  nextLevelPoints: number;
}

interface Badge {
  id: number;
  name: string;
  description: string;
  icon: string;
  tier: string;
  rarity: string;
  isEarned: boolean;
}

export default function LegalChallenges() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();

  const { data: challenges = [], isLoading: challengesLoading } = useQuery<Challenge[]>({
    queryKey: ["/api/legal-challenges"],
  });

  const { data: userStats, isLoading: statsLoading } = useQuery<UserStats>({
    queryKey: ["/api/user-stats"],
  });

  const { data: badges = [], isLoading: badgesLoading } = useQuery<Badge[]>({
    queryKey: ["/api/user-badges"],
  });

  const { data: dailyChallenge } = useQuery<Challenge>({
    queryKey: ["/api/daily-challenge"],
  });

  const categories = [
    { id: "all", name: "All Categories", icon: BookOpen },
    { id: "ucmj", name: "UCMJ Knowledge", icon: Shield },
    { id: "emergency", name: "Emergency Response", icon: Zap },
    { id: "document-prep", name: "Document Preparation", icon: BookOpen },
    { id: "scenario", name: "Legal Scenarios", icon: Target },
    { id: "financial", name: "Military Finance", icon: TrendingUp },
  ];

  const difficulties = [
    { id: "all", name: "All Levels" },
    { id: "beginner", name: "Beginner", color: "green" },
    { id: "intermediate", name: "Intermediate", color: "yellow" },
    { id: "advanced", name: "Advanced", color: "orange" },
    { id: "expert", name: "Expert", color: "red" },
  ];

  const ranks = [
    "Recruit", "Private", "Specialist", "Corporal", "Sergeant", 
    "Staff Sergeant", "Sergeant First Class", "Master Sergeant",
    "First Sergeant", "Sergeant Major", "Lieutenant", "Captain", 
    "Major", "Lieutenant Colonel", "Colonel", "General"
  ];

  const filteredChallenges = challenges.filter(challenge => {
    if (selectedCategory !== "all" && challenge.category !== selectedCategory) return false;
    if (selectedDifficulty !== "all" && challenge.difficulty !== selectedDifficulty) return false;
    if (searchTerm && !challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !challenge.description.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "bg-green-100 text-green-800";
      case "intermediate": return "bg-yellow-100 text-yellow-800";
      case "advanced": return "bg-orange-100 text-orange-800";
      case "expert": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryIcon = (category: string) => {
    const categoryData = categories.find(cat => cat.id === category);
    return categoryData ? categoryData.icon : BookOpen;
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common": return "text-gray-600";
      case "uncommon": return "text-green-600";
      case "rare": return "text-blue-600";
      case "epic": return "text-purple-600";
      case "legendary": return "text-yellow-600";
      default: return "text-gray-600";
    }
  };

  if (challengesLoading || statsLoading || badgesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                <Trophy className="w-10 h-10 text-blue-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-6">Legal Preparedness Challenges</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
              Master military legal knowledge through gamified challenges. Earn badges, climb ranks, and prepare for real-world legal situations.
            </p>
            
            {userStats && (
              <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                <div className="text-center">
                  <div className="text-3xl font-bold">{userStats.totalPoints}</div>
                  <div className="text-blue-100">Total Points</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">{userStats.rank}</div>
                  <div className="text-blue-100">Current Rank</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">{userStats.currentStreak}</div>
                  <div className="text-blue-100">Day Streak</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">{userStats.totalBadgesEarned}</div>
                  <div className="text-blue-100">Badges Earned</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Daily Challenge */}
      {dailyChallenge && (
        <section className="py-8 bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="border-l-4 border-l-orange-500 bg-gradient-to-r from-orange-50 to-yellow-50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-6 h-6 text-orange-600" />
                    <CardTitle className="text-xl">Daily Challenge</CardTitle>
                    <Badge className="bg-orange-100 text-orange-800">2x Points</Badge>
                  </div>
                  <Flame className="w-6 h-6 text-orange-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{dailyChallenge.title}</h3>
                    <p className="text-gray-600 mb-3">{dailyChallenge.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {dailyChallenge.timeLimit} min
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4" />
                        {dailyChallenge.pointsValue * 2} points
                      </span>
                    </div>
                  </div>
                  <Link href={`/legal-challenges/${dailyChallenge.id}`}>
                    <Button className="bg-orange-600 hover:bg-orange-700">
                      <Play className="w-4 h-4 mr-2" />
                      Start Challenge
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Progress Overview */}
      {userStats && (
        <section className="py-8 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Progress</h2>
            
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Level Progress */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    Level {userStats.level}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Progress to Level {userStats.level + 1}</span>
                      <span>{userStats.experiencePoints}/{userStats.nextLevelPoints} XP</span>
                    </div>
                    <Progress 
                      value={(userStats.experiencePoints / userStats.nextLevelPoints) * 100} 
                      className="h-2"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Streak Counter */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-orange-600" />
                    Streak
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">{userStats.currentStreak}</div>
                    <div className="text-sm text-gray-600">days active</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Best: {userStats.longestStreak} days
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Badges */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-yellow-600" />
                    Recent Badges
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 flex-wrap">
                    {badges.filter(badge => badge.isEarned).slice(0, 6).map((badge) => (
                      <div 
                        key={badge.id}
                        className={`w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-white ${getRarityColor(badge.rarity)}`}
                        title={badge.name}
                      >
                        <Award className="w-5 h-5" />
                      </div>
                    ))}
                    {badges.filter(badge => badge.isEarned).length === 0 && (
                      <div className="text-sm text-gray-500">Complete challenges to earn badges</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Filters */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-8">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search challenges..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md bg-white"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md bg-white"
              >
                {difficulties.map((difficulty) => (
                  <option key={difficulty.id} value={difficulty.id}>
                    {difficulty.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Category Quick Filters */}
          <div className="flex gap-2 flex-wrap mb-8">
            {categories.slice(1).map((category) => {
              const IconComponent = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(selectedCategory === category.id ? "all" : category.id)}
                  className="flex items-center gap-2"
                >
                  <IconComponent className="w-4 h-4" />
                  {category.name}
                </Button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Challenges Grid */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Available Challenges</h2>
            <div className="text-sm text-gray-600">
              {filteredChallenges.length} of {challenges.length} challenges
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredChallenges.map((challenge) => {
              const IconComponent = getCategoryIcon(challenge.category);
              return (
                <Card key={challenge.id} className={`hover:shadow-lg transition-shadow ${challenge.isCompleted ? 'border-green-200 bg-green-50' : ''}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${challenge.isCompleted ? 'bg-green-100' : 'bg-blue-100'}`}>
                          {challenge.isCompleted ? (
                            <CheckCircle className="w-6 h-6 text-green-600" />
                          ) : (
                            <IconComponent className="w-6 h-6 text-blue-600" />
                          )}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{challenge.title}</CardTitle>
                          <Badge className={getDifficultyColor(challenge.difficulty)}>
                            {challenge.difficulty}
                          </Badge>
                        </div>
                      </div>
                      {challenge.branch && challenge.branch !== "All" && (
                        <Badge variant="outline" className="text-xs">
                          {challenge.branch}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-gray-600 text-sm mb-4">{challenge.description}</p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {challenge.timeLimit} min
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="w-4 h-4" />
                          {challenge.pointsValue} points
                        </span>
                      </div>
                      
                      {challenge.isCompleted && challenge.userScore && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-green-600 font-medium">Completed</span>
                          <span className="text-green-600">{challenge.userScore}%</span>
                        </div>
                      )}
                      
                      <Link href={`/legal-challenges/${challenge.id}`}>
                        <Button 
                          className={`w-full ${challenge.isCompleted ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                        >
                          {challenge.isCompleted ? (
                            <>
                              <Trophy className="w-4 h-4 mr-2" />
                              Review Challenge
                            </>
                          ) : (
                            <>
                              <Play className="w-4 h-4 mr-2" />
                              Start Challenge
                            </>
                          )}
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredChallenges.length === 0 && (
            <div className="text-center py-12">
              <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No challenges found</h3>
              <p className="text-gray-600">Try adjusting your filters to see more challenges.</p>
            </div>
          )}
        </div>
      </section>

      {/* Leaderboard Preview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Leaderboard</h2>
            <p className="text-xl text-gray-600">See how you rank against other service members</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="p-6">
                <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Overall Ranking</h3>
                <p className="text-gray-600 text-sm mb-4">Compete with all service members across branches</p>
                <Link href="/leaderboard">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    View Rankings
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <Shield className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Branch Rankings</h3>
                <p className="text-gray-600 text-sm mb-4">See top performers in your military branch</p>
                <Link href="/leaderboard?tab=branch">
                  <Button className="bg-green-600 hover:bg-green-700">
                    Branch Leaders
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <Calendar className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Weekly Champions</h3>
                <p className="text-gray-600 text-sm mb-4">This week's most active participants</p>
                <Link href="/leaderboard?tab=weekly">
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    Weekly Leaders
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}