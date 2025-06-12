import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Heart, 
  Shield, 
  FileText, 
  Calculator, 
  Calendar,
  MapPin,
  Award,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  User,
  Phone
} from "lucide-react";
import { motion } from "framer-motion";
import PageLayout from "@/components/page-layout";

export default function InjuryClaims() {
  const [claimType, setClaimType] = useState("");
  const [injuryDate, setInjuryDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const claimTypes = [
    {
      type: "VA Disability Claim",
      description: "Service-connected disability compensation",
      timeline: "3-6 months",
      benefits: "Monthly payments, healthcare, vocational rehab",
      icon: Shield,
      color: "blue"
    },
    {
      type: "Personal Injury",
      description: "Injury caused by negligence or misconduct",
      timeline: "6-24 months",
      benefits: "Medical expenses, lost wages, pain & suffering",
      icon: Heart,
      color: "red"
    },
    {
      type: "FECA Claims",
      description: "Federal workers' compensation for civilian employees",
      timeline: "2-4 months",
      benefits: "Medical treatment, wage replacement",
      icon: FileText,
      color: "green"
    },
    {
      type: "Military Malpractice",
      description: "Medical negligence by military healthcare providers",
      timeline: "12-36 months",
      benefits: "Compensation for additional medical costs",
      icon: AlertCircle,
      color: "orange"
    }
  ];

  const vaRatings = [
    { rating: "10%", monthlyRate: "$165.92", description: "Minor limitations" },
    { rating: "20%", monthlyRate: "$327.99", description: "Mild impairment" },
    { rating: "30%", monthlyRate: "$508.05", description: "Moderate symptoms" },
    { rating: "40%", monthlyRate: "$731.86", description: "Significant impact" },
    { rating: "50%", monthlyRate: "$1,041.82", description: "Considerable limitation" },
    { rating: "60%", monthlyRate: "$1,319.65", description: "Severe impairment" },
    { rating: "70%", monthlyRate: "$1,663.06", description: "Major life impact" },
    { rating: "80%", monthlyRate: "$1,933.15", description: "Substantial limitation" },
    { rating: "90%", monthlyRate: "$2,172.39", description: "Extreme impairment" },
    { rating: "100%", monthlyRate: "$3,737.85", description: "Total disability" }
  ];

  const commonConditions = [
    "PTSD", "TBI (Traumatic Brain Injury)", "Hearing Loss", "Tinnitus",
    "Back/Spine Injuries", "Knee Injuries", "Sleep Disorders", "Depression",
    "Anxiety", "Shoulder Injuries", "Joint Problems", "Respiratory Issues"
  ];

  const handleClaimSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    alert("Claim consultation request submitted! An attorney will review your case within 24 hours.");
    setIsSubmitting(false);
  };

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative py-20 px-4"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10"></div>
          <div className="relative max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-24 h-24 mx-auto mb-6 bg-purple-100 rounded-full flex items-center justify-center"
            >
              <Heart className="w-12 h-12 text-purple-600" />
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
              Injury Claims
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              VA disability and personal injury representation. Maximize your benefits 
              and compensation with experienced military injury attorneys.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <Badge variant="default" className="px-4 py-2 text-lg bg-purple-600">
                <Shield className="w-4 h-4 mr-2" />
                VA Disability
              </Badge>
              <Badge variant="outline" className="px-4 py-2 text-lg border-purple-300 text-purple-700">
                <Heart className="w-4 h-4 mr-2" />
                Personal Injury
              </Badge>
              <Badge variant="outline" className="px-4 py-2 text-lg border-purple-300 text-purple-700">
                <DollarSign className="w-4 h-4 mr-2" />
                Maximum Benefits
              </Badge>
            </div>
          </div>
        </motion.div>

        <div className="max-w-6xl mx-auto px-4 py-16">
          {/* Claim Types */}
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-center mb-12 text-gray-900"
          >
            Types of Injury Claims We Handle
          </motion.h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {claimTypes.map((claim, index) => {
              const IconComponent = claim.icon;
              return (
                <motion.div
                  key={claim.type}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow border-l-4 border-l-purple-500">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-lg bg-${claim.color}-100 flex items-center justify-center`}>
                            <IconComponent className={`w-6 h-6 text-${claim.color}-600`} />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{claim.type}</CardTitle>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500">Timeline</div>
                          <div className="font-semibold text-purple-600">{claim.timeline}</div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">{claim.description}</p>
                      <div>
                        <div className="text-sm font-medium text-gray-700 mb-2">Potential Benefits:</div>
                        <p className="text-sm text-gray-600">{claim.benefits}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* VA Disability Ratings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-16"
          >
            <h3 className="text-2xl font-bold text-center mb-8 text-gray-900">
              VA Disability Rating Scale (2024)
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
              {vaRatings.map((rating, index) => (
                <motion.div
                  key={rating.rating}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="text-center hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-purple-600 mb-2">{rating.rating}</div>
                      <div className="text-lg font-semibold text-green-600 mb-2">{rating.monthlyRate}</div>
                      <div className="text-xs text-gray-500">{rating.description}</div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
            <div className="text-center mt-6">
              <p className="text-sm text-gray-600">
                *Rates shown are for single veterans without dependents. Additional compensation available for dependents.
              </p>
            </div>
          </motion.div>

          {/* Common Conditions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-16"
          >
            <h3 className="text-2xl font-bold text-center mb-8 text-gray-900">
              Common Service-Connected Conditions
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {commonConditions.map((condition, index) => (
                <motion.div
                  key={condition}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Badge variant="outline" className="px-3 py-1 text-sm border-purple-300 text-purple-700">
                    {condition}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Claim Assessment Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="max-w-2xl mx-auto mb-16"
          >
            <Card className="border-purple-200 shadow-xl">
              <CardHeader className="text-center bg-purple-50">
                <CardTitle className="text-2xl text-purple-800">Free Claim Assessment</CardTitle>
                <CardDescription>
                  Get a professional evaluation of your injury claim potential
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleClaimSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="claimType">Type of Claim *</Label>
                    <Select value={claimType} onValueChange={setClaimType} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select claim type" />
                      </SelectTrigger>
                      <SelectContent>
                        {claimTypes.map((type) => (
                          <SelectItem key={type.type} value={type.type}>
                            {type.type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="injuryDate">Date of Injury/Incident</Label>
                      <Input 
                        id="injuryDate" 
                        type="date" 
                        value={injuryDate}
                        onChange={(e) => setInjuryDate(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="branch">Military Branch</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select branch" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="army">Army</SelectItem>
                          <SelectItem value="navy">Navy</SelectItem>
                          <SelectItem value="airforce">Air Force</SelectItem>
                          <SelectItem value="marines">Marines</SelectItem>
                          <SelectItem value="coastguard">Coast Guard</SelectItem>
                          <SelectItem value="spaceforce">Space Force</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="condition">Primary Condition/Injury *</Label>
                    <Input 
                      id="condition" 
                      placeholder="E.g., PTSD, Back injury, Hearing loss..." 
                      required 
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Describe Your Injury/Condition *</Label>
                    <Textarea
                      id="description"
                      placeholder="Provide details about how the injury occurred and its impact on your daily life..."
                      rows={4}
                      required
                    />
                  </div>

                  <div className="space-y-4">
                    <Label className="text-base font-medium">Current Status (check all that apply):</Label>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        "Currently receiving VA benefits",
                        "Previously filed VA claim",
                        "Still on active duty",
                        "Receiving medical treatment",
                        "Unable to work",
                        "Claim was denied"
                      ].map((status) => (
                        <div key={status} className="flex items-center space-x-2">
                          <Checkbox id={status} />
                          <Label htmlFor={status} className="text-sm">{status}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input id="phone" type="tel" placeholder="Your contact number" required />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input id="email" type="email" placeholder="your.email@example.com" required />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 text-lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                        Processing Assessment...
                      </>
                    ) : (
                      <>
                        <Calculator className="w-5 h-5 mr-2" />
                        Get Free Assessment
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Process Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="mb-16"
          >
            <h3 className="text-2xl font-bold text-center mb-8 text-gray-900">
              Your Claim Process
            </h3>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                {
                  step: 1,
                  title: "Free Consultation",
                  description: "Case evaluation and strategy discussion",
                  icon: User,
                  time: "Day 1"
                },
                {
                  step: 2,
                  title: "Evidence Gathering",
                  description: "Medical records, service records, witness statements",
                  icon: FileText,
                  time: "Weeks 1-4"
                },
                {
                  step: 3,
                  title: "Claim Filing",
                  description: "Submit comprehensive claim package",
                  icon: CheckCircle,
                  time: "Week 4-6"
                },
                {
                  step: 4,
                  title: "Decision & Appeals",
                  description: "Review decision, appeal if necessary",
                  icon: Award,
                  time: "Months 3-12"
                }
              ].map((phase, index) => {
                const IconComponent = phase.icon;
                return (
                  <motion.div
                    key={phase.step}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0 + (index * 0.1) }}
                  >
                    <Card className="text-center h-full">
                      <CardContent className="p-6">
                        <div className="w-12 h-12 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                          <IconComponent className="w-6 h-6 text-purple-600" />
                        </div>
                        <Badge variant="outline" className="mb-3">{phase.time}</Badge>
                        <h4 className="font-semibold mb-2">{phase.title}</h4>
                        <p className="text-sm text-gray-600">{phase.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="text-center"
          >
            <Card className="max-w-2xl mx-auto bg-purple-50 border-purple-200">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4 text-purple-900">Don't Fight Alone</h3>
                <p className="text-purple-700 mb-6">
                  You served your country. Now let us serve you. Our experienced attorneys 
                  specialize in maximizing veteran benefits and injury compensation.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <Phone className="w-4 h-4 mr-2" />
                    Call for Free Consultation
                  </Button>
                  <Button variant="outline" className="border-purple-300 text-purple-700">
                    <Calculator className="w-4 h-4 mr-2" />
                    Calculate Benefits
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </PageLayout>
  );
}