import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  FileText, 
  Users, 
  Gavel, 
  Shield, 
  Calendar,
  ArrowRight,
  Info,
  Star,
  Target,
  BookOpen,
  Phone
} from "lucide-react";

interface RoadmapStep {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'upcoming' | 'blocked';
  category: 'consultation' | 'preparation' | 'documentation' | 'proceedings' | 'resolution';
  estimatedDays: number;
  priority: 'critical' | 'high' | 'medium' | 'low';
  requirements: string[];
  outcomes: string[];
  tips: string[];
  resources: { title: string; url: string; type: 'document' | 'guide' | 'video' | 'contact' }[];
}

interface LegalRoadmap {
  caseType: string;
  branch: string;
  currentStep: number;
  totalSteps: number;
  estimatedCompletion: string;
  urgencyLevel: 'emergency' | 'urgent' | 'routine';
  steps: RoadmapStep[];
  milestones: { step: number; title: string; importance: string }[];
}

const mockRoadmaps: Record<string, LegalRoadmap> = {
  'court-martial': {
    caseType: 'Court-Martial Defense',
    branch: 'Army',
    currentStep: 3,
    totalSteps: 8,
    estimatedCompletion: '45-90 days',
    urgencyLevel: 'urgent',
    milestones: [
      { step: 2, title: 'Legal Representation Secured', importance: 'Critical foundation for defense' },
      { step: 5, title: 'Article 32 Hearing', importance: 'Key procedural milestone' },
      { step: 7, title: 'Court-Martial Trial', importance: 'Final determination phase' }
    ],
    steps: [
      {
        id: 'initial-consultation',
        title: 'Initial Emergency Consultation',
        description: 'Immediate legal assessment and rights advisement',
        status: 'completed',
        category: 'consultation',
        estimatedDays: 1,
        priority: 'critical',
        requirements: ['Notification of charges', 'Service record available', 'Contact information'],
        outcomes: ['Rights fully explained', 'Initial defense strategy outlined', 'Attorney-client privilege established'],
        tips: ['Exercise right to remain silent', 'Do not discuss case with anyone except attorney', 'Preserve all relevant documents'],
        resources: [
          { title: 'Military Rights Guide', url: '/resources/military-rights', type: 'guide' },
          { title: 'Emergency Legal Hotline', url: 'tel:1-800-MILITARY', type: 'contact' }
        ]
      },
      {
        id: 'attorney-selection',
        title: 'Military Defense Attorney Selection',
        description: 'Choose between detailed defense counsel or civilian attorney',
        status: 'completed',
        category: 'consultation',
        estimatedDays: 3,
        priority: 'critical',
        requirements: ['Review attorney qualifications', 'Assess case complexity', 'Financial considerations'],
        outcomes: ['Attorney retained', 'Defense team assembled', 'Communication protocols established'],
        tips: ['Consider attorney\'s court-martial experience', 'Evaluate trial success rates', 'Ensure 24/7 availability'],
        resources: [
          { title: 'Attorney Selection Guide', url: '/resources/attorney-selection', type: 'guide' },
          { title: 'Court-Martial Attorney Directory', url: '/attorneys?specialization=court-martial', type: 'document' }
        ]
      },
      {
        id: 'case-investigation',
        title: 'Defense Investigation & Evidence Review',
        description: 'Comprehensive case analysis and evidence gathering',
        status: 'current',
        category: 'preparation',
        estimatedDays: 14,
        priority: 'high',
        requirements: ['Access to military records', 'Witness identification', 'Evidence preservation'],
        outcomes: ['Complete case file assembled', 'Defense strategy refined', 'Witness interviews completed'],
        tips: ['Maintain detailed timeline of events', 'Identify character witnesses', 'Document any procedural violations'],
        resources: [
          { title: 'Evidence Collection Checklist', url: '/resources/evidence-checklist', type: 'document' },
          { title: 'Investigation Planning Video', url: '/resources/investigation-video', type: 'video' }
        ]
      },
      {
        id: 'pretrial-motions',
        title: 'Pre-Trial Motions & Discovery',
        description: 'File motions to suppress evidence and challenge proceedings',
        status: 'upcoming',
        category: 'documentation',
        estimatedDays: 10,
        priority: 'high',
        requirements: ['Motion deadlines identified', 'Legal research completed', 'Supporting documentation'],
        outcomes: ['Motions filed and argued', 'Discovery completed', 'Trial strategy finalized'],
        tips: ['Challenge all procedural violations', 'Request all relevant discovery', 'Consider motion to dismiss'],
        resources: [
          { title: 'Pre-Trial Motion Templates', url: '/resources/pretrial-motions', type: 'document' },
          { title: 'Discovery Process Guide', url: '/resources/discovery-guide', type: 'guide' }
        ]
      },
      {
        id: 'article-32-hearing',
        title: 'Article 32 Preliminary Hearing',
        description: 'Preliminary hearing to determine if case proceeds to court-martial',
        status: 'upcoming',
        category: 'proceedings',
        estimatedDays: 1,
        priority: 'critical',
        requirements: ['Hearing officer assigned', 'Defense preparation complete', 'Witnesses available'],
        outcomes: ['Recommendation issued', 'Evidence presented', 'Case disposition determined'],
        tips: ['Present strong defense case', 'Challenge weak evidence', 'Demonstrate good military character'],
        resources: [
          { title: 'Article 32 Hearing Guide', url: '/resources/article-32-guide', type: 'guide' },
          { title: 'Hearing Preparation Checklist', url: '/resources/hearing-prep', type: 'document' }
        ]
      },
      {
        id: 'plea-negotiations',
        title: 'Plea Negotiations & Settlement',
        description: 'Negotiate potential plea agreements or alternative resolutions',
        status: 'upcoming',
        category: 'preparation',
        estimatedDays: 7,
        priority: 'medium',
        requirements: ['Prosecution offer received', 'Client consultation completed', 'Risk assessment'],
        outcomes: ['Plea agreement reached or trial preparation continues', 'Sentencing parameters established'],
        tips: ['Carefully weigh trial risks vs. plea benefits', 'Consider long-term career impact', 'Negotiate for minimal punishment'],
        resources: [
          { title: 'Plea Negotiation Strategies', url: '/resources/plea-strategies', type: 'guide' },
          { title: 'Sentencing Guidelines', url: '/resources/sentencing-guide', type: 'document' }
        ]
      },
      {
        id: 'trial-preparation',
        title: 'Court-Martial Trial Preparation',
        description: 'Final preparation for court-martial proceedings',
        status: 'upcoming',
        category: 'preparation',
        estimatedDays: 14,
        priority: 'critical',
        requirements: ['Witness preparation', 'Opening/closing statements', 'Exhibit organization'],
        outcomes: ['Trial strategy finalized', 'All witnesses prepared', 'Defense case ready'],
        tips: ['Practice testimony with witnesses', 'Prepare for cross-examination', 'Organize evidence methodically'],
        resources: [
          { title: 'Trial Preparation Manual', url: '/resources/trial-prep-manual', type: 'document' },
          { title: 'Courtroom Procedures Video', url: '/resources/courtroom-procedures', type: 'video' }
        ]
      },
      {
        id: 'court-martial-trial',
        title: 'Court-Martial Trial',
        description: 'Formal court-martial proceedings and verdict',
        status: 'upcoming',
        category: 'proceedings',
        estimatedDays: 5,
        priority: 'critical',
        requirements: ['Panel selected', 'All parties present', 'Evidence admissible'],
        outcomes: ['Verdict rendered', 'Sentencing completed', 'Appeal rights explained'],
        tips: ['Maintain military bearing', 'Follow attorney guidance', 'Stay focused during proceedings'],
        resources: [
          { title: 'Court-Martial Process Guide', url: '/resources/court-martial-process', type: 'guide' },
          { title: 'Post-Trial Procedures', url: '/resources/post-trial', type: 'document' }
        ]
      }
    ]
  },
  'family-law': {
    caseType: 'Military Family Law',
    branch: 'Navy',
    currentStep: 2,
    totalSteps: 6,
    estimatedCompletion: '30-60 days',
    urgencyLevel: 'routine',
    milestones: [
      { step: 2, title: 'Legal Documents Prepared', importance: 'Foundation for family protection' },
      { step: 4, title: 'Command Notification', importance: 'Official recognition of family status' },
      { step: 6, title: 'Legal Protections Activated', importance: 'Full family legal coverage' }
    ],
    steps: [
      {
        id: 'family-consultation',
        title: 'Family Legal Consultation',
        description: 'Comprehensive review of family legal needs and military regulations',
        status: 'completed',
        category: 'consultation',
        estimatedDays: 1,
        priority: 'high',
        requirements: ['Family status documentation', 'Military orders', 'Dependent information'],
        outcomes: ['Legal needs assessed', 'Documentation requirements identified', 'Timeline established'],
        tips: ['Bring all family-related documents', 'Consider future deployments', 'Address custody concerns early'],
        resources: [
          { title: 'Military Family Law Guide', url: '/resources/family-law-guide', type: 'guide' },
          { title: 'Family Readiness Checklist', url: '/resources/family-readiness', type: 'document' }
        ]
      },
      {
        id: 'document-preparation',
        title: 'Power of Attorney & Legal Documents',
        description: 'Prepare essential family legal documents including POAs and wills',
        status: 'current',
        category: 'documentation',
        estimatedDays: 5,
        priority: 'high',
        requirements: ['Spouse information', 'Dependent details', 'Asset inventory'],
        outcomes: ['Powers of attorney executed', 'Wills updated', 'Family care plans completed'],
        tips: ['Include specific military benefits', 'Plan for deployment scenarios', 'Update beneficiaries'],
        resources: [
          { title: 'POA Templates', url: '/resources/poa-templates', type: 'document' },
          { title: 'Military Will Guide', url: '/resources/military-will', type: 'guide' }
        ]
      },
      {
        id: 'document-notarization',
        title: 'Document Notarization & Certification',
        description: 'Official notarization and certification of all legal documents',
        status: 'upcoming',
        category: 'documentation',
        estimatedDays: 2,
        priority: 'medium',
        requirements: ['Valid identification', 'Completed documents', 'Notary availability'],
        outcomes: ['All documents notarized', 'Certified copies obtained', 'Official records updated'],
        tips: ['Use military notary services when available', 'Obtain multiple certified copies', 'Verify all signatures'],
        resources: [
          { title: 'Notarization Process', url: '/resources/notarization', type: 'guide' },
          { title: 'Military Notary Directory', url: '/resources/notary-directory', type: 'document' }
        ]
      },
      {
        id: 'command-notification',
        title: 'Command Notification & Record Updates',
        description: 'Notify command structure and update military records',
        status: 'upcoming',
        category: 'documentation',
        estimatedDays: 3,
        priority: 'high',
        requirements: ['Completed legal documents', 'Chain of command identified', 'Record access'],
        outcomes: ['Command properly notified', 'Military records updated', 'Family readiness confirmed'],
        tips: ['Follow proper notification procedures', 'Keep copies of all submissions', 'Confirm receipt of updates'],
        resources: [
          { title: 'Command Notification Procedures', url: '/resources/command-notifications', type: 'guide' },
          { title: 'Record Update Forms', url: '/resources/record-forms', type: 'document' }
        ]
      },
      {
        id: 'deployment-preparation',
        title: 'Deployment Family Care Planning',
        description: 'Comprehensive family care and legal preparation for deployments',
        status: 'upcoming',
        category: 'preparation',
        estimatedDays: 7,
        priority: 'high',
        requirements: ['Deployment orders', 'Childcare arrangements', 'Emergency contacts'],
        outcomes: ['Family care plan approved', 'Emergency procedures established', 'Legal protections activated'],
        tips: ['Plan for extended separations', 'Establish multiple backup plans', 'Consider spouse employment needs'],
        resources: [
          { title: 'Deployment Family Guide', url: '/resources/deployment-family', type: 'guide' },
          { title: 'Childcare Resources', url: '/resources/childcare', type: 'document' }
        ]
      },
      {
        id: 'ongoing-support',
        title: 'Ongoing Legal Support & Updates',
        description: 'Continuous legal support and document maintenance',
        status: 'upcoming',
        category: 'resolution',
        estimatedDays: 0,
        priority: 'medium',
        requirements: ['Regular check-ins scheduled', 'Document expiration tracking', 'Family status monitoring'],
        outcomes: ['Continuous legal protection', 'Updated documentation', 'Proactive issue resolution'],
        tips: ['Schedule annual document reviews', 'Update after life changes', 'Maintain emergency contact lists'],
        resources: [
          { title: 'Ongoing Support Program', url: '/resources/ongoing-support', type: 'guide' },
          { title: 'Document Maintenance Schedule', url: '/resources/maintenance-schedule', type: 'document' }
        ]
      }
    ]
  }
};

