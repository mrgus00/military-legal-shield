import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Link } from "wouter";
import { Shield, Users, Clock, Star, Mail, CheckCircle, ArrowRight, Phone, Video, MessageSquare, AlertTriangle, Scale, FileText, Heart, Globe, BookOpen, Gavel, MapPin, Search, HelpCircle, Languages } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PageLayout from "@/components/page-layout";
import { apiRequest } from "@/lib/queryClient";
import { useBranch } from "@/contexts/BranchContext";
import MilitaryBranchesBanner from "@/components/military-branches-banner";
import InteractiveHeroSection from "@/components/interactive-hero-section";
import WorldClock from "@/components/world-clock";
import FAQAccordion from "@/components/faq-accordion";
import courtImage from "@assets/court_1749846710218.png";

export default function Home() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { getTerminology, branchTheme, getMotto } = useBranch();

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
              <span className="text-white drop-shadow-lg block">Got Legal Trouble?</span>
              <span className="text-orange-400 block mt-1 sm:mt-2 drop-shadow-lg">Get a Military Lawyer Now.</span>
            </h1>
            
            <div className="animate-fade-in-up px-1 sm:px-2 max-w-full" style={{ animationDelay: '0.3s' }}>
              <p className="text-sm sm:text-lg md:text-xl text-white mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed drop-shadow-md responsive-text text-overflow-safe">
                Court-Martial? DUI? False Accusation? Legal Questions?<br className="hidden sm:block"/>
                <span className="sm:hidden"> </span>We connect you directly to military lawyers—fast.
              </p>
              
              {/* Immediate CTA */}
              <div className="mb-6 sm:mb-8 px-1 sm:px-2 w-full max-w-full">
                <Link href="/urgent-match">
                  <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white px-4 sm:px-8 md:px-12 py-3 sm:py-4 text-sm sm:text-lg md:text-xl font-bold rounded-xl transform transition hover:scale-105 shadow-2xl w-full max-w-full sm:max-w-md mx-auto responsive-button">
                    <Scale className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 mr-2 sm:mr-3 flex-shrink-0" />
                    <span className="text-overflow-safe">Connect with a Lawyer Now</span>
                  </Button>
                </Link>
              </div>
            </div>

            {/* Trust & Credibility Section */}
            <div className="mb-8 sm:mb-12 animate-fade-in-up px-1 sm:px-2 w-full max-w-full mobile-form-container" style={{ animationDelay: '0.5s' }}>
              <h2 className="text-base sm:text-xl md:text-2xl font-bold text-white mb-4 sm:mb-6 text-center responsive-text text-overflow-safe">Why Trust Military Legal Shield?</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 md:gap-6 max-w-full mx-auto no-scroll-x">
                <div className="text-center mobile-card">
                  <div className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 flex-shrink-0">
                    <CheckCircle className="w-5 h-5 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                  </div>
                  <p className="text-white font-semibold text-xs sm:text-sm md:text-base responsive-text text-overflow-safe">Veteran-Owned & Operated</p>
                </div>
                <div className="text-center mobile-card">
                  <div className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 flex-shrink-0">
                    <Globe className="w-5 h-5 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                  </div>
                  <p className="text-white font-semibold text-xs sm:text-sm md:text-base responsive-text text-overflow-safe">Fast Legal Access Worldwide</p>
                </div>
                <div className="text-center mobile-card">
                  <div className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 flex-shrink-0">
                    <Shield className="w-5 h-5 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                  </div>
                  <p className="text-white font-semibold text-xs sm:text-sm md:text-base responsive-text text-overflow-safe">Confidential & Secure</p>
                </div>
                <div className="text-center mobile-card">
                  <div className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 flex-shrink-0">
                    <Users className="w-5 h-5 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                  </div>
                  <p className="text-white font-semibold text-xs sm:text-sm md:text-base responsive-text text-overflow-safe">Recommended by Service Members</p>
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
                <Link href="/attorneys">
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white w-full">
                    Find Attorney
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-green-200 hover-lift transition-smooth card-interactive touch-optimized bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <HelpCircle className="w-8 h-8 text-green-600 mr-3" />
                  <h3 className="text-lg font-bold text-navy-900">Have Questions?</h3>
                </div>
                <p className="text-gray-700 mb-4">→ Consult a Lawyer</p>
                <Link href="/video-consultation">
                  <Button className="bg-green-600 hover:bg-green-700 text-white w-full">
                    Consult Now
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

      {/* Social Proof */}
      <section className="py-16 bg-navy-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-8">Trusted by Service Members Everywhere</h2>
            
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div>
                <div className="text-4xl font-bold text-navy-300 mb-2">50,000+</div>
                <div className="text-navy-200">Service Members Helped</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-navy-300 mb-2">98%</div>
                <div className="text-navy-200">Success Rate</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-navy-300 mb-2">24/7</div>
                <div className="text-navy-200">Emergency Support</div>
              </div>
            </div>

            <div className="bg-navy-800 p-8 rounded-2xl max-w-4xl mx-auto">
              <div className="flex items-center justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                ))}
              </div>
              <blockquote className="text-xl italic mb-4">
                "Mil-Legal saved my career. When I faced an Article 15, their attorney helped me navigate 
                the process and achieve the best possible outcome. I can't thank them enough."
              </blockquote>
              <div className="text-navy-300">— SSG Martinez, U.S. Army</div>
            </div>
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

      {/* Final CTA Section */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">Don't Wait—Your Legal Issue Can't Wait.</h2>
          <p className="text-xl mb-8 text-slate-300">
            All services are confidential. Available worldwide to active duty, veterans, and families.
          </p>
          
          <Link href="/urgent-match">
            <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white px-12 py-4 text-xl font-bold rounded-xl transform transition hover:scale-105 shadow-2xl">
              <Scale className="w-6 h-6 mr-3" />
              Connect with a Lawyer Now
            </Button>
          </Link>
          
          <p className="text-sm text-slate-400 mt-6">
            Available 24/7 for emergency legal situations
          </p>
        </div>
      </section>

      {/* Military Branches Banner */}
      <MilitaryBranchesBanner />
    </PageLayout>
  );
}