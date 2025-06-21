import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Phone, Mail, Star, Clock, Shield, Award, Users } from "lucide-react";

interface Attorney {
  id: number;
  firstName: string;
  lastName: string;
  firmName?: string;
  title: string;
  specialties: string[];
  location: string;
  state: string;
  city: string;
  region?: string;
  attorneyType: string;
  experience: string;
  rating: number;
  reviewCount: number;
  email?: string;
  phone?: string;
  bio?: string;
  pricingTier: string;
  hourlyRate?: string;
  availableForEmergency: boolean;
  responseTime?: string;
  servicesOffered?: string[];
  militaryBranches: string[];
  practiceAreas?: string[];
  languages?: string[];
}

export default function AttorneySearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [emergencyOnly, setEmergencyOnly] = useState(false);

  const { data: attorneys, isLoading } = useQuery<Attorney[]>({
    queryKey: ["/api/attorneys", searchQuery, selectedBranch, selectedRegion, selectedSpecialty, emergencyOnly],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);
      if (selectedBranch) params.append("branch", selectedBranch);
      if (selectedRegion) params.append("region", selectedRegion);
      if (selectedSpecialty) params.append("specialty", selectedSpecialty);
      if (emergencyOnly) params.append("emergency", "true");
      
      const response = await fetch(`/api/attorneys?${params}`);
      return response.json();
    },
  });

  const militaryBranches = ["Army", "Navy", "Air Force", "Marines", "Coast Guard", "Space Force"];
  const regions = ["Atlantic", "Pacific", "Southwest", "Mountain West", "Northeast", "Great Lakes", "Europe", "Asia-Pacific", "Nationwide"];
  const specialties = [
    "Court-martial defense",
    "Military criminal defense", 
    "Veterans disability",
    "Security clearance",
    "Administrative separations",
    "Military sexual assault",
    "Appeals",
    "International military law"
  ];

  const getPricingColor = (tier: string) => {
    switch (tier) {
      case "premium": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "standard": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "affordable": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getAttorneyTypeIcon = (type: string) => {
    switch (type) {
      case "jag": return <Shield className="w-4 h-4" />;
      case "dso": return <Award className="w-4 h-4" />;
      case "civilian": return <Users className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Find Military Defense Attorneys
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input
              placeholder="Search attorneys..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
            
            <Select value={selectedBranch} onValueChange={setSelectedBranch}>
              <SelectTrigger>
                <SelectValue placeholder="Military Branch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Branches</SelectItem>
                {militaryBranches.map((branch) => (
                  <SelectItem key={branch} value={branch}>{branch}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger>
                <SelectValue placeholder="Region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Regions</SelectItem>
                {regions.map((region) => (
                  <SelectItem key={region} value={region}>{region}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
              <SelectTrigger>
                <SelectValue placeholder="Specialty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Specialties</SelectItem>
                {specialties.map((specialty) => (
                  <SelectItem key={specialty} value={specialty}>{specialty}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex gap-4">
            <Button
              variant={emergencyOnly ? "default" : "outline"}
              onClick={() => setEmergencyOnly(!emergencyOnly)}
              className="flex items-center gap-2"
            >
              <Clock className="w-4 h-4" />
              Emergency Available Only
            </Button>
            
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setSelectedBranch("");
                setSelectedRegion("");
                setSelectedSpecialty("");
                setEmergencyOnly(false);
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : attorneys && attorneys.length > 0 ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">
              {attorneys.length} Attorney{attorneys.length !== 1 ? 's' : ''} Found
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {attorneys.map((attorney) => (
              <Card key={attorney.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-lg">
                            {attorney.firstName} {attorney.lastName}
                          </h4>
                          {attorney.firmName && (
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {attorney.firmName}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          {getAttorneyTypeIcon(attorney.attorneyType)}
                          <Badge className={getPricingColor(attorney.pricingTier)}>
                            {attorney.pricingTier}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{attorney.rating}</span>
                          <span className="text-sm text-gray-500">
                            ({attorney.reviewCount} reviews)
                          </span>
                        </div>
                        {attorney.availableForEmergency && (
                          <Badge variant="destructive" className="text-xs">
                            Emergency
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Location and Experience */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <MapPin className="w-4 h-4" />
                        {attorney.location}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {attorney.experience} experience
                      </div>
                      {attorney.responseTime && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Clock className="w-4 h-4" />
                          Response: {attorney.responseTime}
                        </div>
                      )}
                    </div>

                    {/* Specialties */}
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-1">
                        {attorney.specialties.slice(0, 3).map((specialty, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                        {attorney.specialties.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{attorney.specialties.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Military Branches */}
                    <div className="space-y-2">
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Military Branches:
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {attorney.militaryBranches.slice(0, 4).map((branch, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {branch}
                          </Badge>
                        ))}
                        {attorney.militaryBranches.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{attorney.militaryBranches.length - 4} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Bio Preview */}
                    {attorney.bio && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {attorney.bio}
                      </p>
                    )}

                    {/* Contact Information */}
                    <div className="pt-4 border-t space-y-2">
                      {attorney.phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4" />
                          <a href={`tel:${attorney.phone}`} className="text-blue-600 hover:underline">
                            {attorney.phone}
                          </a>
                        </div>
                      )}
                      {attorney.email && (
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-4 h-4" />
                          <a href={`mailto:${attorney.email}`} className="text-blue-600 hover:underline">
                            Contact
                          </a>
                        </div>
                      )}
                      {attorney.hourlyRate && (
                        <div className="text-sm font-medium">
                          Rate: {attorney.hourlyRate}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-4 space-y-2">
                      <Button className="w-full" size="sm">
                        View Full Profile
                      </Button>
                      <Button variant="outline" className="w-full" size="sm">
                        Request Consultation
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <Shield className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">No Attorneys Found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Try adjusting your search criteria or clearing filters.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setSelectedBranch("");
                setSelectedRegion("");
                setSelectedSpecialty("");
                setEmergencyOnly(false);
              }}
            >
              Clear All Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}