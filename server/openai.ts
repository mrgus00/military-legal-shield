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
  const prompt = `You are an expert military legal assistant specializing in creating professional military legal documents. Generate a comprehensive, properly formatted legal document based on the following information:

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

Please create a professional, legally sound document that:
1. Uses proper military format and terminology
2. Includes all relevant dates, names, and details
3. Follows appropriate legal structure for this document type
4. Uses formal, respectful language
5. Includes proper headers, sections, and formatting
6. Provides comprehensive coverage of the situation

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

    const result = JSON.parse(response.choices[0].message.content);

    return {
      document: result.document,
      documentType: request.documentType,
      suggestions: result.suggestions || [],
      legalConsiderations: result.legalConsiderations || []
    };
  } catch (error) {
    throw new Error("Failed to generate legal document: " + error.message);
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