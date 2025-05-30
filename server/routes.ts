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

  const httpServer = createServer(app);
  return httpServer;
}
