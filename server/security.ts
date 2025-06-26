import type { Request, Response, NextFunction, Express } from 'express';

// Security configuration for military legal platform
export function setupSecurity(app: Express) {
  // Basic security headers (manual implementation instead of helmet)
  app.use((req: Request, res: Response, next: NextFunction) => {
    // Security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
    
    // Content Security Policy
    res.setHeader('Content-Security-Policy', [
      "default-src 'self'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://js.stripe.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://api.stripe.com https://www.google-analytics.com",
      "frame-src 'self' https://js.stripe.com"
    ].join('; '));
    
    // Remove server identification
    res.removeHeader('X-Powered-By');
    
    next();
  });

  // Trust proxy for rate limiting behind reverse proxy
  app.set('trust proxy', 1);
}

// Simple rate limiting implementation (manual)
interface RateLimitStore {
  [key: string]: { count: number; resetTime: number };
}

const rateLimitStore: RateLimitStore = {};

// General API rate limiting (temporarily disabled for debugging)
export function generalLimiter(req: Request, res: Response, next: NextFunction) {
  // Temporarily disabled for debugging - always allow requests
  next();
  return;
  
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 100;
  const now = Date.now();
  
  if (!rateLimitStore[ip] || now > rateLimitStore[ip].resetTime) {
    rateLimitStore[ip] = { count: 1, resetTime: now + windowMs };
    return next();
  }
  
  rateLimitStore[ip].count++;
  
  if (rateLimitStore[ip].count > maxRequests) {
    return res.status(429).json({
      error: 'Too many requests from this IP, please try again later.',
      retryAfter: '15 minutes'
    });
  }
  
  next();
}

// Stricter rate limiting for authentication endpoints
export function authLimiter(req: Request, res: Response, next: NextFunction) {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const key = `auth_${ip}`;
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 5;
  const now = Date.now();
  
  if (!rateLimitStore[key] || now > rateLimitStore[key].resetTime) {
    rateLimitStore[key] = { count: 1, resetTime: now + windowMs };
    return next();
  }
  
  rateLimitStore[key].count++;
  
  if (rateLimitStore[key].count > maxRequests) {
    return res.status(429).json({
      error: 'Too many authentication attempts, please try again later.',
      retryAfter: '15 minutes'
    });
  }
  
  next();
}

// Emergency consultation rate limiting
export function emergencyLimiter(req: Request, res: Response, next: NextFunction) {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const key = `emergency_${ip}`;
  const windowMs = 60 * 60 * 1000; // 1 hour
  const maxRequests = 10;
  const now = Date.now();
  
  if (!rateLimitStore[key] || now > rateLimitStore[key].resetTime) {
    rateLimitStore[key] = { count: 1, resetTime: now + windowMs };
    return next();
  }
  
  rateLimitStore[key].count++;
  
  if (rateLimitStore[key].count > maxRequests) {
    return res.status(429).json({
      error: 'Emergency consultation limit reached. For immediate assistance, call our 24/7 hotline.',
      emergencyContact: '1-800-MILITARY-LAW'
    });
  }
  
  next();
}

// Document generation rate limiting with premium exemption
export function documentLimiter(req: Request, res: Response, next: NextFunction) {
  const user = (req as any).user;
  if (user && user.subscriptionTier === 'premium') {
    return next(); // Skip rate limiting for premium users
  }
  
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const key = `document_${ip}`;
  const windowMs = 60 * 60 * 1000; // 1 hour
  const maxRequests = 10;
  const now = Date.now();
  
  if (!rateLimitStore[key] || now > rateLimitStore[key].resetTime) {
    rateLimitStore[key] = { count: 1, resetTime: now + windowMs };
    return next();
  }
  
  rateLimitStore[key].count++;
  
  if (rateLimitStore[key].count > maxRequests) {
    return res.status(429).json({
      error: 'Document generation limit reached. Upgrade to premium for unlimited access.',
      upgradeUrl: '/pricing'
    });
  }
  
  next();
}

// AI case analysis rate limiting with premium exemption
export function aiAnalysisLimiter(req: Request, res: Response, next: NextFunction) {
  const user = (req as any).user;
  if (user && user.subscriptionTier === 'premium') {
    return next(); // Skip rate limiting for premium users
  }
  
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const key = `ai_analysis_${ip}`;
  const windowMs = 60 * 60 * 1000; // 1 hour
  const maxRequests = 5;
  const now = Date.now();
  
  if (!rateLimitStore[key] || now > rateLimitStore[key].resetTime) {
    rateLimitStore[key] = { count: 1, resetTime: now + windowMs };
    return next();
  }
  
  rateLimitStore[key].count++;
  
  if (rateLimitStore[key].count > maxRequests) {
    return res.status(429).json({
      error: 'AI case analysis limit reached. Upgrade to premium for unlimited access.',
      upgradeUrl: '/pricing'
    });
  }
  
  next();
}

