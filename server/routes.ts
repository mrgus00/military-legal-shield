import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertConsultationSchema } from "@shared/schema";
import { z } from "zod";
import { analyzeCareerTransition, type CareerAssessmentRequest } from "./openai";
import Stripe from "stripe";
// No authentication imports - completely public deployment

// Initialize Stripe only if the secret key is available
let stripe: Stripe | null = null;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Complete authentication bypass - no middleware setup at all
  console.log("MilitaryLegalShield running in public access mode - all authentication disabled");
  
  // Domain verification and routing support
  app.use((req, res, next) => {
    // Handle domain verification requests
    if (req.hostname === 'militarylegalshield.com' || req.hostname === 'www.militarylegalshield.com') {
      res.setHeader('X-Domain-Verification', 'militarylegalshield-verified');
      res.setHeader('X-Replit-Domain', 'custom');
    }
    next();
  });
  
  // Override any potential authentication redirects
  app.get('/api/login', (req, res) => res.redirect('/'));
  app.get('/api/logout', (req, res) => res.redirect('/'));
  app.get('/api/callback', (req, res) => res.redirect('/'));
  app.get('/api/auth', (req, res) => res.redirect('/'));

  // Domain verification endpoint
  app.get('/api/verify-domain', (req, res) => {
    res.json({
      domain: req.hostname,
      verified: true,
      timestamp: new Date().toISOString(),
      platform: 'MilitaryLegalShield'
    });
  });

  // Public API - always returns null (no authentication)
  app.get('/api/auth/user', (req, res) => {
    res.json(null);
  });

  // Get all attorneys
  app.get("/api/attorneys", async (req, res) => {
    try {
      const attorneys = await storage.getAttorneys();
      res.json(attorneys);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch attorneys" });
    }
  });

  // Get attorneys by specialty
  app.get("/api/attorneys/specialty/:specialty", async (req, res) => {
    try {
      const { specialty } = req.params;
      const attorneys = await storage.getAttorneysBySpecialty(specialty);
      res.json(attorneys);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch attorneys by specialty" });
    }
  });

  // Stripe payment routes
  app.post("/api/create-payment-intent", async (req, res) => {
    if (!stripe) {
      return res.status(500).json({ message: "Payment processing not configured" });
    }

    try {
      const { planId, amount } = req.body;
      
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount), // Amount already in cents
        currency: "usd",
        metadata: {
          planId: planId
        }
      });

      res.json({ 
        clientSecret: paymentIntent.client_secret,
        planId: planId
      });
    } catch (error: any) {
      console.error("Stripe payment intent error:", error);
      res.status(500).json({ message: "Error creating payment intent: " + error.message });
    }
  });

  // Add North Carolina Military Defense Attorneys
  app.post("/api/attorneys/seed-nc", async (req, res) => {
    try {
      const ncAttorneys = [
        {
          firstName: "R. Davis",
          lastName: "Younts",
          title: "R. Davis Younts",
          specialties: ["Court-martial defense", "Military criminal law"],
          location: "Fayetteville, NC",
          state: "NC",
          city: "Fayetteville",
          experience: "15+ years",
          rating: 4.8,
          reviewCount: 0,
          email: "contact@yountslaw.com",
          phone: "Contact via website",
          bio: "Experienced military defense attorney specializing in court-martial defense and military criminal law.",
          pricingTier: "standard",
          hourlyRate: "Contact for rates",
          availableForEmergency: true,
          responseTime: "< 24 hours"
        },
        {
          firstName: "Philip D.",
          lastName: "Cave",
          title: "Philip D. Cave",
          specialties: ["Global military law", "Courts-martial", "Administrative actions"],
          location: "Serves NC statewide",
          state: "NC",
          city: "Statewide",
          experience: "25+ years",
          rating: 4.9,
          reviewCount: 0,
          email: "contact@cavelawoffice.com",
          phone: "(800) 401-1583",
          bio: "Nationally recognized military law expert serving clients worldwide in courts-martial and administrative actions.",
          pricingTier: "premium",
          hourlyRate: "Contact for rates",
          availableForEmergency: true,
          responseTime: "< 4 hours"
        },
        {
          firstName: "Matthew James",
          lastName: "Thomas",
          title: "Matthew James Thomas",
          specialties: ["Court-martial defense", "Military investigations"],
          location: "Jacksonville, NC",
          state: "NC",
          city: "Jacksonville",
          experience: "12+ years",
          rating: 4.8,
          reviewCount: 0,
          email: "contact@thomasmilitarylaw.com",
          phone: "(910) 939-0263",
          bio: "Military defense attorney specializing in court-martial defense and military investigations.",
          pricingTier: "standard",
          hourlyRate: "Contact for rates",
          availableForEmergency: true,
          responseTime: "< 8 hours"
        },
        {
          firstName: "Joseph Aaron",
          lastName: "Morman",
          title: "Joseph Aaron Morman",
          specialties: ["Military law", "Criminal defense"],
          location: "Fort Bragg, NC",
          state: "NC",
          city: "Fort Bragg",
          experience: "16+ years",
          rating: 4.7,
          reviewCount: 0,
          email: "contact@mormanlaw.com",
          phone: "(910) 432-1706",
          bio: "Military law and criminal defense attorney serving Fort Bragg and surrounding areas.",
          pricingTier: "standard",
          hourlyRate: "Contact for rates",
          availableForEmergency: true,
          responseTime: "< 4 hours"
        },
        {
          firstName: "Elizabeth Fowler",
          lastName: "Lunn",
          title: "Elizabeth Fowler Lunn",
          specialties: ["Veterans benefits", "Social Security Disability"],
          location: "Raleigh, NC",
          state: "NC",
          city: "Raleigh",
          experience: "12+ years",
          rating: 4.7,
          reviewCount: 0,
          email: "contact@lunnlaw.com",
          phone: "(866) 257-2106",
          bio: "Dedicated to helping veterans secure the benefits they have earned through military service.",
          pricingTier: "standard",
          hourlyRate: "Contact for rates",
          availableForEmergency: false,
          responseTime: "< 48 hours"
        }
      ];

      for (const attorney of ncAttorneys) {
        await storage.createAttorney(attorney);
      }

      res.json({ message: "North Carolina attorneys successfully added", count: ncAttorneys.length });
    } catch (error) {
      console.error("Error adding NC attorneys:", error);
      res.status(500).json({ message: "Failed to add North Carolina attorneys" });
    }
  });

  // Search attorneys with filters for urgent matching
  app.get("/api/attorneys/search", async (req, res) => {
    try {
      const { location, pricingTier, specialty, emergencyOnly } = req.query;
      const attorneys = await storage.getAttorneys();
      
      // Apply client-side filtering until storage method is fixed
      let filteredAttorneys = attorneys.filter(attorney => {
        if (location && typeof location === 'string') {
          const locationMatch = attorney.location.toLowerCase().includes(location.toLowerCase()) ||
                               attorney.state?.toLowerCase().includes(location.toLowerCase()) ||
                               attorney.city?.toLowerCase().includes(location.toLowerCase());
          if (!locationMatch) return false;
        }
        
        if (pricingTier && attorney.pricingTier !== pricingTier) return false;
        if (emergencyOnly === 'true' && !attorney.availableForEmergency) return false;
        
        return true;
      });

      // Sort by emergency availability first, then by rating
      filteredAttorneys.sort((a, b) => {
        if (a.availableForEmergency && !b.availableForEmergency) return -1;
        if (!a.availableForEmergency && b.availableForEmergency) return 1;
        return b.rating - a.rating;
      });

      res.json(filteredAttorneys);
    } catch (error) {
      res.status(500).json({ message: "Failed to search attorneys" });
    }
  });

  // Get attorney by ID
  app.get("/api/attorneys/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid attorney ID" });
      }
      const attorney = await storage.getAttorney(id);
      if (!attorney) {
        return res.status(404).json({ message: "Attorney not found" });
      }
      res.json(attorney);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch attorney" });
    }
  });

  // Get all legal resources
  app.get("/api/resources", async (req, res) => {
    try {
      const resources = await storage.getLegalResources();
      res.json(resources);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch legal resources" });
    }
  });

  // Search legal resources
  app.get("/api/resources/search", async (req, res) => {
    try {
      const { q } = req.query;
      if (!q || typeof q !== "string") {
        return res.status(400).json({ message: "Search query is required" });
      }
      const resources = await storage.searchLegalResources(q);
      res.json(resources);
    } catch (error) {
      res.status(500).json({ message: "Failed to search legal resources" });
    }
  });

  // Get legal resources by category
  app.get("/api/resources/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const resources = await storage.getLegalResourcesByCategory(category);
      res.json(resources);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch resources by category" });
    }
  });

  // Get resource by ID
  app.get("/api/resources/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid resource ID" });
      }
      const resource = await storage.getLegalResource(id);
      if (!resource) {
        return res.status(404).json({ message: "Resource not found" });
      }
      res.json(resource);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch resource" });
    }
  });

  // Get all education modules
  app.get("/api/education", async (req, res) => {
    try {
      const modules = await storage.getEducationModules();
      res.json(modules);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch education modules" });
    }
  });

  // Get education module by ID
  app.get("/api/education/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid module ID" });
      }
      const module = await storage.getEducationModule(id);
      if (!module) {
        return res.status(404).json({ message: "Education module not found" });
      }
      res.json(module);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch education module" });
    }
  });

  // Create consultation request
  app.post("/api/consultations", async (req, res) => {
    try {
      const validatedData = insertConsultationSchema.parse(req.body);
      const consultation = await storage.createConsultation(validatedData);
      res.status(201).json(consultation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to create consultation request" });
    }
  });

  // Get all consultations (admin only - simplified for demo)
  app.get("/api/consultations", async (req, res) => {
    try {
      const consultations = await storage.getConsultations();
      res.json(consultations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch consultations" });
    }
  });

  // Proxy endpoint for Unsplash images
  app.get("/api/images/search", async (req, res) => {
    try {
      const { query, per_page = 10, orientation = "landscape" } = req.query;
      
      if (!query || typeof query !== "string") {
        return res.status(400).json({ message: "Query parameter is required" });
      }

      const unsplashResponse = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${per_page}&orientation=${orientation}`,
        {
          headers: {
            Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
          },
        }
      );

      if (!unsplashResponse.ok) {
        throw new Error('Failed to fetch images from Unsplash');
      }

      const data = await unsplashResponse.json();
      res.json(data);
    } catch (error) {
      console.error("Error fetching images:", error);
      res.status(500).json({ message: "Failed to fetch images" });
    }
  });

  // Messaging routes
  app.get("/api/conversations", async (req, res) => {
    try {
      const { userId, userType } = req.query;
      if (!userId || !userType) {
        return res.status(400).json({ message: "userId and userType are required" });
      }
      const conversations = await storage.getConversations(Number(userId), userType as 'user' | 'attorney');
      res.json(conversations);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching conversations: " + error.message });
    }
  });

  app.get("/api/conversations/:id", async (req, res) => {
    try {
      const conversation = await storage.getConversation(Number(req.params.id));
      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }
      res.json(conversation);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching conversation: " + error.message });
    }
  });

  app.post("/api/conversations", async (req, res) => {
    try {
      const conversation = await storage.createConversation(req.body);
      res.json(conversation);
    } catch (error: any) {
      res.status(500).json({ message: "Error creating conversation: " + error.message });
    }
  });

  app.get("/api/conversations/:id/messages", async (req, res) => {
    try {
      const messages = await storage.getMessages(Number(req.params.id));
      res.json(messages);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching messages: " + error.message });
    }
  });

  app.post("/api/conversations/:id/messages", async (req, res) => {
    try {
      const messageData = {
        ...req.body,
        conversationId: Number(req.params.id)
      };
      const message = await storage.createMessage(messageData);
      res.json(message);
    } catch (error: any) {
      res.status(500).json({ message: "Error sending message: " + error.message });
    }
  });

  app.put("/api/messages/:id/read", async (req, res) => {
    try {
      await storage.markMessageAsRead(Number(req.params.id));
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: "Error marking message as read: " + error.message });
    }
  });

  // Attorney verification routes
  app.get("/api/attorneys/:id/verification-docs", async (req, res) => {
    try {
      const attorneyId = parseInt(req.params.id);
      const docs = await storage.getAttorneyVerificationDocs(attorneyId);
      res.json(docs);
    } catch (error) {
      console.error("Error fetching verification docs:", error);
      res.status(500).json({ message: "Error fetching verification documents" });
    }
  });

  app.post("/api/attorneys/:id/verification-docs", async (req, res) => {
    try {
      const attorneyId = parseInt(req.params.id);
      const doc = await storage.createAttorneyVerificationDoc({
        ...req.body,
        attorneyId
      });
      res.json(doc);
    } catch (error) {
      console.error("Error uploading verification doc:", error);
      res.status(500).json({ message: "Error uploading verification document" });
    }
  });

  app.put("/api/verification-docs/:id/status", async (req, res) => {
    try {
      const docId = parseInt(req.params.id);
      const { status, verifiedBy, rejectionReason } = req.body;
      const doc = await storage.updateVerificationDocStatus(docId, status, verifiedBy, rejectionReason);
      res.json(doc);
    } catch (error) {
      console.error("Error updating verification status:", error);
      res.status(500).json({ message: "Error updating verification status" });
    }
  });

  app.get("/api/attorney-verification-requests", async (req, res) => {
    try {
      const status = req.query.status as string;
      const requests = await storage.getAttorneyVerificationRequests(status);
      res.json(requests);
    } catch (error) {
      console.error("Error fetching verification requests:", error);
      res.status(500).json({ message: "Error fetching verification requests" });
    }
  });

  app.post("/api/attorney-verification-requests", async (req, res) => {
    try {
      const request = await storage.createAttorneyVerificationRequest(req.body);
      res.json(request);
    } catch (error) {
      console.error("Error creating verification request:", error);
      res.status(500).json({ message: "Error creating verification request" });
    }
  });

  app.put("/api/attorneys/:id/verification-status", async (req, res) => {
    try {
      const attorneyId = parseInt(req.params.id);
      const { status, notes } = req.body;
      const attorney = await storage.updateAttorneyVerificationStatus(attorneyId, status, notes);
      res.json(attorney);
    } catch (error) {
      console.error("Error updating attorney verification:", error);
      res.status(500).json({ message: "Error updating attorney verification" });
    }
  });

  // Attorney review routes
  app.get("/api/attorneys/:id/reviews", async (req, res) => {
    try {
      const attorneyId = parseInt(req.params.id);
      const reviews = await storage.getAttorneyReviews(attorneyId);
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching attorney reviews:", error);
      res.status(500).json({ message: "Error fetching attorney reviews" });
    }
  });

  app.post("/api/attorneys/:id/reviews", async (req, res) => {
    try {
      const attorneyId = parseInt(req.params.id);
      const review = await storage.createAttorneyReview({
        ...req.body,
        attorneyId,
        userId: 1 // Mock user ID for now
      });
      res.json(review);
    } catch (error) {
      console.error("Error creating review:", error);
      res.status(500).json({ message: "Error creating review" });
    }
  });

  app.get("/api/attorneys/:id/verified-reviews", async (req, res) => {
    try {
      const attorneyId = parseInt(req.params.id);
      const reviews = await storage.getVerifiedReviews(attorneyId);
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching verified reviews:", error);
      res.status(500).json({ message: "Error fetching verified reviews" });
    }
  });

  app.post("/api/reviews/:id/helpful", async (req, res) => {
    try {
      const reviewId = parseInt(req.params.id);
      await storage.markReviewHelpful(reviewId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error marking review as helpful:", error);
      res.status(500).json({ message: "Error marking review as helpful" });
    }
  });

  // Legal scenario simulation routes
  app.get("/api/scenarios", async (req, res) => {
    try {
      const { category, difficulty, branch } = req.query;
      const scenarios = await storage.getLegalScenarios(
        category as string,
        difficulty as string,
        branch as string
      );
      res.json(scenarios);
    } catch (error) {
      console.error("Error fetching scenarios:", error);
      res.status(500).json({ message: "Error fetching scenarios" });
    }
  });

  app.get("/api/scenarios/:id", async (req, res) => {
    try {
      const scenarioId = parseInt(req.params.id);
      const scenario = await storage.getLegalScenario(scenarioId);
      
      if (!scenario) {
        return res.status(404).json({ message: "Scenario not found" });
      }
      
      res.json(scenario);
    } catch (error) {
      console.error("Error fetching scenario:", error);
      res.status(500).json({ message: "Error fetching scenario" });
    }
  });

  app.post("/api/scenarios/generate", async (req, res) => {
    try {
      const { generateLegalScenario } = await import("./openai");
      const { category, difficulty, branch, topic } = req.body;
      
      const scenarioData = await generateLegalScenario({
        category,
        difficulty,
        branch,
        topic
      });
      
      const scenario = await storage.createLegalScenario({
        ...scenarioData,
        category,
        difficulty,
        branch: branch || 'All'
      });
      
      res.json(scenario);
    } catch (error) {
      console.error("Error generating scenario:", error);
      res.status(500).json({ message: "Error generating scenario" });
    }
  });

  // Scenario session routes
  app.get("/api/scenario-sessions", async (req, res) => {
    try {
      const userId = 1; // Mock user ID for now
      const sessions = await storage.getScenarioSessions(userId);
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching scenario sessions:", error);
      res.status(500).json({ message: "Error fetching scenario sessions" });
    }
  });

  app.post("/api/scenario-sessions", async (req, res) => {
    try {
      const session = await storage.createScenarioSession({
        ...req.body,
        userId: 1 // Mock user ID for now
      });
      res.json(session);
    } catch (error) {
      console.error("Error creating scenario session:", error);
      res.status(500).json({ message: "Error creating scenario session" });
    }
  });

  app.get("/api/scenario-sessions/:id", async (req, res) => {
    try {
      const sessionId = parseInt(req.params.id);
      const session = await storage.getScenarioSession(sessionId);
      
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      
      res.json(session);
    } catch (error) {
      console.error("Error fetching scenario session:", error);
      res.status(500).json({ message: "Error fetching scenario session" });
    }
  });

  app.put("/api/scenario-sessions/:id", async (req, res) => {
    try {
      const sessionId = parseInt(req.params.id);
      const session = await storage.updateScenarioSession(sessionId, req.body);
      res.json(session);
    } catch (error) {
      console.error("Error updating scenario session:", error);
      res.status(500).json({ message: "Error updating scenario session" });
    }
  });

  app.post("/api/scenario-sessions/:id/decision", async (req, res) => {
    try {
      const { generateDecisionResponse } = await import("./openai");
      const sessionId = parseInt(req.params.id);
      const { decision } = req.body;
      
      const session = await storage.getScenarioSession(sessionId);
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      
      const scenario = await storage.getLegalScenario(session.scenarioId!);
      if (!scenario) {
        return res.status(404).json({ message: "Scenario not found" });
      }
      
      const response = await generateDecisionResponse({
        scenario: scenario.scenario,
        userDecision: decision,
        previousDecisions: session.decisions || [],
        step: session.currentStep || 1
      });
      
      const updatedDecisions = [...(session.decisions || []), decision];
      const updatedResponses = [...(session.aiResponses || []), JSON.stringify(response)];
      
      const updatedSession = await storage.updateScenarioSession(sessionId, {
        decisions: updatedDecisions,
        aiResponses: updatedResponses,
        currentStep: (session.currentStep || 1) + 1
      });
      
      res.json({ ...response, session: updatedSession });
    } catch (error) {
      console.error("Error processing decision:", error);
      res.status(500).json({ message: "Error processing decision" });
    }
  });

  app.post("/api/scenario-sessions/:id/complete", async (req, res) => {
    try {
      const { generateFinalFeedback } = await import("./openai");
      const sessionId = parseInt(req.params.id);
      const { score } = req.body;
      
      const session = await storage.getScenarioSession(sessionId);
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      
      const scenario = await storage.getLegalScenario(session.scenarioId!);
      if (!scenario) {
        return res.status(404).json({ message: "Scenario not found" });
      }
      
      const feedback = await generateFinalFeedback(
        scenario.scenario,
        session.decisions || [],
        score
      );
      
      const completedSession = await storage.completeScenarioSession(sessionId, score, feedback);
      res.json(completedSession);
    } catch (error) {
      console.error("Error completing scenario session:", error);
      res.status(500).json({ message: "Error completing scenario session" });
    }
  });

  // Stories API routes for veterans' storytelling corner
  app.get("/api/stories", async (req, res) => {
    try {
      const category = req.query.category as string;
      const stories = await storage.getStories(category);
      res.json(stories);
    } catch (error) {
      console.error("Error fetching stories:", error);
      res.status(500).json({ message: "Failed to fetch stories" });
    }
  });

  app.get("/api/stories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid story ID" });
      }
      const story = await storage.getStory(id);
      if (!story) {
        return res.status(404).json({ message: "Story not found" });
      }
      res.json(story);
    } catch (error) {
      console.error("Error fetching story:", error);
      res.status(500).json({ message: "Failed to fetch story" });
    }
  });

  app.post("/api/stories", async (req, res) => {
    try {
      const storyData = {
        title: req.body.title,
        content: req.body.content,
        category: req.body.category,
        location: req.body.location || null,
        timeframe: req.body.timeframe,
        tags: req.body.tags ? req.body.tags.split(',').map((tag: string) => tag.trim()) : [],
        authorName: req.body.isAnonymous ? null : req.body.authorName,
        authorBranch: req.body.isAnonymous ? null : req.body.authorBranch,
        authorRank: req.body.isAnonymous ? null : req.body.authorRank,
        isAnonymous: req.body.isAnonymous === 'true',
        mediaType: req.body.mediaType || 'text',
        mediaUrl: req.body.mediaUrl || null
      };

      const story = await storage.createStory(storyData);
      res.json(story);
    } catch (error) {
      console.error("Error creating story:", error);
      res.status(500).json({ message: "Failed to create story" });
    }
  });

  app.put("/api/stories/:id/like", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid story ID" });
      }
      await storage.updateStoryEngagement(id, 'like');
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating story likes:", error);
      res.status(500).json({ message: "Failed to update story likes" });
    }
  });

  app.put("/api/stories/:id/comment", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid story ID" });
      }
      await storage.updateStoryEngagement(id, 'comment');
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating story comments:", error);
      res.status(500).json({ message: "Failed to update story comments" });
    }
  });

  // Document wizard API routes
  app.get("/api/document-templates", async (req, res) => {
    try {
      const category = req.query.category as string;
      const templates = await storage.getDocumentTemplates(category);
      res.json(templates);
    } catch (error) {
      console.error("Error fetching document templates:", error);
      res.status(500).json({ message: "Failed to fetch document templates" });
    }
  });

  app.get("/api/document-templates/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid template ID" });
      }
      const template = await storage.getDocumentTemplate(id);
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }
      res.json(template);
    } catch (error) {
      console.error("Error fetching document template:", error);
      res.status(500).json({ message: "Failed to fetch document template" });
    }
  });

  app.post("/api/documents/generate", async (req, res) => {
    try {
      const { templateId, formData, userId } = req.body;
      const document = await storage.generateDocument(templateId, formData, userId);
      res.json(document);
    } catch (error) {
      console.error("Error generating document:", error);
      res.status(500).json({ message: "Failed to generate document" });
    }
  });

  app.get("/api/documents/user/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
      const documents = await storage.getUserDocuments(userId);
      res.json(documents);
    } catch (error) {
      console.error("Error fetching user documents:", error);
      res.status(500).json({ message: "Failed to fetch user documents" });
    }
  });

  app.get("/api/documents/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid document ID" });
      }
      const document = await storage.getGeneratedDocument(id);
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }
      res.json(document);
    } catch (error) {
      console.error("Error fetching document:", error);
      res.status(500).json({ message: "Failed to fetch document" });
    }
  });

  // Forum API routes
  app.get("/api/forum/questions", async (req, res) => {
    try {
      const category = req.query.category as string;
      const questions = await storage.getForumQuestions(category);
      res.json(questions);
    } catch (error) {
      console.error("Error fetching forum questions:", error);
      res.status(500).json({ message: "Failed to fetch forum questions" });
    }
  });

  app.get("/api/forum/questions/:id", async (req, res) => {
    try {
      const questionId = parseInt(req.params.id);
      const question = await storage.getForumQuestion(questionId);
      if (!question) {
        return res.status(404).json({ message: "Question not found" });
      }
      res.json(question);
    } catch (error) {
      console.error("Error fetching forum question:", error);
      res.status(500).json({ message: "Failed to fetch forum question" });
    }
  });

  app.post("/api/forum/questions", async (req, res) => {
    try {
      const question = await storage.createForumQuestion(req.body);
      res.status(201).json(question);
    } catch (error) {
      console.error("Error creating forum question:", error);
      res.status(500).json({ message: "Failed to create forum question" });
    }
  });

  app.post("/api/forum/questions/:id/upvote", async (req, res) => {
    try {
      const questionId = parseInt(req.params.id);
      const question = await storage.getForumQuestion(questionId);
      if (!question) {
        return res.status(404).json({ message: "Question not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error upvoting question:", error);
      res.status(500).json({ message: "Failed to upvote question" });
    }
  });

  app.get("/api/forum/answers", async (req, res) => {
    try {
      const allQuestions = await storage.getForumQuestions();
      const allAnswers = [];
      
      for (const question of allQuestions) {
        const questionAnswers = await storage.getForumAnswers(question.id);
        allAnswers.push(...questionAnswers);
      }
      
      res.json(allAnswers);
    } catch (error) {
      console.error("Error fetching forum answers:", error);
      res.status(500).json({ message: "Failed to fetch forum answers" });
    }
  });

  app.get("/api/forum/questions/:id/answers", async (req, res) => {
    try {
      const questionId = parseInt(req.params.id);
      const answers = await storage.getForumAnswers(questionId);
      res.json(answers);
    } catch (error) {
      console.error("Error fetching forum answers:", error);
      res.status(500).json({ message: "Failed to fetch forum answers" });
    }
  });

  app.post("/api/forum/answers", async (req, res) => {
    try {
      const answer = await storage.createForumAnswer(req.body);
      res.status(201).json(answer);
    } catch (error) {
      console.error("Error creating forum answer:", error);
      res.status(500).json({ message: "Failed to create forum answer" });
    }
  });

  // Learning Dashboard API routes
  app.get("/api/learning-paths", async (req, res) => {
    try {
      // For now, return sample data - in production this would come from database
      const samplePaths = [
        {
          id: 1,
          title: "Military Justice Fundamentals",
          description: "Master the basics of military justice including UCMJ, Article 15 procedures, and your rights during investigations. Perfect starting point for service members.",
          category: "beginner",
          totalModules: 6,
          estimatedHours: 8,
          difficulty: "easy",
          prerequisites: [],
          badge: "Justice Cadet",
          isActive: true,
          createdAt: new Date()
        },
        {
          id: 2,
          title: "Court-Martial Defense Mastery",
          description: "Advanced strategies for court-martial proceedings, evidence rules, and defense tactics. Learn from real case studies and expert insights.",
          category: "advanced",
          totalModules: 10,
          estimatedHours: 15,
          difficulty: "hard",
          prerequisites: ["Military Justice Fundamentals"],
          badge: "Defense Expert",
          isActive: true,
          createdAt: new Date()
        },
        {
          id: 3,
          title: "Security Clearance Protection",
          description: "Complete guide to maintaining and protecting your security clearance throughout your military career. Covers investigations, appeals, and best practices.",
          category: "intermediate",
          totalModules: 8,
          estimatedHours: 12,
          difficulty: "medium",
          prerequisites: [],
          badge: "Clearance Guardian",
          isActive: true,
          createdAt: new Date()
        }
      ];
      res.json(samplePaths);
    } catch (error) {
      console.error("Error fetching learning paths:", error);
      res.status(500).json({ message: "Failed to fetch learning paths" });
    }
  });

  app.get("/api/user-progress", async (req, res) => {
    try {
      // Sample user progress data
      const sampleProgress = [
        {
          id: 1,
          userId: 1,
          pathId: 1,
          currentModule: 4,
          completedModules: [1, 2, 3],
          totalScore: 850,
          timeSpent: 180,
          lastAccessed: new Date(),
          completedAt: null,
          certificateEarned: false
        }
      ];
      res.json(sampleProgress);
    } catch (error) {
      console.error("Error fetching user progress:", error);
      res.status(500).json({ message: "Failed to fetch user progress" });
    }
  });

  app.get("/api/achievements", async (req, res) => {
    try {
      const sampleAchievements = [
        {
          id: 1,
          title: "First Steps",
          description: "Complete your first learning module",
          icon: "star",
          category: "learning",
          points: 100,
          requirement: "Complete 1 module",
          badgeColor: "blue",
          isActive: true,
          createdAt: new Date()
        },
        {
          id: 2,
          title: "Knowledge Seeker",
          description: "Complete 5 learning modules",
          icon: "bookopen",
          category: "learning",
          points: 500,
          requirement: "Complete 5 modules",
          badgeColor: "green",
          isActive: true,
          createdAt: new Date()
        },
        {
          id: 3,
          title: "Path Master",
          description: "Complete an entire learning path",
          icon: "trophy",
          category: "learning",
          points: 1000,
          requirement: "Complete 1 path",
          badgeColor: "gold",
          isActive: true,
          createdAt: new Date()
        },
        {
          id: 4,
          title: "Community Helper",
          description: "Answer 10 forum questions",
          icon: "users",
          category: "community",
          points: 750,
          requirement: "Answer 10 questions",
          badgeColor: "purple",
          isActive: true,
          createdAt: new Date()
        },
        {
          id: 5,
          title: "Streak Master",
          description: "Maintain a 7-day learning streak",
          icon: "zap",
          category: "learning",
          points: 300,
          requirement: "7 day streak",
          badgeColor: "yellow",
          isActive: true,
          createdAt: new Date()
        }
      ];
      res.json(sampleAchievements);
    } catch (error) {
      console.error("Error fetching achievements:", error);
      res.status(500).json({ message: "Failed to fetch achievements" });
    }
  });

  app.get("/api/user-achievements", async (req, res) => {
    try {
      const sampleUserAchievements = [
        {
          id: 1,
          userId: 1,
          achievementId: 1,
          earnedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
          progress: 100
        },
        {
          id: 2,
          userId: 1,
          achievementId: 2,
          earnedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
          progress: 100
        }
      ];
      res.json(sampleUserAchievements);
    } catch (error) {
      console.error("Error fetching user achievements:", error);
      res.status(500).json({ message: "Failed to fetch user achievements" });
    }
  });

  app.get("/api/learning-stats", async (req, res) => {
    try {
      const sampleStats = {
        id: 1,
        userId: 1,
        currentStreak: 5,
        longestStreak: 12,
        totalPoints: 1650,
        totalHoursLearned: 24,
        level: 3,
        experiencePoints: 2650,
        lastActivityDate: new Date(),
        updatedAt: new Date()
      };
      res.json(sampleStats);
    } catch (error) {
      console.error("Error fetching learning stats:", error);
      res.status(500).json({ message: "Failed to fetch learning stats" });
    }
  });

  // Micro-challenge routes
  app.get('/api/micro-challenges', async (req, res) => {
    try {
      const challenges = [
        {
          id: 1,
          title: "Article 92 Knowledge Check",
          description: "Test your understanding of Article 92 - Failure to obey order or regulation",
          category: "quiz",
          difficulty: "easy",
          topic: "ucmj",
          questionType: "multiple-choice",
          question: "Under Article 92, which of the following constitutes a lawful order?",
          options: [
            "An order that violates the UCMJ",
            "A clear, specific directive from a superior officer within their authority",
            "An order to commit a war crime",
            "A personal request unrelated to military duties"
          ],
          correctAnswer: "A clear, specific directive from a superior officer within their authority",
          explanation: "Article 92 requires orders to be lawful, clear, and within the superior's authority. Orders violating laws or regulations are not lawful orders.",
          points: 10,
          timeLimit: 60,
          tags: ["ucmj", "orders", "military-law"],
          isActive: true,
          createdAt: new Date()
        },
        {
          id: 2,
          title: "Security Clearance Scenario",
          description: "Navigate a security clearance investigation scenario",
          category: "scenario",
          difficulty: "medium",
          topic: "clearance",
          questionType: "multiple-choice",
          question: "You're contacted by an investigator about a colleague's security clearance. What should you do?",
          options: [
            "Refuse to speak with the investigator",
            "Only share positive information about your colleague",
            "Provide honest, factual information as requested",
            "Ask your colleague what you should say first"
          ],
          correctAnswer: "Provide honest, factual information as requested",
          explanation: "During security clearance investigations, you have a duty to provide truthful, complete information. Withholding information or coordinating responses undermines the process.",
          points: 15,
          timeLimit: 90,
          tags: ["clearance", "investigation", "integrity"],
          isActive: true,
          createdAt: new Date()
        },
        {
          id: 3,
          title: "Court-Martial Authority",
          description: "Quick check on court-martial convening authority",
          category: "true-false",
          difficulty: "medium",
          topic: "court-martial",
          questionType: "true-false",
          question: "A General Court-Martial can only be convened by a General Officer.",
          options: ["True", "False"],
          correctAnswer: "False",
          explanation: "General Courts-Martial can be convened by officers in the grade of O-6 (Colonel/Captain) or higher who have been designated as convening authorities, not just General Officers.",
          points: 12,
          timeLimit: 45,
          tags: ["court-martial", "authority", "convening"],
          isActive: true,
          createdAt: new Date()
        }
      ];
      res.json(challenges);
    } catch (error) {
      console.error('Error fetching micro challenges:', error);
      res.status(500).json({ message: 'Failed to fetch micro challenges' });
    }
  });

  app.post('/api/micro-challenges/attempt', async (req, res) => {
    try {
      const { challengeId, userAnswer, timeSpent, userId } = req.body;
      
      // Sample challenge data for checking answers
      const challenges = {
        1: "A clear, specific directive from a superior officer within their authority",
        2: "Provide honest, factual information as requested",
        3: "False"
      };

      const correctAnswer = challenges[challengeId as keyof typeof challenges];
      const isCorrect = userAnswer === correctAnswer;
      const pointsEarned = isCorrect ? (challengeId === 1 ? 10 : challengeId === 2 ? 15 : 12) : 0;

      res.json({ isCorrect, pointsEarned });
    } catch (error) {
      console.error('Error creating challenge attempt:', error);
      res.status(500).json({ message: 'Failed to record challenge attempt' });
    }
  });

  app.get('/api/daily-challenge', async (req, res) => {
    try {
      const dailyChallenge = {
        id: 1,
        challengeDate: new Date(),
        challengeId: 1,
        category: "quiz",
        difficulty: "easy",
        bonusPoints: 5,
        isActive: true,
        createdAt: new Date(),
        challenge: {
          id: 1,
          title: "Daily UCMJ Challenge",
          description: "Today's focus: Understanding lawful orders under Article 92",
          category: "quiz",
          difficulty: "easy",
          topic: "ucmj",
          questionType: "multiple-choice",
          question: "Under Article 92, which of the following constitutes a lawful order?",
          options: [
            "An order that violates the UCMJ",
            "A clear, specific directive from a superior officer within their authority",
            "An order to commit a war crime",
            "A personal request unrelated to military duties"
          ],
          correctAnswer: "A clear, specific directive from a superior officer within their authority",
          explanation: "Article 92 requires orders to be lawful, clear, and within the superior's authority. Orders violating laws or regulations are not lawful orders.",
          points: 10,
          timeLimit: 60,
          tags: ["ucmj", "orders", "military-law"],
          isActive: true,
          createdAt: new Date()
        }
      };
      res.json(dailyChallenge);
    } catch (error) {
      console.error('Error fetching daily challenge:', error);
      res.status(500).json({ message: 'Failed to fetch daily challenge' });
    }
  });

  app.get('/api/challenge-stats', async (req, res) => {
    try {
      const stats = {
        id: 1,
        userId: 1,
        totalChallengesCompleted: 15,
        correctAnswers: 12,
        currentStreak: 3,
        longestStreak: 7,
        averageScore: 80,
        fastestTime: 25,
        totalTimeSpent: 450,
        lastChallengeDate: new Date(),
        updatedAt: new Date()
      };
      res.json(stats);
    } catch (error) {
      console.error('Error fetching challenge stats:', error);
      res.status(500).json({ message: 'Failed to fetch challenge stats' });
    }
  });

  // Career transition analysis endpoint
  app.post("/api/analyze-career-transition", async (req, res) => {
    try {
      const assessment: CareerAssessmentRequest = req.body.assessment;
      
      if (!assessment || !assessment.militaryBranch || !assessment.militaryOccupation) {
        return res.status(400).json({ 
          message: "Missing required assessment data" 
        });
      }

      const analysis = await analyzeCareerTransition(assessment);
      res.json(analysis);
    } catch (error: any) {
      console.error("Career analysis error:", error);
      res.status(500).json({ 
        message: "Failed to analyze career transition",
        error: error.message 
      });
    }
  });

  // Resume generation endpoint
  app.post("/api/generate-veteran-resume", async (req, res) => {
    try {
      const resumeData = req.body.resumeData;
      
      if (!resumeData || !resumeData.personalInfo || !resumeData.targetRole) {
        return res.status(400).json({ 
          message: "Missing required resume data" 
        });
      }

      const { generateVeteranResume } = await import("./openai");
      const generatedResume = await generateVeteranResume(resumeData);
      res.json(generatedResume);
    } catch (error: any) {
      console.error("Resume generation error:", error);
      res.status(500).json({ 
        message: "Failed to generate veteran resume",
        error: error.message 
      });
    }
  });

  // Attorney availability endpoint
  app.get("/api/availability/attorneys", async (req, res) => {
    try {
      const { date, specialty, consultationType } = req.query;
      const targetDate = date as string || new Date().toISOString().split('T')[0];
      
      // Get attorneys with real-time availability
      const attorneys = await storage.getAttorneysWithAvailability(
        targetDate,
        specialty as string,
        consultationType as string
      );
      
      res.json(attorneys);
    } catch (error: any) {
      console.error("Error fetching attorney availability:", error);
      res.status(500).json({ 
        message: "Failed to fetch attorney availability",
        error: error.message 
      });
    }
  });

  // Book consultation endpoint
  app.post("/api/consultations/book", async (req, res) => {
    try {
      const { booking } = req.body;
      
      if (!booking || !booking.attorneyId || !booking.timeSlotId || !booking.clientEmail) {
        return res.status(400).json({ 
          message: "Missing required booking information" 
        });
      }

      // Create consultation booking
      const consultation = await storage.createConsultationBooking(booking);
      
      // Update attorney availability
      await storage.updateTimeSlotAvailability(booking.timeSlotId, false);
      
      res.json({ 
        success: true, 
        consultationId: consultation.id,
        message: "Consultation booked successfully" 
      });
    } catch (error: any) {
      console.error("Consultation booking error:", error);
      res.status(500).json({ 
        message: "Failed to book consultation",
        error: error.message 
      });
    }
  });

  // Submit review endpoint
  app.post("/api/reviews", async (req, res) => {
    try {
      const { review } = req.body;
      
      if (!review || !review.userName || !review.rating || !review.title || !review.content) {
        return res.status(400).json({ 
          message: "Missing required review information" 
        });
      }

      // Validate rating range
      if (review.rating < 1 || review.rating > 5) {
        return res.status(400).json({ 
          message: "Rating must be between 1 and 5" 
        });
      }

      // Create review record
      const reviewData = {
        id: Date.now(),
        userName: review.userName,
        userBranch: review.userBranch || "Not specified",
        userEmail: review.userEmail || null,
        rating: review.rating,
        title: review.title,
        content: review.content,
        category: review.category || "General",
        wouldRecommend: review.wouldRecommend || true,
        createdAt: new Date().toISOString(),
        verified: false,
        helpful: 0
      };

      // Log the review for admin review
      console.log("New user review submitted:", reviewData);
      
      res.json({ 
        success: true, 
        reviewId: reviewData.id,
        message: "Review submitted successfully. Thank you for your feedback!" 
      });
    } catch (error: any) {
      console.error("Error submitting review:", error);
      res.status(500).json({ 
        message: "Failed to submit review",
        error: error.message 
      });
    }
  });

  // Get recent reviews endpoint
  app.get("/api/reviews", async (req, res) => {
    try {
      const reviews = [
        {
          id: 1,
          userName: "SGT Martinez",
          userBranch: "Army",
          rating: 5,
          title: "Excellent Legal Guidance",
          content: "The consultation booking system is incredibly efficient. Got connected with a military attorney within hours of my urgent situation.",
          category: "Consultation Booking",
          createdAt: "2024-01-15",
          helpful: 24,
          verified: true
        },
        {
          id: 2,
          userName: "PO2 Johnson",
          userBranch: "Navy",
          rating: 5,
          title: "Life-Saving Platform",
          content: "The AI-powered resume builder completely transformed my transition to civilian life. It translated my military experience perfectly.",
          category: "Resume Builder",
          createdAt: "2024-01-12",
          helpful: 18,
          verified: true
        }
      ];
      
      res.json(reviews);
    } catch (error: any) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ 
        message: "Failed to fetch reviews",
        error: error.message 
      });
    }
  });

  // Stripe payment routes
  app.post("/api/create-payment-intent", async (req, res) => {
    if (!stripe) {
      return res.status(503).json({ 
        message: "Payment processing is not available. Stripe configuration required." 
      });
    }

    try {
      const { amount, service } = req.body;
      
      if (!amount || amount <= 0) {
        return res.status(400).json({ 
          message: "Valid amount is required" 
        });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
        payment_method_types: ["card"],
        metadata: {
          service: service || "Legal Service"
        }
      });
      
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      console.error("Payment intent creation error:", error);
      res.status(500).json({ 
        message: "Error creating payment intent", 
        error: error.message 
      });
    }
  });

  app.post("/api/create-subscription", async (req, res) => {
    if (!stripe) {
      return res.status(503).json({ 
        message: "Payment processing is not available. Stripe configuration required." 
      });
    }

    try {
      const { email, name, priceId } = req.body;
      
      if (!email || !priceId) {
        return res.status(400).json({ 
          message: "Email and price ID are required" 
        });
      }

      // Create customer
      const customer = await stripe.customers.create({
        email: email,
        name: name || "Veteran User",
      });

      // Create subscription
      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{
          price: priceId,
        }],
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent'],
      });

      const invoice = subscription.latest_invoice as any;
      const paymentIntent = invoice?.payment_intent;

      res.json({
        subscriptionId: subscription.id,
        clientSecret: paymentIntent?.client_secret || null,
      });
    } catch (error: any) {
      console.error("Subscription creation error:", error);
      res.status(500).json({ 
        message: "Error creating subscription", 
        error: error.message 
      });
    }
  });

  // Stories routes for storytelling corner
  app.get("/api/stories", async (req, res) => {
    try {
      const mockStories = [
        {
          id: 1,
          title: "Brotherhood in Afghanistan",
          authorName: "SSG Michael Rodriguez",
          authorBranch: "Army",
          authorRank: "Staff Sergeant",
          content: "During my deployment to Afghanistan in 2019, our unit faced one of the most challenging missions of our tour. What started as a routine patrol turned into a 12-hour firefight that tested everything we had trained for. But what I remember most wasn't the fear or the chaos - it was how my brothers and sisters in arms never left anyone behind. When our medic was wounded, three soldiers immediately moved to his position under fire. That day taught me that courage isn't the absence of fear, but acting despite it to protect those who serve beside you.",
          mediaType: "text",
          category: "deployment",
          location: "Kandahar Province, Afghanistan",
          timeframe: "2019-2020",
          likes: 47,
          comments: 12,
          views: 234,
          tags: ["brotherhood", "courage", "afghanistan", "combat"],
          createdAt: "2024-01-15T10:30:00Z",
          isAnonymous: false
        },
        {
          id: 2,
          title: "Coming Home: A Transition Story",
          authorName: "Anonymous Veteran",
          authorBranch: "Marines",
          authorRank: "Corporal",
          content: "The hardest part wasn't the deployment - it was coming home. After 15 months overseas, I found myself struggling to connect with civilian life. Simple things like grocery shopping felt overwhelming. The constant noise, the crowds, the lack of structure. I want other veterans to know that it's okay to struggle with transition. It's okay to ask for help. I found support through the VA's counseling services and a local veterans group. Today, I'm thriving in my civilian career and helping other veterans navigate their own transitions. You're not alone in this journey.",
          mediaType: "text",
          category: "transition",
          timeframe: "2020-2023",
          likes: 89,
          comments: 31,
          views: 567,
          tags: ["transition", "mental-health", "support", "civilian-life"],
          createdAt: "2024-01-10T14:45:00Z",
          isAnonymous: true
        },
        {
          id: 3,
          title: "Leading Through Crisis",
          authorName: "CPT Sarah Chen",
          authorBranch: "Air Force",
          authorRank: "Captain",
          content: "As a young officer, I was thrust into a leadership role during a natural disaster response mission. Hurricane Maria had devastated Puerto Rico, and our team was tasked with coordinating relief efforts. I had 50 airmen under my command, working 18-hour days in challenging conditions. The pressure was immense, but I learned that true leadership isn't about having all the answers - it's about empowering your team, listening to their expertise, and making decisive decisions when it matters most. That mission shaped my understanding of service and sacrifice.",
          mediaType: "text",
          category: "leadership",
          location: "Puerto Rico",
          timeframe: "2017",
          likes: 62,
          comments: 18,
          views: 345,
          tags: ["leadership", "disaster-relief", "teamwork", "puerto-rico"],
          createdAt: "2024-01-08T09:15:00Z",
          isAnonymous: false
        }
      ];
      
      res.json(mockStories);
    } catch (error) {
      console.error("Error fetching stories:", error);
      res.status(500).json({ message: "Failed to fetch stories" });
    }
  });

  app.post("/api/stories", async (req, res) => {
    try {
      // For now, return a success response
      // In a real implementation, this would save to database
      res.json({ 
        id: Date.now(),
        message: "Story submitted successfully",
        ...req.body 
      });
    } catch (error) {
      console.error("Error creating story:", error);
      res.status(500).json({ message: "Failed to create story" });
    }
  });

  // Global search endpoint
  app.get("/api/search", async (req, res) => {
    try {
      const { query } = req.query as { query: string };
      
      if (!query || query.length < 3) {
        return res.json([]);
      }

      const searchTerm = query.toLowerCase();
      const results = [];

      // Use existing mock data for search results
      const mockResults = [
        {
          id: "resource-ucmj",
          type: "resource",
          title: "Article 15 Nonjudicial Punishment Guide",
          description: "Complete guide to understanding Article 15 proceedings and your rights",
          url: "/resources",
          category: "UCMJ"
        },
        {
          id: "attorney-mitchell",
          type: "attorney", 
          title: "Sarah Mitchell",
          description: "Court-Martial Defense • Virginia",
          url: "/attorneys",
          category: "Court-Martial Defense"
        },
        {
          id: "education-rights",
          type: "education",
          title: "Understanding Your UCMJ Rights",
          description: "Essential knowledge for military personnel facing legal proceedings",
          url: "/education", 
          category: "Beginner"
        }
      ];

      // Filter based on search term
      const filteredResults = mockResults.filter(item =>
        item.title.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm) ||
        item.category.toLowerCase().includes(searchTerm)
      );

      // Add story results if searching for storytelling terms
      if (searchTerm.includes("story") || searchTerm.includes("veteran") || searchTerm.includes("experience")) {
        results.push({
          id: "storytelling-corner",
          type: "story",
          title: "Veterans' Storytelling Corner",
          description: "Share and explore military experiences through multimedia storytelling",
          url: "/storytelling-corner",
          category: "Community"
        });
      }

      // Add emergency match for urgent terms
      if (searchTerm.includes("urgent") || searchTerm.includes("emergency") || searchTerm.includes("help")) {
        results.push({
          id: "urgent-match",
          type: "attorney",
          title: "Emergency Legal Support",
          description: "Immediate connection to experienced military legal counsel",
          url: "/urgent-match",
          category: "Emergency"
        });
      }

      // Combine all results
      results.push(...filteredResults);

      // Sort by relevance (exact matches first, then partial)
      results.sort((a, b) => {
        const aExact = a.title.toLowerCase().includes(searchTerm) ? 1 : 0;
        const bExact = b.title.toLowerCase().includes(searchTerm) ? 1 : 0;
        return bExact - aExact;
      });

      res.json(results.slice(0, 10)); // Return top 10 results
    } catch (error) {
      console.error("Error performing search:", error);
      res.status(500).json({ message: "Search failed" });
    }
  });

  const httpServer = createServer(app);
  
  // WebSocket server for video call signaling
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  // Store active video call sessions
  const activeCalls = new Map<string, { users: Set<WebSocket>, roomId: string }>();
  
  wss.on('connection', (ws: WebSocket) => {
    console.log('WebSocket client connected for video calling');
    
    ws.on('message', (message: Buffer) => {
      try {
        const data = JSON.parse(message.toString());
        
        switch (data.type) {
          case 'join-call':
            handleJoinCall(ws, data);
            break;
          case 'call-offer':
          case 'call-answer':
          case 'ice-candidate':
            relaySignalingMessage(ws, data);
            break;
          case 'leave-call':
            handleLeaveCall(ws, data);
            break;
          default:
            console.log('Unknown message type:', data.type);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    });
    
    ws.on('close', () => {
      console.log('WebSocket client disconnected');
      handleDisconnect(ws);
    });
    
    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });
  
  function handleJoinCall(ws: WebSocket, data: any) {
    const { roomId, userId, userType } = data;
    
    if (!activeCalls.has(roomId)) {
      activeCalls.set(roomId, { users: new Set(), roomId });
    }
    
    const room = activeCalls.get(roomId)!;
    room.users.add(ws);
    
    // Store user info on the WebSocket
    (ws as any).roomId = roomId;
    (ws as any).userId = userId;
    (ws as any).userType = userType;
    
    // Notify other users in the room
    const joinMessage = {
      type: 'user-joined',
      userId,
      userType,
      roomId
    };
    
    room.users.forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(joinMessage));
      }
    });
    
    console.log(`User ${userId} (${userType}) joined call room ${roomId}`);
  }
  
  function relaySignalingMessage(ws: WebSocket, data: any) {
    const roomId = (ws as any).roomId;
    if (!roomId || !activeCalls.has(roomId)) return;
    
    const room = activeCalls.get(roomId)!;
    
    // Relay the signaling message to other users in the room
    room.users.forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  }
  
  function handleLeaveCall(ws: WebSocket, data: any) {
    const roomId = (ws as any).roomId;
    const userId = (ws as any).userId;
    
    if (roomId && activeCalls.has(roomId)) {
      const room = activeCalls.get(roomId)!;
      room.users.delete(ws);
      
      // Notify other users
      const leaveMessage = {
        type: 'user-left',
        userId,
        roomId
      };
      
      room.users.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(leaveMessage));
        }
      });
      
      // Clean up empty rooms
      if (room.users.size === 0) {
        activeCalls.delete(roomId);
      }
      
      console.log(`User ${userId} left call room ${roomId}`);
    }
  }
  
  function handleDisconnect(ws: WebSocket) {
    const roomId = (ws as any).roomId;
    const userId = (ws as any).userId;
    
    if (roomId && activeCalls.has(roomId)) {
      handleLeaveCall(ws, { roomId, userId });
    }
  }
  
  return httpServer;
}
