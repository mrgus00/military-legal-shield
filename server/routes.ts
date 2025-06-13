import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { db, pool } from "./db";
import { sql } from "drizzle-orm";
import { insertConsultationSchema, insertEmergencyConsultationSchema, attorneys } from "@shared/schema";
import { eq, ilike, and, or } from "drizzle-orm";
import { z } from "zod";
import { analyzeCareerTransition, type CareerAssessmentRequest, getLegalAssistantResponse, type LegalAssistantRequest } from "./openai";
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
  // Public access - no authentication
  
  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString(), service: 'MilitaryLegalShield' });
  });
  
  // Attorney search endpoint - returns authentic military defense attorneys
  app.get("/api/attorneys", async (req, res) => {
    try {
      const { search, state, emergencyOnly } = req.query;
      
      let query = `
        SELECT * FROM attorneys 
        WHERE is_active = true
      `;
      const params: any[] = [];
      let paramCount = 1;

      if (search) {
        query += ` AND (first_name ILIKE $${paramCount} OR last_name ILIKE $${paramCount})`;
        params.push(`%${search}%`);
        paramCount++;
      }
      
      if (state && state !== "All States") {
        query += ` AND state = $${paramCount}`;
        params.push(state);
        paramCount++;
      }
      
      if (emergencyOnly === 'true') {
        query += ` AND available_for_emergency = true`;
      }

      query += ` ORDER BY rating DESC, review_count DESC`;

      const result = await pool.query(query, params);
      res.json(result.rows);
    } catch (error) {
      console.error("Error fetching attorneys:", error);
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