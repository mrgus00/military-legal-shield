import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Calculator, CheckCircle, XCircle, AlertCircle, DollarSign, Clock, FileText } from "lucide-react";
import { useBranch } from "@/contexts/BranchContext";
import RankPayGradeSelector from "@/components/rank-pay-grade-selector";
import { 
  ServiceRecord, 
  BenefitsCalculationResult, 
  calculateBenefitsEligibility 
} from "@/lib/benefitsCalculator";

const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
  'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
  'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
  'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
  'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
  'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
  'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
];

export default function BenefitsEligibilityCalculator() {
  const { branchTheme, getTerminology } = useBranch();
  const [serviceRecord, setServiceRecord] = useState<ServiceRecord>({
    branch: branchTheme.id,
    rank: { payGrade: 'E-5', rank: 'Sergeant', abbreviation: 'SGT' },
    yearsOfService: 4,
    serviceStatus: 'veteran',
    dischargeType: 'honorable',
    serviceConnectedDisability: 0,
    combatVeteran: false,
    deployments: 0,
    dependents: 0,
    state: 'Texas'
  });

  const [calculationResult, setCalculationResult] = useState<BenefitsCalculationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleRankSelect = (rank: {payGrade: string; rank: string; abbreviation: string}) => {
    setServiceRecord(prev => ({ ...prev, rank }));
  };

  const calculateBenefits = async () => {
    setIsCalculating(true);
    
    // Simulate calculation time for real-time feel
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const result = calculateBenefitsEligibility(serviceRecord);
    setCalculationResult(result);
    setIsCalculating(false);
  };

  // Auto-calculate when service record changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      calculateBenefits();
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [serviceRecord]);

  const getBenefitIcon = (eligible: boolean, eligibilityPercentage: number) => {
    if (eligible && eligibilityPercentage === 100) {
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    } else if (eligible && eligibilityPercentage > 0) {
      return <AlertCircle className="w-5 h-5 text-yellow-600" />;
    } else {
      return <XCircle className="w-5 h-5 text-red-600" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-navy-900 mb-2">
          Real-Time Benefits Eligibility Calculator
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Get instant eligibility assessment for veterans benefits based on your {branchTheme.name} service record.
          All calculations use current VA rates and authentic military data.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Service Record Input */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Service Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Rank Selection */}
              <RankPayGradeSelector
                onRankSelect={handleRankSelect}
                selectedRank={serviceRecord.rank}
                required={false}
              />

              {/* Years of Service */}
              <div className="space-y-2">
                <Label htmlFor="years-service">Years of Service</Label>
                <Input
                  id="years-service"
                  type="number"
                  min="0"
                  max="50"
                  step="0.5"
                  value={serviceRecord.yearsOfService}
                  onChange={(e) => setServiceRecord(prev => ({ 
                    ...prev, 
                    yearsOfService: parseFloat(e.target.value) || 0 
                  }))}
                  placeholder="Enter total years of service"
                />
              </div>

              {/* Service Status */}
              <div className="space-y-2">
                <Label htmlFor="service-status">Current Status</Label>
                <Select 
                  value={serviceRecord.serviceStatus} 
                  onValueChange={(value: ServiceRecord['serviceStatus']) => 
                    setServiceRecord(prev => ({ ...prev, serviceStatus: value }))
                  }
                >
                  <SelectTrigger id="service-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active Duty</SelectItem>
                    <SelectItem value="veteran">Veteran</SelectItem>
                    <SelectItem value="retired">Retired</SelectItem>
                    <SelectItem value="guard">National Guard</SelectItem>
                    <SelectItem value="reserve">Reserve</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Discharge Type */}
              {serviceRecord.serviceStatus !== 'active' && (
                <div className="space-y-2">
                  <Label htmlFor="discharge-type">Discharge Type</Label>
                  <Select 
                    value={serviceRecord.dischargeType || ''} 
                    onValueChange={(value) => 
                      setServiceRecord(prev => ({ ...prev, dischargeType: value as ServiceRecord['dischargeType'] }))
                    }
                  >
                    <SelectTrigger id="discharge-type">
                      <SelectValue placeholder="Select discharge type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="honorable">Honorable</SelectItem>
                      <SelectItem value="general">General (Under Honorable Conditions)</SelectItem>
                      <SelectItem value="other-than-honorable">Other Than Honorable</SelectItem>
                      <SelectItem value="bad-conduct">Bad Conduct</SelectItem>
                      <SelectItem value="dishonorable">Dishonorable</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Disability Rating */}
              <div className="space-y-2">
                <Label htmlFor="disability-rating">Service-Connected Disability Rating (%)</Label>
                <Select 
                  value={serviceRecord.serviceConnectedDisability?.toString() || '0'} 
                  onValueChange={(value) => 
                    setServiceRecord(prev => ({ 
                      ...prev, 
                      serviceConnectedDisability: parseInt(value) 
                    }))
                  }
                >
                  <SelectTrigger id="disability-rating">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0% - No Rating</SelectItem>
                    <SelectItem value="10">10%</SelectItem>
                    <SelectItem value="20">20%</SelectItem>
                    <SelectItem value="30">30%</SelectItem>
                    <SelectItem value="40">40%</SelectItem>
                    <SelectItem value="50">50%</SelectItem>
                    <SelectItem value="60">60%</SelectItem>
                    <SelectItem value="70">70%</SelectItem>
                    <SelectItem value="80">80%</SelectItem>
                    <SelectItem value="90">90%</SelectItem>
                    <SelectItem value="100">100%</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Combat Veteran */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="combat-veteran"
                  checked={serviceRecord.combatVeteran}
                  onCheckedChange={(checked) => 
                    setServiceRecord(prev => ({ ...prev, combatVeteran: checked as boolean }))
                  }
                />
                <Label htmlFor="combat-veteran">Combat Veteran</Label>
              </div>

              {/* Deployments */}
              <div className="space-y-2">
                <Label htmlFor="deployments">Number of Deployments</Label>
                <Input
                  id="deployments"
                  type="number"
                  min="0"
                  max="20"
                  value={serviceRecord.deployments}
                  onChange={(e) => setServiceRecord(prev => ({ 
                    ...prev, 
                    deployments: parseInt(e.target.value) || 0 
                  }))}
                />
              </div>

              {/* Dependents */}
              <div className="space-y-2">
                <Label htmlFor="dependents">Number of Dependents</Label>
                <Input
                  id="dependents"
                  type="number"
                  min="0"
                  max="10"
                  value={serviceRecord.dependents}
                  onChange={(e) => setServiceRecord(prev => ({ 
                    ...prev, 
                    dependents: parseInt(e.target.value) || 0 
                  }))}
                />
              </div>

              {/* State */}
              <div className="space-y-2">
                <Label htmlFor="state">State of Residence</Label>
                <Select 
                  value={serviceRecord.state} 
                  onValueChange={(value) => setServiceRecord(prev => ({ ...prev, state: value }))}
                >
                  <SelectTrigger id="state">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {US_STATES.map(state => (
                      <SelectItem key={state} value={state}>{state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {/* Overall Results */}
          {calculationResult && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calculator className="w-5 h-5" />
                  <span>Eligibility Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {calculationResult.overall.totalEligibleBenefits}
                      </div>
                      <div className="text-sm text-gray-600">Eligible Benefits</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {calculationResult.overall.eligibilityScore}%
                      </div>
                      <div className="text-sm text-gray-600">Eligibility Score</div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-lg font-semibold text-navy-900">
                      {calculationResult.overall.totalPotentialValue}
                    </div>
                    <div className="text-sm text-gray-600">Estimated Lifetime Value</div>
                  </div>

                  <Progress 
                    value={calculationResult.overall.eligibilityScore} 
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Loading State */}
          {isCalculating && (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy-600 mx-auto"></div>
                  <p className="text-gray-600">Calculating benefits eligibility...</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Individual Benefits */}
          {calculationResult && (
            <Card>
              <CardHeader>
                <CardTitle>Individual Benefits Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {calculationResult.benefits.map((benefit, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {getBenefitIcon(benefit.eligible, benefit.eligibilityPercentage)}
                          <h3 className="font-semibold text-base">{benefit.benefitType}</h3>
                        </div>
                        <Badge 
                          variant={benefit.eligible ? "default" : "secondary"}
                          className={benefit.eligible ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                        >
                          {benefit.eligible ? 'Eligible' : 'Not Eligible'}
                        </Badge>
                      </div>

                      {benefit.eligible && benefit.estimatedValue && (
                        <div className="flex items-center space-x-2 mb-2">
                          <DollarSign className="w-4 h-4 text-green-600" />
                          <span className="font-medium text-green-600">
                            {benefit.estimatedValue}
                          </span>
                        </div>
                      )}

                      {benefit.eligibilityPercentage > 0 && benefit.eligibilityPercentage < 100 && (
                        <div className="mb-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>Eligibility</span>
                            <span>{benefit.eligibilityPercentage}%</span>
                          </div>
                          <Progress value={benefit.eligibilityPercentage} className="h-2" />
                        </div>
                      )}

                      {benefit.missingRequirements.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm font-medium text-red-600 mb-1">Missing Requirements:</p>
                          <ul className="text-sm text-red-600 list-disc list-inside">
                            {benefit.missingRequirements.map((req, i) => (
                              <li key={i}>{req}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="mt-2">
                        <p className="text-xs text-gray-600">
                          {benefit.notes[0]}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recommendations */}
          {calculationResult && calculationResult.recommendations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {calculationResult.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">{rec}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}