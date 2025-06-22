import type { Express, Request, Response, NextFunction } from "express";
import { storage } from "./storage";

// Replit built-in authentication using headers
export function setupReplitAuth(app: Express) {
  // Middleware to handle authentication
  app.use((req: Request, res: Response, next: NextFunction) => {
    // Check for Replit authentication headers first
    const replitUserId = req.headers['x-replit-user-id'] as string;
    const replitUserName = req.headers['x-replit-user-name'] as string;
    const replitUserEmail = req.headers['x-replit-user-email'] as string;
    const replitUserProfile = req.headers['x-replit-user-profile-image'] as string;

    if (replitUserId && replitUserName) {
      // User is authenticated via Replit
      (req as any).user = {
        id: replitUserId,
        username: replitUserName,
        email: replitUserEmail,
        profileImageUrl: replitUserProfile,
        roles: ['user'],
        isAuthenticated: true
      };
    } else {
      // Check for session-based authentication (fallback)
      const sessionUser = (req as any).session?.user;
      if (sessionUser) {
        (req as any).user = sessionUser;
      } else {
        // No authentication found
        (req as any).user = null;
      }
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

  // Store/update user in database for auth_users table
  try {
    await storage.upsertAuthUser({
      id: user.id,
      email: user.email || '',
      firstName: user.username || '', // Use username as firstName for now
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

  // Login endpoint
  app.get('/api/login', (req: Request, res: Response) => {
    // Check if user is already authenticated
    if ((req as any).user && (req as any).user.isAuthenticated) {
      return res.redirect('/');
    }
    
    // For development, simulate authentication
    if (process.env.NODE_ENV === 'development') {
      // Create a mock session
      (req as any).session = (req as any).session || {};
      (req as any).session.user = {
        id: 'dev-user-' + Date.now(),
        username: 'TestUser',
        email: 'test@militarylegalshield.com',
        profileImageUrl: '/assets/default-avatar.png',
        roles: ['user'],
        isAuthenticated: true
      };
      return res.redirect('/');
    }
    
    // Redirect to client-side login page
    res.redirect('/login');
  });

  // Sign up endpoint
  app.get('/api/signup', (req: Request, res: Response) => {
    // Check if user is already authenticated
    if ((req as any).user && (req as any).user.isAuthenticated) {
      return res.redirect('/');
    }
    
    // Redirect to client-side signup page
    res.redirect('/signup');
  });

  // Logout endpoint
  app.get('/api/logout', (req: Request, res: Response) => {
    // Clear session data
    if ((req as any).session) {
      (req as any).session.destroy();
    }
    res.redirect('/');
  });

  // Callback endpoint (not needed for Replit auth but kept for compatibility)
  app.get('/api/callback', (req: Request, res: Response) => {
    res.redirect('/');
  });
}