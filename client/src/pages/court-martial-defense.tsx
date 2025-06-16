import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Scale, 
  Clock, 
  Phone, 
  AlertTriangle,
  CheckCircle,
  Users,
  FileText,
  Gavel
} from "lucide-react";
import { Link } from "wouter";

export default function CourtMartialDefense() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      {/* Hero Section */}
      <section className="bg-navy-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center">
                <Gavel className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-6">Court-Martial Defense</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Expert military defense attorneys specializing in court-martial proceedings. 
              Protecting your rights, rank, and future with aggressive legal representation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/emergency-consultation">
                <Button size="lg" className="bg-red-600 hover:bg-red-700">
                  Emergency Defense - 24/7
                </Button>
              </Link>
              <Link href="/lawyer-database">
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-navy-900">
                  Find Defense Attorney
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Types of Court-Martial */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-navy-900 mb-4">Types of Court-Martial</h2>
            <p className="text-xl text-gray-600">Understanding the different levels of military justice proceedings</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-l-4 border-l-yellow-500">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Shield className="w-8 h-8 text-yellow-600" />
                  <div>
                    <CardTitle className="text-xl">Summary Court-Martial</CardTitle>
                    <Badge variant="outline" className="mt-1">Minor Offenses</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li>• Enlisted personnel only</li>
                  <li>• Maximum 30 days confinement</li>
                  <li>• Reduction in rank</li>
                  <li>• Forfeiture of pay</li>
                  <li>• No felony convictions</li>
                </ul>
                <div className="mt-4">
                  <Link href="/consultation-booking">
                    <Button className="w-full bg-yellow-600 hover:bg-yellow-700">
                      Get Defense Help
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-500">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Scale className="w-8 h-8 text-orange-600" />
                  <div>
                    <CardTitle className="text-xl">Special Court-Martial</CardTitle>
                    <Badge variant="outline" className="mt-1">Moderate Offenses</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li>• All service members</li>
                  <li>• Maximum 1 year confinement</li>
                  <li>• Bad conduct discharge</li>
                  <li>• Significant rank reduction</li>
                  <li>• Misdemeanor convictions</li>
                </ul>
                <div className="mt-4">
                  <Link href="/consultation-booking">
                    <Button className="w-full bg-orange-600 hover:bg-orange-700">
                      Get Defense Help
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-red-500">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                  <div>
                    <CardTitle className="text-xl">General Court-Martial</CardTitle>
                    <Badge variant="destructive" className="mt-1">Serious Felonies</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li>• All service members</li>
                  <li>• Life imprisonment possible</li>
                  <li>• Dishonorable discharge</li>
                  <li>• Death penalty (rare cases)</li>
                  <li>• Felony convictions</li>
                </ul>
                <div className="mt-4">
                  <Link href="/emergency-consultation">
                    <Button className="w-full bg-red-600 hover:bg-red-700">
                      Emergency Defense
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Defense Process */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-navy-900 mb-4">Your Defense Process</h2>
            <p className="text-xl text-gray-600">Step-by-step guide to court-martial defense</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="text-2xl font-bold text-blue-600">1</div>
              </div>
              <h3 className="text-lg font-semibold text-navy-900 mb-2">Initial Consultation</h3>
              <p className="text-gray-600">Free case evaluation and strategic planning with experienced military defense attorney</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="text-2xl font-bold text-orange-600">2</div>
              </div>
              <h3 className="text-lg font-semibold text-navy-900 mb-2">Case Investigation</h3>
              <p className="text-gray-600">Thorough investigation of charges, evidence review, and witness interviews</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="text-2xl font-bold text-green-600">3</div>
              </div>
              <h3 className="text-lg font-semibold text-navy-900 mb-2">Defense Strategy</h3>
              <p className="text-gray-600">Development of comprehensive defense strategy tailored to your specific case</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="text-2xl font-bold text-purple-600">4</div>
              </div>
              <h3 className="text-lg font-semibold text-navy-900 mb-2">Trial Representation</h3>
              <p className="text-gray-600">Aggressive courtroom representation and advocacy for the best possible outcome</p>
            </div>
          </div>
        </div>
      </section>

      {/* Common Charges */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-navy-900 mb-4">Common Court-Martial Charges</h2>
            <p className="text-xl text-gray-600">Defense experience across all UCMJ violations</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              "Article 86 - Absence Without Leave (AWOL)",
              "Article 92 - Failure to Obey Orders",
              "Article 134 - General Article Violations",
              "Article 120 - Sexual Assault",
              "Article 121 - Larceny and Wrongful Appropriation",
              "Article 112a - Drug Offenses",
              "Article 88 - Contempt Toward Officials",
              "Article 90 - Assaulting Superior Officer",
              "Article 128 - Assault and Battery"
            ].map((charge, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-gray-900">{charge}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/lawyer-database">
              <Button size="lg" className="bg-navy-900 hover:bg-navy-800">
                Find Specialized Defense Attorney
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Emergency Help */}
      <section className="py-16 bg-red-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <Clock className="w-16 h-16" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Facing Court-Martial Charges?</h2>
          <p className="text-xl mb-8">
            Time is critical. Get immediate legal representation from experienced military defense attorneys.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/emergency-consultation">
              <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100">
                <Phone className="w-5 h-5 mr-2" />
                Emergency Defense - Call Now
              </Button>
            </Link>
            <Link href="/consultation-booking">
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-red-600">
                Schedule Consultation
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}