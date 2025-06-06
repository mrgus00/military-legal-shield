import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Download, Eye } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface DocumentTemplate {
  id: number;
  name: string;
  category: string;
  description: string;
  template: string;
  requiredFields: string[];
  optionalFields: string[];
}

interface GeneratedDocument {
  id: number;
  templateId: number;
  documentName: string;
  documentContent: string;
  status: string;
  createdAt: string;
}

const militaryTemplates: DocumentTemplate[] = [
  {
    id: 1,
    name: "Power of Attorney",
    category: "Legal Documents",
    description: "Legal document granting authority to act on behalf of another person",
    template: `POWER OF ATTORNEY

I, {fullName}, of {address}, hereby appoint {agentName} of {agentAddress} as my attorney-in-fact to act in my name, place, and stead in any way which I myself could do, if I were personally present, with respect to the following matters:

1. Banking and financial transactions
2. Real estate transactions
3. Military administrative matters
4. {specificPowers}

This power of attorney shall remain in full force and effect until {expirationDate} unless sooner revoked by me.

IN WITNESS WHEREOF, I have hereunto set my hand this _____ day of _______, 20__.

_________________________________
{fullName}

State of: _____________
County of: ___________

On this day personally appeared {fullName}, who proved to me on the basis of satisfactory evidence to be the person whose name is subscribed to the within instrument.

_________________________________
Notary Public`,
    requiredFields: ["fullName", "address", "agentName", "agentAddress"],
    optionalFields: ["specificPowers", "expirationDate"]
  },
  {
    id: 2,
    name: "Article 15 Response",
    category: "Military Justice",
    description: "Response to non-judicial punishment under UCMJ Article 15",
    template: `RESPONSE TO ARTICLE 15 PROCEEDINGS

TO: {commanderName}
FROM: {serviceMemberName}, {rank}
DATE: {currentDate}
SUBJECT: Response to Article 15 Proceedings

1. I have been informed of the allegation against me: {allegation}

2. I understand my rights under Article 15, UCMJ, including:
   a. The right to demand trial by court-martial in lieu of Article 15
   b. The right to remain silent
   c. The right to present matters in defense, extenuation, and mitigation

3. My response to this allegation: {response}

4. Witnesses I request to testify on my behalf: {witnessNames}

5. Evidence I wish to present: {evidenceDescription}

6. I respectfully request that you consider this information before making your decision.

_________________________________
{serviceMemberName}, {rank}
{unitAssignment}`,
    requiredFields: ["serviceMemberName", "rank", "commanderName", "allegation", "response"],
    optionalFields: ["witnessNames", "evidenceDescription", "unitAssignment"]
  },
  {
    id: 3,
    name: "Leave Request Form",
    category: "Administrative",
    description: "Official request for military leave",
    template: `LEAVE REQUEST FORM

NAME: {serviceMemberName}
RANK: {rank}
SSN: {ssn}
UNIT: {unit}
DUTY PHONE: {dutyPhone}

TYPE OF LEAVE REQUESTED: {leaveType}

PERIOD OF LEAVE:
From: {startDate} To: {endDate}
Number of Days Requested: {numberOfDays}

LEAVE ADDRESS: {leaveAddress}
PHONE NUMBER DURING LEAVE: {leavePhone}

EMERGENCY CONTACT: {emergencyContact}
EMERGENCY PHONE: {emergencyPhone}

REASON FOR LEAVE: {leaveReason}

I certify that the information provided is accurate and complete.

_________________________________          DATE: __________
{serviceMemberName}, {rank}

SUPERVISOR RECOMMENDATION:
[ ] Approve  [ ] Disapprove
Comments: ________________________

_________________________________          DATE: __________
Supervisor Signature

COMMANDING OFFICER ACTION:
[ ] Approve  [ ] Disapprove
Comments: ________________________

_________________________________          DATE: __________
Commanding Officer`,
    requiredFields: ["serviceMemberName", "rank", "unit", "startDate", "endDate", "leaveAddress"],
    optionalFields: ["ssn", "dutyPhone", "leaveType", "numberOfDays", "leavePhone", "emergencyContact", "emergencyPhone", "leaveReason"]
  },
  {
    id: 4,
    name: "Military Will",
    category: "Legal Documents",
    description: "Last will and testament for military personnel",
    template: `LAST WILL AND TESTAMENT

I, {fullName}, {rank}, currently stationed at {currentBase}, being of sound mind and disposing memory, do hereby make, publish and declare this to be my Last Will and Testament.

FIRST: I hereby revoke all former wills and codicils made by me.

SECOND: I direct that all my just debts and funeral expenses be paid as soon as practicable after my death.

THIRD: I give, devise and bequeath all of my property, both real and personal, to {beneficiaryName}, my {relationship}.

FOURTH: I hereby nominate and appoint {executorName} as Executor of this Will.

FIFTH: If {beneficiaryName} predeceases me, I give all my property to {alternateBeneficiary}.

IN WITNESS WHEREOF, I have hereunto set my hand this _____ day of _______, 20__.

_________________________________
{fullName}, {rank}

WITNESSES:
We, the undersigned, certify that the testator signed this will in our presence.

_________________    _________________
Witness 1           Witness 2`,
    requiredFields: ["fullName", "rank", "currentBase", "beneficiaryName", "relationship", "executorName"],
    optionalFields: ["alternateBeneficiary", "specificBequests"]
  }
];

