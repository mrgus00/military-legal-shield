import type { Request, Response } from "express";
import OpenAI from "openai";
import { z } from "zod";

// Initialize OpenAI for AI chat features
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// WhatsApp API Integration (using Twilio)
import twilio from "twilio";

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Email service for automated notifications
interface EmailNotification {
  to: string;
  subject: string;
  htmlContent: string;
  type: 'emergency' | 'appointment' | 'case_update' | 'reminder';
}

// Validation schemas
const chatMessageSchema = z.object({
  message: z.string().min(1).max(1000),
  type: z.enum(['legal_query', 'emergency', 'general'])
});

const whatsappConnectSchema = z.object({
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format")
});

const videoConsultationSchema = z.object({
  legalIssueType: z.enum(['court-martial', 'security-clearance', 'administrative', 'family-law', 'discharge']),
  preferredDate: z.string(),
  preferredTime: z.string(),
  description: z.string().min(10).max(500),
  urgency: z.enum(['routine', 'urgent', 'emergency']).default('routine')
});

const emailSettingsSchema = z.object({
  caseUpdates: z.boolean().default(true),
  emergencyAlerts: z.boolean().default(true),
  courtReminders: z.boolean().default(true),
  newsletter: z.boolean().default(true)
});

// AI Legal Assistant Chat
export async function handleAIChat(req: Request, res: Response) {
  try {
    const { message, type } = chatMessageSchema.parse(req.body);

    // Create context-aware prompt for military legal assistance
    const systemPrompt = `You are a specialized military legal AI assistant. You provide accurate, helpful information about military law, but you are not a replacement for professional legal advice. 

    Key areas you help with:
    - Court-martial proceedings and UCMJ violations
    - Security clearance issues and appeals
    - Administrative separations and discharge upgrades
    - Military family law and benefits
    - Emergency legal situations requiring immediate attorney contact

    Guidelines:
    - Always recommend consulting with a qualified military defense attorney for serious matters
    - Provide practical, actionable advice when appropriate
    - Be empathetic to the stress military legal issues can cause
    - Include relevant UCMJ articles or military regulations when applicable
    - For emergencies, always direct to immediate attorney consultation

    Respond in a professional, supportive tone that acknowledges the unique challenges of military legal issues.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // Using the latest model
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      max_tokens: 500,
      temperature: 0.7
    });

    const aiResponse = completion.choices[0].message.content;

    // Log the interaction for analytics
    console.log(`AI Chat - Type: ${type}, Query length: ${message.length}`);

    res.json({
      success: true,
      aiResponse,
      suggestions: [
        "Connect with an attorney",
        "View emergency consultation",
        "Download legal documents",
        "Schedule video call"
      ]
    });

  } catch (error) {
    console.error("AI Chat error:", error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Invalid message format",
        errors: error.errors
      });
    }

    res.status(500).json({
      success: false,
      message: "AI assistant temporarily unavailable. Please try again or contact support.",
      fallbackResponse: "I'm currently experiencing technical difficulties. For immediate legal assistance, please call our emergency hotline at (800) 555-0123 or submit an emergency consultation request."
    });
  }
}

// WhatsApp AI Integration
export async function connectWhatsApp(req: Request, res: Response) {
  try {
    const { phoneNumber } = whatsappConnectSchema.parse(req.body);

    // Send welcome message via WhatsApp
    const welcomeMessage = `🛡️ Welcome to Military Legal Shield WhatsApp AI!

I'm your 24/7 legal assistant. I can help with:
• Court-martial questions
• Security clearance issues  
• Emergency legal situations
• Document guidance
• Attorney connections

Reply "HELP" for commands or ask any legal question.

⚠️ For emergencies, reply "EMERGENCY" immediately.`;

    // Send via Twilio WhatsApp API
    await twilioClient.messages.create({
      from: `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`,
      to: `whatsapp:${phoneNumber}`,
      body: welcomeMessage
    });

    // Store WhatsApp connection in database (implement as needed)
    // await db.insert(whatsappConnections).values({ phoneNumber, connectedAt: new Date() });

    res.json({
      success: true,
      message: "WhatsApp AI assistant connected successfully",
      phoneNumber: phoneNumber
    });

  } catch (error) {
    console.error("WhatsApp connection error:", error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone number format",
        errors: error.errors
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to connect WhatsApp. Please verify your phone number and try again."
    });
  }
}

// Video Consultation Scheduling
export async function scheduleVideoConsultation(req: Request, res: Response) {
  try {
    const consultationData = videoConsultationSchema.parse(req.body);

    // Generate unique meeting room
    const meetingId = `mil-legal-${Date.now()}`;
    const meetingLink = `https://meet.militarylegalshield.com/room/${meetingId}`;

    // Schedule consultation in database
    const scheduledTime = new Date(`${consultationData.preferredDate}T${consultationData.preferredTime}`);
    
    const consultation = {
      id: meetingId,
      legalIssueType: consultationData.legalIssueType,
      scheduledTime,
      description: consultationData.description,
      meetingLink,
      status: 'scheduled' as const,
      urgency: consultationData.urgency
    };

    // Send confirmation email
    await sendEmailNotification({
      to: 'client@example.com', // Get from authenticated user
      subject: 'Video Consultation Scheduled - Military Legal Shield',
      htmlContent: generateConsultationConfirmationEmail(consultation),
      type: 'appointment'
    });

    // Send calendar invite (implement as needed)
    // await sendCalendarInvite(consultation);

    res.json({
      success: true,
      consultationId: meetingId,
      scheduledTime: scheduledTime.toISOString(),
      meetingLink,
      message: "Video consultation scheduled successfully. You'll receive a confirmation email with the meeting link."
    });

  } catch (error) {
    console.error("Video consultation scheduling error:", error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Invalid consultation data",
        errors: error.errors
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to schedule video consultation. Please try again."
    });
  }
}

