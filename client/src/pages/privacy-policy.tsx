import Header from "@/components/header";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Lock, Eye, Users } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Privacy Policy
            </h1>
            <p className="text-lg text-gray-600">
              Last updated: January 2024
            </p>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Our Commitment to Privacy
                </CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p className="text-gray-700">
                  MilLegal Defense is committed to protecting the privacy and confidentiality of our military service members. 
                  We understand the sensitive nature of legal matters and maintain the highest standards of data protection 
                  consistent with attorney-client privilege and military security requirements.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Eye className="h-5 w-5 mr-2" />
                  Information We Collect
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Personal Information</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Name, rank, and military branch</li>
                    <li>Contact information (email, phone, mailing address)</li>
                    <li>Service number and security clearance level (when relevant)</li>
                    <li>Location and duty station information</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Legal Information</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Case details and legal issues</li>
                    <li>Communications with attorneys</li>
                    <li>Document uploads and legal filings</li>
                    <li>Court dates and legal proceedings</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Usage Information</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Platform usage and navigation patterns</li>
                    <li>Educational module progress</li>
                    <li>Search queries and resource access</li>
                    <li>Device and browser information</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lock className="h-5 w-5 mr-2" />
                  How We Protect Your Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Security Measures</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>End-to-end encryption for all attorney-client communications</li>
                    <li>Military-grade security protocols and data centers</li>
                    <li>Regular security audits and penetration testing</li>
                    <li>Multi-factor authentication for all accounts</li>
                    <li>Secure data transmission using TLS 1.3</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Attorney-Client Privilege</h4>
                  <p className="text-gray-700">
                    All communications between service members and attorneys through our platform are protected by 
                    attorney-client privilege. We maintain strict confidentiality and do not access, monitor, or 
                    disclose these communications except as required by law or court order.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Data Storage</h4>
                  <p className="text-gray-700">
                    Personal and legal data is stored in secure, encrypted databases located in CONUS facilities. 
                    We maintain data redundancy and backup systems to ensure information availability while 
                    protecting against unauthorized access.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Information Sharing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">We DO NOT Share Information With:</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Military command or chain of command</li>
                    <li>Third-party marketing companies</li>
                    <li>Social media platforms</li>
                    <li>Non-essential service providers</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Limited Sharing Circumstances:</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>With your chosen attorney for legal representation</li>
                    <li>When required by valid court order or subpoena</li>
                    <li>To prevent imminent harm or danger</li>
                    <li>With your explicit written consent</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="prose max-w-none">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Rights</h3>
                <p className="text-gray-700 mb-4">
                  You have the right to access, update, or delete your personal information at any time. 
                  You may also request a copy of all data we have collected about you or withdraw consent 
                  for data processing where applicable.
                </p>

                <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Retention</h3>
                <p className="text-gray-700 mb-4">
                  We retain personal information only as long as necessary for legal representation, 
                  service provision, or as required by military regulations and legal requirements. 
                  Legal case files are retained for a minimum of 7 years after case closure.
                </p>

                <h3 className="text-lg font-semibold text-gray-900 mb-4">Changes to This Policy</h3>
                <p className="text-gray-700 mb-4">
                  We may update this privacy policy to reflect changes in our practices or legal requirements. 
                  Users will be notified of material changes via email and platform notifications.
                </p>

                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Us</h3>
                <p className="text-gray-700">
                  For questions about this privacy policy or your data rights, contact our Privacy Officer at 
                  privacy@millegaldefense.com or call 1-800-PRIVACY.
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