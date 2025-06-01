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
import type { LegalResource, Attorney, EducationModule as EducationModuleType } from "@shared/schema";

export default function Home() {
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
      <Header />
      <Hero />
      
      {/* Quick Access Dashboard */}
      <section className="py-16 bg-gradient-to-r from-white to-navy-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-navy-700 mb-4">Your Legal Command Center</h3>
            <p className="text-lg text-navy-600 max-w-3xl mx-auto">
              Quick access to the most important legal resources and tools for military personnel
            </p>
          </div>

          <div className="max-w-4xl mx-auto mb-12">
            <SearchBar />
          </div>

          <QuickActions />
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
                <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <Skeleton className="h-6 w-20 mb-4" />
                  <Skeleton className="h-6 w-full mb-3" />
                  <Skeleton className="h-16 w-full mb-4" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))
            ) : (
              featuredResources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
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
            <Button className="bg-navy-800 text-white hover:bg-navy-900">All Specialties</Button>
            <Button variant="outline">Court-Martial</Button>
            <Button variant="outline">Administrative</Button>
            <Button variant="outline">Security Clearance</Button>
            <Button variant="outline">Appeals</Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {attorneysLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center mb-4">
                    <Skeleton className="w-16 h-16 rounded-full mr-4" />
                    <div>
                      <Skeleton className="h-5 w-32 mb-2" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                  <Skeleton className="h-16 w-full mb-4" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))
            ) : (
              featuredAttorneys.map((attorney) => (
                <AttorneyCard key={attorney.id} attorney={attorney} />
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
