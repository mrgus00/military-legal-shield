import { useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import BenefitsEligibilityCalculator from "@/components/benefits-eligibility-calculator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calculator, Shield, DollarSign, FileText, Clock, Users } from "lucide-react";
import { useBranch } from "@/contexts/BranchContext";

export default function BenefitsCalculator() {
  const { branchTheme, getTerminology } = useBranch();

  const features = [
    {
      icon: <Calculator className="w-6 h-6" />,
      title: "Real-Time Calculations",
      description: "Instant eligibility assessment using current VA rates and regulations"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Authentic Military Data",
      description: `Branch-specific calculations for ${branchTheme.name} ${getTerminology('personnel').toLowerCase()}`
    },
    {
      icon: <DollarSign className="w-6 h-6" />,
      title: "Accurate Benefit Values",
      description: "Current 2024 compensation rates and benefit amounts"
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Comprehensive Assessment",
      description: "Covers all major VA benefits and state-specific programs"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Instant Results",
      description: "Get immediate feedback as you update your service information"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Family Benefits",
      description: "Includes dependent and survivor benefit calculations"
    }
  ];

  const benefitTypes = [
    "VA Disability Compensation",
    "Post-9/11 GI Bill Education Benefits",
    "VA Home Loan Guarantee",
    "VA Healthcare Priority Groups",
    "Vocational Rehabilitation & Employment",
    "Veterans' Group Life Insurance",
    "State Veterans Benefits",
    "Dependency & Indemnity Compensation"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-50 to-white">
      <Header />
      
      <main className="pt-20 pb-16">
        {/* Hero Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <Calculator className="w-12 h-12" style={{ color: `hsl(${branchTheme.colors.primary})` }} />
              <h1 className="text-4xl md:text-5xl font-bold text-navy-900">
                Benefits Calculator
              </h1>
            </div>
            
            <p className="text-xl text-gray-700 mb-8 max-w-4xl mx-auto leading-relaxed">
              Calculate your eligibility for veterans benefits in real-time. Get accurate assessments 
              based on your {branchTheme.name} service record, current VA regulations, and authentic military data.
            </p>

            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <Badge 
                variant="outline" 
                className="px-4 py-2"
                style={{ 
                  borderColor: `hsl(${branchTheme.colors.primary})`,
                  color: `hsl(${branchTheme.colors.primary})`
                }}
              >
                {branchTheme.name} Optimized
              </Badge>
              <Badge variant="outline" className="px-4 py-2 border-green-500 text-green-700">
                2024 VA Rates
              </Badge>
              <Badge variant="outline" className="px-4 py-2 border-blue-500 text-blue-700">
                Real-Time Results
              </Badge>
              <Badge variant="outline" className="px-4 py-2 border-purple-500 text-purple-700">
                All 50 States
              </Badge>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white/50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-navy-900">
              Calculator Features
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div 
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: `hsl(${branchTheme.colors.primary} / 0.1)` }}
                      >
                        <div style={{ color: `hsl(${branchTheme.colors.primary})` }}>
                          {feature.icon}
                        </div>
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Covered */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8 text-navy-900">
              Benefits Covered
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              {benefitTypes.map((benefit, index) => (
                <div 
                  key={index}
                  className="flex items-center space-x-3 p-4 rounded-lg border"
                  style={{ borderColor: `hsl(${branchTheme.colors.primary} / 0.2)` }}
                >
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: `hsl(${branchTheme.colors.primary})` }}
                  ></div>
                  <span className="font-medium text-gray-800">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Calculator Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <BenefitsEligibilityCalculator />
        </section>

        {/* Important Notice */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <Card className="border-yellow-200 bg-yellow-50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-yellow-800">
                  <Shield className="w-5 h-5" />
                  <span>Important Notice</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-yellow-800">
                <div className="space-y-3 text-sm">
                  <p>
                    <strong>This calculator provides estimates based on current regulations and your provided information.</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Results are for informational purposes and not a guarantee of benefits</li>
                    <li>Individual circumstances may affect actual eligibility</li>
                    <li>Contact the VA or a qualified representative for official determinations</li>
                    <li>Benefit amounts and eligibility requirements may change</li>
                  </ul>
                  <p>
                    All calculations use authentic VA data and current 2024 compensation rates. 
                    Branch-specific requirements are applied based on your selected service.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}