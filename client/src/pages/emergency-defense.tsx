import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  AlertTriangle, 
  Clock, 
  Shield, 
  Phone, 
  MessageSquare, 
  FileText,
  Users,
  Zap,
  CheckCircle,
  Scale
} from "lucide-react";
import { motion } from "framer-motion";
import PageLayout from "@/components/page-layout";

export default function EmergencyDefense() {
  const [urgencyLevel, setUrgencyLevel] = useState("");
  const [situation, setSituation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const emergencyTypes = [
    {
      type: "Court-Martial Charges",
      description: "Facing formal military court proceedings",
      urgency: "Critical",
      responseTime: "< 2 hours",
      icon: Scale,
      color: "red"
    },
    {
      type: "Article 15/NJP",
      description: "Non-judicial punishment proceedings",
      urgency: "High",
      responseTime: "< 4 hours", 
      icon: FileText,
      color: "orange"
    },
    {
      type: "Security Clearance Issues",
      description: "Clearance suspension or revocation",
      urgency: "High",
      responseTime: "< 6 hours",
      icon: Shield,
      color: "orange"
    },
    {
      type: "Criminal Investigation",
      description: "Under investigation by CID/NCIS/OSI",
      urgency: "Critical",
      responseTime: "< 1 hour",
      icon: AlertTriangle,
      color: "red"
    }
  ];

  const handleEmergencySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate emergency response processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In real implementation, this would connect to emergency attorney matching
    alert("Emergency request submitted! An attorney will contact you within the specified timeframe.");
    setIsSubmitting(false);
  };

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative py-20 px-4"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-orange-600/10"></div>
          <div className="relative max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-24 h-24 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center"
            >
              <AlertTriangle className="w-12 h-12 text-red-600" />
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
              Emergency Defense
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              24/7 urgent legal matching for critical military situations. 
              Immediate attorney connection when you need it most.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <Badge variant="destructive" className="px-4 py-2 text-lg">
                <Clock className="w-4 h-4 mr-2" />
                24/7 Available
              </Badge>
              <Badge variant="outline" className="px-4 py-2 text-lg border-red-300 text-red-700">
                <Zap className="w-4 h-4 mr-2" />
                Immediate Response
              </Badge>
              <Badge variant="outline" className="px-4 py-2 text-lg border-red-300 text-red-700">
                <Shield className="w-4 h-4 mr-2" />
                Critical Protection
              </Badge>
            </div>
          </div>
        </motion.div>

        {/* Emergency Types Grid */}
        <div className="max-w-6xl mx-auto px-4 py-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-center mb-12 text-gray-900"
          >
            Emergency Situations We Handle
          </motion.h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {emergencyTypes.map((emergency, index) => {
              const IconComponent = emergency.icon;
              return (
                <motion.div
                  key={emergency.type}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow border-l-4 border-l-red-500">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-lg bg-${emergency.color}-100 flex items-center justify-center`}>
                            <IconComponent className={`w-6 h-6 text-${emergency.color}-600`} />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{emergency.type}</CardTitle>
                            <Badge variant={emergency.urgency === "Critical" ? "destructive" : "secondary"}>
                              {emergency.urgency}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500">Response Time</div>
                          <div className="font-semibold text-red-600">{emergency.responseTime}</div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">{emergency.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Emergency Request Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="max-w-2xl mx-auto"
          >
            <Card className="border-red-200 shadow-xl">
              <CardHeader className="text-center bg-red-50">
                <CardTitle className="text-2xl text-red-800">Submit Emergency Request</CardTitle>
                <CardDescription>
                  Complete this form for immediate attorney matching
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleEmergencySubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="urgency">Situation Type *</Label>
                    <Select value={urgencyLevel} onValueChange={setUrgencyLevel} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your emergency type" />
                      </SelectTrigger>
                      <SelectContent>
                        {emergencyTypes.map((type) => (
                          <SelectItem key={type.type} value={type.type}>
                            {type.type} - {type.responseTime}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="situation">Describe Your Situation *</Label>
                    <Textarea
                      id="situation"
                      value={situation}
                      onChange={(e) => setSituation(e.target.value)}
                      placeholder="Provide key details about your emergency legal situation..."
                      rows={4}
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="rank">Rank</Label>
                      <Input id="rank" placeholder="E.g., SGT, CPT, etc." />
                    </div>
                    <div>
                      <Label htmlFor="branch">Branch</Label>
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

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input id="phone" type="tel" placeholder="Your contact number" required />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input id="email" type="email" placeholder="your.email@example.com" required />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-3 text-lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                        Processing Emergency Request...
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-5 h-5 mr-2" />
                        Submit Emergency Request
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Options */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-16 grid md:grid-cols-3 gap-6"
          >
            <Card className="text-center">
              <CardContent className="p-6">
                <Phone className="w-12 h-12 mx-auto mb-4 text-red-600" />
                <h3 className="font-semibold mb-2">Emergency Hotline</h3>
                <p className="text-sm text-gray-600 mb-4">24/7 immediate assistance</p>
                <Button variant="outline" className="border-red-300 text-red-700">
                  Call Now
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-red-600" />
                <h3 className="font-semibold mb-2">Live Chat</h3>
                <p className="text-sm text-gray-600 mb-4">Secure encrypted messaging</p>
                <Button variant="outline" className="border-red-300 text-red-700">
                  Start Chat
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <Users className="w-12 h-12 mx-auto mb-4 text-red-600" />
                <h3 className="font-semibold mb-2">Attorney Network</h3>
                <p className="text-sm text-gray-600 mb-4">Verified military lawyers</p>
                <Button variant="outline" className="border-red-300 text-red-700">
                  View Network
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </PageLayout>
  );
}