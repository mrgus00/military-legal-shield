import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Brain,
  Target,
  Clock,
  Trophy,
  Zap,
  Filter,
  Calendar,
  TrendingUp,
  Award,
  BookOpen
} from "lucide-react";
import MicroChallengeCard from "@/components/micro-challenge-card";
import DailyChallenge from "@/components/daily-challenge";
import type { MicroChallenge, ChallengeStats } from "@shared/schema";

export default function MicroChallenges() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");

  const { data: challenges = [] } = useQuery<MicroChallenge[]>({
    queryKey: ['/api/micro-challenges', { category: selectedCategory, difficulty: selectedDifficulty }],
  });

  const { data: challengeStats } = useQuery<ChallengeStats>({
    queryKey: ['/api/challenge-stats'],
  });

  const filteredChallenges = challenges.filter(challenge => {
    if (selectedCategory !== "all" && challenge.category !== selectedCategory) return false;
    if (selectedDifficulty !== "all" && challenge.difficulty !== selectedDifficulty) return false;
    return true;
  });

  const categories = ["all", "quiz", "scenario", "case-study", "true-false"];
  const difficulties = ["all", "easy", "medium", "hard"];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-500 p-3 rounded-full">
              <Brain className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Micro-Challenges
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Bite-sized interactive learning experiences to reinforce military law concepts 
            through quick quizzes, case scenarios, and knowledge retention exercises.
          </p>
        </div>

        {/* Challenge Stats Overview */}
        {challengeStats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="flex items-center justify-center mb-2">
                  <Trophy className="h-5 w-5 text-yellow-600 mr-2" />
                  <span className="text-2xl font-bold text-gray-900">
                    {challengeStats.totalChallengesCompleted}
                  </span>
                </div>
                <div className="text-sm text-gray-600">Challenges Completed</div>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="flex items-center justify-center mb-2">
                  <Target className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-2xl font-bold text-gray-900">
                    {challengeStats.averageScore}%
                  </span>
                </div>
                <div className="text-sm text-gray-600">Average Score</div>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="flex items-center justify-center mb-2">
                  <Zap className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="text-2xl font-bold text-gray-900">
                    {challengeStats.currentStreak}
                  </span>
                </div>
                <div className="text-sm text-gray-600">Current Streak</div>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="flex items-center justify-center mb-2">
                  <Clock className="h-5 w-5 text-purple-600 mr-2" />
                  <span className="text-2xl font-bold text-gray-900">
                    {challengeStats.fastestTime ? `${challengeStats.fastestTime}s` : '--'}
                  </span>
                </div>
                <div className="text-sm text-gray-600">Best Time</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content Tabs */}
        <Tabs defaultValue="daily" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="daily" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Daily Challenge
            </TabsTrigger>
            <TabsTrigger value="practice" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Practice Mode
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Statistics
            </TabsTrigger>
          </TabsList>

          {/* Daily Challenge Tab */}
          <TabsContent value="daily" className="space-y-6">
            <DailyChallenge />
          </TabsContent>

          {/* Practice Mode Tab */}
          <TabsContent value="practice" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Challenge Filters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Category
                    </label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>
                            {category === "all" ? "All Categories" : category.charAt(0).toUpperCase() + category.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Difficulty
                    </label>
                    <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        {difficulties.map(difficulty => (
                          <SelectItem key={difficulty} value={difficulty}>
                            {difficulty === "all" ? "All Difficulties" : difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Challenge Grid */}
            <div className="grid gap-6">
              {filteredChallenges.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No challenges found
                    </h3>
                    <p className="text-gray-600">
                      Try adjusting your filters to find more challenges.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredChallenges.map((challenge) => (
                  <MicroChallengeCard key={challenge.id} challenge={challenge} />
                ))
              )}
            </div>
          </TabsContent>

          {/* Statistics Tab */}
          <TabsContent value="stats" className="space-y-6">
            {challengeStats ? (
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      Performance Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-600">Total Challenges</span>
                          <span className="text-lg font-bold text-gray-900">
                            {challengeStats.totalChallengesCompleted}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-600">Correct Answers</span>
                          <span className="text-lg font-bold text-green-600">
                            {challengeStats.correctAnswers}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-600">Success Rate</span>
                          <span className="text-lg font-bold text-blue-600">
                            {challengeStats.totalChallengesCompleted > 0 
                              ? Math.round((challengeStats.correctAnswers / challengeStats.totalChallengesCompleted) * 100)
                              : 0}%
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-600">Current Streak</span>
                          <span className="text-lg font-bold text-orange-600">
                            {challengeStats.currentStreak} days
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-600">Longest Streak</span>
                          <span className="text-lg font-bold text-purple-600">
                            {challengeStats.longestStreak} days
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-600">Time Spent</span>
                          <span className="text-lg font-bold text-gray-900">
                            {Math.round(challengeStats.totalTimeSpent / 60)} min
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No statistics yet
                  </h3>
                  <p className="text-gray-600">
                    Complete some challenges to see your performance statistics.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}