import Header from "@/components/header";
import Footer from "@/components/footer";
import AttorneyCard from "@/components/attorney-card";
import PremiumGate from "@/components/premium-gate";
import SecurityReminder from "@/components/security-reminder";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter, Search, Crown } from "lucide-react";
import { useState } from "react";
import type { Attorney } from "@shared/schema";
import SocialShare, { SharePresets } from "@/components/social-share";

export default function Attorneys() {
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  // For demo purposes, simulating free tier user
  const userTier = "free"; // In production, this would come from auth context
  
  const { data: attorneys, isLoading } = useQuery<Attorney[]>({
    queryKey: ["/api/attorneys"],
  });

  const specialties = ["all", "Court-Martial Defense", "Administrative Law", "Security Clearance", "Appeals"];

  const filteredAttorneys = attorneys?.filter(attorney => {
    const matchesSpecialty = selectedSpecialty === "all" || 
      attorney.specialties.includes(selectedSpecialty);
    const matchesSearch = searchQuery === "" ||
      attorney.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      attorney.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      attorney.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      attorney.specialties.some(specialty => 
        specialty.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesSpecialty && matchesSearch;
  }) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-navy-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Military Law <span className="text-military-gold-400">Attorneys</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Connect with experienced military law attorneys who understand the unique challenges faced by service members and their families.
            </p>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 max-w-2xl mx-auto">
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-military-gold-400">24/7</div>
                  <div className="text-sm text-gray-300">Support Available</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-military-gold-400">100+</div>
                  <div className="text-sm text-gray-300">Qualified Attorneys</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-military-gold-400">98%</div>
                  <div className="text-sm text-gray-300">Client Satisfaction</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security Reminder */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SecurityReminder />
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search by name, location, or specialty..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 py-3 text-lg"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <div className="flex items-center mr-4">
              <Filter className="w-4 h-4 mr-2 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Filter by specialty:</span>
            </div>
            {specialties.map((specialty) => (
              <Button
                key={specialty}
                variant={selectedSpecialty === specialty ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedSpecialty(specialty)}
                className={selectedSpecialty === specialty ? "bg-navy-800 hover:bg-navy-900" : ""}
              >
                {specialty === "all" ? "All Specialties" : specialty}
              </Button>
            ))}
          </div>
          
          {/* Premium Advanced Filters */}
          <div className="mt-8">
            <div className="flex items-center gap-2 mb-4">
              <Crown className="h-5 w-5 text-amber-500" />
              <h3 className="text-lg font-semibold">Advanced Filters</h3>
            </div>
            
            <PremiumGate
              feature="Advanced Filtering"
              description="Get precise attorney matches with budget ranges, response time guarantees, and availability filters."
              userTier={userTier}
            >
              <div className="grid md:grid-cols-4 gap-4 p-6 bg-white rounded-lg border">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Budget Range
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option>Any budget</option>
                    <option>$100-$300/hour</option>
                    <option>$300-$500/hour</option>
                    <option>$500+/hour</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Response Time
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option>Any time</option>
                    <option>Within 2 hours</option>
                    <option>Within 24 hours</option>
                    <option>Within 48 hours</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experience Level
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option>Any experience</option>
                    <option>5+ years</option>
                    <option>10+ years</option>
                    <option>15+ years</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Availability
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option>Any availability</option>
                    <option>Emergency only</option>
                    <option>Same day</option>
                    <option>This week</option>
                  </select>
                </div>
              </div>
            </PremiumGate>
          </div>
        </div>
      </section>

      {/* Attorneys Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {selectedSpecialty === "all" ? "All Attorneys" : `${selectedSpecialty} Specialists`}
            </h2>
            <p className="text-gray-600">
              {filteredAttorneys.length} {filteredAttorneys.length === 1 ? "attorney" : "attorneys"} found
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
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
            ) : filteredAttorneys.length > 0 ? (
              filteredAttorneys.map((attorney) => (
                <AttorneyCard key={attorney.id} attorney={attorney} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">No attorneys found matching your criteria.</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedSpecialty("all");
                    setSearchQuery("");
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
