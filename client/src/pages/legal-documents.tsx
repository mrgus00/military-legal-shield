import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Download, 
  Shield, 
  Home, 
  Users,
  Heart,
  Scale,
  Clock,
  CheckCircle,
  Star,
  Lock,
  Edit
} from "lucide-react";
import { Link } from "wouter";

export default function LegalDocuments() {
  const documentCategories = [
    {
      icon: Shield,
      title: "Power of Attorney",
      count: "5 documents",
      description: "Essential POA documents for deployment and family protection",
      color: "blue",
      documents: [
        { name: "General Power of Attorney", type: "Template", premium: false },
        { name: "Special Power of Attorney", type: "Template", premium: false },
        { name: "Medical Power of Attorney", type: "Template", premium: true },
        { name: "Financial Power of Attorney", type: "Template", premium: true },
        { name: "Military Specific POA", type: "Generated", premium: true }
      ]
    },
    {
      icon: Home,
      title: "Family Documents",
      count: "8 documents",
      description: "Family care plans, custody agreements, and protection orders",
      color: "green",
      documents: [
        { name: "Family Care Plan", type: "Template", premium: false },
        { name: "Child Custody Agreement", type: "Generated", premium: true },
        { name: "Visitation Schedule", type: "Template", premium: false },
        { name: "Emergency Contact Authorization", type: "Template", premium: false },
        { name: "Temporary Guardianship", type: "Generated", premium: true },
        { name: "Domestic Relations Order", type: "Generated", premium: true },
        { name: "Adoption Papers", type: "Generated", premium: true },
        { name: "Prenuptial Agreement", type: "Generated", premium: true }
      ]
    },
    {
      icon: Scale,
      title: "Military Legal",
      count: "6 documents",
      description: "Court-martial defense, appeals, and military-specific legal forms",
      color: "red",
      documents: [
        { name: "Article 32 Response", type: "Generated", premium: true },
        { name: "Rebuttal Statement", type: "Template", premium: false },
        { name: "Character References", type: "Template", premium: false },
        { name: "Appeal Filing", type: "Generated", premium: true },
        { name: "Administrative Separation Response", type: "Generated", premium: true },
        { name: "Security Clearance Appeal", type: "Generated", premium: true }
      ]
    },
    {
      icon: Heart,
      title: "Estate Planning",
      count: "7 documents",
      description: "Wills, trusts, and end-of-life planning documents",
      color: "purple",
      documents: [
        { name: "Military Will", type: "Generated", premium: true },
        { name: "Living Will", type: "Template", premium: false },
        { name: "Healthcare Directive", type: "Template", premium: false },
        { name: "Military Trust", type: "Generated", premium: true },
        { name: "Beneficiary Designation", type: "Template", premium: false },
        { name: "SGLI Documentation", type: "Template", premium: false },
        { name: "Final Instructions", type: "Template", premium: false }
      ]
    }
  ];

  const popularDocuments = [
    { name: "General Power of Attorney", downloads: "12,450", rating: 4.9, premium: false },
    { name: "Family Care Plan", downloads: "8,320", rating: 4.8, premium: false },
    { name: "Military Will", downloads: "6,780", rating: 4.9, premium: true },
    { name: "Child Custody Agreement", downloads: "5,240", rating: 4.7, premium: true },
    { name: "Deployment Checklist", downloads: "4,890", rating: 4.8, premium: false },
    { name: "Emergency Contact Form", downloads: "4,320", rating: 4.6, premium: false }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      {/* Hero Section */}
      <section className="bg-navy-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-orange-600 rounded-full flex items-center justify-center">
                <FileText className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-6">Legal Documents & Templates</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Comprehensive library of military-specific legal documents, templates, and AI-generated forms 
              to protect you and your family.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/document-generator">
                <Button size="lg" className="bg-orange-600 hover:bg-orange-700">
                  <Edit className="w-5 h-5 mr-2" />
                  Generate Custom Document
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-navy-900">
                <Download className="w-5 h-5 mr-2" />
                Browse Templates
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Document Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-navy-900 mb-4">Document Categories</h2>
            <p className="text-xl text-gray-600">Organized legal documents for every military family need</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {documentCategories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <Card key={index} className={`border-l-4 border-l-${category.color}-500 hover:shadow-lg transition-shadow`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 bg-${category.color}-100 rounded-full flex items-center justify-center`}>
                        <IconComponent className={`w-6 h-6 text-${category.color}-600`} />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{category.title}</CardTitle>
                        <Badge variant="outline" className="mt-1">{category.count}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm mb-4">{category.description}</p>
                    <div className="space-y-2 mb-4">
                      {category.documents.slice(0, 3).map((doc, docIndex) => (
                        <div key={docIndex} className="flex items-center justify-between text-xs">
                          <span className="text-gray-700">{doc.name}</span>
                          <div className="flex items-center gap-1">
                            {doc.premium && <Lock className="w-3 h-3 text-orange-600" />}
                            <Badge variant="secondary" className="text-xs">
                              {doc.type}
                            </Badge>
                          </div>
                        </div>
                      ))}
                      {category.documents.length > 3 && (
                        <p className="text-xs text-gray-500">+{category.documents.length - 3} more documents</p>
                      )}
                    </div>
                    <Button size="sm" className={`w-full bg-${category.color}-600 hover:bg-${category.color}-700`}>
                      View All Documents
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Popular Documents */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-navy-900 mb-4">Most Popular Documents</h2>
            <p className="text-xl text-gray-600">Frequently downloaded templates and forms</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularDocuments.map((doc, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-navy-900 mb-1">{doc.name}</h3>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(doc.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                              }`}
                            />
                          ))}
                          <span className="ml-1 text-sm text-gray-600">{doc.rating}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{doc.downloads} downloads</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {doc.premium && (
                        <Badge className="bg-orange-100 text-orange-800">Premium</Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {doc.premium ? (
                      <Link href="/pricing">
                        <Button size="sm" className="flex-1 bg-orange-600 hover:bg-orange-700">
                          <Lock className="w-4 h-4 mr-1" />
                          Upgrade to Access
                        </Button>
                      </Link>
                    ) : (
                      <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
                        <Download className="w-4 h-4 mr-1" />
                        Download Free
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      Preview
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Document Generation */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-navy-900 mb-4">AI-Powered Document Generation</h2>
            <p className="text-xl text-gray-600">Create custom legal documents tailored to your specific situation</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Edit className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-navy-900 mb-3">Smart Forms</h3>
              <p className="text-gray-600">Answer simple questions and our AI generates legally compliant documents</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-navy-900 mb-3">Military Compliant</h3>
              <p className="text-gray-600">All documents meet military regulations and legal requirements</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-navy-900 mb-3">Instant Results</h3>
              <p className="text-gray-600">Generate and download professional documents in minutes</p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/document-generator">
              <Button size="lg" className="bg-navy-900 hover:bg-navy-800">
                <Edit className="w-5 h-5 mr-2" />
                Start Document Generation
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-navy-900 mb-4">Why Choose Our Legal Documents?</h2>
            <p className="text-xl text-gray-600">Professional, reliable, and military-focused legal solutions</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: "Military Focused", desc: "Designed specifically for military families and situations" },
              { icon: Scale, title: "Legally Reviewed", desc: "All documents reviewed by experienced military attorneys" },
              { icon: Download, title: "Instant Access", desc: "Download immediately or generate custom versions" },
              { icon: Users, title: "Expert Support", desc: "Legal assistance available for complex situations" }
            ].map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-navy-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600 text-sm">{feature.desc}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Get Started */}
      <section className="py-16 bg-orange-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <FileText className="w-16 h-16" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Get Your Legal Documents Today</h2>
          <p className="text-xl mb-8">
            Protect your family and secure your future with professionally crafted legal documents 
            designed specifically for military life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/document-generator">
              <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100">
                <Edit className="w-5 h-5 mr-2" />
                Generate Custom Document
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-orange-600">
                View Premium Templates
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}