import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  Calculator, 
  DollarSign, 
  Heart, 
  GraduationCap, 
  Home, 
  Briefcase, 
  Shield, 
  CheckCircle2, 
  XCircle, 
  Clock,
  ExternalLink,
  Phone,
  Info
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import PageLayout from "@/components/page-layout";

interface BenefitResult {
  id: number;
  benefitName: string;
  benefitType: string;
  description: string;
  benefitAmount?: string;
  applicationProcess?: string;
  processingTime?: string;
  websiteUrl?: string;
  phoneNumber?: string;
}

interface EligibilityFormData {
  serviceStatus: string;
  branch: string;
  serviceDates: {
    startDate: string;
    endDate: string;
    totalYears: number;
    totalMonths: number;
  };
  dischargeType: string;
  disabilityRating: number;
  combatVeteran: boolean;
  prisonerOfWar: boolean;
  purpleHeart: boolean;
  dependents: {
    spouse: boolean;
    children: number;
  };
  income: {
    annualIncome: number;
    householdIncome: number;
  };
  location: {
    state: string;
    zipCode: string;
  };
}

export default function BenefitsCalculator() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<EligibilityFormData>({
    serviceStatus: "",
    branch: "",
    serviceDates: {
      startDate: "",
      endDate: "",
      totalYears: 0,
      totalMonths: 0
    },
    dischargeType: "",
    disabilityRating: 0,
    combatVeteran: false,
    prisonerOfWar: false,
    purpleHeart: false,
    dependents: {
      spouse: false,
      children: 0
    },
    income: {
      annualIncome: 0,
      householdIncome: 0
    },
    location: {
      state: "",
      zipCode: ""
    }
  });

  const [eligibleBenefits, setEligibleBenefits] = useState<BenefitResult[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [hasCalculated, setHasCalculated] = useState(false);

  const calculateMutation = useMutation({
    mutationFn: async (data: EligibilityFormData) => {
      const response = await apiRequest("POST", "/api/benefits/calculate", data);
      return response.json();
    },
    onSuccess: (result) => {
      const benefits = JSON.parse(result.eligibleBenefits || "[]");
      setEligibleBenefits(benefits);
      setHasCalculated(true);
      toast({
        title: "Calculation Complete",
        description: `Found ${benefits.length} benefits you may be eligible for.`,
      });
    },
    onError: (error) => {
      console.error("Benefits calculation error:", error);
      toast({
        title: "Calculation Error",
        description: "Unable to calculate benefits eligibility. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Calculate service duration when dates change
  useEffect(() => {
    if (formData.serviceDates.startDate && formData.serviceDates.endDate) {
      const start = new Date(formData.serviceDates.startDate);
      const end = new Date(formData.serviceDates.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const totalMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30.44));
      const totalYears = Math.floor(totalMonths / 12);

      setFormData(prev => ({
        ...prev,
        serviceDates: {
          ...prev.serviceDates,
          totalYears,
          totalMonths
        }
      }));
    }
  }, [formData.serviceDates.startDate, formData.serviceDates.endDate]);

  // Real-time calculation trigger
  useEffect(() => {
    if (formData.serviceStatus && formData.branch && formData.serviceDates.totalYears > 0) {
      const timeoutId = setTimeout(() => {
        setIsCalculating(true);
        calculateMutation.mutate(formData);
        setTimeout(() => setIsCalculating(false), 500);
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [formData]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => {
      const keys = field.split('.');
      if (keys.length === 1) {
        return { ...prev, [field]: value };
      } else if (keys.length === 2) {
        const [parentKey, childKey] = keys;
        const parentValue = prev[parentKey as keyof EligibilityFormData];
        
        if (typeof parentValue === 'object' && parentValue !== null) {
          return {
            ...prev,
            [parentKey]: {
              ...parentValue,
              [childKey]: value
            }
          };
        }
      }
      return prev;
    });
  };

  const getBenefitIcon = (type: string) => {
    switch (type) {
      case 'healthcare': return <Heart className="h-5 w-5" />;
      case 'education': return <GraduationCap className="h-5 w-5" />;
      case 'housing': return <Home className="h-5 w-5" />;
      case 'disability': return <Shield className="h-5 w-5" />;
      case 'employment': return <Briefcase className="h-5 w-5" />;
      default: return <DollarSign className="h-5 w-5" />;
    }
  };

  const getBenefitColor = (type: string) => {
    switch (type) {
      case 'healthcare': return 'bg-red-50 text-red-700 border-red-200';
      case 'education': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'housing': return 'bg-green-50 text-green-700 border-green-200';
      case 'disability': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'employment': return 'bg-purple-50 text-purple-700 border-purple-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <PageLayout>
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-blue-600 rounded-full">
                <Calculator className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Real-Time Benefits Eligibility Calculator
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Instantly discover all federal, state, and local benefits you're eligible for based on your military service record. 
              Results update automatically as you enter information.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    Service Information
                  </CardTitle>
                  <CardDescription>
                    Enter your military service details for personalized benefit calculations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Tabs defaultValue="basic" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="basic">Basic Info</TabsTrigger>
                      <TabsTrigger value="service">Service Record</TabsTrigger>
                      <TabsTrigger value="family">Family</TabsTrigger>
                      <TabsTrigger value="financial">Financial</TabsTrigger>
                    </TabsList>

                    <TabsContent value="basic" className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="serviceStatus">Service Status</Label>
                          <Select value={formData.serviceStatus} onValueChange={(value) => handleInputChange('serviceStatus', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">Active Duty</SelectItem>
                              <SelectItem value="veteran">Veteran</SelectItem>
                              <SelectItem value="retired">Retired</SelectItem>
                              <SelectItem value="discharged">Discharged</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="branch">Military Branch</Label>
                          <Select value={formData.branch} onValueChange={(value) => handleInputChange('branch', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select branch" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Army">U.S. Army</SelectItem>
                              <SelectItem value="Navy">U.S. Navy</SelectItem>
                              <SelectItem value="Air Force">U.S. Air Force</SelectItem>
                              <SelectItem value="Marines">U.S. Marine Corps</SelectItem>
                              <SelectItem value="Coast Guard">U.S. Coast Guard</SelectItem>
                              <SelectItem value="Space Force">U.S. Space Force</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          value={formData.location.state}
                          onChange={(e) => handleInputChange('location.state', e.target.value)}
                          placeholder="Enter your state"
                        />
                      </div>

                      <div>
                        <Label htmlFor="zipCode">ZIP Code</Label>
                        <Input
                          id="zipCode"
                          value={formData.location.zipCode}
                          onChange={(e) => handleInputChange('location.zipCode', e.target.value)}
                          placeholder="Enter ZIP code"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="service" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="startDate">Service Start Date</Label>
                        <Input
                          id="startDate"
                          type="date"
                          value={formData.serviceDates.startDate}
                          onChange={(e) => handleInputChange('serviceDates.startDate', e.target.value)}
                        />
                      </div>

                      <div>
                        <Label htmlFor="endDate">Service End Date</Label>
                        <Input
                          id="endDate"
                          type="date"
                          value={formData.serviceDates.endDate}
                          onChange={(e) => handleInputChange('serviceDates.endDate', e.target.value)}
                        />
                      </div>
                    </div>

                    {formData.serviceDates.totalYears > 0 && (
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-700">
                          Total Service: {formData.serviceDates.totalYears} years, {formData.serviceDates.totalMonths % 12} months
                        </p>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="dischargeType">Discharge Type</Label>
                        <Select value={formData.dischargeType} onValueChange={(value) => handleInputChange('dischargeType', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select discharge type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="honorable">Honorable</SelectItem>
                            <SelectItem value="general">General</SelectItem>
                            <SelectItem value="other_than_honorable">Other Than Honorable</SelectItem>
                            <SelectItem value="dishonorable">Dishonorable</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="disabilityRating">VA Disability Rating (%)</Label>
                        <Input
                          id="disabilityRating"
                          type="number"
                          min="0"
                          max="100"
                          value={formData.disabilityRating}
                          onChange={(e) => handleInputChange('disabilityRating', parseInt(e.target.value) || 0)}
                          placeholder="0-100"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Service Recognition</Label>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="combatVeteran"
                            checked={formData.combatVeteran}
                            onCheckedChange={(checked) => handleInputChange('combatVeteran', checked)}
                          />
                          <Label htmlFor="combatVeteran">Combat Veteran</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="purpleHeart"
                            checked={formData.purpleHeart}
                            onCheckedChange={(checked) => handleInputChange('purpleHeart', checked)}
                          />
                          <Label htmlFor="purpleHeart">Purple Heart Recipient</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="prisonerOfWar"
                            checked={formData.prisonerOfWar}
                            onCheckedChange={(checked) => handleInputChange('prisonerOfWar', checked)}
                          />
                          <Label htmlFor="prisonerOfWar">Former Prisoner of War</Label>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="family" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="spouse"
                          checked={formData.dependents.spouse}
                          onCheckedChange={(checked) => handleInputChange('dependents.spouse', checked)}
                        />
                        <Label htmlFor="spouse">Married/Spouse</Label>
                      </div>

                      <div>
                        <Label htmlFor="children">Number of Children</Label>
                        <Input
                          id="children"
                          type="number"
                          min="0"
                          value={formData.dependents.children}
                          onChange={(e) => handleInputChange('dependents.children', parseInt(e.target.value) || 0)}
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="financial" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="annualIncome">Annual Personal Income</Label>
                        <Input
                          id="annualIncome"
                          type="number"
                          value={formData.income.annualIncome}
                          onChange={(e) => handleInputChange('income.annualIncome', parseInt(e.target.value) || 0)}
                          placeholder="$0"
                        />
                      </div>

                      <div>
                        <Label htmlFor="householdIncome">Total Household Income</Label>
                        <Input
                          id="householdIncome"
                          type="number"
                          value={formData.income.householdIncome}
                          onChange={(e) => handleInputChange('income.householdIncome', parseInt(e.target.value) || 0)}
                          placeholder="$0"
                        />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Results */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {isCalculating ? (
                      <Clock className="h-5 w-5 animate-spin" />
                    ) : (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    )}
                    Eligible Benefits
                  </CardTitle>
                  <CardDescription>
                    {isCalculating ? "Calculating..." : `${eligibleBenefits.length} benefits found`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!hasCalculated && !isCalculating && (
                    <div className="text-center text-gray-500 py-8">
                      <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Fill out the form to see your eligible benefits</p>
                    </div>
                  )}

                  {isCalculating && (
                    <div className="text-center py-8">
                      <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                      <p className="text-gray-600">Calculating eligibility...</p>
                    </div>
                  )}

                  {hasCalculated && !isCalculating && (
                    <div className="space-y-3">
                      {eligibleBenefits.length === 0 ? (
                        <div className="text-center text-gray-500 py-8">
                          <XCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>No benefits found with current criteria</p>
                        </div>
                      ) : (
                        eligibleBenefits.map((benefit, index) => (
                          <Card key={index} className="border-l-4 border-l-blue-500">
                            <CardContent className="p-4">
                              <div className="flex items-start gap-3">
                                <div className={`p-2 rounded-full ${getBenefitColor(benefit.benefitType)}`}>
                                  {getBenefitIcon(benefit.benefitType)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-medium text-sm leading-tight">{benefit.benefitName}</h4>
                                  <Badge variant="outline" className="mt-1 text-xs">
                                    {benefit.benefitType}
                                  </Badge>
                                  {benefit.benefitAmount && (
                                    <p className="text-sm font-medium text-green-600 mt-1">
                                      {benefit.benefitAmount}
                                    </p>
                                  )}
                                  {benefit.processingTime && (
                                    <p className="text-xs text-gray-500 mt-1">
                                      Processing: {benefit.processingTime}
                                    </p>
                                  )}
                                  <div className="flex gap-2 mt-2">
                                    {benefit.websiteUrl && (
                                      <Button size="sm" variant="outline" className="h-6 text-xs" asChild>
                                        <a href={benefit.websiteUrl} target="_blank" rel="noopener noreferrer">
                                          <ExternalLink className="h-3 w-3 mr-1" />
                                          Apply
                                        </a>
                                      </Button>
                                    )}
                                    {benefit.phoneNumber && (
                                      <Button size="sm" variant="outline" className="h-6 text-xs" asChild>
                                        <a href={`tel:${benefit.phoneNumber}`}>
                                          <Phone className="h-3 w-3 mr-1" />
                                          Call
                                        </a>
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}