import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertConsultationSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
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

  // Search attorneys with filters for urgent matching
  app.get("/api/attorneys/search", async (req, res) => {
    try {
      const { location, pricingTier, specialty, emergencyOnly } = req.query;
      const attorneys = await storage.getAttorneys(); // Simplified for now
      
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

  const httpServer = createServer(app);
  return httpServer;
}
