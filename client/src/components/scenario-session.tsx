import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  Clock, 
  Target, 
  CheckCircle, 
  AlertCircle,
  ArrowLeft,
  Send,
  Trophy,
  BookOpen,
  Lightbulb
} from "lucide-react";
import { LegalScenario, ScenarioSession } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

interface ScenarioSessionProps {
  scenarioId: number;
  onBack: () => void;
}

interface DecisionResponse {
  response: string;
  consequences: string;
  nextOptions: string[];
  score: number;
  feedback?: string;
  session?: ScenarioSession;
}

export default function ScenarioSessionComponent({ scenarioId, onBack }: ScenarioSessionProps) {
  const [currentSession, setCurrentSession] = useState<ScenarioSession | null>(null);
  const [userDecision, setUserDecision] = useState("");
  const [decisionHistory, setDecisionHistory] = useState<DecisionResponse[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [totalScore, setTotalScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  
  const queryClient = useQueryClient();

  const { data: scenario, isLoading: scenarioLoading } = useQuery({
    queryKey: [`/api/scenarios/${scenarioId}`],
  });

  const createSessionMutation = useMutation({
    mutationFn: async (scenarioId: number) => {
      return await apiRequest('POST', '/api/scenario-sessions', {
        scenarioId,
        totalSteps: 5,
        currentStep: 1,
        status: 'in_progress'
      });
    },
    onSuccess: (session) => {
      setCurrentSession(session);
    }
  });

  const makeDecisionMutation = useMutation({
    mutationFn: async ({ sessionId, decision }: { sessionId: number; decision: string }) => {
      return await apiRequest('POST', `/api/scenario-sessions/${sessionId}/decision`, {
        decision
      });
    },
    onSuccess: (response: DecisionResponse) => {
      setDecisionHistory(prev => [...prev, response]);
      setCurrentStep(prev => prev + 1);
      setTotalScore(prev => prev + response.score);
      setUserDecision("");
      setSelectedOption("");
      
      if (currentStep >= 4) {
        completeSessionMutation.mutate({
          sessionId: currentSession!.id,
          score: Math.round((totalScore + response.score) / 5)
        });
      }
    }
  });

  const completeSessionMutation = useMutation({
    mutationFn: async ({ sessionId, score }: { sessionId: number; score: number }) => {
      return await apiRequest('POST', `/api/scenario-sessions/${sessionId}/complete`, {
        score
      });
    },
    onSuccess: () => {
      setIsCompleted(true);
      queryClient.invalidateQueries({ queryKey: ['/api/scenario-sessions'] });
    }
  });

  useEffect(() => {
    if (scenario && !currentSession) {
      createSessionMutation.mutate(scenarioId);
    }
  }, [scenario, currentSession, scenarioId]);

  const handleDecisionSubmit = () => {
    const decision = selectedOption || userDecision;
    if (!decision.trim() || !currentSession) return;

    makeDecisionMutation.mutate({
      sessionId: currentSession.id,
      decision: decision.trim()
    });
  };

  const getProgressPercentage = () => {
    return ((currentStep - 1) / 5) * 100;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getCurrentAverageScore = () => {
    if (decisionHistory.length === 0) return 0;
    const total = decisionHistory.reduce((sum, decision) => sum + decision.score, 0);
    return Math.round(total / decisionHistory.length);
  };

  if (scenarioLoading || !scenario) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (isCompleted) {
    const finalScore = Math.round(totalScore / Math.max(decisionHistory.length, 1));
    const completedSession = currentSession;
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Scenarios
          </Button>
        </div>

        <Card className="border-green-200 bg-green-50">
          <CardHeader className="text-center">
            <Trophy className="h-12 w-12 mx-auto text-green-600 mb-4" />
            <CardTitle className="text-2xl text-green-800">
              Scenario Completed!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">
                {finalScore}%
              </div>
              <p className="text-green-700">Final Score</p>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-gray-900">{decisionHistory.length}</div>
                <p className="text-sm text-gray-600">Decisions Made</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {scenario.estimatedTime || 15}m
                </div>
                <p className="text-sm text-gray-600">Time Invested</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{currentStep - 1}/5</div>
                <p className="text-sm text-gray-600">Steps Completed</p>
              </div>
            </div>

            {completedSession?.feedback && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Lightbulb className="h-5 w-5 text-yellow-600" />
                    AI Feedback & Learning Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    <p className="whitespace-pre-wrap">{completedSession.feedback}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex gap-4">
              <Button onClick={onBack} className="flex-1">
                <BookOpen className="h-4 w-4 mr-2" />
                Try Another Scenario
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.location.reload()}
                className="flex-1"
              >
                <Brain className="h-4 w-4 mr-2" />
                Restart This Scenario
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const latestResponse = decisionHistory[decisionHistory.length - 1];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Scenarios
        </Button>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Step {currentStep} of 5
          </Badge>
          <Badge variant="secondary" className={getScoreColor(getCurrentAverageScore())}>
            <Target className="h-3 w-3 mr-1" />
            {getCurrentAverageScore()}% Average
          </Badge>
        </div>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-gray-600">{Math.round(getProgressPercentage())}%</span>
          </div>
          <Progress value={getProgressPercentage()} className="h-2" />
        </CardContent>
      </Card>

      {/* Scenario */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-600" />
            {scenario.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none">
            <p className="whitespace-pre-wrap">{scenario.scenario}</p>
          </div>
        </CardContent>
      </Card>

      {/* Previous Responses */}
      {decisionHistory.map((decision, index) => (
        <Card key={index} className="border-l-4 border-l-blue-500">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="font-medium text-sm text-gray-700 mb-1">
                  Your Decision (Step {index + 1}):
                </p>
                <p className="text-sm bg-blue-50 p-3 rounded border border-blue-200">
                  {decision.session?.decisions?.[index]}
                </p>
              </div>
              <Badge 
                variant="secondary" 
                className={`ml-4 ${getScoreColor(decision.score)}`}
              >
                {decision.score}%
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div>
                <p className="font-medium text-sm text-gray-700 mb-1">AI Response:</p>
                <p className="text-sm text-gray-600">{decision.response}</p>
              </div>
              
              {decision.consequences && (
                <div>
                  <p className="font-medium text-sm text-gray-700 mb-1">Consequences:</p>
                  <p className="text-sm text-gray-600">{decision.consequences}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Current Decision */}
      {!isCompleted && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {latestResponse ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-yellow-600" />
              )}
              {latestResponse ? "Next Decision Point" : "Your Decision"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {latestResponse?.nextOptions && latestResponse.nextOptions.length > 0 ? (
              <div className="space-y-3">
                <p className="text-sm text-gray-600 mb-3">
                  Based on your previous decision, here are your options:
                </p>
                {latestResponse.nextOptions.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedOption(option)}
                    className={`w-full text-left p-3 rounded border transition-colors ${
                      selectedOption === option
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-blue-600 font-medium text-sm">
                        {String.fromCharCode(65 + index)}.
                      </span>
                      <span className="text-sm">{option}</span>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  What is your decision in this legal scenario? Consider the legal implications, 
                  military regulations, and potential consequences.
                </p>
                <Textarea
                  value={userDecision}
                  onChange={(e) => setUserDecision(e.target.value)}
                  placeholder="Describe your decision and reasoning..."
                  rows={4}
                  className="resize-none"
                />
              </div>
            )}

            <Button
              onClick={handleDecisionSubmit}
              disabled={
                makeDecisionMutation.isPending || 
                (!selectedOption && !userDecision.trim())
              }
              className="w-full"
            >
              {makeDecisionMutation.isPending ? (
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
              Submit Decision
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}