import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { AlertTriangle, Clock, Phone, Video, Calendar } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { insertEmergencyConsultationSchema } from "@shared/schema";
import { useEmergencyLoading } from "@/hooks/useMilitaryLoading";
import PageLayout from "@/components/page-layout";

const emergencyFormSchema = insertEmergencyConsultationSchema.extend({
  preferredDateTime: z.string().min(1, "Preferred date/time is required"),
  alternateDateTime: z.string().optional(),
});

type EmergencyFormData = z.infer<typeof emergencyFormSchema>;

const urgencyLevels = [
  { value: "critical", label: "Critical", color: "destructive", description: "Immediate legal action required (court deadline within 24-48 hours)" },
  { value: "high", label: "High Priority", color: "orange", description: "Urgent issue requiring quick response (within 1-3 days)" },
  { value: "moderate", label: "Moderate", color: "yellow", description: "Important but can wait 3-7 days for response" }
];

const legalIssueTypes = [
  "Article 15 (Non-judicial punishment)",
  "Court-martial charges",
  "Criminal investigation",
  "Security clearance issues",
  "Administrative separation",
  "Medical evaluation board",
  "Financial misconduct",
  "Sexual assault allegations",
  "Domestic violence charges",
  "Drug-related offenses",
  "AWOL/Desertion charges",
  "Military justice violations",
  "Command investigation",
  "IG complaint assistance",
  "Other military legal matter"
];

const militaryBranches = [
  "U.S. Army",
  "U.S. Navy", 
  "U.S. Air Force",
  "U.S. Marine Corps",
  "U.S. Coast Guard",
  "U.S. Space Force"
];

const timeZones = [
  "EST - Eastern Standard Time",
  "CST - Central Standard Time", 
  "MST - Mountain Standard Time",
  "PST - Pacific Standard Time",
  "AKST - Alaska Standard Time",
  "HST - Hawaii Standard Time",
  "CET - Central European Time",
  "GMT - Greenwich Mean Time"
];

