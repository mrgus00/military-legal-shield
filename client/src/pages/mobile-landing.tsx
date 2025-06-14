import { Link } from "wouter";
import { Phone, Mail, Shield, Users, Clock, Award, CheckCircle, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatEmergencyContact, formatSupportContact, mobileButtonClasses, trackMobileInteraction, generatePageTitle, generateMetaDescription } from "@/lib/mobile-optimization";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

export default function MobileLanding() {
  const { isAuthenticated } = useAuth();
  const emergencyContact = formatEmergencyContact();
  const supportContact = formatSupportContact();

  // SEO optimization
  useEffect(() => {
    document.title = generatePageTitle("Military Legal Shield - 24/7 Emergency Legal Support for Service Members");
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', generateMetaDescription(
        "24/7 emergency legal support for military personnel. Expert attorneys, instant consultations, AI-powered document generation. Trusted by thousands of service members worldwide."
      ));
    }

    // Mobile viewport optimization
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 via-navy-800 to-blue-900 mobile-container">
      {/* Hero Section - Mobile Optimized */}
      <section className="relative pt-16 pb-12 px-4">
        <div className="text-center space-y-6">
          <div className="space-y-4">
            <h1 className="mobile-h1 text-white font-bold tracking-tight">
              24/7 Emergency Legal Support
              <span className="block text-gold-400 mt-2">For Military Personnel</span>
            </h1>
            <p className="mobile-body text-gray-200 max-w-lg mx-auto">
              Instant access to expert military attorneys, AI-powered legal assistance, and emergency consultation services designed for service members worldwide.
            </p>
          </div>

          {/* Emergency Contact CTA - Mobile Priority */}
          <div className="space-y-4 pt-4">
            <div className="space-y-3">
              <p className="text-sm font-medium text-gold-300 uppercase tracking-wide">
                Emergency Legal Crisis? Call Now
              </p>
              <a 
                href={emergencyContact.callLink}
                onClick={() => trackMobileInteraction('emergency_call', 'hero_section')}
                className="emergency-contact-mobile w-full max-w-xs mx-auto block"
                aria-label="Emergency Legal Call - Available 24/7"
              >
                <Phone className="w-5 h-5" />
                <span className="font-semibold">Call Emergency Legal Line</span>
              </a>
              <p className="text-xs text-gray-300">
                Available 24/7 • Confidential • Military-Specific
              </p>
            </div>

            {/* Secondary Actions */}
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Button asChild className="mobile-button flex-1 bg-gold-600 hover:bg-gold-700 text-navy-900 font-semibold">
                <Link href="/urgent-match">
                  <Shield className="w-4 h-4 mr-2" />
                  Find Attorney Now
                </Link>
              </Button>
              <Button asChild variant="outline" className="mobile-button flex-1 border-white text-white hover:bg-white hover:text-navy-900">
                <Link href="/ai-assistant">
                  <Users className="w-4 h-4 mr-2" />
                  AI Legal Help
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 grid grid-cols-3 gap-4 text-center">
          <div className="space-y-2">
            <div className="text-2xl font-bold text-gold-400">24/7</div>
            <div className="text-xs text-gray-300">Emergency Support</div>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-gold-400">500+</div>
            <div className="text-xs text-gray-300">Vetted Attorneys</div>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-gold-400">98%</div>
            <div className="text-xs text-gray-300">Success Rate</div>
          </div>
        </div>
      </section>

      {/* Mobile-Optimized Service Cards */}
      <section className="py-8 px-4">
        <div className="space-y-6">
          <h2 className="mobile-h2 text-white text-center font-semibold">
            Comprehensive Legal Protection
          </h2>
          
          <div className="mobile-grid mobile-grid-sm gap-4">
            {[
              {
                icon: Shield,
                title: "Emergency Consultation",
                description: "Immediate legal support for urgent situations",
                cta: "Get Help Now",
                href: "/urgent-match",
                color: "bg-red-600"
              },
              {
                icon: Users,
                title: "Attorney Matching",
                description: "Connect with specialized military lawyers",
                cta: "Find Attorney",
                href: "/attorneys",
                color: "bg-blue-600"
              },
              {
                icon: Clock,
                title: "AI Legal Assistant",
                description: "Instant answers to legal questions",
                cta: "Ask AI",
                href: "/ai-assistant",
                color: "bg-green-600"
              },
              {
                icon: Award,
                title: "Document Generation",
                description: "AI-powered legal document creation",
                cta: "Create Docs",
                href: "/document-generator",
                color: "bg-purple-600"
              }
            ].map((service, index) => (
              <Card key={index} className="attorney-card-mobile bg-white/10 border-white/20 text-white hover:bg-white/15">
                <CardContent className="p-6 space-y-4">
                  <div className={`w-12 h-12 ${service.color} rounded-lg flex items-center justify-center`}>
                    <service.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">{service.title}</h3>
                    <p className="text-sm text-gray-300">{service.description}</p>
                  </div>
                  <Button asChild className="mobile-button w-full bg-white/20 hover:bg-white/30 border-white/30">
                    <Link href={service.href}>
                      {service.cta}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile Contact Section */}
      <section className="py-8 px-4 bg-white/5 backdrop-blur-sm">
        <div className="space-y-6">
          <h2 className="mobile-h2 text-white text-center font-semibold">
            Multiple Ways to Get Help
          </h2>
          
          <div className="space-y-4 max-w-md mx-auto">
            {/* Emergency Contact */}
            <div className="space-y-3 p-4 bg-red-600/20 border border-red-500/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Emergency Legal Crisis</h3>
                  <p className="text-sm text-red-200">Immediate response required</p>
                </div>
              </div>
              <div className="flex gap-2">
                <a 
                  href={emergencyContact.callLink}
                  onClick={() => trackMobileInteraction('emergency_call', 'contact_section')}
                  className={`${mobileButtonClasses.call} flex-1 bg-red-600 hover:bg-red-700 focus:ring-red-500`}
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Now</span>
                </a>
                <a 
                  href={emergencyContact.emailLink}
                  onClick={() => trackMobileInteraction('emergency_email', 'contact_section')}
                  className={`${mobileButtonClasses.email} flex-1 focus:ring-blue-500`}
                >
                  <Mail className="w-4 h-4" />
                  <span>Email</span>
                </a>
              </div>
            </div>

            {/* General Support */}
            <div className="space-y-3 p-4 bg-blue-600/20 border border-blue-500/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">General Support</h3>
                  <p className="text-sm text-blue-200">Questions and assistance</p>
                </div>
              </div>
              <div className="flex gap-2">
                <a 
                  href={supportContact.callLink}
                  onClick={() => trackMobileInteraction('support_call', 'contact_section')}
                  className={`${mobileButtonClasses.secondary} flex-1 border-blue-500 text-blue-300 hover:bg-blue-600 hover:text-white focus:ring-blue-500`}
                >
                  <Phone className="w-4 h-4" />
                  <span>Call</span>
                </a>
                <a 
                  href={supportContact.emailLink}
                  onClick={() => trackMobileInteraction('support_email', 'contact_section')}
                  className={`${mobileButtonClasses.secondary} flex-1 border-blue-500 text-blue-300 hover:bg-blue-600 hover:text-white focus:ring-blue-500`}
                >
                  <Mail className="w-4 h-4" />
                  <span>Email</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof - Mobile Optimized */}
      <section className="py-8 px-4">
        <div className="space-y-6">
          <h2 className="mobile-h2 text-white text-center font-semibold">
            Trusted by Military Personnel
          </h2>
          
          <div className="space-y-4">
            {[
              {
                name: "SSG Johnson, Army",
                rating: 5,
                review: "Saved my career. Emergency consultation helped me navigate a complex situation professionally.",
                verified: true
              },
              {
                name: "Petty Officer Martinez, Navy", 
                rating: 5,
                review: "24/7 availability was crucial during my deployment. Expert legal advice when I needed it most.",
                verified: true
              },
              {
                name: "Captain Williams, Air Force",
                rating: 5,
                review: "AI assistant provided immediate guidance, and attorney follow-up was thorough and professional.",
                verified: true
              }
            ].map((testimonial, index) => (
              <Card key={index} className="bg-white/10 border-white/20 text-white">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-sm">{testimonial.name}</h4>
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-gold-400 text-gold-400" />
                        ))}
                      </div>
                    </div>
                    {testimonial.verified && (
                      <div className="flex items-center text-green-400">
                        <CheckCircle className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-300 italic">"{testimonial.review}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-8 px-4 text-center">
        <div className="space-y-4">
          <h2 className="mobile-h2 text-white font-semibold">
            Ready to Get Protected?
          </h2>
          <p className="mobile-body text-gray-300">
            Join thousands of service members who trust us with their legal needs.
          </p>
          
          {!isAuthenticated ? (
            <div className="space-y-3 max-w-sm mx-auto">
              <Button asChild className="mobile-button w-full bg-gold-600 hover:bg-gold-700 text-navy-900 font-semibold">
                <a href="/api/login">
                  Start Free Trial
                </a>
              </Button>
              <p className="text-xs text-gray-400">
                No credit card required • Instant access
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-w-sm mx-auto">
              <Button asChild className="mobile-button w-full bg-gold-600 hover:bg-gold-700 text-navy-900 font-semibold">
                <Link href="/dashboard">
                  Access Your Dashboard
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}