import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Scale, 
  Shield, 
  FileText, 
  Users, 
  BookOpen,
  Gavel,
  AlertCircle,
  CheckCircle,
  Clock,
  Award
} from "lucide-react";
import { motion } from "framer-motion";
import PageLayout from "@/components/page-layout";

export default function MilitaryJustice() {
  const [selectedCase, setSelectedCase] = useState<string | null>(null);

  const justiceServices = [
    {
      title: "Court-Martial Defense",
      description: "Expert representation for all types of court-martial proceedings",
      icon: Gavel,
      cases: ["General Court-Martial", "Special Court-Martial", "Summary Court-Martial"],
      expertise: "High",
      timeframe: "Immediate",
      color: "blue"
    },
    {
      title: "UCMJ Expertise",
      description: "Comprehensive understanding of military law and regulations",
      icon: BookOpen,
      cases: ["Article 15 (NJP)", "Administrative Actions", "Military Investigations"],
      expertise: "Expert",
      timeframe: "24-48 hours",
      color: "green"
    },
    {
      title: "Appeals Process",
      description: "Military appellate court representation and review",
      icon: Scale,
      cases: ["Court of Criminal Appeals", "Court of Appeals for Armed Forces", "Supreme Court"],
      expertise: "Specialist",
      timeframe: "Varies",
      color: "purple"
    },
    {
      title: "Administrative Law",
      description: "Non-judicial military administrative proceedings",
      icon: FileText,
      cases: ["Boards of Correction", "Discharge Upgrades", "Security Clearance"],
      expertise: "High",
      timeframe: "1-2 weeks",
      color: "orange"
    }
  ];

  const courtMartialTypes = [
    {
      type: "Summary Court-Martial",
      description: "Minor offenses, single officer as judge",
      maxPunishment: "30 days confinement, reduction in rank, forfeitures",
      rightToCounsel: "Not automatic",
      severity: "Low"
    },
    {
      type: "Special Court-Martial",
      description: "Intermediate-level offenses, military judge and members",
      maxPunishment: "1 year confinement, bad-conduct discharge, forfeitures",
      rightToCounsel: "Yes",
      severity: "Medium"
    },
    {
      type: "General Court-Martial",
      description: "Most serious offenses, full military court",
      maxPunishment: "Life imprisonment, dishonorable discharge, death penalty",
      rightToCounsel: "Yes",
      severity: "High"
    }
  ];

  const ucmjArticles = [
    { article: "Article 86", offense: "Absence Without Leave (AWOL)", category: "Duty Offenses" },
    { article: "Article 87", offense: "Missing Movement", category: "Duty Offenses" },
    { article: "Article 92", offense: "Failure to Obey Order", category: "Duty Offenses" },
    { article: "Article 120", offense: "Sexual Assault", category: "Personal Offenses" },
    { article: "Article 134", offense: "General Article", category: "Catch-All" },
    { article: "Article 15", offense: "Non-Judicial Punishment", category: "Administrative" }
  ];

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative py-20 px-4"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10"></div>
          <div className="relative max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-24 h-24 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center"
            >
              <Scale className="w-12 h-12 text-blue-600" />
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
              Military Justice
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              UCMJ expertise and court-martial defense from attorneys who understand 
              military law and the unique challenges facing service members.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <Badge variant="default" className="px-4 py-2 text-lg bg-blue-600">
                <Gavel className="w-4 h-4 mr-2" />
                UCMJ Experts
              </Badge>
              <Badge variant="outline" className="px-4 py-2 text-lg border-blue-300 text-blue-700">
                <Shield className="w-4 h-4 mr-2" />
                Court-Martial Defense
              </Badge>
              <Badge variant="outline" className="px-4 py-2 text-lg border-blue-300 text-blue-700">
                <Award className="w-4 h-4 mr-2" />
                Military Experience
              </Badge>
            </div>
          </div>
        </motion.div>

        <div className="max-w-6xl mx-auto px-4 py-16">
          <Tabs defaultValue="services" className="space-y-8">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="services">Our Services</TabsTrigger>
              <TabsTrigger value="court-martial">Court-Martial Types</TabsTrigger>
              <TabsTrigger value="ucmj">UCMJ Articles</TabsTrigger>
              <TabsTrigger value="process">Legal Process</TabsTrigger>
            </TabsList>

            <TabsContent value="services" className="space-y-8">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-bold text-center mb-12 text-gray-900"
              >
                Military Justice Services
              </motion.h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {justiceServices.map((service, index) => {
                  const IconComponent = service.icon;
                  return (
                    <motion.div
                      key={service.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="h-full hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`w-12 h-12 rounded-lg bg-${service.color}-100 flex items-center justify-center`}>
                                <IconComponent className={`w-6 h-6 text-${service.color}-600`} />
                              </div>
                              <div>
                                <CardTitle className="text-lg">{service.title}</CardTitle>
                                <Badge variant="secondary">{service.expertise}</Badge>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-gray-500">Response Time</div>
                              <div className="font-semibold text-blue-600">{service.timeframe}</div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-600 mb-4">{service.description}</p>
                          <div className="space-y-2">
                            <div className="text-sm font-medium text-gray-700">Covers:</div>
                            {service.cases.map((caseType) => (
                              <Badge key={caseType} variant="outline" className="mr-2 mb-1">
                                {caseType}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="court-martial" className="space-y-8">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-bold text-center mb-12 text-gray-900"
              >
                Types of Court-Martial
              </motion.h2>
              
              <div className="space-y-6">
                {courtMartialTypes.map((court, index) => (
                  <motion.div
                    key={court.type}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="overflow-hidden">
                      <CardHeader className={`${
                        court.severity === 'High' ? 'bg-red-50 border-l-4 border-l-red-500' :
                        court.severity === 'Medium' ? 'bg-orange-50 border-l-4 border-l-orange-500' :
                        'bg-yellow-50 border-l-4 border-l-yellow-500'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-xl">{court.type}</CardTitle>
                            <CardDescription className="mt-2">{court.description}</CardDescription>
                          </div>
                          <Badge variant={
                            court.severity === 'High' ? 'destructive' :
                            court.severity === 'Medium' ? 'default' : 'secondary'
                          }>
                            {court.severity} Severity
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-semibold mb-2">Maximum Punishment:</h4>
                            <p className="text-gray-600">{court.maxPunishment}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Right to Counsel:</h4>
                            <div className="flex items-center gap-2">
                              {court.rightToCounsel === "Yes" ? (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              ) : (
                                <AlertCircle className="w-4 h-4 text-yellow-600" />
                              )}
                              <span className="text-gray-600">{court.rightToCounsel}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="ucmj" className="space-y-8">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-bold text-center mb-12 text-gray-900"
              >
                Common UCMJ Articles
              </motion.h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {ucmjArticles.map((article, index) => (
                  <motion.div
                    key={article.article}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => setSelectedCase(selectedCase === article.article ? null : article.article)}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg text-blue-700">{article.article}</CardTitle>
                          <Badge variant="outline">{article.category}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 font-medium">{article.offense}</p>
                        {selectedCase === article.article && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="mt-3 pt-3 border-t"
                          >
                            <Button size="sm" className="w-full">
                              Learn More About Defense
                            </Button>
                          </motion.div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="process" className="space-y-8">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-bold text-center mb-12 text-gray-900"
              >
                Military Justice Process
              </motion.h2>
              
              <div className="max-w-4xl mx-auto">
                <div className="space-y-8">
                  {[
                    {
                      step: 1,
                      title: "Initial Investigation",
                      description: "Military police or command initiates investigation",
                      timeline: "Days to Weeks",
                      actions: ["Remain silent", "Request counsel", "Document everything"]
                    },
                    {
                      step: 2,
                      title: "Preferral of Charges",
                      description: "Commander decides to formally charge the accused",
                      timeline: "1-2 Weeks",
                      actions: ["Review charges", "Prepare defense strategy", "Gather evidence"]
                    },
                    {
                      step: 3,
                      title: "Article 32 Hearing",
                      description: "Preliminary hearing (for General Court-Martial)",
                      timeline: "2-4 Weeks",
                      actions: ["Present defense", "Cross-examine witnesses", "Challenge evidence"]
                    },
                    {
                      step: 4,
                      title: "Trial",
                      description: "Court-martial proceedings begin",
                      timeline: "Varies",
                      actions: ["Jury selection", "Opening statements", "Present case"]
                    }
                  ].map((phase, index) => (
                    <motion.div
                      key={phase.step}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.2 }}
                    >
                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                              {phase.step}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="text-xl font-semibold">{phase.title}</h3>
                                <Badge variant="outline">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {phase.timeline}
                                </Badge>
                              </div>
                              <p className="text-gray-600 mb-4">{phase.description}</p>
                              <div className="space-y-2">
                                <div className="text-sm font-medium text-gray-700">Key Actions:</div>
                                <div className="flex flex-wrap gap-2">
                                  {phase.actions.map((action) => (
                                    <Badge key={action} variant="secondary" className="text-xs">
                                      {action}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-16 text-center"
          >
            <Card className="max-w-2xl mx-auto bg-blue-50 border-blue-200">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4 text-blue-900">Need Military Justice Representation?</h3>
                <p className="text-blue-700 mb-6">
                  Don't face military legal proceedings alone. Our experienced military justice attorneys 
                  are here to protect your rights and career.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Users className="w-4 h-4 mr-2" />
                    Find an Attorney
                  </Button>
                  <Button variant="outline" className="border-blue-300 text-blue-700">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Emergency Consultation
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