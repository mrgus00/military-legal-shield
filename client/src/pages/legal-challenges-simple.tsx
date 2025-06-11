import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trophy, Star, Clock, Shield, Target, BookOpen, Award } from "lucide-react";

interface LegalChallenge {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  branch: string | null;
  timeLimit: number;
  passingScore: number;
  pointsReward: number;
  tags: string[];
  questions: Array<{
    question: string;
    options: string[];
    correct: number;
  }>;
}

export default function LegalChallenges() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [selectedBranch, setSelectedBranch] = useState<string>("all");

  const { data: challenges = [], isLoading, error } = useQuery({
    queryKey: ["/api/challenges"],
    queryFn: async () => {
      try {
        const response = await fetch("/api/challenges");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return Array.isArray(data) ? data : [];
      } catch (error) {
        console.error("Error fetching challenges:", error);
        return [];
      }
    },
  });

  const filteredChallenges = challenges.filter((challenge: LegalChallenge) => {
    if (selectedCategory !== "all" && challenge.category !== selectedCategory) return false;
    if (selectedDifficulty !== "all" && challenge.difficulty !== selectedDifficulty) return false;
    if (selectedBranch !== "all" && challenge.branch !== selectedBranch) return false;
    return true;
  });

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

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">Loading Legal Challenges...</h1>
          <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-600 mb-4">Error Loading Challenges</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Unable to load legal challenges. Please try refreshing the page.
          </p>
          <Button onClick={() => window.location.reload()}>
            Reload Page
          </Button>
        </div>
      </div>
    );
  }

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

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Trophy className="w-6 h-6 text-yellow-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Available Challenges</p>
                <p className="text-2xl font-bold">{challenges.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="w-6 h-6 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Categories</p>
                <p className="text-2xl font-bold">4</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="w-6 h-6 text-green-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Difficulty Levels</p>
                <p className="text-2xl font-bold">3</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Award className="w-6 h-6 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Achievement Badges</p>
                <p className="text-2xl font-bold">8</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div>
          <label className="block text-sm font-medium mb-2">Category</label>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="military_law">Military Law</SelectItem>
              <SelectItem value="court_martial">Court Martial</SelectItem>
              <SelectItem value="administrative">Administrative</SelectItem>
              <SelectItem value="benefits">Benefits</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Difficulty</label>
          <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
            <SelectTrigger>
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Military Branch</label>
          <Select value={selectedBranch} onValueChange={setSelectedBranch}>
            <SelectTrigger>
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
      </div>

      {/* Challenge Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredChallenges.map((challenge: LegalChallenge) => (
          <Card key={challenge.id} className="transition-all hover:shadow-lg">
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
                    {challenge.timeLimit} min
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    {challenge.pointsReward} points
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span>Passing Score: {challenge.passingScore}%</span>
                  <span>{challenge.questions?.length || 0} Questions</span>
                </div>

                {challenge.tags && challenge.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {challenge.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {challenge.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{challenge.tags.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}

                <Button className="w-full">
                  Start Challenge
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredChallenges.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            No challenges match your current filters.
          </p>
        </div>
      )}
    </div>
  );
}