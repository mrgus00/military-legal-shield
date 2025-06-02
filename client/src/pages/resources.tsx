import Header from "@/components/header";
import Footer from "@/components/footer";
import ResourceCard from "@/components/resource-card";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Search, BookOpen } from "lucide-react";
import { useState } from "react";
import type { LegalResource } from "@shared/schema";

export default function Resources() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  const { data: resources, isLoading } = useQuery<LegalResource[]>({
    queryKey: ["/api/resources"],
  });

  const filteredResources = resources?.filter(resource => {
    if (searchQuery === "") return true;
    const query = searchQuery.toLowerCase();
    return resource.title.toLowerCase().includes(query) ||
           resource.category.toLowerCase().includes(query) ||
           resource.content.toLowerCase().includes(query);
  }) || [];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Simplified Hero */}
      <section className="bg-navy-900 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <BookOpen className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">
            Legal Resource Library
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Essential military law resources and guides
          </p>
          
          {/* Simple Search */}
          <div className="max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 py-3 text-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Clean Resources Grid */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg border p-6">
                  <Skeleton className="h-6 w-3/4 mb-4" />
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-navy-900 mb-2">
                  {filteredResources.length} Available Resources
                </h2>
                <p className="text-gray-600">
                  Comprehensive military law guides and documentation
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResources.map((resource) => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
              </div>
              
              {filteredResources.length === 0 && (
                <div className="text-center py-12">
                  <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No resources found</h3>
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