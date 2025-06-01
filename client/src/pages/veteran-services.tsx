import Header from "@/components/header";
import Footer from "@/components/footer";
import SecurityReminder from "@/components/security-reminder";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Flag, 
  Star, 
  Shield, 
  Heart, 
  Home, 
  Briefcase, 
  GraduationCap, 
  UserCheck,
  Phone,
  Calendar,
  FileText,
  Award,
  Users,
  MapPin,
  Clock,
  DollarSign,
  Scale
} from "lucide-react";
import { useState } from "react";

export default function VeteranServices() {
  const [selectedBranch, setSelectedBranch] = useState<string>("all");

  const transitionServices = [
    {
      title: "Social Security Benefits for 100% Disabled Veterans",
      icon: DollarSign,
      urgency: "high",
      description: "Specialized representation for Social Security Disability claims for 100% disabled veterans",
      services: [
        "SSDI claims for 100% disabled veterans",
        "SSI supplemental income assistance",
        "Appeals for denied SS claims",
        "Expedited processing for disabled veterans",
        "Coordination with VA disability benefits"
      ],
      timeframe: "3-12 months",
      priority: "Critical - specialized legal expertise required"
    },
    {
      title: "VA Benefits & Disability Claims",
      icon: Shield,
      urgency: "high",
      description: "Navigate VA disability ratings, appeals, and benefit optimization",
      services: [
        "Disability rating appeals",
        "Benefits calculation review", 
        "Medical evidence gathering",
        "C&P exam preparation"
      ],
      timeframe: "2-18 months",
      priority: "Critical for financial security"
    },
    {
      title: "Employment & Career Transition",
      icon: Briefcase,
      urgency: "medium",
      description: "Translate military skills to civilian careers and job placement",
      services: [
        "Resume translation (MOS to civilian)",
        "Interview skills coaching",
        "Security clearance job matching",
        "Veteran hiring preferences"
      ],
      timeframe: "3-6 months",
      priority: "Essential for career stability"
    },
    {
      title: "Housing & Homelessness Prevention",
      icon: Home,
      urgency: "high",
      description: "Secure stable housing and prevent veteran homelessness",
      services: [
        "VA home loan assistance",
        "Emergency housing support",
        "Rental assistance programs",
        "Foreclosure prevention"
      ],
      timeframe: "Immediate - 90 days",
      priority: "Critical basic need"
    },
    {
      title: "Personal Injury & Accident Claims",
      icon: Heart,
      urgency: "high",
      description: "Veteran-focused personal injury representation for accidents and negligence claims",
      services: [
        "Motor vehicle accidents",
        "Workplace injury claims",
        "Medical malpractice",
        "VA medical facility negligence",
        "Service-connected injury claims"
      ],
      timeframe: "6 months - 3 years",
      priority: "Critical for compensation and medical care"
    },
    {
      title: "Estate Planning & Trusts",
      icon: FileText,
      urgency: "medium",
      description: "Protect your family with veteran-specific estate planning and asset protection",
      services: [
        "Wills for disabled veterans",
        "Special needs trusts",
        "VA benefits preservation trusts",
        "Power of attorney documents",
        "Beneficiary designations optimization"
      ],
      timeframe: "1-3 months",
      priority: "Essential for family protection"
    },
    {
      title: "Education Benefits (GI Bill)",
      icon: GraduationCap,
      urgency: "medium",
      description: "Maximize education benefits and career training opportunities",
      services: [
        "GI Bill optimization strategy",
        "School selection guidance",
        "Vocational rehabilitation",
        "Dependents education transfer"
      ],
      timeframe: "6 months - 4 years",
      priority: "Long-term career investment"
    }
  ];

  const veteranResources = [
    {
      category: "Specialized Legal Services",
      color: "military-gold",
      resources: [
        { name: "Social Security Disability Attorneys", contact: "Veteran-specialized firms", available: "M-F consultation" },
        { name: "Personal Injury for Veterans", contact: "Veteran accident lawyers", available: "24/7 emergency" },
        { name: "Estate Planning for Disabled Veterans", contact: "Trust & will specialists", available: "By appointment" }
      ]
    },
    {
      category: "Immediate Support",
      color: "red",
      resources: [
        { name: "Veterans Crisis Line", contact: "1-800-273-8255", available: "24/7" },
        { name: "Homeless Veterans Hotline", contact: "1-877-424-3838", available: "24/7" },
        { name: "Emergency Financial Aid", contact: "Contact local VSO", available: "Business hours" }
      ]
    },
    {
      category: "Benefits & Claims",
      color: "navy",
      resources: [
        { name: "VA Regional Office", contact: "va.gov/find-locations", available: "M-F 8-4:30" },
        { name: "Veterans Service Officer", contact: "Contact local VFW/DAV", available: "By appointment" },
        { name: "Benefits Hotline", contact: "1-800-827-1000", available: "M-F 8-8 EST" }
      ]
    },
    {
      category: "Healthcare",
      color: "sage",
      resources: [
        { name: "VA Medical Center", contact: "va.gov/find-locations", available: "24/7 emergency" },
        { name: "Vet Centers (PTSD)", contact: "1-877-927-8387", available: "M-F business hours" },
        { name: "Mental Health Services", contact: "Contact VA facility", available: "Appointment based" }
      ]
    }
  ];

  const branchSpecificInfo = {
    army: {
      name: "Army Veterans",
      color: "military-gold",
      specializations: ["Combat MOS transition", "Leadership skills translation", "Large unit experience"],
      commonIssues: ["PTSD from deployment", "TBI/concussion claims", "Hearing loss claims"]
    },
    navy: {
      name: "Navy Veterans", 
      color: "navy",
      specializations: ["Technical ratings", "Nuclear experience", "Maritime logistics"],
      commonIssues: ["Asbestos exposure", "Hearing loss", "Shipboard injury claims"]
    },
    airforce: {
      name: "Air Force Veterans",
      color: "sage",
      specializations: ["Aerospace technology", "Cybersecurity", "Precision maintenance"],
      commonIssues: ["Respiratory conditions", "Radar/electronics exposure", "Deployment stress"]
    },
    marines: {
      name: "Marine Veterans",
      color: "red",
      specializations: ["Combat leadership", "Rapid deployment", "Elite training"],
      commonIssues: ["Combat PTSD", "Joint/orthopedic injuries", "TBI claims"]
    },
    coastguard: {
      name: "Coast Guard Veterans",
      color: "warm-gray",
      specializations: ["Maritime law enforcement", "Search & rescue", "Port security"],
      commonIssues: ["Hazardous duty exposure", "Maritime injuries", "Law enforcement stress"]
    },
    spaceforce: {
      name: "Space Force Veterans",
      color: "military-gold",
      specializations: ["Satellite operations", "Cybersecurity", "Advanced technology"],
      commonIssues: ["New branch transitions", "Technology transfer", "Career pathway guidance"]
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high": return "border-red-200 bg-red-50";
      case "medium": return "border-military-gold-200 bg-military-gold-50";
      case "low": return "border-sage-200 bg-sage-50";
      default: return "border-gray-200 bg-gray-50";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-navy-50 via-white to-sage-50">
      <Header />
      
      <main className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gradient-to-r from-military-gold-100 to-navy-100 rounded-full">
                <Flag className="h-12 w-12 text-navy-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-navy-700 mb-4">
              Veteran Services & Transition Support
            </h1>
            <p className="text-xl text-navy-600 max-w-3xl mx-auto mb-8">
              Comprehensive support for veterans transitioning to civilian life. Navigate benefits, 
              employment, housing, and legal challenges with experienced veteran advocates.
            </p>
            <div className="flex justify-center space-x-4">
              <Badge className="bg-military-gold-100 text-military-gold-800 px-4 py-2">
                <Star className="h-4 w-4 mr-1" />
                Veteran-Owned & Operated
              </Badge>
              <Badge className="bg-navy-100 text-navy-800 px-4 py-2">
                <Shield className="h-4 w-4 mr-1" />
                All Branches Welcome
              </Badge>
            </div>
          </div>

          {/* Security Reminder */}
          <SecurityReminder />

          {/* Branch Selection */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-navy-700 text-center mb-6">Select Your Branch</h2>
            <div className="flex flex-wrap justify-center gap-3">
              <Button
                variant={selectedBranch === "all" ? "default" : "outline"}
                onClick={() => setSelectedBranch("all")}
                className="flex items-center"
              >
                <Flag className="h-4 w-4 mr-2" />
                All Branches
              </Button>
              {Object.entries(branchSpecificInfo).map(([key, branch]) => (
                <Button
                  key={key}
                  variant={selectedBranch === key ? "default" : "outline"}
                  onClick={() => setSelectedBranch(key)}
                  className={`flex items-center ${selectedBranch === key ? `bg-${branch.color}-600` : ''}`}
                >
                  {branch.name}
                </Button>
              ))}
            </div>
          </section>

          {/* Branch-Specific Info */}
          {selectedBranch !== "all" && branchSpecificInfo[selectedBranch as keyof typeof branchSpecificInfo] && (
            <section className="mb-12">
              <Card className={`bg-gradient-to-r from-${branchSpecificInfo[selectedBranch as keyof typeof branchSpecificInfo].color}-50 to-white border-${branchSpecificInfo[selectedBranch as keyof typeof branchSpecificInfo].color}-200`}>
                <CardHeader>
                  <CardTitle className="text-navy-700">
                    {branchSpecificInfo[selectedBranch as keyof typeof branchSpecificInfo].name} - Specialized Support
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-navy-700 mb-3">Skill Specializations:</h4>
                    <ul className="space-y-2">
                      {branchSpecificInfo[selectedBranch as keyof typeof branchSpecificInfo].specializations.map((spec, index) => (
                        <li key={index} className="flex items-center text-navy-600">
                          <Star className="h-4 w-4 text-military-gold-500 mr-2" />
                          {spec}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-navy-700 mb-3">Common Legal Issues:</h4>
                    <ul className="space-y-2">
                      {branchSpecificInfo[selectedBranch as keyof typeof branchSpecificInfo].commonIssues.map((issue, index) => (
                        <li key={index} className="flex items-center text-navy-600">
                          <Shield className="h-4 w-4 text-sage-500 mr-2" />
                          {issue}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </section>
          )}

          {/* Main Content Tabs */}
          <Tabs defaultValue="transition" className="space-y-8">
            <div className="flex justify-center">
              <TabsList className="grid w-full max-w-lg grid-cols-3">
                <TabsTrigger value="transition">Transition Services</TabsTrigger>
                <TabsTrigger value="resources">Quick Resources</TabsTrigger>
                <TabsTrigger value="advocacy">Legal Advocacy</TabsTrigger>
              </TabsList>
            </div>

            {/* Transition Services */}
            <TabsContent value="transition" className="space-y-8">
              <div className="grid lg:grid-cols-2 gap-6">
                {transitionServices.map((service, index) => (
                  <Card key={index} className={`${getUrgencyColor(service.urgency)} hover:shadow-lg transition-shadow`}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-white rounded-lg">
                            <service.icon className="h-6 w-6 text-navy-600" />
                          </div>
                          <div>
                            <CardTitle className="text-lg text-navy-700">{service.title}</CardTitle>
                            <Badge 
                              variant="outline" 
                              className={`mt-1 ${service.urgency === 'high' ? 'border-red-400 text-red-700' : 'border-military-gold-400 text-military-gold-700'}`}
                            >
                              {service.urgency === 'high' ? 'High Priority' : 'Standard Priority'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-navy-600">{service.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="flex items-center font-medium text-navy-700">
                            <Clock className="h-4 w-4 mr-1" />
                            Timeline:
                          </span>
                          <p className="text-navy-600 ml-5">{service.timeframe}</p>
                        </div>
                        <div>
                          <span className="flex items-center font-medium text-navy-700">
                            <Star className="h-4 w-4 mr-1" />
                            Priority:
                          </span>
                          <p className="text-navy-600 ml-5">{service.priority}</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-navy-700 mb-2">Services Included:</h4>
                        <ul className="space-y-1">
                          {service.services.map((item, serviceIndex) => (
                            <li key={serviceIndex} className="flex items-center text-sm text-navy-600">
                              <UserCheck className="h-3 w-3 text-sage-500 mr-2" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <Button className="w-full bg-navy-600 hover:bg-navy-700">
                        <Calendar className="h-4 w-4 mr-2" />
                        Schedule Consultation
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Quick Resources */}
            <TabsContent value="resources" className="space-y-8">
              <div className="grid gap-6">
                {veteranResources.map((category, index) => (
                  <Card key={index} className={`bg-gradient-to-r from-${category.color}-50 to-white border-${category.color}-200`}>
                    <CardHeader>
                      <CardTitle className="text-navy-700">{category.category}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-3 gap-4">
                        {category.resources.map((resource, resourceIndex) => (
                          <div key={resourceIndex} className="p-4 bg-white rounded-lg border border-gray-200">
                            <h4 className="font-semibold text-navy-700 mb-2">{resource.name}</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center text-navy-600">
                                <Phone className="h-3 w-3 mr-2" />
                                {resource.contact}
                              </div>
                              <div className="flex items-center text-sage-600">
                                <Clock className="h-3 w-3 mr-2" />
                                {resource.available}
                              </div>
                            </div>
                            <Button 
                              size="sm" 
                              className={`w-full mt-3 bg-${category.color}-600 hover:bg-${category.color}-700`}
                            >
                              Contact Now
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Legal Advocacy */}
            <TabsContent value="advocacy" className="space-y-8">
              {/* Featured Critical Services */}
              <div className="grid lg:grid-cols-3 gap-6 mb-8">
                <Card className="bg-gradient-to-br from-red-50 to-white border-red-200">
                  <CardHeader>
                    <CardTitle className="flex items-center text-red-700">
                      <DollarSign className="h-6 w-6 mr-3" />
                      Social Security Disability
                    </CardTitle>
                    <Badge className="bg-red-100 text-red-800 w-fit">100% Disabled Veterans</Badge>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-red-600 text-sm">
                      Specialized attorneys for SSDI claims for 100% disabled veterans - hard to find expertise
                    </p>
                    <ul className="text-xs text-red-600 space-y-1">
                      <li>• SSDI + VA coordination</li>
                      <li>• Expedited processing</li>
                      <li>• Appeals representation</li>
                    </ul>
                    <Button className="w-full bg-red-600 hover:bg-red-700 text-sm">
                      Find SS Disability Attorney
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-military-gold-50 to-white border-military-gold-200">
                  <CardHeader>
                    <CardTitle className="flex items-center text-military-gold-700">
                      <Heart className="h-6 w-6 mr-3" />
                      Personal Injury
                    </CardTitle>
                    <Badge className="bg-military-gold-100 text-military-gold-800 w-fit">Veteran-Focused</Badge>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-military-gold-600 text-sm">
                      Veterans need specialized PI attorneys who understand service-connected injuries
                    </p>
                    <ul className="text-xs text-military-gold-600 space-y-1">
                      <li>• Auto accidents</li>
                      <li>• VA medical malpractice</li>
                      <li>• Workplace injuries</li>
                    </ul>
                    <Button className="w-full bg-military-gold-600 hover:bg-military-gold-700 text-sm">
                      Find PI Attorney
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-sage-50 to-white border-sage-200">
                  <CardHeader>
                    <CardTitle className="flex items-center text-sage-700">
                      <FileText className="h-6 w-6 mr-3" />
                      Trusts & Wills
                    </CardTitle>
                    <Badge className="bg-sage-100 text-sage-800 w-fit">Asset Protection</Badge>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sage-600 text-sm">
                      Protect VA benefits and disability income with specialized estate planning
                    </p>
                    <ul className="text-xs text-sage-600 space-y-1">
                      <li>• Special needs trusts</li>
                      <li>• VA benefits preservation</li>
                      <li>• Disabled veteran wills</li>
                    </ul>
                    <Button className="w-full bg-sage-600 hover:bg-sage-700 text-sm">
                      Find Estate Attorney
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                <Card className="bg-gradient-to-br from-navy-50 to-white">
                  <CardHeader>
                    <CardTitle className="flex items-center text-navy-700">
                      <Scale className="h-6 w-6 mr-3" />
                      Veteran Legal Advocacy
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-navy-600">
                      Specialized legal representation for veteran-specific issues and claims
                    </p>
                    <div className="space-y-3">
                      <Button className="w-full bg-navy-600 hover:bg-navy-700">
                        <FileText className="h-4 w-4 mr-2" />
                        File VA Disability Appeal
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Shield className="h-4 w-4 mr-2" />
                        Discharge Upgrade Assistance
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Award className="h-4 w-4 mr-2" />
                        Military Records Correction
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-military-gold-50 to-white">
                  <CardHeader>
                    <CardTitle className="flex items-center text-navy-700">
                      <Users className="h-6 w-6 mr-3" />
                      Veteran Support Network
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-navy-600">
                      Connect with veteran advocates and peer support specialists
                    </p>
                    <div className="space-y-3">
                      <Button className="w-full bg-military-gold-500 hover:bg-military-gold-600">
                        <Users className="h-4 w-4 mr-2" />
                        Join Veteran Network
                      </Button>
                      <Button variant="outline" className="w-full">
                        <MapPin className="h-4 w-4 mr-2" />
                        Find Local VSO
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Heart className="h-4 w-4 mr-2" />
                        Peer Mentorship Program
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Success Stories */}
              <Card className="bg-gradient-to-r from-sage-50 to-warm-gray-50">
                <CardHeader>
                  <CardTitle className="text-center text-navy-700">Why Veterans Choose Specialized Legal Help</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6 text-center">
                    <div className="p-4">
                      <DollarSign className="h-8 w-8 text-red-500 mx-auto mb-2" />
                      <h4 className="font-semibold text-navy-700">Social Security Disability</h4>
                      <p className="text-sm text-navy-600">100% disabled veterans need specialized SSDI attorneys who understand VA coordination</p>
                    </div>
                    <div className="p-4">
                      <Heart className="h-8 w-8 text-military-gold-500 mx-auto mb-2" />
                      <h4 className="font-semibold text-navy-700">Personal Injury Law</h4>
                      <p className="text-sm text-navy-600">Service-connected injuries require attorneys familiar with military service impacts</p>
                    </div>
                    <div className="p-4">
                      <FileText className="h-8 w-8 text-sage-500 mx-auto mb-2" />
                      <h4 className="font-semibold text-navy-700">Estate Planning</h4>
                      <p className="text-sm text-navy-600">Protect VA benefits with specialized trusts and wills for disabled veterans</p>
                    </div>
                  </div>
                  
                  <div className="mt-8 p-6 bg-white rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-navy-700 mb-4 text-center">Critical Legal Gaps for Veterans</h4>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <h5 className="font-medium text-red-700">Social Security Disability:</h5>
                        <ul className="text-navy-600 space-y-1">
                          <li>• Most attorneys don't understand VA disability coordination</li>
                          <li>• 100% disabled veterans have unique expedited processes</li>
                          <li>• SSDI appeals require specialized knowledge</li>
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <h5 className="font-medium text-military-gold-700">Personal Injury & Estate Planning:</h5>
                        <ul className="text-navy-600 space-y-1">
                          <li>• Service-connected injury complications</li>
                          <li>• VA benefits preservation in trusts</li>
                          <li>• Special needs planning for disabled veterans</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}