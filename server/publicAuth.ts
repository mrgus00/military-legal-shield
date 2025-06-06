import type { Express, RequestHandler } from "express";

// Public access authentication bypass
export async function setupPublicAuth(app: Express) {
  console.log("Setting up public access mode - no authentication required");
  
  // Override any existing authentication middleware
  app.use((req, res, next) => {
    // Mock authentication methods for public access
    req.isAuthenticated = () => false;
    req.user = undefined;
    req.login = () => {};
    req.logout = () => {};
    next();
  });

  // Intercept any OAuth or login redirects and allow direct access
  app.get('/api/login', (req, res) => {
    // Instead of redirecting to OAuth, redirect to home
    res.redirect('/');
  });

  app.get('/api/logout', (req, res) => {
    // Simple logout that redirects to home
    res.redirect('/');
  });

  app.get('/api/callback', (req, res) => {
    // Handle OAuth callback by redirecting to home
    res.redirect('/');
  });
}

// Public access middleware - always allows access
export const isPublic: RequestHandler = async (req, res, next) => {
  return next();
};

// Mock authentication check that always allows access
export const isAuthenticated: RequestHandler = async (req, res, next) => {
  // For public mode, continue without authentication
  return next();
};