// Get User's Video Consultations
export async function getVideoConsultations(req: Request, res: Response) {
  try {
    // Mock data for now - implement database query
    const consultations = [
      {
        id: "mil-legal-1703123456789",
        attorneyName: "Major Sarah Johnson",
        scheduledTime: new Date(Date.now() + 86400000), // Tomorrow
        duration: 60,
        meetingLink: "https://meet.militarylegalshield.com/room/mil-legal-1703123456789",
        status: "scheduled"
      },
      {
        id: "mil-legal-1703023456789",
        attorneyName: "Captain Mike Rodriguez",
        scheduledTime: new Date(Date.now() - 86400000), // Yesterday
        duration: 45,
        status: "completed"
      }
    ];

    res.json(consultations);

  } catch (error) {
    console.error("Error fetching video consultations:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch consultations"
    });
  }
}

// Email Notification Settings
export async function updateEmailSettings(req: Request, res: Response) {
  try {
    const settings = emailSettingsSchema.parse(req.body);

    // Update user preferences in database
    // await db.update(users).set({ emailSettings: settings }).where(eq(users.id, req.user.id));

    res.json({
      success: true,
      message: "Email notification settings updated successfully",
      settings
    });

  } catch (error) {
    console.error("Email settings update error:", error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Invalid settings format",
        errors: error.errors
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update email settings"
    });
  }
}

// Automated Email Notification Service
export async function sendEmailNotification(notification: EmailNotification) {
  try {
    // Use your preferred email service (SendGrid, AWS SES, etc.)
    console.log(`Sending ${notification.type} email to ${notification.to}`);
    console.log(`Subject: ${notification.subject}`);
    
    // Mock implementation - replace with actual email service
    // await emailService.send({
    //   to: notification.to,
    //   subject: notification.subject,
    //   html: notification.htmlContent
    // });

    return { success: true };

  } catch (error) {
    console.error("Email notification error:", error);
    return { success: false, error: error.message };
  }
}

// WhatsApp Webhook Handler for incoming messages
export async function handleWhatsAppWebhook(req: Request, res: Response) {
  try {
    const { Body, From } = req.body;
    const phoneNumber = From.replace('whatsapp:', '');
    const message = Body.toLowerCase().trim();

    let response = "";

    if (message === "emergency") {
      response = `🚨 EMERGENCY LEGAL ASSISTANCE 🚨

Immediate steps:
1. Call: (800) 555-0123 (24/7 hotline)
2. Text: Reply "DETAILS" with your situation
3. Online: militarylegalshield.com/emergency

An attorney will contact you within 30 minutes.

⚖️ Do not discuss your case with anyone except your attorney.`;

    } else if (message === "help") {
      response = `🛡️ MILITARY LEGAL SHIELD COMMANDS:

• EMERGENCY - Immediate legal help
• COURTMARTIAL - Court-martial guidance
• CLEARANCE - Security clearance help
• FAMILY - Military family law
• DISCHARGE - Discharge issues
• ATTORNEY - Find an attorney
• DOCUMENTS - Legal forms

Reply with any command or ask a legal question directly.`;

    } else if (message.includes("court") || message.includes("martial")) {
      response = `⚖️ COURT-MARTIAL GUIDANCE:

Key steps:
1. Remain silent - don't discuss the case
2. Request military defense counsel immediately
3. Document everything related to your case
4. Contact us for civilian attorney consultation

Reply "ATTORNEY" to connect with a specialist.

📞 Emergency: (800) 555-0123`;

    } else {
      // Use AI to respond to general questions
      try {
        const aiResponse = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            { 
              role: "system", 
              content: "You are a military legal AI assistant responding via WhatsApp. Keep responses concise (under 160 characters when possible), helpful, and always recommend professional legal consultation for serious matters. Include relevant emoji for clarity."
            },
            { role: "user", content: message }
          ],
          max_tokens: 150,
          temperature: 0.7
        });

        response = aiResponse.choices[0].message.content || "I'm here to help with military legal questions. Reply 'HELP' for commands or call (800) 555-0123 for immediate assistance.";

      } catch (aiError) {
        response = "I'm here to help with military legal questions. Reply 'HELP' for commands or call (800) 555-0123 for immediate assistance.";
      }
    }

    // Send response via WhatsApp
    await twilioClient.messages.create({
      from: `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`,
      to: From,
      body: response
    });

    res.status(200).send("OK");

  } catch (error) {
    console.error("WhatsApp webhook error:", error);
    res.status(500).send("Error processing message");
  }
}

