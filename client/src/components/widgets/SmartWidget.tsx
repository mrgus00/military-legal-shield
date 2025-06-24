import { useState, useEffect } from 'react';
import { Brain, TrendingUp, AlertTriangle, CheckCircle, Clock, Users, FileText, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface SmartInsight {
  id: string;
  type: 'alert' | 'recommendation' | 'status' | 'metric';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  action?: {
    label: string;
    url: string;
  };
  value?: number;
  trend?: 'up' | 'down' | 'stable';
}

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  url: string;
  category: 'legal' | 'consultation' | 'document' | 'analysis';
}

export default function SmartWidget() {
  const [insights, setInsights] = useState<SmartInsight[]>([]);
  const [quickActions, setQuickActions] = useState<QuickAction[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock smart insights data
  const mockInsights: SmartInsight[] = [
    {
      id: '1',
      type: 'alert',
      title: 'Court Martial Hearing Approaching',
      description: 'Your court martial hearing is scheduled in 5 days. Ensure all documents are prepared.',
      priority: 'high',
      action: {
        label: 'Review Documents',
        url: '/court-martial-defense'
      }
    },
    {
      id: '2',
      type: 'recommendation',
      title: 'Consider Security Clearance Appeal',
      description: 'Based on your case history, you may have grounds for a security clearance appeal.',
      priority: 'medium',
      action: {
        label: 'Start Appeal Process',
        url: '/ai-case-analysis?type=security-clearance'
      }
    },
    {
      id: '3',
      type: 'status',
      title: 'Attorney Match Success Rate',
      description: 'Your profile shows 94% compatibility with military defense attorneys.',
      priority: 'low',
      value: 94
    },
    {
      id: '4',
      type: 'metric',
      title: 'Case Resolution Timeline',
      description: 'Similar cases typically resolve in 45-60 days based on AI analysis.',
      priority: 'medium',
      value: 52,
      trend: 'down'
    }
  ];

  const mockQuickActions: QuickAction[] = [
    {
      id: '1',
      label: 'Emergency Consultation',
      icon: <AlertTriangle className="h-4 w-4" />,
      description: 'Get immediate legal assistance',
      url: '/emergency-consultation',
      category: 'consultation'
    },
    {
      id: '2',
      label: 'AI Case Analysis',
      icon: <Brain className="h-4 w-4" />,
      description: 'Analyze your case with AI',
      url: '/ai-case-analysis',
      category: 'analysis'
    },
    {
      id: '3',
      label: 'Find Attorneys',
      icon: <Users className="h-4 w-4" />,
      description: 'Match with specialized attorneys',
      url: '/attorneys',
      category: 'legal'
    },
    {
      id: '4',
      label: 'Generate Documents',
      icon: <FileText className="h-4 w-4" />,
      description: 'Create legal documents',
      url: '/family-law-poas',
      category: 'document'
    }
  ];

  useEffect(() => {
    // Simulate loading smart insights
    setTimeout(() => {
      setInsights(mockInsights);
      setQuickActions(mockQuickActions);
      setLoading(false);
    }, 1000);
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'alert': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'recommendation': return <Zap className="h-4 w-4 text-yellow-600" />;
      case 'status': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'metric': return <TrendingUp className="h-4 w-4 text-blue-600" />;
      default: return <Brain className="h-4 w-4 text-gray-600" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'legal': return 'bg-blue-100 text-blue-800';
      case 'consultation': return 'bg-red-100 text-red-800';
      case 'document': return 'bg-green-100 text-green-800';
      case 'analysis': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Brain className="h-5 w-5 text-purple-600" />
            Smart Assistant
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Brain className="h-5 w-5 text-purple-600" />
          Smart Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Smart Insights Section */}
        <div className="space-y-3">
          <h3 className="font-medium text-sm text-gray-700">AI Insights</h3>
          <div className="max-h-48 overflow-y-auto space-y-2">
            {insights.map((insight) => (
              <div
                key={insight.id}
                className={`border rounded-lg p-3 ${getPriorityColor(insight.priority)}`}
              >
                <div className="flex items-start gap-2">
                  {getTypeIcon(insight.type)}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm">{insight.title}</h4>
                    <p className="text-xs mt-1 opacity-80">{insight.description}</p>
                    
                    {insight.value !== undefined && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-xs">
                          <span>Progress</span>
                          <span>{insight.value}%</span>
                        </div>
                        <Progress value={insight.value} className="h-1 mt-1" />
                      </div>
                    )}
                    
                    {insight.action && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2 h-6 text-xs"
                        onClick={() => window.location.href = insight.action!.url}
                      >
                        {insight.action.label}
                      </Button>
                    )}
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-xs ${getPriorityColor(insight.priority)}`}
                  >
                    {insight.priority}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions Section */}
        <div className="space-y-3 border-t pt-3">
          <h3 className="font-medium text-sm text-gray-700">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((action) => (
              <Button
                key={action.id}
                variant="outline"
                className="h-auto p-3 flex flex-col items-center gap-2 hover:bg-gray-50"
                onClick={() => window.location.href = action.url}
              >
                <div className="flex items-center gap-2 w-full">
                  {action.icon}
                  <Badge className={`text-xs ${getCategoryColor(action.category)}`}>
                    {action.category}
                  </Badge>
                </div>
                <div className="text-center">
                  <p className="font-medium text-xs">{action.label}</p>
                  <p className="text-xs text-gray-500 mt-1">{action.description}</p>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Status Summary */}
        <div className="border-t pt-3">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>Last updated: Just now</span>
            </div>
            <Badge variant="secondary" className="text-xs">
              AI Powered
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}