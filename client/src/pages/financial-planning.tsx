import { useState, useEffect } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import SecurityReminder from "@/components/security-reminder";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Calculator, 
  DollarSign, 
  TrendingUp, 
  Shield, 
  PiggyBank, 
  AlertTriangle,
  CheckCircle,
  Info,
  Home,
  GraduationCap,
  Heart,
  Car,
  Utensils
} from "lucide-react";

interface FinancialProfile {
  vaDisabilityRating: number;
  vaMonthlyBenefit: number;
  ssdiMonthlyBenefit: number;
  militaryRetirementPension: number;
  militaryRank: string;
  yearsOfService: number;
  employmentIncome: number;
  spouseIncome: number;
  dependents: number;
  hasVAHomeLoan: boolean;
  hasGIBill: boolean;
  monthlyCosts: {
    housing: number;
    food: number;
    transportation: number;
    healthcare: number;
    education: number;
    savings: number;
    other: number;
  };
}

interface FinancialRecommendation {
  category: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  potentialSavings: number;
  action: string;
}

export default function FinancialPlanning() {
  const [profile, setProfile] = useState<FinancialProfile>({
    vaDisabilityRating: 0,
    vaMonthlyBenefit: 0,
    ssdiMonthlyBenefit: 0,
    militaryRetirementPension: 0,
    militaryRank: "",
    yearsOfService: 0,
    employmentIncome: 0,
    spouseIncome: 0,
    dependents: 0,
    hasVAHomeLoan: false,
    hasGIBill: false,
    monthlyCosts: {
      housing: 0,
      food: 0,
      transportation: 0,
      healthcare: 0,
      education: 0,
      savings: 0,
      other: 0
    }
  });

  const [recommendations, setRecommendations] = useState<FinancialRecommendation[]>([]);
  const [calculationComplete, setCalculationComplete] = useState(false);

  // VA disability compensation rates for 2024
  const vaRates = {
    10: { single: 171.23, spouse: 181.23, child: 35.88 },
    20: { single: 338.49, spouse: 358.49, child: 35.88 },
    30: { single: 524.31, spouse: 563.31, child: 35.88 },
    40: { single: 755.28, spouse: 809.28, child: 35.88 },
    50: { single: 1075.16, spouse: 1144.16, child: 35.88 },
    60: { single: 1361.88, spouse: 1444.88, child: 35.88 },
    70: { single: 1716.28, spouse: 1816.28, child: 35.88 },
    80: { single: 1995.01, spouse: 2115.01, child: 35.88 },
    90: { single: 2241.91, spouse: 2378.91, child: 35.88 },
    100: { single: 3737.85, spouse: 3946.25, child: 622.25 }
  };

  // Military retirement pay calculation (2024 base pay scale)
  const militaryPayScale = {
    "E-1": { 20: 1785, 25: 1961, 30: 2180 },
    "E-2": { 20: 1998, 25: 2193, 30: 2430 },
    "E-3": { 20: 2102, 25: 2309, 30: 2559 },
    "E-4": { 20: 2329, 25: 2558, 30: 2837 },
    "E-5": { 20: 2540, 25: 2788, 30: 3092 },
    "E-6": { 20: 2772, 25: 3042, 30: 3375 },
    "E-7": { 20: 3207, 25: 3520, 30: 3903 },
    "E-8": { 20: 4620, 25: 5073, 30: 5627 },
    "E-9": { 20: 5637, 25: 6190, 30: 6867 },
    "W-1": { 20: 3045, 25: 3342, 30: 3707 },
    "W-2": { 20: 3477, 25: 3817, 30: 4234 },
    "W-3": { 20: 3901, 25: 4283, 30: 4751 },
    "W-4": { 20: 4202, 25: 4615, 30: 5116 },
    "W-5": { 20: 5197, 25: 5709, 30: 6330 },
    "O-1": { 20: 2934, 25: 3223, 30: 3574 },
    "O-2": { 20: 3379, 25: 3712, 30: 4117 },
    "O-3": { 20: 4044, 25: 4441, 30: 4925 },
    "O-4": { 20: 4624, 25: 5078, 30: 5631 },
    "O-5": { 20: 5394, 25: 5924, 30: 6572 },
    "O-6": { 20: 6462, 25: 7097, 30: 7869 }
  };

  const militaryRanks = [
    { value: "E-1", label: "E-1 Private" },
    { value: "E-2", label: "E-2 Private" },
    { value: "E-3", label: "E-3 Private First Class" },
    { value: "E-4", label: "E-4 Specialist/Corporal" },
    { value: "E-5", label: "E-5 Sergeant" },
    { value: "E-6", label: "E-6 Staff Sergeant" },
    { value: "E-7", label: "E-7 Sergeant First Class" },
    { value: "E-8", label: "E-8 Master Sergeant" },
    { value: "E-9", label: "E-9 Sergeant Major" },
    { value: "W-1", label: "W-1 Warrant Officer" },
    { value: "W-2", label: "W-2 Chief Warrant Officer 2" },
    { value: "W-3", label: "W-3 Chief Warrant Officer 3" },
    { value: "W-4", label: "W-4 Chief Warrant Officer 4" },
    { value: "W-5", label: "W-5 Chief Warrant Officer 5" },
    { value: "O-1", label: "O-1 Second Lieutenant" },
    { value: "O-2", label: "O-2 First Lieutenant" },
    { value: "O-3", label: "O-3 Captain" },
    { value: "O-4", label: "O-4 Major" },
    { value: "O-5", label: "O-5 Lieutenant Colonel" },
    { value: "O-6", label: "O-6 Colonel" }
  ];

  useEffect(() => {
    if (profile.vaDisabilityRating > 0) {
      calculateVABenefit();
    }
  }, [profile.vaDisabilityRating, profile.dependents]);

  useEffect(() => {
    if (profile.militaryRank && profile.yearsOfService >= 20) {
      calculateMilitaryRetirement();
    }
  }, [profile.militaryRank, profile.yearsOfService]);

  const calculateVABenefit = () => {
    const rating = profile.vaDisabilityRating;
    const roundedRating = Math.floor(rating / 10) * 10;
    
    if (roundedRating >= 10 && vaRates[roundedRating as keyof typeof vaRates]) {
      const rates = vaRates[roundedRating as keyof typeof vaRates];
      let monthlyBenefit = rates.single;
      
      // Add spouse if applicable
      if (profile.spouseIncome >= 0) {
        monthlyBenefit = rates.spouse;
      }
      
      // Add dependent children
      monthlyBenefit += (rates.child * profile.dependents);
      
      setProfile(prev => ({
        ...prev,
        vaMonthlyBenefit: Math.round(monthlyBenefit * 100) / 100
      }));
    }
  };

  const calculateMilitaryRetirement = () => {
    const rank = profile.militaryRank as keyof typeof militaryPayScale;
    const years = profile.yearsOfService;
    
    if (militaryPayScale[rank] && years >= 20) {
      let basePay = 0;
      
      // Determine which pay bracket to use based on years of service
      if (years >= 30) {
        basePay = militaryPayScale[rank][30] || militaryPayScale[rank][25] || militaryPayScale[rank][20];
      } else if (years >= 25) {
        basePay = militaryPayScale[rank][25] || militaryPayScale[rank][20];
      } else {
        basePay = militaryPayScale[rank][20];
      }
      
      // Calculate retirement pay: 2.5% per year of service
      const retirementPercentage = Math.min(years * 0.025, 0.75); // Cap at 75%
      const monthlyRetirement = Math.round((basePay * retirementPercentage) * 100) / 100;
      
      setProfile(prev => ({
        ...prev,
        militaryRetirementPension: monthlyRetirement
      }));
    } else if (years < 20) {
      setProfile(prev => ({
        ...prev,
        militaryRetirementPension: 0
      }));
    }
  };

  const generateRecommendations = () => {
    const recs: FinancialRecommendation[] = [];
    const totalIncome = profile.vaMonthlyBenefit + profile.ssdiMonthlyBenefit + profile.militaryRetirementPension + profile.employmentIncome + profile.spouseIncome;
    const totalExpenses = Object.values(profile.monthlyCosts).reduce((sum, cost) => sum + cost, 0);
    const netIncome = totalIncome - totalExpenses;

    // VA Home Loan recommendation
    if (!profile.hasVAHomeLoan && profile.vaDisabilityRating >= 10) {
      recs.push({
        category: "Housing",
        title: "VA Home Loan Benefits",
        description: "You're eligible for VA home loans with 0% down payment and no PMI. This could save thousands in closing costs and monthly payments.",
        priority: "high",
        potentialSavings: 500,
        action: "Apply for VA home loan certificate of eligibility"
      });
    }

    // GI Bill recommendation
    if (!profile.hasGIBill && profile.monthlyCosts.education > 0) {
      recs.push({
        category: "Education",
        title: "GI Bill Education Benefits",
        description: "Use your GI Bill benefits to cover education costs and receive monthly housing allowance while in school.",
        priority: "high",
        potentialSavings: profile.monthlyCosts.education,
        action: "Apply for GI Bill benefits at VA.gov"
      });
    }

    // Property tax exemption for 100% disabled
    if (profile.vaDisabilityRating === 100) {
      recs.push({
        category: "Tax Benefits",
        title: "Property Tax Exemption",
        description: "100% disabled veterans are eligible for property tax exemptions in most states, potentially saving thousands annually.",
        priority: "high",
        potentialSavings: 200,
        action: "Contact your county assessor about disabled veteran property tax exemptions"
      });
    }

    // Emergency fund recommendation
    if (profile.monthlyCosts.savings < (totalIncome * 0.2)) {
      recs.push({
        category: "Savings",
        title: "Emergency Fund Building",
        description: "Build an emergency fund of 3-6 months expenses. Your VA disability benefits provide stable income for this goal.",
        priority: "medium",
        potentialSavings: 0,
        action: "Set up automatic transfer of 20% of income to savings"
      });
    }

    // SSDI coordination
    if (profile.vaDisabilityRating === 100 && profile.ssdiMonthlyBenefit === 0) {
      recs.push({
        category: "Benefits Optimization",
        title: "Social Security Disability Application",
        description: "100% disabled veterans often qualify for SSDI. This provides additional monthly income that doesn't affect VA benefits.",
        priority: "high",
        potentialSavings: 1000,
        action: "Consult with SSDI attorney specializing in veterans"
      });
    }

    // Military retirement specific recommendations
    if (profile.militaryRetirementPension > 0) {
      recs.push({
        category: "Retirement Planning",
        title: "Survivor Benefit Plan (SBP) Review",
        description: "Review your SBP election to ensure your spouse is protected. Consider cost vs. benefit analysis based on your total retirement income.",
        priority: "medium",
        potentialSavings: 0,
        action: "Contact DFAS to review SBP options and costs"
      });

      recs.push({
        category: "Tax Planning",
        title: "Military Retirement Tax Strategy",
        description: "Some states don't tax military retirement pay. Consider residency and tax planning to maximize your pension value.",
        priority: "medium",
        potentialSavings: Math.round(profile.militaryRetirementPension * 0.05),
        action: "Consult tax professional about state tax optimization"
      });
    }

    // Budget optimization
    if (netIncome < 0) {
      recs.push({
        category: "Budget",
        title: "Expense Reduction Strategy",
        description: "Your expenses exceed income. Focus on reducing non-essential costs and maximizing veteran benefits.",
        priority: "high",
        potentialSavings: Math.abs(netIncome),
        action: "Review and reduce discretionary spending"
      });
    }

    setRecommendations(recs);
    setCalculationComplete(true);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "border-red-200 bg-red-50";
      case "medium": return "border-military-gold-200 bg-military-gold-50";
      case "low": return "border-sage-200 bg-sage-50";
      default: return "border-gray-200 bg-gray-50";
    }
  };

  const totalIncome = profile.vaMonthlyBenefit + profile.ssdiMonthlyBenefit + profile.militaryRetirementPension + profile.employmentIncome + profile.spouseIncome;
  const totalExpenses = Object.values(profile.monthlyCosts).reduce((sum, cost) => sum + cost, 0);
  const netIncome = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? (profile.monthlyCosts.savings / totalIncome) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-navy-50 via-white to-sage-50">
      <Header />
      
      <main className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gradient-to-r from-military-gold-100 to-navy-100 rounded-full">
                <Calculator className="h-12 w-12 text-navy-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-navy-700 mb-4">
              Veteran Financial Planning Tool
            </h1>
            <p className="text-xl text-navy-600 max-w-3xl mx-auto mb-8">
              Optimize your financial strategy with VA disability benefits, Social Security, and veteran-specific opportunities. 
              Get personalized recommendations based on your unique situation.
            </p>
            <div className="flex justify-center space-x-4">
              <Badge className="bg-military-gold-100 text-military-gold-800 px-4 py-2">
                <Shield className="h-4 w-4 mr-1" />
                VA Benefits Optimization
              </Badge>
              <Badge className="bg-navy-100 text-navy-800 px-4 py-2">
                <TrendingUp className="h-4 w-4 mr-1" />
                Personalized Recommendations
              </Badge>
            </div>
          </div>

          {/* Security Reminder */}
          <SecurityReminder />

          <Tabs defaultValue="input" className="space-y-8">
            <div className="flex justify-center">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="input">Financial Input</TabsTrigger>
                <TabsTrigger value="analysis">Analysis & Recommendations</TabsTrigger>
              </TabsList>
            </div>

            {/* Input Tab */}
            <TabsContent value="input" className="space-y-8">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Income Section */}
                <Card className="bg-gradient-to-br from-navy-50 to-white">
                  <CardHeader>
                    <CardTitle className="flex items-center text-navy-700">
                      <DollarSign className="h-6 w-6 mr-3" />
                      Income & Benefits
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="vaRating">VA Disability Rating (%)</Label>
                      <Input
                        id="vaRating"
                        type="number"
                        min="0"
                        max="100"
                        step="10"
                        value={profile.vaDisabilityRating}
                        onChange={(e) => setProfile({...profile, vaDisabilityRating: parseInt(e.target.value) || 0})}
                        placeholder="e.g., 70, 100"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="vaBenefit">Monthly VA Disability Benefit</Label>
                      <Input
                        id="vaBenefit"
                        type="number"
                        value={profile.vaMonthlyBenefit}
                        readOnly
                        className="bg-gray-50"
                      />
                      <p className="text-xs text-navy-600">Automatically calculated based on rating and dependents</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dependents">Number of Dependents</Label>
                      <Input
                        id="dependents"
                        type="number"
                        min="0"
                        value={profile.dependents}
                        onChange={(e) => setProfile({...profile, dependents: parseInt(e.target.value) || 0})}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ssdi">Monthly SSDI Benefits</Label>
                      <Input
                        id="ssdi"
                        type="number"
                        value={profile.ssdiMonthlyBenefit}
                        onChange={(e) => setProfile({...profile, ssdiMonthlyBenefit: parseFloat(e.target.value) || 0})}
                        placeholder="Enter if receiving SSDI"
                      />
                    </div>

                    <div className="space-y-4">
                      <Label className="flex items-center text-base font-semibold">
                        <Shield className="h-5 w-5 mr-2 text-military-gold-500" />
                        Military Retirement Pension
                      </Label>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="rank">Rank at Retirement</Label>
                          <Select value={profile.militaryRank} onValueChange={(value) => setProfile({...profile, militaryRank: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your rank" />
                            </SelectTrigger>
                            <SelectContent>
                              {militaryRanks.map(rank => (
                                <SelectItem key={rank.value} value={rank.value}>{rank.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="yearsService">Years of Service</Label>
                          <Input
                            id="yearsService"
                            type="number"
                            min="0"
                            max="40"
                            value={profile.yearsOfService}
                            onChange={(e) => setProfile({...profile, yearsOfService: parseInt(e.target.value) || 0})}
                            placeholder="e.g., 27"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="calculatedPension">Calculated Monthly Pension</Label>
                        <Input
                          id="calculatedPension"
                          type="number"
                          value={profile.militaryRetirementPension}
                          readOnly
                          className="bg-gray-50 font-semibold"
                        />
                        <p className="text-xs text-navy-600">
                          {profile.yearsOfService >= 20 && profile.militaryRank ? 
                            `Calculated: ${Math.min(profile.yearsOfService * 2.5, 75)}% of base pay for ${profile.militaryRank} with ${profile.yearsOfService} years` :
                            "Select rank and enter 20+ years for automatic calculation"
                          }
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="employment">Monthly Employment Income</Label>
                      <Input
                        id="employment"
                        type="number"
                        value={profile.employmentIncome}
                        onChange={(e) => setProfile({...profile, employmentIncome: parseFloat(e.target.value) || 0})}
                        placeholder="Your work income"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="spouse">Monthly Spouse Income</Label>
                      <Input
                        id="spouse"
                        type="number"
                        value={profile.spouseIncome}
                        onChange={(e) => setProfile({...profile, spouseIncome: parseFloat(e.target.value) || 0})}
                        placeholder="Spouse's income"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Expenses Section */}
                <Card className="bg-gradient-to-br from-sage-50 to-white">
                  <CardHeader>
                    <CardTitle className="flex items-center text-navy-700">
                      <Utensils className="h-6 w-6 mr-3" />
                      Monthly Expenses
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="housing" className="flex items-center">
                        <Home className="h-4 w-4 mr-2" />
                        Housing (Rent/Mortgage)
                      </Label>
                      <Input
                        id="housing"
                        type="number"
                        value={profile.monthlyCosts.housing}
                        onChange={(e) => setProfile({
                          ...profile, 
                          monthlyCosts: {...profile.monthlyCosts, housing: parseFloat(e.target.value) || 0}
                        })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="food">Food & Groceries</Label>
                      <Input
                        id="food"
                        type="number"
                        value={profile.monthlyCosts.food}
                        onChange={(e) => setProfile({
                          ...profile, 
                          monthlyCosts: {...profile.monthlyCosts, food: parseFloat(e.target.value) || 0}
                        })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="transportation" className="flex items-center">
                        <Car className="h-4 w-4 mr-2" />
                        Transportation
                      </Label>
                      <Input
                        id="transportation"
                        type="number"
                        value={profile.monthlyCosts.transportation}
                        onChange={(e) => setProfile({
                          ...profile, 
                          monthlyCosts: {...profile.monthlyCosts, transportation: parseFloat(e.target.value) || 0}
                        })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="healthcare" className="flex items-center">
                        <Heart className="h-4 w-4 mr-2" />
                        Healthcare (Non-VA)
                      </Label>
                      <Input
                        id="healthcare"
                        type="number"
                        value={profile.monthlyCosts.healthcare}
                        onChange={(e) => setProfile({
                          ...profile, 
                          monthlyCosts: {...profile.monthlyCosts, healthcare: parseFloat(e.target.value) || 0}
                        })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="education" className="flex items-center">
                        <GraduationCap className="h-4 w-4 mr-2" />
                        Education
                      </Label>
                      <Input
                        id="education"
                        type="number"
                        value={profile.monthlyCosts.education}
                        onChange={(e) => setProfile({
                          ...profile, 
                          monthlyCosts: {...profile.monthlyCosts, education: parseFloat(e.target.value) || 0}
                        })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="savings" className="flex items-center">
                        <PiggyBank className="h-4 w-4 mr-2" />
                        Savings & Investments
                      </Label>
                      <Input
                        id="savings"
                        type="number"
                        value={profile.monthlyCosts.savings}
                        onChange={(e) => setProfile({
                          ...profile, 
                          monthlyCosts: {...profile.monthlyCosts, savings: parseFloat(e.target.value) || 0}
                        })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="other">Other Expenses</Label>
                      <Input
                        id="other"
                        type="number"
                        value={profile.monthlyCosts.other}
                        onChange={(e) => setProfile({
                          ...profile, 
                          monthlyCosts: {...profile.monthlyCosts, other: parseFloat(e.target.value) || 0}
                        })}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-center">
                <Button 
                  onClick={generateRecommendations}
                  className="bg-navy-600 hover:bg-navy-700 px-8 py-3"
                  disabled={profile.vaDisabilityRating === 0}
                >
                  <Calculator className="h-4 w-4 mr-2" />
                  Generate Financial Analysis
                </Button>
              </div>
            </TabsContent>

            {/* Analysis Tab */}
            <TabsContent value="analysis" className="space-y-8">
              {calculationComplete ? (
                <>
                  {/* Financial Summary */}
                  <div className="grid md:grid-cols-4 gap-6">
                    <Card className="bg-gradient-to-br from-navy-50 to-white">
                      <CardContent className="p-6 text-center">
                        <DollarSign className="h-8 w-8 text-navy-500 mx-auto mb-2" />
                        <h3 className="font-semibold text-navy-700">Total Income</h3>
                        <p className="text-2xl font-bold text-navy-600">${totalIncome.toLocaleString()}</p>
                        <p className="text-sm text-navy-500">per month</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-military-gold-50 to-white">
                      <CardContent className="p-6 text-center">
                        <Utensils className="h-8 w-8 text-military-gold-500 mx-auto mb-2" />
                        <h3 className="font-semibold text-navy-700">Total Expenses</h3>
                        <p className="text-2xl font-bold text-military-gold-600">${totalExpenses.toLocaleString()}</p>
                        <p className="text-sm text-military-gold-500">per month</p>
                      </CardContent>
                    </Card>

                    <Card className={`bg-gradient-to-br ${netIncome >= 0 ? 'from-sage-50' : 'from-red-50'} to-white`}>
                      <CardContent className="p-6 text-center">
                        <TrendingUp className={`h-8 w-8 ${netIncome >= 0 ? 'text-sage-500' : 'text-red-500'} mx-auto mb-2`} />
                        <h3 className="font-semibold text-navy-700">Net Income</h3>
                        <p className={`text-2xl font-bold ${netIncome >= 0 ? 'text-sage-600' : 'text-red-600'}`}>
                          ${netIncome.toLocaleString()}
                        </p>
                        <p className="text-sm text-navy-500">per month</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-warm-gray-50 to-white">
                      <CardContent className="p-6 text-center">
                        <PiggyBank className="h-8 w-8 text-warm-gray-500 mx-auto mb-2" />
                        <h3 className="font-semibold text-navy-700">Savings Rate</h3>
                        <p className="text-2xl font-bold text-warm-gray-600">{savingsRate.toFixed(1)}%</p>
                        <Progress value={savingsRate} className="mt-2" />
                      </CardContent>
                    </Card>
                  </div>

                  {/* Recommendations */}
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-navy-700 text-center">Personalized Recommendations</h2>
                    <div className="grid gap-6">
                      {recommendations.map((rec, index) => (
                        <Card key={index} className={`${getPriorityColor(rec.priority)} hover:shadow-lg transition-shadow`}>
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="p-2 bg-white rounded-lg">
                                  {rec.priority === 'high' ? 
                                    <AlertTriangle className="h-6 w-6 text-red-600" /> :
                                    rec.priority === 'medium' ?
                                    <Info className="h-6 w-6 text-military-gold-600" /> :
                                    <CheckCircle className="h-6 w-6 text-sage-600" />
                                  }
                                </div>
                                <div>
                                  <CardTitle className="text-lg text-navy-700">{rec.title}</CardTitle>
                                  <Badge variant="outline" className={`mt-1 ${
                                    rec.priority === 'high' ? 'border-red-400 text-red-700' : 
                                    rec.priority === 'medium' ? 'border-military-gold-400 text-military-gold-700' :
                                    'border-sage-400 text-sage-700'
                                  }`}>
                                    {rec.category} • {rec.priority} priority
                                  </Badge>
                                </div>
                              </div>
                              {rec.potentialSavings > 0 && (
                                <Badge className="bg-sage-100 text-sage-800">
                                  Save ${rec.potentialSavings}/month
                                </Badge>
                              )}
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <p className="text-navy-600">{rec.description}</p>
                            <div className="p-3 bg-white rounded-lg">
                              <h4 className="font-semibold text-navy-700 mb-2">Recommended Action:</h4>
                              <p className="text-navy-600">{rec.action}</p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <Calculator className="h-16 w-16 text-navy-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-navy-700 mb-2">Ready for Analysis</h3>
                  <p className="text-navy-600">Complete your financial information in the input tab and generate your personalized analysis.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}