import type { Express, RequestHandler } from "express";

// Complete authentication removal for MilitaryLegalShield public deployment
export async function setupNoAuth(app: Express) {
  console.log("MilitaryLegalShield: Configuring for public deployment at https://militarylegalshield.com");
  
  // No authentication middleware at all - completely public access
  console.log("Authentication: DISABLED - Public access enabled");
}

// Public middleware that never blocks access
export const publicAccess: RequestHandler = (req, res, next) => {
  next();
};