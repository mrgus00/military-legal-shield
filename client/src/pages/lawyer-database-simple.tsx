import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Phone, Mail, Globe, MapPin, Star, Search, Users } from "lucide-react";
import { Link } from "wouter";

export default function LawyerDatabase() {
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: attorneys = [], isLoading, error } = useQuery<any[]>({
    queryKey: ["/api/attorneys"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading Attorneys</h2>
          <p className="text-gray-600">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  const filteredAttorneys = Array.isArray(attorneys) 
    ? attorneys.filter((attorney: any) => {
        if (!searchTerm) return true;
        const search = searchTerm.toLowerCase();
        return (
          attorney.firstName?.toLowerCase().includes(search) ||
          attorney.lastName?.toLowerCase().includes(search) ||
          attorney.firmName?.toLowerCase().includes(search) ||
          attorney.location?.toLowerCase().includes(search) ||
          attorney.state?.toLowerCase().includes(search)
        );
      })
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-navy-900 mb-2">Military Attorney Database</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find experienced military defense attorneys and Defense Service Offices with expertise in your legal needs.
            </p>
          </div>

          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search by name, firm, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12"
            />
          </div>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Found {filteredAttorneys.length} attorneys
            </p>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {filteredAttorneys.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No attorneys found</h3>
            <p className="text-gray-600">Try adjusting your search term.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredAttorneys.map((attorney: any) => (
              <Card key={attorney.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-orange-500">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-xl text-navy-900 mb-1">
                        {attorney.firstName} {attorney.lastName}
                      </CardTitle>
                      <p className="text-lg font-medium text-orange-600 mb-2">{attorney.firmName}</p>
                      <p className="text-sm text-gray-600 mb-3">{attorney.title}</p>
                      
                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < (attorney.rating || 0) ? "text-yellow-400 fill-current" : "text-gray-300"
                              }`}
                            />
                          ))}
                          <span className="ml-1 text-sm text-gray-600">
                            ({attorney.reviewCount || 0} reviews)
                          </span>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800">
                          {attorney.pricingTier || 'Standard'}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {attorney.availableForEmergency && (
                        <Badge variant="destructive" className="text-xs">
                          Emergency
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Location and Contact */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        {attorney.location}
                      </div>
                      
                      {attorney.phone && (
                        <div className="flex items-center text-sm">
                          <Phone className="w-4 h-4 mr-2 text-green-600" />
                          <a 
                            href={`tel:${attorney.phone}`} 
                            className="text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {attorney.phone}
                          </a>
                        </div>
                      )}
                      
                      {attorney.email && (
                        <div className="flex items-center text-sm">
                          <Mail className="w-4 h-4 mr-2 text-blue-600" />
                          <a 
                            href={`mailto:${attorney.email}`} 
                            className="text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {attorney.email}
                          </a>
                        </div>
                      )}
                      
                      {attorney.website && (
                        <div className="flex items-center text-sm">
                          <Globe className="w-4 h-4 mr-2 text-purple-600" />
                          <a 
                            href={attorney.website.startsWith('http') ? attorney.website : `https://${attorney.website}`}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {attorney.website}
                          </a>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="font-medium">Rate:</span>
                        <span className="ml-1">{attorney.hourlyRate || 'Contact for pricing'}</span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="font-medium">Response:</span>
                        <span className="ml-1">{attorney.responseTime || 'Standard'}</span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="font-medium">Experience:</span>
                        <span className="ml-1">{attorney.experience || 'Experienced'}</span>
                      </div>
                      
                      {attorney.caseSuccessRate && (
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="font-medium">Success Rate:</span>
                          <span className="ml-1">{attorney.caseSuccessRate}%</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Specialties */}
                  {attorney.specialties && attorney.specialties.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Specialties</h4>
                      <div className="flex flex-wrap gap-1">
                        {attorney.specialties.slice(0, 3).map((specialty: string, index: number) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                        {attorney.specialties.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{attorney.specialties.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Military Branches */}
                  {attorney.militaryBranches && attorney.militaryBranches.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Military Branches</h4>
                      <div className="flex flex-wrap gap-1">
                        {attorney.militaryBranches.slice(0, 3).map((branch: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {branch}
                          </Badge>
                        ))}
                        {attorney.militaryBranches.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{attorney.militaryBranches.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-4 border-t">
                    <Link href={`/consultation-booking?attorney=${attorney.id}`}>
                      <Button className="flex-1 bg-orange-600 hover:bg-orange-700">
                        Schedule Consultation
                      </Button>
                    </Link>
                    
                    {attorney.availableForEmergency && (
                      <Link href={`/emergency-consultation?attorney=${attorney.id}`}>
                        <Button variant="destructive" className="flex-1">
                          Emergency Contact
                        </Button>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Call to Action */}
      <div className="bg-navy-900 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Need Help Choosing the Right Attorney?</h2>
          <p className="text-lg text-gray-300 mb-6">
            Our legal team can help match you with the perfect attorney for your specific situation and needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/consultation-booking">
              <Button size="lg" className="bg-orange-600 hover:bg-orange-700">
                Get Attorney Matching Service
              </Button>
            </Link>
            <Link href="/emergency-consultation">
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-navy-900">
                24/7 Emergency Legal Help
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}