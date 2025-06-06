import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FileText, Download } from "lucide-react";

const templates = [
  {
    id: 1,
    name: "Power of Attorney",
    category: "Legal Documents",
    template: `POWER OF ATTORNEY

I, {fullName}, of {address}, hereby appoint {agentName} of {agentAddress} as my attorney-in-fact to act in my name, place, and stead in any way which I myself could do, if I were personally present.

This power of attorney shall remain in full force and effect until revoked by me.

IN WITNESS WHEREOF, I have hereunto set my hand this _____ day of _______, 20__.

_________________________________
{fullName}

State of: _____________
County of: ___________

On this day personally appeared {fullName}, who proved to me on the basis of satisfactory evidence to be the person whose name is subscribed to the within instrument.

_________________________________
Notary Public`,
    fields: ["fullName", "address", "agentName", "agentAddress"]
  },
  {
    id: 2,
    name: "Article 15 Response",
    category: "Military Justice",
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

4. I respectfully request that you consider this information before making your decision.

_________________________________
{serviceMemberName}, {rank}`,
    fields: ["serviceMemberName", "rank", "commanderName", "allegation", "response"]
  },
  {
    id: 3,
    name: "Leave Request Form",
    category: "Administrative",
    template: `LEAVE REQUEST FORM

NAME: {serviceMemberName}
RANK: {rank}
UNIT: {unit}

PERIOD OF LEAVE:
From: {startDate} To: {endDate}

LEAVE ADDRESS: {leaveAddress}

REASON FOR LEAVE: {leaveReason}

I certify that the information provided is accurate and complete.

_________________________________          DATE: __________
{serviceMemberName}, {rank}

SUPERVISOR RECOMMENDATION:
[ ] Approve  [ ] Disapprove

_________________________________          DATE: __________
Supervisor Signature

COMMANDING OFFICER ACTION:
[ ] Approve  [ ] Disapprove

_________________________________          DATE: __________
Commanding Officer`,
    fields: ["serviceMemberName", "rank", "unit", "startDate", "endDate", "leaveAddress", "leaveReason"]
  }
];

export default function DocumentWizardBasic() {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [formData, setFormData] = useState({});
  const [generatedDocument, setGeneratedDocument] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateDocument = () => {
    if (!selectedTemplate) return;

    let content = selectedTemplate.template;
    
    // Replace placeholders with form data
    Object.entries(formData).forEach(([key, value]) => {
      content = content.replace(new RegExp(`{${key}}`, 'g'), value || `[${key.toUpperCase()}]`);
    });

    // Add current date
    const currentDate = new Date().toLocaleDateString();
    content = content.replace(/{currentDate}/g, currentDate);

    setGeneratedDocument(content);
    setShowPreview(true);
  };

  const downloadDocument = () => {
    const blob = new Blob([generatedDocument], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selectedTemplate.name.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const formatFieldName = (field) => {
    return field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">
          One-Click Legal Document Wizard
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Generate professional military legal documents instantly. All templates comply with current regulations and include proper legal formatting.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Template Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Select Document Template</CardTitle>
            <CardDescription>
              Choose from our collection of military legal document templates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {templates.map((template) => (
              <div
                key={template.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                  selectedTemplate?.id === template.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
                onClick={() => {
                  setSelectedTemplate(template);
                  setFormData({});
                  setShowPreview(false);
                }}
              >
                <h3 className="font-semibold">{template.name}</h3>
                <p className="text-sm text-gray-600">{template.category}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Document Form */}
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedTemplate ? `Complete: ${selectedTemplate.name}` : 'Select a Template'}
            </CardTitle>
            <CardDescription>
              {selectedTemplate ? 'Fill in the required information' : 'Choose a template to begin'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedTemplate ? (
              <div className="space-y-4">
                {selectedTemplate.fields.map((field) => (
                  <div key={field}>
                    <Label htmlFor={field}>{formatFieldName(field)}</Label>
                    {field.toLowerCase().includes('address') || field.toLowerCase().includes('reason') || field.toLowerCase().includes('response') || field.toLowerCase().includes('allegation') ? (
                      <Textarea
                        id={field}
                        placeholder={`Enter ${formatFieldName(field).toLowerCase()}`}
                        value={formData[field] || ''}
                        onChange={(e) => handleFormChange(field, e.target.value)}
                        className="mt-1"
                      />
                    ) : (
                      <Input
                        id={field}
                        placeholder={`Enter ${formatFieldName(field).toLowerCase()}`}
                        value={formData[field] || ''}
                        onChange={(e) => handleFormChange(field, e.target.value)}
                        className="mt-1"
                      />
                    )}
                  </div>
                ))}

                <div className="flex gap-3 pt-4">
                  <Button onClick={generateDocument} className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Generate Document
                  </Button>
                  
                  {generatedDocument && (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => setShowPreview(!showPreview)}
                      >
                        {showPreview ? 'Hide Preview' : 'Show Preview'}
                      </Button>
                      
                      <Button
                        variant="secondary"
                        onClick={downloadDocument}
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
              <div className="text-center py-12 text-gray-500">
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
            <CardTitle>Document Preview: {selectedTemplate.name}</CardTitle>
            <CardDescription>
              Review your generated document before downloading
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-6 rounded-lg border">
              <pre className="whitespace-pre-wrap text-sm font-mono">
                {generatedDocument}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}