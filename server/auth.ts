import type { Express, Request, Response, NextFunction } from "express";
import { storage } from "./storage";

// Replit built-in authentication using headers
export function setupReplitAuth(app: Express) {
  // Middleware to parse Replit auth from headers
  app.use((req: Request, res: Response, next: NextFunction) => {
    // Replit provides user info in headers when authenticated
    const userId = req.headers['x-replit-user-id'] as string;
    const userName = req.headers['x-replit-user-name'] as string;
    const userEmail = req.headers['x-replit-user-email'] as string;
    const userProfileUrl = req.headers['x-replit-user-profile-image'] as string;
    const userRoles = req.headers['x-replit-user-roles'] as string;

    if (userId && userName) {
      // User is authenticated via Replit
      (req as any).user = {
        id: userId,
        username: userName,
        email: userEmail,
        profileImageUrl: userProfileUrl,
        roles: userRoles ? userRoles.split(',') : [],
        isAuthenticated: true
      };
    } else {
      // User is not authenticated
      (req as any).user = null;
    }

    next();
  });
}

// Middleware to require authentication
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const user = (req as any).user;
  
  if (!user || !user.isAuthenticated) {
    return res.status(401).json({ 
      error: 'Authentication required',
      message: 'Please sign in with your Replit account to access this resource'
    });
  }
  
  next();
}

// Middleware to optionally use authentication
export function optionalAuth(req: Request, res: Response, next: NextFunction) {
  // Always continue, but user info will be available if authenticated
  next();
}

// Get current user info
export async function getCurrentUser(req: Request): Promise<any> {
  const user = (req as any).user;
  
  if (!user || !user.isAuthenticated) {
    return null;
  }

  // Store/update user in database
  try {
    await storage.upsertUser({
      id: user.id,
      email: user.email,
      firstName: user.username, // Use username as firstName for now
      lastName: '', // Replit doesn't provide separate first/last names
      profileImageUrl: user.profileImageUrl
    });
  } catch (error) {
    console.error('Error upserting user:', error);
  }

  return user;
}

// Auth routes for compatibility
export function setupAuthRoutes(app: Express) {
  // Get current user endpoint
  app.get('/api/auth/user', async (req: Request, res: Response) => {
    try {
      const user = await getCurrentUser(req);
      
      if (!user) {
        return res.status(401).json({ error: 'Not authenticated' });
      }
      
      res.json(user);
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Login redirect (handled by Replit)
  app.get('/api/login', (req: Request, res: Response) => {
    // In Replit, authentication is handled automatically
    // Redirect to home page
    res.redirect('/');
  });

  // Logout (handled by Replit)
  app.get('/api/logout', (req: Request, res: Response) => {
    // In Replit, logout is handled by the platform
    // Redirect to home page
    res.redirect('/');
  });

  // Callback endpoint (not needed for Replit auth but kept for compatibility)
  app.get('/api/callback', (req: Request, res: Response) => {
    res.redirect('/');
  });
}