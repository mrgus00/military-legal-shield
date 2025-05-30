import Header from "@/components/header";
import Footer from "@/components/footer";
import EducationModule from "@/components/education-module";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Check, Filter, GraduationCap, Clock, Users } from "lucide-react";
import { useState } from "react";
import type { EducationModule as EducationModuleType } from "@shared/schema";

export default function Education() {
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [showPremiumOnly, setShowPremiumOnly] = useState<boolean>(false);
  
  const { data: modules, isLoading } = useQuery<EducationModuleType[]>({
    queryKey: ["/api/education"],
  });

  const levels = ["all", "Beginner", "Intermediate", "Advanced"];

  const filteredModules = modules?.filter(module => {
    const matchesLevel = selectedLevel === "all" || module.level === selectedLevel;
    const matchesPremium = !showPremiumOnly || module.isPremium;
    return matchesLevel && matchesPremium;
  }) || [];

  const totalStudents = modules?.reduce((sum, module) => sum + module.studentCount, 0) || 0;
  const freeModules = modules?.filter(module => !module.isPremium).length || 0;
  const premiumModules = modules?.filter(module => module.isPremium).length || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-navy-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Military Law <span className="text-military-gold-400">Education</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Interactive courses and educational modules designed to help military personnel understand their legal rights, responsibilities, and the military justice system.
            </p>
            
            {/* Stats */}
            <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-center justify-center mb-2">
                  <GraduationCap className="w-6 h-6 text-military-gold-400 mr-2" />
                  <span className="text-2xl font-bold">{modules?.length || 0}</span>
                </div>
                <div className="text-sm text-gray-300">Total Courses</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-center justify-center mb-2">
                  <Users className="w-6 h-6 text-military-gold-400 mr-2" />
                  <span className="text-2xl font-bold">{totalStudents.toLocaleString()}</span>
                </div>
                <div className="text-sm text-gray-300">Students Enrolled</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-center justify-center mb-2">
                  <Check className="w-6 h-6 text-emerald-400 mr-2" />
                  <span className="text-2xl font-bold">{freeModules}</span>
                </div>
                <div className="text-sm text-gray-300">Free Courses</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-center justify-center mb-2">
                  <Crown className="w-6 h-6 text-military-gold-400 mr-2" />
                  <span className="text-2xl font-bold">{premiumModules}</span>
                </div>
                <div className="text-sm text-gray-300">Premium Courses</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-navy-800 rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Self-Paced Learning</h3>
              <p className="text-gray-600 text-sm">Learn at your own pace with flexible scheduling that fits your military lifestyle.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-military-gold-500 rounded-lg flex items-center justify-center mb-4">
                <GraduationCap className="w-6 h-6 text-navy-800" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Expert Instruction</h3>
              <p className="text-gray-600 text-sm">Courses developed by experienced military law attorneys and legal experts.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center mb-4">
                <Badge className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Certification</h3>
              <p className="text-gray-600 text-sm">Earn certificates of completion to demonstrate your legal knowledge.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-4 justify-center items-center">
            <div className="flex items-center mr-4">
              <Filter className="w-4 h-4 mr-2 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Filter courses:</span>
            </div>
            
            {levels.map((level) => (
              <Button
                key={level}
                variant={selectedLevel === level ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedLevel(level)}
                className={selectedLevel === level ? "bg-navy-800 hover:bg-navy-900" : ""}
              >
                {level === "all" ? "All Levels" : level}
              </Button>
            ))}
            
            <Button
              variant={showPremiumOnly ? "default" : "outline"}
              size="sm"
              onClick={() => setShowPremiumOnly(!showPremiumOnly)}
              className={showPremiumOnly ? "bg-military-gold-500 hover:bg-military-gold-600 text-navy-800" : ""}
            >
              <Crown className="w-4 h-4 mr-1" />
              Premium Only
            </Button>
          </div>
        </div>
      </section>

      {/* Modules Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {selectedLevel === "all" ? "All Courses" : `${selectedLevel} Courses`}
              {showPremiumOnly && " (Premium)"}
            </h2>
            <div className="flex items-center space-x-2 text-sm">
              <Badge variant="secondary" className="bg-military-gold-100 text-military-gold-800">
                <Crown className="w-3 h-3 mr-1" />
                Premium
              </Badge>
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                <Check className="w-3 h-3 mr-1" />
                Free
              </Badge>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <Skeleton className="w-12 h-12 rounded-lg" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                  <Skeleton className="h-6 w-full mb-3" />
                  <Skeleton className="h-16 w-full mb-4" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))
            ) : filteredModules.length > 0 ? (
              filteredModules.map((module) => (
                <EducationModule key={module.id} module={module} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">No courses found matching your criteria.</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedLevel("all");
                    setShowPremiumOnly(false);
                  }}
                  className="mt-4"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
