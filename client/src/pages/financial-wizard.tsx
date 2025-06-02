import { useState } from "react";
import { ChevronRight, ChevronLeft, DollarSign, PiggyBank, Calculator, TrendingUp, Shield, Award, Home, GraduationCap, Heart, Car, Briefcase, Target, CheckCircle, AlertTriangle, Info } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

interface FinancialProfile {
  // Military Background
  branch: string;
  rank: string;
  yearsOfService: number;
  serviceStatus: string; // active, veteran, transitioning
  retirementEligible: boolean;
  vaDisabilityRating: number;
  
  // Current Financial Status
  monthlyMilitaryPay: number;
  vaDisabilityPay: number;
  spouseIncome: number;
  otherIncome: number;
  
  // Expenses
  housing: number;
  transportation: number;
  food: number;
  healthcare: number;
  insurance: number;
  debt: number;
  miscellaneous: number;
  
  // Goals and Circumstances
  primaryGoals: string[];
  dependents: number;
  timeframe: string;
  riskTolerance: string;
  transitionPlans: string;
  
  // Assets and Debts
  savings: number;
  tspBalance: number;
  otherRetirement: number;
  creditCardDebt: number;
  studentLoans: number;
  mortgage: number;
  carLoans: number;
}

interface FinancialRecommendation {
  category: string;
  priority: "high" | "medium" | "low";
  title: string;
  description: string;
  action: string;
  timeframe: string;
  estimatedImpact: string;
  resources: string[];
}

