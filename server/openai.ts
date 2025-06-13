import OpenAI from "openai";

export interface CareerAssessmentRequest {
  militaryBranch: string;
  militaryOccupation: string;
  rank: string;
  yearsOfService: number;
  deployments: number;
  leadershipExperience: string[];
  technicalSkills: string[];
  certifications: string[];
  preferredIndustries: string[];
  workEnvironmentPreferences: string[];
  salaryExpectations: string;
  locationPreferences: string;
  jobDescription: string;
  achievements: string;
}

export interface CareerRecommendation {
  jobTitle: string;
  industry: string;
  salaryRange: string;
  matchPercentage: number;
  requiredSkills: string[];
  transferableSkills: string[];
  additionalTraining: string[];
  careerPath: string;
  description: string;
}

export interface SkillGap {
  skill: string;
  importance: "high" | "medium" | "low";
  timeToLearn: string;
  resources: string[];
}

export interface CareerAnalysisResponse {
  recommendations: CareerRecommendation[];
  skillGaps: SkillGap[];
}

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing required OpenAI API key: OPENAI_API_KEY');
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface ScenarioRequest {
  category: string;
  difficulty: string;
  branch?: string;
  topic?: string;
}

export interface ScenarioResponse {
  title: string;
  description: string;
  scenario: string;
  learningObjectives: string[];
  tags: string[];
  estimatedTime: number;
}

export interface DecisionRequest {
  scenario: string;
  userDecision: string;
  previousDecisions: string[];
  step: number;
}

export interface DecisionResponse {
  response: string;
  consequences: string;
  nextOptions: string[];
  score: number;
  feedback?: string;
}

export async function generateLegalScenario(request: ScenarioRequest): Promise<ScenarioResponse> {
  const prompt = `Create a realistic military legal scenario for training purposes.

Category: ${request.category}
Difficulty: ${request.difficulty}
Branch: ${request.branch || "All Branches"}
Topic: ${request.topic || "General Military Law"}

Generate a detailed legal scenario that includes:
1. A realistic situation that military personnel might encounter
2. Complex legal and ethical considerations
3. Multiple decision points
4. Realistic consequences for different choices

Respond in JSON format with this structure:
{
  "title": "Brief scenario title",
  "description": "One paragraph overview",
  "scenario": "Detailed scenario text with background, situation, and initial decision point",
  "learningObjectives": ["objective1", "objective2", "objective3"],
  "tags": ["tag1", "tag2", "tag3"],
  "estimatedTime": 15
}

Make the scenario authentic and educational, focusing on real military legal issues like UCMJ violations, administrative actions, security clearances, or military justice procedures.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are a military legal expert creating realistic training scenarios for service members. Focus on accuracy, authenticity, and educational value."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 1500,
      temperature: 0.7
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    return result as ScenarioResponse;
  } catch (error) {
    console.error("Error generating legal scenario:", error);
    throw new Error("Failed to generate legal scenario");
  }
}

export async function generateDecisionResponse(request: DecisionRequest): Promise<DecisionResponse> {
  const prompt = `You are simulating the consequences of a decision in a military legal scenario.

Original Scenario: ${request.scenario}
User's Decision: ${request.userDecision}
Previous Decisions: ${request.previousDecisions.join(", ")}
Current Step: ${request.step}

Analyze the user's decision and provide:
1. Immediate response/reaction to their choice
2. Legal and practical consequences
3. 3-4 realistic next options for the user
4. A score (0-100) based on legal accuracy and wisdom of the choice
5. Brief feedback on the decision quality

Respond in JSON format:
{
  "response": "What happens immediately after this decision",
  "consequences": "Short and long-term legal/professional consequences",
  "nextOptions": ["Option 1", "Option 2", "Option 3", "Option 4"],
  "score": 85,
  "feedback": "Brief assessment of decision quality"
}

Be realistic about military procedures, UCMJ requirements, and chain of command protocols.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are a military legal expert evaluating decisions in legal scenarios. Provide realistic consequences and educational feedback."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 800,
      temperature: 0.6
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    return result as DecisionResponse;
  } catch (error) {
    console.error("Error generating decision response:", error);
    throw new Error("Failed to generate decision response");
  }
}