// Create tiered rate limiter based on user subscription
export function createTieredLimiter(req: Request, res: Response, next: NextFunction) {
  const user = (req as any).user;
  
  if (user && user.subscriptionTier === 'premium') {
    // Premium users get higher limits
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    const key = `premium_${ip}`;
    const windowMs = 15 * 60 * 1000; // 15 minutes
    const maxRequests = 500;
    const now = Date.now();
    
    if (!rateLimitStore[key] || now > rateLimitStore[key].resetTime) {
      rateLimitStore[key] = { count: 1, resetTime: now + windowMs };
      return next();
    }
    
    rateLimitStore[key].count++;
    
    if (rateLimitStore[key].count > maxRequests) {
      return res.status(429).json({
        error: 'Premium rate limit exceeded. Please contact support if you need higher limits.',
        support: '/contact-support'
      });
    }
    
    return next();
  } else {
    return generalLimiter(req, res, next);
  }
}

// Advanced authentication middleware for premium features
export function requirePremium(req: Request, res: Response, next: NextFunction) {
  const user = (req as any).user;
  
  if (!user) {
    return res.status(401).json({ 
      error: 'Authentication required',
      message: 'Please log in to access this feature'
    });
  }
  
  if (user.subscriptionTier !== 'premium') {
    return res.status(403).json({ 
      error: 'Premium subscription required',
      message: 'Upgrade to premium to access advanced legal features',
      upgradeUrl: '/pricing'
    });
  }
  
  next();
}

// Enhanced authentication for sensitive operations
export function requireEnhancedAuth(req: Request, res: Response, next: NextFunction) {
  const user = (req as any).user;
  
  if (!user) {
    return res.status(401).json({ 
      error: 'Authentication required',
      message: 'Please log in to access this feature'
    });
  }
  
  // Check if user has verified their identity recently (within last 30 minutes)
  const lastVerified = user.lastVerificationAt;
  const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
  
  if (!lastVerified || new Date(lastVerified) < thirtyMinutesAgo) {
    return res.status(403).json({ 
      error: 'Enhanced authentication required',
      message: 'Please verify your identity to access sensitive legal information',
      verificationUrl: '/verify-identity'
    });
  }
  
  next();
}

// CSRF protection for state-changing operations
export function validateCSRF(req: Request, res: Response, next: NextFunction) {
  const token = req.headers['x-csrf-token'] || req.body._csrf;
  const sessionToken = (req.session as any)?.csrfToken;
  
  if (!token || !sessionToken || token !== sessionToken) {
    return res.status(403).json({ 
      error: 'CSRF token validation failed',
      message: 'Invalid or missing CSRF token'
    });
  }
  
  next();
}

// Generate CSRF token for client
export function generateCSRFToken(req: Request, res: Response) {
  const token = Math.random().toString(36).substring(2, 15) + 
                Math.random().toString(36).substring(2, 15);
  
  if (req.session) {
    (req.session as any).csrfToken = token;
  }
  
  res.json({ csrfToken: token });
}

// Input validation middleware
export function validateInput(validationRules: any) {
  return (req: Request, res: Response, next: NextFunction) => {
    const errors: string[] = [];
    
    // Basic validation - can be enhanced with express-validator
    for (const field in validationRules) {
      const rule = validationRules[field];
      const value = req.body[field];
      
      if (rule.required && (!value || value.trim() === '')) {
        errors.push(`${field} is required`);
      }
      
      if (value && rule.maxLength && value.length > rule.maxLength) {
        errors.push(`${field} must be less than ${rule.maxLength} characters`);
      }
      
      if (value && rule.pattern && !rule.pattern.test(value)) {
        errors.push(`${field} format is invalid`);
      }
    }
    
    if (errors.length > 0) {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: errors
      });
    }
    
    next();
  };
}

// Military-specific security checks
export function validateMilitaryAccess(req: Request, res: Response, next: NextFunction) {
  const user = (req as any).user;
  
  if (!user) {
    return res.status(401).json({ 
      error: 'Authentication required',
      message: 'Military verification required for this resource'
    });
  }
  
  // Check if user has military affiliation
  if (!user.branch || !user.rank) {
    return res.status(403).json({ 
      error: 'Military verification required',
      message: 'Please complete your military profile to access this resource',
      profileUrl: '/profile/military-verification'
    });
  }
  
  next();
}

// Security headers for API responses
export function addSecurityHeaders(req: Request, res: Response, next: NextFunction) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Remove server identification
  res.removeHeader('X-Powered-By');
  
  next();
}