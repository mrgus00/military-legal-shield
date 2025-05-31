import Header from "@/components/header";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Scale, FileText, AlertTriangle, Users } from "lucide-react";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Terms of Service
            </h1>
            <p className="text-lg text-gray-600">
              Last updated: January 2024
            </p>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Scale className="h-5 w-5 mr-2" />
                  Agreement to Terms
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  By accessing and using MilLegal Defense platform, you agree to be bound by these Terms of Service 
                  and all applicable laws and regulations. If you do not agree with any of these terms, you are 
                  prohibited from using this platform.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Platform Services
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Legal Resource Platform</h4>
                  <p className="text-gray-700">
                    MilLegal Defense provides a platform connecting military personnel with qualified attorneys 
                    and legal resources. We facilitate communication and provide educational materials but do not 
                    provide legal advice directly.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Attorney Network</h4>
                  <p className="text-gray-700">
                    Our platform connects you with independent attorneys who are solely responsible for their 
                    legal advice and representation. MilLegal Defense does not practice law and is not responsible 
                    for attorney conduct or case outcomes.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Educational Resources</h4>
                  <p className="text-gray-700">
                    Educational modules, scenarios, and resources are provided for informational purposes only. 
                    They do not constitute legal advice and should not be used as a substitute for consultation 
                    with qualified legal counsel.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  User Responsibilities
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Account Security</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Maintain confidentiality of your account credentials</li>
                    <li>Notify us immediately of any unauthorized access</li>
                    <li>Use strong passwords and enable two-factor authentication</li>
                    <li>Do not share your account with others</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Prohibited Uses</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Violating any applicable laws or military regulations</li>
                    <li>Sharing false or misleading information</li>
                    <li>Attempting to access other users' accounts or data</li>
                    <li>Using the platform for commercial solicitation</li>
                    <li>Uploading malicious software or harmful content</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Content Standards</h4>
                  <p className="text-gray-700">
                    All user-generated content must be appropriate, lawful, and respectful. Content that is 
                    discriminatory, harassing, or violates military standards of conduct will be removed and 
                    may result in account suspension.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Important Disclaimers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">No Attorney-Client Relationship</h4>
                  <p className="text-gray-700">
                    Use of this platform does not create an attorney-client relationship between you and 
                    MilLegal Defense. Attorney-client relationships are established only with individual 
                    attorneys you choose to retain through the platform.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">No Guarantee of Outcomes</h4>
                  <p className="text-gray-700">
                    We cannot guarantee legal outcomes, attorney availability, or case resolution times. 
                    Legal proceedings are inherently uncertain and depend on many factors beyond our control.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Military Regulations</h4>
                  <p className="text-gray-700">
                    Users remain subject to all applicable military regulations and chain of command requirements. 
                    This platform does not supersede military legal procedures or reporting requirements.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="prose max-w-none">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Limitation of Liability</h3>
                <p className="text-gray-700 mb-4">
                  MilLegal Defense and its affiliates shall not be liable for any indirect, incidental, 
                  special, consequential, or punitive damages resulting from your use of the platform. 
                  Our total liability is limited to the amount you paid for platform services.
                </p>

                <h3 className="text-lg font-semibold text-gray-900 mb-4">Intellectual Property</h3>
                <p className="text-gray-700 mb-4">
                  All platform content, including educational materials, software, and design elements, 
                  is protected by copyright and trademark laws. Users may not reproduce, distribute, 
                  or create derivative works without written permission.
                </p>

                <h3 className="text-lg font-semibold text-gray-900 mb-4">Termination</h3>
                <p className="text-gray-700 mb-4">
                  We reserve the right to terminate or suspend accounts that violate these terms or 
                  engage in prohibited conduct. Users may close their accounts at any time with 
                  30 days written notice.
                </p>

                <h3 className="text-lg font-semibold text-gray-900 mb-4">Governing Law</h3>
                <p className="text-gray-700 mb-4">
                  These terms are governed by federal law and the laws of the District of Columbia. 
                  Any disputes will be resolved through binding arbitration in Washington, DC.
                </p>

                <h3 className="text-lg font-semibold text-gray-900 mb-4">Changes to Terms</h3>
                <p className="text-gray-700 mb-4">
                  We may update these terms periodically. Users will be notified of material changes 
                  via email and platform notifications. Continued use after changes constitutes acceptance.
                </p>

                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                <p className="text-gray-700">
                  For questions about these terms, contact our legal team at legal@millegaldefense.com 
                  or call 1-800-LEGAL-HELP.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}