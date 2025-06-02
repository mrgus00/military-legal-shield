import Header from "@/components/header";
import Footer from "@/components/footer";
import Hero from "@/components/hero";
import SearchBar from "@/components/search-bar";
import QuickActions from "@/components/quick-actions";
import ResourceCard from "@/components/resource-card";
import AttorneyCard from "@/components/attorney-card";
import EducationModule from "@/components/education-module";
import ContactForm from "@/components/contact-form";
import MilitaryBranchesBanner from "@/components/military-branches-banner";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Crown, Check } from "lucide-react";
import SocialShare, { SharePresets } from "@/components/social-share";
import { useBranch, useBranchTerminology } from "@/contexts/BranchContext";
import { useMood, useMoodDetection } from "@/contexts/MoodContext";
import MoodIndicator from "@/components/mood-indicator";
import MoodAwareCard from "@/components/mood-aware-card";
import GlobalSearch from "@/components/global-search";
import type { LegalResource, Attorney, EducationModule as EducationModuleType } from "@shared/schema";

export default function Home() {
  // Temporarily disable branch context to fix provider issue
  // const { branchConfig, isPersonalized } = useBranch();
  // const terminology = useBranchTerminology();
  const isPersonalized = false;
  const terminology = { serviceMember: "service member", command: "command", unit: "unit" };
  
  // Initialize mood detection for this page
  const { colors, currentMood } = useMood();
  useMoodDetection();
  
  const { data: resources, isLoading: resourcesLoading } = useQuery<LegalResource[]>({
    queryKey: ["/api/resources"],
  });

  const { data: attorneys, isLoading: attorneysLoading } = useQuery<Attorney[]>({
    queryKey: ["/api/attorneys"],
  });

  const { data: educationModules, isLoading: modulesLoading } = useQuery<EducationModuleType[]>({
    queryKey: ["/api/education"],
  });

  const featuredResources = resources?.slice(0, 3) || [];
  const featuredAttorneys = attorneys?.slice(0, 3) || [];
  const featuredModules = educationModules?.slice(0, 2) || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-navy-50 to-white">
      {/* Mood Indicator and Search */}
      <div className="fixed top-4 right-4 z-50 flex items-center space-x-3">
        <GlobalSearch />
        <MoodIndicator />
      </div>
      
      <Header />
      <Hero />
      
      {/* Quick Access Dashboard */}
      <section className="py-16 bg-gradient-to-r from-white to-navy-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-navy-700 mb-4">
              {isPersonalized ? `Your Legal ${terminology.command} Center` : "Your Legal Command Center"}
            </h3>
            <p className="text-lg text-navy-600 max-w-3xl mx-auto">
              Quick access to the most important legal resources and tools for military personnel
            </p>
          </div>

          <div className="max-w-4xl mx-auto mb-12">
            <SearchBar />
          </div>

          <QuickActions />
          
          {/* Share Platform Call-to-Action */}
          <div className="max-w-4xl mx-auto mt-16">
            <div className="bg-gradient-to-r from-military-gold-50 to-sage-50 rounded-2xl p-8 border border-military-gold-200 text-center">
              <h4 className="text-2xl font-bold text-navy-700 mb-3">
                Help Your Fellow Service Members
              </h4>
              <p className="text-navy-600 mb-6 max-w-2xl mx-auto">
                Share MilLegal Defense with your unit, friends, and family. Every service member deserves access to professional legal support when they need it most.
              </p>
              <div className="flex justify-center">
                <SocialShare {...SharePresets.platform()} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Resources */}
      <section className="py-16 bg-gray-50" id="resources">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Featured Legal Resources</h3>
              <p className="text-lg text-gray-600">Most accessed resources by military personnel</p>
            </div>
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

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resourcesLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-fade-in">
                  <Skeleton className="h-6 w-20 mb-4 loading-skeleton" />
                  <Skeleton className="h-6 w-full mb-3 loading-skeleton" />
                  <Skeleton className="h-16 w-full mb-4 loading-skeleton" />
                  <Skeleton className="h-4 w-32 loading-skeleton" />
                </div>
              ))
            ) : (
              featuredResources.map((resource, index) => (
                <div key={resource.id} className={`animate-fade-in stagger-${Math.min(index + 1, 5)}`}>
                  <ResourceCard resource={resource} />
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Attorney Directory */}
      <section className="py-16 bg-white" id="attorneys">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Connect with Military Law Experts</h3>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Experienced attorneys specializing in military law, court-martial defense, and administrative actions
            </p>
          </div>

          <div className="flex flex-wrap gap-4 mb-8 justify-center">
            <Button className="bg-navy-800 text-white hover:bg-navy-900 click-ripple hover-glow transition-smooth">All Specialties</Button>
            <Button variant="outline" className="hover-scale transition-smooth">Court-Martial</Button>
            <Button variant="outline" className="hover-scale transition-smooth">Administrative</Button>
            <Button variant="outline" className="hover-scale transition-smooth">Security Clearance</Button>
            <Button variant="outline" className="hover-scale transition-smooth">Appeals</Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {attorneysLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-6 border border-gray-200 animate-fade-in">
                  <div className="flex items-center mb-4">
                    <Skeleton className="w-16 h-16 rounded-full mr-4 loading-skeleton" />
                    <div>
                      <Skeleton className="h-5 w-32 mb-2 loading-skeleton" />
                      <Skeleton className="h-4 w-24 loading-skeleton" />
                    </div>
                  </div>
                  <Skeleton className="h-16 w-full mb-4 loading-skeleton" />
                  <Skeleton className="h-10 w-full loading-skeleton" />
                </div>
              ))
            ) : (
              featuredAttorneys.map((attorney, index) => (
                <div key={attorney.id} className={`animate-scale-in stagger-${Math.min(index + 1, 5)}`}>
                  <AttorneyCard attorney={attorney} />
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Educational Modules */}
      <section className="py-16 bg-gray-50" id="education">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Know Your Rights: Educational Modules</h3>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Interactive courses designed to help military personnel understand their legal rights and responsibilities
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {modulesLoading ? (
              Array.from({ length: 2 }).map((_, i) => (
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
            ) : (
              featuredModules.map((module) => (
                <EducationModule key={module.id} module={module} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Contact & Support */}
      <section className="py-16 bg-navy-800 text-white" id="support">
        <ContactForm />
      </section>

      <Footer />
    </div>
  );
}
