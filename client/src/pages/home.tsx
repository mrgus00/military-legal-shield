import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Link } from "wouter";
import { Shield, Users, Clock, Star, Mail, CheckCircle, ArrowRight, Phone, Video, MessageSquare, AlertTriangle, Scale, FileText, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/header";
import { apiRequest } from "@/lib/queryClient";
import { useBranch } from "@/contexts/BranchContext";

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
    <div className="min-h-screen bg-gradient-to-br from-navy-50 to-white">
      <Header />
      
      <main id="main-content" role="main">
        {/* Hero Section */}
        <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8" aria-labelledby="hero-heading">
          <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-navy-100 rounded-full text-navy-800 text-sm font-medium mb-6">
              <Shield className="w-4 h-4 mr-2" />
              Trusted by 50,000+ Service Members
            </div>
            
            <h1 id="hero-heading" className="text-4xl md:text-6xl font-bold text-navy-900 mb-6 leading-tight">
              Legal Support for
              <span className="text-navy-600 block">Every {getTerminology('personnel').slice(0, -1)}</span>
            </h1>
            
            <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
              Comprehensive legal assistance for {getTerminology('personnel').toLowerCase()}, veterans, and their families. 
              From urgent defense to family matters, Mil-Legal has you covered 24/7.
              <span className="block mt-3 text-lg font-semibold" style={{ color: `hsl(${branchTheme.colors.primary})` }}>
                "{getMotto()}" - Defending those who defend our freedom.
              </span>
            </p>

            {/* Lead Capture Form */}
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-lg mx-auto mb-12">
              <h3 id="signup-heading" className="text-2xl font-bold text-navy-900 mb-4">Get Instant Access</h3>
              <p className="text-gray-600 mb-6">Join thousands of {getTerminology('personnel').toLowerCase()} getting the legal help they need</p>
              
              <form onSubmit={handleLeadCapture} className="space-y-4" role="form" aria-labelledby="signup-heading">
                <div className="form-field">
                  <label htmlFor="email-input" className="form-label">
                    Email Address
                  </label>
                  <Input
                    id="email-input"
                    type="email"
                    placeholder="Enter your military email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input"
                    required
                    aria-describedby="email-description email-error"
                    aria-invalid={!email && isSubmitting ? "true" : "false"}
                  />
                  <div id="email-description" className="sr-only">
                    Enter your valid military email address to get started
                  </div>
                  {!email && isSubmitting && (
                    <div id="email-error" className="text-red-600 text-sm mt-1" role="alert">
                      Email address is required to continue
                    </div>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="bg-navy-800 hover:bg-navy-900 px-8 py-3"
                  >
                    {isSubmitting ? "Getting Started..." : "Get Started Free"}
                    <ArrowRight className="w-4 h-4 ml-2" />
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
            <Card className="border-navy-200 hover-lift transition-smooth">
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

            <Card className="border-navy-200 hover-lift transition-smooth">
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

            <Card className="border-navy-200 hover-lift transition-smooth">
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
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-navy-900 mb-4">Complete Legal Protection</h2>
            <p className="text-xl text-gray-700">Everything you need for military legal matters</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center hover-lift transition-smooth">
              <CardContent className="p-6">
                <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-4" />
                <h3 className="font-semibold text-navy-900 mb-2">Emergency Defense</h3>
                <p className="text-gray-600 text-sm">24/7 urgent legal matching for critical situations</p>
              </CardContent>
            </Card>

            <Card className="text-center hover-lift transition-smooth">
              <CardContent className="p-6">
                <Scale className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold text-navy-900 mb-2">Military Justice</h3>
                <p className="text-gray-600 text-sm">UCMJ expertise and court-martial defense</p>
              </CardContent>
            </Card>

            <Card className="text-center hover-lift transition-smooth">
              <CardContent className="p-6">
                <FileText className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold text-navy-900 mb-2">Family Legal</h3>
                <p className="text-gray-600 text-sm">Wills, powers of attorney, and family matters</p>
              </CardContent>
            </Card>

            <Card className="text-center hover-lift transition-smooth">
              <CardContent className="p-6">
                <Heart className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="font-semibold text-navy-900 mb-2">Injury Claims</h3>
                <p className="text-gray-600 text-sm">VA disability and personal injury representation</p>
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

      {/* Final CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-navy-900 mb-4">Ready to Get Legal Support?</h2>
          <p className="text-xl text-gray-700 mb-8">
            Join thousands of service members who trust Mil-Legal for their legal needs
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/urgent-match">
              <Button size="lg" className="bg-red-600 hover:bg-red-700 px-8 py-4 text-lg">
                Get Emergency Help Now
              </Button>
            </Link>
            <Link href="/attorneys">
              <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
                Browse Attorneys
              </Button>
            </Link>
          </div>
        </div>
      </section>
      </main>
    </div>
  );
}