export default function EmergencyConsultation() {
  const [selectedAttorney, setSelectedAttorney] = useState<number | null>(null);
  const { toast } = useToast();
  const { startMilitarySequence } = useEmergencyLoading();

  const form = useForm<EmergencyFormData>({
    resolver: zodResolver(emergencyFormSchema),
    defaultValues: {
      urgencyLevel: "high",
      consultationType: "phone",
      timeZone: "EST - Eastern Standard Time",
      hasDeadline: false
    }
  });

  // Get available attorneys for emergency consultations
  const { data: emergencyAttorneys, isLoading: attorneysLoading } = useQuery({
    queryKey: ["/api/attorneys/emergency"],
  });

  const createConsultationMutation = useMutation({
    mutationFn: async (data: EmergencyFormData) => {
      // Trigger emergency loading sequence
      startMilitarySequence(4000);
      
      const formattedData = {
        ...data,
        preferredDateTime: new Date(data.preferredDateTime).toISOString(),
        alternateDateTime: data.alternateDateTime ? new Date(data.alternateDateTime).toISOString() : null,
        deadlineDate: data.deadlineDate ? new Date(data.deadlineDate).toISOString() : null,
        assignedAttorneyId: selectedAttorney,
      };
      return apiRequest("POST", "/api/emergency-consultations", formattedData);
    },
    onSuccess: () => {
      toast({
        title: "Emergency Consultation Requested",
        description: "Your request has been submitted. The attorney will contact you within 2 hours.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/emergency-consultations"] });
      form.reset();
      setSelectedAttorney(null);
    },
    onError: (error: any) => {
      console.error("Emergency consultation error:", error);
      toast({
        title: "Request Failed",
        description: error.message || "Please check your information and try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: EmergencyFormData) => {
    if (!selectedAttorney) {
      toast({
        title: "Attorney Required",
        description: "Please select an attorney for your emergency consultation.",
        variant: "destructive",
      });
      return;
    }
    
    createConsultationMutation.mutate({
      ...data,
      attorneyId: selectedAttorney,
    });
  };

  return (
    <PageLayout>
      <div className="bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-red-950/20 dark:via-orange-950/20 dark:to-yellow-950/20 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <AlertTriangle className="h-8 w-8 text-red-600" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Emergency Legal Consultation
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Get immediate legal assistance from specialized military defense attorneys. 
            Response guaranteed within 2 hours for critical issues.
          </p>
        </div>

        {/* Urgency Level Selection */}
        <Card className="mb-6 border-red-200 dark:border-red-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-red-600" />
              Urgency Level
            </CardTitle>
            <CardDescription>
              Select the urgency level that best describes your situation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {urgencyLevels.map((level) => (
                <Card 
                  key={level.value}
                  className={`cursor-pointer transition-all ${
                    form.watch("urgencyLevel") === level.value 
                      ? "ring-2 ring-red-500 bg-red-50 dark:bg-red-950/50" 
                      : "hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                  onClick={() => form.setValue("urgencyLevel", level.value as any)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{level.label}</h3>
                      <Badge variant={level.color as any}>{level.value.toUpperCase()}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {level.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Available Emergency Attorneys */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Select Attorney</CardTitle>
            <CardDescription>
              Choose from attorneys available for emergency consultations
            </CardDescription>
          </CardHeader>
          <CardContent>
            {attorneysLoading ? (
              <div className="animate-pulse space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                ))}
              </div>
            ) : (
              <div className="grid gap-4">
                {(emergencyAttorneys || []).map((attorney: any) => (
                  <Card 
                    key={attorney.id}
                    className={`cursor-pointer transition-all ${
                      selectedAttorney === attorney.id 
                        ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950/50" 
                        : "hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                    onClick={() => setSelectedAttorney(attorney.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{attorney.firstName} {attorney.lastName}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{attorney.location}</p>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {attorney.specialties.slice(0, 3).map((specialty: string) => (
                              <Badge key={specialty} variant="secondary" className="text-xs">
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                          <p className="text-sm text-green-600 dark:text-green-400">
                            Response time: {attorney.responseTime || "< 2 hours"}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 mb-1">
                            <span className="text-sm font-medium">{attorney.rating}</span>
                            <span className="text-yellow-500">★</span>
                          </div>
                          <p className="text-xs text-gray-500">{attorney.experience}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Emergency Consultation Form */}
        <Card>
          <CardHeader>
            <CardTitle>Emergency Consultation Details</CardTitle>
            <CardDescription>
              Provide detailed information about your legal emergency
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Personal Information */}
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="clientFirstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name *</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="clientLastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name *</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="clientEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address *</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="clientPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input type="tel" {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="clientBranch"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Military Branch *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select branch" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {militaryBranches.map((branch) => (
                              <SelectItem key={branch} value={branch}>
                                {branch}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="clientRank"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Military Rank</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., E-5, O-3, W-2" {...field} value={field.value || ""} />
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
                            <SelectValue placeholder="Select issue type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {legalIssueTypes.map((issue) => (
                            <SelectItem key={issue} value={issue}>
                              {issue}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="incidentDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Incident Description *</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          rows={6}
                          placeholder="Provide a detailed description of your legal situation. Include relevant dates, locations, and people involved. The more information you provide, the better we can assist you."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Consultation Preferences */}
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="consultationType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Consultation Type *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select consultation type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="phone">
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4" />
                                Phone Call
                              </div>
                            </SelectItem>
                            <SelectItem value="video">
                              <div className="flex items-center gap-2">
                                <Video className="h-4 w-4" />
                                Video Call
                              </div>
                            </SelectItem>
                            <SelectItem value="in-person">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                In-Person Meeting
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="timeZone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Time Zone *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select time zone" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {timeZones.map((tz) => (
                              <SelectItem key={tz} value={tz}>
                                {tz}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="preferredDateTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred Date/Time *</FormLabel>
                        <FormControl>
                          <Input 
                            type="datetime-local" 
                            {...field}
                            min={new Date().toISOString().slice(0, 16)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="alternateDateTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Alternate Date/Time</FormLabel>
                        <FormControl>
                          <Input 
                            type="datetime-local" 
                            {...field}
                            min={new Date().toISOString().slice(0, 16)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Deadline Information */}
                <FormField
                  control={form.control}
                  name="hasDeadline"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value || false}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          This matter has a court deadline or time-sensitive requirement
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                {form.watch("hasDeadline") && (
                  <FormField
                    control={form.control}
                    name="deadlineDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Deadline Date *</FormLabel>
                        <FormControl>
                          <Input 
                            type="datetime-local" 
                            {...field}
                            min={new Date().toISOString().slice(0, 16)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="additionalNotes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Notes</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          value={field.value || ""}
                          rows={3}
                          placeholder="Any additional information that might be helpful for the attorney to know..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                  disabled={createConsultationMutation.isPending || !selectedAttorney}
                >
                  {createConsultationMutation.isPending ? (
                    "Submitting Request..."
                  ) : (
                    "Request Emergency Consultation"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        </div>
      </div>
    </PageLayout>
  );
}