export default function LegalRoadmapVisualization() {
  const [selectedRoadmap, setSelectedRoadmap] = useState<string>('court-martial');
  const [selectedStep, setSelectedStep] = useState<string | null>(null);
  const [animationComplete, setAnimationComplete] = useState(false);

  const roadmap = mockRoadmaps[selectedRoadmap];

  useEffect(() => {
    setAnimationComplete(false);
    const timer = setTimeout(() => setAnimationComplete(true), 1000);
    return () => clearTimeout(timer);
  }, [selectedRoadmap]);

  const getStatusIcon = (status: RoadmapStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'current':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'upcoming':
        return <div className="w-5 h-5 rounded-full border-2 border-gray-400" />;
      case 'blocked':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
    }
  };

  const getStatusColor = (status: RoadmapStep['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 border-green-300 dark:bg-green-900 dark:border-green-700';
      case 'current':
        return 'bg-blue-100 border-blue-300 dark:bg-blue-900 dark:border-blue-700';
      case 'upcoming':
        return 'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700';
      case 'blocked':
        return 'bg-red-100 border-red-300 dark:bg-red-900 dark:border-red-700';
    }
  };

  const getPriorityColor = (priority: RoadmapStep['priority']) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-600 text-white';
      case 'high':
        return 'bg-orange-600 text-white';
      case 'medium':
        return 'bg-yellow-600 text-white';
      case 'low':
        return 'bg-green-600 text-white';
    }
  };

  const getCategoryIcon = (category: RoadmapStep['category']) => {
    switch (category) {
      case 'consultation':
        return <Users className="w-4 h-4" />;
      case 'preparation':
        return <BookOpen className="w-4 h-4" />;
      case 'documentation':
        return <FileText className="w-4 h-4" />;
      case 'proceedings':
        return <Gavel className="w-4 h-4" />;
      case 'resolution':
        return <Target className="w-4 h-4" />;
    }
  };

  const progressPercentage = (roadmap.currentStep / roadmap.totalSteps) * 100;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.h1 
          className="text-4xl font-bold text-gray-900 dark:text-white"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Interactive Legal Roadmap
        </motion.h1>
        <motion.p 
          className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Navigate your military legal journey with confidence. Track progress, understand requirements, and access resources at every step.
        </motion.p>
      </div>

      {/* Roadmap Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Tabs value={selectedRoadmap} onValueChange={setSelectedRoadmap} className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="court-martial">Court-Martial Defense</TabsTrigger>
            <TabsTrigger value="family-law">Military Family Law</TabsTrigger>
          </TabsList>
        </Tabs>
      </motion.div>

      {/* Progress Overview */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              Case Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Step {roadmap.currentStep} of {roadmap.totalSteps}</span>
                <span className="font-medium">{Math.round(progressPercentage)}%</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Estimated completion: {roadmap.estimatedCompletion}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              Case Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Type:</span>
                <span className="text-sm font-medium">{roadmap.caseType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Branch:</span>
                <span className="text-sm font-medium">{roadmap.branch}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Urgency:</span>
                <Badge 
                  variant={roadmap.urgencyLevel === 'emergency' ? 'destructive' : 
                           roadmap.urgencyLevel === 'urgent' ? 'default' : 'secondary'}
                >
                  {roadmap.urgencyLevel}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-600" />
              Key Milestones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {roadmap.milestones.map((milestone, index) => (
                <div key={index} className="flex items-center gap-2">
                  {milestone.step <= roadmap.currentStep ? (
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-gray-400 flex-shrink-0" />
                  )}
                  <div>
                    <p className="text-sm font-medium">{milestone.title}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{milestone.importance}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Roadmap Steps */}
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Legal Process Steps</h2>
        
        <div className="relative">
          {/* Connection Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300 dark:bg-gray-600" />
          
          {roadmap.steps.map((step, index) => (
            <motion.div
              key={step.id}
              className="relative flex gap-6 pb-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: animationComplete ? 1 : 0, x: animationComplete ? 0 : -20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {/* Step Indicator */}
              <div className="relative z-10 flex-shrink-0">
                <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center ${getStatusColor(step.status)}`}>
                  {getStatusIcon(step.status)}
                </div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                  <Badge variant="outline" className="text-xs">
                    {index + 1}
                  </Badge>
                </div>
              </div>

              {/* Step Content */}
              <div className="flex-1 min-w-0">
                <Card className={`transition-all duration-300 ${step.status === 'current' ? 'ring-2 ring-blue-500' : ''}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(step.category)}
                          <CardTitle className="text-lg">{step.title}</CardTitle>
                          <Badge className={getPriorityColor(step.priority)}>
                            {step.priority}
                          </Badge>
                        </div>
                        <CardDescription className="text-base">
                          {step.description}
                        </CardDescription>
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {step.estimatedDays} {step.estimatedDays === 1 ? 'day' : 'days'}
                          </div>
                          <Badge variant="outline">
                            {step.category}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedStep(selectedStep === step.id ? null : step.id)}
                      >
                        <Info className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>

                  <AnimatePresence>
                    {selectedStep === step.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <CardContent className="pt-0">
                          <Tabs defaultValue="requirements" className="w-full">
                            <TabsList className="grid w-full grid-cols-4">
                              <TabsTrigger value="requirements">Requirements</TabsTrigger>
                              <TabsTrigger value="outcomes">Outcomes</TabsTrigger>
                              <TabsTrigger value="tips">Tips</TabsTrigger>
                              <TabsTrigger value="resources">Resources</TabsTrigger>
                            </TabsList>

                            <TabsContent value="requirements" className="mt-4">
                              <div className="space-y-2">
                                <h4 className="font-medium flex items-center gap-2">
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                  Requirements
                                </h4>
                                <ul className="space-y-1">
                                  {step.requirements.map((req, i) => (
                                    <li key={i} className="text-sm flex items-start gap-2">
                                      <ArrowRight className="w-3 h-3 mt-0.5 text-gray-400 flex-shrink-0" />
                                      {req}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </TabsContent>

                            <TabsContent value="outcomes" className="mt-4">
                              <div className="space-y-2">
                                <h4 className="font-medium flex items-center gap-2">
                                  <Target className="w-4 h-4 text-blue-600" />
                                  Expected Outcomes
                                </h4>
                                <ul className="space-y-1">
                                  {step.outcomes.map((outcome, i) => (
                                    <li key={i} className="text-sm flex items-start gap-2">
                                      <ArrowRight className="w-3 h-3 mt-0.5 text-gray-400 flex-shrink-0" />
                                      {outcome}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </TabsContent>

                            <TabsContent value="tips" className="mt-4">
                              <div className="space-y-2">
                                <h4 className="font-medium flex items-center gap-2">
                                  <Info className="w-4 h-4 text-yellow-600" />
                                  Professional Tips
                                </h4>
                                <ul className="space-y-1">
                                  {step.tips.map((tip, i) => (
                                    <li key={i} className="text-sm flex items-start gap-2">
                                      <ArrowRight className="w-3 h-3 mt-0.5 text-gray-400 flex-shrink-0" />
                                      {tip}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </TabsContent>

                            <TabsContent value="resources" className="mt-4">
                              <div className="space-y-2">
                                <h4 className="font-medium flex items-center gap-2">
                                  <BookOpen className="w-4 h-4 text-purple-600" />
                                  Resources & Documentation
                                </h4>
                                <div className="space-y-2">
                                  {step.resources.map((resource, i) => (
                                    <div key={i} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                                      <div className="flex items-center gap-2">
                                        {resource.type === 'document' && <FileText className="w-4 h-4 text-blue-600" />}
                                        {resource.type === 'guide' && <BookOpen className="w-4 h-4 text-green-600" />}
                                        {resource.type === 'video' && <div className="w-4 h-4 bg-red-600 rounded" />}
                                        {resource.type === 'contact' && <Phone className="w-4 h-4 text-orange-600" />}
                                        <span className="text-sm font-medium">{resource.title}</span>
                                      </div>
                                      <Button size="sm" variant="outline" asChild>
                                        <a href={resource.url} target="_blank" rel="noopener noreferrer">
                                          Access
                                        </a>
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </TabsContent>
                          </Tabs>
                        </CardContent>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        className="flex flex-col sm:flex-row gap-4 justify-center pt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.2 }}
      >
        <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
          <Phone className="w-5 h-5 mr-2" />
          Schedule Consultation
        </Button>
        <Button size="lg" variant="outline">
          <FileText className="w-5 h-5 mr-2" />
          Download Progress Report
        </Button>
        <Button size="lg" variant="outline">
          <Users className="w-5 h-5 mr-2" />
          Connect with Attorney
        </Button>
      </motion.div>
    </div>
  );
}