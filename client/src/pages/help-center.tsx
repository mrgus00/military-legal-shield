import Header from "@/components/header";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MessageCircle, Book, Phone, Mail, Clock } from "lucide-react";
import { useState } from "react";

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState("");

  const faqCategories = [
    {
      title: "Getting Started",
      icon: Book,
      questions: [
        {
          question: "How do I find an attorney for my military legal issue?",
          answer: "Use our Attorney Directory to search by location, specialty, and availability. Filter by emergency support if you need immediate assistance."
        },
        {
          question: "What types of legal issues does the platform cover?",
          answer: "We cover UCMJ violations, court-martial defense, administrative separations, security clearance issues, and other military-specific legal matters."
        },
        {
          question: "Is this platform free to use?",
          answer: "Basic resources and attorney matching are free. Premium features include priority support, detailed case tracking, and advanced educational modules."
        }
      ]
    },
    {
      title: "Attorney Services",
      icon: MessageCircle,
      questions: [
        {
          question: "How are attorneys verified on the platform?",
          answer: "All attorneys undergo thorough verification including bar certification, military law experience validation, and background checks."
        },
        {
          question: "Can I communicate securely with attorneys?",
          answer: "Yes, our platform uses end-to-end encryption for all attorney-client communications to maintain attorney-client privilege."
        },
        {
          question: "What if I need emergency legal assistance?",
          answer: "Use our Urgent Match feature for 24/7 emergency legal support. Emergency-certified attorneys are available for immediate consultation."
        }
      ]
    },
    {
      title: "Educational Resources",
      icon: Book,
      questions: [
        {
          question: "How do the learning modules work?",
          answer: "Interactive modules cover military law topics with quizzes, scenarios, and progress tracking. Complete modules to earn certificates."
        },
        {
          question: "What are micro-challenges?",
          answer: "Quick 2-minute legal knowledge challenges that help reinforce learning and test understanding of military law concepts."
        },
        {
          question: "How can I track my learning progress?",
          answer: "Your dashboard shows completed modules, scores, time spent learning, and personalized recommendations for next steps."
        }
      ]
    }
  ];

  const contactOptions = [
    {
      title: "Live Chat",
      description: "Chat with our support team",
      icon: MessageCircle,
      availability: "24/7 for emergencies",
      action: "Start Chat"
    },
    {
      title: "Email Support",
      description: "Get detailed help via email",
      icon: Mail,
      availability: "Response within 24 hours",
      action: "Send Email"
    },
    {
      title: "Phone Support",
      description: "Speak directly with support",
      icon: Phone,
      availability: "Mon-Fri 8AM-6PM EST",
      action: "Call Now"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Help Center
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Find answers to your questions and get the support you need
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search for help topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 text-lg"
              />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {contactOptions.map((option, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-military-blue-100 rounded-full flex items-center justify-center mb-4">
                    <option.icon className="h-6 w-6 text-military-blue-600" />
                  </div>
                  <CardTitle className="text-lg">{option.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-2">{option.description}</p>
                  <p className="text-sm text-gray-500 mb-4 flex items-center justify-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {option.availability}
                  </p>
                  <Button className="w-full">{option.action}</Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* FAQ Sections */}
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
              Frequently Asked Questions
            </h2>
            
            {faqCategories.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <div className="flex items-center mb-6">
                  <div className="w-8 h-8 bg-military-blue-100 rounded-full flex items-center justify-center mr-3">
                    <category.icon className="h-5 w-5 text-military-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{category.title}</h3>
                </div>
                
                <div className="grid gap-4 mb-8">
                  {category.questions.map((faq, faqIndex) => (
                    <Card key={faqIndex}>
                      <CardHeader>
                        <CardTitle className="text-lg text-gray-900">{faq.question}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600">{faq.answer}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Emergency Contact */}
          <Card className="bg-red-50 border-red-200 mt-12">
            <CardHeader>
              <CardTitle className="text-red-800 flex items-center">
                <Phone className="h-5 w-5 mr-2" />
                Emergency Legal Assistance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-700 mb-4">
                If you're facing immediate legal action or need urgent assistance:
              </p>
              <div className="space-y-2">
                <p className="font-semibold text-red-800">24/7 Emergency Hotline: 1-800-MIL-HELP</p>
                <p className="text-red-700">Emergency attorneys available for immediate consultation</p>
                <Button variant="destructive" className="mt-4">
                  Get Emergency Help Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}