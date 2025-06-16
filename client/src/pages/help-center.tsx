import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  HelpCircle, 
  MessageSquare, 
  Phone, 
  Mail,
  BookOpen,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Shield,
  FileText,
  Video
} from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState("");

  const faqCategories = [
    {
      title: "Getting Started",
      icon: BookOpen,
      color: "blue",
      faqs: [
        { q: "How do I create an account?", a: "Visit our sign-up page and follow the simple registration process." },
        { q: "What services do you offer?", a: "We provide comprehensive military legal support including court-martial defense, family law, and legal document generation." },
        { q: "Is there a free trial?", a: "Yes, we offer a free tier with access to basic legal resources and document templates." },
        { q: "How do I upgrade to premium?", a: "Visit the pricing page and select the plan that best fits your needs." }
      ]
    },
    {
      title: "Legal Services",
      icon: Shield,
      color: "green",
      faqs: [
        { q: "How do I find a military attorney?", a: "Use our attorney database to search by location, specialty, and military branch experience." },
        { q: "What is emergency legal consultation?", a: "24/7 access to experienced military attorneys for urgent legal matters." },
        { q: "How much do legal services cost?", a: "Costs vary by attorney and case complexity. Many offer free initial consultations." },
        { q: "Can you help with court-martial defense?", a: "Yes, we connect you with experienced court-martial defense attorneys nationwide." }
      ]
    },
    {
      title: "Documents & Forms",
      icon: FileText,
      color: "orange",
      faqs: [
        { q: "How do I generate a Power of Attorney?", a: "Use our document generator to create customized POA documents for your specific needs." },
        { q: "Are the documents legally valid?", a: "Yes, all documents are reviewed by attorneys and comply with state and military requirements." },
        { q: "Can I edit documents after creation?", a: "Premium users can edit and regenerate documents with updated information." },
        { q: "What deployment documents do I need?", a: "Essential documents include POA, family care plan, will, and emergency contact forms." }
      ]
    },
    {
      title: "Account & Billing",
      icon: Users,
      color: "purple",
      faqs: [
        { q: "How do I change my subscription?", a: "Visit your account settings to upgrade, downgrade, or cancel your subscription." },
        { q: "What payment methods do you accept?", a: "We accept all major credit cards and military payment systems." },
        { q: "Is there a military discount?", a: "Yes, active duty and veterans receive special pricing on all premium services." },
        { q: "How do I cancel my account?", a: "Contact support or use the account cancellation option in your settings." }
      ]
    }
  ];

  const supportOptions = [
    {
      icon: MessageSquare,
      title: "Live Chat",
      description: "Get instant help from our support team",
      availability: "24/7 Available",
      action: "Start Chat",
      link: "/chat-support"
    },
    {
      icon: Phone,
      title: "Emergency Hotline",
      description: "Urgent legal matters requiring immediate attention",
      availability: "24/7 Emergency",
      action: "Call Now",
      link: "/emergency-consultation"
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Detailed questions and non-urgent matters",
      availability: "Response in 2-4 hours",
      action: "Send Email",
      link: "mailto:support@militarylegalshield.com"
    },
    {
      icon: Video,
      title: "Video Consultation",
      description: "Face-to-face legal consultation with attorneys",
      availability: "By Appointment",
      action: "Schedule",
      link: "/video-consultation"
    }
  ];

  const quickActions = [
    { title: "Find an Attorney", desc: "Browse our database of military lawyers", link: "/lawyer-database", icon: Users },
    { title: "Create Documents", desc: "Generate legal documents instantly", link: "/document-generator", icon: FileText },
    { title: "Emergency Help", desc: "24/7 urgent legal assistance", link: "/emergency-consultation", icon: AlertCircle },
    { title: "Check Benefits", desc: "Calculate your VA benefits", link: "/benefits-eligibility", icon: CheckCircle },
    { title: "Legal Resources", desc: "Access legal guides and articles", link: "/legal-resources", icon: BookOpen },
    { title: "Community Forum", desc: "Connect with other service members", link: "/community-forum", icon: MessageSquare }
  ];

  const filteredFAQs = faqCategories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq => 
      !searchQuery || 
      faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.faqs.length > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      {/* Hero Section */}
      <section className="bg-navy-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
              <HelpCircle className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-6">Help Center</h1>
          <p className="text-xl text-gray-300 mb-8">
            Find answers to your questions and get the support you need for all legal matters.
          </p>
          
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search for help articles, FAQs, or legal topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 text-lg bg-white text-gray-900"
            />
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-navy-900 mb-4">Quick Actions</h2>
            <p className="text-xl text-gray-600">Common tasks and frequently used features</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActions.map((action, index) => {
              const IconComponent = action.icon;
              return (
                <Link key={index} href={action.link}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <IconComponent className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-navy-900 mb-1">{action.title}</h3>
                          <p className="text-sm text-gray-600">{action.desc}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Support Options */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-navy-900 mb-4">Get Support</h2>
            <p className="text-xl text-gray-600">Multiple ways to get the help you need</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {supportOptions.map((option, index) => {
              const IconComponent = option.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <IconComponent className="w-8 h-8 text-blue-600" />
                    </div>
                    <CardTitle className="text-lg">{option.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm mb-3">{option.description}</p>
                    <Badge variant="outline" className="mb-4">{option.availability}</Badge>
                    <Link href={option.link}>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        {option.action}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-navy-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Find quick answers to common questions</p>
          </div>

          {filteredFAQs.length === 0 ? (
            <div className="text-center py-12">
              <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-600">Try a different search term or browse our categories below.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {filteredFAQs.map((category, categoryIndex) => {
                const IconComponent = category.icon;
                return (
                  <div key={categoryIndex}>
                    <div className="flex items-center gap-3 mb-6">
                      <div className={`w-10 h-10 bg-${category.color}-100 rounded-full flex items-center justify-center`}>
                        <IconComponent className={`w-5 h-5 text-${category.color}-600`} />
                      </div>
                      <h3 className="text-2xl font-bold text-navy-900">{category.title}</h3>
                    </div>
                    
                    <div className="grid gap-4">
                      {category.faqs.map((faq, faqIndex) => (
                        <Card key={faqIndex} className="hover:shadow-lg transition-shadow">
                          <CardContent className="p-6">
                            <h4 className="font-semibold text-navy-900 mb-2">{faq.q}</h4>
                            <p className="text-gray-600">{faq.a}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="py-16 bg-red-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <AlertCircle className="w-16 h-16" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Need Immediate Legal Help?</h2>
          <p className="text-xl mb-8">
            For urgent legal matters that cannot wait, our emergency hotline is available 24/7 
            with experienced military attorneys ready to assist.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/emergency-consultation">
              <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100">
                <Phone className="w-5 h-5 mr-2" />
                Emergency Hotline
              </Button>
            </Link>
            <Link href="/chat-support">
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-red-600">
                <MessageSquare className="w-5 h-5 mr-2" />
                Live Chat Support
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-navy-900 text-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Contact Information</h2>
            <p className="text-xl text-gray-300">Multiple ways to reach our support team</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <Mail className="w-12 h-12 mx-auto mb-4 text-blue-400" />
              <h3 className="text-lg font-semibold mb-2">Email Support</h3>
              <p className="text-gray-300 mb-2">support@militarylegalshield.com</p>
              <p className="text-sm text-gray-400">Response within 2-4 hours</p>
            </div>

            <div className="text-center">
              <Phone className="w-12 h-12 mx-auto mb-4 text-green-400" />
              <h3 className="text-lg font-semibold mb-2">Emergency Hotline</h3>
              <p className="text-gray-300 mb-2">1-800-MIL-LEGAL</p>
              <p className="text-sm text-gray-400">24/7 Emergency Support</p>
            </div>

            <div className="text-center">
              <Clock className="w-12 h-12 mx-auto mb-4 text-orange-400" />
              <h3 className="text-lg font-semibold mb-2">Business Hours</h3>
              <p className="text-gray-300 mb-2">Mon-Fri: 6AM-10PM EST</p>
              <p className="text-sm text-gray-400">Extended hours for military time zones</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}