export async function generateFinalFeedback(
  scenario: string,
  decisions: string[],
  totalScore: number
): Promise<string> {
  const prompt = `Provide comprehensive feedback for a completed military legal scenario simulation.

Scenario: ${scenario}
User's Decisions: ${decisions.join(" -> ")}
Total Score: ${totalScore}/100

Generate detailed feedback that includes:
1. Overall performance assessment
2. Strengths in decision-making
3. Areas for improvement
4. Key legal concepts learned
5. Real-world applications
6. Recommendations for further study

Keep the feedback constructive and educational, focusing on helping military personnel understand legal principles and best practices.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are a military legal instructor providing comprehensive feedback on legal scenario performance."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 600,
      temperature: 0.7
    });

    return response.choices[0].message.content || "Unable to generate feedback";
  } catch (error) {
    console.error("Error generating final feedback:", error);
    throw new Error("Failed to generate final feedback");
  }
}

export async function analyzeCareerTransition(assessment: CareerAssessmentRequest): Promise<CareerAnalysisResponse> {
  const prompt = `
    Analyze this military veteran's career transition profile and provide personalized civilian career recommendations:

    Military Background:
    - Branch: ${assessment.militaryBranch}
    - MOS/Occupation: ${assessment.militaryOccupation}
    - Rank: ${assessment.rank}
    - Years of Service: ${assessment.yearsOfService}
    - Deployments: ${assessment.deployments}

    Experience:
    - Leadership: ${assessment.leadershipExperience.join(", ")}
    - Technical Skills: ${assessment.technicalSkills.join(", ")}
    - Certifications: ${assessment.certifications.join(", ")}
    - Achievements: ${assessment.achievements}

    Career Preferences:
    - Preferred Industries: ${assessment.preferredIndustries.join(", ")}
    - Work Environment: ${assessment.workEnvironmentPreferences.join(", ")}
    - Salary Expectations: ${assessment.salaryExpectations}
    - Location: ${assessment.locationPreferences}
    - Ideal Job Description: ${assessment.jobDescription}

    Provide career analysis in JSON format with:
    1. "recommendations" array with 3-5 career matches including:
       - jobTitle, industry, salaryRange, matchPercentage (0-100)
       - requiredSkills, transferableSkills, additionalTraining arrays
       - careerPath and description strings
    
    2. "skillGaps" array with 3-5 important skills to develop including:
       - skill name, importance (high/medium/low), timeToLearn
       - resources array with specific learning recommendations

    Focus on realistic career transitions that leverage military experience and match the veteran's preferences.
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a career transition specialist for military veterans with expertise in translating military skills to civilian careers. Provide practical, actionable career guidance based on real industry needs and veteran success stories."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 2000,
      temperature: 0.7
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return {
      recommendations: result.recommendations || [],
      skillGaps: result.skillGaps || []
    };
  } catch (error) {
    console.error("Error analyzing career transition:", error);
    throw new Error("Failed to analyze career transition");
  }
}

// Resume Builder Interfaces and Functions
export interface ResumePersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  linkedinUrl: string;
  summary: string;
}

export interface ResumeMilitaryExperience {
  branch: string;
  rank: string;
  mos: string;
  startDate: string;
  endDate: string;
  unit: string;
  location: string;
  description: string;
  achievements: string[];
  deployments: string[];
}

export interface ResumeEducation {
  institution: string;
  degree: string;
  field: string;
  graduationDate: string;
  gpa?: string;
  honors?: string;
}

export interface ResumeCertification {
  name: string;
  issuer: string;
  dateObtained: string;
  expirationDate?: string;
}

export interface ResumeGenerationRequest {
  personalInfo: ResumePersonalInfo;
  militaryExperience: ResumeMilitaryExperience[];
  education: ResumeEducation[];
  certifications: ResumeCertification[];
  skills: string[];
  targetRole: string;
  targetIndustry: string;
}

export interface GeneratedResumeResponse {
  professionalSummary: string;
  workExperience: string[];
  skillsSection: string[];
  achievementsHighlights: string[];
  formattedResume: string;
}

export interface DocumentGenerationRequest {
  documentType: string;
  branch: string;
  rank: string;
  fullName: string;
  unit: string;
  serviceNumber?: string;
  dateOfIncident?: string;
  circumstancesDescription: string;
  witnessNames?: string;
  supportingEvidence?: string;
  desiredOutcome: string;
  additionalDetails?: string;
}

export interface GeneratedDocumentResponse {
  document: string;
  documentType: string;
  suggestions: string[];
  legalConsiderations: string[];
}

