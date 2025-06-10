import PageLayout from "@/components/page-layout";
import AttorneyCard from "@/components/attorney-card";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Shield, MapPin, Users } from "lucide-react";
import { useState } from "react";
import type { Attorney } from "@shared/schema";

const militaryBases = [
  { id: 1, name: "Fort Stewart", state: "Georgia", location: "Fort Stewart, GA" },
  { id: 2, name: "Edwards Air Force Base", state: "California", location: "Edwards AFB, CA" },
  { id: 3, name: "Joint Base Lewis-McChord", state: "Washington", location: "Joint Base Lewis-McChord, WA" },
  { id: 4, name: "Eglin Air Force Base", state: "Florida", location: "Eglin AFB, FL" },
  { id: 5, name: "29 Palms Marine Corps Air Ground Combat Center", state: "California", location: "29 Palms, CA" },
  { id: 6, name: "China Lake Naval Air Weapons Station", state: "California", location: "China Lake, CA" },
  { id: 7, name: "Fort Jonathan Wainwright", state: "Alaska", location: "Fort Wainwright, AK" },
  { id: 8, name: "Yuma Proving Ground", state: "Arizona", location: "Yuma, AZ" },
  { id: 9, name: "Fort Bliss", state: "Texas", location: "Fort Bliss, TX" },
  { id: 10, name: "White Sands Missile Range", state: "New Mexico", location: "White Sands, NM" }
];

export default function Attorneys() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedBase, setSelectedBase] = useState<number | null>(null);
  const [showMilitaryBases, setShowMilitaryBases] = useState<boolean>(true);
  
  const { data: attorneys, isLoading } = useQuery<Attorney[]>({
    queryKey: ["/api/attorneys"],
  });

  const filteredAttorneys = attorneys?.filter(attorney => {
    if (searchQuery === "") return true;
    const query = searchQuery.toLowerCase();
    return attorney.firstName.toLowerCase().includes(query) ||
           attorney.lastName.toLowerCase().includes(query) ||
           attorney.location.toLowerCase().includes(query) ||
           attorney.specialties.some(specialty => specialty.toLowerCase().includes(query));
  }) || [];

  return (
    <PageLayout className="bg-white">
      
      {/* Simplified Hero */}
      <section className="bg-navy-900 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Shield className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">
            Find Your Military Attorney
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Connect with experienced military law attorneys
          </p>
          
          {/* Simple Search */}
          <div className="max-w-md mx-auto">
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
        </div>
      </section>

      {/* Top 10 Military Bases Section */}
      {showMilitaryBases && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-navy-900 mb-4">
                Top 10 Largest Military Bases in the United States
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Each military base listed below includes a curated selection of reputable military defense attorneys and law firms. Select a base to view attorneys available in that location.
              </p>
              <Button
                variant="outline"
                onClick={() => setShowMilitaryBases(false)}
                className="mb-8"
              >
                View All Attorneys Instead
              </Button>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {militaryBases.map((base, index) => (
                <Card 
                  key={base.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 ${
                    selectedBase === base.id ? 'ring-2 ring-yellow-400 bg-yellow-50' : 'hover:border-yellow-400'
                  }`}
                  onClick={() => setSelectedBase(base.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-navy-900 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <MapPin className="w-5 h-5 text-gray-400" />
                      </div>
                      <Users className="w-5 h-5 text-yellow-600" />
                    </div>
                    
                    <h3 className="font-semibold text-navy-900 mb-2 text-sm leading-tight">
                      {base.name}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-4">
                      {base.location}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 uppercase tracking-wide">
                        {base.state}
                      </span>
                      <span className="text-xs text-yellow-600 font-medium">
                        View Attorneys →
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {selectedBase && (
              <div className="mt-12 p-8 bg-white rounded-lg border border-yellow-200">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-navy-900 mb-4">
                    Attorneys for {militaryBases.find(b => b.id === selectedBase)?.name}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    You selected {militaryBases.find(b => b.id === selectedBase)?.location}. 
                    Attorney listings for this base will be displayed here once you provide the attorney data.
                  </p>
                  <div className="flex justify-center space-x-4">
                    <Button
                      variant="outline"
                      onClick={() => setSelectedBase(null)}
                    >
                      Back to Base Selection
                    </Button>
                    <Button
                      onClick={() => {
                        setShowMilitaryBases(false);
                        setSelectedBase(null);
                      }}
                    >
                      View All Attorneys
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Clean Attorney Grid */}
      {!showMilitaryBases && (
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <Button
                variant="outline"
                onClick={() => setShowMilitaryBases(true)}
                className="mb-6"
              >
                ← Browse by Military Base
              </Button>
            </div>
            
            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg border p-6">
                    <Skeleton className="h-6 w-3/4 mb-4" />
                    <Skeleton className="h-4 w-1/2 mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-navy-900 mb-2">
                    {filteredAttorneys.length} Available Attorneys
                  </h2>
                  <p className="text-gray-600">
                    Ready to provide expert military legal assistance
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredAttorneys.map((attorney) => (
                    <AttorneyCard key={attorney.id} attorney={attorney} />
                  ))}
                </div>
                
                {filteredAttorneys.length === 0 && (
                  <div className="text-center py-12">
                    <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No attorneys found</h3>
                    <p className="text-gray-600">Try adjusting your search terms</p>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      )}
      
    </PageLayout>
  );
}