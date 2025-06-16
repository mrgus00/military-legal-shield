import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Scale, 
  BookOpen, 
  Shield, 
  AlertTriangle, 
  FileText,
  Users,
  Clock,
  CheckCircle,
  Search,
  Gavel
} from "lucide-react";
import { Link } from "wouter";

export default function UCMJSupport() {
  const ucmjArticles = [
    { article: "86", title: "Absence Without Leave", severity: "moderate", description: "Unauthorized absence from duty" },
    { article: "92", title: "Failure to Obey Order", severity: "serious", description: "Disobedience of lawful orders" },
    { article: "120", title: "Sexual Assault", severity: "severe", description: "Sexual offenses under military law" },
    { article: "121", title: "Larceny and Wrongful Appropriation", severity: "moderate", description: "Theft and property crimes" },
    { article: "134", title: "General Article", severity: "variable", description: "Disorders and neglects to the prejudice of good order" },
    { article: "112a", title: "Wrongful Use of Controlled Substances", severity: "serious", description: "Drug-related offenses" },
    { article: "128", title: "Assault", severity: "serious", description: "Physical assault and battery" },
    { article: "90", title: "Assaulting Superior Officer", severity: "severe", description: "Violence against superior officers" },
    { article: "88", title: "Contempt Toward Officials", severity: "moderate", description: "Disrespect toward officials" }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "severe": return "bg-red-100 text-red-800";
      case "serious": return "bg-orange-100 text-orange-800";
      case "moderate": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      {/* Hero Section */}
      <section className="bg-navy-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
                <Scale className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-6">UCMJ Support & Defense</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Comprehensive legal support for Uniform Code of Military Justice violations. 
              Expert defense attorneys who understand military law and your rights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/emergency-consultation">
                <Button size="lg" className="bg-red-600 hover:bg-red-700">
                  Emergency UCMJ Defense
                </Button>
              </Link>
              <Link href="/lawyer-database">
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-navy-900">
                  Find UCMJ Attorney
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* UCMJ Overview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-navy-900 mb-4">Understanding the UCMJ</h2>
            <p className="text-xl text-gray-600">Your rights and protections under military law</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <BookOpen className="w-12 h-12 text-blue-600 mx-auto mb-2" />
                <CardTitle className="text-lg">Military Code</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Federal law governing all branches of the U.S. military</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Shield className="w-12 h-12 text-green-600 mx-auto mb-2" />
                <CardTitle className="text-lg">Your Rights</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Constitutional protections and military-specific rights</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Gavel className="w-12 h-12 text-orange-600 mx-auto mb-2" />
                <CardTitle className="text-lg">Due Process</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Fair trial procedures and legal representation rights</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="w-12 h-12 text-purple-600 mx-auto mb-2" />
                <CardTitle className="text-lg">Defense Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Expert legal counsel and defense strategies</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Common UCMJ Articles */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-navy-900 mb-4">Common UCMJ Articles</h2>
            <p className="text-xl text-gray-600">Frequently charged violations and their implications</p>
          </div>

          <div className="grid gap-4">
            {ucmjArticles.map((item, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-navy-100 rounded-full flex items-center justify-center">
                        <span className="font-bold text-navy-900">{item.article}</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-navy-900">Article {item.article}: {item.title}</h3>
                        <p className="text-gray-600">{item.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={getSeverityColor(item.severity)}>
                        {item.severity}
                      </Badge>
                      <Link href={`/consultation-booking?ucmj=${item.article}`}>
                        <Button variant="outline" size="sm">
                          Get Defense Help
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/lawyer-database">
              <Button size="lg" className="bg-navy-900 hover:bg-navy-800">
                Find UCMJ Specialist Attorney
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Defense Process */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-navy-900 mb-4">UCMJ Defense Process</h2>
            <p className="text-xl text-gray-600">How we protect your rights and career</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-navy-900 mb-3">Case Analysis</h3>
              <p className="text-gray-600">Thorough review of charges, evidence, and circumstances surrounding your case</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-navy-900 mb-3">Rights Protection</h3>
              <p className="text-gray-600">Ensuring all constitutional and military rights are protected throughout proceedings</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-navy-900 mb-3">Defense Strategy</h3>
              <p className="text-gray-600">Custom defense strategy tailored to your specific charges and circumstances</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-navy-900 mb-3">Expert Representation</h3>
              <p className="text-gray-600">Experienced military law attorneys with proven track records in UCMJ cases</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-navy-900 mb-3">Timely Action</h3>
              <p className="text-gray-600">Immediate response to preserve evidence and protect your rights from day one</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-navy-900 mb-3">Best Outcome</h3>
              <p className="text-gray-600">Fighting for dismissal, reduced charges, or minimal impact on your military career</p>
            </div>
          </div>
        </div>
      </section>

      {/* Your Rights */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Know Your Rights Under the UCMJ</h2>
            <p className="text-xl text-gray-200">Essential rights every service member should understand</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Right to Remain Silent", desc: "Article 31 protects against self-incrimination" },
              { title: "Right to Legal Counsel", desc: "Military or civilian attorney representation" },
              { title: "Right to Trial by Jury", desc: "Trial by military members or military judge alone" },
              { title: "Right to Cross-Examine", desc: "Question witnesses against you" },
              { title: "Right to Present Evidence", desc: "Call witnesses and present your defense" },
              { title: "Right to Appeal", desc: "Appeal convictions to higher military courts" },
              { title: "Protection from Double Jeopardy", desc: "Cannot be tried twice for the same offense" },
              { title: "Right to Speedy Trial", desc: "Timely resolution of charges" },
              { title: "Right to Open Trial", desc: "Public proceedings unless classified matters involved" }
            ].map((right, index) => (
              <Card key={index} className="bg-white/10 border-white/20 text-white">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">{right.title}</h4>
                  <p className="text-gray-200 text-sm">{right.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Help */}
      <section className="py-16 bg-red-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <AlertTriangle className="w-16 h-16" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Facing UCMJ Charges?</h2>
          <p className="text-xl mb-8">
            Don't face military justice alone. Get immediate legal representation from experienced UCMJ defense attorneys.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/emergency-consultation">
              <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100">
                Emergency UCMJ Defense
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