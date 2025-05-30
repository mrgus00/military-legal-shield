import Header from "@/components/header";
import Footer from "@/components/footer";
import SearchBar from "@/components/search-bar";
import ResourceCard from "@/components/resource-card";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Check, Filter } from "lucide-react";
import { useState } from "react";
import type { LegalResource } from "@shared/schema";

export default function Resources() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  const { data: resources, isLoading } = useQuery<LegalResource[]>({
    queryKey: ["/api/resources"],
  });

  const categories = ["all", "UCMJ", "Administrative", "Court-Martial", "Security Clearance"];

  const filteredResources = resources?.filter(resource => 
    selectedCategory === "all" || resource.category === selectedCategory
  ) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-navy-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Legal Resource <span className="text-military-gold-400">Library</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Comprehensive collection of military law resources, guides, and forms to help you understand your rights and navigate legal challenges.
            </p>
            <div className="flex items-center justify-center space-x-2 text-sm">
              <Badge variant="secondary" className="bg-military-gold-100 text-military-gold-800">
                <Crown className="w-3 h-3 mr-1" />
                Premium Content Available
              </Badge>
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                <Check className="w-3 h-3 mr-1" />
                Free Resources
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto mb-8">
            <SearchBar />
          </div>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <div className="flex items-center mr-4">
              <Filter className="w-4 h-4 mr-2 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Filter by category:</span>
            </div>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? "bg-navy-800 hover:bg-navy-900" : ""}
              >
                {category === "all" ? "All Categories" : category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Resources Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {selectedCategory === "all" ? "All Resources" : `${selectedCategory} Resources`}
            </h2>
            <p className="text-gray-600">
              {filteredResources.length} {filteredResources.length === 1 ? "resource" : "resources"} found
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <Skeleton className="h-6 w-20 mb-4" />
                  <Skeleton className="h-6 w-full mb-3" />
                  <Skeleton className="h-16 w-full mb-4" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))
            ) : filteredResources.length > 0 ? (
              filteredResources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">No resources found in this category.</p>
                <Button
                  variant="outline"
                  onClick={() => setSelectedCategory("all")}
                  className="mt-4"
                >
                  View All Resources
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
