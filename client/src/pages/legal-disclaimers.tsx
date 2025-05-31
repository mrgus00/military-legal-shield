import Header from "@/components/header";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Scale, Shield, FileText } from "lucide-react";

export default function LegalDisclaimers() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Legal Disclaimers
            </h1>
            <p className="text-lg text-gray-600">
              Important legal information about using our platform
            </p>
          </div>

          <div className="space-y-8">
            <Card className="border-yellow-200 bg-yellow-50">
              <CardHeader>
                <CardTitle className="flex items-center text-yellow-800">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Important Notice
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-yellow-700 font-medium">
                  This platform provides legal information only. Nothing on this site constitutes legal advice. 
                  Always consult with qualified legal counsel for your specific situation.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Scale className="h-5 w-5 mr-2" />
                  No Attorney-Client Relationship
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  Use of this website does not create an attorney-client relationship between you and MilLegal Defense 
                  or any of the attorneys listed on our platform. An attorney-client relationship is formed only when:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>You directly retain an individual attorney through proper legal channels</li>
                  <li>A written retainer agreement is signed by both parties</li>
                  <li>The attorney formally agrees to represent you in your legal matter</li>
                </ul>
                <p className="text-gray-700">
                  Until such a relationship is established, communications through this platform are not protected 
                  by attorney-client privilege, except for direct communications with attorneys you have retained.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Information Accuracy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  While we strive to provide accurate and current legal information, we cannot guarantee that 
                  all content is complete, accurate, or up-to-date. Legal information includes:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Educational materials and resources</li>
                  <li>Legal scenarios and case studies</li>
                  <li>UCMJ and military regulation summaries</li>
                  <li>General legal process information</li>
                </ul>
                <p className="text-gray-700">
                  Laws and regulations change frequently. Always verify current legal requirements with official 
                  military legal sources or qualified attorneys.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Military-Specific Disclaimers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Chain of Command</h4>
                  <p className="text-gray-700">
                    Using this platform does not replace or supersede military chain of command requirements. 
                    Service members remain obligated to follow all applicable military regulations and reporting procedures.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Security Clearances</h4>
                  <p className="text-gray-700">
                    Legal issues may impact security clearances. Service members with clearances should consider 
                    potential security implications and consult with appropriate security personnel when necessary.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Court-Martial Proceedings</h4>
                  <p className="text-gray-700">
                    Information about court-martial procedures is general in nature. Specific procedural requirements 
                    may vary by jurisdiction and case type. Always consult with qualified military defense counsel.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Third-Party Services</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  Our platform may include links to third-party websites, services, or resources. We do not 
                  endorse or assume responsibility for:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Content accuracy on external websites</li>
                  <li>Third-party attorney services or conduct</li>
                  <li>External legal resources or publications</li>
                  <li>Government websites or official military resources</li>
                </ul>
                <p className="text-gray-700">
                  Users access third-party services at their own risk and should review applicable terms and conditions.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Limitation of Liability</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  MilLegal Defense, its employees, contractors, and affiliates shall not be liable for:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Decisions made based on information from this platform</li>
                  <li>Outcomes of legal proceedings or attorney representation</li>
                  <li>Delays in communication or technical issues</li>
                  <li>Actions taken by third-party attorneys or services</li>
                  <li>Any indirect, consequential, or punitive damages</li>
                </ul>
                <p className="text-gray-700">
                  Our maximum liability is limited to the amount paid for platform services, if any.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Emergency Situations</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  This platform is not intended for emergency legal situations requiring immediate action. 
                  For urgent matters:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Contact military legal assistance offices directly</li>
                  <li>Reach out to the Staff Judge Advocate (SJA) office</li>
                  <li>Use command emergency contact procedures</li>
                  <li>Call our 24/7 emergency line: 1-800-MIL-HELP</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Governing Law</h3>
                <p className="text-gray-700 mb-4">
                  These disclaimers and all use of this platform are governed by federal law and the laws 
                  of the District of Columbia, without regard to conflict of law principles.
                </p>

                <h3 className="text-lg font-semibold text-gray-900 mb-4">Updates to Disclaimers</h3>
                <p className="text-gray-700 mb-4">
                  We may update these disclaimers as needed to reflect changes in law or platform services. 
                  Check this page regularly for updates.
                </p>

                <h3 className="text-lg font-semibold text-gray-900 mb-4">Questions</h3>
                <p className="text-gray-700">
                  For questions about these disclaimers, contact our legal team at legal@millegaldefense.com.
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