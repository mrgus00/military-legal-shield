import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Clock, DollarSign, MapPin, Phone, Mail, Shield } from "lucide-react";
import type { Attorney } from "@shared/schema";

const urgentMatchingSchema = z.object({
  location: z.string().min(2, "Location is required"),
  caseType: z.string().min(1, "Case type is required"),
  urgencyLevel: z.string().min(1, "Urgency level is required"),
  budget: z.string().min(1, "Budget preference is required"),
  branch: z.string().min(1, "Military branch is required"),
  description: z.string().min(10, "Please provide more details about your situation"),
});

type UrgentMatchingForm = z.infer<typeof urgentMatchingSchema>;

export default function UrgentAttorneyMatcher() {
  const [matchedAttorneys, setMatchedAttorneys] = useState<Attorney[]>([]);
  const [showResults, setShowResults] = useState(false);

  const form = useForm<UrgentMatchingForm>({
    resolver: zodResolver(urgentMatchingSchema),
    defaultValues: {
      location: "",
      caseType: "",
      urgencyLevel: "",
      budget: "",
      branch: "",
      description: "",
    },
  });

  const findAttorneysMutation = useMutation({
    mutationFn: async (data: UrgentMatchingForm) => {
      const searchParams = new URLSearchParams();
      if (data.location) searchParams.append('location', data.location);
      if (data.budget === 'affordable') searchParams.append('pricingTier', 'affordable');
      if (data.budget === 'standard') searchParams.append('pricingTier', 'standard');
      if (data.budget === 'premium') searchParams.append('pricingTier', 'premium');
      if (data.urgencyLevel === 'emergency') searchParams.append('emergencyOnly', 'true');
      
      const response = await apiRequest(`/api/attorneys/search?${searchParams.toString()}`);
      return response;
    },
    onSuccess: (attorneys) => {
      setMatchedAttorneys(attorneys);
      setShowResults(true);
    },
  });

  const onSubmit = (data: UrgentMatchingForm) => {
    findAttorneysMutation.mutate(data);
  };

  if (showResults) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Attorney Matches Found</h2>
          <p className="text-gray-600">
            Found {matchedAttorneys.length} attorneys ready to defend your case
          </p>
          <Button 
            variant="outline" 
            onClick={() => setShowResults(false)}
            className="mt-4"
          >
            Refine Search
          </Button>
        </div>

        <div className="grid gap-6">
          {matchedAttorneys.map((attorney) => (
            <Card key={attorney.id} className="border-l-4 border-l-navy-600">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{attorney.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <MapPin className="h-4 w-4" />
                      {attorney.location}
                    </CardDescription>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant={
                      attorney.pricingTier === 'affordable' ? 'default' :
                      attorney.pricingTier === 'standard' ? 'secondary' : 'destructive'
                    }>
                      {attorney.pricingTier} tier
                    </Badge>
                    {attorney.availableForEmergency && (
                      <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Emergency Available
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">{attorney.bio}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {attorney.specialties.map((specialty, index) => (
                      <Badge key={index} variant="outline">
                        {specialty}
                      </Badge>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-gray-500" />
                      <span>{attorney.experience}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span>{attorney.responseTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                      <span>{attorney.hourlyRate}</span>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4 border-t">
                    <Button size="sm" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Call Now
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-red-100 rounded-full">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
        </div>
        <CardTitle className="text-2xl">Urgent Legal Defense Matching</CardTitle>
        <CardDescription>
          When the fight comes to you, we help you fight back—smartly and effectively.
          Answer a few questions to get matched with the right attorney.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Location</FormLabel>
                    <FormControl>
                      <Input placeholder="City, State" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="branch"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Military Branch</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your branch" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="army">U.S. Army</SelectItem>
                        <SelectItem value="navy">U.S. Navy</SelectItem>
                        <SelectItem value="marines">U.S. Marine Corps</SelectItem>
                        <SelectItem value="airforce">U.S. Air Force</SelectItem>
                        <SelectItem value="coastguard">U.S. Coast Guard</SelectItem>
                        <SelectItem value="spaceforce">U.S. Space Force</SelectItem>
                        <SelectItem value="veteran">Veteran</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="caseType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Case Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="What type of legal issue?" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="court-martial">Court-Martial Defense</SelectItem>
                        <SelectItem value="article15">Article 15 / NJP</SelectItem>
                        <SelectItem value="security-clearance">Security Clearance</SelectItem>
                        <SelectItem value="administrative">Administrative Action</SelectItem>
                        <SelectItem value="appeals">Appeals</SelectItem>
                        <SelectItem value="discharge">Discharge Upgrade</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
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
                    <FormLabel>Urgency Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="How urgent is this?" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="emergency">Emergency (24-48 hours)</SelectItem>
                        <SelectItem value="urgent">Urgent (1 week)</SelectItem>
                        <SelectItem value="important">Important (2-4 weeks)</SelectItem>
                        <SelectItem value="planning">Planning ahead</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="budget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Budget Preference</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="What's your budget range?" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="affordable">Affordable ($150-250/hour)</SelectItem>
                      <SelectItem value="standard">Standard ($275-400/hour)</SelectItem>
                      <SelectItem value="premium">Premium ($450-650/hour)</SelectItem>
                      <SelectItem value="any">Any budget</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Describe Your Situation</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Briefly describe what happened and what legal help you need..." 
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full bg-red-600 hover:bg-red-700"
              disabled={findAttorneysMutation.isPending}
            >
              {findAttorneysMutation.isPending ? "Finding Attorneys..." : "Find My Defense Attorney"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}