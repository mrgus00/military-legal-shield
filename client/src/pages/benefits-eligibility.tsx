import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Calculator, DollarSign, GraduationCap, Heart, Shield, Clock, TrendingUp, AlertTriangle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface BenefitsEligibilityData {
  personalInfo: {
    branch: string;
    rank: string;
    yearsOfService: number;
    activeStatus: string;
    deployments: number;
    injuryStatus: string;
    dependents: {
      spouse: boolean;
      children: number;
    };
  };
  disabilityInfo: {
    rating: number;
    conditions: string[];
    combatRelated: boolean;
  };
}

interface BenefitsCalculation {
  vaDisability: {
    monthlyPayment: number;
    eligible: boolean;
    dependentAllowance: number;
    totalMonthly: number;
  };
  retirement: {
    eligible: boolean;
    monthlyPension: number;
    lumpSum: number;
    survivorBenefits: number;
  };
  education: {
    giEligible: boolean;
    months: number;
    housingAllowance: number;
    bookStipend: number;
    transferable: boolean;
  };
  healthcare: {
    vaHealthcare: boolean;
    tricare: boolean;
    dental: boolean;
    vision: boolean;
    priorityGroup: number;
  };
  other: {
    lifeInsurance: number;
    homeLoans: boolean;
    vocationalRehab: boolean;
    dependentEducation: boolean;
  };
}

