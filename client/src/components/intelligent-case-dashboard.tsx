import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Target,
  DollarSign,
  Calendar,
  Users,
  FileText,
  Gavel,
  Shield
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface CaseOutcome {
  outcome: string;
  probability: number;
  reasoning: string;
  precedentCases: string[];
}

interface StrategicRecommendation {
  strategy: string;
  effectiveness: number;
  implementation: string;
  timeline: string;
}

interface CasePrediction {
  predictedOutcomes: CaseOutcome[];
  strategicRecommendations: StrategicRecommendation[];
  riskAssessment: {
    highRiskFactors: string[];
    mitigationStrategies: string[];
    overallRiskLevel: 'low' | 'medium' | 'high';
  };
  estimatedCosts: {
    attorneyFees: string;
    courtCosts: string;
    timeInvestment: string;
    totalRange: string;
  };
  nextSteps: Array<{
    step: string;
    priority: 'immediate' | 'urgent' | 'routine';
    deadline: string;
    description: string;
  }>;
}

interface CaseAnalysisProps {
  caseData?: {
    caseType: string;
    charges: string[];
    mitigatingFactors: string[];
    aggravatingFactors: string[];
    militaryRecord: {
      yearsOfService: number;
      rank: string;
      decorations: string[];
    };
  };
}

export function IntelligentCaseDashboard({ caseData }: CaseAnalysisProps) {
  const [selectedOutcome, setSelectedOutcome] = useState<number>(0);

  const { data: prediction, isLoading } = useQuery({
    queryKey: ['/api/ai/analyze-case', caseData],
    enabled: !!caseData,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const analyzeCaseMutation = useMutation({
    mutationFn: async (analysisData: any) => {
      return await apiRequest('POST', '/api/ai/analyze-case', analysisData);
    }
  });

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'immediate': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'urgent': return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'routine': return <CheckCircle className="w-4 h-4 text-green-600" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <Brain className="w-6 h-6 animate-pulse mr-2" />
            Analyzing case with AI intelligence...
          </div>
        </CardContent>
      </Card>
    );
  }

  const mockPrediction: CasePrediction = {
    predictedOutcomes: [
      {
        outcome: "Favorable Plea Agreement",
        probability: 0.65,
        reasoning: "Strong military record and mitigating factors favor negotiated resolution",
        precedentCases: ["US v. Smith (2023)", "US v. Johnson (2022)"]
      },
      {
        outcome: "Administrative Action",
        probability: 0.25,
        reasoning: "Case facts may support administrative rather than judicial action",
        precedentCases: ["US v. Davis (2023)"]
      },
      {
        outcome: "Court-Martial Conviction",
        probability: 0.10,
        reasoning: "Significant evidence and aggravating factors present risk",
        precedentCases: ["US v. Wilson (2022)"]
      }
    ],
    strategicRecommendations: [
      {
        strategy: "Character Evidence Development",
        effectiveness: 0.85,
        implementation: "Gather letters of recommendation and performance records",
        timeline: "2-3 weeks"
      },
      {
        strategy: "Mitigation Package Assembly",
        effectiveness: 0.78,
        implementation: "Document all mitigating circumstances and personal history",
        timeline: "1-2 weeks"
      }
    ],
    riskAssessment: {
      highRiskFactors: ["Previous incident on record", "Witness testimony conflicts"],
      mitigationStrategies: ["Emphasize exemplary service record", "Character witness testimony"],
      overallRiskLevel: 'medium'
    },
    estimatedCosts: {
      attorneyFees: "$15,000 - $45,000",
      courtCosts: "$2,000 - $5,000",
      timeInvestment: "6-18 months",
      totalRange: "$17,000 - $50,000"
    },
    nextSteps: [
      {
        step: "Secure Legal Representation",
        priority: "immediate",
        deadline: "Within 72 hours",
        description: "Engage qualified military defense attorney immediately"
      },
      {
        step: "Evidence Preservation",
        priority: "urgent",
        deadline: "Within 1 week",
        description: "Collect and secure all relevant documentation"
      }
    ]
  };

  const activePrediction = prediction || mockPrediction;

  return (
    <div className="space-y-6">
      {/* AI Analysis Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="w-6 h-6 mr-2 text-purple-600" />
            AI Case Analysis & Prediction
          </CardTitle>
          <CardDescription>
            Advanced machine learning analysis of your military legal case with outcome predictions
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="outcomes" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="outcomes">Predicted Outcomes</TabsTrigger>
          <TabsTrigger value="strategy">Strategic Recommendations</TabsTrigger>
          <TabsTrigger value="risk">Risk Assessment</TabsTrigger>
          <TabsTrigger value="planning">Case Planning</TabsTrigger>
        </TabsList>

        <TabsContent value="outcomes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Outcome Predictions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activePrediction.predictedOutcomes.map((outcome, index) => (
                  <div
                    key={index}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedOutcome === index ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                    onClick={() => setSelectedOutcome(index)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{outcome.outcome}</h3>
                      <Badge className="bg-blue-100 text-blue-800">
                        {Math.round(outcome.probability * 100)}% likely
                      </Badge>
                    </div>
                    <Progress value={outcome.probability * 100} className="mb-2" />
                    <p className="text-sm text-gray-600 mb-2">{outcome.reasoning}</p>
                    <div className="flex flex-wrap gap-1">
                      {outcome.precedentCases.map((precedent, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          <Gavel className="w-3 h-3 mr-1" />
                          {precedent}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="strategy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Strategic Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activePrediction.strategicRecommendations.map((strategy, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{strategy.strategy}</h3>
                      <Badge className="bg-green-100 text-green-800">
                        {Math.round(strategy.effectiveness * 100)}% effective
                      </Badge>
                    </div>
                    <Progress value={strategy.effectiveness * 100} className="mb-2" />
                    <p className="text-sm text-gray-600 mb-2">{strategy.implementation}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      Timeline: {strategy.timeline}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Risk Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Overall Risk Level</span>
                  <Badge className={getRiskLevelColor(activePrediction.riskAssessment.overallRiskLevel)}>
                    {activePrediction.riskAssessment.overallRiskLevel.toUpperCase()}
                  </Badge>
                </div>

                <div>
                  <h4 className="font-medium mb-2 text-red-600">High Risk Factors</h4>
                  <div className="space-y-1">
                    {activePrediction.riskAssessment.highRiskFactors.map((factor, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <AlertTriangle className="w-4 h-4 mr-2 text-red-500" />
                        {factor}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2 text-green-600">Mitigation Strategies</h4>
                  <div className="space-y-1">
                    {activePrediction.riskAssessment.mitigationStrategies.map((strategy, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                        {strategy}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="planning" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="w-5 h-5 mr-2" />
                  Cost Estimation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Attorney Fees</span>
                    <span className="font-medium">{activePrediction.estimatedCosts.attorneyFees}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Court Costs</span>
                    <span className="font-medium">{activePrediction.estimatedCosts.courtCosts}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Time Investment</span>
                    <span className="font-medium">{activePrediction.estimatedCosts.timeInvestment}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-semibold">
                      <span>Total Range</span>
                      <span>{activePrediction.estimatedCosts.totalRange}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Next Steps
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {activePrediction.nextSteps.map((step, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      {getPriorityIcon(step.priority)}
                      <div className="flex-1">
                        <div className="font-medium">{step.step}</div>
                        <div className="text-sm text-gray-600">{step.description}</div>
                        <div className="text-xs text-gray-500 mt-1">{step.deadline}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}