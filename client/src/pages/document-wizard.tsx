import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { FileText, Download, Eye, Clock, CheckCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DocumentTemplate {
  id: number;
  name: string;
  category: string;
  description: string;
  template: string;
  requiredFields: string[];
  optionalFields: string[];
  isActive: boolean;
}

interface GeneratedDocument {
  id: number;
  templateId: number;
  userId: string;
  documentName: string;
  documentContent: string;
  formData: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const documentCategories = [
  { value: "all", label: "All Categories" },
  { value: "Legal Documents", label: "Legal Documents" },
  { value: "Military Justice", label: "Military Justice" },
  { value: "Administrative", label: "Administrative" },
  { value: "Security Clearance", label: "Security Clearance" }
];

export default function DocumentWizard() {
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [generatedDocument, setGeneratedDocument] = useState<GeneratedDocument | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch document templates
  const { data: templates = [], isLoading: templatesLoading } = useQuery({
    queryKey: ["/api/document-templates", selectedCategory],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/document-templates?category=${selectedCategory}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json() as DocumentTemplate[];
      } catch (error) {
        console.error("Error fetching templates:", error);
        return [] as DocumentTemplate[];
      }
    },
  });

  // Fetch user documents
  const { data: userDocuments = [], isLoading: documentsLoading } = useQuery({
    queryKey: ["/api/documents/user", "demo-user"],
    queryFn: async () => {
      try {
        const response = await fetch("/api/documents/user/demo-user");
        if (!response.ok) {
          if (response.status === 404) return [] as GeneratedDocument[];
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json() as GeneratedDocument[];
      } catch (error) {
        console.error("Error fetching user documents:", error);
        return [] as GeneratedDocument[];
      }
    },
  });

  // Generate document mutation
  const generateDocumentMutation = useMutation({
    mutationFn: async (data: { templateId: number; formData: Record<string, string>; userId?: string }) => {
      const response = await fetch("/api/documents/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json() as GeneratedDocument;
    },
    onSuccess: (document: GeneratedDocument) => {
      setGeneratedDocument(document);
      setShowPreview(true);
      queryClient.invalidateQueries({ queryKey: ["/api/documents/user"] });
      toast({
        title: "Document Generated Successfully",
        description: "Your legal document has been prepared and is ready for review.",
      });
    },
    onError: (error) => {
      console.error("Generation error:", error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate document. Please try again.",
        variant: "destructive",
      });
    },
  });

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
    if (selectedTemplate) {
      generateDocumentMutation.mutate({
        templateId: selectedTemplate.id,
        formData,
        userId: "demo-user"
      });
    }
  };

  const downloadDocument = (doc: GeneratedDocument) => {
    const blob = new Blob([doc.documentContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = window.document.createElement('a');
    link.href = url;
    link.download = `${doc.documentName}.txt`;
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
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
          <TabsTrigger value="generate" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Generate Document
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Document History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Template Selection */}
            <Card className="lg:col-span-1">
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

                <ScrollArea className="h-[400px] space-y-2">
                  {templatesLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
                    </div>
                  ) : (
                    templates.map((template: DocumentTemplate) => (
                      <Card
                        key={template.id}
                        className={`cursor-pointer transition-colors hover:bg-accent mb-2 ${
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
                    ))
                  )}
                </ScrollArea>
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
                          {field.toLowerCase().includes('address') || field.toLowerCase().includes('description') || field.toLowerCase().includes('statement') ? (
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
                          {field.toLowerCase().includes('address') || field.toLowerCase().includes('description') || field.toLowerCase().includes('statement') ? (
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
                        disabled={generateDocumentMutation.isPending}
                        className="flex items-center gap-2"
                      >
                        {generateDocumentMutation.isPending ? (
                          <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                        ) : (
                          <FileText className="h-4 w-4" />
                        )}
                        Generate Document
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
                  Document Preview
                </CardTitle>
                <CardDescription>
                  Review your generated document before downloading
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
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
              {documentsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
                </div>
              ) : userDocuments.length > 0 ? (
                <div className="space-y-4">
                  {userDocuments.map((document: GeneratedDocument) => (
                    <Card key={document.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h3 className="font-semibold">{document.documentName}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Created: {new Date(document.createdAt).toLocaleDateString()}
                          </p>
                          <Badge variant={document.status === 'completed' ? 'default' : 'secondary'}>
                            <CheckCircle className="h-3 w-3 mr-1" />
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