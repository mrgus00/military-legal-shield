import { Button } from "@/components/ui/button";
import { Rocket, ShieldCheck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { imageService, type UnsplashImage } from "@/lib/imageService";
import { useState, useEffect } from "react";

export default function Hero() {
  const [heroImage, setHeroImage] = useState<UnsplashImage | null>(null);

  const { data: heroImages } = useQuery({
    queryKey: ["hero-images"],
    queryFn: () => imageService.getHeroImages(),
  });

  useEffect(() => {
    if (heroImages && heroImages.length > 0) {
      setHeroImage(imageService.getRandomImage(heroImages));
    }
  }, [heroImages]);

  return (
    <section className="bg-navy-800 text-white py-16 lg:py-24 relative overflow-hidden">
      {/* Background Image */}
      {heroImage && (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url(${heroImage.urls.regular})`,
          }}
        >
          <div className="absolute inset-0 bg-navy-800/85"></div>
        </div>
      )}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
          <div>
            <h2 className="text-4xl lg:text-5xl font-bold leading-tight mb-6">
              Defend Your Rights with <span className="text-military-gold-400">Expert Legal Support</span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Access comprehensive legal resources, connect with specialized military attorneys, and learn your rights as a service member. Professional defense at your fingertips.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-military-gold-500 hover:bg-military-gold-600 text-navy-800 font-semibold"
              >
                <Rocket className="w-5 h-5 mr-2" />
                Start Free Trial
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-white text-white hover:bg-white hover:text-navy-800 font-semibold"
              >
                Browse Resources
              </Button>
            </div>
            <div className="mt-8 flex items-center text-sm text-gray-300">
              <ShieldCheck className="w-5 h-5 mr-2 text-military-gold-400" />
              <span>Trusted by 10,000+ military personnel nationwide</span>
            </div>
          </div>
          <div className="mt-12 lg:mt-0">
            <div className="relative">
              <div className="bg-gradient-to-br from-navy-700/90 to-navy-900/90 backdrop-blur-sm rounded-xl p-8 shadow-2xl border border-white/10">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-military-gold-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-12 h-12 text-navy-800" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold mb-2">Professional Consultation</h3>
                    <p className="text-gray-300 text-sm">Connect with experienced military law attorneys for personalized legal guidance.</p>
                  </div>
                </div>
              </div>
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-military-gold-400 rounded-full opacity-20"></div>
              <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-white rounded-full opacity-10"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
