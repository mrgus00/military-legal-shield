import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { FileText, Download, Eye, Edit, Save, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import PageLayout from "@/components/page-layout";

const documentFormSchema = z.object({
  documentType: z.string().min(1, "Document type is required"),
  branch: z.string().min(1, "Military branch is required"),
  rank: z.string().min(1, "Rank is required"),
  fullName: z.string().min(1, "Full name is required"),
  unit: z.string().min(1, "Unit is required"),
  serviceNumber: z.string().optional(),
  dateOfIncident: z.string().optional(),
  circumstancesDescription: z.string().min(10, "Please provide detailed circumstances"),
  witnessNames: z.string().optional(),
  supportingEvidence: z.string().optional(),
  desiredOutcome: z.string().min(5, "Please specify desired outcome"),
  additionalDetails: z.string().optional(),
});

type DocumentFormData = z.infer<typeof documentFormSchema>;

const documentTypes = [
  // Essential Personal Legal Documents
  {
    id: "will-testament",
    name: "Last Will and Testament",
    description: "Comprehensive will with military-specific provisions",
    category: "Estate Planning",
    timeRequired: "45-60 minutes",
    urgency: "high",
    notarization: true,
    raisedSeal: true
  },
  {
    id: "general-power-of-attorney",
    name: "General Power of Attorney",
    description: "Broad authority for financial and legal matters",
    category: "Estate Planning",
    timeRequired: "30-45 minutes",
    urgency: "high",
    notarization: true,
    raisedSeal: true
  },
  {
    id: "specific-power-of-attorney",
    name: "Specific Power of Attorney",
    description: "Limited authority for specific transactions or matters",
    category: "Estate Planning",
    timeRequired: "20-30 minutes",
    urgency: "medium",
    notarization: true,
    raisedSeal: true
  },
  {
    id: "durable-power-of-attorney",
    name: "Durable Power of Attorney",
    description: "Authority that continues if principal becomes incapacitated",
    category: "Estate Planning",
    timeRequired: "30-45 minutes",
    urgency: "high",
    notarization: true,
    raisedSeal: true
  },
  {
    id: "healthcare-power-of-attorney",
    name: "Healthcare Power of Attorney",
    description: "Authority to make medical decisions on behalf of principal",
    category: "Healthcare",
    timeRequired: "25-35 minutes",
    urgency: "high",
    notarization: true,
    raisedSeal: true
  },
  {
    id: "living-will",
    name: "Living Will/Advance Directive",
    description: "Instructions for end-of-life medical care decisions",
    category: "Healthcare",
    timeRequired: "30-40 minutes",
    urgency: "medium",
    notarization: true,
    raisedSeal: true
  },
  {
    id: "revocable-trust",
    name: "Revocable Living Trust",
    description: "Flexible trust for asset management and distribution",
    category: "Estate Planning",
    timeRequired: "60-90 minutes",
    urgency: "low",
    notarization: true,
    raisedSeal: true
  },
  {
    id: "irrevocable-trust",
    name: "Irrevocable Trust",
    description: "Permanent trust for tax benefits and asset protection",
    category: "Estate Planning",
    timeRequired: "75-120 minutes",
    urgency: "low",
    notarization: true,
    raisedSeal: true
  },
  {
    id: "military-family-care-plan",
    name: "Military Family Care Plan",
    description: "Custody arrangements for deployment situations",
    category: "Family Law",
    timeRequired: "45-60 minutes",
    urgency: "high",
    notarization: true,
    raisedSeal: false
  },
  {
    id: "affidavit-of-support",
    name: "Affidavit of Support",
    description: "Financial support declaration for family members",
    category: "Immigration/Family",
    timeRequired: "20-30 minutes",
    urgency: "medium",
    notarization: true,
    raisedSeal: true
  },
  // Military-Specific Administrative Documents
  {
    id: "article15-rebuttal",
    name: "Article 15 Rebuttal",
    description: "Response to non-judicial punishment",
    category: "Military Administrative",
    timeRequired: "30-45 minutes",
    urgency: "high",
    notarization: false,
    raisedSeal: false
  },
  {
    id: "request-for-redress",
    name: "Request for Redress",
    description: "Formal complaint against military decision",
    category: "Military Administrative",
    timeRequired: "45-60 minutes",
    urgency: "medium",
    notarization: false,
    raisedSeal: false
  },
  {
    id: "clearance-appeal",
    name: "Security Clearance Appeal",
    description: "Appeal denial or revocation of security clearance",
    category: "Security",
    timeRequired: "60-90 minutes",
    urgency: "high",
    notarization: false,
    raisedSeal: false
  },
  {
    id: "medical-board-response",
    name: "Medical Evaluation Board Response",
    description: "Response to MEB findings and recommendations",
    category: "Medical",
    timeRequired: "45-75 minutes",
    urgency: "high",
    notarization: false,
    raisedSeal: false
  },
  {
    id: "discharge-upgrade-request",
    name: "Discharge Characterization Upgrade",
    description: "Request to upgrade discharge characterization",
    category: "Veterans Affairs",
    timeRequired: "90-120 minutes",
    urgency: "low",
    notarization: false,
    raisedSeal: false
  },
  {
    id: "ig-complaint",
    name: "Inspector General Complaint",
    description: "Formal complaint to Inspector General",
    category: "Military Administrative",
    timeRequired: "60-90 minutes",
    urgency: "medium",
    notarization: false,
    raisedSeal: false
  },
  {
    id: "equal-opportunity-complaint",
    name: "Equal Opportunity Complaint",
    description: "Complaint regarding discrimination or harassment",
    category: "EO/Civil Rights",
    timeRequired: "45-60 minutes",
    urgency: "high",
    notarization: false,
    raisedSeal: false
  },
  {
    id: "financial-hardship-request",
    name: "Financial Hardship Documentation",
    description: "Request for financial assistance or hardship consideration",
    category: "Financial",
    timeRequired: "30-45 minutes",
    urgency: "medium",
    notarization: false,
    raisedSeal: false
  }
];

const militaryBranches = [
  { id: "army", name: "U.S. Army" },
  { id: "navy", name: "U.S. Navy" },
  { id: "marines", name: "U.S. Marine Corps" },
  { id: "airforce", name: "U.S. Air Force" },
  { id: "spaceforce", name: "U.S. Space Force" },
  { id: "coastguard", name: "U.S. Coast Guard" }
];

export default function DocumentPrep() {
  const [selectedDocumentType, setSelectedDocumentType] = useState<string>("");
  const [generatedDocument, setGeneratedDocument] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { toast } = useToast();

  const form = useForm<DocumentFormData>({
    resolver: zodResolver(documentFormSchema),
    defaultValues: {
      documentType: "",
      branch: "",
      rank: "",
      fullName: "",
      unit: "",
      serviceNumber: "",
      dateOfIncident: "",
      circumstancesDescription: "",
      witnessNames: "",
      supportingEvidence: "",
      desiredOutcome: "",
      additionalDetails: "",
    },
  });

  const generateDocumentMutation = useMutation({
    mutationFn: async (formData: DocumentFormData) => {
      setIsGenerating(true);
      const response = await apiRequest("POST", "/api/generate-document", formData);
      return response.json();
    },
    onSuccess: (data) => {
      setGeneratedDocument(data.document);
      setPreviewMode(true);
      toast({
        title: "Document Generated",
        description: "Your legal document has been successfully generated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Generation Failed",
        description: "Failed to generate document. Please try again.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsGenerating(false);
    }
  });

  const onSubmit = (data: DocumentFormData) => {
    generateDocumentMutation.mutate(data);
  };

  const downloadDocument = () => {
    const blob = new Blob([generatedDocument], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = `${selectedDocumentType}-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "Document Downloaded",
      description: "Your document has been saved to your downloads folder.",
    });
  };

  const selectedDoc = documentTypes.find(doc => doc.id === selectedDocumentType);
  
  const categories = Array.from(new Set(documentTypes.map(doc => doc.category)));
  const filteredDocuments = selectedCategory === "all" 
    ? documentTypes 
    : documentTypes.filter(doc => doc.category === selectedCategory);

  return (
    <PageLayout className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-navy-900 dark:text-white mb-4">
            Legal Document Preparation
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Generate essential legal documents including Wills, Power of Attorney, Trusts, and military-specific forms with notarization support
          </p>
        </div>

        {!previewMode ? (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Document Type Selection */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Document Types
                  </CardTitle>
                  <CardDescription>
                    Select the type of legal document you need
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Category Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Filter by Category</label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Document List */}
                  {filteredDocuments.map((docType) => (
                    <Card
                      key={docType.id}
                      className={`cursor-pointer transition-all ${
                        selectedDocumentType === docType.id
                          ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950/50"
                          : "hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                      onClick={() => {
                        setSelectedDocumentType(docType.id);
                        form.setValue("documentType", docType.id);
                      }}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-sm">{docType.name}</h3>
                          <Badge
                            variant={docType.urgency === "high" ? "destructive" : 
                                   docType.urgency === "medium" ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {docType.urgency}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                          {docType.description}
                        </p>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-500">{docType.category}</span>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{docType.timeRequired}</span>
                          </div>
                        </div>
                        {(docType.notarization || docType.raisedSeal) && (
                          <div className="flex gap-2 mt-2">
                            {docType.notarization && (
                              <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Notarization Required
                              </Badge>
                            )}
                            {docType.raisedSeal && (
                              <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                                <AlertCircle className="w-3 h-3 mr-1" />
                                Raised Seal
                              </Badge>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Document Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {selectedDoc ? selectedDoc.name : "Select Document Type"}
                  </CardTitle>
                  <CardDescription>
                    {selectedDoc ? selectedDoc.description : "Choose a document type to get started"}
                  </CardDescription>
                  {selectedDoc && (selectedDoc.notarization || selectedDoc.raisedSeal) && (
                    <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                      <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">Notarization Requirements</h4>
                      <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                        {selectedDoc.notarization && (
                          <li>• Document must be signed in presence of a notary public</li>
                        )}
                        {selectedDoc.raisedSeal && (
                          <li>• Requires official notary seal with raised impression</li>
                        )}
                        <li>• Two witnesses required for signature</li>
                        <li>• Valid photo ID must be presented to notary</li>
                        <li>• Contact base legal office for notarization assistance</li>
                      </ul>
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  {selectedDocumentType ? (
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <Tabs defaultValue="basic" className="w-full">
                          <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="basic">Basic Information</TabsTrigger>
                            <TabsTrigger value="details">Case Details</TabsTrigger>
                            <TabsTrigger value="outcome">Desired Outcome</TabsTrigger>
                          </TabsList>

                          <TabsContent value="basic" className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                              <FormField
                                control={form.control}
                                name="branch"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Military Branch</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select branch" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        {militaryBranches.map((branch) => (
                                          <SelectItem key={branch.id} value={branch.id}>
                                            {branch.name}
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
                                name="rank"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Rank</FormLabel>
                                    <FormControl>
                                      <Input placeholder="e.g., SGT, CPT, LT" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <FormField
                              control={form.control}
                              name="fullName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Full Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Last, First Middle Initial" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <div className="grid md:grid-cols-2 gap-4">
                              <FormField
                                control={form.control}
                                name="unit"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Unit</FormLabel>
                                    <FormControl>
                                      <Input placeholder="e.g., 1st Battalion, 75th Ranger Regiment" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="serviceNumber"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Service Number (Optional)</FormLabel>
                                    <FormControl>
                                      <Input placeholder="DOD ID or SSN last 4" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </TabsContent>

                          <TabsContent value="details" className="space-y-4">
                            <FormField
                              control={form.control}
                              name="dateOfIncident"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Date of Incident (if applicable)</FormLabel>
                                  <FormControl>
                                    <Input type="date" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="circumstancesDescription"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Detailed Circumstances</FormLabel>
                                  <FormControl>
                                    <Textarea
                                      placeholder="Provide a detailed description of the circumstances, events, or situation that necessitates this document..."
                                      className="min-h-32"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <div className="grid md:grid-cols-2 gap-4">
                              <FormField
                                control={form.control}
                                name="witnessNames"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Witnesses (Optional)</FormLabel>
                                    <FormControl>
                                      <Textarea
                                        placeholder="List witness names, ranks, and contact information if available..."
                                        className="min-h-24"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="supportingEvidence"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Supporting Evidence (Optional)</FormLabel>
                                    <FormControl>
                                      <Textarea
                                        placeholder="Describe any documents, photos, or other evidence you have..."
                                        className="min-h-24"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </TabsContent>

                          <TabsContent value="outcome" className="space-y-4">
                            <FormField
                              control={form.control}
                              name="desiredOutcome"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Desired Outcome</FormLabel>
                                  <FormControl>
                                    <Textarea
                                      placeholder="Clearly state what you hope to achieve with this document..."
                                      className="min-h-24"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="additionalDetails"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Additional Details (Optional)</FormLabel>
                                  <FormControl>
                                    <Textarea
                                      placeholder="Any other relevant information..."
                                      className="min-h-24"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </TabsContent>
                        </Tabs>

                        <div className="flex justify-end pt-6">
                          <Button
                            type="submit"
                            className="bg-navy-900 hover:bg-navy-800"
                            disabled={isGenerating}
                          >
                            {isGenerating ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                                Generating Document...
                              </>
                            ) : (
                              <>
                                <FileText className="w-4 h-4 mr-2" />
                                Generate Document
                              </>
                            )}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  ) : (
                    <div className="text-center py-12">
                      <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Select Document Type
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Choose a document type from the list to begin
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          /* Document Preview */
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Document Preview</CardTitle>
                  <CardDescription>
                    Review your generated document before downloading
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setPreviewMode(false)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    onClick={downloadDocument}
                    className="bg-navy-900 hover:bg-navy-800"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-white dark:bg-gray-800 border rounded-lg p-6 min-h-96 font-mono text-sm whitespace-pre-wrap">
                {generatedDocument}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </PageLayout>
  );
}