// Email template generators
function generateConsultationConfirmationEmail(consultation: any): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Video Consultation Confirmed</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #1e3a8a, #3b82f6); color: white; padding: 30px; border-radius: 10px; text-align: center;">
                <h1>🛡️ Military Legal Shield</h1>
                <h2>Video Consultation Confirmed</h2>
            </div>
            
            <div style="padding: 30px; background: #f8fafc; margin: 20px 0; border-radius: 10px;">
                <h3>Consultation Details:</h3>
                <p><strong>Date & Time:</strong> ${consultation.scheduledTime.toLocaleString()}</p>
                <p><strong>Legal Issue:</strong> ${consultation.legalIssueType}</p>
                <p><strong>Meeting ID:</strong> ${consultation.id}</p>
                
                <div style="margin: 30px 0; padding: 20px; background: #dbeafe; border-radius: 8px;">
                    <h4>Join Your Video Call:</h4>
                    <a href="${consultation.meetingLink}" style="display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Join Meeting</a>
                </div>
                
                <h4>Before Your Consultation:</h4>
                <ul>
                    <li>Test your camera and microphone</li>
                    <li>Prepare any relevant documents</li>
                    <li>Write down your questions</li>
                    <li>Ensure you're in a private location</li>
                </ul>
                
                <p><strong>Emergency Contact:</strong> (800) 555-0123</p>
            </div>
            
            <div style="text-align: center; color: #666; font-size: 14px;">
                <p>Military Legal Shield - Protecting Those Who Serve</p>
            </div>
        </div>
    </body>
    </html>
  `;
}

// Emergency case notification email
export function generateEmergencyNotificationEmail(caseDetails: any): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Emergency Legal Consultation</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #dc2626, #ef4444); color: white; padding: 30px; border-radius: 10px; text-align: center;">
                <h1>🚨 EMERGENCY LEGAL ASSISTANCE</h1>
                <h2>Immediate Action Required</h2>
            </div>
            
            <div style="padding: 30px; background: #fef2f2; margin: 20px 0; border-radius: 10px; border-left: 5px solid #dc2626;">
                <h3>Emergency Consultation Request Received</h3>
                <p><strong>Service Member:</strong> ${caseDetails.fullName}</p>
                <p><strong>Rank/Branch:</strong> ${caseDetails.rank}, ${caseDetails.branch}</p>
                <p><strong>Legal Issue:</strong> ${caseDetails.legalIssue}</p>
                <p><strong>Urgency Level:</strong> ${caseDetails.urgencyLevel}</p>
                
                <div style="margin: 20px 0; padding: 15px; background: #dc2626; color: white; border-radius: 6px;">
                    <h4>Immediate Response Protocol:</h4>
                    <p>• Attorney assignment: Within 15 minutes</p>
                    <p>• Initial contact: Within 30 minutes</p>
                    <p>• Full consultation: Within 2 hours</p>
                </div>
                
                <p><strong>Next Steps:</strong></p>
                <ol>
                    <li>An attorney has been assigned to your case</li>
                    <li>You will receive a call within 30 minutes</li>
                    <li>Keep your phone available and charged</li>
                    <li>Do not discuss your case with anyone except your attorney</li>
                </ol>
                
                <div style="text-align: center; margin: 20px 0;">
                    <a href="tel:+18005550123" style="display: inline-block; background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Call Emergency Hotline</a>
                </div>
            </div>
            
            <div style="text-align: center; color: #666; font-size: 14px;">
                <p>Military Legal Shield - 24/7 Emergency Legal Protection</p>
            </div>
        </div>
    </body>
    </html>
  `;
}