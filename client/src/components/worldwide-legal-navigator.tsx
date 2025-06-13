import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Search, MapPin, Globe, Clock, Phone, Mail, AlertTriangle, Users, Scale, Shield, MessageSquare, ArrowRight, Languages, ExternalLink } from "lucide-react";

interface LegalOffice {
  id: string;
  name: string;
  type: "JAG" | "Legal Assistance" | "Trial Defense Service" | "Area Defense Counsel" | "Embassy Legal";
  location: {
    base: string;
    city: string;
    country: string;
    region: string;
    timeZone: string;
  };
  contact: {
    phone: string;
    emergency: string;
    email: string;
    address: string;
  };
  services: string[];
  languages: string[];
  availability: {
    hours: string;
    emergency: boolean;
    appointmentRequired: boolean;
  };
  specialties: string[];
  jurisdiction: string[];
}

const worldwideLegalOffices: LegalOffice[] = [
  {
    id: "ramstein-jag",
    name: "Ramstein Air Base Legal Office",
    type: "JAG",
    location: {
      base: "Ramstein Air Base",
      city: "Ramstein-Miesenbach",
      country: "Germany",
      region: "Europe",
      timeZone: "CET (UTC+1)"
    },
    contact: {
      phone: "+49-6371-47-5889",
      emergency: "+49-6371-47-7777",
      email: "86aw.ja@us.af.mil",
      address: "Bldg 2120, Ramstein Air Base, Germany"
    },
    services: ["Legal Assistance", "Administrative Law", "Contract Law", "Estate Planning", "Family Law"],
    languages: ["English", "German"],
    availability: {
      hours: "Mon-Fri 0800-1630 CET",
      emergency: true,
      appointmentRequired: true
    },
    specialties: ["SOFA Issues", "German Law Interface", "International Agreements"],
    jurisdiction: ["U.S. Air Force Europe", "SOFA Germany"]
  },
  {
    id: "yokota-tds",
    name: "Yokota Air Base Trial Defense Service",
    type: "Trial Defense Service",
    location: {
      base: "Yokota Air Base",
      city: "Fussa",
      country: "Japan",
      region: "Pacific",
      timeZone: "JST (UTC+9)"
    },
    contact: {
      phone: "+81-42-552-2510",
      emergency: "+81-42-552-2510",
      email: "yokota.tds@us.af.mil",
      address: "Bldg 1075, Yokota Air Base, Japan"
    },
    services: ["Court-Martial Defense", "Article 15 Representation", "Administrative Actions", "Security Clearance"],
    languages: ["English", "Japanese"],
    availability: {
      hours: "24/7 Emergency, Mon-Fri 0800-1700 JST",
      emergency: true,
      appointmentRequired: false
    },
    specialties: ["SOFA Japan", "Criminal Defense", "Security Clearance Appeals"],
    jurisdiction: ["U.S. Forces Japan", "SOFA Japan"]
  },
  {
    id: "seoul-adc",
    name: "Yongsan Area Defense Counsel",
    type: "Area Defense Counsel",
    location: {
      base: "Camp Humphreys",
      city: "Pyeongtaek",
      country: "South Korea",
      region: "Pacific",
      timeZone: "KST (UTC+9)"
    },
    contact: {
      phone: "+82-31-690-7801",
      emergency: "+82-31-690-7801",
      email: "usag.humphreys.adc@army.mil",
      address: "Bldg 6400, Camp Humphreys, South Korea"
    },
    services: ["Court-Martial Defense", "Article 15 Consultation", "Administrative Separations", "SHARP Cases"],
    languages: ["English", "Korean"],
    availability: {
      hours: "24/7 Emergency, Mon-Fri 0900-1800 KST",
      emergency: true,
      appointmentRequired: false
    },
    specialties: ["SOFA Korea", "SHARP Defense", "Administrative Law"],
    jurisdiction: ["U.S. Forces Korea", "SOFA Korea"]
  },
  {
    id: "naples-jag",
    name: "Naval Support Activity Naples Legal Office",
    type: "JAG",
    location: {
      base: "NSA Naples",
      city: "Naples",
      country: "Italy",
      region: "Europe",
      timeZone: "CET (UTC+1)"
    },
    contact: {
      phone: "+39-081-568-4731",
      emergency: "+39-081-568-4444",
      email: "naples.legal@navy.mil",
      address: "Bldg 402, NSA Naples, Italy"
    },
    services: ["Legal Assistance", "Notary Services", "Family Law", "Estate Planning", "Contract Review"],
    languages: ["English", "Italian"],
    availability: {
      hours: "Mon-Fri 0800-1600 CET",
      emergency: true,
      appointmentRequired: true
    },
    specialties: ["SOFA Italy", "Mediterranean Operations", "International Law"],
    jurisdiction: ["U.S. Naval Forces Europe", "SOFA Italy"]
  },
  {
    id: "embassy-london",
    name: "U.S. Embassy London Legal Attaché",
    type: "Embassy Legal",
    location: {
      base: "U.S. Embassy",
      city: "London",
      country: "United Kingdom",
      region: "Europe",
      timeZone: "GMT (UTC+0)"
    },
    contact: {
      phone: "+44-20-7499-9000",
      emergency: "+44-20-7499-9000",
      email: "londonlegal@state.gov",
      address: "33 Nine Elms Lane, London SW11 7US, UK"
    },
    services: ["Consular Services", "Legal Liaison", "Arrest Assistance", "Court Observation"],
    languages: ["English"],
    availability: {
      hours: "Mon-Fri 0900-1700 GMT, Emergency 24/7",
      emergency: true,
      appointmentRequired: true
    },
    specialties: ["UK Legal System", "Consular Affairs", "Criminal Assistance"],
    jurisdiction: ["UK Jurisdiction", "Consular Services"]
  },
  {
    id: "djibouti-legal",
    name: "Camp Lemonnier Legal Office",
    type: "Legal Assistance",
    location: {
      base: "Camp Lemonnier",
      city: "Djibouti",
      country: "Djibouti",
      region: "Africa",
      timeZone: "EAT (UTC+3)"
    },
    contact: {
      phone: "+253-21-35-4000",
      emergency: "+253-21-35-4000",
      email: "cldj.legal@navy.mil",
      address: "Camp Lemonnier, Djibouti"
    },
    services: ["Legal Assistance", "Powers of Attorney", "Wills", "Emergency Legal Support"],
    languages: ["English", "French", "Arabic"],
    availability: {
      hours: "Mon-Fri 0800-1700 EAT",
      emergency: true,
      appointmentRequired: true
    },
    specialties: ["Horn of Africa Operations", "Emergency Legal Services", "Multi-national Coordination"],
    jurisdiction: ["CJTF-HOA", "Djibouti SOFA"]
  }
];

