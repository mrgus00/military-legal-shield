import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Phone, Video, Users, Clock, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { InsertEmergencyConsultation } from "@shared/schema";
import { insertEmergencyConsultationSchema } from "@shared/schema";

export default function EmergencyConsultation() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const form = useForm<InsertEmergencyConsultation>({
    resolver: zodResolver(insertEmergencyConsultationSchema),
    defaultValues: {
      urgencyLevel: "urgent",
      contactMethod: "phone",
      priorAttorney: false,
    },
  });

  const submitConsultation = useMutation({
    mutationFn: async (data: InsertEmergencyConsultation) => {
      return await apiRequest("POST", "/api/emergency-consultation", data);
    },
    onSuccess: () => {
      setIsSubmitted(true);
      toast({
        title: "Emergency Consultation Requested",
        description: "An attorney will contact you within 30 minutes for immediate cases, or as soon as possible for urgent matters.",
      });
    },
    onError: (error) => {
      toast({
        title: "Booking Failed",
        description: error.message || "Please try again or call our emergency hotline.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertEmergencyConsultation) => {
    submitConsultation.mutate(data);
  };

  if (isSubmitted) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-green-800 dark:text-green-200">Emergency Consultation Submitted</CardTitle>
            <CardDescription className="text-green-700 dark:text-green-300">
              Your request has been received and is being processed
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-2">
              <p className="text-sm text-green-700 dark:text-green-300">
                <strong>Response Time:</strong> Within 30 minutes for immediate cases
              </p>
              <p className="text-sm text-green-700 dark:text-green-300">
                An experienced military defense attorney will contact you shortly
              </p>
            </div>
            <div className="border-t border-green-200 dark:border-green-800 pt-4">
              <p className="text-xs text-green-600 dark:text-green-400 text-center">
                Emergency Hotline: (800) LEGAL-MIL | Available 24/7 for immediate assistance
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Emergency Alert Banner */}
        <Card className="border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800 mb-6">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-red-800 dark:text-red-200">Emergency Legal Consultation</h3>
                <p className="text-sm text-red-700 dark:text-red-300">
                  For immediate threats to your military career, freedom, or when facing court-martial proceedings
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* One-Click Booking Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <span>Urgent Legal Assistance Request</span>
            </CardTitle>
            <CardDescription>
              Fill out this form for immediate attorney matching and consultation booking
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Your full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="rank"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Military Rank</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., SFC, CPT, SSGT" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Military Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="branch"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Military Branch *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your branch" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Army">Army</SelectItem>
                            <SelectItem value="Navy">Navy</SelectItem>
                            <SelectItem value="Air Force">Air Force</SelectItem>
                            <SelectItem value="Marines">Marines</SelectItem>
                            <SelectItem value="Coast Guard">Coast Guard</SelectItem>
                            <SelectItem value="Space Force">Space Force</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="unit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unit/Base</FormLabel>
                        <FormControl>
                          <Input placeholder="Current unit or base" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number *</FormLabel>
                        <FormControl>
                          <Input placeholder="Your phone number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address *</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="your.email@mil or personal" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Legal Issue Details */}
                <FormField
                  control={form.control}
                  name="legalIssueType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type of Legal Issue *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select the type of legal issue" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="court-martial">Court-Martial</SelectItem>
                          <SelectItem value="administrative">Administrative Action</SelectItem>
                          <SelectItem value="security-clearance">Security Clearance Issue</SelectItem>
                          <SelectItem value="meb-peb">MEB/PEB Proceedings</SelectItem>
                          <SelectItem value="discharge">Discharge Issues</SelectItem>
                          <SelectItem value="finance">Military Finance/Pay</SelectItem>
                          <SelectItem value="family">Family Law</SelectItem>
                          <SelectItem value="landlord-tenant">Housing/Rental</SelectItem>
                          <SelectItem value="criminal">Criminal Law</SelectItem>
                          <SelectItem value="other">Other Legal Matter</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="urgencyLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Urgency Level *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="How urgent is your situation?" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="immediate">Immediate (within hours)</SelectItem>
                          <SelectItem value="urgent">Urgent (within 24 hours)</SelectItem>
                          <SelectItem value="priority">Priority (within 2-3 days)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="issueDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Issue Description *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Briefly describe your legal situation (minimum 50 characters). Include any deadlines or time constraints."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Consultation Preferences */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location/Base *</FormLabel>
                        <FormControl>
                          <Input placeholder="Base or city/state for attorney matching" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contactMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred Contact Method *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="How should we contact you?" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="phone">
                              <div className="flex items-center space-x-2">
                                <Phone className="w-4 h-4" />
                                <span>Phone Call</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="video">
                              <div className="flex items-center space-x-2">
                                <Video className="w-4 h-4" />
                                <span>Video Call</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="in-person">
                              <div className="flex items-center space-x-2">
                                <Users className="w-4 h-4" />
                                <span>In-Person Meeting</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="timeConstraints"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time Constraints/Deadlines</FormLabel>
                      <FormControl>
                        <Input placeholder="Court dates, deadlines, or other time-sensitive factors" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold"
                  disabled={submitConsultation.isPending}
                >
                  {submitConsultation.isPending ? "Submitting..." : "Request Emergency Consultation"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Emergency Contact Info */}
        <Card className="mt-6 border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="text-center space-y-2">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200">24/7 Emergency Legal Hotline</h4>
              <p className="text-lg font-bold text-blue-900 dark:text-blue-100">(800) LEGAL-MIL</p>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                If this is an immediate emergency affecting your freedom or safety, call now
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}