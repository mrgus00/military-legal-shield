import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Link } from "wouter";
import { Shield, Users, Clock, Star, Mail, CheckCircle, ArrowRight, Phone, Video, MessageSquare, AlertTriangle, Scale, FileText, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PageLayout from "@/components/page-layout";
import { apiRequest } from "@/lib/queryClient";
import { useBranch } from "@/contexts/BranchContext";
import MilitaryBranchesBanner from "@/components/military-branches-banner";
import LegalAssistantChatbot from "@/components/legal-assistant-chatbot";
import InteractiveHeroSection from "@/components/interactive-hero-section";

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
        <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden" aria-labelledby="hero-heading">
          {/* Interactive Hero Background */}
          <InteractiveHeroSection />
          
          {/* Animated background elements */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-20 left-10 w-32 h-32 bg-blue-100 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute top-40 right-20 w-24 h-24 bg-green-100 rounded-full opacity-30 animate-bounce" style={{ animationDelay: '1s' }}></div>
            <div className="absolute bottom-32 left-20 w-28 h-28 bg-yellow-100 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
            <div className="absolute bottom-20 right-10 w-20 h-20 bg-red-100 rounded-full opacity-25 animate-bounce" style={{ animationDelay: '0.5s' }}></div>
          </div>

          <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-navy-100 to-blue-100 rounded-full text-navy-800 text-sm font-medium mb-6 shadow-lg animate-fade-in-up hover-scale">
              <Shield className="w-4 h-4 mr-2 animate-military-pulse" />
              Trusted by 50,000+ Service Members
            </div>
            
            <h1 id="hero-heading" className="text-4xl md:text-6xl font-bold text-navy-900 mb-6 leading-tight animate-fade-in-up">
              <span className="bg-gradient-to-r from-navy-900 to-blue-800 bg-clip-text text-transparent">Legal Support for</span>
              <span className="text-navy-600 block mt-2 animate-gradient bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">Every {getTerminology('personnel').slice(0, -1)}</span>
            </h1>
            
            <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <p className="text-xl text-gray-700 mb-6 max-w-3xl mx-auto leading-relaxed">
                Comprehensive legal assistance for {getTerminology('personnel').toLowerCase()}, veterans, and their families. 
                From urgent defense to family matters, MilitaryLegalShield has you covered 24/7.
              </p>
              <div className="glass rounded-xl p-4 max-w-2xl mx-auto mb-8">
                <p className="text-lg font-semibold text-navy-800" style={{ color: `hsl(${branchTheme.colors.primary})` }}>
                  "{getMotto()}" - Defending those who defend our freedom.
                </p>
              </div>
            </div>

            {/* Lead Capture Form */}
            <div className="glass-dark backdrop-blur-lg p-8 rounded-3xl max-w-lg mx-auto mb-12 ios-form-fix animate-fade-in-up shadow-2xl border border-white/10" style={{ animationDelay: '0.5s' }}>
              <h3 id="signup-heading" className="text-2xl font-bold text-white mb-4 text-center">Get Instant Access</h3>
              <p className="text-gray-300 mb-6 text-center">Join thousands of {getTerminology('personnel').toLowerCase()} getting the legal help they need</p>
              
              <form onSubmit={handleLeadCapture} className="space-y-4 ios-form-fix" role="form" aria-labelledby="signup-heading">
                <div className="form-field">
                  <label htmlFor="email-input" className="form-label text-white font-medium mb-2 block">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="email-input"
                      type="email"
                      placeholder="Enter your military email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="glass w-full pl-12 pr-4 py-3 text-base text-white placeholder:text-gray-400 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                      style={{ fontSize: '16px', WebkitAppearance: 'none' }}
                      required
                      aria-describedby="email-description email-error"
                      aria-invalid={!email && isSubmitting ? "true" : "false"}
                    />
                  </div>
                  <div id="email-description" className="sr-only">
                    Enter your valid military email address to get started
                  </div>
                  {!email && isSubmitting && (
                    <div id="email-error" className="text-red-400 text-sm mt-1" role="alert">
                      Email address is required to continue
                    </div>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="military-gradient hover:shadow-lg px-8 py-3 rounded-xl text-white font-semibold transform transition hover:scale-105 animate-glow"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                        Getting Started...
                      </div>
                    ) : (
                      <>
                        Get Started Free
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  No spam. Unsubscribe anytime. Secure and confidential.
                </p>
              </form>
            </div>

            {/* Quick Access Buttons */}
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/urgent-match">
                <Button variant="outline" size="lg" className="bg-red-50 border-red-200 text-red-700 hover:bg-red-100">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Emergency Legal Help
                </Button>
              </Link>
              <Link href="/video-consultation">
                <Button variant="outline" size="lg" className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100">
                  <Video className="w-5 h-5 mr-2" />
                  Video Consultation
                </Button>
              </Link>
              <Link href="/attorneys">
                <Button variant="outline" size="lg" className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100">
                  <Users className="w-5 h-5 mr-2" />
                  Find Attorneys
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Goal Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-navy-200 hover-lift transition-smooth card-interactive touch-optimized">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-navy-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-navy-600" />
                </div>
                <CardTitle className="text-2xl text-navy-900">Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 text-center leading-relaxed">
                  Assist all service members in accessing essential legal services with dignity, 
                  expertise, and unwavering support when they need it most.
                </p>
              </CardContent>
            </Card>

            <Card className="border-navy-200 hover-lift transition-smooth card-interactive touch-optimized">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="text-2xl text-navy-900">Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 text-center leading-relaxed">
                  Ensure all service members, veterans, and their families have comprehensive legal support—
                  whether for defense, injury representation, wills, powers of attorney, or other legal matters.
                </p>
              </CardContent>
            </Card>

            <Card className="border-navy-200 hover-lift transition-smooth card-interactive touch-optimized">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl text-navy-900">Our Goal</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 text-center leading-relaxed">
                  Ensure every military service member, veteran, and their families have easy access 
                  to the Mil-Legal app and the justice they deserve.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-40 h-40 bg-blue-200 rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-32 h-32 bg-purple-200 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-green-200 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-4 bg-gradient-to-r from-navy-900 to-blue-800 bg-clip-text text-transparent">Complete Legal Protection</h2>
            <p className="text-xl text-gray-700">Everything you need for military legal matters</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <Card className="text-center hover-lift transition-all duration-300 group cursor-pointer bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl">
                <CardContent className="p-6">
                  <div className="emergency-gradient w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform animate-military-pulse">
                    <AlertTriangle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-navy-900 mb-2 text-lg">Emergency Defense</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">24/7 urgent legal matching for critical situations</p>
                </CardContent>
              </Card>
            </div>

            <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <Card className="text-center hover-lift transition-all duration-300 group cursor-pointer bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl">
                <CardContent className="p-6">
                  <div className="military-gradient w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Scale className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-navy-900 mb-2 text-lg">Military Justice</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">UCMJ expertise and court-martial defense</p>
                </CardContent>
              </Card>
            </div>

            <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <Link href="/document-prep">
                <Card className="text-center hover-lift transition-all duration-300 group cursor-pointer bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl">
                  <CardContent className="p-6">
                    <div className="tactical-gradient w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform animate-glow">
                      <FileText className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-bold text-navy-900 mb-2 text-lg">Document Prep</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">AI-powered legal document generation</p>
                  </CardContent>
                </Card>
              </Link>
            </div>

            <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <Card className="text-center hover-lift transition-all duration-300 group cursor-pointer bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl">
                <CardContent className="p-6">
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-navy-900 mb-2 text-lg">Injury Claims</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">VA disability and personal injury representation</p>
                </CardContent>
              </Card>
            </div>
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

      {/* Final CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-navy-900 mb-4">Ready to Get Legal Support?</h2>
          <p className="text-xl text-gray-700 mb-8">
            Join thousands of service members who trust Mil-Legal for their legal needs
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link href="/urgent-match">
              <Button size="lg" className="emergency-gradient hover:shadow-xl px-8 py-4 text-lg font-semibold rounded-xl transform transition hover:scale-105 animate-military-pulse">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Get Emergency Help Now
              </Button>
            </Link>
            <Link href="/loading-demo">
              <Button size="lg" variant="outline" className="glass-dark border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg border-2 rounded-xl transform transition hover:scale-105">
                <Shield className="w-5 h-5 mr-2" />
                View Military Loading System
              </Button>
            </Link>
            <Link href="/attorneys">
              <Button variant="outline" size="lg" className="tactical-gradient border-0 text-white hover:shadow-lg px-8 py-4 text-lg rounded-xl transform transition hover:scale-105">
                <Users className="w-5 h-5 mr-2" />
                Browse Attorneys
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Military Branches Banner */}
      <MilitaryBranchesBanner />
      
      {/* Legal Assistant Chatbot */}
      <LegalAssistantChatbot />
    </PageLayout>
  );
}