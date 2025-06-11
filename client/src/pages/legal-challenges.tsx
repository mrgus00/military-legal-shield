import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trophy, Star, Award, Target, Clock, Users, Zap, Shield, BookOpen, CheckCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { LegalChallenge, AchievementBadge, UserChallengeProgress, UserGameStats } from "@shared/schema";

interface ChallengeWithProgress extends LegalChallenge {
  userProgress?: UserChallengeProgress;
}

export default function LegalChallenges() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [selectedBranch, setSelectedBranch] = useState<string>("all");
  const queryClient = useQueryClient();

  // Mock user ID for demo purposes
  const userId = "demo-user";

  const { data: challenges = [], isLoading: challengesLoading } = useQuery({
    queryKey: ["/api/challenges", selectedCategory, selectedDifficulty, selectedBranch],
    queryFn: () => apiRequest("GET", `/api/challenges?${new URLSearchParams({
      ...(selectedCategory !== "all" && { category: selectedCategory }),
      ...(selectedDifficulty !== "all" && { difficulty: selectedDifficulty }),
      ...(selectedBranch !== "all" && { branch: selectedBranch })
    })}`),
  });

  const { data: userProgress = [] } = useQuery({
    queryKey: ["/api/user/progress", userId],
    queryFn: () => apiRequest("GET", `/api/user/${userId}/progress`),
  });

  const { data: userBadges = [] } = useQuery({
    queryKey: ["/api/user/badges", userId],
    queryFn: () => apiRequest("GET", `/api/user/${userId}/badges`),
  });

  const { data: allBadges = [] } = useQuery({
    queryKey: ["/api/badges"],
    queryFn: () => apiRequest("GET", "/api/badges"),
  });

  const { data: userStats } = useQuery({
    queryKey: ["/api/user/stats", userId],
    queryFn: () => apiRequest("GET", `/api/user/${userId}/stats`),
  });

  const startChallengeMutation = useMutation({
    mutationFn: async (challengeId: number) => {
      return apiRequest("POST", `/api/user/${userId}/progress`, {
        challengeId,
        status: "in_progress",
        startedAt: new Date(),
        currentStep: 1
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/progress", userId] });
    },
  });

  const updateProgressMutation = useMutation({
    mutationFn: async ({ progressId, updates }: { progressId: number; updates: any }) => {
      return apiRequest("PATCH", `/api/progress/${progressId}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/progress", userId] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/stats", userId] });
    },
  });

  // Combine challenges with user progress
  const challengesWithProgress: ChallengeWithProgress[] = challenges.map((challenge: LegalChallenge) => ({
    ...challenge,
    userProgress: userProgress.find((p: UserChallengeProgress) => p.challengeId === challenge.id)
  }));

  const getProgressPercentage = (challenge: ChallengeWithProgress) => {
    if (!challenge.userProgress) return 0;
    return Math.round((challenge.userProgress.currentStep / challenge.totalSteps) * 100);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "bg-green-500";
      case "intermediate": return "bg-yellow-500";
      case "advanced": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "military_law": return <Shield className="w-4 h-4" />;
      case "court_martial": return <Target className="w-4 h-4" />;
      case "administrative": return <BookOpen className="w-4 h-4" />;
      case "benefits": return <Award className="w-4 h-4" />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  const handleStartChallenge = (challengeId: number) => {
    startChallengeMutation.mutate(challengeId);
  };

  const handleContinueChallenge = (progressId: number, currentStep: number) => {
    updateProgressMutation.mutate({
      progressId,
      updates: { currentStep: currentStep + 1 }
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Legal Preparedness Challenges
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Sharpen your military legal knowledge through interactive challenges and earn achievement badges
        </p>
      </div>

      {/* User Stats Overview */}
      {userStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Trophy className="w-6 h-6 text-yellow-500" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Points</p>
                  <p className="text-2xl font-bold">{userStats.totalPoints || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
                  <p className="text-2xl font-bold">{userStats.challengesCompleted || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Zap className="w-6 h-6 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Current Streak</p>
                  <p className="text-2xl font-bold">{userStats.currentStreak || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Award className="w-6 h-6 text-purple-500" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Badges Earned</p>
                  <p className="text-2xl font-bold">{userBadges.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="challenges" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
          <TabsTrigger value="badges">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="challenges" className="space-y-6">
          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="military_law">Military Law</SelectItem>
                <SelectItem value="court_martial">Court Martial</SelectItem>
                <SelectItem value="administrative">Administrative</SelectItem>
                <SelectItem value="benefits">Benefits & Claims</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedBranch} onValueChange={setSelectedBranch}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select branch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Branches</SelectItem>
                <SelectItem value="army">Army</SelectItem>
                <SelectItem value="navy">Navy</SelectItem>
                <SelectItem value="air_force">Air Force</SelectItem>
                <SelectItem value="marines">Marines</SelectItem>
                <SelectItem value="coast_guard">Coast Guard</SelectItem>
                <SelectItem value="space_force">Space Force</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Challenges Grid */}
          {challengesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {challengesWithProgress.map((challenge) => {
                const progressPercentage = getProgressPercentage(challenge);
                const isCompleted = challenge.userProgress?.status === "completed";
                const isInProgress = challenge.userProgress?.status === "in_progress";

                return (
                  <Card key={challenge.id} className={`transition-all hover:shadow-lg ${isCompleted ? 'border-green-200 bg-green-50 dark:bg-green-900/20' : ''}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg flex items-center gap-2">
                          {getCategoryIcon(challenge.category)}
                          {challenge.title}
                        </CardTitle>
                        <div className="flex gap-2">
                          <Badge className={`${getDifficultyColor(challenge.difficulty)} text-white`}>
                            {challenge.difficulty}
                          </Badge>
                          {challenge.branch && (
                            <Badge variant="outline">{challenge.branch}</Badge>
                          )}
                        </div>
                      </div>
                      <CardDescription>{challenge.description}</CardDescription>
                    </CardHeader>

                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {challenge.estimatedDuration} min
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="w-4 h-4" />
                            {challenge.pointsReward} points
                          </span>
                        </div>

                        {isInProgress && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Progress</span>
                              <span>{progressPercentage}%</span>
                            </div>
                            <Progress value={progressPercentage} />
                          </div>
                        )}

                        {isCompleted && (
                          <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                            <CheckCircle className="w-4 h-4" />
                            <span className="text-sm font-medium">Completed!</span>
                          </div>
                        )}
                      </div>
                    </CardContent>

                    <CardFooter>
                      {!challenge.userProgress ? (
                        <Button 
                          onClick={() => handleStartChallenge(challenge.id)}
                          disabled={startChallengeMutation.isPending}
                          className="w-full"
                        >
                          Start Challenge
                        </Button>
                      ) : isInProgress ? (
                        <Button 
                          onClick={() => handleContinueChallenge(challenge.userProgress!.id, challenge.userProgress!.currentStep)}
                          disabled={updateProgressMutation.isPending}
                          className="w-full"
                        >
                          Continue Challenge
                        </Button>
                      ) : (
                        <Button variant="outline" disabled className="w-full">
                          Challenge Completed
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="badges" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allBadges.map((badge: AchievementBadge) => {
              const isEarned = userBadges.some((userBadge: any) => userBadge.badgeId === badge.id);
              
              return (
                <Card key={badge.id} className={`transition-all ${isEarned ? 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20' : 'opacity-60'}`}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isEarned ? 'bg-yellow-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
                        <Award className={`w-6 h-6 ${isEarned ? 'text-white' : 'text-gray-500'}`} />
                      </div>
                      <div>
                        <p className="font-semibold">{badge.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{badge.category}</p>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{badge.description}</p>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-medium">{badge.pointsReward} points</span>
                    </div>
                  </CardContent>
                  {isEarned && (
                    <CardFooter>
                      <Badge className="bg-green-500 text-white">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Earned
                      </Badge>
                    </CardFooter>
                  )}
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}