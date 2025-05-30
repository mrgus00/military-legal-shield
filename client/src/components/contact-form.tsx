import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Phone, MessageCircle, Mail, AlertTriangle, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { InsertConsultation } from "@shared/schema";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    branch: "",
    issueType: "",
    description: "",
    email: "",
    phone: ""
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const consultationMutation = useMutation({
    mutationFn: async (data: InsertConsultation) => {
      return await apiRequest("POST", "/api/consultations", data);
    },
    onSuccess: () => {
      toast({
        title: "Consultation Request Submitted",
        description: "A legal expert will contact you within 24 hours.",
      });
      setFormData({
        firstName: "",
        lastName: "",
        branch: "",
        issueType: "",
        description: "",
        email: "",
        phone: ""
      });
      queryClient.invalidateQueries({ queryKey: ["/api/consultations"] });
    },
    onError: () => {
      toast({
        title: "Submission Failed",
        description: "Please try again or contact support directly.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.branch || 
        !formData.issueType || !formData.description || !formData.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    consultationMutation.mutate(formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <h3 className="text-3xl font-bold mb-6">Need Immediate Legal Assistance?</h3>
          <p className="text-xl text-gray-300 mb-8">
            Our support team and legal experts are available 24/7 to help you navigate urgent military legal matters.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-military-gold-500 rounded-lg flex items-center justify-center mr-4">
                <Phone className="text-navy-800 w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold">Emergency Hotline</h4>
                <p className="text-gray-300">1-800-MIL-LEGAL (24/7)</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="w-12 h-12 bg-military-gold-500 rounded-lg flex items-center justify-center mr-4">
                <MessageCircle className="text-navy-800 w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold">Live Chat Support</h4>
                <p className="text-gray-300">Instant help with platform questions</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="w-12 h-12 bg-military-gold-500 rounded-lg flex items-center justify-center mr-4">
                <Mail className="text-navy-800 w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold">Secure Messaging</h4>
                <p className="text-gray-300">Private attorney communications</p>
              </div>
            </div>
          </div>
        </div>
        
        <Card className="bg-white text-gray-900">
          <CardContent className="p-8">
            <h4 className="text-2xl font-bold mb-6">Request Legal Consultation</h4>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <Input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <Input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Branch of Service *
                  </label>
                  <Select value={formData.branch} onValueChange={(value) => handleInputChange("branch", value)}>
                    <SelectTrigger className="w-full px-4 py-3 border border-gray-300 rounded-lg">
                      <SelectValue placeholder="Select Branch" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Army">Army</SelectItem>
                      <SelectItem value="Navy">Navy</SelectItem>
                      <SelectItem value="Air Force">Air Force</SelectItem>
                      <SelectItem value="Marines">Marines</SelectItem>
                      <SelectItem value="Coast Guard">Coast Guard</SelectItem>
                      <SelectItem value="Space Force">Space Force</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Legal Issue Type *
                  </label>
                  <Select value={formData.issueType} onValueChange={(value) => handleInputChange("issueType", value)}>
                    <SelectTrigger className="w-full px-4 py-3 border border-gray-300 rounded-lg">
                      <SelectValue placeholder="Select Issue Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Court-Martial">Court-Martial</SelectItem>
                      <SelectItem value="Administrative Action">Administrative Action</SelectItem>
                      <SelectItem value="Security Clearance">Security Clearance</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number (Optional)
                </label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brief Description *
                </label>
                <Textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                  placeholder="Please provide a brief, non-sensitive description of your legal situation..."
                  required
                />
              </div>
              
              <Alert className="bg-yellow-50 border border-yellow-200">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800">
                  <div>
                    <div className="font-medium">Important Notice</div>
                    <p className="text-sm mt-1">Do not include classified or sensitive information in this form. This is an initial consultation request only.</p>
                  </div>
                </AlertDescription>
              </Alert>
              
              <Button 
                type="submit" 
                disabled={consultationMutation.isPending}
                className="w-full bg-navy-800 hover:bg-navy-900 text-white py-3 px-4 rounded-lg font-medium transition-colors"
              >
                {consultationMutation.isPending ? "Submitting..." : "Request Consultation"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
