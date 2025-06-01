import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Calculator, 
  Star, 
  DollarSign, 
  Calendar, 
  TrendingUp,
  CheckCircle,
  Shield
} from "lucide-react";

interface RetirementCalculationStep {
  id: number;
  title: string;
  description: string;
  value: string;
  progress: number;
  icon: React.ElementType;
  color: string;
}

interface RetirementAnimationProps {
  rank: string;
  yearsOfService: number;
  basePay: number;
  finalPension: number;
  isCalculating: boolean;
}

export default function RetirementCalculatorAnimation({
  rank,
  yearsOfService,
  basePay,
  finalPension,
  isCalculating
}: RetirementAnimationProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const retirementPercentage = Math.min(yearsOfService * 2.5, 75);

  const calculationSteps: RetirementCalculationStep[] = [
    {
      id: 1,
      title: "Military Service Record",
      description: `Verified service as ${rank}`,
      value: `${yearsOfService} years`,
      progress: 25,
      icon: Star,
      color: "military-gold"
    },
    {
      id: 2,
      title: "Base Pay Calculation",
      description: "Current military pay scale",
      value: `$${basePay.toLocaleString()}/month`,
      progress: 50,
      icon: DollarSign,
      color: "navy"
    },
    {
      id: 3,
      title: "Retirement Percentage",
      description: "2.5% per year of service",
      value: `${retirementPercentage}%`,
      progress: 75,
      icon: Calculator,
      color: "sage"
    },
    {
      id: 4,
      title: "Monthly Retirement Pay",
      description: "Calculated pension benefit",
      value: `$${finalPension.toLocaleString()}/month`,
      progress: 100,
      icon: CheckCircle,
      color: "military-gold"
    }
  ];

  useEffect(() => {
    if (isCalculating) {
      setCurrentStep(0);
      setAnimationProgress(0);
      setShowResult(false);
      
      const animationTimer = setInterval(() => {
        setAnimationProgress(prev => {
          if (prev >= 100) {
            clearInterval(animationTimer);
            setShowResult(true);
            return 100;
          }
          return prev + 2;
        });
      }, 50);

      const stepTimer = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= calculationSteps.length - 1) {
            clearInterval(stepTimer);
            return prev;
          }
          return prev + 1;
        });
      }, 1200);

      return () => {
        clearInterval(animationTimer);
        clearInterval(stepTimer);
      };
    }
  }, [isCalculating, calculationSteps.length]);

  if (!isCalculating && !showResult) {
    return null;
  }

  return (
    <Card className="bg-gradient-to-br from-navy-50 via-white to-military-gold-50 border-navy-200 overflow-hidden">
      <CardHeader className="text-center pb-4">
        <div className="flex justify-center mb-4">
          <div className="relative">
            <div className="p-4 bg-gradient-to-r from-military-gold-100 to-navy-100 rounded-full">
              <Calculator className="h-8 w-8 text-navy-600" />
            </div>
            {isCalculating && (
              <div className="absolute inset-0 rounded-full border-4 border-military-gold-200 animate-spin border-t-military-gold-500"></div>
            )}
          </div>
        </div>
        <CardTitle className="text-xl text-navy-700">
          Military Retirement Calculation
        </CardTitle>
        <p className="text-navy-600">Processing your service record and benefits</p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-navy-600">Calculation Progress</span>
            <span className="text-navy-700 font-semibold">{Math.round(animationProgress)}%</span>
          </div>
          <Progress 
            value={animationProgress} 
            className="h-3 bg-gray-200"
          />
        </div>

        {/* Calculation Steps */}
        <div className="space-y-4">
          {calculationSteps.map((step, index) => {
            const isActive = index <= currentStep;
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;

            return (
              <div 
                key={step.id}
                className={`flex items-center space-x-4 p-4 rounded-lg border-2 transition-all duration-500 ${
                  isActive 
                    ? `border-${step.color}-200 bg-${step.color}-50 shadow-md transform scale-105` 
                    : 'border-gray-200 bg-gray-50 opacity-50'
                }`}
              >
                <div className={`p-3 rounded-full transition-all duration-300 ${
                  isActive 
                    ? `bg-${step.color}-100 ${isCurrent ? 'animate-pulse' : ''}` 
                    : 'bg-gray-200'
                }`}>
                  <step.icon className={`h-6 w-6 ${
                    isActive ? `text-${step.color}-600` : 'text-gray-400'
                  }`} />
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className={`font-semibold ${
                      isActive ? 'text-navy-700' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </h4>
                    {isCompleted && (
                      <CheckCircle className="h-5 w-5 text-sage-500 animate-bounce" />
                    )}
                  </div>
                  <p className={`text-sm ${
                    isActive ? 'text-navy-600' : 'text-gray-400'
                  }`}>
                    {step.description}
                  </p>
                  {isActive && (
                    <Badge 
                      className={`mt-2 bg-${step.color}-100 text-${step.color}-700 animate-fade-in`}
                    >
                      {step.value}
                    </Badge>
                  )}
                </div>

                <div className="flex-shrink-0">
                  <Progress 
                    value={isActive ? step.progress : 0} 
                    className="w-16 h-2"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Final Result */}
        {showResult && (
          <Card className="bg-gradient-to-r from-military-gold-100 to-navy-100 border-military-gold-300 animate-fade-in">
            <CardContent className="p-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-white rounded-full shadow-lg">
                  <Shield className="h-8 w-8 text-military-gold-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-navy-700 mb-2">
                Calculation Complete!
              </h3>
              <p className="text-navy-600 mb-4">
                Based on {yearsOfService} years as {rank}
              </p>
              
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-white rounded-lg">
                  <Calendar className="h-6 w-6 text-navy-500 mx-auto mb-1" />
                  <p className="text-sm text-navy-600">Service Years</p>
                  <p className="font-bold text-navy-700">{yearsOfService}</p>
                </div>
                
                <div className="p-3 bg-white rounded-lg">
                  <TrendingUp className="h-6 w-6 text-sage-500 mx-auto mb-1" />
                  <p className="text-sm text-navy-600">Percentage</p>
                  <p className="font-bold text-sage-700">{retirementPercentage}%</p>
                </div>
                
                <div className="p-3 bg-white rounded-lg border-2 border-military-gold-200">
                  <DollarSign className="h-6 w-6 text-military-gold-500 mx-auto mb-1" />
                  <p className="text-sm text-navy-600">Monthly Pension</p>
                  <p className="font-bold text-military-gold-700 text-lg">
                    ${finalPension.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="mt-4 p-3 bg-sage-50 rounded-lg">
                <p className="text-sm text-sage-700">
                  <strong>Annual Benefit:</strong> ${(finalPension * 12).toLocaleString()}
                </p>
                <p className="text-xs text-sage-600 mt-1">
                  This calculation is based on 2024 military pay scales and standard retirement formula
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}