export default function FinancialWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [profile, setProfile] = useState<Partial<FinancialProfile>>({
    primaryGoals: [],
    dependents: 0,
    vaDisabilityRating: 0
  });
  const [recommendations, setRecommendations] = useState<FinancialRecommendation[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const totalSteps = 6;
  const progress = (currentStep / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateProfile = (field: string, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const generateRecommendations = async () => {
    setIsGenerating(true);
    try {
      // Calculate key financial metrics
      const totalIncome = (profile.monthlyMilitaryPay || 0) + 
                         (profile.vaDisabilityPay || 0) + 
                         (profile.spouseIncome || 0) + 
                         (profile.otherIncome || 0);
      
      const totalExpenses = (profile.housing || 0) + 
                           (profile.transportation || 0) + 
                           (profile.food || 0) + 
                           (profile.healthcare || 0) + 
                           (profile.insurance || 0) + 
                           (profile.debt || 0) + 
                           (profile.miscellaneous || 0);
      
      const monthlyNet = totalIncome - totalExpenses;
      const totalAssets = (profile.savings || 0) + (profile.tspBalance || 0) + (profile.otherRetirement || 0);
      const totalDebt = (profile.creditCardDebt || 0) + (profile.studentLoans || 0) + (profile.mortgage || 0) + (profile.carLoans || 0);

      // Generate context-specific recommendations
      const newRecommendations: FinancialRecommendation[] = [];

      // Emergency Fund Recommendations
      const emergencyFundTarget = totalExpenses * 6;
      if ((profile.savings || 0) < emergencyFundTarget) {
        newRecommendations.push({
          category: "Emergency Fund",
          priority: "high",
          title: "Build Emergency Fund",
          description: `Build an emergency fund of $${emergencyFundTarget.toLocaleString()} (6 months of expenses). You currently have $${(profile.savings || 0).toLocaleString()}.`,
          action: `Save $${Math.min(monthlyNet * 0.2, (emergencyFundTarget - (profile.savings || 0)) / 12).toFixed(0)} monthly`,
          timeframe: "6-12 months",
          estimatedImpact: "High - Financial security foundation",
          resources: ["Navy Federal Credit Union Savings", "USAA Emergency Fund Calculator", "Military Saves Program"]
        });
      }

      // TSP Optimization
      if (profile.serviceStatus === "active" && (profile.tspBalance || 0) < totalIncome * 10) {
        newRecommendations.push({
          category: "Retirement",
          priority: "high",
          title: "Maximize TSP Contributions",
          description: "Increase TSP contributions to take full advantage of government matching and tax benefits.",
          action: "Contribute at least 5% to get full government match, aim for 15-20% total",
          timeframe: "Immediate",
          estimatedImpact: "High - Long-term wealth building",
          resources: ["TSP.gov", "Military Financial Life Counselor", "Base Financial Counseling"]
        });
      }

      // VA Benefits Optimization
      if (profile.vaDisabilityRating && profile.vaDisabilityRating > 0 && !profile.vaDisabilityPay) {
        newRecommendations.push({
          category: "Benefits",
          priority: "high",
          title: "Claim VA Disability Benefits",
          description: `With a ${profile.vaDisabilityRating}% disability rating, you may be eligible for monthly compensation.`,
          action: "File VA disability claim or increase existing rating",
          timeframe: "3-6 months",
          estimatedImpact: "High - Additional monthly income",
          resources: ["VA.gov", "Veterans Service Organizations", "DAV Claims Assistance"]
        });
      }

      // Debt Management
      if (totalDebt > totalIncome * 2) {
        newRecommendations.push({
          category: "Debt Management",
          priority: "high",
          title: "Debt Consolidation Strategy",
          description: `Your total debt of $${totalDebt.toLocaleString()} is high relative to income. Consider debt consolidation.`,
          action: "Explore military-specific debt consolidation options and payment strategies",
          timeframe: "1-3 months",
          estimatedImpact: "High - Reduced interest payments",
          resources: ["Military Relief Societies", "USAA Debt Consolidation", "Credit Counseling Services"]
        });
      }

      // Home Buying (if transitioning)
      if (profile.serviceStatus === "transitioning" && profile.primaryGoals?.includes("homeownership")) {
        newRecommendations.push({
          category: "Housing",
          priority: "medium",
          title: "VA Home Loan Benefits",
          description: "Take advantage of VA home loan benefits for zero down payment and no PMI.",
          action: "Get pre-approved for VA home loan and research target markets",
          timeframe: "3-6 months",
          estimatedImpact: "High - Homeownership with military benefits",
          resources: ["VA Home Loans", "Military-friendly Realtors", "VA Loan Specialists"]
        });
      }

      // Education Benefits
      if (profile.serviceStatus === "transitioning" && profile.primaryGoals?.includes("education")) {
        newRecommendations.push({
          category: "Education",
          priority: "medium",
          title: "Maximize GI Bill Benefits",
          description: "Optimize GI Bill usage for maximum education and housing allowance benefits.",
          action: "Research schools, programs, and strategic timing for GI Bill usage",
          timeframe: "2-4 months",
          estimatedImpact: "High - Career advancement and income potential",
          resources: ["VA Education Benefits", "Student Veterans of America", "VR&E Program"]
        });
      }

      // Investment Strategy
      if (monthlyNet > 500 && (profile.savings || 0) > emergencyFundTarget) {
        newRecommendations.push({
          category: "Investing",
          priority: "medium",
          title: "Investment Portfolio Development",
          description: "Begin building an investment portfolio outside of TSP for additional wealth building.",
          action: "Open taxable investment account and start with index funds",
          timeframe: "1-2 months",
          estimatedImpact: "Medium - Long-term wealth growth",
          resources: ["USAA Investment Services", "Vanguard", "Military Financial Advisors"]
        });
      }

      // Life Insurance Review
      if (profile.dependents && profile.dependents > 0) {
        newRecommendations.push({
          category: "Insurance",
          priority: "medium",
          title: "Life Insurance Optimization",
          description: "Review and optimize life insurance coverage for family protection.",
          action: "Evaluate SGLI coverage and consider additional term life insurance",
          timeframe: "1 month",
          estimatedImpact: "High - Family financial protection",
          resources: ["SGLI Information", "USAA Life Insurance", "Military Life Insurance Calculators"]
        });
      }

      setRecommendations(newRecommendations);
      setCurrentStep(totalSteps);
    } catch (error) {
      console.error("Error generating recommendations:", error);
      toast({
        title: "Error",
        description: "Unable to generate recommendations. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-military-gold-500" />
                Military Background
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Military Branch</Label>
                  <Select value={profile.branch} onValueChange={(value) => updateProfile("branch", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select branch" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="army">Army</SelectItem>
                      <SelectItem value="navy">Navy</SelectItem>
                      <SelectItem value="airforce">Air Force</SelectItem>
                      <SelectItem value="marines">Marines</SelectItem>
                      <SelectItem value="spaceforce">Space Force</SelectItem>
                      <SelectItem value="coastguard">Coast Guard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Current/Final Rank</Label>
                  <Input
                    value={profile.rank || ""}
                    onChange={(e) => updateProfile("rank", e.target.value)}
                    placeholder="e.g., E-7, O-3, W-2"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Years of Service</Label>
                  <Input
                    type="number"
                    value={profile.yearsOfService || ""}
                    onChange={(e) => updateProfile("yearsOfService", parseInt(e.target.value) || 0)}
                    placeholder="Years served"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Service Status</Label>
                  <Select value={profile.serviceStatus} onValueChange={(value) => updateProfile("serviceStatus", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Current status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active Duty</SelectItem>
                      <SelectItem value="transitioning">Transitioning Out</SelectItem>
                      <SelectItem value="veteran">Veteran</SelectItem>
                      <SelectItem value="retired">Military Retired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>VA Disability Rating (%)</Label>
                <Input
                  type="number"
                  value={profile.vaDisabilityRating || ""}
                  onChange={(e) => updateProfile("vaDisabilityRating", parseInt(e.target.value) || 0)}
                  placeholder="0-100"
                  max="100"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="retirement" 
                  checked={profile.retirementEligible || false}
                  onCheckedChange={(checked) => updateProfile("retirementEligible", checked)}
                />
                <Label htmlFor="retirement">Eligible for military retirement</Label>
              </div>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-military-gold-500" />
                Monthly Income
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Military Pay (Monthly)</Label>
                  <Input
                    type="number"
                    value={profile.monthlyMilitaryPay || ""}
                    onChange={(e) => updateProfile("monthlyMilitaryPay", parseFloat(e.target.value) || 0)}
                    placeholder="Base pay + allowances"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>VA Disability Pay (Monthly)</Label>
                  <Input
                    type="number"
                    value={profile.vaDisabilityPay || ""}
                    onChange={(e) => updateProfile("vaDisabilityPay", parseFloat(e.target.value) || 0)}
                    placeholder="Monthly VA compensation"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Spouse Income (Monthly)</Label>
                  <Input
                    type="number"
                    value={profile.spouseIncome || ""}
                    onChange={(e) => updateProfile("spouseIncome", parseFloat(e.target.value) || 0)}
                    placeholder="Spouse's monthly income"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Other Income (Monthly)</Label>
                  <Input
                    type="number"
                    value={profile.otherIncome || ""}
                    onChange={(e) => updateProfile("otherIncome", parseFloat(e.target.value) || 0)}
                    placeholder="Side jobs, investments, etc."
                  />
                </div>
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Include all forms of military compensation: base pay, BAH, BAS, special pay, and any other allowances.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-military-gold-500" />
                Monthly Expenses
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Home className="w-4 h-4" />
                    Housing (Rent/Mortgage)
                  </Label>
                  <Input
                    type="number"
                    value={profile.housing || ""}
                    onChange={(e) => updateProfile("housing", parseFloat(e.target.value) || 0)}
                    placeholder="Monthly housing costs"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Car className="w-4 h-4" />
                    Transportation
                  </Label>
                  <Input
                    type="number"
                    value={profile.transportation || ""}
                    onChange={(e) => updateProfile("transportation", parseFloat(e.target.value) || 0)}
                    placeholder="Car payments, gas, insurance"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Food & Groceries</Label>
                  <Input
                    type="number"
                    value={profile.food || ""}
                    onChange={(e) => updateProfile("food", parseFloat(e.target.value) || 0)}
                    placeholder="Monthly food expenses"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    Healthcare
                  </Label>
                  <Input
                    type="number"
                    value={profile.healthcare || ""}
                    onChange={(e) => updateProfile("healthcare", parseFloat(e.target.value) || 0)}
                    placeholder="Medical expenses not covered"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Insurance</Label>
                  <Input
                    type="number"
                    value={profile.insurance || ""}
                    onChange={(e) => updateProfile("insurance", parseFloat(e.target.value) || 0)}
                    placeholder="Life, disability, etc."
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Debt Payments</Label>
                  <Input
                    type="number"
                    value={profile.debt || ""}
                    onChange={(e) => updateProfile("debt", parseFloat(e.target.value) || 0)}
                    placeholder="Credit cards, loans"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Miscellaneous</Label>
                  <Input
                    type="number"
                    value={profile.miscellaneous || ""}
                    onChange={(e) => updateProfile("miscellaneous", parseFloat(e.target.value) || 0)}
                    placeholder="Entertainment, shopping"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PiggyBank className="w-5 h-5 text-military-gold-500" />
                Assets & Debts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-3 text-green-700">Assets</h4>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Savings Account</Label>
                    <Input
                      type="number"
                      value={profile.savings || ""}
                      onChange={(e) => updateProfile("savings", parseFloat(e.target.value) || 0)}
                      placeholder="Current savings"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>TSP Balance</Label>
                    <Input
                      type="number"
                      value={profile.tspBalance || ""}
                      onChange={(e) => updateProfile("tspBalance", parseFloat(e.target.value) || 0)}
                      placeholder="Current TSP value"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Other Retirement</Label>
                    <Input
                      type="number"
                      value={profile.otherRetirement || ""}
                      onChange={(e) => updateProfile("otherRetirement", parseFloat(e.target.value) || 0)}
                      placeholder="IRA, 401k, etc."
                    />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3 text-red-700">Debts</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Credit Card Debt</Label>
                    <Input
                      type="number"
                      value={profile.creditCardDebt || ""}
                      onChange={(e) => updateProfile("creditCardDebt", parseFloat(e.target.value) || 0)}
                      placeholder="Total credit card balances"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Student Loans</Label>
                    <Input
                      type="number"
                      value={profile.studentLoans || ""}
                      onChange={(e) => updateProfile("studentLoans", parseFloat(e.target.value) || 0)}
                      placeholder="Student loan balance"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Mortgage Balance</Label>
                    <Input
                      type="number"
                      value={profile.mortgage || ""}
                      onChange={(e) => updateProfile("mortgage", parseFloat(e.target.value) || 0)}
                      placeholder="Remaining mortgage"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Car Loans</Label>
                    <Input
                      type="number"
                      value={profile.carLoans || ""}
                      onChange={(e) => updateProfile("carLoans", parseFloat(e.target.value) || 0)}
                      placeholder="Auto loan balances"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 5:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-military-gold-500" />
                Financial Goals & Planning
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-base font-semibold mb-3 block">Primary Financial Goals (select all that apply)</Label>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    "Emergency fund",
                    "Debt elimination",
                    "Homeownership",
                    "Education funding",
                    "Retirement planning",
                    "Investment growth",
                    "Family planning",
                    "Business startup"
                  ].map((goal) => (
                    <div key={goal} className="flex items-center space-x-2">
                      <Checkbox
                        id={goal}
                        checked={profile.primaryGoals?.includes(goal) || false}
                        onCheckedChange={(checked) => {
                          const currentGoals = profile.primaryGoals || [];
                          const newGoals = checked
                            ? [...currentGoals, goal]
                            : currentGoals.filter(g => g !== goal);
                          updateProfile("primaryGoals", newGoals);
                        }}
                      />
                      <Label htmlFor={goal}>{goal}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Number of Dependents</Label>
                  <Input
                    type="number"
                    value={profile.dependents || ""}
                    onChange={(e) => updateProfile("dependents", parseInt(e.target.value) || 0)}
                    placeholder="Spouse and children"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Planning Timeframe</Label>
                  <Select value={profile.timeframe} onValueChange={(value) => updateProfile("timeframe", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Goal timeframe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Immediate (0-1 year)</SelectItem>
                      <SelectItem value="short">Short-term (1-3 years)</SelectItem>
                      <SelectItem value="medium">Medium-term (3-10 years)</SelectItem>
                      <SelectItem value="long">Long-term (10+ years)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Risk Tolerance</Label>
                <RadioGroup 
                  value={profile.riskTolerance} 
                  onValueChange={(value) => updateProfile("riskTolerance", value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="conservative" id="conservative" />
                    <Label htmlFor="conservative">Conservative - Preserve capital, low risk</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="moderate" id="moderate" />
                    <Label htmlFor="moderate">Moderate - Balanced growth and stability</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="aggressive" id="aggressive" />
                    <Label htmlFor="aggressive">Aggressive - Maximum growth potential</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>Transition Plans</Label>
                <Textarea
                  value={profile.transitionPlans || ""}
                  onChange={(e) => updateProfile("transitionPlans", e.target.value)}
                  placeholder="Describe your career transition plans, education goals, or other relevant information..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        );

      case 6:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-military-gold-500" />
                Your Personalized Financial Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isGenerating ? (
                <div className="text-center py-8">
                  <div className="animate-spin w-8 h-8 border-4 border-military-gold-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-600">Analyzing your financial profile and generating personalized recommendations...</p>
                </div>
              ) : recommendations.length > 0 ? (
                <div className="space-y-6">
                  {/* Financial Summary */}
                  <div className="bg-gradient-to-r from-military-gold-50 to-sage-50 p-6 rounded-lg border">
                    <h3 className="text-lg font-semibold text-navy-700 mb-4">Financial Overview</h3>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="block text-gray-600">Monthly Income</span>
                        <span className="text-xl font-bold text-green-600">
                          ${((profile.monthlyMilitaryPay || 0) + (profile.vaDisabilityPay || 0) + (profile.spouseIncome || 0) + (profile.otherIncome || 0)).toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="block text-gray-600">Monthly Expenses</span>
                        <span className="text-xl font-bold text-red-600">
                          ${((profile.housing || 0) + (profile.transportation || 0) + (profile.food || 0) + (profile.healthcare || 0) + (profile.insurance || 0) + (profile.debt || 0) + (profile.miscellaneous || 0)).toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="block text-gray-600">Net Worth</span>
                        <span className="text-xl font-bold text-navy-700">
                          ${(((profile.savings || 0) + (profile.tspBalance || 0) + (profile.otherRetirement || 0)) - ((profile.creditCardDebt || 0) + (profile.studentLoans || 0) + (profile.mortgage || 0) + (profile.carLoans || 0))).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-navy-700">Prioritized Recommendations</h3>
                    {recommendations.map((rec, index) => (
                      <Card key={index} className={`border-l-4 ${
                        rec.priority === "high" ? "border-l-red-500" :
                        rec.priority === "medium" ? "border-l-yellow-500" :
                        "border-l-green-500"
                      }`}>
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <Badge variant="outline" className="mb-2">{rec.category}</Badge>
                              <h4 className="font-semibold text-navy-700">{rec.title}</h4>
                            </div>
                            <Badge variant={
                              rec.priority === "high" ? "destructive" :
                              rec.priority === "medium" ? "default" :
                              "secondary"
                            }>
                              {rec.priority} priority
                            </Badge>
                          </div>
                          
                          <p className="text-gray-600 mb-3">{rec.description}</p>
                          
                          <div className="grid md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="font-medium text-navy-700">Action:</span>
                              <p className="text-gray-600">{rec.action}</p>
                            </div>
                            <div>
                              <span className="font-medium text-navy-700">Timeframe:</span>
                              <p className="text-gray-600">{rec.timeframe}</p>
                            </div>
                            <div>
                              <span className="font-medium text-navy-700">Impact:</span>
                              <p className="text-gray-600">{rec.estimatedImpact}</p>
                            </div>
                          </div>

                          <div className="mt-3">
                            <span className="font-medium text-navy-700 text-sm">Resources:</span>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {rec.resources.map((resource, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {resource}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Next Steps */}
                  <Card className="bg-military-gold-50 border-military-gold-200">
                    <CardContent className="pt-4">
                      <h4 className="font-semibold text-military-gold-800 mb-2">Recommended Next Steps</h4>
                      <ol className="list-decimal list-inside text-sm text-military-gold-700 space-y-1">
                        <li>Start with high-priority recommendations immediately</li>
                        <li>Schedule appointments with base financial counselors</li>
                        <li>Review and update your financial plan quarterly</li>
                        <li>Consider working with a fee-only financial advisor</li>
                        <li>Join military financial planning communities for ongoing support</li>
                      </ol>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Button 
                    onClick={generateRecommendations}
                    size="lg"
                    className="bg-military-gold-500 hover:bg-military-gold-600"
                  >
                    Generate My Financial Plan
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 to-sage-100">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-navy-700 mb-4">
              Veteran Financial Planning Wizard
            </h1>
            <p className="text-lg text-navy-600 max-w-2xl mx-auto">
              Get personalized financial guidance tailored to your military service, transition status, and goals.
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Step {currentStep} of {totalSteps}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step Content */}
          {renderStep()}

          {/* Navigation */}
          {currentStep < totalSteps && (
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              
              <Button
                onClick={handleNext}
                className="flex items-center gap-2 bg-military-gold-500 hover:bg-military-gold-600"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}