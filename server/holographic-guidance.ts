import { Request, Response } from 'express';
import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY environment variable is required');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface HolographicGuidanceRequest {
  message: string;
  personality: 'military-advisor' | 'legal-scholar' | 'tactical-guide' | 'compassionate-counselor';
  legalDomain?: string;
  context?: {
    sessionHistory?: Array<{
      type: string;
      content: string;
      timestamp: Date;
    }>;
    visualMode?: 'holographic' | 'augmented' | 'traditional';
    complexity?: number;
  };
}

interface LegalCitation {
  source: string;
  regulation: string;
  relevance: number;
}

interface ActionItem {
  task: string;
  priority: 'high' | 'medium' | 'low';
  deadline?: string;
}

interface HolographicGuidanceResponse {
  response: string;
  citations?: LegalCitation[];
  actionItems?: ActionItem[];
  complexity?: number;
  confidenceLevel?: number;
  visualEffects?: {
    recommendedColor: string;
    intensity: number;
    animationType: string;
  };
}

class HolographicGuidanceService {
  private getPersonalityPrompt(personality: string): string {
    const prompts = {
      'military-advisor': `You are a seasoned Military Legal Advisor with 20+ years of experience. You provide strategic, tactical legal guidance with military precision. Your responses are:
        - Direct and action-oriented
        - Focused on risk mitigation and strategic planning
        - Emphasize military protocols and chain of command
        - Use military terminology appropriately
        - Provide clear, executable recommendations`,

      'legal-scholar': `You are a Military Law Scholar and expert researcher. Your responses are:
        - Deeply analytical and research-focused
        - Rich in legal precedent and case law citations
        - Explain complex legal concepts clearly
        - Provide comprehensive regulatory analysis
        - Include relevant UCMJ articles and military regulations`,

      'tactical-guide': `You are a Tactical Legal Guide specializing in immediate problem-solving. Your responses are:
        - Fast, decisive, and action-focused
        - Emphasize immediate steps and timelines
        - Identify critical decision points
        - Provide tactical advantage assessments
        - Focus on winning strategies and optimal outcomes`,

      'compassionate-counselor': `You are a Compassionate Legal Counselor who provides supportive guidance. Your responses are:
        - Empathetic and understanding
        - Acknowledge emotional aspects of legal issues
        - Provide reassurance while being realistic
        - Explain options with care and sensitivity
        - Focus on support and guidance through difficulties`
    };

    return prompts[personality] || prompts['military-advisor'];
  }

  private buildSystemPrompt(request: HolographicGuidanceRequest): string {
    const personalityPrompt = this.getPersonalityPrompt(request.personality);
    
    return `${personalityPrompt}

CRITICAL INSTRUCTIONS:
- You are responding in a holographic legal guidance system
- Provide specific, actionable military legal advice
- Always include relevant UCMJ articles, military regulations, and legal precedents
- Format your response as JSON with the following structure:
{
  "response": "Your main guidance response (400-600 words)",
  "citations": [
    {
      "source": "UCMJ Article X" or "32 CFR X.X" or relevant regulation,
      "regulation": "Brief description of the regulation",
      "relevance": 1-100 (relevance score)
    }
  ],
  "actionItems": [
    {
      "task": "Specific action to take",
      "priority": "high|medium|low",
      "deadline": "timeframe if applicable"
    }
  ],
  "complexity": 1-10 (legal complexity score),
  "confidenceLevel": 1-100 (confidence in advice),
  "visualEffects": {
    "recommendedColor": "#hex-color for holographic display",
    "intensity": 1-100,
    "animationType": "pulse|glow|fade|static"
  }
}

MILITARY LAW EXPERTISE AREAS:
- Court-martial proceedings (Summary, Special, General)
- UCMJ violations and defenses
- Security clearance issues and appeals
- Administrative separations and discharge upgrades
- Military justice procedures
- Appeal processes (Courts of Criminal Appeals, CAAF)
- Military family law and benefits
- Veterans affairs and disability claims
- Military criminal defense strategies
- Command authority and military hierarchy

Respond only with valid JSON. Do not include any text outside the JSON structure.`;
  }

