import { useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import SecurityReminder from "@/components/security-reminder";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Users, 
  Star, 
  MessageSquare, 
  Calendar, 
  MapPin,
  Briefcase,
  Award,
  Shield,
  Heart,
  Clock,
  Target,
  CheckCircle,
  UserPlus,
  Coffee,
  Video,
  Phone
} from "lucide-react";

interface VeteranProfile {
  id: string;
  name: string;
  rank: string;
  branch: string;
  yearsOfService: number;
  currentRole: string;
  company: string;
  location: string;
  specialties: string[];
  mentorshipType: "mentor" | "mentee" | "peer";
  availability: string;
  rating: number;
  bio: string;
  profileImage: string;
  joinedDate: string;
  successStories: number;
}

interface NetworkingEvent {
  id: string;
  title: string;
  type: "virtual" | "in-person" | "hybrid";
  date: string;
  time: string;
  location: string;
  description: string;
  maxAttendees: number;
  currentAttendees: number;
  organizer: string;
  tags: string[];
}

export default function NetworkingHub() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBranch, setFilterBranch] = useState("all");
  const [filterSpecialty, setFilterSpecialty] = useState("all");
  const [filterType, setFilterType] = useState("all");

  // Sample veteran profiles for networking
  const veteranProfiles: VeteranProfile[] = [
    {
      id: "1",
      name: "Sarah Mitchell",
      rank: "E-8 Master Sergeant",
      branch: "Army",
      yearsOfService: 22,
      currentRole: "Cybersecurity Manager",
      company: "Microsoft",
      location: "Seattle, WA",
      specialties: ["Cybersecurity", "Team Leadership", "Risk Management"],
      mentorshipType: "mentor",
      availability: "Weekends",
      rating: 4.9,
      bio: "Transitioned from Army cybersecurity to corporate tech. Passionate about helping veterans navigate technology careers.",
      profileImage: "",
      joinedDate: "2023-01-15",
      successStories: 12
    },
    {
      id: "2",
      name: "Marcus Johnson",
      rank: "O-4 Major",
      branch: "Marines",
      yearsOfService: 16,
      currentRole: "Project Manager",
      company: "Boeing",
      location: "Arlington, VA",
      specialties: ["Project Management", "Logistics", "Leadership"],
      mentorshipType: "mentor",
      availability: "Evenings",
      rating: 4.8,
      bio: "Leading complex aerospace projects. Experienced in transitioning military logistics experience to civilian project management.",
      profileImage: "",
      joinedDate: "2022-11-08",
      successStories: 8
    },
    {
      id: "3",
      name: "Jessica Chen",
      rank: "E-6 Petty Officer",
      branch: "Navy",
      yearsOfService: 12,
      currentRole: "Software Engineer",
      company: "Google",
      location: "Mountain View, CA",
      specialties: ["Software Development", "Technical Training", "Innovation"],
      mentorshipType: "peer",
      availability: "Flexible",
      rating: 4.7,
      bio: "Navy IT specialist turned software engineer. Love mentoring junior veterans entering tech.",
      profileImage: "",
      joinedDate: "2023-03-22",
      successStories: 5
    },
    {
      id: "4",
      name: "David Rodriguez",
      rank: "E-5 Staff Sergeant",
      branch: "Air Force",
      yearsOfService: 8,
      currentRole: "Currently Transitioning",
      company: "Job Seeking",
      location: "San Antonio, TX",
      specialties: ["Aircraft Maintenance", "Quality Control", "Safety"],
      mentorshipType: "mentee",
      availability: "Anytime",
      rating: 0,
      bio: "Recently separated Air Force veteran seeking guidance in transitioning maintenance skills to civilian manufacturing.",
      profileImage: "",
      joinedDate: "2024-01-05",
      successStories: 0
    }
  ];

  // Sample networking events
  const networkingEvents: NetworkingEvent[] = [
    {
      id: "1",
      title: "Tech Veterans Monthly Meetup",
      type: "hybrid",
      date: "2024-02-15",
      time: "6:00 PM EST",
      location: "Austin, TX + Virtual",
      description: "Monthly gathering for veterans in technology careers. Networking, job tips, and industry insights.",
      maxAttendees: 50,
      currentAttendees: 34,
      organizer: "Tech Veterans Alliance",
      tags: ["Technology", "Networking", "Career"]
    },
    {
      id: "2",
      title: "Leadership Skills Workshop",
      type: "virtual",
      date: "2024-02-20",
      time: "7:00 PM EST",
      location: "Zoom",
      description: "Interactive workshop on translating military leadership to corporate environments.",
      maxAttendees: 25,
      currentAttendees: 18,
      organizer: "Sarah Mitchell",
      tags: ["Leadership", "Workshop", "Career Development"]
    },
    {
      id: "3",
      title: "Manufacturing Veterans Network",
      type: "in-person",
      date: "2024-02-22",
      time: "12:00 PM CST",
      location: "Detroit, MI",
      description: "Lunch networking for veterans in manufacturing and industrial careers.",
      maxAttendees: 30,
      currentAttendees: 22,
      organizer: "Industrial Veterans Group",
      tags: ["Manufacturing", "Lunch", "Local"]
    }
  ];

  const filteredProfiles = veteranProfiles.filter(profile => {
    const matchesSearch = profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         profile.currentRole.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         profile.specialties.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesBranch = filterBranch === "all" || profile.branch === filterBranch;
    const matchesSpecialty = filterSpecialty === "all" || 
                            profile.specialties.some(spec => spec.includes(filterSpecialty));
    const matchesType = filterType === "all" || profile.mentorshipType === filterType;
    
    return matchesSearch && matchesBranch && matchesSpecialty && matchesType;
  });

  const getMentorshipTypeColor = (type: string) => {
    switch (type) {
      case "mentor": return "bg-navy-100 text-navy-800 border-navy-200";
      case "mentee": return "bg-sage-100 text-sage-800 border-sage-200";
      case "peer": return "bg-military-gold-100 text-military-gold-800 border-military-gold-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case "virtual": return <Video className="h-4 w-4" />;
      case "in-person": return <Coffee className="h-4 w-4" />;
      case "hybrid": return <Users className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
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
                <Users className="h-12 w-12 text-navy-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-navy-700 mb-4">
              Veteran Networking & Mentorship Hub
            </h1>
            <p className="text-xl text-navy-600 max-w-3xl mx-auto mb-8">
              Connect with fellow veterans, find mentors, and build professional networks. 
              Share experiences, get career advice, and support each other's transition journey.
            </p>
            <div className="flex justify-center space-x-4">
              <Badge className="bg-military-gold-100 text-military-gold-800 px-4 py-2">
                <Users className="h-4 w-4 mr-1" />
                Mentorship Matching
              </Badge>
              <Badge className="bg-navy-100 text-navy-800 px-4 py-2">
                <Heart className="h-4 w-4 mr-1" />
                Peer Support
              </Badge>
              <Badge className="bg-sage-100 text-sage-800 px-4 py-2">
                <Target className="h-4 w-4 mr-1" />
                Career Networking
              </Badge>
            </div>
          </div>

          {/* Security Reminder */}
          <SecurityReminder />

          <Tabs defaultValue="mentors" className="space-y-8">
            <div className="flex justify-center">
              <TabsList className="grid w-full max-w-lg grid-cols-3">
                <TabsTrigger value="mentors">Find Mentors</TabsTrigger>
                <TabsTrigger value="events">Networking Events</TabsTrigger>
                <TabsTrigger value="groups">Interest Groups</TabsTrigger>
              </TabsList>
            </div>

            {/* Find Mentors Tab */}
            <TabsContent value="mentors" className="space-y-8">
              {/* Search and Filter */}
              <Card className="bg-gradient-to-r from-navy-50 to-military-gold-50">
                <CardHeader>
                  <CardTitle className="text-navy-700">Find Your Perfect Mentor or Peer</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="search">Search</Label>
                      <Input
                        id="search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Name, role, or skill"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="branch">Military Branch</Label>
                      <Select value={filterBranch} onValueChange={setFilterBranch}>
                        <SelectTrigger>
                          <SelectValue placeholder="All Branches" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Branches</SelectItem>
                          <SelectItem value="Army">Army</SelectItem>
                          <SelectItem value="Navy">Navy</SelectItem>
                          <SelectItem value="Air Force">Air Force</SelectItem>
                          <SelectItem value="Marines">Marines</SelectItem>
                          <SelectItem value="Coast Guard">Coast Guard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="specialty">Specialty</Label>
                      <Select value={filterSpecialty} onValueChange={setFilterSpecialty}>
                        <SelectTrigger>
                          <SelectValue placeholder="All Specialties" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Specialties</SelectItem>
                          <SelectItem value="Cybersecurity">Cybersecurity</SelectItem>
                          <SelectItem value="Leadership">Leadership</SelectItem>
                          <SelectItem value="Project Management">Project Management</SelectItem>
                          <SelectItem value="Software Development">Software Development</SelectItem>
                          <SelectItem value="Logistics">Logistics</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="type">Connection Type</Label>
                      <Select value={filterType} onValueChange={setFilterType}>
                        <SelectTrigger>
                          <SelectValue placeholder="All Types" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="mentor">Mentors</SelectItem>
                          <SelectItem value="peer">Peers</SelectItem>
                          <SelectItem value="mentee">Looking for Guidance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Veteran Profiles */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProfiles.map(profile => (
                  <Card key={profile.id} className="bg-white hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-4">
                      <div className="flex items-start space-x-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={profile.profileImage} />
                          <AvatarFallback className="bg-navy-100 text-navy-600 text-lg font-semibold">
                            {profile.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-semibold text-navy-700">{profile.name}</h3>
                          <p className="text-sm text-navy-500">{profile.rank} • {profile.branch}</p>
                          <div className="flex items-center mt-1">
                            <Badge className={getMentorshipTypeColor(profile.mentorshipType)}>
                              {profile.mentorshipType}
                            </Badge>
                            {profile.rating > 0 && (
                              <div className="flex items-center ml-2">
                                <Star className="h-3 w-3 text-military-gold-500 fill-current" />
                                <span className="text-xs text-gray-600 ml-1">{profile.rating}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div>
                        <p className="font-semibold text-navy-700">{profile.currentRole}</p>
                        <p className="text-sm text-navy-500">{profile.company}</p>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          {profile.location}
                        </div>
                      </div>

                      <p className="text-sm text-navy-600">{profile.bio}</p>

                      <div>
                        <h4 className="text-sm font-semibold text-navy-700 mb-2">Specialties:</h4>
                        <div className="flex flex-wrap gap-1">
                          {profile.specialties.map(specialty => (
                            <Badge key={specialty} variant="outline" className="text-xs">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {profile.availability}
                        </div>
                        {profile.successStories > 0 && (
                          <div className="flex items-center">
                            <CheckCircle className="h-3 w-3 mr-1 text-sage-500" />
                            {profile.successStories} success stories
                          </div>
                        )}
                      </div>

                      <div className="flex space-x-2">
                        <Button className="flex-1 bg-navy-600 hover:bg-navy-700" size="sm">
                          <MessageSquare className="h-3 w-3 mr-1" />
                          Connect
                        </Button>
                        <Button variant="outline" size="sm">
                          <UserPlus className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredProfiles.length === 0 && (
                <div className="text-center py-12">
                  <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No matches found</h3>
                  <p className="text-gray-500">Try adjusting your search criteria</p>
                </div>
              )}
            </TabsContent>

            {/* Networking Events Tab */}
            <TabsContent value="events" className="space-y-8">
              <div className="grid gap-6">
                {networkingEvents.map(event => (
                  <Card key={event.id} className="bg-white hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg text-navy-700">{event.title}</CardTitle>
                          <p className="text-navy-600">{event.organizer}</p>
                        </div>
                        <Badge className="bg-sage-100 text-sage-800 flex items-center">
                          {getEventTypeIcon(event.type)}
                          <span className="ml-1 capitalize">{event.type}</span>
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <p className="text-navy-600">{event.description}</p>
                      
                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-navy-500" />
                          <span>{event.date} at {event.time}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-navy-500" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-navy-500" />
                          <span>{event.currentAttendees}/{event.maxAttendees} attending</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {event.tags.map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-500">
                          {event.maxAttendees - event.currentAttendees} spots remaining
                        </div>
                        <Button className="bg-military-gold-600 hover:bg-military-gold-700">
                          Join Event
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Interest Groups Tab */}
            <TabsContent value="groups" className="space-y-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-navy-50 to-white border-navy-200">
                  <CardHeader>
                    <CardTitle className="flex items-center text-navy-700">
                      <Briefcase className="h-6 w-6 mr-3" />
                      Tech Veterans
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-navy-600 mb-4">
                      Connect with veterans in technology careers - software engineering, 
                      cybersecurity, IT management, and more.
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-gray-500">1,247 members</span>
                      <Badge className="bg-navy-100 text-navy-800">Active</Badge>
                    </div>
                    <Button className="w-full bg-navy-600 hover:bg-navy-700">
                      Join Group
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-military-gold-50 to-white border-military-gold-200">
                  <CardHeader>
                    <CardTitle className="flex items-center text-navy-700">
                      <Award className="h-6 w-6 mr-3" />
                      Leadership Circle
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-navy-600 mb-4">
                      Former military leaders sharing insights on transitioning 
                      leadership skills to corporate environments.
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-gray-500">892 members</span>
                      <Badge className="bg-military-gold-100 text-military-gold-800">Active</Badge>
                    </div>
                    <Button className="w-full bg-military-gold-600 hover:bg-military-gold-700">
                      Join Group
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-sage-50 to-white border-sage-200">
                  <CardHeader>
                    <CardTitle className="flex items-center text-navy-700">
                      <Heart className="h-6 w-6 mr-3" />
                      Wellness Warriors
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-navy-600 mb-4">
                      Focus on mental health, wellness, and work-life balance 
                      during and after military transition.
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-gray-500">654 members</span>
                      <Badge className="bg-sage-100 text-sage-800">Supportive</Badge>
                    </div>
                    <Button className="w-full bg-sage-600 hover:bg-sage-700">
                      Join Group
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}