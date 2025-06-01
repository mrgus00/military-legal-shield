import Header from "@/components/header";
import Footer from "@/components/footer";
import SecurityReminder from "@/components/security-reminder";
import SkillTranslationWidget from "@/components/skill-translation-widget";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  Target, 
  Star, 
  Zap,
  CheckCircle,
  Users,
  TrendingUp
} from "lucide-react";

export default function SkillTranslation() {
  const handleSkillSelect = (skill: any) => {
    console.log("Selected skill:", skill);
    // Could integrate with career assessment or other features
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-navy-50 via-white to-sage-50">
      <Header />
      
      <main className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gradient-to-r from-military-gold-100 to-navy-100 rounded-full">
                <Target className="h-12 w-12 text-navy-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-navy-700 mb-4">
              Interactive Veteran Skill Translation
            </h1>
            <p className="text-xl text-navy-600 max-w-3xl mx-auto mb-8">
              Instantly discover how your military skills translate to civilian careers. 
              Get real-time matches with job titles, salary ranges, and industry opportunities.
            </p>
            <div className="flex justify-center space-x-4">
              <Badge className="bg-military-gold-100 text-military-gold-800 px-4 py-2">
                <Zap className="h-4 w-4 mr-1" />
                Real-Time Translation
              </Badge>
              <Badge className="bg-navy-100 text-navy-800 px-4 py-2">
                <Target className="h-4 w-4 mr-1" />
                Instant Matching
              </Badge>
              <Badge className="bg-sage-100 text-sage-800 px-4 py-2">
                <TrendingUp className="h-4 w-4 mr-1" />
                Market Insights
              </Badge>
            </div>
          </div>

          {/* Security Reminder */}
          <SecurityReminder />

          {/* How It Works */}
          <Card className="mb-8 bg-gradient-to-r from-sage-50 to-military-gold-50 border-sage-200">
            <CardHeader>
              <CardTitle className="text-center text-navy-700">How Skill Translation Works</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-6 text-center">
                <div className="flex flex-col items-center">
                  <div className="p-3 bg-navy-100 rounded-full mb-3">
                    <Target className="h-6 w-6 text-navy-600" />
                  </div>
                  <h3 className="font-semibold text-navy-700 mb-2">1. Select Skills</h3>
                  <p className="text-sm text-navy-600">Browse military skills by category or search for specific experience</p>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="p-3 bg-military-gold-100 rounded-full mb-3">
                    <Zap className="h-6 w-6 text-military-gold-600" />
                  </div>
                  <h3 className="font-semibold text-navy-700 mb-2">2. Instant Analysis</h3>
                  <p className="text-sm text-navy-600">Get immediate civilian career matches with percentage compatibility</p>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="p-3 bg-sage-100 rounded-full mb-3">
                    <TrendingUp className="h-6 w-6 text-sage-600" />
                  </div>
                  <h3 className="font-semibold text-navy-700 mb-2">3. View Opportunities</h3>
                  <p className="text-sm text-navy-600">See job titles, salary ranges, and industry applications</p>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="p-3 bg-warm-gray-100 rounded-full mb-3">
                    <CheckCircle className="h-6 w-6 text-warm-gray-600" />
                  </div>
                  <h3 className="font-semibold text-navy-700 mb-2">4. Take Action</h3>
                  <p className="text-sm text-navy-600">Use insights for job applications and career planning</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Widget */}
          <SkillTranslationWidget onSkillSelect={handleSkillSelect} />

          {/* Benefits Section */}
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-navy-50 to-white border-navy-200">
              <CardHeader>
                <CardTitle className="flex items-center text-navy-700">
                  <Star className="h-6 w-6 mr-3 text-military-gold-500" />
                  Comprehensive Database
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-navy-600 mb-4">
                  Our database covers hundreds of military skills across all branches, 
                  mapped to thousands of civilian career opportunities.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-sage-500 mr-2" />
                    <span className="text-navy-600">All military branches covered</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-sage-500 mr-2" />
                    <span className="text-navy-600">Real industry data</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-sage-500 mr-2" />
                    <span className="text-navy-600">Updated salary ranges</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-military-gold-50 to-white border-military-gold-200">
              <CardHeader>
                <CardTitle className="flex items-center text-navy-700">
                  <TrendingUp className="h-6 w-6 mr-3 text-military-gold-500" />
                  Market Intelligence
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-navy-600 mb-4">
                  Get insights into job market demand, salary expectations, 
                  and growth opportunities in your target industries.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-sage-500 mr-2" />
                    <span className="text-navy-600">Current market trends</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-sage-500 mr-2" />
                    <span className="text-navy-600">Salary benchmarks</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-sage-500 mr-2" />
                    <span className="text-navy-600">Growth projections</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-sage-50 to-white border-sage-200">
              <CardHeader>
                <CardTitle className="flex items-center text-navy-700">
                  <Users className="h-6 w-6 mr-3 text-sage-500" />
                  Veteran Success Stories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-navy-600 mb-4">
                  Learn from thousands of veterans who successfully transitioned 
                  using similar skill translations and career paths.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-sage-500 mr-2" />
                    <span className="text-navy-600">Proven career paths</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-sage-500 mr-2" />
                    <span className="text-navy-600">Success metrics</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-sage-500 mr-2" />
                    <span className="text-navy-600">Transition insights</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}