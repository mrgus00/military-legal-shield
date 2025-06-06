import type { Express, RequestHandler } from "express";

// Public access authentication bypass
export async function setupPublicAuth(app: Express) {
  console.log("Setting up public access mode - no authentication required");
  
  // Simple middleware that allows all requests
  app.use((req, res, next) => {
    req.isAuthenticated = () => false;
    req.user = null;
    next();
  });
}

// Public access middleware - always allows access
export const isPublic: RequestHandler = async (req, res, next) => {
  return next();
};

// Mock authentication check that always returns false
export const isAuthenticated: RequestHandler = async (req, res, next) => {
  // For public mode, just return null user instead of blocking
  return next();
};