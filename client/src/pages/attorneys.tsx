import Header from "@/components/header";
import Footer from "@/components/footer";
import AttorneyCard from "@/components/attorney-card";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Search, Shield } from "lucide-react";
import { useState } from "react";
import type { Attorney } from "@shared/schema";

export default function Attorneys() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  
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
    <div className="min-h-screen bg-white">
      <Header />
      
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

      {/* Clean Attorney Grid */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
      
      <Footer />
    </div>
  );
}