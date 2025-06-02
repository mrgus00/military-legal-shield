import Header from "@/components/header";
import Footer from "@/components/footer";
import { useState, useEffect } from "react";
import { useMood, useMoodDetection } from "@/contexts/MoodContext";
import MoodIndicator from "@/components/mood-indicator";
import MoodAwareCard from "@/components/mood-aware-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Clock, Users, Star, GraduationCap, Award } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { EducationModule } from "@shared/schema";

export default function Education() {
  const { setMood, colors, detectMoodFromContent } = useMood();
  
  // Set calm mood for educational content
  useEffect(() => {
    setMood("calm");
  }, [setMood]);

  const { data: modules, isLoading } = useQuery<EducationModule[]>({
    queryKey: ["/api/education"],
  });

  const categorizedModules = {
    beginner: modules?.filter(m => m.level === "Beginner") || [],
    intermediate: modules?.filter(m => m.level === "Intermediate") || [],
    advanced: modules?.filter(m => m.level === "Advanced") || []
  };

  const getDifficultyPriority = (level: string) => {
    switch (level) {
      case "Advanced": return "high";
      case "Intermediate": return "normal";
      default: return "low";
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      <Header />
      
      {/* Mood Indicator */}
      <div className="fixed top-4 right-4 z-50">
        <MoodIndicator />
      </div>

      {/* Header */}
      <div className="py-12" style={{ backgroundColor: colors.primary }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <GraduationCap className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">Legal Education Center</h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Comprehensive legal education resources designed specifically for military personnel
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Learning Progress Overview */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6" style={{ color: colors.text }}>
            Your Learning Journey
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <MoodAwareCard priority="normal" title="Courses Completed">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2" style={{ color: colors.primary }}>
                  12
                </div>
                <p className="text-sm opacity-75">Total modules finished</p>
              </div>
            </MoodAwareCard>
            
            <MoodAwareCard priority="normal" title="Current Streak">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2" style={{ color: colors.primary }}>
                  7
                </div>
                <p className="text-sm opacity-75">Days of continuous learning</p>
              </div>
            </MoodAwareCard>
            
            <MoodAwareCard priority="normal" title="Certifications">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2" style={{ color: colors.primary }}>
                  3
                </div>
                <p className="text-sm opacity-75">Professional certifications earned</p>
              </div>
            </MoodAwareCard>
          </div>
        </div>

        {/* Course Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6" style={{ color: colors.text }}>
            Available Courses
          </h2>
          
          <Tabs defaultValue="beginner" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="beginner">Beginner</TabsTrigger>
              <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>
            
            {Object.entries(categorizedModules).map(([level, levelModules]) => (
              <TabsContent key={level} value={level} className="mt-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {isLoading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                      <Card key={i} className="p-6">
                        <div className="animate-pulse">
                          <div className="h-4 bg-gray-200 rounded mb-4"></div>
                          <div className="h-6 bg-gray-200 rounded mb-3"></div>
                          <div className="h-16 bg-gray-200 rounded mb-4"></div>
                          <div className="h-4 bg-gray-200 rounded"></div>
                        </div>
                      </Card>
                    ))
                  ) : (
                    levelModules.map((module) => (
                      <MoodAwareCard 
                        key={module.id} 
                        priority={getDifficultyPriority(module.level)}
                        title={module.title}
                      >
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Badge 
                              variant="outline"
                              style={{ 
                                borderColor: colors.border,
                                color: colors.text 
                              }}
                            >
                              {module.level}
                            </Badge>
                            <div className="flex items-center text-sm opacity-75">
                              <Clock className="w-4 h-4 mr-1" />
                              {module.duration}
                            </div>
                          </div>
                          
                          <p className="text-sm opacity-75 line-clamp-3">
                            {module.description}
                          </p>
                          
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-4 opacity-75">
                              <div className="flex items-center">
                                <Users className="w-4 h-4 mr-1" />
                                {module.studentCount}
                              </div>
                              <div className="flex items-center">
                                <Star className="w-4 h-4 mr-1" />
                                4.8
                              </div>
                            </div>
                            <Button 
                              size="sm"
                              style={{ 
                                backgroundColor: colors.accent,
                                color: "white"
                              }}
                            >
                              Start Learning
                            </Button>
                          </div>
                        </div>
                      </MoodAwareCard>
                    ))
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* Featured Learning Paths */}
        <div>
          <h2 className="text-2xl font-bold mb-6" style={{ color: colors.text }}>
            Recommended Learning Paths
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <MoodAwareCard priority="high" title="Court-Martial Defense Specialist">
              <div className="space-y-4">
                <p className="text-sm opacity-75">
                  Comprehensive training for understanding and defending court-martial proceedings
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">8 modules</Badge>
                    <Badge variant="outline" className="text-xs">40 hours</Badge>
                  </div>
                  <Button 
                    size="sm"
                    style={{ 
                      backgroundColor: colors.primary,
                      color: "white"
                    }}
                  >
                    Start Path
                  </Button>
                </div>
              </div>
            </MoodAwareCard>
            
            <MoodAwareCard priority="normal" title="Military Justice Fundamentals">
              <div className="space-y-4">
                <p className="text-sm opacity-75">
                  Essential knowledge of military justice system and service member rights
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">5 modules</Badge>
                    <Badge variant="outline" className="text-xs">25 hours</Badge>
                  </div>
                  <Button 
                    size="sm"
                    style={{ 
                      backgroundColor: colors.primary,
                      color: "white"
                    }}
                  >
                    Start Path
                  </Button>
                </div>
              </div>
            </MoodAwareCard>
          </div>
        </div>
      </div>
    </div>
  );
}