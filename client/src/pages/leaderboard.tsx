import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, 
  Medal, 
  Crown, 
  Star, 
  TrendingUp,
  Users,
  Calendar,
  Target,
  Award,
  Zap,
  Shield,
  Flag
} from "lucide-react";

interface LeaderboardEntry {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
  points: number;
  level: number;
  rank: number;
  branch: string;
  streak: number;
  completedChallenges: number;
  lastActive: string;
  achievements: number;
}

interface BranchStats {
  branch: string;
  totalMembers: number;
  averageScore: number;
  topPerformer: string;
  weeklyGrowth: number;
}

export default function Leaderboard() {
  const [selectedTab, setSelectedTab] = useState("overall");

  useEffect(() => {
    document.title = "Leaderboard - MilitaryLegalShield";
    
    // Check for tab parameter in URL
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get('tab');
    if (tab && ['overall', 'weekly', 'branch', 'challenges'].includes(tab)) {
      setSelectedTab(tab);
    }
  }, []);

  // Mock leaderboard data - would normally come from API
  const mockLeaderboardData: LeaderboardEntry[] = [
    {
      id: "1",
      username: "sgtlegal123",
      displayName: "Sergeant Thompson",
      points: 2850,
      level: 15,
      rank: 1,
      branch: "Army",
      streak: 12,
      completedChallenges: 45,
      lastActive: "2 hours ago",
      achievements: 18
    },
    {
      id: "2", 
      username: "navylawyer",
      displayName: "Petty Officer Rodriguez",
      points: 2720,
      level: 14,
      rank: 2,
      branch: "Navy",
      streak: 8,
      completedChallenges: 42,
      lastActive: "5 hours ago",
      achievements: 16
    },
    {
      id: "3",
      username: "airforcejag",
      displayName: "Staff Sergeant Chen",
      points: 2680,
      level: 13,
      rank: 3,
      branch: "Air Force",
      streak: 15,
      completedChallenges: 38,
      lastActive: "1 hour ago",
      achievements: 15
    },
    {
      id: "4",
      username: "marinelaw",
      displayName: "Corporal Davis",
      points: 2540,
      level: 12,
      rank: 4,
      branch: "Marines",
      streak: 6,
      completedChallenges: 35,
      lastActive: "3 hours ago",
      achievements: 14
    },
    {
      id: "5",
      username: "coastguard",
      displayName: "Seaman Johnson",
      points: 2420,
      level: 11,
      rank: 5,
      branch: "Coast Guard",
      streak: 9,
      completedChallenges: 32,
      lastActive: "4 hours ago",
      achievements: 12
    }
  ];

  const mockBranchStats: BranchStats[] = [
    {
      branch: "Army",
      totalMembers: 1250,
      averageScore: 1840,
      topPerformer: "Sergeant Thompson",
      weeklyGrowth: 12.5
    },
    {
      branch: "Navy", 
      totalMembers: 980,
      averageScore: 1720,
      topPerformer: "Petty Officer Rodriguez",
      weeklyGrowth: 8.3
    },
    {
      branch: "Air Force",
      totalMembers: 850,
      averageScore: 1680,
      topPerformer: "Staff Sergeant Chen",
      weeklyGrowth: 15.2
    },
    {
      branch: "Marines",
      totalMembers: 720,
      averageScore: 1620,
      topPerformer: "Corporal Davis",
      weeklyGrowth: 6.8
    },
    {
      branch: "Coast Guard",
      totalMembers: 180,
      averageScore: 1580,
      topPerformer: "Seaman Johnson",
      weeklyGrowth: 18.9
    }
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <div className="w-6 h-6 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-full text-sm font-semibold">{rank}</div>;
    }
  };

  const getBranchIcon = (branch: string) => {
    const iconClass = "w-5 h-5";
    switch (branch) {
      case "Army":
        return <Star className={`${iconClass} text-green-600`} />;
      case "Navy":
        return <Flag className={`${iconClass} text-blue-600`} />;
      case "Air Force":
        return <Zap className={`${iconClass} text-sky-600`} />;
      case "Marines":
        return <Shield className={`${iconClass} text-red-600`} />;
      case "Coast Guard":
        return <Target className={`${iconClass} text-orange-600`} />;
      default:
        return <Users className={`${iconClass} text-gray-600`} />;
    }
  };

  const getBranchColor = (branch: string) => {
    switch (branch) {
      case "Army": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Navy": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "Air Force": return "bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200";
      case "Marines": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "Coast Guard": return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="w-8 h-8 text-yellow-500" />
            <h1 className="text-3xl font-bold">Military Legal Shield Leaderboard</h1>
            <Trophy className="w-8 h-8 text-yellow-500" />
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Celebrate the achievements of our most dedicated service members learning military law and building their legal knowledge.
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">3,980</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Participants</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">12,450</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Challenges Completed</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">+285</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">New This Week</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Award className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">1,825</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Achievements Earned</div>
            </CardContent>
          </Card>
        </div>

        {/* Leaderboard Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overall">Overall Rankings</TabsTrigger>
            <TabsTrigger value="weekly">Weekly Leaders</TabsTrigger>
            <TabsTrigger value="branch">Branch Rankings</TabsTrigger>
            <TabsTrigger value="challenges">Challenge Masters</TabsTrigger>
          </TabsList>

          <TabsContent value="overall" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Overall Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockLeaderboardData.map((entry) => (
                    <div key={entry.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          {getRankIcon(entry.rank)}
                        </div>
                        
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={entry.avatar} />
                          <AvatarFallback>{entry.displayName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        
                        <div>
                          <div className="font-semibold">{entry.displayName}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">@{entry.username}</div>
                        </div>
                        
                        <Badge className={getBranchColor(entry.branch)}>
                          <div className="flex items-center gap-1">
                            {getBranchIcon(entry.branch)}
                            {entry.branch}
                          </div>
                        </Badge>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-lg font-bold text-blue-600">{entry.points.toLocaleString()} pts</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Level {entry.level}</div>
                        <div className="text-xs text-gray-500">{entry.streak} day streak</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="weekly" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  This Week's Top Performers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockLeaderboardData.slice(0, 3).map((entry, index) => (
                    <div key={entry.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          {getRankIcon(index + 1)}
                        </div>
                        
                        <Avatar className="w-12 h-12">
                          <AvatarFallback>{entry.displayName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        
                        <div>
                          <div className="font-semibold text-lg">{entry.displayName}</div>
                          <div className="flex items-center gap-2">
                            <Badge className={getBranchColor(entry.branch)}>
                              {entry.branch}
                            </Badge>
                            <span className="text-sm text-gray-600">+{Math.floor(entry.points * 0.15)} pts this week</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-2xl font-bold text-yellow-600">{entry.points.toLocaleString()}</div>
                        <div className="text-sm text-gray-600">Weekly Leader</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="branch" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mockBranchStats.map((branch) => (
                <Card key={branch.branch}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {getBranchIcon(branch.branch)}
                      {branch.branch}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Total Members:</span>
                        <span className="font-semibold">{branch.totalMembers.toLocaleString()}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Average Score:</span>
                        <span className="font-semibold">{branch.averageScore.toLocaleString()}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Top Performer:</span>
                        <span className="font-semibold text-blue-600">{branch.topPerformer}</span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Weekly Growth:</span>
                          <span className="font-semibold text-green-600">+{branch.weeklyGrowth}%</span>
                        </div>
                        <Progress value={branch.weeklyGrowth} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="challenges" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Challenge Masters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockLeaderboardData.map((entry) => (
                    <div key={entry.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          {getRankIcon(entry.rank)}
                        </div>
                        
                        <Avatar className="w-10 h-10">
                          <AvatarFallback>{entry.displayName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        
                        <div>
                          <div className="font-semibold">{entry.displayName}</div>
                          <div className="flex items-center gap-2">
                            <Badge className={getBranchColor(entry.branch)}>
                              {entry.branch}
                            </Badge>
                            <span className="text-sm text-gray-600">{entry.achievements} achievements</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-lg font-bold text-purple-600">{entry.completedChallenges} challenges</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{entry.streak} day streak</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}