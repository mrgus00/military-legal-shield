import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import PageLayout from "@/components/page-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, MapPin, Phone, Mail, Globe, Star, Clock, Shield, Filter, Users } from "lucide-react";
import { motion } from "framer-motion";

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
  website?: string;
  address?: string;
  pricingTier: string;
  hourlyRate?: string;
  availableForEmergency: boolean;
  responseTime?: string;
  servicesOffered?: string[];
  militaryBranches?: string[];
  practiceAreas?: string[];
  languages?: string[];
  establishedYear?: number;
  notableAchievements?: string[];
  caseSuccessRate?: number;
  totalCasesHandled?: number;
}

const states = ["All States", "NC", "FL", "DC", "VA", "CA", "WA", "HI"];
const militaryBranches = ["All Branches", "Army", "Navy", "Air Force", "Marines", "Coast Guard", "Space Force"];
const attorneyTypes = ["All Types", "civilian", "dso", "jag"];
const specialties = [
  "All Specialties", 
  "Court-martial defense", 
  "Military criminal law", 
  "Administrative actions",
  "Security clearance",
  "UCMJ violations",
  "Administrative separation",
  "Appeals"
];

export default function FindAttorneys() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedState, setSelectedState] = useState("All States");
  const [selectedBranch, setSelectedBranch] = useState("All Branches");
  const [selectedType, setSelectedType] = useState("All Types");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All Specialties");
  const [emergencyOnly, setEmergencyOnly] = useState(false);
  const [sortBy, setSortBy] = useState("rating");

  const { data: attorneys = [], isLoading, error } = useQuery({
    queryKey: ["/api/attorneys", {
      search: searchTerm || undefined,
      state: selectedState !== "All States" ? selectedState : undefined,
      militaryBranch: selectedBranch !== "All Branches" ? selectedBranch : undefined,
      attorneyType: selectedType !== "All Types" ? selectedType : undefined,
      specialty: selectedSpecialty !== "All Specialties" ? selectedSpecialty : undefined,
      emergencyOnly: emergencyOnly,
      sortBy: sortBy
    }],
    enabled: true
  });

  const { data: emergencyAttorneys = [] } = useQuery({
    queryKey: ["/api/attorneys/search/emergency"],
    enabled: true
  });

  const getAttorneyTypeLabel = (type: string) => {
    switch (type) {
      case "civilian": return "Civilian Attorney";
      case "dso": return "Defense Service Office";
      case "jag": return "JAG Attorney";
      default: return type;
    }
  };

  const getPricingColor = (tier: string) => {
    switch (tier) {
      case "affordable": return "bg-green-100 text-green-800";
      case "standard": return "bg-blue-100 text-blue-800";
      case "premium": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-1 text-sm text-gray-600">({rating})</span>
      </div>
    );
  };

  const AttorneyCard = ({ attorney }: { attorney: Attorney }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="h-full hover:shadow-lg transition-shadow border-l-4 border-l-blue-600">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg font-bold text-gray-900">
                {attorney.firstName} {attorney.lastName}
              </CardTitle>
              {attorney.firmName && (
                <p className="text-sm text-gray-600 font-medium">{attorney.firmName}</p>
              )}
              <p className="text-sm text-blue-600">{attorney.title}</p>
            </div>
            <div className="text-right">
              {renderStars(attorney.rating)}
              {attorney.reviewCount > 0 && (
                <p className="text-xs text-gray-500">{attorney.reviewCount} reviews</p>
              )}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-3">
            <Badge className={getPricingColor(attorney.pricingTier)}>
              {attorney.pricingTier}
            </Badge>
            <Badge variant="outline">
              {getAttorneyTypeLabel(attorney.attorneyType)}
            </Badge>
            {attorney.availableForEmergency && (
              <Badge className="bg-red-100 text-red-800">
                <Shield className="w-3 h-3 mr-1" />
                Emergency Available
              </Badge>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold text-sm text-gray-900 mb-2">Specialties</h4>
            <div className="flex flex-wrap gap-1">
              {attorney.specialties.slice(0, 3).map((specialty, index) => (
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

          <div className="grid grid-cols-1 gap-2 text-sm">
            <div className="flex items-center text-gray-600">
              <MapPin className="w-4 h-4 mr-2" />
              {attorney.location}
            </div>
            
            {attorney.experience && (
              <div className="flex items-center text-gray-600">
                <Users className="w-4 h-4 mr-2" />
                {attorney.experience} experience
              </div>
            )}
            
            {attorney.responseTime && (
              <div className="flex items-center text-gray-600">
                <Clock className="w-4 h-4 mr-2" />
                Response time: {attorney.responseTime}
              </div>
            )}
            
            {attorney.hourlyRate && (
              <div className="flex items-center text-gray-600">
                <span className="w-4 h-4 mr-2 text-center">$</span>
                {attorney.hourlyRate}
              </div>
            )}
          </div>

          {attorney.militaryBranches && attorney.militaryBranches.length > 0 && (
            <div>
              <h4 className="font-semibold text-sm text-gray-900 mb-2">Military Branches</h4>
              <div className="flex flex-wrap gap-1">
                {attorney.militaryBranches.map((branch, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {branch}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {attorney.notableAchievements && attorney.notableAchievements.length > 0 && (
            <div>
              <h4 className="font-semibold text-sm text-gray-900 mb-2">Notable Achievements</h4>
              <ul className="text-xs text-gray-600 space-y-1">
                {attorney.notableAchievements.slice(0, 2).map((achievement, index) => (
                  <li key={index} className="flex items-start">
                    <span className="w-1 h-1 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    {achievement}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex gap-2 pt-3 border-t">
            {attorney.phone && (
              <Button variant="outline" size="sm" className="flex-1">
                <Phone className="w-4 h-4 mr-1" />
                Call
              </Button>
            )}
            {attorney.email && (
              <Button variant="outline" size="sm" className="flex-1">
                <Mail className="w-4 h-4 mr-1" />
                Email
              </Button>
            )}
            {attorney.website && (
              <Button variant="outline" size="sm" className="flex-1">
                <Globe className="w-4 h-4 mr-1" />
                Website
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Find Military Defense Attorneys</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect with verified military defense attorneys specializing in court-martial defense, 
            administrative actions, and UCMJ violations across all branches of service.
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by attorney name, firm, or specialty..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filters Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Select value={selectedState} onValueChange={setSelectedState}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {states.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {militaryBranches.map((branch) => (
                      <SelectItem key={branch} value={branch}>
                        {branch}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {attorneyTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type === "All Types" ? type : getAttorneyTypeLabel(type)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {specialties.map((specialty) => (
                      <SelectItem key={specialty} value={specialty}>
                        {specialty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Additional Filters */}
              <div className="flex flex-wrap gap-4 items-center">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={emergencyOnly}
                    onChange={(e) => setEmergencyOnly(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm font-medium">Emergency Available Only</span>
                </label>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rating">Sort by Rating</SelectItem>
                    <SelectItem value="experience">Sort by Experience</SelectItem>
                    <SelectItem value="location">Sort by Location</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Tabs */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="all">All Attorneys ({attorneys.length})</TabsTrigger>
            <TabsTrigger value="emergency">Emergency Available ({emergencyAttorneys.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            {isLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {error && (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-red-600">Error loading attorneys. Please try again.</p>
                </CardContent>
              </Card>
            )}

            {!isLoading && !error && attorneys.length === 0 && (
              <Card>
                <CardContent className="p-6 text-center">
                  <Filter className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No attorneys found</h3>
                  <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
                </CardContent>
              </Card>
            )}

            {!isLoading && !error && attorneys.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {attorneys.map((attorney) => (
                  <AttorneyCard key={attorney.id} attorney={attorney} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="emergency" className="space-y-6">
            {emergencyAttorneys.length === 0 && (
              <Card>
                <CardContent className="p-6 text-center">
                  <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No emergency attorneys available</h3>
                  <p className="text-gray-600">Check back later or browse all attorneys.</p>
                </CardContent>
              </Card>
            )}

            {emergencyAttorneys.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {emergencyAttorneys.map((attorney) => (
                  <AttorneyCard key={attorney.id} attorney={attorney} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
}