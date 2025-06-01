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
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Brain, 
  Star, 
  Briefcase, 
  Target, 
  TrendingUp,
  CheckCircle,
  Award,
  Users,
  Settings,
  Lightbulb,
  MapPin,
  DollarSign,
  Clock,
  Shield
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface SkillAssessment {
  militaryBranch: string;
  militaryOccupation: string;
  rank: string;
  yearsOfService: number;
  deployments: number;
  leadershipExperience: string[];
  technicalSkills: string[];
  certifications: string[];
  preferredIndustries: string[];
  workEnvironmentPreferences: string[];
  salaryExpectations: string;
  locationPreferences: string;
  jobDescription: string;
  achievements: string;
}

interface CareerRecommendation {
  jobTitle: string;
  industry: string;
  salaryRange: string;
  matchPercentage: number;
  requiredSkills: string[];
  transferableSkills: string[];
  additionalTraining: string[];
  careerPath: string;
  description: string;
}

interface SkillGap {
  skill: string;
  importance: "high" | "medium" | "low";
  timeToLearn: string;
  resources: string[];
}

export default function CareerAssessment() {
  const [assessment, setAssessment] = useState<SkillAssessment>({
    militaryBranch: "",
    militaryOccupation: "",
    rank: "",
    yearsOfService: 0,
    deployments: 0,
    leadershipExperience: [],
    technicalSkills: [],
    certifications: [],
    preferredIndustries: [],
    workEnvironmentPreferences: [],
    salaryExpectations: "",
    locationPreferences: "",
    jobDescription: "",
    achievements: ""
  });

  const [recommendations, setRecommendations] = useState<CareerRecommendation[]>([]);
  const [skillGaps, setSkillGaps] = useState<SkillGap[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const { toast } = useToast();

  const militaryBranches = [
    "Army", "Navy", "Air Force", "Marines", "Coast Guard", "Space Force"
  ];

  const militaryRanks = [
    // Enlisted Ranks
    { value: "E-1", label: "E-1 Private/Seaman Recruit/Airman Basic" },
    { value: "E-2", label: "E-2 Private/Seaman Apprentice/Airman" },
    { value: "E-3", label: "E-3 Private First Class/Seaman/Airman First Class" },
    { value: "E-4", label: "E-4 Specialist/Corporal/Petty Officer 3rd Class/Senior Airman" },
    { value: "E-5", label: "E-5 Sergeant/Petty Officer 2nd Class/Staff Sergeant" },
    { value: "E-6", label: "E-6 Staff Sergeant/Petty Officer 1st Class/Technical Sergeant" },
    { value: "E-7", label: "E-7 Sergeant First Class/Chief Petty Officer/Master Sergeant" },
    { value: "E-8", label: "E-8 Master Sergeant/Senior Chief Petty Officer" },
    { value: "E-9", label: "E-9 Sergeant Major/Master Chief Petty Officer/Chief Master Sergeant" },
    
    // Warrant Officers
    { value: "W-1", label: "W-1 Warrant Officer" },
    { value: "W-2", label: "W-2 Chief Warrant Officer 2" },
    { value: "W-3", label: "W-3 Chief Warrant Officer 3" },
    { value: "W-4", label: "W-4 Chief Warrant Officer 4" },
    { value: "W-5", label: "W-5 Chief Warrant Officer 5" },
    
    // Officers
    { value: "O-1", label: "O-1 Second Lieutenant/Ensign" },
    { value: "O-2", label: "O-2 First Lieutenant/Lieutenant Junior Grade" },
    { value: "O-3", label: "O-3 Captain/Lieutenant" },
    { value: "O-4", label: "O-4 Major/Lieutenant Commander" },
    { value: "O-5", label: "O-5 Lieutenant Colonel/Commander" },
    { value: "O-6", label: "O-6 Colonel/Captain" },
    { value: "O-7", label: "O-7 Brigadier General/Rear Admiral (Lower Half)" },
    { value: "O-8", label: "O-8 Major General/Rear Admiral" },
    { value: "O-9", label: "O-9 Lieutenant General/Vice Admiral" },
    { value: "O-10", label: "O-10 General/Admiral" }
  ];

  const leadershipOptions = [
    "Squad/Team Leader", "Section Leader", "Platoon Sergeant", "First Sergeant",
    "Company Commander", "Battalion Staff", "Training Instructor", "Supervisor",
    "Project Manager", "Operations Manager", "Safety Officer", "Quality Control"
  ];

  const technicalSkillsOptions = [
    "Computer Systems", "Network Administration", "Cybersecurity", "Electronics",
    "Mechanical Systems", "Aviation Maintenance", "Medical/Healthcare", "Logistics",
    "Communications", "Intelligence Analysis", "Weapons Systems", "Vehicle Maintenance",
    "Construction/Engineering", "Supply Chain", "Finance/Accounting", "Human Resources"
  ];

  const industryOptions = [
    "Technology/IT", "Healthcare", "Government/Defense", "Manufacturing",
    "Transportation/Logistics", "Construction", "Finance", "Education",
    "Energy/Utilities", "Aerospace", "Automotive", "Consulting"
  ];

  const workEnvironmentOptions = [
    "Remote Work", "Office Environment", "Fieldwork", "Travel Required",
    "Team Collaboration", "Independent Work", "High-Security Clearance",
    "Government/Public Sector", "Private Sector", "Non-Profit"
  ];

  const handleSkillToggle = (skill: string, category: keyof Pick<SkillAssessment, 'leadershipExperience' | 'technicalSkills' | 'preferredIndustries' | 'workEnvironmentPreferences'>) => {
    setAssessment(prev => ({
      ...prev,
      [category]: prev[category].includes(skill)
        ? prev[category].filter(s => s !== skill)
        : [...prev[category], skill]
    }));
  };

  const analyzeCareerTransition = async () => {
    if (!assessment.militaryOccupation || !assessment.militaryBranch) {
      toast({
        title: "Incomplete Information",
        description: "Please fill in your military branch and occupation before analyzing.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setCurrentStep(0);
    
    try {
      // Simulate analysis steps
      const steps = [
        "Analyzing military experience...",
        "Mapping transferable skills...",
        "Identifying career matches...",
        "Calculating skill gaps...",
        "Generating recommendations..."
      ];

      for (let i = 0; i < steps.length; i++) {
        setCurrentStep(i);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      const response = await apiRequest("POST", "/api/analyze-career-transition", {
        assessment
      });

      const data = await response.json();
      setRecommendations(data.recommendations || []);
      setSkillGaps(data.skillGaps || []);
      setAnalysisComplete(true);
      
      toast({
        title: "Analysis Complete",
        description: "Your career transition assessment is ready!",
      });
    } catch (error) {
      console.error("Career analysis error:", error);
      toast({
        title: "Analysis Error",
        description: "Unable to complete career analysis. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getMatchColor = (percentage: number) => {
    if (percentage >= 85) return "text-green-600 bg-green-50 border-green-200";
    if (percentage >= 70) return "text-military-gold-600 bg-military-gold-50 border-military-gold-200";
    return "text-sage-600 bg-sage-50 border-sage-200";
  };

  const getSkillGapColor = (importance: string) => {
    switch (importance) {
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
                <Brain className="h-12 w-12 text-navy-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-navy-700 mb-4">
              AI-Powered Career Transition Assessment
            </h1>
            <p className="text-xl text-navy-600 max-w-3xl mx-auto mb-8">
              Translate your military experience into civilian career opportunities. 
              Get personalized recommendations based on your skills, experience, and preferences.
            </p>
            <div className="flex justify-center space-x-4">
              <Badge className="bg-military-gold-100 text-military-gold-800 px-4 py-2">
                <Target className="h-4 w-4 mr-1" />
                Skill Translation
              </Badge>
              <Badge className="bg-navy-100 text-navy-800 px-4 py-2">
                <Brain className="h-4 w-4 mr-1" />
                AI-Powered Analysis
              </Badge>
            </div>
          </div>

          {/* Security Reminder */}
          <SecurityReminder />

          <Tabs defaultValue="assessment" className="space-y-8">
            <div className="flex justify-center">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="assessment">Skill Assessment</TabsTrigger>
                <TabsTrigger value="results">Career Recommendations</TabsTrigger>
              </TabsList>
            </div>

            {/* Assessment Tab */}
            <TabsContent value="assessment" className="space-y-8">
              {isAnalyzing && (
                <Card className="bg-gradient-to-r from-navy-50 to-military-gold-50 border-navy-200">
                  <CardContent className="p-8 text-center">
                    <div className="flex justify-center mb-4">
                      <div className="relative">
                        <Brain className="h-12 w-12 text-navy-600" />
                        <div className="absolute inset-0 rounded-full border-4 border-military-gold-200 animate-spin border-t-military-gold-500"></div>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-navy-700 mb-2">
                      Analyzing Your Career Transition
                    </h3>
                    <p className="text-navy-600 mb-4">
                      AI is processing your military experience and identifying career opportunities...
                    </p>
                    <Progress value={(currentStep + 1) * 20} className="mb-4" />
                    <p className="text-sm text-navy-500">
                      Step {currentStep + 1} of 5: {
                        ["Analyzing military experience", "Mapping transferable skills", "Identifying career matches", "Calculating skill gaps", "Generating recommendations"][currentStep]
                      }
                    </p>
                  </CardContent>
                </Card>
              )}

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Military Background */}
                <Card className="bg-gradient-to-br from-navy-50 to-white">
                  <CardHeader>
                    <CardTitle className="flex items-center text-navy-700">
                      <Shield className="h-6 w-6 mr-3" />
                      Military Background
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="branch">Military Branch</Label>
                      <Select value={assessment.militaryBranch} onValueChange={(value) => setAssessment({...assessment, militaryBranch: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your branch" />
                        </SelectTrigger>
                        <SelectContent>
                          {militaryBranches.map(branch => (
                            <SelectItem key={branch} value={branch}>{branch}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="occupation">Military Occupation/MOS</Label>
                      <Input
                        id="occupation"
                        value={assessment.militaryOccupation}
                        onChange={(e) => setAssessment({...assessment, militaryOccupation: e.target.value})}
                        placeholder="e.g., 25B Information Technology Specialist"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="rank">Rank at Discharge/Retirement</Label>
                        <Select value={assessment.rank} onValueChange={(value) => setAssessment({...assessment, rank: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your rank" />
                          </SelectTrigger>
                          <SelectContent>
                            {militaryRanks.map(rank => (
                              <SelectItem key={rank.value} value={rank.value}>{rank.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="years">Years of Service</Label>
                        <Input
                          id="years"
                          type="number"
                          min="0"
                          max="40"
                          value={assessment.yearsOfService}
                          onChange={(e) => setAssessment({...assessment, yearsOfService: parseInt(e.target.value) || 0})}
                          placeholder="e.g., 27"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="deployments">Number of Deployments</Label>
                      <Input
                        id="deployments"
                        type="number"
                        value={assessment.deployments}
                        onChange={(e) => setAssessment({...assessment, deployments: parseInt(e.target.value) || 0})}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Experience & Skills */}
                <Card className="bg-gradient-to-br from-sage-50 to-white">
                  <CardHeader>
                    <CardTitle className="flex items-center text-navy-700">
                      <Award className="h-6 w-6 mr-3" />
                      Experience & Skills
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <Label>Leadership Experience</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {leadershipOptions.map(option => (
                          <div key={option} className="flex items-center space-x-2">
                            <Checkbox
                              id={option}
                              checked={assessment.leadershipExperience.includes(option)}
                              onCheckedChange={() => handleSkillToggle(option, 'leadershipExperience')}
                            />
                            <Label htmlFor={option} className="text-sm">{option}</Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label>Technical Skills</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {technicalSkillsOptions.map(option => (
                          <div key={option} className="flex items-center space-x-2">
                            <Checkbox
                              id={option}
                              checked={assessment.technicalSkills.includes(option)}
                              onCheckedChange={() => handleSkillToggle(option, 'technicalSkills')}
                            />
                            <Label htmlFor={option} className="text-sm">{option}</Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="certifications">Certifications & Training</Label>
                      <Textarea
                        id="certifications"
                        value={assessment.certifications.join(", ")}
                        onChange={(e) => setAssessment({...assessment, certifications: e.target.value.split(", ").filter(cert => cert.trim())})}
                        placeholder="e.g., Security+, PMP, CISSP, Commercial Driver's License"
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Career Preferences */}
              <Card className="bg-gradient-to-br from-military-gold-50 to-white">
                <CardHeader>
                  <CardTitle className="flex items-center text-navy-700">
                    <Target className="h-6 w-6 mr-3" />
                    Career Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid lg:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <Label>Preferred Industries</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {industryOptions.map(option => (
                          <div key={option} className="flex items-center space-x-2">
                            <Checkbox
                              id={option}
                              checked={assessment.preferredIndustries.includes(option)}
                              onCheckedChange={() => handleSkillToggle(option, 'preferredIndustries')}
                            />
                            <Label htmlFor={option} className="text-sm">{option}</Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label>Work Environment Preferences</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {workEnvironmentOptions.map(option => (
                          <div key={option} className="flex items-center space-x-2">
                            <Checkbox
                              id={option}
                              checked={assessment.workEnvironmentPreferences.includes(option)}
                              onCheckedChange={() => handleSkillToggle(option, 'workEnvironmentPreferences')}
                            />
                            <Label htmlFor={option} className="text-sm">{option}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="salary">Salary Expectations</Label>
                      <Select value={assessment.salaryExpectations} onValueChange={(value) => setAssessment({...assessment, salaryExpectations: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select salary range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="40000-60000">$40,000 - $60,000</SelectItem>
                          <SelectItem value="60000-80000">$60,000 - $80,000</SelectItem>
                          <SelectItem value="80000-100000">$80,000 - $100,000</SelectItem>
                          <SelectItem value="100000-120000">$100,000 - $120,000</SelectItem>
                          <SelectItem value="120000+">$120,000+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Location Preferences</Label>
                      <Input
                        id="location"
                        value={assessment.locationPreferences}
                        onChange={(e) => setAssessment({...assessment, locationPreferences: e.target.value})}
                        placeholder="e.g., Texas, Remote, Major Cities"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Describe Your Ideal Job</Label>
                    <Textarea
                      id="description"
                      value={assessment.jobDescription}
                      onChange={(e) => setAssessment({...assessment, jobDescription: e.target.value})}
                      placeholder="Describe what type of work environment, responsibilities, and career growth you're looking for..."
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="achievements">Key Military Achievements</Label>
                    <Textarea
                      id="achievements"
                      value={assessment.achievements}
                      onChange={(e) => setAssessment({...assessment, achievements: e.target.value})}
                      placeholder="Awards, commendations, special projects, leadership accomplishments..."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-center">
                <Button 
                  onClick={analyzeCareerTransition}
                  className="bg-navy-600 hover:bg-navy-700 px-8 py-3"
                  disabled={isAnalyzing || !assessment.militaryOccupation}
                >
                  <Brain className="h-4 w-4 mr-2" />
                  {isAnalyzing ? "Analyzing..." : "Analyze Career Transition"}
                </Button>
              </div>
            </TabsContent>

            {/* Results Tab */}
            <TabsContent value="results" className="space-y-8">
              {!analysisComplete ? (
                <div className="text-center py-12">
                  <Brain className="h-16 w-16 text-navy-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-navy-700 mb-2">Ready for Analysis</h3>
                  <p className="text-navy-600">Complete your assessment and generate career recommendations.</p>
                </div>
              ) : (
                <>
                  {/* Career Recommendations */}
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-navy-700 text-center">Career Recommendations</h2>
                    <div className="grid gap-6">
                      {recommendations.map((rec, index) => (
                        <Card key={index} className={`${getMatchColor(rec.matchPercentage)} hover:shadow-lg transition-shadow`}>
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div>
                                <CardTitle className="text-xl text-navy-700">{rec.jobTitle}</CardTitle>
                                <p className="text-navy-600">{rec.industry}</p>
                              </div>
                              <div className="text-right">
                                <Badge className={`${getMatchColor(rec.matchPercentage)} mb-2`}>
                                  {rec.matchPercentage}% Match
                                </Badge>
                                <p className="text-sm font-semibold">{rec.salaryRange}</p>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <p className="text-navy-600">{rec.description}</p>
                            
                            <div className="grid md:grid-cols-3 gap-4">
                              <div>
                                <h4 className="font-semibold text-navy-700 mb-2">Transferable Skills</h4>
                                <div className="flex flex-wrap gap-1">
                                  {rec.transferableSkills.map((skill, skillIndex) => (
                                    <Badge key={skillIndex} variant="outline" className="bg-sage-50 text-sage-700">
                                      {skill}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              
                              <div>
                                <h4 className="font-semibold text-navy-700 mb-2">Required Skills</h4>
                                <div className="flex flex-wrap gap-1">
                                  {rec.requiredSkills.map((skill, skillIndex) => (
                                    <Badge key={skillIndex} variant="outline" className="bg-navy-50 text-navy-700">
                                      {skill}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              
                              <div>
                                <h4 className="font-semibold text-navy-700 mb-2">Additional Training</h4>
                                <div className="flex flex-wrap gap-1">
                                  {rec.additionalTraining.map((training, trainingIndex) => (
                                    <Badge key={trainingIndex} variant="outline" className="bg-military-gold-50 text-military-gold-700">
                                      {training}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                            
                            <div className="p-3 bg-white rounded-lg">
                              <h4 className="font-semibold text-navy-700 mb-2">Career Path</h4>
                              <p className="text-navy-600 text-sm">{rec.careerPath}</p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Skill Gaps */}
                  {skillGaps.length > 0 && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold text-navy-700 text-center">Skill Development Plan</h2>
                      <div className="grid md:grid-cols-2 gap-6">
                        {skillGaps.map((gap, index) => (
                          <Card key={index} className={`${getSkillGapColor(gap.importance)} hover:shadow-lg transition-shadow`}>
                            <CardHeader>
                              <div className="flex items-center justify-between">
                                <CardTitle className="text-lg text-navy-700">{gap.skill}</CardTitle>
                                <Badge variant="outline" className={`${
                                  gap.importance === 'high' ? 'border-red-400 text-red-700' : 
                                  gap.importance === 'medium' ? 'border-military-gold-400 text-military-gold-700' :
                                  'border-sage-400 text-sage-700'
                                }`}>
                                  {gap.importance} priority
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="flex items-center space-x-2">
                                <Clock className="h-4 w-4 text-navy-500" />
                                <span className="text-sm text-navy-600">Time to learn: {gap.timeToLearn}</span>
                              </div>
                              
                              <div>
                                <h4 className="font-semibold text-navy-700 mb-2">Learning Resources</h4>
                                <ul className="space-y-1">
                                  {gap.resources.map((resource, resourceIndex) => (
                                    <li key={resourceIndex} className="text-sm text-navy-600 flex items-start">
                                      <CheckCircle className="h-3 w-3 text-sage-500 mr-2 mt-1 flex-shrink-0" />
                                      {resource}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}