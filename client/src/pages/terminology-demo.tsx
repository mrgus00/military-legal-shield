import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen,
  Scale,
  Shield,
  Users,
  Info,
  AlertTriangle
} from "lucide-react";
import MilitaryTooltip from "@/components/military-tooltip";

export default function TerminologyDemo() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-500 p-3 rounded-full">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Military Terminology Help System
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Interactive tooltips provide instant explanations of military legal terms, 
            helping service members understand complex terminology throughout the platform.
          </p>
        </div>

        {/* Demo Content Cards */}
        <div className="space-y-6">
          {/* Legal Scenario Example */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5 text-red-600" />
                Legal Scenario Example
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                If you receive an <MilitaryTooltip term="Article 15">Article 15</MilitaryTooltip> for 
                violating a direct order under the <MilitaryTooltip term="UCMJ">UCMJ</MilitaryTooltip>, 
                you have the right to consult with a <MilitaryTooltip term="TDS">TDS</MilitaryTooltip> attorney 
                before accepting the punishment. Understanding your rights during <MilitaryTooltip term="NJP">NJP</MilitaryTooltip> proceedings 
                is crucial for making informed decisions about your military career.
              </p>
              
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-amber-800 mb-1">Important Note</h4>
                    <p className="text-amber-700 text-sm">
                      If you're facing potential <MilitaryTooltip term="Court-Martial">court-martial</MilitaryTooltip> proceedings, 
                      immediately contact a <MilitaryTooltip term="JAG">JAG</MilitaryTooltip> officer for legal representation.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Administrative Example */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                Security Clearance Guidance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                Maintaining your <MilitaryTooltip term="Security Clearance">security clearance</MilitaryTooltip> requires 
                ongoing compliance with security protocols. If you're suspected of going <MilitaryTooltip term="AWOL">AWOL</MilitaryTooltip>, 
                this could impact your clearance status and future military assignments.
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Do's</h4>
                  <ul className="text-blue-800 text-sm space-y-1">
                    <li>• Report changes in personal circumstances</li>
                    <li>• Maintain financial responsibility</li>
                    <li>• Follow all <MilitaryTooltip term="Command">command</MilitaryTooltip> directives</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="font-medium text-red-900 mb-2">Don'ts</h4>
                  <ul className="text-red-800 text-sm space-y-1">
                    <li>• Engage in foreign contacts without reporting</li>
                    <li>• Accumulate excessive debt</li>
                    <li>• Violate any articles of the <MilitaryTooltip term="UCMJ">UCMJ</MilitaryTooltip></li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Benefits Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-600" />
                Military Benefits Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                All active duty service members are automatically enrolled in <MilitaryTooltip term="SGLI">SGLI</MilitaryTooltip> 
                life insurance coverage. It's important to keep your beneficiaries updated and understand 
                how military legal issues might affect your benefits eligibility.
              </p>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-900 mb-2">Key Benefits to Know</h4>
                <div className="grid md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="font-medium">Life Insurance:</span> <MilitaryTooltip term="SGLI">SGLI</MilitaryTooltip> coverage up to $400,000
                  </div>
                  <div>
                    <span className="font-medium">Legal Support:</span> Access to <MilitaryTooltip term="JAG">JAG</MilitaryTooltip> services
                  </div>
                  <div>
                    <span className="font-medium">Career Protection:</span> <MilitaryTooltip term="TDS">TDS</MilitaryTooltip> representation
                  </div>
                  <div>
                    <span className="font-medium">Leadership:</span> Clear <MilitaryTooltip term="Command">command</MilitaryTooltip> structure
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tooltip Variants Demo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-purple-600" />
                Tooltip Display Options
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Inline Tooltips</h4>
                <p className="text-gray-700">
                  Hover over terms like <MilitaryTooltip term="UCMJ">UCMJ</MilitaryTooltip> to see detailed 
                  explanations with examples and related terms.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Icon Tooltips</h4>
                <p className="text-gray-700 flex items-center gap-2">
                  Complex terms may have dedicated help icons 
                  <MilitaryTooltip term="Court-Martial" variant="icon" /> 
                  for quick reference.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Button Tooltips</h4>
                <div className="flex items-center gap-2">
                  <span className="text-gray-700">Need help with Article 15 procedures?</span>
                  <MilitaryTooltip term="Article 15" variant="button" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Categories Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Term Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="text-center p-4 border border-red-200 rounded-lg bg-red-50">
                  <Scale className="h-8 w-8 text-red-600 mx-auto mb-2" />
                  <h4 className="font-medium text-red-900">Legal</h4>
                  <p className="text-red-700 text-sm">UCMJ, Court-Martial, Article 15</p>
                </div>
                
                <div className="text-center p-4 border border-blue-200 rounded-lg bg-blue-50">
                  <Shield className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h4 className="font-medium text-blue-900">Administrative</h4>
                  <p className="text-blue-700 text-sm">Security Clearance, SGLI</p>
                </div>
                
                <div className="text-center p-4 border border-green-200 rounded-lg bg-green-50">
                  <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <h4 className="font-medium text-green-900">Operational</h4>
                  <p className="text-green-700 text-sm">Command, AWOL, Chain of Command</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Implementation Note */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Info className="h-6 w-6 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900 mb-2">How It Works</h4>
                  <p className="text-blue-800 leading-relaxed">
                    The tooltip system automatically recognizes military terminology throughout the platform 
                    and provides contextual help. Each tooltip includes definitions, examples, related terms, 
                    and official references to help service members make informed decisions.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}