  private buildUserPrompt(request: HolographicGuidanceRequest): string {
    let prompt = `Legal Question: ${request.message}\n\n`;
    
    if (request.legalDomain) {
      prompt += `Legal Domain: ${request.legalDomain}\n`;
    }

    if (request.context?.sessionHistory && request.context.sessionHistory.length > 0) {
      prompt += `\nSession Context (previous messages):\n`;
      request.context.sessionHistory.slice(-3).forEach((msg, idx) => {
        prompt += `${msg.type}: ${msg.content}\n`;
      });
    }

    if (request.context?.visualMode) {
      prompt += `\nDisplay Mode: ${request.context.visualMode} (adjust visual effects accordingly)\n`;
    }

    prompt += `\nPlease provide comprehensive legal guidance with specific citations and actionable steps.`;

    return prompt;
  }

  async processGuidanceRequest(request: HolographicGuidanceRequest): Promise<HolographicGuidanceResponse> {
    try {
      const systemPrompt = this.buildSystemPrompt(request);
      const userPrompt = this.buildUserPrompt(request);

      const completion = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user", 
            content: userPrompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
        max_tokens: 2000
      });

      const responseContent = completion.choices[0].message.content;
      if (!responseContent) {
        throw new Error('No response generated');
      }

      const parsedResponse = JSON.parse(responseContent) as HolographicGuidanceResponse;

      // Validate and enhance the response
      return {
        response: parsedResponse.response || "I apologize, but I couldn't generate a complete response. Please try rephrasing your question.",
        citations: parsedResponse.citations || [],
        actionItems: parsedResponse.actionItems || [],
        complexity: parsedResponse.complexity || 5,
        confidenceLevel: parsedResponse.confidenceLevel || 80,
        visualEffects: parsedResponse.visualEffects || {
          recommendedColor: this.getDefaultColor(request.personality),
          intensity: 75,
          animationType: 'glow'
        }
      };

    } catch (error) {
      console.error('Holographic guidance processing error:', error);
      
      // Fallback response with proper structure
      return {
        response: this.getFallbackResponse(request),
        citations: this.getDefaultCitations(request.message),
        actionItems: this.getDefaultActionItems(),
        complexity: 5,
        confidenceLevel: 60,
        visualEffects: {
          recommendedColor: this.getDefaultColor(request.personality),
          intensity: 50,
          animationType: 'static'
        }
      };
    }
  }

  private getDefaultColor(personality: string): string {
    const colors = {
      'military-advisor': '#0088ff',
      'legal-scholar': '#8844ff',
      'tactical-guide': '#ff8800',
      'compassionate-counselor': '#00ff88'
    };
    return colors[personality] || '#00aaff';
  }

  private getFallbackResponse(request: HolographicGuidanceRequest): string {
    const personalityResponses = {
      'military-advisor': `Roger that. I understand you're seeking guidance on: "${request.message}". While I process your full request, I recommend immediately consulting your Staff Judge Advocate (SJA) office for time-sensitive matters. Your legal situation requires careful analysis of applicable military regulations and UCMJ provisions.`,
      
      'legal-scholar': `Thank you for your legal inquiry regarding: "${request.message}". This matter requires comprehensive analysis of relevant military law, including applicable UCMJ articles, service regulations, and established legal precedent. I recommend gathering all relevant documentation while I provide detailed guidance.`,
      
      'tactical-guide': `Copy that. Immediate assessment of your situation: "${request.message}". First priority is understanding your timeline and any imminent deadlines. Recommend securing legal representation if facing charges or administrative action. Stand by for tactical legal analysis and action plan.`,
      
      'compassionate-counselor': `I hear your concern about: "${request.message}". Legal challenges can be overwhelming, especially in the military context. You're taking the right step by seeking guidance. Let me help you understand your options and develop a path forward. You don't have to navigate this alone.`
    };

    return personalityResponses[request.personality] || personalityResponses['military-advisor'];
  }

  private getDefaultCitations(query: string): LegalCitation[] {
    // Basic citations based on common military legal topics
    const citations: LegalCitation[] = [];

    if (query.toLowerCase().includes('court-martial') || query.toLowerCase().includes('court martial')) {
      citations.push({
        source: "UCMJ Article 32",
        regulation: "Preliminary hearing procedures for general court-martial",
        relevance: 85
      });
    }

    if (query.toLowerCase().includes('security clearance')) {
      citations.push({
        source: "32 CFR 147",
        regulation: "Adjudicative Guidelines for Determining Eligibility for Access to Classified Information",
        relevance: 90
      });
    }

    if (query.toLowerCase().includes('discharge')) {
      citations.push({
        source: "DoDI 1332.14",
        regulation: "Enlisted Administrative Separations",
        relevance: 80
      });
    }

    return citations.slice(0, 3); // Limit to 3 most relevant
  }

  private getDefaultActionItems(): ActionItem[] {
    return [
      {
        task: "Consult with Staff Judge Advocate (SJA) office",
        priority: "high",
        deadline: "Within 48 hours"
      },
      {
        task: "Gather all relevant documentation",
        priority: "high", 
        deadline: "Immediately"
      },
      {
        task: "Review applicable military regulations",
        priority: "medium",
        deadline: "Within 1 week"
      }
    ];
  }
}

