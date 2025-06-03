import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useBranch } from "@/contexts/BranchContext";
import RankPayGradeSelector from "@/components/rank-pay-grade-selector";
import { useToast } from "@/hooks/use-toast";

interface VeteranServiceRequest {
  serviceType: string;
  branchOfService: string;
  rank: {payGrade: string; rank: string; abbreviation: string} | null;
  yearsOfService: string;
  serviceDescription: string;
  contactInfo: string;
}

interface VeteransServicesWithRankProps {
  serviceType: string;
  title: string;
  description: string;
  requiresRank?: boolean;
}

export default function VeteransServicesWithRank({ 
  serviceType, 
  title, 
  description, 
  requiresRank = true 
}: VeteransServicesWithRankProps) {
  const { branchTheme, getTerminology } = useBranch();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<VeteranServiceRequest>({
    serviceType,
    branchOfService: branchTheme.id,
    rank: null,
    yearsOfService: '',
    serviceDescription: '',
    contactInfo: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRankSelect = (rank: {payGrade: string; rank: string; abbreviation: string}) => {
    setFormData(prev => ({ ...prev, rank }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (requiresRank && !formData.rank) {
      toast({
        title: "Rank Required",
        description: `Please select your ${getTerminology('personnel').slice(0, -1).toLowerCase()} rank to proceed.`,
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate service request submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Service Request Submitted",
        description: `Your ${title.toLowerCase()} request has been submitted successfully. You will be contacted within 24-48 hours.`
      });
      
      // Reset form
      setFormData({
        serviceType,
        branchOfService: branchTheme.id,
        rank: null,
        yearsOfService: '',
        serviceDescription: '',
        contactInfo: ''
      });
      
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Service Overview */}
      <Card style={{ borderColor: `hsl(${branchTheme.colors.primary} / 0.2)` }}>
        <CardHeader>
          <CardTitle 
            className="text-2xl flex items-center space-x-3"
            style={{ color: `hsl(${branchTheme.colors.primary})` }}
          >
            <span>{title}</span>
            <Badge variant="outline" style={{ 
              borderColor: `hsl(${branchTheme.colors.primary})`,
              color: `hsl(${branchTheme.colors.primary})`
            }}>
              {branchTheme.name}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 leading-relaxed">{description}</p>
          <div className="mt-4 p-4 rounded-lg" style={{ backgroundColor: `hsl(${branchTheme.colors.primary} / 0.05)` }}>
            <p className="text-sm" style={{ color: `hsl(${branchTheme.colors.primary})` }}>
              <strong>For {getTerminology('personnel')}:</strong> This service is specifically tailored for {branchTheme.name} {getTerminology('personnel').toLowerCase()} and includes branch-specific requirements and terminology.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Service Request Form */}
      <Card>
        <CardHeader>
          <CardTitle>Submit Service Request</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Rank and Pay Grade Selection */}
            {requiresRank && (
              <RankPayGradeSelector
                onRankSelect={handleRankSelect}
                selectedRank={formData.rank}
                required={true}
                className="w-full"
              />
            )}

            {/* Years of Service */}
            <div className="space-y-2">
              <Label htmlFor="years-service">Years of Service *</Label>
              <Input
                id="years-service"
                type="number"
                min="0"
                max="50"
                value={formData.yearsOfService}
                onChange={(e) => setFormData(prev => ({ ...prev, yearsOfService: e.target.value }))}
                placeholder="Enter total years of military service"
                required
              />
            </div>

            {/* Service Description */}
            <div className="space-y-2">
              <Label htmlFor="service-description">
                Service Description *
              </Label>
              <Textarea
                id="service-description"
                value={formData.serviceDescription}
                onChange={(e) => setFormData(prev => ({ ...prev, serviceDescription: e.target.value }))}
                placeholder={`Describe your service history, specialties, deployments, and any relevant details for ${title.toLowerCase()}...`}
                rows={4}
                required
              />
            </div>

            {/* Contact Information */}
            <div className="space-y-2">
              <Label htmlFor="contact-info">Contact Information *</Label>
              <Input
                id="contact-info"
                type="email"
                value={formData.contactInfo}
                onChange={(e) => setFormData(prev => ({ ...prev, contactInfo: e.target.value }))}
                placeholder="Enter your email address"
                required
              />
            </div>

            {/* Service Summary */}
            {formData.rank && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Request Summary:</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Service:</span> {title}
                  </div>
                  <div>
                    <span className="font-medium">Branch:</span> {branchTheme.name}
                  </div>
                  <div>
                    <span className="font-medium">Rank:</span> {formData.rank.payGrade} - {formData.rank.rank}
                  </div>
                  <div>
                    <span className="font-medium">Years:</span> {formData.yearsOfService || 'Not specified'}
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full"
              disabled={isSubmitting}
              style={{ 
                backgroundColor: `hsl(${branchTheme.colors.primary})`,
                borderColor: `hsl(${branchTheme.colors.primary})`
              }}
            >
              {isSubmitting ? 'Submitting Request...' : `Submit ${title} Request`}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Additional Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">What to Expect</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: `hsl(${branchTheme.colors.primary})` }}></div>
              <div>
                <strong>Initial Review:</strong> Your request will be reviewed by specialists familiar with {branchTheme.name} service requirements.
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: `hsl(${branchTheme.colors.primary})` }}></div>
              <div>
                <strong>Verification:</strong> Your rank and service history will be verified through appropriate channels.
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: `hsl(${branchTheme.colors.primary})` }}></div>
              <div>
                <strong>Response Time:</strong> Most requests receive initial contact within 24-48 hours.
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: `hsl(${branchTheme.colors.primary})` }}></div>
              <div>
                <strong>Follow-up:</strong> You'll receive updates throughout the process via your provided contact information.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}