const regions = ["All Regions", "Europe", "Pacific", "Africa", "Middle East", "Americas"];
const serviceTypes = ["All Services", "JAG", "Legal Assistance", "Trial Defense Service", "Area Defense Counsel", "Embassy Legal"];

export default function WorldwideLegalNavigator() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("All Regions");
  const [selectedService, setSelectedService] = useState("All Services");
  const [emergencyOnly, setEmergencyOnly] = useState(false);

  const filteredOffices = worldwideLegalOffices
    .filter(office => {
      const matchesSearch = office.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           office.location.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           office.location.base.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           office.services.some(service => service.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesRegion = selectedRegion === "All Regions" || office.location.region === selectedRegion;
      const matchesService = selectedService === "All Services" || office.type === selectedService;
      const matchesEmergency = !emergencyOnly || office.availability.emergency;
      return matchesSearch && matchesRegion && matchesService && matchesEmergency;
    });

  const getServiceTypeColor = (type: string) => {
    switch (type) {
      case "JAG": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "Trial Defense Service": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "Area Defense Counsel": return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case "Legal Assistance": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Embassy Legal": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getCurrentTime = (timeZone: string) => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { 
      timeZone: timeZone.split(' ')[0], 
      hour12: true,
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <Globe className="h-8 w-8 text-blue-600" />
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Worldwide Legal Navigator
          </h2>
        </div>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Find military legal offices, JAG services, and defense attorneys worldwide. 
          24/7 emergency support available at major installations globally.
        </p>
      </div>

      {/* Emergency Banner */}
      <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <div>
              <h3 className="font-semibold text-red-800 dark:text-red-200">Emergency Legal Assistance</h3>
              <p className="text-sm text-red-700 dark:text-red-300">
                If you're facing arrest, detention, or immediate legal crisis overseas, contact your local emergency number 
                and request contact with U.S. Embassy/Consulate immediately.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by location, base, country, or service type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Region</label>
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-800"
                >
                  {regions.map(region => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Service Type</label>
                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-800"
                >
                  {serviceTypes.map(service => (
                    <option key={service} value={service}>{service}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="emergency"
                  checked={emergencyOnly}
                  onChange={(e) => setEmergencyOnly(e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="emergency" className="text-sm font-medium">
                  Emergency Services Only
                </label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Showing {filteredOffices.length} legal offices worldwide
        </p>
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-blue-600" />
          <span className="text-sm text-gray-600 dark:text-gray-300">
            Times shown in local timezone
          </span>
        </div>
      </div>

      {/* Legal Offices Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredOffices.map((office) => (
          <Card key={office.id} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <Badge className={`text-xs ${getServiceTypeColor(office.type)}`}>
                    {office.type}
                  </Badge>
                  <CardTitle className="text-lg leading-tight">
                    {office.name}
                  </CardTitle>
                </div>
                {office.availability.emergency && (
                  <Badge variant="destructive" className="text-xs">
                    24/7 Emergency
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                <MapPin className="h-4 w-4" />
                <span>{office.location.base}, {office.location.city}, {office.location.country}</span>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Contact Information */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Contact Information</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center space-x-2">
                    <Phone className="h-3 w-3" />
                    <span>{office.contact.phone}</span>
                  </div>
                  {office.contact.emergency !== office.contact.phone && (
                    <div className="flex items-center space-x-2 text-red-600">
                      <AlertTriangle className="h-3 w-3" />
                      <span>Emergency: {office.contact.emergency}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <Mail className="h-3 w-3" />
                    <span className="break-all">{office.contact.email}</span>
                  </div>
                </div>
              </div>

              {/* Services */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Services Offered</h4>
                <div className="flex flex-wrap gap-1">
                  {office.services.map(service => (
                    <Badge key={service} variant="outline" className="text-xs">
                      {service}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Availability</h4>
                <div className="text-sm space-y-1">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-3 w-3" />
                    <span>{office.availability.hours}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Globe className="h-3 w-3" />
                    <span>Current time: {getCurrentTime(office.location.timeZone)} ({office.location.timeZone})</span>
                  </div>
                  {office.availability.appointmentRequired && (
                    <p className="text-xs text-yellow-700 dark:text-yellow-300">
                      Appointment required for non-emergency services
                    </p>
                  )}
                </div>
              </div>

              {/* Languages */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Languages</h4>
                <div className="flex items-center space-x-2">
                  <Languages className="h-3 w-3" />
                  <div className="flex flex-wrap gap-1">
                    {office.languages.map(language => (
                      <Badge key={language} variant="secondary" className="text-xs">
                        {language}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Specialties */}
              {office.specialties.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Specialties</h4>
                  <div className="flex flex-wrap gap-1">
                    {office.specialties.map(specialty => (
                      <Badge key={specialty} variant="outline" className="text-xs bg-blue-50 text-blue-700">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <Button size="sm" className="flex-1">
                  <Phone className="mr-2 h-3 w-3" />
                  Call Now
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Mail className="mr-2 h-3 w-3" />
                  Send Email
                </Button>
                <Button variant="outline" size="sm">
                  <ExternalLink className="mr-2 h-3 w-3" />
                  Directions
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional Resources */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <h3 className="text-xl font-semibold">Additional Legal Resources</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Can't find a nearby office? Access online legal assistance and emergency support
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Button className="bg-green-600 hover:bg-green-700">
                <MessageSquare className="mr-2 h-4 w-4" />
                SGT Legal Ready Chat
              </Button>
              <Button variant="outline">
                <Scale className="mr-2 h-4 w-4" />
                Virtual Legal Consultation
              </Button>
              <Button variant="outline">
                <Globe className="mr-2 h-4 w-4" />
                Embassy Locator
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}