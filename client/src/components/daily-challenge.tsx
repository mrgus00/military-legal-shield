import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar,
  Trophy,
  Flame,
  Clock,
  Target,
  Zap,
  CheckCircle
} from "lucide-react";
import MicroChallengeCard from "@/components/micro-challenge-card";
import type { DailyChallenge, MicroChallenge, ChallengeStats } from "@shared/schema";

export default function DailyChallenge() {
  const [challengeCompleted, setChallengeCompleted] = useState(false);
  const [completionResult, setCompletionResult] = useState<{ correct: boolean; timeSpent: number } | null>(null);

  const { data: dailyChallenge } = useQuery<DailyChallenge & { challenge: MicroChallenge }>({
    queryKey: ['/api/daily-challenge'],
  });

  const { data: challengeStats } = useQuery<ChallengeStats>({
    queryKey: ['/api/challenge-stats'],
  });

  const handleChallengeComplete = (correct: boolean, timeSpent: number) => {
    setChallengeCompleted(true);
    setCompletionResult({ correct, timeSpent });
  };

  if (!dailyChallenge) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </CardHeader>
        <CardContent>
          <div className="h-32 bg-gray-200 rounded"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Daily Challenge Header */}
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500 p-3 rounded-lg">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl text-blue-900">Daily Challenge</CardTitle>
                <p className="text-blue-700 text-sm">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
            
            {dailyChallenge.bonusPoints > 0 && (
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                +{dailyChallenge.bonusPoints} Bonus Points
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-2 text-sm text-blue-700">
              <Target className="h-4 w-4" />
              <span>Category: {dailyChallenge.category}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-blue-700">
              <Zap className="h-4 w-4" />
              <span>Difficulty: {dailyChallenge.difficulty}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-blue-700">
              <Flame className="h-4 w-4" />
              <span>Streak: {challengeStats?.currentStreak || 0} days</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Challenge Stats */}
      {challengeStats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{challengeStats.totalChallengesCompleted}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{challengeStats.averageScore}%</div>
              <div className="text-sm text-gray-600">Avg Score</div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-600">{challengeStats.longestStreak}</div>
              <div className="text-sm text-gray-600">Best Streak</div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-orange-600">
                {challengeStats.fastestTime ? `${challengeStats.fastestTime}s` : '--'}
              </div>
              <div className="text-sm text-gray-600">Fastest Time</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Challenge or Completion */}
      {!challengeCompleted ? (
        <MicroChallengeCard 
          challenge={dailyChallenge.challenge} 
          onComplete={handleChallengeComplete}
        />
      ) : (
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-green-500 p-4 rounded-full">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-green-900 mb-2">
              Daily Challenge Complete!
            </h3>
            
            <p className="text-green-700 mb-4">
              {completionResult?.correct 
                ? "Excellent work! You got it right." 
                : "Good effort! Check the explanation to learn more."}
            </p>
            
            <div className="flex justify-center gap-6 text-sm">
              <div className="text-center">
                <div className="font-semibold text-green-800">Result</div>
                <div className="text-green-600">
                  {completionResult?.correct ? 'Correct' : 'Incorrect'}
                </div>
              </div>
              
              <div className="text-center">
                <div className="font-semibold text-green-800">Time</div>
                <div className="text-green-600">
                  {completionResult?.timeSpent}s
                </div>
              </div>
              
              <div className="text-center">
                <div className="font-semibold text-green-800">Streak</div>
                <div className="text-green-600">
                  {(challengeStats?.currentStreak || 0) + (completionResult?.correct ? 1 : 0)} days
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <Button variant="outline" disabled>
                <Trophy className="h-4 w-4 mr-2" />
                Come Back Tomorrow
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Knowledge Retention Tips */}
      <Card className="bg-gray-50 border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-600" />
            Quick Learning Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Daily Practice</h4>
              <p className="text-gray-600">
                Complete daily challenges to build consistent learning habits and reinforce key military law concepts.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Review Explanations</h4>
              <p className="text-gray-600">
                Always read the explanations, even when you answer correctly, to deepen your understanding.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}