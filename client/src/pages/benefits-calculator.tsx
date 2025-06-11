import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, DollarSign, FileText, Clock, CheckCircle, AlertCircle, Users, Home, GraduationCap, Heart } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const benefitsCalculatorSchema = z.object({
  branch: z.string().min(1, "Military branch is required"),
  rank: z.string().min(1, "Rank is required"),
  yearsOfService: z.number().min(0).max(50),
  disabilityRating: z.number().min(0).max(100),
  maritalStatus: z.string(),
  dependents: z.number().min(0).max(20),
  dischargeType: z.string(),
  combatVeteran: z.boolean(),
  purpleHeart: z.boolean(),
  povPercentage: z.number().min(0).max(200),
  annualIncome: z.number().min(0),
  state: z.string().min(1, "State is required"),
  homelessRisk: z.boolean(),
  unemployed: z.boolean(),
  studentStatus: z.boolean(),
});

type BenefitsFormData = z.infer<typeof benefitsCalculatorSchema>;

interface BenefitResult {
  id: string;
  name: string;
  type: string;
  description: string;
  eligibilityStatus: "eligible" | "potentially_eligible" | "not_eligible";
  estimatedAmount: string;
  requirements: string[];
  nextSteps: string[];
  applicationUrl?: string;
  processingTime: string;
  priority: "high" | "medium" | "low";
}

interface CalculationResults {
  totalEstimatedValue: number;
  eligibleBenefits: BenefitResult[];
  recommendedActions: string[];
  urgentDeadlines: Array<{
    benefit: string;
    deadline: string;
    description: string;
  }>;
  completionScore: number;
}

const militaryBranches = [
  { value: "army", label: "U.S. Army" },
  { value: "navy", label: "U.S. Navy" },
  { value: "airforce", label: "U.S. Air Force" },
  { value: "marines", label: "U.S. Marine Corps" },
  { value: "coastguard", label: "U.S. Coast Guard" },
  { value: "spaceforce", label: "U.S. Space Force" },
];

const states = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware",
  "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky",
  "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi",
  "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico",
  "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania",
  "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
  "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
];

