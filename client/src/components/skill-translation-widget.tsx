import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowRight, 
  Star, 
  Target, 
  TrendingUp,
  Briefcase,
  Award,
  Users,
  Settings,
  Shield,
  Zap,
  CheckCircle,
  AlertCircle
} from "lucide-react";

interface MilitarySkill {
  category: string;
  skill: string;
  description: string;
  civilianEquivalents: CivilianSkill[];
  industries: string[];
  importance: "high" | "medium" | "low";
}

interface CivilianSkill {
  title: string;
  industry: string;
  description: string;
  matchPercentage: number;
  jobTitles: string[];
  salaryRange: string;
}

interface SkillTranslationWidgetProps {
  militaryOccupation?: string;
  onSkillSelect?: (skill: MilitarySkill) => void;
}

export default function SkillTranslationWidget({ 
  militaryOccupation, 
  onSkillSelect 
}: SkillTranslationWidgetProps) {
  const [selectedMOS, setSelectedMOS] = useState(militaryOccupation || "");
  const [selectedSkill, setSelectedSkill] = useState<MilitarySkill | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("all");

  // Military Occupational Specialties database
  const militaryOccupations = [
    { code: "25B", title: "Information Technology Specialist", branch: "Army" },
    { code: "35N", title: "Signals Intelligence Analyst", branch: "Army" },
    { code: "92A", title: "Automated Logistical Specialist", branch: "Army" },
    { code: "11B", title: "Infantryman", branch: "Army" },
    { code: "88M", title: "Motor Transport Operator", branch: "Army" },
    { code: "68W", title: "Combat Medic", branch: "Army" },
    { code: "15T", title: "UH-60 Helicopter Repairer", branch: "Army" },
    { code: "IT", title: "Information Systems Technician", branch: "Navy" },
    { code: "HM", title: "Hospital Corpsman", branch: "Navy" },
    { code: "LS", title: "Logistics Specialist", branch: "Navy" },
    { code: "3D1X2", title: "Cyber Transport Systems", branch: "Air Force" },
    { code: "1N1X1", title: "Geospatial Intelligence", branch: "Air Force" },
    { code: "2T2X1", title: "Air Transportation", branch: "Air Force" },
    { code: "0311", title: "Rifleman", branch: "Marines" },
    { code: "0651", title: "Cyber Network Systems Technician", branch: "Marines" },
    { code: "IT", title: "Information Technology", branch: "Coast Guard" }
  ];

  // Comprehensive skill database
  const militarySkillsDatabase: MilitarySkill[] = [
    {
      category: "Leadership & Management",
      skill: "Team Leadership",
      description: "Led squads, teams, and units in high-pressure environments",
      civilianEquivalents: [
        {
          title: "Project Manager",
          industry: "Technology",
          description: "Lead cross-functional teams to deliver complex projects",
          matchPercentage: 92,
          jobTitles: ["Project Manager", "Scrum Master", "Team Lead"],
          salaryRange: "$75,000 - $120,000"
        },
        {
          title: "Operations Manager",
          industry: "Manufacturing",
          description: "Oversee daily operations and manage production teams",
          matchPercentage: 88,
          jobTitles: ["Operations Manager", "Production Supervisor", "Plant Manager"],
          salaryRange: "$65,000 - $110,000"
        },
        {
          title: "Department Manager",
          industry: "Retail",
          description: "Manage retail teams and ensure customer satisfaction",
          matchPercentage: 85,
          jobTitles: ["Store Manager", "Department Manager", "District Manager"],
          salaryRange: "$45,000 - $85,000"
        }
      ],
      industries: ["Technology", "Manufacturing", "Healthcare", "Government"],
      importance: "high"
    },
    {
      category: "Technical Skills",
      skill: "Network Administration",
      description: "Configured and maintained secure military networks",
      civilianEquivalents: [
        {
          title: "Network Administrator",
          industry: "Technology",
          description: "Manage and maintain computer networks and systems",
          matchPercentage: 95,
          jobTitles: ["Network Administrator", "Systems Administrator", "IT Specialist"],
          salaryRange: "$65,000 - $95,000"
        },
        {
          title: "Cybersecurity Analyst",
          industry: "Finance",
          description: "Monitor and protect financial networks from threats",
          matchPercentage: 90,
          jobTitles: ["Cybersecurity Analyst", "Security Specialist", "IT Security Manager"],
          salaryRange: "$75,000 - $125,000"
        }
      ],
      industries: ["Technology", "Finance", "Government", "Healthcare"],
      importance: "high"
    },
    {
      category: "Operations & Logistics",
      skill: "Supply Chain Management",
      description: "Managed complex military supply chains and inventory",
      civilianEquivalents: [
        {
          title: "Supply Chain Manager",
          industry: "Manufacturing",
          description: "Optimize supply chain operations and vendor relationships",
          matchPercentage: 93,
          jobTitles: ["Supply Chain Manager", "Logistics Coordinator", "Procurement Manager"],
          salaryRange: "$70,000 - $115,000"
        },
        {
          title: "Operations Analyst",
          industry: "Transportation",
          description: "Analyze and improve transportation and logistics operations",
          matchPercentage: 87,
          jobTitles: ["Operations Analyst", "Logistics Analyst", "Transportation Coordinator"],
          salaryRange: "$55,000 - $85,000"
        }
      ],
      industries: ["Manufacturing", "Transportation", "Retail", "Healthcare"],
      importance: "high"
    },
    {
      category: "Communication & Training",
      skill: "Training & Development",
      description: "Trained personnel on complex procedures and equipment",
      civilianEquivalents: [
        {
          title: "Training Manager",
          industry: "Corporate",
          description: "Design and deliver employee training programs",
          matchPercentage: 91,
          jobTitles: ["Training Manager", "Learning & Development Specialist", "Corporate Trainer"],
          salaryRange: "$60,000 - $95,000"
        },
        {
          title: "Instructional Designer",
          industry: "Education",
          description: "Create educational content and training materials",
          matchPercentage: 85,
          jobTitles: ["Instructional Designer", "Curriculum Developer", "Education Specialist"],
          salaryRange: "$55,000 - $80,000"
        }
      ],
      industries: ["Education", "Corporate", "Healthcare", "Government"],
      importance: "medium"
    },
    {
      category: "Security & Safety",
      skill: "Security Operations",
      description: "Implemented security protocols and risk management",
      civilianEquivalents: [
        {
          title: "Security Manager",
          industry: "Corporate",
          description: "Develop and implement corporate security policies",
          matchPercentage: 89,
          jobTitles: ["Security Manager", "Safety Coordinator", "Risk Manager"],
          salaryRange: "$65,000 - $100,000"
        },
        {
          title: "Compliance Officer",
          industry: "Finance",
          description: "Ensure regulatory compliance and risk management",
          matchPercentage: 82,
          jobTitles: ["Compliance Officer", "Risk Analyst", "Audit Specialist"],
          salaryRange: "$70,000 - $110,000"
        }
      ],
      industries: ["Finance", "Healthcare", "Government", "Manufacturing"],
      importance: "high"
    }
  ];

  const industries = [
    "all", "Technology", "Healthcare", "Finance", "Manufacturing", 
    "Government", "Education", "Transportation", "Retail", "Corporate"
  ];

  const filteredSkills = militarySkillsDatabase.filter(skill => {
    const matchesSearch = skill.skill.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         skill.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry = selectedIndustry === "all" || 
                           skill.industries.includes(selectedIndustry);
    return matchesSearch && matchesIndustry;
  });

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case "high": return "bg-red-100 text-red-800 border-red-200";
      case "medium": return "bg-military-gold-100 text-military-gold-800 border-military-gold-200";
      case "low": return "bg-sage-100 text-sage-800 border-sage-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getMatchColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-600";
    if (percentage >= 80) return "text-military-gold-600";
    if (percentage >= 70) return "text-sage-600";
    return "text-gray-600";
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <Card className="bg-gradient-to-r from-navy-50 to-military-gold-50">
        <CardHeader>
          <CardTitle className="flex items-center text-navy-700">
            <Target className="h-6 w-6 mr-3" />
            Interactive Skill Translation
          </CardTitle>
          <p className="text-navy-600">
            Discover how your military skills translate to civilian careers
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mos">Military Occupation (Optional)</Label>
              <Select value={selectedMOS} onValueChange={setSelectedMOS}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your MOS/Rate" />
                </SelectTrigger>
                <SelectContent>
                  {militaryOccupations.map(occupation => (
                    <SelectItem key={occupation.code} value={occupation.code}>
                      {occupation.code} - {occupation.title} ({occupation.branch})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="search">Search Skills</Label>
              <Input
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="e.g., leadership, technical, logistics"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="industry">Target Industry</Label>
              <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                <SelectTrigger>
                  <SelectValue placeholder="All Industries" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map(industry => (
                    <SelectItem key={industry} value={industry}>
                      {industry === "all" ? "All Industries" : industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Military Skills List */}
        <Card className="bg-gradient-to-br from-navy-50 to-white">
          <CardHeader>
            <CardTitle className="flex items-center text-navy-700">
              <Shield className="h-5 w-5 mr-2" />
              Military Skills ({filteredSkills.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 max-h-96 overflow-y-auto">
            {filteredSkills.map((skill, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                  selectedSkill?.skill === skill.skill
                    ? 'border-navy-300 bg-navy-50 shadow-md'
                    : 'border-gray-200 bg-white hover:border-navy-200 hover:bg-navy-25'
                }`}
                onClick={() => {
                  setSelectedSkill(skill);
                  onSkillSelect?.(skill);
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-navy-700">{skill.skill}</h4>
                    <p className="text-sm text-navy-500">{skill.category}</p>
                  </div>
                  <Badge className={getImportanceColor(skill.importance)}>
                    {skill.importance}
                  </Badge>
                </div>
                <p className="text-sm text-navy-600 mb-3">{skill.description}</p>
                <div className="flex items-center text-xs text-navy-500">
                  <Briefcase className="h-3 w-3 mr-1" />
                  {skill.civilianEquivalents.length} civilian matches
                  <ArrowRight className="h-3 w-3 mx-2" />
                  <Users className="h-3 w-3 mr-1" />
                  {skill.industries.length} industries
                </div>
              </div>
            ))}
            {filteredSkills.length === 0 && (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No skills found matching your criteria</p>
                <p className="text-sm text-gray-500">Try adjusting your search or filters</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Civilian Translation Results */}
        <Card className="bg-gradient-to-br from-sage-50 to-white">
          <CardHeader>
            <CardTitle className="flex items-center text-navy-700">
              <TrendingUp className="h-5 w-5 mr-2" />
              Civilian Career Translations
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedSkill ? (
              <div className="space-y-4">
                <div className="p-4 bg-white rounded-lg border border-sage-200">
                  <h3 className="font-semibold text-navy-700 mb-2">
                    "{selectedSkill.skill}" translates to:
                  </h3>
                  <p className="text-sm text-navy-600 mb-3">
                    {selectedSkill.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedSkill.industries.map(industry => (
                      <Badge key={industry} variant="outline" className="bg-sage-50 border-sage-200">
                        {industry}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {selectedSkill.civilianEquivalents.map((civilian, index) => (
                    <Card key={index} className="bg-white border-sage-200 hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-navy-700">{civilian.title}</h4>
                            <p className="text-sm text-navy-500">{civilian.industry}</p>
                          </div>
                          <div className="text-right">
                            <div className={`text-lg font-bold ${getMatchColor(civilian.matchPercentage)}`}>
                              {civilian.matchPercentage}%
                            </div>
                            <p className="text-xs text-gray-500">match</p>
                          </div>
                        </div>

                        <p className="text-sm text-navy-600 mb-3">{civilian.description}</p>

                        <div className="space-y-2">
                          <div>
                            <p className="text-xs font-medium text-navy-700">Job Titles:</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {civilian.jobTitles.map(title => (
                                <Badge key={title} variant="outline" className="text-xs">
                                  {title}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs font-medium text-navy-700">Salary Range:</p>
                              <p className="text-sm text-sage-600 font-semibold">{civilian.salaryRange}</p>
                            </div>
                            <Progress value={civilian.matchPercentage} className="w-20 h-2" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="pt-4">
                  <Button 
                    className="w-full bg-sage-600 hover:bg-sage-700"
                    onClick={() => onSkillSelect?.(selectedSkill)}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Add to Career Assessment
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Target className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  Select a Military Skill
                </h3>
                <p className="text-gray-500">
                  Choose a skill from the left to see civilian career translations
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      {selectedSkill && (
        <Card className="bg-gradient-to-r from-military-gold-50 to-navy-50">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="flex justify-center mb-2">
                  <Star className="h-8 w-8 text-military-gold-500" />
                </div>
                <h4 className="font-semibold text-navy-700">
                  {selectedSkill.civilianEquivalents.length}
                </h4>
                <p className="text-sm text-navy-600">Career Matches</p>
              </div>
              <div>
                <div className="flex justify-center mb-2">
                  <Briefcase className="h-8 w-8 text-sage-500" />
                </div>
                <h4 className="font-semibold text-navy-700">
                  {selectedSkill.industries.length}
                </h4>
                <p className="text-sm text-navy-600">Industries</p>
              </div>
              <div>
                <div className="flex justify-center mb-2">
                  <TrendingUp className="h-8 w-8 text-navy-500" />
                </div>
                <h4 className="font-semibold text-navy-700">
                  {Math.round(selectedSkill.civilianEquivalents.reduce((sum, eq) => sum + eq.matchPercentage, 0) / selectedSkill.civilianEquivalents.length)}%
                </h4>
                <p className="text-sm text-navy-600">Avg Match</p>
              </div>
              <div>
                <div className="flex justify-center mb-2">
                  <Award className="h-8 w-8 text-red-500" />
                </div>
                <h4 className="font-semibold text-navy-700 capitalize">
                  {selectedSkill.importance}
                </h4>
                <p className="text-sm text-navy-600">Market Value</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}