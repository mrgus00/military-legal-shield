import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Phone, 
  Mail, 
  Globe, 
  MapPin, 
  Star, 
  Shield, 
  Clock, 
  DollarSign,
  Search,
  Filter,
  Users,
  Award,
  Calendar,
  Building,
  Gavel
} from "lucide-react";
import { Link } from "wouter";

interface Attorney {
  id: string;
  firstName: string;
  lastName: string;
  firmName: string;
  title: string;
  specialties: string[];
  location: string;
  state: string;
  city: string;
  region: string;
  attorneyType: string;
  experience: string;
  rating: number;
  reviewCount: number;
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
  pricingTier: string;
  hourlyRate: string;
  availableForEmergency: boolean;
  responseTime: string;
  servicesOffered: string[];
  militaryBranches: string[];
  practiceAreas: string[];
  languages: string[];
  establishedYear: number;
  notableAchievements: string[];
  caseSuccessRate: number;
  totalCasesHandled: number;
}

export default function LawyerDatabase() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [selectedPricing, setSelectedPricing] = useState("");
  const [emergencyOnly, setEmergencyOnly] = useState(false);
  const [sortBy, setSortBy] = useState("rating");

  const { data: attorneys = [], isLoading } = useQuery<Attorney[]>({
    queryKey: ["/api/attorneys"],
  });

  const filteredAndSortedAttorneys = useMemo(() => {
    let filtered = attorneys.filter((attorney) => {
      const matchesSearch = 
        attorney.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        attorney.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        attorney.firmName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        attorney.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        attorney.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
        attorney.practiceAreas.some(p => p.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesState = !selectedState || attorney.state === selectedState;
      const matchesBranch = !selectedBranch || attorney.militaryBranches.includes(selectedBranch);
      const matchesSpecialty = !selectedSpecialty || attorney.specialties.some(s => s.toLowerCase().includes(selectedSpecialty.toLowerCase()));
      const matchesPricing = !selectedPricing || attorney.pricingTier === selectedPricing;
      const matchesEmergency = !emergencyOnly || attorney.availableForEmergency;

      return matchesSearch && matchesState && matchesBranch && matchesSpecialty && matchesPricing && matchesEmergency;
    });

    // Sort attorneys
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating || b.reviewCount - a.reviewCount;
        case "experience":
          return b.totalCasesHandled - a.totalCasesHandled;
        case "success":
          return b.caseSuccessRate - a.caseSuccessRate;
        case "location":
          return a.state.localeCompare(b.state) || a.city.localeCompare(b.city);
        default:
          return 0;
      }
    });

    return filtered;
  }, [attorneys, searchTerm, selectedState, selectedBranch, selectedSpecialty, selectedPricing, emergencyOnly, sortBy]);

  const uniqueStates = Array.from(new Set(attorneys.map(a => a.state))).sort();
  const uniqueBranches = Array.from(new Set(attorneys.flatMap(a => a.militaryBranches))).sort();
  const uniqueSpecialties = Array.from(new Set(attorneys.flatMap(a => a.specialties)));

  const getPricingColor = (tier: string) => {
    switch (tier) {
      case "premium": return "bg-purple-100 text-purple-800";
      case "standard": return "bg-blue-100 text-blue-800";
      case "affordable": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getAttorneyTypeIcon = (type: string) => {
    switch (type) {
      case "dso": return <Shield className="w-4 h-4" />;
      case "civilian": return <Building className="w-4 h-4" />;
      default: return <Gavel className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-navy-900 mb-2">Military Attorney Database</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find experienced military defense attorneys and Defense Service Offices (DSOs) 
              with expertise in your specific legal needs and military branch.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search by name, firm, location, or specialty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 text-lg"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger>
                  <SelectValue placeholder="All States" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All States</SelectItem>
                  {uniqueStates.map((state) => (
                    <SelectItem key={state} value={state}>{state}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                <SelectTrigger>
                  <SelectValue placeholder="All Branches" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Branches</SelectItem>
                  {uniqueBranches.map((branch) => (
                    <SelectItem key={branch} value={branch}>{branch}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                <SelectTrigger>
                  <SelectValue placeholder="All Specialties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Specialties</SelectItem>
                  <SelectItem value="court-martial">Court-Martial Defense</SelectItem>
                  <SelectItem value="administrative">Administrative Proceedings</SelectItem>
                  <SelectItem value="security">Security Clearance</SelectItem>
                  <SelectItem value="appeals">Appeals</SelectItem>
                  <SelectItem value="njp">NJP/Article 15</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedPricing} onValueChange={setSelectedPricing}>
                <SelectTrigger>
                  <SelectValue placeholder="All Pricing" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Pricing</SelectItem>
                  <SelectItem value="affordable">Affordable</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant={emergencyOnly ? "default" : "outline"}
                onClick={() => setEmergencyOnly(!emergencyOnly)}
                className="flex items-center gap-2"
              >
                <Clock className="w-4 h-4" />
                Emergency Available
              </Button>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="experience">Experience</SelectItem>
                  <SelectItem value="success">Success Rate</SelectItem>
                  <SelectItem value="location">Location</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Found {filteredAndSortedAttorneys.length} attorneys
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setSelectedState("");
                setSelectedBranch("");
                setSelectedSpecialty("");
                setSelectedPricing("");
                setEmergencyOnly(false);
                setSortBy("rating");
              }}
            >
              Clear All Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {filteredAndSortedAttorneys.length === 0 ? (
          <div className="text-center py-12">
            <Filter className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No attorneys found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredAndSortedAttorneys.map((attorney) => (
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
                                i < attorney.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                              }`}
                            />
                          ))}
                          <span className="ml-1 text-sm text-gray-600">
                            ({attorney.reviewCount} reviews)
                          </span>
                        </div>
                        <Badge className={getPricingColor(attorney.pricingTier)}>
                          {attorney.pricingTier}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {getAttorneyTypeIcon(attorney.attorneyType)}
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
                            href={`https://${attorney.website}`} 
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
                        <DollarSign className="w-4 h-4 mr-2" />
                        {attorney.hourlyRate}
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-2" />
                        Response: {attorney.responseTime}
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        {attorney.experience}
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <Award className="w-4 h-4 mr-2" />
                        {attorney.caseSuccessRate}% success rate
                      </div>
                    </div>
                  </div>

                  {/* Specialties */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Specialties</h4>
                    <div className="flex flex-wrap gap-1">
                      {attorney.specialties.map((specialty, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Military Branches */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Military Branches</h4>
                    <div className="flex flex-wrap gap-1">
                      {attorney.militaryBranches.map((branch, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {branch}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Notable Achievements */}
                  {attorney.notableAchievements.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Notable Achievements</h4>
                      <p className="text-sm text-gray-600">
                        {attorney.notableAchievements.join(" • ")}
                      </p>
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