const holographicGuidanceService = new HolographicGuidanceService();

export async function processHolographicGuidance(req: Request, res: Response) {
  try {
    const request: HolographicGuidanceRequest = req.body;

    // Validate request
    if (!request.message || !request.personality) {
      return res.status(400).json({
        error: 'Missing required fields: message and personality'
      });
    }

    console.log('Processing holographic guidance request:', request.message);

    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      console.warn('OpenAI API key not found, using fallback response');
      const fallbackResponse = holographicGuidanceService.getFallbackResponse(request);
      return res.json({
        response: fallbackResponse,
        citations: holographicGuidanceService.getDefaultCitations(request.message),
        actionItems: holographicGuidanceService.getDefaultActionItems(),
        complexity: 5,
        confidenceLevel: 70,
        visualEffects: {
          recommendedColor: holographicGuidanceService.getDefaultColor(request.personality),
          intensity: 75,
          animationType: 'glow'
        }
      });
    }

    try {
      const response = await holographicGuidanceService.processGuidanceRequest(request);
      res.json(response);
    } catch (openaiError) {
      console.error('OpenAI API error, falling back to default response:', openaiError);
      const fallbackResponse = holographicGuidanceService.getFallbackResponse(request);
      res.json({
        response: fallbackResponse,
        citations: holographicGuidanceService.getDefaultCitations(request.message),
        actionItems: holographicGuidanceService.getDefaultActionItems(),
        complexity: 5,
        confidenceLevel: 70,
        visualEffects: {
          recommendedColor: holographicGuidanceService.getDefaultColor(request.personality),
          intensity: 75,
          animationType: 'glow'
        }
      });
    }

  } catch (error) {
    console.error('Holographic guidance endpoint error:', error);
    res.status(500).json({
      error: 'Failed to process holographic guidance request',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// Additional endpoints for enhanced functionality
export async function getGuidanceTemplates(req: Request, res: Response) {
  try {
    const templates = {
      'court-martial': {
        title: "Court-Martial Defense",
        questions: [
          "What are my rights during Article 32 proceedings?",
          "How do I request a military defense counsel?",
          "What evidence can be presented in my defense?",
          "What are the possible outcomes of my court-martial?"
        ]
      },
      'security-clearance': {
        title: "Security Clearance Issues", 
        questions: [
          "How do I appeal a clearance denial?",
          "What factors affect clearance eligibility?",
          "How long does the appeal process take?",
          "Can I work while my clearance is under review?"
        ]
      },
      'administrative-action': {
        title: "Administrative Actions",
        questions: [
          "What is the difference between administrative and punitive actions?",
          "How do I respond to a Letter of Reprimand?",
          "Can I appeal an administrative separation?",
          "What are my due process rights?"
        ]
      },
      'discharge-upgrade': {
        title: "Discharge Upgrades",
        questions: [
          "Am I eligible for a discharge upgrade?",
          "What evidence supports my upgrade request?",
          "How long does the upgrade process take?",
          "What benefits would I regain with an upgrade?"
        ]
      }
    };

    res.json({ templates });

  } catch (error) {
    console.error('Templates endpoint error:', error);
    res.status(500).json({
      error: 'Failed to retrieve guidance templates'
    });
  }
}

export async function getSessionHistory(req: Request, res: Response) {
  try {
    // In a real implementation, this would fetch from database
    // For now, return empty history
    res.json({
      sessions: [],
      totalSessions: 0
    });

  } catch (error) {
    console.error('Session history endpoint error:', error);
    res.status(500).json({
      error: 'Failed to retrieve session history'
    });
  }
}