export default function DocumentWizardSimple() {
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [generatedDocument, setGeneratedDocument] = useState<GeneratedDocument | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [userDocuments, setUserDocuments] = useState<GeneratedDocument[]>([]);

  const documentCategories = [
    { value: "all", label: "All Categories" },
    { value: "Legal Documents", label: "Legal Documents" },
    { value: "Military Justice", label: "Military Justice" },
    { value: "Administrative", label: "Administrative" }
  ];

  const filteredTemplates = selectedCategory === "all" 
    ? militaryTemplates 
    : militaryTemplates.filter(t => t.category === selectedCategory);

  const handleTemplateSelect = (template: DocumentTemplate) => {
    setSelectedTemplate(template);
    setGeneratedDocument(null);
    setShowPreview(false);
    setFormData({});
  };

  const handleFormDataChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerateDocument = () => {
    if (!selectedTemplate) return;

    setIsGenerating(true);

    // Simulate processing time
    setTimeout(() => {
      // Replace template placeholders with form data
      let documentContent = selectedTemplate.template;
      Object.entries(formData).forEach(([key, value]) => {
        documentContent = documentContent.replace(new RegExp(`{${key}}`, 'g'), value || `[${key.toUpperCase()}]`);
      });

      // Add current date if needed
      const currentDate = new Date().toLocaleDateString();
      documentContent = documentContent.replace(/{currentDate}/g, currentDate);

      // Create generated document
      const newDocument: GeneratedDocument = {
        id: Date.now(),
        templateId: selectedTemplate.id,
        documentName: selectedTemplate.name,
        documentContent,
        status: "completed",
        createdAt: new Date().toISOString()
      };

      setGeneratedDocument(newDocument);
      setShowPreview(true);
      setUserDocuments(prev => [newDocument, ...prev]);
      setIsGenerating(false);
    }, 1500);
  };

  const downloadDocument = (doc: GeneratedDocument) => {
    const blob = new Blob([doc.documentContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${doc.documentName}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const formatFieldLabel = (field: string) => {
    return field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          One-Click Legal Document Wizard
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Generate professional military legal documents instantly with our guided wizard. 
          All templates are reviewed by military legal experts and comply with current regulations.
        </p>
      </div>

      <Tabs defaultValue="generate" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="generate">
            <FileText className="h-4 w-4 mr-2" />
            Generate Document
          </TabsTrigger>
          <TabsTrigger value="history">
            <Eye className="h-4 w-4 mr-2" />
            Document History ({userDocuments.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Template Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Select Document Template</CardTitle>
                <CardDescription>
                  Choose from our collection of military legal document templates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {documentCategories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredTemplates.map((template) => (
                    <Card
                      key={template.id}
                      className={`cursor-pointer transition-colors hover:bg-accent ${
                        selectedTemplate?.id === template.id ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => handleTemplateSelect(template)}
                    >
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <h3 className="font-semibold text-sm">{template.name}</h3>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {template.description}
                          </p>
                          <Badge variant="secondary" className="text-xs">
                            {template.category}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Document Form */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>
                  {selectedTemplate ? `Complete: ${selectedTemplate.name}` : 'Select a Template'}
                </CardTitle>
                <CardDescription>
                  {selectedTemplate ? 'Fill in the required information to generate your document' : 'Choose a template from the left to begin'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedTemplate ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedTemplate.requiredFields.map((field) => (
                        <div key={field}>
                          <Label htmlFor={field}>{formatFieldLabel(field)} *</Label>
                          {field.toLowerCase().includes('address') || field.toLowerCase().includes('reason') || field.toLowerCase().includes('response') ? (
                            <Textarea
                              id={field}
                              placeholder={`Enter ${formatFieldLabel(field).toLowerCase()}`}
                              value={formData[field] || ''}
                              onChange={(e) => handleFormDataChange(field, e.target.value)}
                              className="mt-1"
                            />
                          ) : (
                            <Input
                              id={field}
                              placeholder={`Enter ${formatFieldLabel(field).toLowerCase()}`}
                              value={formData[field] || ''}
                              onChange={(e) => handleFormDataChange(field, e.target.value)}
                              className="mt-1"
                            />
                          )}
                        </div>
                      ))}

                      {selectedTemplate.optionalFields.map((field) => (
                        <div key={field}>
                          <Label htmlFor={field}>{formatFieldLabel(field)} (Optional)</Label>
                          {field.toLowerCase().includes('address') || field.toLowerCase().includes('description') || field.toLowerCase().includes('powers') ? (
                            <Textarea
                              id={field}
                              placeholder={`Enter ${formatFieldLabel(field).toLowerCase()}`}
                              value={formData[field] || ''}
                              onChange={(e) => handleFormDataChange(field, e.target.value)}
                              className="mt-1"
                            />
                          ) : (
                            <Input
                              id={field}
                              placeholder={`Enter ${formatFieldLabel(field).toLowerCase()}`}
                              value={formData[field] || ''}
                              onChange={(e) => handleFormDataChange(field, e.target.value)}
                              className="mt-1"
                            />
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-4 pt-4">
                      <Button 
                        onClick={handleGenerateDocument}
                        disabled={isGenerating}
                        className="flex items-center gap-2"
                      >
                        {isGenerating ? (
                          <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                        ) : (
                          <FileText className="h-4 w-4" />
                        )}
                        {isGenerating ? 'Generating...' : 'Generate Document'}
                      </Button>
                      
                      {generatedDocument && (
                        <>
                          <Button
                            variant="outline"
                            onClick={() => setShowPreview(!showPreview)}
                            className="flex items-center gap-2"
                          >
                            <Eye className="h-4 w-4" />
                            {showPreview ? 'Hide Preview' : 'Show Preview'}
                          </Button>
                          
                          <Button
                            variant="secondary"
                            onClick={() => downloadDocument(generatedDocument)}
                            className="flex items-center gap-2"
                          >
                            <Download className="h-4 w-4" />
                            Download
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p>Select a document template to begin</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Document Preview */}
          {showPreview && generatedDocument && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Document Preview: {generatedDocument.documentName}
                </CardTitle>
                <CardDescription>
                  Review your generated document before downloading
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border">
                  <pre className="whitespace-pre-wrap text-sm font-mono">
                    {generatedDocument.documentContent}
                  </pre>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Document History</CardTitle>
              <CardDescription>
                View and manage your previously generated documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              {userDocuments.length > 0 ? (
                <div className="space-y-4">
                  {userDocuments.map((document) => (
                    <Card key={document.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h3 className="font-semibold">{document.documentName}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Created: {new Date(document.createdAt).toLocaleDateString()}
                          </p>
                          <Badge variant="default">
                            {document.status}
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setGeneratedDocument(document);
                              setShowPreview(true);
                            }}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => downloadDocument(document)}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>No documents generated yet</p>
                  <p className="text-sm">Generate your first document using the wizard above</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}