export default function BenefitsEligibility() {
  const [formData, setFormData] = useState<BenefitsEligibilityData>({
    personalInfo: {
      branch: "",
      rank: "",
      yearsOfService: 0,
      activeStatus: "",
      deployments: 0,
      injuryStatus: "none",
      dependents: {
        spouse: false,
        children: 0
      }
    },
    disabilityInfo: {
      rating: 0,
      conditions: [],
      combatRelated: false
    }
  });

  const [calculations, setCalculations] = useState<BenefitsCalculation | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const branches = [
    { value: "army", label: "U.S. Army" },
    { value: "navy", label: "U.S. Navy" },
    { value: "marines", label: "U.S. Marine Corps" },
    { value: "airforce", label: "U.S. Air Force" },
    { value: "coastguard", label: "U.S. Coast Guard" },
    { value: "spaceforce", label: "U.S. Space Force" }
  ];

  const activeStatuses = [
    { value: "active", label: "Active Duty" },
    { value: "reserve", label: "Reserve" },
    { value: "guard", label: "National Guard" },
    { value: "veteran", label: "Veteran" },
    { value: "retired", label: "Retired" }
  ];

  const injuryStatuses = [
    { value: "none", label: "No Service-Connected Injuries" },
    { value: "service", label: "Service-Connected Injuries" },
    { value: "combat", label: "Combat-Related Injuries" },
    { value: "training", label: "Training-Related Injuries" }
  ];

  const calculateBenefits = async () => {
    setIsCalculating(true);
    try {
      const response = await apiRequest("POST", "/api/calculate-benefits-eligibility", formData);
      const data = await response.json();
      setCalculations(data);
    } catch (error) {
      console.error("Benefits calculation error:", error);
    } finally {
      setIsCalculating(false);
    }
  };

  const updatePersonalInfo = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }));
  };

  const updateDependents = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        dependents: {
          ...prev.personalInfo.dependents,
          [field]: value
        }
      }
    }));
  };

  const updateDisabilityInfo = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      disabilityInfo: {
        ...prev.disabilityInfo,
        [field]: value
      }
    }));
  };

  const getEligibilityColor = (eligible: boolean) => {
    return eligible ? "text-green-600" : "text-red-600";
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Calculator className="h-8 w-8 text-orange-600" />
            <h1 className="text-3xl font-bold text-gray-900">Benefits Eligibility Calculator</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Calculate your military benefits eligibility including VA disability compensation, 
            retirement pay, education benefits, and healthcare coverage in real-time.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  Personal Information
                </CardTitle>
                <CardDescription>
                  Enter your military service details for accurate benefit calculations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="branch">Military Branch</Label>
                    <Select value={formData.personalInfo.branch} onValueChange={(value) => updatePersonalInfo("branch", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select branch" />
                      </SelectTrigger>
                      <SelectContent>
                        {branches.map(branch => (
                          <SelectItem key={branch.value} value={branch.value}>
                            {branch.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="activeStatus">Service Status</Label>
                    <Select value={formData.personalInfo.activeStatus} onValueChange={(value) => updatePersonalInfo("activeStatus", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {activeStatuses.map(status => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="rank">Current/Final Rank</Label>
                    <Input
                      id="rank"
                      placeholder="e.g., E-5, O-3, W-2"
                      value={formData.personalInfo.rank}
                      onChange={(e) => updatePersonalInfo("rank", e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="yearsOfService">Years of Service</Label>
                    <Input
                      id="yearsOfService"
                      type="number"
                      min="0"
                      max="40"
                      value={formData.personalInfo.yearsOfService}
                      onChange={(e) => updatePersonalInfo("yearsOfService", parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="deployments">Number of Deployments</Label>
                    <Input
                      id="deployments"
                      type="number"
                      min="0"
                      value={formData.personalInfo.deployments}
                      onChange={(e) => updatePersonalInfo("deployments", parseInt(e.target.value) || 0)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="injuryStatus">Injury Status</Label>
                    <Select value={formData.personalInfo.injuryStatus} onValueChange={(value) => updatePersonalInfo("injuryStatus", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select injury status" />
                      </SelectTrigger>
                      <SelectContent>
                        {injuryStatuses.map(status => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div>
                  <Label className="text-base font-medium">Dependents</Label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <Label htmlFor="spouse">Spouse</Label>
                      <Select value={formData.personalInfo.dependents.spouse.toString()} onValueChange={(value) => updateDependents("spouse", value === "true")}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="false">No Spouse</SelectItem>
                          <SelectItem value="true">Married</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="children">Number of Children</Label>
                      <Input
                        id="children"
                        type="number"
                        min="0"
                        max="10"
                        value={formData.personalInfo.dependents.children}
                        onChange={(e) => updateDependents("children", parseInt(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-600" />
                  Disability Information
                </CardTitle>
                <CardDescription>
                  Information about service-connected disabilities and conditions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="disabilityRating">VA Disability Rating (%)</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="disabilityRating"
                      type="number"
                      min="0"
                      max="100"
                      step="10"
                      value={formData.disabilityInfo.rating}
                      onChange={(e) => updateDisabilityInfo("rating", parseInt(e.target.value) || 0)}
                      className="w-24"
                    />
                    <Progress value={formData.disabilityInfo.rating} className="flex-1" />
                    <span className="text-sm font-medium w-12">{formData.disabilityInfo.rating}%</span>
                  </div>
                </div>

                <div>
                  <Label htmlFor="combatRelated">Combat-Related Injuries</Label>
                  <Select value={formData.disabilityInfo.combatRelated.toString()} onValueChange={(value) => updateDisabilityInfo("combatRelated", value === "true")}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="false">No Combat-Related Injuries</SelectItem>
                      <SelectItem value="true">Combat-Related Injuries</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Button 
              onClick={calculateBenefits}
              disabled={isCalculating || !formData.personalInfo.branch || !formData.personalInfo.activeStatus}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 text-lg"
            >
              {isCalculating ? (
                <>
                  <Clock className="h-5 w-5 mr-2 animate-spin" />
                  Calculating Benefits...
                </>
              ) : (
                <>
                  <Calculator className="h-5 w-5 mr-2" />
                  Calculate My Benefits
                </>
              )}
            </Button>
          </div>

          {/* Results */}
          <div className="space-y-6">
            {calculations ? (
              <Tabs defaultValue="disability" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="disability">Disability</TabsTrigger>
                  <TabsTrigger value="retirement">Retirement</TabsTrigger>
                  <TabsTrigger value="education">Education</TabsTrigger>
                  <TabsTrigger value="healthcare">Healthcare</TabsTrigger>
                </TabsList>

                <TabsContent value="disability" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-green-600" />
                        VA Disability Compensation
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span>Eligibility Status:</span>
                          <Badge variant={calculations.vaDisability.eligible ? "default" : "destructive"}>
                            {calculations.vaDisability.eligible ? "Eligible" : "Not Eligible"}
                          </Badge>
                        </div>
                        
                        {calculations.vaDisability.eligible && (
                          <>
                            <Separator />
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>Monthly Disability Payment</Label>
                                <div className="text-2xl font-bold text-green-600">
                                  {formatCurrency(calculations.vaDisability.monthlyPayment)}
                                </div>
                              </div>
                              <div>
                                <Label>Dependent Allowance</Label>
                                <div className="text-xl font-semibold">
                                  {formatCurrency(calculations.vaDisability.dependentAllowance)}
                                </div>
                              </div>
                            </div>
                            <Separator />
                            <div className="bg-green-50 p-4 rounded-lg">
                              <div className="flex justify-between items-center">
                                <span className="font-medium">Total Monthly Payment:</span>
                                <span className="text-2xl font-bold text-green-600">
                                  {formatCurrency(calculations.vaDisability.totalMonthly)}
                                </span>
                              </div>
                              <div className="text-sm text-gray-600 mt-2">
                                Annual: {formatCurrency(calculations.vaDisability.totalMonthly * 12)}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="retirement" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-blue-600" />
                        Military Retirement Benefits
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span>Retirement Eligibility:</span>
                          <Badge variant={calculations.retirement.eligible ? "default" : "destructive"}>
                            {calculations.retirement.eligible ? "Eligible" : "Not Eligible"}
                          </Badge>
                        </div>
                        
                        {calculations.retirement.eligible && (
                          <>
                            <Separator />
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>Monthly Pension</Label>
                                <div className="text-2xl font-bold text-blue-600">
                                  {formatCurrency(calculations.retirement.monthlyPension)}
                                </div>
                              </div>
                              <div>
                                <Label>Survivor Benefits</Label>
                                <div className="text-xl font-semibold">
                                  {formatCurrency(calculations.retirement.survivorBenefits)}
                                </div>
                              </div>
                            </div>
                            {calculations.retirement.lumpSum > 0 && (
                              <div className="bg-blue-50 p-4 rounded-lg">
                                <div className="flex justify-between items-center">
                                  <span className="font-medium">Lump Sum Option:</span>
                                  <span className="text-xl font-bold text-blue-600">
                                    {formatCurrency(calculations.retirement.lumpSum)}
                                  </span>
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="education" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <GraduationCap className="h-5 w-5 text-purple-600" />
                        Education Benefits (GI Bill)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span>GI Bill Eligibility:</span>
                          <Badge variant={calculations.education.giEligible ? "default" : "destructive"}>
                            {calculations.education.giEligible ? "Eligible" : "Not Eligible"}
                          </Badge>
                        </div>
                        
                        {calculations.education.giEligible && (
                          <>
                            <Separator />
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>Months Available</Label>
                                <div className="text-2xl font-bold text-purple-600">
                                  {calculations.education.months} months
                                </div>
                              </div>
                              <div>
                                <Label>Monthly Housing Allowance</Label>
                                <div className="text-xl font-semibold">
                                  {formatCurrency(calculations.education.housingAllowance)}
                                </div>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>Annual Book Stipend</Label>
                                <div className="text-lg font-semibold">
                                  {formatCurrency(calculations.education.bookStipend)}
                                </div>
                              </div>
                              <div>
                                <Label>Transferable to Family</Label>
                                <Badge variant={calculations.education.transferable ? "default" : "secondary"}>
                                  {calculations.education.transferable ? "Yes" : "No"}
                                </Badge>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="healthcare" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Heart className="h-5 w-5 text-red-600" />
                        Healthcare Benefits
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex justify-between items-center">
                            <span>VA Healthcare:</span>
                            <Badge variant={calculations.healthcare.vaHealthcare ? "default" : "destructive"}>
                              {calculations.healthcare.vaHealthcare ? "Eligible" : "Not Eligible"}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>TRICARE:</span>
                            <Badge variant={calculations.healthcare.tricare ? "default" : "destructive"}>
                              {calculations.healthcare.tricare ? "Eligible" : "Not Eligible"}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex justify-between items-center">
                            <span>Dental Coverage:</span>
                            <Badge variant={calculations.healthcare.dental ? "default" : "secondary"}>
                              {calculations.healthcare.dental ? "Covered" : "Not Covered"}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Vision Coverage:</span>
                            <Badge variant={calculations.healthcare.vision ? "default" : "secondary"}>
                              {calculations.healthcare.vision ? "Covered" : "Not Covered"}
                            </Badge>
                          </div>
                        </div>
                        
                        {calculations.healthcare.vaHealthcare && (
                          <div className="bg-red-50 p-4 rounded-lg">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">VA Priority Group:</span>
                              <span className="text-xl font-bold text-red-600">
                                Group {calculations.healthcare.priorityGroup}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600 mt-2">
                              Lower numbers indicate higher priority for care
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Calculator className="h-16 w-16 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Benefits Calculator Ready
                  </h3>
                  <p className="text-gray-600 text-center max-w-md">
                    Fill out your military service information on the left to calculate 
                    your eligibility for VA disability compensation, retirement benefits, 
                    education assistance, and healthcare coverage.
                  </p>
                </CardContent>
              </Card>
            )}

            {calculations && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    Important Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm text-gray-600">
                    <p>
                      • These calculations are estimates based on current benefit rates and your provided information.
                    </p>
                    <p>
                      • Actual benefit amounts may vary based on additional factors not captured in this calculator.
                    </p>
                    <p>
                      • For official benefit determinations, contact the VA or speak with a qualified benefits counselor.
                    </p>
                    <p>
                      • Benefit rates are updated regularly - calculations reflect 2024 rates.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}