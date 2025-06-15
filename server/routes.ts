import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { db, pool } from "./db";
import { sql } from "drizzle-orm";
import { insertConsultationSchema, insertEmergencyConsultationSchema, attorneys, emergencyConsultations } from "@shared/schema";
import { eq, ilike, and, or } from "drizzle-orm";
import { z } from "zod";
import { analyzeCareerTransition, type CareerAssessmentRequest, getLegalAssistantResponse, type LegalAssistantRequest } from "./openai";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { handleRSSFeed, handleJSONFeed } from "./rss";
import Stripe from "stripe";
import path from "path";
import fs from "fs";

// Initialize Stripe only if the secret key is available
let stripe: Stripe | null = null;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
}

// VA Disability Compensation rates (2024)
function calculateDisabilityCompensation(disabilityRating: number, dependents: number): number {
  const baseRates: { [key: number]: number } = {
    10: 171,
    20: 338,
    30: 524,
    40: 755,
    50: 1075,
    60: 1361,
    70: 1663,
    80: 1933,
    90: 2172,
    100: 3737
  };

  let compensation = baseRates[disabilityRating] || 0;
  
  // Add dependent compensation for ratings 30% and above
  if (disabilityRating >= 30 && dependents > 0) {
    const dependentRates: { [key: number]: number } = {
      30: { spouse: 62, child: 32 },
      40: { spouse: 83, child: 42 },
      50: { spouse: 103, child: 52 },
      60: { spouse: 123, child: 62 },
      70: { spouse: 143, child: 72 },
      80: { spouse: 163, child: 82 },
      90: { spouse: 183, child: 92 },
      100: { spouse: 203, child: 102 }
    };
    
    const rates = dependentRates[disabilityRating];
    if (rates) {
      compensation += rates.spouse; // Assume one spouse
      compensation += rates.child * Math.max(0, dependents - 1); // Additional dependents as children
    }
  }
  
  return compensation;
}

