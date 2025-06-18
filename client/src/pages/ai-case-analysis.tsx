import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { IntelligentCaseDashboard } from '@/components/intelligent-case-dashboard';
import { AILegalAssistant } from '@/components/ai-legal-assistant';
import { 
  Brain, 
  Target, 
  FileText, 
  Users, 
  AlertTriangle,
  Plus,
  X
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface CaseFormData {
  caseType: string;
  charges: string[];
  mitigatingFactors: string[];
  aggravatingFactors: string[];
  militaryRecord: {
    yearsOfService: number;
    rank: string;
    decorations: string[];
  };
}

export default function AICaseAnalysis() {
  const { toast } = useToast();
  const [caseData, setCaseData] = useState<CaseFormData>({
    caseType: '',
    charges: [''],
    mitigatingFactors: [''],
    aggravatingFactors: [''],
    militaryRecord: {
      yearsOfService: 0,
      rank: '',
      decorations: ['']
    }
  });
  const [analysisResult, setAnalysisResult] = useState(null);
  const [showAssistant, setShowAssistant] = useState(false);

  const analyzeCaseMutation = useMutation({
    mutationFn: async (data: CaseFormData) => {
      return await apiRequest('POST', '/api/ai/analyze-case', data);
    },
    onSuccess: (result) => {
      setAnalysisResult(result);
      toast({
        title: "Analysis Complete",
        description: "AI has analyzed your case and generated predictions.",
      });
    },
    onError: (error) => {
      toast({
        title: "Analysis Failed",
        description: "Unable to analyze case. Please try again.",
        variant: "destructive",
      });
    }
  });

  const addArrayItem = (field: string, subField?: string) => {
    setCaseData(prev => {
      if (subField) {
        return {
          ...prev,
          [field]: {
            ...prev[field as keyof CaseFormData],
            [subField]: [...(prev[field as keyof CaseFormData] as any)[subField], '']
          }
        };
      } else {
        return {
          ...prev,
          [field]: [...(prev[field as keyof CaseFormData] as string[]), '']
        };
      }
    });
  };

  const removeArrayItem = (field: string, index: number, subField?: string) => {
    setCaseData(prev => {
      if (subField) {
        return {
          ...prev,
          [field]: {
            ...prev[field as keyof CaseFormData],
            [subField]: (prev[field as keyof CaseFormData] as any)[subField].filter((_: any, i: number) => i !== index)
          }
        };
      } else {
        return {
          ...prev,
          [field]: (prev[field as keyof CaseFormData] as string[]).filter((_, i) => i !== index)
        };
      }
    });
  };

  const updateArrayItem = (field: string, index: number, value: string, subField?: string) => {
    setCaseData(prev => {
      if (subField) {
        const newArray = [...(prev[field as keyof CaseFormData] as any)[subField]];
        newArray[index] = value;
        return {
          ...prev,
          [field]: {
            ...prev[field as keyof CaseFormData],
            [subField]: newArray
          }
        };
      } else {
        const newArray = [...(prev[field as keyof CaseFormData] as string[])];
        newArray[index] = value;
        return {
          ...prev,
          [field]: newArray
        };
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const filteredData = {
      ...caseData,
      charges: caseData.charges.filter(charge => charge.trim() !== ''),
      mitigatingFactors: caseData.mitigatingFactors.filter(factor => factor.trim() !== ''),
      aggravatingFactors: caseData.aggravatingFactors.filter(factor => factor.trim() !== ''),
      militaryRecord: {
        ...caseData.militaryRecord,
        decorations: caseData.militaryRecord.decorations.filter(decoration => decoration.trim() !== '')
      }
    };

    analyzeCaseMutation.mutate(filteredData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI-Powered Case Analysis
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Advanced machine learning analysis for military legal cases
          </p>
          <div className="flex justify-center gap-4 mb-8">
            <Badge className="bg-blue-100 text-blue-800 px-4 py-2">
              <Brain className="w-4 h-4 mr-2" />
              Intelligent Predictions
            </Badge>
            <Badge className="bg-green-100 text-green-800 px-4 py-2">
              <Target className="w-4 h-4 mr-2" />
              Strategic Recommendations
            </Badge>
            <Badge className="bg-purple-100 text-purple-800 px-4 py-2">
              <FileText className="w-4 h-4 mr-2" />
              Document Analysis
            </Badge>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Case Input Form */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Case Details
                </CardTitle>
                <CardDescription>
                  Provide your case information for AI analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Case Type */}
                  <div>
                    <Label htmlFor="caseType">Case Type</Label>
                    <Select 
                      value={caseData.caseType} 
                      onValueChange={(value) => setCaseData(prev => ({ ...prev, caseType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select case type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="court-martial">Court-Martial</SelectItem>
                        <SelectItem value="administrative">Administrative Action</SelectItem>
                        <SelectItem value="security-clearance">Security Clearance</SelectItem>
                        <SelectItem value="meb-peb">MEB/PEB</SelectItem>
                        <SelectItem value="discharge">Discharge Upgrade</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Military Record */}
                  <div className="space-y-4">
                    <Label>Military Record</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="rank">Rank</Label>
                        <Input
                          id="rank"
                          value={caseData.militaryRecord.rank}
                          onChange={(e) => setCaseData(prev => ({
                            ...prev,
                            militaryRecord: { ...prev.militaryRecord, rank: e.target.value }
                          }))}
                          placeholder="e.g., SSG"
                        />
                      </div>
                      <div>
                        <Label htmlFor="yearsOfService">Years of Service</Label>
                        <Input
                          id="yearsOfService"
                          type="number"
                          value={caseData.militaryRecord.yearsOfService}
                          onChange={(e) => setCaseData(prev => ({
                            ...prev,
                            militaryRecord: { ...prev.militaryRecord, yearsOfService: parseInt(e.target.value) || 0 }
                          }))}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Charges */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Charges</Label>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={() => addArrayItem('charges')}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    {caseData.charges.map((charge, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <Input
                          value={charge}
                          onChange={(e) => updateArrayItem('charges', index, e.target.value)}
                          placeholder="e.g., Article 86 - AWOL"
                        />
                        {caseData.charges.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeArrayItem('charges', index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Mitigating Factors */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Mitigating Factors</Label>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={() => addArrayItem('mitigatingFactors')}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    {caseData.mitigatingFactors.map((factor, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <Input
                          value={factor}
                          onChange={(e) => updateArrayItem('mitigatingFactors', index, e.target.value)}
                          placeholder="e.g., First offense, exemplary service record"
                        />
                        {caseData.mitigatingFactors.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeArrayItem('mitigatingFactors', index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Aggravating Factors */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Aggravating Factors</Label>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={() => addArrayItem('aggravatingFactors')}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    {caseData.aggravatingFactors.map((factor, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <Input
                          value={factor}
                          onChange={(e) => updateArrayItem('aggravatingFactors', index, e.target.value)}
                          placeholder="e.g., Leadership position, previous incidents"
                        />
                        {caseData.aggravatingFactors.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeArrayItem('aggravatingFactors', index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>

                  <Separator />
                  
                  <div className="flex gap-4">
                    <Button 
                      type="submit" 
                      className="flex-1"
                      disabled={analyzeCaseMutation.isPending}
                    >
                      {analyzeCaseMutation.isPending ? (
                        <>
                          <Brain className="w-4 h-4 mr-2 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Brain className="w-4 h-4 mr-2" />
                          Analyze Case
                        </>
                      )}
                    </Button>
                    
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={() => setShowAssistant(!showAssistant)}
                    >
                      <Users className="w-4 h-4 mr-2" />
                      AI Assistant
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* AI Assistant */}
            {showAssistant && (
              <div className="mt-6">
                <AILegalAssistant context="case-analysis" />
              </div>
            )}
          </div>

          {/* Analysis Results */}
          <div className="lg:col-span-2">
            {analysisResult ? (
              <IntelligentCaseDashboard caseData={caseData} />
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center h-96">
                  <Brain className="w-16 h-16 text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    Ready for AI Analysis
                  </h3>
                  <p className="text-gray-500 text-center max-w-md">
                    Fill out your case details and click "Analyze Case" to get intelligent predictions, 
                    strategic recommendations, and risk assessments powered by advanced machine learning.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}