import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Phone, 
  Mail, 
  MessageSquare, 
  Clock, 
  MapPin,
  AlertCircle,
  CheckCircle,
  Users,
  Shield,
  Video,
  Headphones
} from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import WhatsAppConnector from "@/components/whatsapp-connector";

export default function ContactSupport() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    branch: "",
    subject: "",
    priority: "",
    message: ""
  });

  const contactMethods = [
    {
      icon: Phone,
      title: "Emergency Hotline",
      description: "Immediate legal emergencies requiring urgent attention",
      contact: "1-800-MIL-LEGAL (1-800-645-5342)",
      availability: "24/7 Emergency Response",
      responseTime: "Immediate",
      color: "red",
      action: "Call Now",
      link: "/emergency-consultation"
    },
    {
      icon: MessageSquare,
      title: "Live Chat",
      description: "Real-time support for questions and guidance",
      contact: "Available through website",
      availability: "24/7 Available",
      responseTime: "< 2 minutes",
      color: "blue",
      action: "Start Chat",
      link: "/chat-support"
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Detailed questions and non-urgent matters",
      contact: "support@militarylegalshield.com",
      availability: "Business Hours",
      responseTime: "2-4 hours",
      color: "green",
      action: "Send Email",
      link: "mailto:support@militarylegalshield.com"
    },
    {
      icon: Video,
      title: "Video Consultation",
      description: "Face-to-face consultation with legal experts",
      contact: "Schedule through platform",
      availability: "By Appointment",
      responseTime: "Same day",
      color: "purple",
      action: "Schedule",
      link: "/video-consultation"
    }
  ];

  const supportTeam = [
    {
      name: "Legal Support Team",
      specialty: "General Legal Questions",
      hours: "24/7",
      languages: ["English", "Spanish"],
      contact: "support@militarylegalshield.com"
    },
    {
      name: "Emergency Response Team", 
      specialty: "Urgent Legal Matters",
      hours: "24/7",
      languages: ["English", "Spanish", "German"],
      contact: "1-800-MIL-LEGAL"
    },
    {
      name: "Technical Support",
      specialty: "Platform & Account Issues",
      hours: "Mon-Fri 6AM-10PM EST",
      languages: ["English"],
      contact: "tech@militarylegalshield.com"
    },
    {
      name: "Attorney Coordination",
      specialty: "Attorney Matching & Scheduling",
      hours: "Mon-Fri 8AM-8PM EST",
      languages: ["English", "Spanish"],
      contact: "attorneys@militarylegalshield.com"
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Support request submitted:", formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      {/* Hero Section */}
      <section className="bg-navy-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center">
                <Headphones className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-6">Contact Support</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Get immediate help from our experienced support team. We're here 24/7 to assist 
              with legal questions, platform issues, and emergency situations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/emergency-consultation">
                <Button size="lg" className="bg-red-600 hover:bg-red-700">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  Emergency Support
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-navy-900">
                <MessageSquare className="w-5 h-5 mr-2" />
                Live Chat
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-navy-900 mb-4">How to Reach Us</h2>
            <p className="text-xl text-gray-600">Multiple ways to get the support you need</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactMethods.map((method, index) => {
              const IconComponent = method.icon;
              return (
                <Card key={index} className={`border-l-4 border-l-${method.color}-500 hover:shadow-lg transition-shadow`}>
                  <CardHeader className="pb-3">
                    <div className="text-center">
                      <div className={`w-16 h-16 bg-${method.color}-100 rounded-full flex items-center justify-center mx-auto mb-3`}>
                        <IconComponent className={`w-8 h-8 text-${method.color}-600`} />
                      </div>
                      <CardTitle className="text-lg">{method.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm mb-4">{method.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Contact:</span>
                        <span className="font-medium">{method.contact}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Hours:</span>
                        <span className="font-medium">{method.availability}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Response:</span>
                        <Badge className={`bg-${method.color}-100 text-${method.color}-800 text-xs`}>
                          {method.responseTime}
                        </Badge>
                      </div>
                    </div>

                    <Link href={method.link}>
                      <Button className={`w-full bg-${method.color}-600 hover:bg-${method.color}-700`}>
                        {method.action}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* WhatsApp Support */}
      <section className="py-16 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-navy-900 mb-4">WhatsApp Support</h2>
            <p className="text-xl text-gray-600">Get instant help through secure WhatsApp messaging</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <WhatsAppConnector variant="emergency" />
            <WhatsAppConnector variant="support" />
            <WhatsAppConnector variant="consultation" />
          </div>

          <div className="text-center mt-8">
            <Link href="/whatsapp-support">
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                View All WhatsApp Options
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Support Request Form */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-navy-900 mb-4">Submit Support Request</h2>
            <p className="text-xl text-gray-600">Send us a detailed message and we'll get back to you quickly</p>
          </div>

          <Card className="shadow-lg">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <Input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Your full name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Military Branch
                    </label>
                    <select
                      value={formData.branch}
                      onChange={(e) => handleInputChange("branch", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select your branch</option>
                      <option value="army">Army</option>
                      <option value="navy">Navy</option>
                      <option value="air-force">Air Force</option>
                      <option value="marines">Marines</option>
                      <option value="coast-guard">Coast Guard</option>
                      <option value="space-force">Space Force</option>
                      <option value="veteran">Veteran</option>
                      <option value="family">Military Family</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority Level *
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) => handleInputChange("priority", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select priority</option>
                      <option value="emergency">Emergency - Immediate response needed</option>
                      <option value="urgent">Urgent - Response within 24 hours</option>
                      <option value="normal">Normal - Response within 48 hours</option>
                      <option value="low">Low - General inquiry</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <Input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => handleInputChange("subject", e.target.value)}
                    placeholder="Brief description of your issue"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <Textarea
                    value={formData.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                    placeholder="Please provide detailed information about your question or issue..."
                    rows={6}
                    required
                  />
                </div>

                <div className="flex gap-4">
                  <Button type="submit" size="lg" className="bg-blue-600 hover:bg-blue-700">
                    <Mail className="w-5 h-5 mr-2" />
                    Send Support Request
                  </Button>
                  <Link href="/emergency-consultation">
                    <Button type="button" size="lg" variant="destructive">
                      <AlertCircle className="w-5 h-5 mr-2" />
                      This is Emergency
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Support Team */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-navy-900 mb-4">Our Support Teams</h2>
            <p className="text-xl text-gray-600">Specialized teams ready to help with specific needs</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {supportTeam.map((team, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-navy-900 mb-1">{team.name}</h3>
                      <p className="text-gray-600 text-sm mb-3">{team.specialty}</p>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-700">{team.hours}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-700">{team.contact}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MessageSquare className="w-4 h-4 text-gray-500" />
                          <div className="flex gap-1">
                            {team.languages.map((lang, langIndex) => (
                              <Badge key={langIndex} variant="secondary" className="text-xs">
                                {lang}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Quick Links */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-navy-900 mb-4">Common Questions</h2>
            <p className="text-xl text-gray-600">Quick answers to frequently asked questions</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { q: "How do I find a military attorney?", link: "/lawyer-database" },
              { q: "What documents do I need for deployment?", link: "/legal-documents" },
              { q: "How do I file a VA disability claim?", link: "/va-benefits-claims" },
              { q: "What are my rights under the UCMJ?", link: "/ucmj-support" },
              { q: "How do I create a Power of Attorney?", link: "/family-law-poas" },
              { q: "What is court-martial defense?", link: "/court-martial-defense" }
            ].map((item, index) => (
              <Link key={index} href={item.link}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-navy-900 font-medium text-sm">{item.q}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/help-center">
              <Button size="lg" variant="outline">
                View All FAQs
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="py-16 bg-red-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <AlertCircle className="w-16 h-16" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Emergency Legal Support</h2>
          <p className="text-xl mb-8">
            For urgent legal matters that cannot wait, our emergency team is standing by 24/7 
            with experienced military attorneys ready to provide immediate assistance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/emergency-consultation">
              <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100">
                <Phone className="w-5 h-5 mr-2" />
                Call Emergency Hotline
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-red-600">
              <MessageSquare className="w-5 h-5 mr-2" />
              Emergency Live Chat
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}