function getStateBenefits(state: string): any[] {
  // Simplified state benefits - in real app this would come from database
  const stateBenefits = {
    "CA": [
      { name: "California Disabled Veteran Property Tax Exemption", amount: "Up to $196,264 exemption" },
      { name: "CalVet Home Loans", amount: "Low-interest home loans" }
    ],
    "TX": [
      { name: "Hazlewood Act", amount: "Free tuition at state universities" },
      { name: "Property Tax Exemption", amount: "Up to $12,000 exemption" }
    ],
    "FL": [
      { name: "Disabled Veteran Property Tax Discount", amount: "Up to $5,000 discount" },
      { name: "Driver License Fee Waiver", amount: "$48 savings" }
    ]
  };
  
  return stateBenefits[state] || [];
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication middleware
  await setupAuth(app);
  
  // Domain verification endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: "healthy",
      domain: req.hostname,
      application: "MilitaryLegalShield",
      verified: true,
      timestamp: new Date().toISOString(),
      version: "2.0.0",
      features: ["high-converting-landing", "world-clock", "faq-accordion"]
    });
  });
  // Public access - no authentication
  
  // RSS Feed routes
  app.get('/rss.xml', handleRSSFeed);
  app.get('/feed.xml', handleRSSFeed);
  app.get('/feed.json', handleJSONFeed);

  // Health check endpoint - add explicit API prefix
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString(), service: 'MilitaryLegalShield' });
  });
  
  // Attorney search endpoint - returns authentic military defense attorneys
  app.get("/api/attorneys", async (req, res) => {
    try {
      res.setHeader('Content-Type', 'application/json');
      const { search, state, emergencyOnly } = req.query;
      
      const attorneys = await storage.getAttorneys();
      let filteredAttorneys = attorneys;

      if (search) {
        const searchTerm = (search as string).toLowerCase();
        filteredAttorneys = filteredAttorneys.filter(attorney => 
          attorney.firstName.toLowerCase().includes(searchTerm) ||
          attorney.lastName.toLowerCase().includes(searchTerm) ||
          (attorney.firmName && attorney.firmName.toLowerCase().includes(searchTerm))
        );
      }
      
      if (state && state !== "All States") {
        filteredAttorneys = filteredAttorneys.filter(attorney => attorney.state === state);
      }
      
      if (emergencyOnly === 'true') {
        filteredAttorneys = filteredAttorneys.filter(attorney => attorney.availableForEmergency);
      }

      // Sort by rating and review count
      filteredAttorneys.sort((a, b) => {
        if (b.rating !== a.rating) return b.rating - a.rating;
        return b.reviewCount - a.reviewCount;
      });

      res.status(200).json(filteredAttorneys);
    } catch (error) {
      console.error("Error fetching attorneys:", error);
      res.setHeader('Content-Type', 'application/json');
      res.status(500).json({ message: "Failed to fetch attorneys" });
    }
  });

  app.get("/api/attorneys/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const result = await pool.query('SELECT * FROM attorneys WHERE id = $1', [id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ message: "Attorney not found" });
      }
      
      res.json(result.rows[0]);
    } catch (error) {
      console.error("Error fetching attorney:", error);
      res.status(500).json({ message: "Failed to fetch attorney" });
    }
  });

  // Benefits calculator endpoint
  app.post("/api/calculate-benefits", async (req, res) => {
    try {
      const { disabilityRating, dependents, state, additionalInfo } = req.body;
      
      const monthlyCompensation = calculateDisabilityCompensation(disabilityRating, dependents);
      const annualCompensation = monthlyCompensation * 12;
      const stateBenefits = getStateBenefits(state);
      
      res.json({
        monthlyCompensation,
        annualCompensation,
        stateBenefits,
        totalEstimatedValue: annualCompensation + 2000 // Rough estimate including state benefits
      });
    } catch (error) {
      console.error("Error calculating benefits:", error);
      res.status(500).json({ message: "Failed to calculate benefits" });
    }
  });

  // Legal Assistant Chatbot API - Multiple endpoints for fallback
  app.post("/api/legal-assistant/chat", async (req, res) => {
    try {
      const { message, context, userId, conversationHistory } = req.body;
      
      const assistantRequest: LegalAssistantRequest = {
        message,
        context: context || "military_legal",
        userId: userId || "guest",
        conversationHistory: conversationHistory || []
      };
      
      const response = await getLegalAssistantResponse(assistantRequest);
      res.json(response);
    } catch (error: any) {
      console.error("Legal assistant chat error:", error);
      res.status(500).json({ 
        message: "Legal assistant temporarily unavailable",
        error: error.message 
      });
    }
  });

  // Fallback endpoint for legal assistant
  app.post("/api/legal-assistant", async (req, res) => {
    try {
      const { message, context, conversationHistory } = req.body;
      
      const assistantRequest: LegalAssistantRequest = {
        message,
        context: context || "military_legal",
        userId: "guest",
        conversationHistory: conversationHistory || []
      };
      
      const response = await getLegalAssistantResponse(assistantRequest);
      res.json(response);
    } catch (error: any) {
      console.error("Legal assistant error:", error);
      res.status(500).json({ 
        message: "Legal assistant temporarily unavailable",
        error: error.message 
      });
    }
  });

  // Emergency consultation booking endpoint
  app.post("/api/emergency-consultation", async (req, res) => {
    try {
      // Validate request data
      const consultationData = insertEmergencyConsultationSchema.parse(req.body);
      
      // Insert emergency consultation into database
      const [consultation] = await db
        .insert(emergencyConsultations)
        .values({
          ...consultationData,
          status: "pending",
          createdAt: new Date(),
          updatedAt: new Date()
        })
        .returning();

      // Find available emergency attorneys based on legal issue and location
      const availableAttorneys = await db
        .select()
        .from(attorneys)
        .where(
          and(
            eq(attorneys.availableForEmergency, true),
            eq(attorneys.isActive, true)
          )
        )
        .limit(3);

      // Auto-assign to highest rated available attorney if any found
      if (availableAttorneys.length > 0) {
        const assignedAttorney = availableAttorneys[0]; // Highest rated due to default ordering
        
        await db
          .update(emergencyConsultations)
          .set({
            assignedAttorneyId: assignedAttorney.id,
            status: "assigned",
            updatedAt: new Date()
          })
          .where(eq(emergencyConsultations.id, consultation.id));

        // In a real implementation, this would trigger:
        // 1. Email/SMS notification to assigned attorney
        // 2. Email confirmation to client
        // 3. Calendar scheduling integration
        // 4. Emergency response workflow activation
        
        console.log(`Emergency consultation ${consultation.id} assigned to attorney ${assignedAttorney.id}`);
      }

      res.status(201).json({
        success: true,
        consultationId: consultation.id,
        message: "Emergency consultation request submitted successfully",
        estimatedResponseTime: consultationData.urgencyLevel === "immediate" ? "30 minutes" : 
                              consultationData.urgencyLevel === "urgent" ? "2 hours" : "4 hours",
        assignedAttorney: availableAttorneys.length > 0 ? {
          name: `${availableAttorneys[0].firstName} ${availableAttorneys[0].lastName}`,
          firmName: availableAttorneys[0].firmName,
          specialties: availableAttorneys[0].specialties
        } : null
      });

    } catch (error) {
      console.error("Error processing emergency consultation:", error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Invalid request data",
          errors: error.errors
        });
      }

      res.status(500).json({
        success: false,
        message: "Failed to process emergency consultation request"
      });
    }
  });

  // Career assessment endpoint
  app.post("/api/career-assessment", async (req, res) => {
    try {
      const assessment: CareerAssessmentRequest = req.body.assessment;
      const analysis = await analyzeCareerTransition(assessment);
      res.json(analysis);
    } catch (error) {
      console.error("Error with career assessment:", error);
      res.status(500).json({ message: "Failed to complete career assessment" });
    }
  });

  // Get attorneys with availability for consultation booking
  app.get("/api/availability/attorneys", async (req, res) => {
    try {
      res.setHeader('Content-Type', 'application/json');
      const { date, specialty, consultationType } = req.query;
      const attorneys = await storage.getAttorneysWithAvailability(
        date as string || new Date().toISOString().split('T')[0],
        specialty as string,
        consultationType as string
      );
      res.status(200).json(attorneys);
    } catch (error) {
      console.error("Error fetching attorney availability:", error);
      res.setHeader('Content-Type', 'application/json');
      res.status(500).json({ message: "Failed to fetch attorney availability" });
    }
  });

  // PREMIUM FEATURE: Book consultation endpoint
  app.post("/api/consultations/book", isAuthenticated, async (req: any, res) => {
    try {
      // Check if user has premium access
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user || user.subscriptionTier === 'free') {
        return res.status(403).json({ 
          message: "This is a premium feature. Please upgrade your subscription to book consultations.",
          requiresUpgrade: true
        });
      }

      const { booking } = req.body;
      
      if (!booking || !booking.attorneyId || !booking.clientName || !booking.clientEmail) {
        return res.status(400).json({ message: "Missing required booking information" });
      }

      const consultation = await storage.createConsultationBooking(booking);
      
      // Update time slot availability
      if (booking.timeSlotId) {
        await storage.updateTimeSlotAvailability(booking.timeSlotId, false);
      }

      res.json({
        success: true,
        consultationId: consultation.id,
        message: "Consultation booked successfully"
      });
    } catch (error) {
      console.error("Error booking consultation:", error);
      res.status(500).json({ message: "Failed to book consultation" });
    }
  });

  // Stripe subscription management endpoints
  
  // Create subscription checkout session
  app.post("/api/create-subscription", isAuthenticated, async (req: any, res) => {
    try {
      if (!stripe) {
        return res.status(500).json({ message: "Payment processing not available" });
      }

      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user || !user.email) {
        return res.status(400).json({ message: "User email required for subscription" });
      }

      // Create or retrieve Stripe customer
      let customerId = user.stripeCustomerId;
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: user.email,
          metadata: { userId: userId }
        });
        customerId = customer.id;
        await storage.updateUserStripeInfo(userId, customerId, null);
      }

      // Create checkout session for premium subscription
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'MilitaryLegalShield Premium',
                description: 'Access to attorney consultations, document review, case tracking, and priority support'
              },
              recurring: {
                interval: 'month'
              },
              unit_amount: 2999 // $29.99/month
            },
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${req.protocol}://${req.hostname}/subscription-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.protocol}://${req.hostname}/pricing`,
        metadata: {
          userId: userId
        }
      });

      res.json({ sessionId: session.id, url: session.url });
    } catch (error) {
      console.error("Error creating subscription:", error);
      res.status(500).json({ message: "Failed to create subscription" });
    }
  });

  // Handle Stripe webhooks
  app.post("/api/stripe-webhook", express.raw({type: 'application/json'}), async (req, res) => {
    if (!stripe) {
      return res.status(500).json({ error: "Payment processing not available" });
    }

    const sig = req.headers['stripe-signature'];
    if (!sig) {
      return res.status(400).send('Missing stripe signature');
    }

    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET || 'dummy');
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return res.status(400).send(`Webhook Error: ${err}`);
    }

    try {
      switch (event.type) {
        case 'checkout.session.completed':
          const session = event.data.object;
          const userId = session.metadata?.userId;
          if (userId && session.subscription) {
            await storage.updateUserSubscription(userId, 'premium', 'active', session.subscription as string);
          }
          break;

        case 'invoice.payment_succeeded':
          const invoice = event.data.object as any;
          if (invoice.subscription && invoice.customer) {
            const invoiceCustomer = await stripe.customers.retrieve(invoice.customer as string);
            const invoiceUserId = (invoiceCustomer as any).metadata?.userId;
            if (invoiceUserId) {
              await storage.updateUserSubscription(invoiceUserId, 'premium', 'active', invoice.subscription as string);
            }
          }
          break;

        case 'customer.subscription.deleted':
          const subscription = event.data.object as any;
          const subscriptionCustomer = await stripe.customers.retrieve(subscription.customer as string);
          const subscriptionUserId = (subscriptionCustomer as any).metadata?.userId;
          if (subscriptionUserId) {
            await storage.updateUserSubscription(subscriptionUserId, 'free', 'cancelled', null);
          }
          break;
      }

      res.json({received: true});
    } catch (error) {
      console.error('Webhook processing error:', error);
      res.status(500).json({ error: 'Webhook processing failed' });
    }
  });

  // Get user subscription status
  app.get("/api/subscription-status", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const isPremium = (user.subscriptionTier === 'premium' && user.subscriptionStatus === 'active') ||
                       user.subscriptionStatus === 'premium' ||
                       (user.stripeSubscriptionId && user.subscriptionStatus !== 'cancelled');

      res.json({
        subscriptionTier: user.subscriptionTier || 'free',
        subscriptionStatus: user.subscriptionStatus || 'free',
        subscription_status: user.subscriptionStatus || 'free',
        status: user.subscriptionStatus || 'free',
        isPremium,
        stripeCustomerId: user.stripeCustomerId,
        stripeSubscriptionId: user.stripeSubscriptionId,
        plan: isPremium ? 'premium' : 'free'
      });
    } catch (error) {
      console.error("Error fetching subscription status:", error);
      res.status(500).json({ message: "Failed to fetch subscription status" });
    }
  });

  // Cancel subscription
  app.post("/api/cancel-subscription", isAuthenticated, async (req: any, res) => {
    try {
      if (!stripe) {
        return res.status(500).json({ message: "Payment processing not available" });
      }

      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user || !user.stripeSubscriptionId) {
        return res.status(404).json({ message: "No active subscription found" });
      }

      await stripe.subscriptions.update(user.stripeSubscriptionId, {
        cancel_at_period_end: true
      });

      res.json({ message: "Subscription will be cancelled at period end" });
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      res.status(500).json({ message: "Failed to cancel subscription" });
    }
  });

  // WebSocket server for video consultation
  const httpServer = createServer(app);
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  // Store active connections
  const activeConnections = new Map<string, WebSocket>();
  const roomParticipants = new Map<string, Set<string>>();

  wss.on('connection', (ws: WebSocket) => {
    let connectionId: string | null = null;
    let currentRoom: string | null = null;

    ws.on('message', (message: Buffer) => {
      try {
        const data = JSON.parse(message.toString());
        
        switch (data.type) {
          case 'join-call':
            handleJoinCall(ws, data);
            break;
          case 'signal':
            relaySignalingMessage(ws, data);
            break;
          case 'leave-call':
            handleLeaveCall(ws, data);
            break;
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      handleDisconnect(ws);
    });

    function handleJoinCall(ws: WebSocket, data: any) {
      connectionId = data.connectionId;
      currentRoom = data.roomId;
      
      activeConnections.set(connectionId, ws);
      
      if (!roomParticipants.has(currentRoom)) {
        roomParticipants.set(currentRoom, new Set());
      }
      roomParticipants.get(currentRoom)!.add(connectionId);
      
      // Notify other participants
      broadcastToRoom(currentRoom, {
        type: 'participant-joined',
        connectionId,
        participantCount: roomParticipants.get(currentRoom)!.size
      }, connectionId);
    }

    function relaySignalingMessage(ws: WebSocket, data: any) {
      const targetConnection = activeConnections.get(data.targetId);
      if (targetConnection && targetConnection.readyState === WebSocket.OPEN) {
        targetConnection.send(JSON.stringify({
          type: 'signal',
          fromId: connectionId,
          signal: data.signal
        }));
      }
    }

    function handleLeaveCall(ws: WebSocket, data: any) {
      if (connectionId && currentRoom) {
        roomParticipants.get(currentRoom)?.delete(connectionId);
        activeConnections.delete(connectionId);
        
        broadcastToRoom(currentRoom, {
          type: 'participant-left',
          connectionId,
          participantCount: roomParticipants.get(currentRoom)?.size || 0
        }, connectionId);
      }
    }

    function handleDisconnect(ws: WebSocket) {
      if (connectionId && currentRoom) {
        roomParticipants.get(currentRoom)?.delete(connectionId);
        activeConnections.delete(connectionId);
        
        broadcastToRoom(currentRoom, {
          type: 'participant-left',
          connectionId,
          participantCount: roomParticipants.get(currentRoom)?.size || 0
        }, connectionId);
      }
    }

    function broadcastToRoom(roomId: string, message: any, excludeId?: string) {
      const participants = roomParticipants.get(roomId);
      if (participants) {
        participants.forEach(participantId => {
          if (participantId !== excludeId) {
            const connection = activeConnections.get(participantId);
            if (connection && connection.readyState === WebSocket.OPEN) {
              connection.send(JSON.stringify(message));
            }
          }
        });
      }
    }
  });

  return httpServer;
}