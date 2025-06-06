export default function DocumentGenerator() {
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

  let selectedTemplate = null;
  let formData = {};
  let generatedDocument = "";
  let showPreview = false;

  function selectTemplate(templateId) {
    selectedTemplate = templates.find(t => t.id === templateId);
    formData = {};
    generatedDocument = "";
    showPreview = false;
    renderApp();
  }

  function updateField(field, value) {
    formData[field] = value;
  }

  function generateDocument() {
    if (!selectedTemplate) return;

    let content = selectedTemplate.template;
    
    // Replace placeholders with form data
    Object.entries(formData).forEach(([key, value]) => {
      content = content.replace(new RegExp(`{${key}}`, 'g'), value || `[${key.toUpperCase()}]`);
    });

    // Add current date
    const currentDate = new Date().toLocaleDateString();
    content = content.replace(/{currentDate}/g, currentDate);

    generatedDocument = content;
    showPreview = true;
    renderApp();
  }

  function downloadDocument() {
    if (!selectedTemplate || !generatedDocument) return;
    const blob = new Blob([generatedDocument], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selectedTemplate.name.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function formatFieldName(field) {
    return field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  }

  function renderApp() {
    const appContainer = document.getElementById('document-generator-root');
    if (!appContainer) return;

    appContainer.innerHTML = `
      <div style="max-width: 1200px; margin: 0 auto; padding: 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="font-size: 36px; font-weight: bold; color: #1f2937; margin-bottom: 16px;">
            One-Click Legal Document Wizard
          </h1>
          <p style="font-size: 20px; color: #6b7280; max-width: 768px; margin: 0 auto;">
            Generate professional military legal documents instantly. All templates comply with current regulations and include proper legal formatting.
          </p>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 24px; margin-bottom: 32px;">
          <!-- Template Selection -->
          <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px;">
            <h2 style="font-size: 20px; font-weight: 600; margin-bottom: 8px;">Select Document Template</h2>
            <p style="color: #6b7280; margin-bottom: 16px;">Choose from our collection of military legal document templates</p>
            
            ${templates.map(template => `
              <div 
                onclick="selectTemplate(${template.id})" 
                style="
                  padding: 16px; 
                  border: 2px solid ${selectedTemplate?.id === template.id ? '#3b82f6' : '#e5e7eb'}; 
                  border-radius: 8px; 
                  cursor: pointer; 
                  margin-bottom: 12px;
                  background: ${selectedTemplate?.id === template.id ? '#eff6ff' : 'white'};
                  transition: all 0.2s;
                "
                onmouseover="this.style.background='#f9fafb'"
                onmouseout="this.style.background='${selectedTemplate?.id === template.id ? '#eff6ff' : 'white'}'"
              >
                <h3 style="font-weight: 600; margin-bottom: 4px;">${template.name}</h3>
                <p style="font-size: 14px; color: #6b7280;">${template.category}</p>
              </div>
            `).join('')}
          </div>

          <!-- Document Form -->
          <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px;">
            <h2 style="font-size: 20px; font-weight: 600; margin-bottom: 8px;">
              ${selectedTemplate ? `Complete: ${selectedTemplate.name}` : 'Select a Template'}
            </h2>
            <p style="color: #6b7280; margin-bottom: 16px;">
              ${selectedTemplate ? 'Fill in the required information' : 'Choose a template to begin'}
            </p>

            ${selectedTemplate ? `
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px;">
                ${selectedTemplate.fields.map(field => `
                  <div>
                    <label style="display: block; font-weight: 500; margin-bottom: 4px;">${formatFieldName(field)}</label>
                    ${field.toLowerCase().includes('address') || field.toLowerCase().includes('reason') || field.toLowerCase().includes('response') || field.toLowerCase().includes('allegation') ? `
                      <textarea
                        onchange="updateField('${field}', this.value)"
                        placeholder="Enter ${formatFieldName(field).toLowerCase()}"
                        style="
                          width: 100%; 
                          padding: 8px 12px; 
                          border: 1px solid #d1d5db; 
                          border-radius: 6px; 
                          font-size: 14px;
                          min-height: 80px;
                          resize: vertical;
                        "
                      ></textarea>
                    ` : `
                      <input
                        type="text"
                        onchange="updateField('${field}', this.value)"
                        placeholder="Enter ${formatFieldName(field).toLowerCase()}"
                        style="
                          width: 100%; 
                          padding: 8px 12px; 
                          border: 1px solid #d1d5db; 
                          border-radius: 6px; 
                          font-size: 14px;
                        "
                      />
                    `}
                  </div>
                `).join('')}
              </div>

              <div style="display: flex; gap: 12px;">
                <button 
                  onclick="generateDocument()"
                  style="
                    background: #3b82f6; 
                    color: white; 
                    padding: 10px 20px; 
                    border: none; 
                    border-radius: 6px; 
                    font-weight: 500; 
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                  "
                  onmouseover="this.style.background='#2563eb'"
                  onmouseout="this.style.background='#3b82f6'"
                >
                  📄 Generate Document
                </button>
                
                ${generatedDocument ? `
                  <button 
                    onclick="showPreview = !showPreview; renderApp()"
                    style="
                      background: white; 
                      color: #374151; 
                      padding: 10px 20px; 
                      border: 1px solid #d1d5db; 
                      border-radius: 6px; 
                      font-weight: 500; 
                      cursor: pointer;
                    "
                  >
                    👁️ ${showPreview ? 'Hide Preview' : 'Show Preview'}
                  </button>
                  
                  <button 
                    onclick="downloadDocument()"
                    style="
                      background: #10b981; 
                      color: white; 
                      padding: 10px 20px; 
                      border: none; 
                      border-radius: 6px; 
                      font-weight: 500; 
                      cursor: pointer;
                    "
                    onmouseover="this.style.background='#059669'"
                    onmouseout="this.style.background='#10b981'"
                  >
                    💾 Download
                  </button>
                ` : ''}
              </div>
            ` : `
              <div style="text-align: center; padding: 48px; color: #9ca3af;">
                <div style="font-size: 64px; margin-bottom: 16px;">📄</div>
                <p>Select a document template to begin</p>
              </div>
            `}
          </div>
        </div>

        ${showPreview && generatedDocument ? `
          <!-- Document Preview -->
          <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px;">
            <h2 style="font-size: 20px; font-weight: 600; margin-bottom: 8px;">
              👁️ Document Preview: ${selectedTemplate?.name}
            </h2>
            <p style="color: #6b7280; margin-bottom: 16px;">
              Review your generated document before downloading
            </p>
            <div style="background: #f9fafb; padding: 24px; border-radius: 8px; border: 1px solid #e5e7eb;">
              <pre style="white-space: pre-wrap; font-family: 'Courier New', monospace; font-size: 14px; line-height: 1.5;">
${generatedDocument}
              </pre>
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }

  // Make functions global for onclick handlers
  window.selectTemplate = selectTemplate;
  window.updateField = updateField;
  window.generateDocument = generateDocument;
  window.downloadDocument = downloadDocument;

  // Initial render
  if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
      const container = document.createElement('div');
      container.id = 'document-generator-root';
      document.body.appendChild(container);
      renderApp();
    });
  }

  return (
    <div id="document-generator-root"></div>
  );
}