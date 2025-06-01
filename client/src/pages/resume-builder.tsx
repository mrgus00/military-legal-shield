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
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { 
  FileText, 
  Brain, 
  Download, 
  Eye,
  Star,
  Target,
  Award,
  Users,
  Briefcase,
  GraduationCap,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CheckCircle,
  Zap,
  Sparkles
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  linkedinUrl: string;
  summary: string;
}

interface MilitaryExperience {
  branch: string;
  rank: string;
  mos: string;
  startDate: string;
  endDate: string;
  unit: string;
  location: string;
  description: string;
  achievements: string[];
  deployments: string[];
}

interface Education {
  institution: string;
  degree: string;
  field: string;
  graduationDate: string;
  gpa?: string;
  honors?: string;
}

interface Certification {
  name: string;
  issuer: string;
  dateObtained: string;
  expirationDate?: string;
}

interface ResumeData {
  personalInfo: PersonalInfo;
  militaryExperience: MilitaryExperience[];
  education: Education[];
  certifications: Certification[];
  skills: string[];
  targetRole: string;
  targetIndustry: string;
}

interface GeneratedResume {
  professionalSummary: string;
  workExperience: string[];
  skillsSection: string[];
  achievementsHighlights: string[];
  formattedResume: string;
}

export default function ResumeBuilder() {
  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      city: "",
      state: "",
      linkedinUrl: "",
      summary: ""
    },
    militaryExperience: [{
      branch: "",
      rank: "",
      mos: "",
      startDate: "",
      endDate: "",
      unit: "",
      location: "",
      description: "",
      achievements: [],
      deployments: []
    }],
    education: [{
      institution: "",
      degree: "",
      field: "",
      graduationDate: "",
      gpa: "",
      honors: ""
    }],
    certifications: [],
    skills: [],
    targetRole: "",
    targetIndustry: ""
  });

  const [generatedResume, setGeneratedResume] = useState<GeneratedResume | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const { toast } = useToast();

  const industries = [
    "Technology", "Healthcare", "Finance", "Manufacturing", "Government",
    "Education", "Transportation", "Construction", "Retail", "Consulting"
  ];

  const militaryBranches = [
    "Army", "Navy", "Air Force", "Marines", "Coast Guard", "Space Force"
  ];

  const generateResume = async () => {
    if (!resumeData.personalInfo.firstName || !resumeData.targetRole) {
      toast({
        title: "Missing Information",
        description: "Please fill in your name and target role before generating.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setGenerationStep(0);

    try {
      const steps = [
        "Analyzing military experience...",
        "Translating skills to civilian terms...",
        "Crafting professional summary...",
        "Optimizing for target role...",
        "Formatting final resume..."
      ];

      for (let i = 0; i < steps.length; i++) {
        setGenerationStep(i);
        await new Promise(resolve => setTimeout(resolve, 800));
      }

      const response = await apiRequest("POST", "/api/generate-veteran-resume", {
        resumeData
      });

      const data = await response.json();
      setGeneratedResume(data);
      
      toast({
        title: "Resume Generated Successfully",
        description: "Your AI-powered veteran resume is ready!",
      });
    } catch (error) {
      console.error("Resume generation error:", error);
      toast({
        title: "Generation Error",
        description: "Unable to generate resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const addMilitaryExperience = () => {
    setResumeData(prev => ({
      ...prev,
      militaryExperience: [...prev.militaryExperience, {
        branch: "",
        rank: "",
        mos: "",
        startDate: "",
        endDate: "",
        unit: "",
        location: "",
        description: "",
        achievements: [],
        deployments: []
      }]
    }));
  };

  const addEducation = () => {
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, {
        institution: "",
        degree: "",
        field: "",
        graduationDate: "",
        gpa: "",
        honors: ""
      }]
    }));
  };

  const addCertification = () => {
    setResumeData(prev => ({
      ...prev,
      certifications: [...prev.certifications, {
        name: "",
        issuer: "",
        dateObtained: "",
        expirationDate: ""
      }]
    }));
  };

  const completionPercentage = () => {
    let completed = 0;
    let total = 6;

    if (resumeData.personalInfo.firstName && resumeData.personalInfo.email) completed++;
    if (resumeData.militaryExperience[0].branch && resumeData.militaryExperience[0].mos) completed++;
    if (resumeData.education[0].institution) completed++;
    if (resumeData.skills.length > 0) completed++;
    if (resumeData.targetRole) completed++;
    if (resumeData.targetIndustry) completed++;

    return Math.round((completed / total) * 100);
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
                <FileText className="h-12 w-12 text-navy-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-navy-700 mb-4">
              AI-Powered Veteran Resume Builder
            </h1>
            <p className="text-xl text-navy-600 max-w-3xl mx-auto mb-8">
              Transform your military experience into a compelling civilian resume. 
              Our AI translates military terminology into industry-specific language that employers understand.
            </p>
            <div className="flex justify-center space-x-4">
              <Badge className="bg-military-gold-100 text-military-gold-800 px-4 py-2">
                <Brain className="h-4 w-4 mr-1" />
                AI Translation
              </Badge>
              <Badge className="bg-navy-100 text-navy-800 px-4 py-2">
                <Target className="h-4 w-4 mr-1" />
                Industry Optimization
              </Badge>
              <Badge className="bg-sage-100 text-sage-800 px-4 py-2">
                <Zap className="h-4 w-4 mr-1" />
                Instant Generation
              </Badge>
            </div>
          </div>

          {/* Security Reminder */}
          <SecurityReminder />

          {/* Progress Bar */}
          <Card className="mb-8 bg-gradient-to-r from-sage-50 to-military-gold-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-navy-700">Resume Completion</h3>
                <span className="text-navy-600 font-semibold">{completionPercentage()}%</span>
              </div>
              <Progress value={completionPercentage()} className="mb-2" />
              <p className="text-sm text-navy-600">
                Complete all sections to generate your optimized veteran resume
              </p>
            </CardContent>
          </Card>

          {isGenerating && (
            <Card className="mb-8 bg-gradient-to-r from-navy-50 to-military-gold-50 border-navy-200">
              <CardContent className="p-8 text-center">
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <Brain className="h-12 w-12 text-navy-600" />
                    <div className="absolute inset-0 rounded-full border-4 border-military-gold-200 animate-spin border-t-military-gold-500"></div>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-navy-700 mb-2">
                  Generating Your Veteran Resume
                </h3>
                <p className="text-navy-600 mb-4">
                  AI is analyzing your military experience and creating your professional resume...
                </p>
                <Progress value={(generationStep + 1) * 20} className="mb-4" />
                <p className="text-sm text-navy-500">
                  Step {generationStep + 1} of 5: {
                    ["Analyzing military experience", "Translating skills to civilian terms", "Crafting professional summary", "Optimizing for target role", "Formatting final resume"][generationStep]
                  }
                </p>
              </CardContent>
            </Card>
          )}

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Input Form */}
            <div className="lg:col-span-2 space-y-8">
              <Tabs defaultValue="personal" className="space-y-6">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="personal">Personal</TabsTrigger>
                  <TabsTrigger value="military">Military</TabsTrigger>
                  <TabsTrigger value="education">Education</TabsTrigger>
                  <TabsTrigger value="skills">Skills</TabsTrigger>
                  <TabsTrigger value="target">Target Role</TabsTrigger>
                </TabsList>

                {/* Personal Information */}
                <TabsContent value="personal">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-navy-700">
                        <Users className="h-6 w-6 mr-3" />
                        Personal Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            value={resumeData.personalInfo.firstName}
                            onChange={(e) => setResumeData({
                              ...resumeData,
                              personalInfo: { ...resumeData.personalInfo, firstName: e.target.value }
                            })}
                            placeholder="John"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            value={resumeData.personalInfo.lastName}
                            onChange={(e) => setResumeData({
                              ...resumeData,
                              personalInfo: { ...resumeData.personalInfo, lastName: e.target.value }
                            })}
                            placeholder="Smith"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={resumeData.personalInfo.email}
                            onChange={(e) => setResumeData({
                              ...resumeData,
                              personalInfo: { ...resumeData.personalInfo, email: e.target.value }
                            })}
                            placeholder="john.smith@email.com"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            value={resumeData.personalInfo.phone}
                            onChange={(e) => setResumeData({
                              ...resumeData,
                              personalInfo: { ...resumeData.personalInfo, phone: e.target.value }
                            })}
                            placeholder="(555) 123-4567"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            value={resumeData.personalInfo.city}
                            onChange={(e) => setResumeData({
                              ...resumeData,
                              personalInfo: { ...resumeData.personalInfo, city: e.target.value }
                            })}
                            placeholder="San Antonio"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="state">State</Label>
                          <Input
                            id="state"
                            value={resumeData.personalInfo.state}
                            onChange={(e) => setResumeData({
                              ...resumeData,
                              personalInfo: { ...resumeData.personalInfo, state: e.target.value }
                            })}
                            placeholder="TX"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="linkedin">LinkedIn URL (Optional)</Label>
                        <Input
                          id="linkedin"
                          value={resumeData.personalInfo.linkedinUrl}
                          onChange={(e) => setResumeData({
                            ...resumeData,
                            personalInfo: { ...resumeData.personalInfo, linkedinUrl: e.target.value }
                          })}
                          placeholder="https://linkedin.com/in/johnsmith"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Military Experience */}
                <TabsContent value="military">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center text-navy-700">
                          <Award className="h-6 w-6 mr-3" />
                          Military Experience
                        </CardTitle>
                        <Button onClick={addMilitaryExperience} variant="outline" size="sm">
                          Add Experience
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {resumeData.militaryExperience.map((exp, index) => (
                        <div key={index} className="p-4 border rounded-lg space-y-4">
                          <div className="grid md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label>Military Branch</Label>
                              <Select
                                value={exp.branch}
                                onValueChange={(value) => {
                                  const newExp = [...resumeData.militaryExperience];
                                  newExp[index].branch = value;
                                  setResumeData({ ...resumeData, militaryExperience: newExp });
                                }}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select branch" />
                                </SelectTrigger>
                                <SelectContent>
                                  {militaryBranches.map(branch => (
                                    <SelectItem key={branch} value={branch}>{branch}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Rank</Label>
                              <Input
                                value={exp.rank}
                                onChange={(e) => {
                                  const newExp = [...resumeData.militaryExperience];
                                  newExp[index].rank = e.target.value;
                                  setResumeData({ ...resumeData, militaryExperience: newExp });
                                }}
                                placeholder="E-8 Master Sergeant"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>MOS/Rating</Label>
                              <Input
                                value={exp.mos}
                                onChange={(e) => {
                                  const newExp = [...resumeData.militaryExperience];
                                  newExp[index].mos = e.target.value;
                                  setResumeData({ ...resumeData, militaryExperience: newExp });
                                }}
                                placeholder="25B IT Specialist"
                              />
                            </div>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Start Date</Label>
                              <Input
                                type="date"
                                value={exp.startDate}
                                onChange={(e) => {
                                  const newExp = [...resumeData.militaryExperience];
                                  newExp[index].startDate = e.target.value;
                                  setResumeData({ ...resumeData, militaryExperience: newExp });
                                }}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>End Date</Label>
                              <Input
                                type="date"
                                value={exp.endDate}
                                onChange={(e) => {
                                  const newExp = [...resumeData.militaryExperience];
                                  newExp[index].endDate = e.target.value;
                                  setResumeData({ ...resumeData, militaryExperience: newExp });
                                }}
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>Unit/Organization</Label>
                            <Input
                              value={exp.unit}
                              onChange={(e) => {
                                const newExp = [...resumeData.militaryExperience];
                                newExp[index].unit = e.target.value;
                                setResumeData({ ...resumeData, militaryExperience: newExp });
                              }}
                              placeholder="3rd Infantry Division"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Job Description</Label>
                            <Textarea
                              value={exp.description}
                              onChange={(e) => {
                                const newExp = [...resumeData.militaryExperience];
                                newExp[index].description = e.target.value;
                                setResumeData({ ...resumeData, militaryExperience: newExp });
                              }}
                              placeholder="Describe your primary duties and responsibilities..."
                              rows={4}
                            />
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Education */}
                <TabsContent value="education">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center text-navy-700">
                          <GraduationCap className="h-6 w-6 mr-3" />
                          Education
                        </CardTitle>
                        <Button onClick={addEducation} variant="outline" size="sm">
                          Add Education
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {resumeData.education.map((edu, index) => (
                        <div key={index} className="p-4 border rounded-lg space-y-4">
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Institution</Label>
                              <Input
                                value={edu.institution}
                                onChange={(e) => {
                                  const newEdu = [...resumeData.education];
                                  newEdu[index].institution = e.target.value;
                                  setResumeData({ ...resumeData, education: newEdu });
                                }}
                                placeholder="University of Texas"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Degree</Label>
                              <Input
                                value={edu.degree}
                                onChange={(e) => {
                                  const newEdu = [...resumeData.education];
                                  newEdu[index].degree = e.target.value;
                                  setResumeData({ ...resumeData, education: newEdu });
                                }}
                                placeholder="Bachelor of Science"
                              />
                            </div>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Field of Study</Label>
                              <Input
                                value={edu.field}
                                onChange={(e) => {
                                  const newEdu = [...resumeData.education];
                                  newEdu[index].field = e.target.value;
                                  setResumeData({ ...resumeData, education: newEdu });
                                }}
                                placeholder="Computer Science"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Graduation Date</Label>
                              <Input
                                type="date"
                                value={edu.graduationDate}
                                onChange={(e) => {
                                  const newEdu = [...resumeData.education];
                                  newEdu[index].graduationDate = e.target.value;
                                  setResumeData({ ...resumeData, education: newEdu });
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Skills */}
                <TabsContent value="skills">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-navy-700">
                        <Star className="h-6 w-6 mr-3" />
                        Skills & Certifications
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label>Skills (comma-separated)</Label>
                        <Textarea
                          value={resumeData.skills.join(", ")}
                          onChange={(e) => setResumeData({
                            ...resumeData,
                            skills: e.target.value.split(", ").filter(skill => skill.trim())
                          })}
                          placeholder="Project Management, Team Leadership, Network Security, Risk Management, Training and Development"
                          rows={4}
                        />
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-navy-700">Certifications</h3>
                          <Button onClick={addCertification} variant="outline" size="sm">
                            Add Certification
                          </Button>
                        </div>

                        {resumeData.certifications.map((cert, index) => (
                          <div key={index} className="p-4 border rounded-lg space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Certification Name</Label>
                                <Input
                                  value={cert.name}
                                  onChange={(e) => {
                                    const newCerts = [...resumeData.certifications];
                                    newCerts[index].name = e.target.value;
                                    setResumeData({ ...resumeData, certifications: newCerts });
                                  }}
                                  placeholder="Security+ Certification"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Issuing Organization</Label>
                                <Input
                                  value={cert.issuer}
                                  onChange={(e) => {
                                    const newCerts = [...resumeData.certifications];
                                    newCerts[index].issuer = e.target.value;
                                    setResumeData({ ...resumeData, certifications: newCerts });
                                  }}
                                  placeholder="CompTIA"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Target Role */}
                <TabsContent value="target">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-navy-700">
                        <Target className="h-6 w-6 mr-3" />
                        Target Role & Industry
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="targetRole">Target Job Title</Label>
                        <Input
                          id="targetRole"
                          value={resumeData.targetRole}
                          onChange={(e) => setResumeData({ ...resumeData, targetRole: e.target.value })}
                          placeholder="Cybersecurity Manager"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="targetIndustry">Target Industry</Label>
                        <Select
                          value={resumeData.targetIndustry}
                          onValueChange={(value) => setResumeData({ ...resumeData, targetIndustry: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select target industry" />
                          </SelectTrigger>
                          <SelectContent>
                            {industries.map(industry => (
                              <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              <div className="flex justify-center">
                <Button 
                  onClick={generateResume}
                  className="bg-navy-600 hover:bg-navy-700 px-8 py-3"
                  disabled={isGenerating || completionPercentage() < 70}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  {isGenerating ? "Generating..." : "Generate AI Resume"}
                </Button>
              </div>
            </div>

            {/* Preview/Results */}
            <div className="space-y-6">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle className="flex items-center text-navy-700">
                    <Eye className="h-6 w-6 mr-3" />
                    Resume Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {generatedResume ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-sage-50 rounded-lg">
                        <h3 className="font-semibold text-navy-700 mb-2">Professional Summary</h3>
                        <p className="text-sm text-navy-600">{generatedResume.professionalSummary}</p>
                      </div>

                      <div className="p-4 bg-military-gold-50 rounded-lg">
                        <h3 className="font-semibold text-navy-700 mb-2">Key Skills</h3>
                        <div className="flex flex-wrap gap-2">
                          {generatedResume.skillsSection.map((skill, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Button className="w-full bg-sage-600 hover:bg-sage-700">
                          <Download className="h-4 w-4 mr-2" />
                          Download PDF
                        </Button>
                        <Button variant="outline" className="w-full">
                          <Eye className="h-4 w-4 mr-2" />
                          View Full Resume
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-600 mb-2">
                        Generate Your Resume
                      </h3>
                      <p className="text-gray-500 text-sm">
                        Complete the form and click generate to see your AI-powered veteran resume
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}