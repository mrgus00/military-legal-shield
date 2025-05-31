import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Brain, 
  Play, 
  Clock, 
  Target, 
  Trophy, 
  BookOpen,
  Zap,
  Shield,
  Award,
  ChevronRight
} from "lucide-react";
import { LegalScenario } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

interface ScenarioSimulatorProps {
  onStartScenario?: (scenarioId: number) => void;
}

export default function ScenarioSimulator({ onStartScenario }: ScenarioSimulatorProps) {
  const [filters, setFilters] = useState({
    category: '',
    difficulty: '',
    branch: ''
  });
  
  const queryClient = useQueryClient();

  const { data: scenarios = [], isLoading } = useQuery({
    queryKey: ['/api/scenarios', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.category && filters.category !== 'all') params.append('category', filters.category);
      if (filters.difficulty && filters.difficulty !== 'all') params.append('difficulty', filters.difficulty);
      if (filters.branch && filters.branch !== 'all') params.append('branch', filters.branch);
      
      const response = await fetch(`/api/scenarios?${params}`);
      return response.json();
    }
  });

  const { data: sessions = [] } = useQuery({
    queryKey: ['/api/scenario-sessions'],
  });

  const generateScenarioMutation = useMutation({
    mutationFn: async (params: {
      category: string;
      difficulty: string;
      branch: string;
      topic?: string;
    }) => {
      return await apiRequest('POST', '/api/scenarios/generate', params);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/scenarios'] });
    }
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'court-martial':
        return Shield;
      case 'administrative':
        return BookOpen;
      case 'security clearance':
        return Award;
      default:
        return Target;
    }
  };

  const handleStartScenario = (scenario: LegalScenario) => {
    if (onStartScenario) {
      onStartScenario(scenario.id);
    }
  };

  const handleGenerateScenario = () => {
    generateScenarioMutation.mutate({
      category: filters.category || 'Court-Martial Defense',
      difficulty: filters.difficulty || 'intermediate',
      branch: filters.branch || 'All',
      topic: 'Military Legal Scenarios'
    });
  };

  const getCompletedScenarios = () => {
    return sessions.filter((session: any) => session.status === 'completed');
  };

  const getAverageScore = () => {
    const completed = getCompletedScenarios();
    if (completed.length === 0) return 0;
    const total = completed.reduce((sum: number, session: any) => sum + (session.score || 0), 0);
    return Math.round(total / completed.length);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">AI Scenarios</p>
                <p className="text-2xl font-bold">{scenarios.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium">Completed</p>
                <p className="text-2xl font-bold">{getCompletedScenarios().length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Average Score</p>
                <p className="text-2xl font-bold">{getAverageScore()}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium">In Progress</p>
                <p className="text-2xl font-bold">
                  {sessions.filter((s: any) => s.status === 'in_progress').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Generate */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI-Powered Legal Scenario Simulator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select value={filters.category} onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Court-Martial Defense">Court-Martial Defense</SelectItem>
                <SelectItem value="Administrative Law">Administrative Law</SelectItem>
                <SelectItem value="Security Clearance">Security Clearance</SelectItem>
                <SelectItem value="Military Justice">Military Justice</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.difficulty} onValueChange={(value) => setFilters(prev => ({ ...prev, difficulty: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.branch} onValueChange={(value) => setFilters(prev => ({ ...prev, branch: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Branch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Branches</SelectItem>
                <SelectItem value="Army">Army</SelectItem>
                <SelectItem value="Navy">Navy</SelectItem>
                <SelectItem value="Air Force">Air Force</SelectItem>
                <SelectItem value="Marines">Marines</SelectItem>
                <SelectItem value="Coast Guard">Coast Guard</SelectItem>
                <SelectItem value="Space Force">Space Force</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              onClick={handleGenerateScenario}
              disabled={generateScenarioMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {generateScenarioMutation.isPending ? (
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
              ) : (
                <Brain className="w-4 h-4 mr-2" />
              )}
              Generate New Scenario
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Scenarios Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {scenarios.map((scenario: LegalScenario) => {
          const IconComponent = getCategoryIcon(scenario.category);
          return (
            <Card key={scenario.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <IconComponent className="h-5 w-5 text-blue-600" />
                    <Badge variant="outline" className={getDifficultyColor(scenario.difficulty)}>
                      {scenario.difficulty}
                    </Badge>
                  </div>
                  {scenario.estimatedTime && (
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      {scenario.estimatedTime}m
                    </div>
                  )}
                </div>
                <CardTitle className="text-lg leading-tight">{scenario.title}</CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 line-clamp-3">
                  {scenario.description}
                </p>
                
                {scenario.learningObjectives && scenario.learningObjectives.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-gray-700 mb-1">Learning Objectives:</p>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {scenario.learningObjectives.slice(0, 2).map((objective, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-blue-600 mr-1">•</span>
                          {objective}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {scenario.tags && scenario.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {scenario.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                
                <Button 
                  onClick={() => handleStartScenario(scenario)}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Scenario
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {scenarios.length === 0 && !isLoading && (
        <Card>
          <CardContent className="text-center py-12">
            <Brain className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No scenarios found</h3>
            <p className="text-gray-500 mb-4">
              Try generating a new scenario or adjusting your filters.
            </p>
            <Button onClick={handleGenerateScenario} disabled={generateScenarioMutation.isPending}>
              <Brain className="w-4 h-4 mr-2" />
              Generate Your First Scenario
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}