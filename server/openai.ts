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
    
    // Court-martial responses with enhanced UCMJ knowledge
    if (lowerMessage.includes('court martial') || lowerMessage.includes('court-martial') || lowerMessage.includes('charges') || lowerMessage.includes('criminal')) {
      return {
        response: "Hooah, service member. Court-martial proceedings are the most serious military legal matters requiring IMMEDIATE legal representation. Your fundamental rights under Articles 31-46 UCMJ: 1) Right to remain silent (Article 31), 2) Right to detailed military defense counsel at no cost (Article 38), 3) Right to hire civilian counsel at own expense, 4) Right to witnesses and evidence (Article 46), 5) Right to speedy trial. CRITICAL: Do NOT make ANY statements without counsel present. Exercise Article 31 rights immediately.",
        suggestions: [
          "Contact Trial Defense Service or Area Defense Counsel immediately - within hours",
          "Exercise Article 31 rights - remain silent until counsel present",
          "Request detailed military defense counsel assignment",
          "Do not discuss case with ANYONE except attorney-client privileged communications",
          "Preserve all evidence, documents, and witness contact information",
          "Understand charges: Summary (minor), Special (intermediate), General (felony-level)"
        ],
        urgencyLevel: "high",
        category: "court-martial",
        requiresHumanAttorney: true,
        ucmjReferences: ["Article 31 (Compulsory self-incrimination)", "Article 38 (Duties of trial counsel and defense counsel)", "Article 46 (Opportunity to obtain witnesses and evidence)", "Rule for Courts-Martial 506"],
        timeline: "Contact defense counsel immediately - preferably within hours of notification",
        militaryChannels: ["Trial Defense Service (TDS)", "Area Defense Counsel (ADC)", "Senior Defense Counsel"],
        emergencyContacts: ["TDS 24-hour duty officer", "Base ADC emergency line", "Command duty officer if in pretrial confinement"]
      };
    }
    
    // Security clearance responses with enhanced procedural knowledge
    if (lowerMessage.includes('security clearance') || lowerMessage.includes('clearance') || lowerMessage.includes('sf-86') || lowerMessage.includes('sead 4')) {
      return {
        response: "Copy that, service member. Security clearance adjudication follows SEAD 4 guidelines and can significantly impact your military career. Complete honesty is MANDATORY - false statements or omissions violate Article 86 UCMJ and can result in criminal charges. Common adjudication concerns: financial issues (Guideline F), foreign influence (Guideline B), personal conduct (Guideline E), criminal conduct (Guideline J). If you receive a Statement of Reasons (SOR), you have 30 days to respond and can request a hearing before an administrative judge.",
        suggestions: [
          "Complete SF-86 with absolute honesty - omissions are worse than disclosed issues",
          "Gather supporting documentation for any reportable incidents",
          "Consult security manager or legal assistance before submission if concerns exist",
          "For SOR response: engage qualified security clearance attorney within 15 days",
          "Document mitigation efforts: financial counseling, character references, rehabilitation",
          "Understand adjudicative guidelines and whole-person concept"
        ],
        urgencyLevel: "medium",
        category: "security-clearance",
        requiresHumanAttorney: false,
        ucmjReferences: ["Article 86 (Absence without leave - false official statements)", "SEAD 4 (National Security Adjudicative Guidelines)", "32 CFR Part 154"],
        timeline: "SOR response due within 30 days if received",
        militaryChannels: ["Unit security manager", "Base legal assistance", "Personnel security office"],
        emergencyContacts: []
      };
    }
    
    // SHARP/Sexual Assault/Equal Opportunity responses
    if (lowerMessage.includes('sharp') || lowerMessage.includes('sexual assault') || lowerMessage.includes('harassment') || lowerMessage.includes('equal opportunity') || lowerMessage.includes('discrimination')) {
      return {
        response: "Copy that, service member. SHARP (Sexual Harassment/Assault Response and Prevention) and Equal Opportunity matters are taken extremely seriously. You have multiple reporting options: 1) Unrestricted report (triggers investigation), 2) Restricted report (confidential support). For sexual assault, you have Article 32 hearing rights if charges are preferred. EO complaints follow AR 600-20. Your safety and rights are protected - retaliation is prohibited and punishable under UCMJ.",
        suggestions: [
          "Contact SHARP/SARC representative immediately for sexual assault",
          "File EO complaint with unit EO advisor or IG for discrimination",
          "Understand reporting options: restricted vs unrestricted for sexual assault",
          "Document all incidents with dates, witnesses, and evidence",
          "Contact Special Victims Counsel (SVC) for legal representation",
          "Know that retaliation is a separate punishable offense under Article 92"
        ],
        urgencyLevel: "high",
        category: "sharp",
        requiresHumanAttorney: true,
        ucmjReferences: ["Article 120 (Sexual assault)", "Article 92 (Failure to obey order - anti-retaliation)", "AR 600-20 (Army Command Policy)", "Article 32 (Investigation)"],
        timeline: "Report immediately - time-sensitive evidence preservation critical",
        militaryChannels: ["SHARP representative", "Sexual Assault Response Coordinator (SARC)", "Equal Opportunity advisor", "Inspector General"],
        emergencyContacts: ["DoD Safe Helpline: 877-995-5247", "Base SARC 24-hour hotline", "Military Crisis Line: 1-800-273-8255"]
      };
    }

    // Administrative separation responses
    if (lowerMessage.includes('separation') || lowerMessage.includes('chapter') || lowerMessage.includes('administrative discharge') || lowerMessage.includes('adsep')) {
      return {
        response: "Roger that, service member. Administrative separation proceedings can significantly impact your military career and veteran benefits. You have rights during separation processing: 1) Right to consult counsel, 2) Right to submit statements in your behalf, 3) Right to request retention (depending on chapter), 4) Right to administrative board hearing for certain chapters. Characterization of service (Honorable, General, OTH) affects veteran benefits. Critical to understand basis for separation and your response options.",
        suggestions: [
          "Contact legal assistance immediately to review separation packet",
          "Understand specific chapter basis for separation (misconduct, performance, etc.)",
          "Submit comprehensive rebuttal statement addressing separation basis",
          "Request administrative separation board hearing if eligible",
          "Gather character references, awards, performance evaluations",
          "Consider impact on veteran benefits, GI Bill, disability compensation"
        ],
        urgencyLevel: "high",
        category: "administrative",
        requiresHumanAttorney: true,
        ucmjReferences: ["AR 635-200 (Army separations)", "SECNAVINST 1920.6C (Navy separations)", "AFI 36-3208 (Air Force separations)"],
        timeline: "Typically 5-15 duty days to respond depending on chapter",
        militaryChannels: ["Legal assistance office", "Area Defense Counsel", "Administrative separation board"],
        emergencyContacts: []
      };
    }

    // Family law responses
    if (lowerMessage.includes('divorce') || lowerMessage.includes('custody') || lowerMessage.includes('family') || lowerMessage.includes('marriage')) {
      return {
        response: "Roger, service member. Military family law involves unique considerations including BAH, family separation allowance, and Servicemembers Civil Relief Act protections. For divorce, consider military pension division (10-year overlap rule for direct payments), survivor benefit plan decisions, and jurisdiction issues with frequent PCS moves. Legal assistance offices provide excellent family law services at no cost. Military families have special protections and benefits.",
        suggestions: [
          "Schedule legal assistance appointment within 48 hours",
          "Gather financial documents (LES, W-2s, TSP statements, etc.)",
          "Research state laws where filing - consider favorable jurisdiction",
          "Understand military pension division requirements and survivor benefits",
          "Consider impact on security clearance and command notification requirements",
          "Document any family care plan issues if single parent"
        ],
        urgencyLevel: "medium",
        category: "family-law",
        requiresHumanAttorney: true,
        ucmjReferences: ["Servicemembers Civil Relief Act", "Uniformed Services Former Spouses Protection Act"],
        timeline: "Consult legal assistance before taking any legal action",
        militaryChannels: ["Base legal assistance office", "Family life chaplain", "Army Community Service"],
        emergencyContacts: []
      };
    }
    
    // Financial/debt responses
    if (lowerMessage.includes('debt') || lowerMessage.includes('financial') || lowerMessage.includes('bankruptcy') || lowerMessage.includes('money') || lowerMessage.includes('scra')) {
      return {
        response: "Copy that, service member. Financial problems can significantly affect your security clearance and military career. The Servicemembers Civil Relief Act (SCRA) provides substantial protections: 6% interest rate cap on pre-service debts, foreclosure protections, lease termination rights for PCS/deployment, and court stay provisions. Financial irresponsibility can lead to administrative action under Article 92 for failure to pay debts. Command notification may be required for bankruptcy filing.",
        suggestions: [
          "Contact Military Family Life Counselor or financial counselor immediately",
          "Review and invoke Servicemembers Civil Relief Act protections",
          "Notify creditors in writing of military status with copy of orders",
          "Consider debt management plan through non-profit credit counseling",
          "Consult legal assistance before bankruptcy filing - command notification required",
          "Document all financial hardship related to military service for SCRA benefits"
        ],
        urgencyLevel: "medium",
        category: "financial",
        requiresHumanAttorney: false,
        ucmjReferences: ["Article 92 (Failure to obey order - paying debts)", "Servicemembers Civil Relief Act (50 USC 3901)"],
        timeline: "Address financial issues before security clearance review",
        militaryChannels: ["Base legal assistance", "Army Community Service financial counseling", "Military Family Life Counselor"],
        emergencyContacts: []
      };
    }

    // Inspector General and whistleblower responses
    if (lowerMessage.includes('inspector general') || lowerMessage.includes('whistleblower') || lowerMessage.includes('fraud') || lowerMessage.includes('waste') || lowerMessage.includes('abuse')) {
      return {
        response: "Roger that, service member. Inspector General complaints address fraud, waste, abuse, and violations of law or regulation. You have whistleblower protections under various federal statutes. IG investigations are confidential and retaliation is prohibited. You can file complaints at unit level, installation level, or higher headquarters. For serious criminal matters, consider contacting CID/NCIS/OSI. Document everything thoroughly and maintain copies of all evidence.",
        suggestions: [
          "Contact Installation Inspector General office",
          "Document all evidence of fraud, waste, or abuse thoroughly",
          "File written complaint with specific dates, names, and incidents",
          "Understand whistleblower protections under applicable federal statutes",
          "Consider anonymous hotlines for serious criminal matters",
          "Keep detailed records and copies of all communications"
        ],
        urgencyLevel: "medium",
        category: "whistleblower",
        requiresHumanAttorney: false,
        ucmjReferences: ["Article 92 (Failure to obey order)", "Inspector General Act", "Whistleblower Protection Enhancement Act"],
        timeline: "File complaint promptly while evidence is available",
        militaryChannels: ["Installation Inspector General", "Army Inspector General", "Department of Defense Inspector General"],
        emergencyContacts: ["DoD Inspector General Hotline: 1-800-424-9098"]
      };
    }
    
    // Default response for comprehensive military legal guidance
    return {
      response: `Hooah, service member! I'm SGT Legal Ready, your military legal assistant with comprehensive knowledge of UCMJ and military law. While I'm operating on enhanced fallback systems, I can provide detailed guidance on military legal matters. Your inquiry about "${message.substring(0, 50)}..." requires proper attention. I can assist with Article 15 proceedings, court-martial defense, security clearances, administrative separations, SHARP matters, family law, financial issues, and more. What specific military legal situation can I help you navigate?`,
      suggestions: [
        "Contact base legal assistance office within 24-48 hours",
        "Speak with JAG officer for complex legal matters",
        "Review applicable UCMJ articles and military regulations",
        "Document your situation with dates, witnesses, and evidence",
        "Understand your rights under relevant UCMJ provisions",
        "Consider urgency level and timeline for required actions"
      ],
      urgencyLevel: "low",
      category: "general",
      requiresHumanAttorney: false,
      ucmjReferences: ["Review applicable UCMJ articles for your situation"],
      timeline: "Seek appropriate military legal guidance within 48 hours",
      militaryChannels: ["Unit legal assistance office", "Base JAG services", "Trial Defense Service (if criminal matters)"],
      emergencyContacts: []
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