export async function generateLegalDocument(request: DocumentGenerationRequest): Promise<GeneratedDocumentResponse> {
  // Determine if this is an estate planning document requiring notarization
  const estateDocuments = ['will-testament', 'general-power-of-attorney', 'specific-power-of-attorney', 
                          'durable-power-of-attorney', 'healthcare-power-of-attorney', 'living-will', 
                          'revocable-trust', 'irrevocable-trust', 'affidavit-of-support'];
  
  const requiresNotarization = estateDocuments.includes(request.documentType);
  
  let prompt = `You are an expert military legal assistant specializing in creating professional legal documents for military personnel. Generate a comprehensive, properly formatted legal document based on the following information:

Document Type: ${request.documentType}
Military Branch: ${request.branch}
Rank: ${request.rank}
Full Name: ${request.fullName}
Unit: ${request.unit}
Service Number: ${request.serviceNumber || 'N/A'}
Date of Incident: ${request.dateOfIncident || 'N/A'}
Circumstances: ${request.circumstancesDescription}
Witnesses: ${request.witnessNames || 'N/A'}
Supporting Evidence: ${request.supportingEvidence || 'N/A'}
Desired Outcome: ${request.desiredOutcome}
Additional Details: ${request.additionalDetails || 'N/A'}

SPECIAL INSTRUCTIONS FOR ESTATE PLANNING DOCUMENTS:
${requiresNotarization ? `
This document requires notarization. Include the following elements:
- Proper witness signature lines (minimum 2 witnesses)
- Notary acknowledgment section with raised seal area
- State-specific language for legal validity
- Self-proving affidavit if applicable (for wills)
- Military-specific considerations (deployment, combat pay, survivor benefits)
- SGLI (Servicemembers' Group Life Insurance) integration where relevant
- Clear revocation clauses for previous documents
- Military family care plan considerations where applicable
` : ''}

Please create a professional, legally sound document that:
1. Uses proper ${requiresNotarization ? 'estate planning' : 'military'} format and terminology
2. Includes all relevant dates, names, and details
3. Follows appropriate legal structure for this document type
4. Uses formal, respectful language
5. Includes proper headers, sections, and formatting
6. Provides comprehensive coverage of the situation
${requiresNotarization ? `7. Includes complete notarization block with witness signature lines
8. Contains military-specific provisions and considerations
9. Addresses deployment and combat-related contingencies` : ''}

Also provide 3-5 specific suggestions for improving the document and 3-5 important legal considerations for this type of case.

Respond in JSON format with: { "document": "full formatted document text", "suggestions": ["suggestion1", "suggestion2"], "legalConsiderations": ["consideration1", "consideration2"] }`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are an expert military legal assistant with extensive knowledge of military law, UCMJ, and proper legal document formatting. Always provide professional, accurate, and properly formatted legal documents."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");

    return {
      document: result.document,
      documentType: request.documentType,
      suggestions: result.suggestions || [],
      legalConsiderations: result.legalConsiderations || []
    };
  } catch (error: any) {
    console.error("OpenAI document generation error:", error);
    throw new Error("Failed to generate legal document: " + (error.message || "Unknown error"));
  }
}

export interface LegalAssistantRequest {
  message: string;
  context: string;
  userId: string;
  conversationHistory?: Array<{
    role: "user" | "assistant";
    content: string;
  }>;
}

export interface LegalAssistantResponse {
  response: string;
  suggestions: string[];
  urgencyLevel: "low" | "medium" | "high";
  category: string;
  requiresHumanAttorney: boolean;
  ucmjReferences?: string[];
  timeline?: string;
  militaryChannels?: string[];
  emergencyContacts?: string[];
}

