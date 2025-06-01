import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Flag, Star, Shield, Award, Calendar, MapPin } from "lucide-react";

interface VeteranProfile {
  branch: string;
  rankAtDischarge: string;
  yearsOfService: number;
  dischargeType: string;
  deployments: number;
  specialties: string[];
  vaDisability: number;
  priorityNeeds: string[];
  location: {
    state: string;
    vaRegion: string;
  };
}

interface VeteranProfileSetupProps {
  onComplete: (profile: VeteranProfile) => void;
  initialProfile?: Partial<VeteranProfile>;
}

export default function VeteranProfileSetup({ onComplete, initialProfile }: VeteranProfileSetupProps) {
  const [profile, setProfile] = useState<VeteranProfile>({
    branch: initialProfile?.branch || "",
    rankAtDischarge: initialProfile?.rankAtDischarge || "",
    yearsOfService: initialProfile?.yearsOfService || 0,
    dischargeType: initialProfile?.dischargeType || "",
    deployments: initialProfile?.deployments || 0,
    specialties: initialProfile?.specialties || [],
    vaDisability: initialProfile?.vaDisability || 0,
    priorityNeeds: initialProfile?.priorityNeeds || [],
    location: {
      state: initialProfile?.location?.state || "",
      vaRegion: initialProfile?.location?.vaRegion || ""
    }
  });

  const branches = [
    "Army", "Navy", "Air Force", "Marines", "Coast Guard", "Space Force"
  ];

  const dischargeTypes = [
    "Honorable", "General under Honorable Conditions", "Other than Honorable", 
    "Bad Conduct", "Dishonorable", "Medical Retirement"
  ];

  const militarySpecialties = [
    "Infantry/Combat Arms", "Aviation", "Intelligence", "Communications",
    "Medical/Healthcare", "Engineering", "Logistics/Supply", "Military Police",
    "Special Operations", "Nuclear", "Cybersecurity", "Administration"
  ];

  const priorityNeedsOptions = [
    "VA Disability Claims", "Employment Assistance", "Housing Support",
    "Education Benefits", "Healthcare Access", "Mental Health Services",
    "Financial Assistance", "Legal Representation", "Family Support"
  ];

  const vaRegions = [
    "Northeast", "Southeast", "Midwest", "Southwest", "West", "Pacific"
  ];

  const handleSpecialtyChange = (specialty: string, checked: boolean) => {
    setProfile(prev => ({
      ...prev,
      specialties: checked 
        ? [...prev.specialties, specialty]
        : prev.specialties.filter(s => s !== specialty)
    }));
  };

  const handlePriorityNeedChange = (need: string, checked: boolean) => {
    setProfile(prev => ({
      ...prev,
      priorityNeeds: checked
        ? [...prev.priorityNeeds, need]
        : prev.priorityNeeds.filter(n => n !== need)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(profile);
  };

  const getBranchIcon = () => {
    switch (profile.branch.toLowerCase()) {
      case "army": return <Star className="h-5 w-5 text-military-gold-600" />;
      case "navy": return <Shield className="h-5 w-5 text-navy-600" />;
      case "air force": return <Award className="h-5 w-5 text-sage-600" />;
      case "marines": return <Flag className="h-5 w-5 text-red-600" />;
      case "coast guard": return <Shield className="h-5 w-5 text-warm-gray-600" />;
      case "space force": return <Star className="h-5 w-5 text-military-gold-600" />;
      default: return <Flag className="h-5 w-5 text-navy-600" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="bg-gradient-to-br from-navy-50 to-white border-navy-200">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-military-gold-100 rounded-full">
              <Flag className="h-8 w-8 text-military-gold-600" />
            </div>
          </div>
          <CardTitle className="text-2xl text-navy-700">Veteran Profile Setup</CardTitle>
          <p className="text-navy-600">
            Help us tailor your experience with veteran-specific resources and services
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Military Service Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-navy-700 flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Military Service History
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="branch">Branch of Service</Label>
                  <Select value={profile.branch} onValueChange={(value) => setProfile({...profile, branch: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your branch" />
                    </SelectTrigger>
                    <SelectContent>
                      {branches.map(branch => (
                        <SelectItem key={branch} value={branch}>{branch}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {profile.branch && (
                    <div className="flex items-center mt-2">
                      {getBranchIcon()}
                      <span className="ml-2 text-sm text-navy-600">{profile.branch} Veteran</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rank">Rank at Discharge</Label>
                  <Input
                    id="rank"
                    value={profile.rankAtDischarge}
                    onChange={(e) => setProfile({...profile, rankAtDischarge: e.target.value})}
                    placeholder="e.g., E-5, O-3, W-2"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="years">Years of Service</Label>
                  <Input
                    id="years"
                    type="number"
                    min="0"
                    max="50"
                    value={profile.yearsOfService}
                    onChange={(e) => setProfile({...profile, yearsOfService: parseInt(e.target.value) || 0})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discharge">Discharge Type</Label>
                  <Select value={profile.dischargeType} onValueChange={(value) => setProfile({...profile, dischargeType: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select discharge type" />
                    </SelectTrigger>
                    <SelectContent>
                      {dischargeTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deployments">Number of Deployments</Label>
                  <Input
                    id="deployments"
                    type="number"
                    min="0"
                    max="20"
                    value={profile.deployments}
                    onChange={(e) => setProfile({...profile, deployments: parseInt(e.target.value) || 0})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="disability">VA Disability Rating (%)</Label>
                  <Input
                    id="disability"
                    type="number"
                    min="0"
                    max="100"
                    step="10"
                    value={profile.vaDisability}
                    onChange={(e) => setProfile({...profile, vaDisability: parseInt(e.target.value) || 0})}
                    placeholder="0-100"
                  />
                </div>
              </div>
            </div>

            {/* Military Specialties */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-navy-700 flex items-center">
                <Award className="h-5 w-5 mr-2" />
                Military Specialties & Experience
              </h3>
              <div className="grid md:grid-cols-3 gap-3">
                {militarySpecialties.map(specialty => (
                  <div key={specialty} className="flex items-center space-x-2">
                    <Checkbox
                      id={specialty}
                      checked={profile.specialties.includes(specialty)}
                      onCheckedChange={(checked) => handleSpecialtyChange(specialty, checked as boolean)}
                    />
                    <Label htmlFor={specialty} className="text-sm">{specialty}</Label>
                  </div>
                ))}
              </div>
              {profile.specialties.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {profile.specialties.map(specialty => (
                    <Badge key={specialty} variant="outline" className="bg-military-gold-50 border-military-gold-200">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Location Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-navy-700 flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Location & VA Region
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={profile.location.state}
                    onChange={(e) => setProfile({
                      ...profile, 
                      location: {...profile.location, state: e.target.value}
                    })}
                    placeholder="e.g., California, Texas"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vaRegion">VA Region</Label>
                  <Select 
                    value={profile.location.vaRegion} 
                    onValueChange={(value) => setProfile({
                      ...profile,
                      location: {...profile.location, vaRegion: value}
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select VA region" />
                    </SelectTrigger>
                    <SelectContent>
                      {vaRegions.map(region => (
                        <SelectItem key={region} value={region}>{region}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Priority Needs */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-navy-700 flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Priority Support Needs
              </h3>
              <p className="text-sm text-navy-600">Select your most urgent needs for personalized assistance</p>
              <div className="grid md:grid-cols-3 gap-3">
                {priorityNeedsOptions.map(need => (
                  <div key={need} className="flex items-center space-x-2">
                    <Checkbox
                      id={need}
                      checked={profile.priorityNeeds.includes(need)}
                      onCheckedChange={(checked) => handlePriorityNeedChange(need, checked as boolean)}
                    />
                    <Label htmlFor={need} className="text-sm">{need}</Label>
                  </div>
                ))}
              </div>
              {profile.priorityNeeds.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {profile.priorityNeeds.map(need => (
                    <Badge key={need} variant="outline" className="bg-sage-50 border-sage-200">
                      {need}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-center pt-6">
              <Button 
                type="submit" 
                className="bg-navy-600 hover:bg-navy-700 px-8 py-3"
                disabled={!profile.branch || !profile.dischargeType}
              >
                <Flag className="h-4 w-4 mr-2" />
                Complete Veteran Profile
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}