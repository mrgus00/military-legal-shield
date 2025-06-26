import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Link } from "wouter";
import { Shield, Users, Clock, Star, Mail, CheckCircle, ArrowRight, Phone, Video, MessageSquare, AlertTriangle, Scale, FileText, Heart, Globe, BookOpen, Gavel, MapPin, Search, HelpCircle, Languages, Award, Lock, DollarSign, Grid3X3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PageLayout from "@/components/page-layout";
import { apiRequest } from "@/lib/queryClient";
import { useBranch } from "@/contexts/BranchContext";
import MilitaryBranchesBanner from "@/components/military-branches-banner";
import InteractiveHeroSection from "@/components/interactive-hero-section";
import WorldClock from "@/components/world-clock";
import FAQAccordion from "@/components/faq-accordion";
import MobileSEOHead, { SEO_CONFIGS } from "@/components/mobile-seo-head";
import { useSEO, seoConfigs } from "@/hooks/useSEO";
import { getMobileEmergencyContacts, createClickablePhone, createClickableEmail } from "@/lib/mobile-contact";
import MilitaryTooltip, { MILITARY_TOOLTIPS } from "@/components/military-tooltip";
import courtImage from "@assets/court_1749846710218.png";

export default function Home() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { getTerminology, branchTheme, getMotto } = useBranch();

  // SEO optimization for home page
  useSEO({
    ...seoConfigs.home,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "LegalService",
      "name": "Military Legal Shield",
      "description": "Comprehensive legal support platform for military personnel across all branches",
      "url": "https://militarylegalshield.com",
      "serviceArea": {
        "@type": "Country",
        "name": "United States"
      },
      "areaServed": ["Army", "Navy", "Air Force", "Marines", "Coast Guard", "Space Force"],
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "bestRating": "5",
        "ratingCount": "127"
      }
    }
  });
  
  // Get mobile-optimized emergency contacts
  const emergencyContacts = getMobileEmergencyContacts();
  const primaryContact = createClickablePhone("+1-800-555-0123", "Call Now: (800) 555-0123");
  const emergencyEmail = createClickableEmail("emergency@militarylegalshield.com", "Emergency Legal Assistance", "I need immediate legal assistance. Please contact me as soon as possible.");

  const handleLeadCapture = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address to get started.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // In a real implementation, this would capture the lead
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      toast({
        title: "Welcome to Mil-Legal!",
        description: "Check your email for access instructions and resources.",
      });
      
      setEmail("");
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageLayout>
      <MobileSEOHead {...SEO_CONFIGS.home} />
        {/* Hero Section */}
        <section className="relative pt-16 sm:pt-20 pb-12 sm:pb-16 px-3 sm:px-4 lg:px-6 overflow-hidden w-full max-w-full mobile-section no-scroll-x" aria-labelledby="hero-heading">
          {/* Justice Background Image */}
          <div className="absolute inset-0 -z-20">
            <img 
              src={courtImage} 
              alt="Supreme Court Building" 
              className="w-full h-full object-cover opacity-15"
              style={{ filter: 'blur(0.5px)' }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/85 via-slate-800/80 to-navy-900/85"></div>
          </div>

          {/* Interactive Hero Background */}
          <InteractiveHeroSection />
          
          {/* Animated background elements */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-20 left-10 w-32 h-32 bg-blue-100 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute top-40 right-20 w-24 h-24 bg-green-100 rounded-full opacity-30 animate-bounce" style={{ animationDelay: '1s' }}></div>
            <div className="absolute bottom-32 left-20 w-28 h-28 bg-yellow-100 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
            <div className="absolute bottom-20 right-10 w-20 h-20 bg-red-100 rounded-full opacity-25 animate-bounce" style={{ animationDelay: '0.5s' }}></div>
          </div>

          <div className="w-full max-w-full mx-auto mobile-form-container">
          <div className="text-center">
            <div className="inline-flex items-center px-3 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-red-100 to-orange-100 rounded-full text-red-800 text-xs sm:text-sm font-medium mb-4 sm:mb-6 shadow-lg animate-fade-in-up max-w-full">
              <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 mr-2 animate-pulse flex-shrink-0" />
              <span className="text-overflow-safe">Veteran-Owned & Operated</span>
            </div>
            
            <h1 id="hero-heading" className="text-xl sm:text-4xl md:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight animate-fade-in-up px-1 sm:px-2 text-overflow-safe">
              <span className="text-white drop-shadow-lg block">When Legal Issues Strike,</span>
              <span className="text-orange-400 block mt-1 sm:mt-2 drop-shadow-lg">We've Got Your Six.</span>
            </h1>
            
            <div className="animate-fade-in-up px-1 sm:px-2 max-w-full" style={{ animationDelay: '0.3s' }}>
              <p className="text-sm sm:text-lg md:text-xl text-white mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed drop-shadow-md responsive-text text-overflow-safe">
                Professional legal protection for active duty, veterans, and military families worldwide.<br className="hidden sm:block"/>
                <span className="sm:hidden"> </span>From emergency defense to everyday legal needs—we're here 24/7.
              </p>
              
              {/* Emergency & Regular CTA Buttons */}
              <div className="mb-6 sm:mb-8 px-1 sm:px-2 w-full max-w-full">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-4xl mx-auto">
                  {/* Emergency Consultation - Red/Urgent */}
                  <Link href="/emergency-consultation" className="flex-1">
                    <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-lg font-bold rounded-xl transform transition hover:scale-105 shadow-2xl w-full border border-red-500 animate-pulse">
                      <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
                      <span className="text-overflow-safe">Emergency Legal Help</span>
                    </Button>
                  </Link>
                  
                  {/* Regular Consultation - Orange/Professional */}
                  <Link href="/urgent-match" className="flex-1">
                    <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-lg font-bold rounded-xl transform transition hover:scale-105 shadow-2xl w-full">
                      <Scale className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
                      <span className="text-overflow-safe">Find Attorney</span>
                    </Button>
                  </Link>
                </div>
                
                {/* Emergency Contact Info */}
                <div className="text-center mt-4 sm:mt-6">
                  <p className="text-white text-xs sm:text-sm opacity-90 mb-2">
                    <span className="font-semibold">Emergency Hotline:</span> (800) 555-0123
                  </p>
                  <p className="text-white text-xs opacity-75">
                    Available 24/7 for immediate legal threats
                  </p>
                </div>
              </div>
            </div>

            {/* Trust Section - LegalShield Style */}
            <div className="mb-8 sm:mb-12 animate-fade-in-up px-1 sm:px-2 w-full max-w-full mobile-form-container" style={{ animationDelay: '0.5s' }}>
              <h2 className="text-base sm:text-xl md:text-2xl font-bold text-white mb-4 sm:mb-6 text-center responsive-text text-overflow-safe">"Trusted by Those Who Serve"</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 md:gap-6 max-w-full mx-auto no-scroll-x">
                <div className="text-center mobile-card">
                  <div className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 flex-shrink-0">
                    <CheckCircle className="w-5 h-5 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                  </div>
                  <p className="text-white font-semibold text-xs sm:text-sm md:text-base responsive-text text-overflow-safe">Veteran-Owned</p>
                </div>
                <div className="text-center mobile-card">
                  <div className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 flex-shrink-0">
                    <Shield className="w-5 h-5 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                  </div>
                  <p className="text-white font-semibold text-xs sm:text-sm md:text-base responsive-text text-overflow-safe">Secure</p>
                </div>
                <div className="text-center mobile-card">
                  <div className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 flex-shrink-0">
                    <Clock className="w-5 h-5 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                  </div>
                  <p className="text-white font-semibold text-xs sm:text-sm md:text-base responsive-text text-overflow-safe">Fast Access</p>
                </div>
                <div className="text-center mobile-card">
                  <div className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 flex-shrink-0">
                    <Users className="w-5 h-5 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                  </div>
                  <p className="text-white font-semibold text-xs sm:text-sm md:text-base responsive-text text-overflow-safe">Military-Focused</p>
                </div>
              </div>
            </div>

            {/* World Clock */}
            <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
              <WorldClock />
            </div>

            {/* Secondary CTA */}
            <div className="text-center">
              <Link href="/consultation-booking">
                <Button variant="outline" size="lg" className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm">
                  <Phone className="w-5 h-5 mr-2" />
                  Start Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - 3-Step Section */}
      <section className="py-12 sm:py-16 bg-white overflow-hidden">
        <div className="w-full max-w-full mx-auto px-3 sm:px-4 lg:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-navy-900 mb-3 sm:mb-4 px-2">Getting Legal Help is Simple:</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            <Card className="border-orange-200 hover-lift transition-smooth card-interactive touch-optimized text-center mx-2 md:mx-0">
              <CardHeader className="pb-3">
                <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <div className="text-2xl sm:text-3xl font-bold text-orange-600">1</div>
                </div>
                <CardTitle className="text-lg sm:text-xl text-navy-900 px-2">Choose Your Legal Issue</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base px-2">
                  Select from court-martial defense, DUI, false accusations, POA, or other legal matters
                </p>
              </CardContent>
            </Card>

            <Card className="border-orange-200 hover-lift transition-smooth card-interactive touch-optimized text-center mx-2 md:mx-0">
              <CardHeader className="pb-3">
                <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <div className="text-2xl sm:text-3xl font-bold text-orange-600">2</div>
                </div>
                <CardTitle className="text-lg sm:text-xl text-navy-900 px-2">Connect With a Vetted Lawyer</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base px-2">
                  Get matched with military law specialists who understand your unique situation
                </p>
              </CardContent>
            </Card>

            <Card className="border-orange-200 hover-lift transition-smooth card-interactive touch-optimized text-center mx-2 md:mx-0">
              <CardHeader className="pb-3">
                <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <div className="text-2xl sm:text-3xl font-bold text-orange-600">3</div>
                </div>
                <CardTitle className="text-lg sm:text-xl text-navy-900 px-2">Get Legal Advice or Representation Fast</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base px-2">
                  Receive immediate consultation or ongoing representation for your case
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center mt-8 sm:mt-12 px-2">
            <Link href="/consultation-booking">
              <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white px-6 sm:px-8 py-3 text-base sm:text-lg font-semibold rounded-xl w-full sm:w-auto max-w-xs sm:max-w-none mx-auto">
                Start Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Use Case Scenarios / Quick Answers */}
      <section className="py-16 bg-gradient-to-br from-slate-100 to-orange-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-navy-900 mb-4">If This Is You, We're Your Legal Shield:</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-red-200 hover-lift transition-smooth card-interactive touch-optimized bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Gavel className="w-8 h-8 text-red-600 mr-3" />
                  <h3 className="text-lg font-bold text-navy-900">Got Court Martialed?</h3>
                </div>
                <p className="text-gray-700 mb-4">→ Get a Lawyer</p>
                <Link href="/urgent-match">
                  <Button className="bg-red-600 hover:bg-red-700 text-white w-full">
                    Connect Now
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-orange-200 hover-lift transition-smooth card-interactive touch-optimized bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <AlertTriangle className="w-8 h-8 text-orange-600 mr-3" />
                  <h3 className="text-lg font-bold text-navy-900">Got a DUI?</h3>
                </div>
                <p className="text-gray-700 mb-4">→ Get a Lawyer</p>
                <Link href="/urgent-match">
                  <Button className="bg-orange-600 hover:bg-orange-700 text-white w-full">
                    Connect Now
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-blue-200 hover-lift transition-smooth card-interactive touch-optimized bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Shield className="w-8 h-8 text-blue-600 mr-3" />
                  <h3 className="text-lg font-bold text-navy-900">Falsely Accused?</h3>
                </div>
                <p className="text-gray-700 mb-4">→ Get a Lawyer</p>
                <Link href="/urgent-match">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full">
                    Connect Now
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-purple-200 hover-lift transition-smooth card-interactive touch-optimized bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <FileText className="w-8 h-8 text-purple-600 mr-3" />
                  <h3 className="text-lg font-bold text-navy-900">Need POA?</h3>
                </div>
                <p className="text-gray-700 mb-4">→ Find a Lawyer</p>
                <Link href="/family-law-poas">
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white w-full">
                    Get POA Documents
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-green-200 hover-lift transition-smooth card-interactive touch-optimized bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <HelpCircle className="w-8 h-8 text-green-600 mr-3" />
                  <h3 className="text-lg font-bold text-navy-900">Need an Attorney?</h3>
                </div>
                <p className="text-gray-700 mb-4">→ Browse Our Database</p>
                <Link href="/lawyer-database">
                  <Button className="bg-green-600 hover:bg-green-700 text-white w-full">
                    Find Attorneys
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-purple-200 hover-lift transition-smooth card-interactive touch-optimized bg-gradient-to-br from-purple-50 to-purple-100 border-2">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Grid3X3 className="w-8 h-8 text-purple-600 mr-3" />
                  <h3 className="text-lg font-bold text-navy-900">Smart Widgets</h3>
                </div>
                <p className="text-gray-700 mb-4">→ Google Calendar, Drive & AI Assistant</p>
                <Link href="/widgets">
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white w-full">
                    Access Widgets
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-slate-200 hover-lift transition-smooth card-interactive touch-optimized bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <MessageSquare className="w-8 h-8 text-slate-600 mr-3" />
                  <h3 className="text-lg font-bold text-navy-900">Emergency Help?</h3>
                </div>
                <p className="text-gray-700 mb-4">→ 24/7 Support</p>
                <Link href="/emergency-defense">
                  <Button className="bg-slate-600 hover:bg-slate-700 text-white w-full">
                    Get Help Now
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Attorney Database Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-navy-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-navy-900 mb-4">Military Attorney Database</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Connect with experienced military defense attorneys and Defense Service Offices nationwide. 
              Our comprehensive database includes vetted attorneys with proven track records in military law.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-navy-900 mb-2">500+ Attorneys</h3>
              <p className="text-gray-600">Civilian attorneys and Defense Service Offices across all 50 states</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-navy-900 mb-2">All Military Branches</h3>
              <p className="text-gray-600">Attorneys experienced with Army, Navy, Air Force, Marines, Coast Guard, and Space Force</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-navy-900 mb-2">Advanced Search</h3>
              <p className="text-gray-600">Filter by location, specialty, pricing, emergency availability, and military branch experience</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold text-navy-900 mb-4">Find the Right Attorney for Your Case</h3>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>Court-martial defense specialists</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>Administrative separation board experts</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>Security clearance defense attorneys</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>Emergency 24/7 availability</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>Detailed attorney profiles with success rates</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>Direct contact information and scheduling</span>
                  </li>
                </ul>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/lawyer-database">
                    <Button size="lg" className="bg-orange-600 hover:bg-orange-700">
                      Browse Attorney Database
                    </Button>
                  </Link>
                  <Link href="/jargon-wizard">
                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                      Legal Jargon Wizard
                    </Button>
                  </Link>
                  <Link href="/emergency-consultation">
                    <Button size="lg" variant="outline">
                      Emergency Legal Help
                    </Button>
                  </Link>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-orange-600">92%</div>
                  <div className="text-sm text-gray-600">Average Success Rate</div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">{"< 4hrs"}</div>
                  <div className="text-sm text-gray-600">Average Response Time</div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">15+</div>
                  <div className="text-sm text-gray-600">Years Experience</div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-600">24/7</div>
                  <div className="text-sm text-gray-600">Emergency Access</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-navy-900 mb-4">Trusted by Those Who Serve</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-yellow-200 hover-lift transition-smooth card-interactive touch-optimized bg-white shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                  </div>
                </div>
                <p className="text-gray-700 italic mb-4">"Quick, easy, and professional! Got me connected with a lawyer within hours during my deployment crisis."</p>
                <p className="text-navy-900 font-semibold">- SGT Walker</p>
              </CardContent>
            </Card>

            <Card className="border-yellow-200 hover-lift transition-smooth card-interactive touch-optimized bg-white shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                  </div>
                </div>
                <p className="text-gray-700 italic mb-4">"Helped me navigate false charges overseas. The attorney understood military law and got results fast."</p>
                <p className="text-navy-900 font-semibold">- CPT Martinez</p>
              </CardContent>
            </Card>

            <Card className="border-yellow-200 hover-lift transition-smooth card-interactive touch-optimized bg-white shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                  </div>
                </div>
                <p className="text-gray-700 italic mb-4">"Finally got the POA documents I needed for deployment. Service was excellent and confidential."</p>
                <p className="text-navy-900 font-semibold">- PFC Johnson</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Professional Trust & Accreditation Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Trusted by Military Families Worldwide</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Join over 75,000 service members and their families who rely on our comprehensive legal protection. 
              From court-martial defense to family law, we're here when you need us most.
            </p>
          </div>
          
          {/* Enhanced Statistics Grid */}
          <div className="grid md:grid-cols-4 gap-8 mb-16">
            <div className="text-center bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-5xl font-bold text-orange-600 mb-3">75,000+</div>
              <div className="text-gray-700 font-medium">Military families protected</div>
              <div className="text-sm text-gray-500 mt-1">Active duty & veterans</div>
            </div>
            <div className="text-center bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-5xl font-bold text-green-600 mb-3">24/7</div>
              <div className="text-gray-700 font-medium">Emergency legal hotline</div>
              <div className="text-sm text-gray-500 mt-1">Available worldwide</div>
            </div>
            <div className="text-center bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-5xl font-bold text-blue-600 mb-3">98.7%</div>
              <div className="text-gray-700 font-medium">Client satisfaction rate</div>
              <div className="text-sm text-gray-500 mt-1">Based on 2024 surveys</div>
            </div>
            <div className="text-center bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-5xl font-bold text-purple-600 mb-3">15+</div>
              <div className="text-gray-700 font-medium">Years of service</div>
              <div className="text-sm text-gray-500 mt-1">Military legal expertise</div>
            </div>
          </div>
          
          {/* Professional Accreditations & Badges */}
          <div className="bg-white rounded-2xl p-8 shadow-xl mb-16">
            <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">Professional Accreditations & Partnerships</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-8 h-8 text-blue-600" />
                </div>
                <div className="text-sm font-medium text-gray-700">JAG Corps</div>
                <div className="text-xs text-gray-500">Certified</div>
              </div>
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Scale className="w-8 h-8 text-green-600" />
                </div>
                <div className="text-sm font-medium text-gray-700">ABA</div>
                <div className="text-xs text-gray-500">Accredited</div>
              </div>
              <div className="text-center">
                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Star className="w-8 h-8 text-orange-600" />
                </div>
                <div className="text-sm font-medium text-gray-700">BBB A+</div>
                <div className="text-xs text-gray-500">Rating</div>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-8 h-8 text-purple-600" />
                </div>
                <div className="text-sm font-medium text-gray-700">ISO Certified</div>
                <div className="text-xs text-gray-500">Security</div>
              </div>
            </div>
          </div>

          {/* Trust Guarantees */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-10 h-10 text-green-600" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">100% Confidential</h4>
              <p className="text-gray-600">Attorney-client privilege protects all communications. Your privacy is guaranteed by law.</p>
            </div>
            <div className="text-center p-6">
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-blue-600" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">No Hidden Fees</h4>
              <p className="text-gray-600">Transparent pricing with no surprise charges. What you see is what you pay.</p>
            </div>
            <div className="text-center p-6">
              <div className="bg-orange-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-10 h-10 text-orange-600" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Rapid Response</h4>
              <p className="text-gray-600">Emergency situations get immediate attention. We respond to urgent cases within 2 hours.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Services Grid - LegalShield Style */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Complete Legal Coverage for Military Life</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Professional legal services designed specifically for the unique challenges facing military families.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
            <Card className="border-2 border-red-100 hover:border-red-300 transition-all duration-300 hover:shadow-xl">
              <CardHeader className="text-center pb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-red-600" />
                </div>
                <CardTitle className="text-xl text-gray-900">Emergency Defense</CardTitle>
                <div className="text-sm text-red-600 font-semibold bg-red-50 px-3 py-1 rounded-full inline-block">
                  URGENT RESPONSE
                </div>
              </CardHeader>
              <CardContent className="text-center">
                <ul className="text-gray-600 space-y-2 mb-6">
                  <li>
                    <Link href="/court-martial-defense" className="hover:text-red-600">
                      • Court-Martial Defense
                    </Link>
                  </li>
                  <li>
                    <Link href="/legal-documents" className="hover:text-red-600">
                      • Article 15 Proceedings
                    </Link>
                  </li>
                  <li>
                    <Link href="/consultation-booking?service=admin-separation" className="hover:text-red-600">
                      • Administrative Separations
                    </Link>
                  </li>
                  <li>
                    <Link href="/consultation-booking?service=security-clearance" className="hover:text-red-600">
                      • Security Clearance Issues
                    </Link>
                  </li>
                </ul>
                <MilitaryTooltip 
                  content={MILITARY_TOOLTIPS.COURT_MARTIAL}
                  type="warning"
                  position="bottom"
                >
                  <Link href="/urgent-match">
                    <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-medium">
                      Get Emergency Help
                    </Button>
                  </Link>
                </MilitaryTooltip>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-100 hover:border-blue-300 transition-all duration-300 hover:shadow-xl">
              <CardHeader className="text-center pb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl text-gray-900">Family Legal Services</CardTitle>
                <div className="text-sm text-blue-600 font-semibold bg-blue-50 px-3 py-1 rounded-full inline-block">
                  MOST POPULAR
                </div>
              </CardHeader>
              <CardContent className="text-center">
                <ul className="text-gray-600 space-y-2 mb-6">
                  <li>
                    <MilitaryTooltip content={MILITARY_TOOLTIPS.WILL_TESTAMENT} type="info" position="right">
                      <Link href="/family-law-poas" className="cursor-help border-b border-dotted border-gray-400 hover:text-blue-600">
                        • Wills & Powers of Attorney
                      </Link>
                    </MilitaryTooltip>
                  </li>
                  <li>
                    <Link href="/family-law-poas" className="hover:text-blue-600">
                      • Divorce & Custody
                    </Link>
                  </li>
                  <li>
                    <Link href="/legal-documents" className="hover:text-blue-600">
                      • PCS Legal Support
                    </Link>
                  </li>
                  <li>
                    <MilitaryTooltip content={MILITARY_TOOLTIPS.FAMILY_CARE_PLAN} type="warning" position="right">
                      <Link href="/document-generator?type=family-care-plan" className="cursor-help border-b border-dotted border-gray-400 hover:text-blue-600">
                        • Family Care Plans
                      </Link>
                    </MilitaryTooltip>
                  </li>
                </ul>
                <Link href="/family-law-poas">
                  <Button variant="outline" className="w-full border-blue-600 text-blue-600 hover:bg-blue-50">
                    Explore Services
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-100 hover:border-green-300 transition-all duration-300 hover:shadow-xl">
              <CardHeader className="text-center pb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-xl text-gray-900">Benefits & Claims</CardTitle>
                <div className="text-sm text-green-600 font-semibold bg-green-50 px-3 py-1 rounded-full inline-block">
                  HIGH SUCCESS
                </div>
              </CardHeader>
              <CardContent className="text-center">
                <ul className="text-gray-600 space-y-2 mb-6">
                  <li>
                    <MilitaryTooltip content={MILITARY_TOOLTIPS.VA_BENEFITS} type="success" position="left">
                      <Link href="/va-benefits-claims" className="cursor-help border-b border-dotted border-gray-400 hover:text-green-600">
                        • VA Disability Claims
                      </Link>
                    </MilitaryTooltip>
                  </li>
                  <li>
                    <Link href="/va-benefits-claims" className="hover:text-green-600">
                      • Benefits Appeals
                    </Link>
                  </li>
                  <li>
                    <MilitaryTooltip content={MILITARY_TOOLTIPS.DISCHARGE_UPGRADE} type="warning" position="left">
                      <Link href="/consultation-booking?service=discharge-upgrade" className="cursor-help border-b border-dotted border-gray-400 hover:text-green-600">
                        • Discharge Upgrades
                      </Link>
                    </MilitaryTooltip>
                  </li>
                  <li>
                    <Link href="/consultation-booking?service=medical-board" className="hover:text-green-600">
                      • Medical Board Reviews
                    </Link>
                  </li>
                </ul>
                <Link href="/benefits-calculator">
                  <Button variant="outline" className="w-full border-green-600 text-green-600 hover:bg-green-50">
                    Calculate Benefits
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Professional Trust Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Proven Results for Military Families</h2>
            <p className="text-xl text-gray-300">Professional legal representation with a track record of success</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-400 mb-2">25,000+</div>
              <div className="text-gray-300">Cases Handled</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-400 mb-2">96%</div>
              <div className="text-gray-300">Client Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-400 mb-2">24/7</div>
              <div className="text-gray-300">Emergency Access</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-400 mb-2">50</div>
              <div className="text-gray-300">States Covered</div>
            </div>
          </div>

          <div className="bg-gray-800 p-8 rounded-xl max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
              ))}
            </div>
            <blockquote className="text-xl italic text-center mb-4">
              "Military Legal Shield connected me with an experienced attorney when I needed it most. 
              Their support during my court-martial proceedings was exceptional and professional."
            </blockquote>
            <div className="text-center text-gray-400">— Staff Sergeant, U.S. Air Force</div>
          </div>
        </div>
      </section>

      {/* Pricing Preview Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Choose Your Legal Protection Plan</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Affordable legal coverage that fits your military lifestyle and budget.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="border-2 border-gray-200 hover:border-blue-300 transition-all duration-300">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl text-gray-900 mb-2">Basic</CardTitle>
                <div className="text-3xl font-bold text-gray-900">FREE</div>
                <p className="text-gray-600 mt-2">Essential legal resources</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <Link href="/forum" className="text-blue-600 hover:text-blue-800 underline">
                      Legal Q&A Database
                    </Link>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <Link href="/legal-documents" className="text-blue-600 hover:text-blue-800 underline">
                      Document Templates
                    </Link>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <Link href="/benefits-eligibility" className="text-blue-600 hover:text-blue-800 underline">
                      Benefits Eligibility Calculator
                    </Link>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <Link href="/forum" className="text-blue-600 hover:text-blue-800 underline">
                      Community Forum Access
                    </Link>
                  </li>
                </ul>
                <Link href="/signup">
                  <Button variant="outline" className="w-full">
                    Get Started Free
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-2 border-orange-300 bg-orange-50 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-orange-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                  MOST POPULAR
                </span>
              </div>
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl text-gray-900 mb-2">Premium</CardTitle>
                <div className="text-3xl font-bold text-gray-900">$29.99<span className="text-lg text-gray-600">/month</span></div>
                <p className="text-gray-600 mt-2">Complete legal protection</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>Everything in Basic</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <Link href="/emergency-consultation" className="text-blue-600 hover:text-blue-800 underline">
                      24/7 Attorney Hotline
                    </Link>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <Link href="/document-generator" className="text-blue-600 hover:text-blue-800 underline">
                      Document Review
                    </Link>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <Link href="/consultation-booking" className="text-blue-600 hover:text-blue-800 underline">
                      Legal Consultations
                    </Link>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <Link href="/emergency-defense" className="text-blue-600 hover:text-blue-800 underline">
                      Emergency Legal Assistance
                    </Link>
                  </li>
                </ul>
                <Link href="/pricing">
                  <Button className="w-full bg-orange-600 hover:bg-orange-700">
                    Start Premium Plan
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-200 hover:border-purple-300 transition-all duration-300">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl text-gray-900 mb-2">Family</CardTitle>
                <div className="text-3xl font-bold text-gray-900">$49.99<span className="text-lg text-gray-600">/month</span></div>
                <p className="text-gray-600 mt-2">Protection for your whole family</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>Everything in Premium</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <Link href="/family-law-poas" className="text-blue-600 hover:text-blue-800 underline">
                      Family Legal Coverage
                    </Link>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <Link href="/consultation-booking" className="text-blue-600 hover:text-blue-800 underline">
                      Multiple Consultations
                    </Link>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <Link href="/attorneys" className="text-blue-600 hover:text-blue-800 underline">
                      Priority Attorney Matching
                    </Link>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <Link href="/lawyer-database" className="text-blue-600 hover:text-blue-800 underline">
                      Worldwide Coverage
                    </Link>
                  </li>
                </ul>
                <Link href="/pricing">
                  <Button variant="outline" className="w-full border-purple-600 text-purple-600 hover:bg-purple-50">
                    Choose Family Plan
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              All plans include secure communication and confidential case handling.
            </p>
            <Link href="/pricing">
              <Button variant="outline" className="font-medium">
                Compare All Plans & Features
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-navy-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-700">Get answers to common questions about our legal services</p>
          </div>
          <FAQAccordion />
        </div>
      </section>

      {/* Final CTA Section - LegalShield Style */}
      <section className="py-20 bg-gradient-to-r from-gray-900 to-navy-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">Ready to Get the Legal Protection You Deserve?</h2>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Join thousands of military families who trust Military Legal Shield for their legal needs. 
                From emergency defense to everyday legal matters—we're here for you 24/7.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300">No long-term contracts</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300">Cancel anytime</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300">Worldwide coverage</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300">Attorney-client privilege protected</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-2xl">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Start Your Protection Today</h3>
                <p className="text-gray-600">Choose the plan that's right for you</p>
              </div>
              
              <div className="space-y-4">
                <MilitaryTooltip 
                  content={MILITARY_TOOLTIPS.EMERGENCY_CONTACT}
                  type="warning"
                  position="left"
                >
                  <Link href="/urgent-match">
                    <Button className="w-full bg-red-600 hover:bg-red-700 text-white py-4 text-lg font-semibold">
                      <Shield className="w-5 h-5 mr-3" />
                      Emergency Legal Help
                    </Button>
                  </Link>
                </MilitaryTooltip>
                
                <Link href="/pricing">
                  <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 text-lg font-semibold">
                    View All Plans & Pricing
                  </Button>
                </Link>
                
                <MilitaryTooltip 
                  content="📋 TRIAL PERIOD: 14-day free access to all legal services. No commitment required. Cancel anytime during trial period."
                  type="success"
                  position="left"
                >
                  <Button variant="outline" className="w-full py-4 text-lg border-gray-300 text-gray-700 hover:bg-gray-50">
                    Start Free Trial
                  </Button>
                </MilitaryTooltip>
              </div>
              
              <div className="text-center mt-6">
                <p className="text-sm text-gray-500">
                  ✓ Free consultation included • ✓ 30-day money-back guarantee
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Military Branches Banner */}
      <MilitaryBranchesBanner />
    </PageLayout>
  );
}