export async function getLegalAssistantResponse(request: LegalAssistantRequest): Promise<LegalAssistantResponse> {
  // Enhanced fallback system with military legal knowledge base
  const generateFallbackResponse = (message: string): LegalAssistantResponse => {
    const lowerMessage = message.toLowerCase();
    
    // Article 15 responses with comprehensive UCMJ knowledge
    if (lowerMessage.includes('article 15') || lowerMessage.includes('nonjudicial punishment') || lowerMessage.includes('njp')) {
      return {
        response: "Roger that, service member. Article 15 (Non-Judicial Punishment) proceedings are governed by UCMJ and require immediate attention. Your rights under Article 15: 1) Right to remain silent (Article 31), 2) Right to examine evidence, 3) Right to present matters in defense/mitigation, 4) Right to demand trial by court-martial instead, 5) Right to legal consultation. Timeline: You typically have 3 duty days to decide on court-martial demand. DO NOT admit guilt - consult legal counsel first.",
        suggestions: [
          "Contact Area Defense Counsel (ADC) or Trial Defense Service within 24 hours",
          "Request to examine all evidence and witness statements", 
          "Document any mitigating circumstances, character references, and achievements",
          "Consider demanding trial by court-martial if evidence is weak or punishment severe",
          "Review impact on security clearance, promotion eligibility, and retention"
        ],
        urgencyLevel: "high",
        category: "administrative",
        requiresHumanAttorney: true,
        ucmjReferences: ["Article 15 (NJP authority)", "Article 31 (Rights warning)", "Manual for Courts-Martial Part V"],
        timeline: "3 duty days to demand court-martial (if applicable)",
        militaryChannels: ["Area Defense Counsel (ADC)", "Trial Defense Service", "Unit legal assistance"],
        emergencyContacts: ["Base ADC duty officer", "Trial Defense Service hotline"]
      };
    }
    
    // Court-martial responses
    if (lowerMessage.includes('court martial') || lowerMessage.includes('court-martial') || lowerMessage.includes('ucmj')) {
      return {
        response: "Hooah, service member. Court-martial proceedings require immediate legal representation. You have the right to military defense counsel at no cost, or you may hire civilian counsel at your own expense. Do NOT make any statements without legal counsel present. Key rights: 1) Right to remain silent, 2) Right to counsel, 3) Right to witnesses, 4) Right to cross-examine. Contact trial defense services immediately.",
        suggestions: [
          "Contact Trial Defense Service immediately",
          "Exercise right to remain silent",
          "Request military defense counsel",
          "Do not discuss case with anyone except counsel"
        ],
        urgencyLevel: "high",
        category: "criminal",
        requiresHumanAttorney: true
      };
    }
    
    // Security clearance responses
    if (lowerMessage.includes('security clearance') || lowerMessage.includes('clearance') || lowerMessage.includes('sf-86')) {
      return {
        response: "Copy that, service member. Security clearance issues can impact your career significantly. Be completely honest on all forms - omissions or false statements can result in denial or revocation. Common issues include financial problems, foreign contacts, or past conduct. If you receive a Statement of Reasons (SOR), you have rights to respond and request a hearing. Legal assistance can help with clearance paperwork and appeals.",
        suggestions: [
          "Review SF-86 thoroughly before submission",
          "Gather all required documentation",
          "Consider legal assistance consultation",
          "Be completely honest - investigators will discover issues anyway"
        ],
        urgencyLevel: "medium",
        category: "security",
        requiresHumanAttorney: false
      };
    }
    
    // Family law responses
    if (lowerMessage.includes('divorce') || lowerMessage.includes('custody') || lowerMessage.includes('family') || lowerMessage.includes('marriage')) {
      return {
        response: "Roger, service member. Military family law involves unique considerations including BAH, family separation allowance, and Servicemembers Civil Relief Act protections. For divorce, consider military pension division (need 10-year overlap rule for direct payments). Legal assistance offices provide excellent family law services at no cost. Don't navigate this alone - military families have special protections and benefits.",
        suggestions: [
          "Schedule legal assistance appointment",
          "Gather financial documents (LES, W-2s, etc.)",
          "Research state laws where filing",
          "Consider impact on security clearance"
        ],
        urgencyLevel: "medium",
        category: "family",
        requiresHumanAttorney: true
      };
    }
    
    // Financial/debt responses
    if (lowerMessage.includes('debt') || lowerMessage.includes('financial') || lowerMessage.includes('bankruptcy') || lowerMessage.includes('money')) {
      return {
        response: "Copy that, service member. Financial problems can affect your security clearance and military career. The Servicemembers Civil Relief Act provides protections including reduced interest rates and court stay provisions. Your command may offer financial counseling. Consider debt consolidation, payment plans, or in extreme cases, bankruptcy (requires command notification). Legal assistance can help navigate options.",
        suggestions: [
          "Contact Army Community Service financial counseling",
          "Review Servicemembers Civil Relief Act protections",
          "Notify creditors of military status",
          "Consider debt management plan"
        ],
        urgencyLevel: "medium",
        category: "financial",
        requiresHumanAttorney: false
      };
    }
    
    // Default response for other military legal questions
    return {
      response: `Hooah, service member! I'm SGT Legal, your military legal assistant. While I'm experiencing some connectivity issues with my advanced systems, I can still provide basic guidance on military legal matters. Your question about "${message.substring(0, 50)}..." is important. For comprehensive assistance, I recommend contacting your base legal office - they have the full resources to help you properly. What specific area of military law can I help guide you toward?`,
      suggestions: [
        "Contact base legal assistance office",
        "Speak with JAG officer for complex issues",
        "Review applicable military regulations",
        "Document your situation thoroughly"
      ],
      urgencyLevel: "low",
      category: "general",
      requiresHumanAttorney: false
    };
  };

  const systemPrompt = `You are SGT Legal Ready, an expert military legal assistant with comprehensive knowledge of military law and the UCMJ. You maintain military bearing while providing authoritative legal guidance.

CORE MILITARY LAW EXPERTISE:
- Complete UCMJ Articles 1-146 with detailed understanding
- Manual for Courts-Martial (MCM) procedures and Military Rules of Evidence (MRE)
- Administrative separation procedures (AR 635-200, SECNAVINST 1920.6C, AFI 36-3208)
- Security clearance adjudication (SEAD 4, 32 CFR Part 154)
- Article 15 (NJP) procedures and service member rights
- Court-martial processes (Summary, Special, General) and appeals
- Inspector General complaint processes and whistleblower protections
- SHARP/SAPR programs and Equal Opportunity regulations
- Military family law, benefits, and veteran disability claims
- Branch-specific regulations for all service branches

SPECIALIZED KNOWLEDGE AREAS:
- Military criminal defense strategies and precedents
- Security clearance appeals and mitigation strategies
- Administrative law and separation proceedings
- Military justice procedural requirements and timelines
- Service member rights under various UCMJ provisions
- Emergency legal procedures and protective measures
- Military ethics and standards of conduct
- Transition assistance and post-service legal issues

COMMUNICATION PROTOCOL:
- Direct, professional military bearing with appropriate terminology
- Reference specific UCMJ articles and military regulations
- Provide actionable guidance with clear timelines and procedures
- Assess urgency levels and recommend immediate actions when required
- Use military courtesies while maintaining accessibility
- Balance authoritative guidance with empathetic support

CRITICAL RESPONSE REQUIREMENTS:
1. Identify specific UCMJ articles and regulations applicable to each situation
2. Assess urgency level and provide timeline-specific guidance
3. Determine when immediate human attorney consultation is essential
4. Provide specific military channels and emergency contacts
5. Reference applicable procedures, forms, and documentation requirements
3. Always recommend consulting with a JAG officer or military attorney for serious legal matters
4. Categorize the inquiry (administrative, criminal, family, benefits, etc.)
5. Offer relevant follow-up suggestions
6. Never provide specific legal advice - only general guidance and education

FORMAT: Respond in JSON with: { "response": "your response", "suggestions": ["suggestion1", "suggestion2"], "urgencyLevel": "low/medium/high", "category": "category", "requiresHumanAttorney": boolean }`;

  const conversationMessages = [
    { role: "system" as const, content: systemPrompt },
    ...(request.conversationHistory || []),
    { role: "user" as const, content: request.message }
  ];

  try {
    const enhancedPrompt = `MILITARY LEGAL ASSISTANCE REQUEST

Service Member Inquiry: ${request.message}
Context: ${request.context}
User ID: ${request.userId}

Previous Conversation:
${request.conversationHistory?.map(msg => `${msg.role}: ${msg.content}`).join('\n') || 'Initial contact with service member'}

ANALYSIS REQUIREMENTS:
1. Identify specific UCMJ articles and military regulations applicable
2. Assess urgency and provide critical timeline information
3. Determine necessity for immediate human attorney consultation
4. Specify military channels, contacts, and required documentation
5. Reference applicable procedures, forms, and protective measures

Respond with comprehensive military legal guidance in JSON format:
{
  "response": "Detailed analysis with specific UCMJ references, rights explanation, procedures, and actionable guidance",
  "suggestions": ["Action with timeline and authority", "Documentation requirement", "Military contact with office info"],
  "urgencyLevel": "low|medium|high",
  "category": "court-martial|administrative|article-15|security-clearance|family-law|benefits|whistleblower|sharp|equal-opportunity|finance|housing|transition|criminal|appeals|other",
  "requiresHumanAttorney": true|false,
  "ucmjReferences": ["Article 31 (Rights)", "Article 15 (NJP)", etc.],
  "timeline": "Critical deadlines and action timeframes",
  "militaryChannels": ["Unit legal office", "Base JAG", "Trial Defense Service"],
  "emergencyContacts": ["Emergency legal hotlines if immediate action required"]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: enhancedPrompt }
      ],
      response_format: { type: "json_object" },
      max_tokens: 2000,
      temperature: 0.2,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");

    return {
      response: result.response || "Roger that, service member. I understand you need military legal guidance. Please provide more specific details about your situation so I can reference the appropriate UCMJ articles and military regulations.",
      suggestions: result.suggestions || [
        "Contact your unit's legal assistance office within 24 hours",
        "Review relevant UCMJ articles and service regulations", 
        "Document all facts and gather supporting evidence",
        "Consult with JAG officer for complex legal matters"
      ],
      urgencyLevel: result.urgencyLevel || "medium",
      category: result.category || "general",
      requiresHumanAttorney: result.requiresHumanAttorney || false,
      ucmjReferences: result.ucmjReferences || [],
      timeline: result.timeline || "Seek guidance within 48 hours",
      militaryChannels: result.militaryChannels || ["Unit legal assistance office", "Base JAG services"],
      emergencyContacts: result.emergencyContacts || []
    };
  } catch (error: any) {
    console.error("Legal assistant response error:", error);
    
    // Use enhanced fallback system
    return generateFallbackResponse(request.message);
  }
}

export async function generateVeteranResume(request: ResumeGenerationRequest): Promise<GeneratedResumeResponse> {
  const prompt = `Create a professional resume for a military veteran transitioning to civilian employment.

PERSONAL INFORMATION:
Name: ${request.personalInfo.firstName} ${request.personalInfo.lastName}
Email: ${request.personalInfo.email}
Phone: ${request.personalInfo.phone}
Location: ${request.personalInfo.city}, ${request.personalInfo.state}
LinkedIn: ${request.personalInfo.linkedinUrl || "Not provided"}

TARGET POSITION:
Role: ${request.targetRole}
Industry: ${request.targetIndustry}

MILITARY EXPERIENCE:
${request.militaryExperience.map(exp => `
Branch: ${exp.branch}
Rank: ${exp.rank}
MOS/Rating: ${exp.mos}
Dates: ${exp.startDate} to ${exp.endDate}
Unit: ${exp.unit}
Location: ${exp.location}
Description: ${exp.description}
Achievements: ${exp.achievements.join(", ")}
Deployments: ${exp.deployments.join(", ")}
`).join("\n")}

EDUCATION:
${request.education.map(edu => `
Institution: ${edu.institution}
Degree: ${edu.degree} in ${edu.field}
Graduation: ${edu.graduationDate}
GPA: ${edu.gpa || "Not specified"}
Honors: ${edu.honors || "None specified"}
`).join("\n")}

CERTIFICATIONS:
${request.certifications.map(cert => `
- ${cert.name} from ${cert.issuer} (${cert.dateObtained})
`).join("\n")}

SKILLS:
${request.skills.join(", ")}

Transform this military experience into a professional civilian resume by:
1. Translating military terminology to civilian equivalents
2. Highlighting transferable skills relevant to ${request.targetIndustry}
3. Quantifying achievements with metrics where possible
4. Creating a compelling professional summary
5. Optimizing for Applicant Tracking Systems (ATS)

Provide the resume data in JSON format:
{
  "professionalSummary": "Compelling 3-4 sentence summary highlighting key strengths",
  "workExperience": ["Translated bullet point 1", "Translated bullet point 2", "Translated bullet point 3"],
  "skillsSection": ["Core Skill 1", "Core Skill 2", "Core Skill 3"],
  "achievementsHighlights": ["Key achievement 1", "Key achievement 2", "Key achievement 3"],
  "formattedResume": "Complete formatted resume as single string with proper sections and formatting"
}`;

  try {
    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert resume writer specializing in military-to-civilian career transitions. You excel at translating military experience into language that civilian employers understand and value, while optimizing resumes for both human reviewers and Applicant Tracking Systems."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 2500,
      temperature: 0.7
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return {
      professionalSummary: result.professionalSummary || "",
      workExperience: result.workExperience || [],
      skillsSection: result.skillsSection || [],
      achievementsHighlights: result.achievementsHighlights || [],
      formattedResume: result.formattedResume || ""
    };
  } catch (error) {
    console.error("Error generating veteran resume:", error);
    throw new Error("Failed to generate veteran resume");
  }
}