export default function BenefitsCalculator() {
  const [results, setResults] = useState<CalculationResults | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const { toast } = useToast();

  const form = useForm<BenefitsFormData>({
    resolver: zodResolver(benefitsCalculatorSchema),
    defaultValues: {
      yearsOfService: 0,
      disabilityRating: 0,
      dependents: 0,
      combatVeteran: false,
      purpleHeart: false,
      povPercentage: 100,
      annualIncome: 0,
      homelessRisk: false,
      unemployed: false,
      studentStatus: false,
    },
  });

  const calculateBenefits = useMutation({
    mutationFn: async (data: BenefitsFormData) => {
      const response = await apiRequest("POST", "/api/calculate-benefits", data);
      return response.json();
    },
    onSuccess: (data: CalculationResults) => {
      setResults(data);
      setIsCalculating(false);
      toast({
        title: "Benefits Calculated Successfully",
        description: `Found ${data.eligibleBenefits.length} potential benefits with estimated value of $${data.totalEstimatedValue.toLocaleString()}`,
      });
    },
    onError: (error) => {
      setIsCalculating(false);
      toast({
        title: "Calculation Error",
        description: "Failed to calculate benefits. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: BenefitsFormData) => {
    setIsCalculating(true);
    calculateBenefits.mutate(data);
  };

  const getBenefitIcon = (type: string) => {
    switch (type) {
      case "healthcare": return <Heart className="h-5 w-5" />;
      case "education": return <GraduationCap className="h-5 w-5" />;
      case "housing": return <Home className="h-5 w-5" />;
      case "disability": return <Users className="h-5 w-5" />;
      default: return <DollarSign className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "eligible": return "bg-green-100 text-green-800 border-green-200";
      case "potentially_eligible": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "not_eligible": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Calculator className="h-12 w-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">VA Benefits Calculator</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get a comprehensive analysis of your eligibility for VA benefits and calculate your potential compensation
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Service Information
                </CardTitle>
                <CardDescription>
                  Provide your military service details for accurate benefit calculations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <Tabs defaultValue="service" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="service">Service</TabsTrigger>
                      <TabsTrigger value="personal">Personal</TabsTrigger>
                      <TabsTrigger value="financial">Financial</TabsTrigger>
                      <TabsTrigger value="status">Status</TabsTrigger>
                    </TabsList>

                    <TabsContent value="service" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="branch">Military Branch</Label>
                          <Select 
                            value={form.watch("branch")} 
                            onValueChange={(value) => form.setValue("branch", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select branch" />
                            </SelectTrigger>
                            <SelectContent>
                              {militaryBranches.map((branch) => (
                                <SelectItem key={branch.value} value={branch.value}>
                                  {branch.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="rank">Military Rank</Label>
                          <Input
                            id="rank"
                            placeholder="e.g., E-7, O-3, W-2"
                            {...form.register("rank")}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="yearsOfService">Years of Service</Label>
                          <Input
                            id="yearsOfService"
                            type="number"
                            min="0"
                            max="50"
                            {...form.register("yearsOfService", { valueAsNumber: true })}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="dischargeType">Discharge Type</Label>
                          <Select 
                            value={form.watch("dischargeType")} 
                            onValueChange={(value) => form.setValue("dischargeType", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select discharge type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="honorable">Honorable</SelectItem>
                              <SelectItem value="general">General Under Honorable Conditions</SelectItem>
                              <SelectItem value="other">Other Than Honorable</SelectItem>
                              <SelectItem value="bad_conduct">Bad Conduct</SelectItem>
                              <SelectItem value="dishonorable">Dishonorable</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="disabilityRating">Current VA Disability Rating (%)</Label>
                          <Input
                            id="disabilityRating"
                            type="number"
                            min="0"
                            max="100"
                            placeholder="0-100"
                            {...form.register("disabilityRating", { valueAsNumber: true })}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="state">State of Residence</Label>
                          <Select 
                            value={form.watch("state")} 
                            onValueChange={(value) => form.setValue("state", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select state" />
                            </SelectTrigger>
                            <SelectContent>
                              {states.map((state) => (
                                <SelectItem key={state} value={state.toLowerCase().replace(" ", "_")}>
                                  {state}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="combatVeteran"
                            checked={form.watch("combatVeteran")}
                            onCheckedChange={(checked) => form.setValue("combatVeteran", !!checked)}
                          />
                          <Label htmlFor="combatVeteran">Combat Veteran</Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="purpleHeart"
                            checked={form.watch("purpleHeart")}
                            onCheckedChange={(checked) => form.setValue("purpleHeart", !!checked)}
                          />
                          <Label htmlFor="purpleHeart">Purple Heart Recipient</Label>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="personal" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="maritalStatus">Marital Status</Label>
                          <Select 
                            value={form.watch("maritalStatus")} 
                            onValueChange={(value) => form.setValue("maritalStatus", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="single">Single</SelectItem>
                              <SelectItem value="married">Married</SelectItem>
                              <SelectItem value="divorced">Divorced</SelectItem>
                              <SelectItem value="widowed">Widowed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="dependents">Number of Dependents</Label>
                          <Input
                            id="dependents"
                            type="number"
                            min="0"
                            max="20"
                            {...form.register("dependents", { valueAsNumber: true })}
                          />
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="financial" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="annualIncome">Annual Household Income</Label>
                          <Input
                            id="annualIncome"
                            type="number"
                            min="0"
                            placeholder="$0"
                            {...form.register("annualIncome", { valueAsNumber: true })}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="povPercentage">Income vs Poverty Line (%)</Label>
                          <Input
                            id="povPercentage"
                            type="number"
                            min="0"
                            max="200"
                            placeholder="100 = at poverty line"
                            {...form.register("povPercentage", { valueAsNumber: true })}
                          />
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="status" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="unemployed"
                            checked={form.watch("unemployed")}
                            onCheckedChange={(checked) => form.setValue("unemployed", !!checked)}
                          />
                          <Label htmlFor="unemployed">Currently Unemployed</Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="studentStatus"
                            checked={form.watch("studentStatus")}
                            onCheckedChange={(checked) => form.setValue("studentStatus", !!checked)}
                          />
                          <Label htmlFor="studentStatus">Full-time Student</Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="homelessRisk"
                            checked={form.watch("homelessRisk")}
                            onCheckedChange={(checked) => form.setValue("homelessRisk", !!checked)}
                          />
                          <Label htmlFor="homelessRisk">At Risk of Homelessness</Label>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isCalculating}
                    size="lg"
                  >
                    {isCalculating ? (
                      <>
                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                        Calculating Benefits...
                      </>
                    ) : (
                      <>
                        <Calculator className="h-4 w-4 mr-2" />
                        Calculate My Benefits
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-1">
            {results ? (
              <div className="space-y-6">
                {/* Summary Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <DollarSign className="h-5 w-5 mr-2" />
                      Benefits Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600">
                          ${results.totalEstimatedValue.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">Estimated Annual Value</div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Completion Score</span>
                          <span className="text-sm font-medium">{results.completionScore}%</span>
                        </div>
                        <Progress value={results.completionScore} className="h-2" />
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-blue-600">
                            {results.eligibleBenefits.filter(b => b.eligibilityStatus === "eligible").length}
                          </div>
                          <div className="text-xs text-gray-600">Eligible</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-yellow-600">
                            {results.eligibleBenefits.filter(b => b.eligibilityStatus === "potentially_eligible").length}
                          </div>
                          <div className="text-xs text-gray-600">Potential</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Urgent Deadlines */}
                {results.urgentDeadlines.length > 0 && (
                  <Card className="border-red-200">
                    <CardHeader>
                      <CardTitle className="flex items-center text-red-600">
                        <AlertCircle className="h-5 w-5 mr-2" />
                        Urgent Deadlines
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {results.urgentDeadlines.map((deadline, index) => (
                          <Alert key={index} className="border-red-200">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                              <div className="font-medium">{deadline.benefit}</div>
                              <div className="text-sm text-gray-600">{deadline.deadline}</div>
                              <div className="text-sm">{deadline.description}</div>
                            </AlertDescription>
                          </Alert>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Recommended Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {results.recommendedActions.map((action, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{action}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Ready to Calculate</CardTitle>
                  <CardDescription>
                    Complete the form to get your personalized benefits analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Calculator className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">
                      Fill out your service information to see available benefits
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Detailed Results */}
        {results && (
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Available Benefits</CardTitle>
                <CardDescription>
                  Detailed breakdown of your benefit eligibility
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {results.eligibleBenefits.map((benefit) => (
                    <Card key={benefit.id} className="relative">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-2">
                            {getBenefitIcon(benefit.type)}
                            <CardTitle className="text-sm">{benefit.name}</CardTitle>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Badge 
                              className={`text-xs ${getStatusColor(benefit.eligibilityStatus)}`}
                              variant="outline"
                            >
                              {benefit.eligibilityStatus.replace("_", " ")}
                            </Badge>
                            <div 
                              className={`w-2 h-2 rounded-full ${getPriorityColor(benefit.priority)}`}
                              title={`${benefit.priority} priority`}
                            />
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-3">
                          <p className="text-sm text-gray-600">{benefit.description}</p>
                          
                          <div className="text-lg font-bold text-green-600">
                            {benefit.estimatedAmount}
                          </div>

                          <div>
                            <div className="text-xs font-medium text-gray-700 mb-1">Requirements:</div>
                            <ul className="text-xs text-gray-600 space-y-1">
                              {benefit.requirements.slice(0, 3).map((req, index) => (
                                <li key={index} className="flex items-start">
                                  <span className="mr-1">•</span>
                                  <span>{req}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-600">{benefit.processingTime}</span>
                            {benefit.applicationUrl && (
                              <Button variant="outline" size="sm" asChild>
                                <a href={benefit.applicationUrl} target="_blank" rel="noopener noreferrer">
                                  Apply
                                </a>
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}