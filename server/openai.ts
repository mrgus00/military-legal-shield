import OpenAI from "openai";

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