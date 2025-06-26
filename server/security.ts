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

// General API rate limiting
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter rate limiting for authentication endpoints
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login attempts per windowMs
  message: {
    error: 'Too many authentication attempts, please try again later.',
    retryAfter: '15 minutes'
  },
  skipSuccessfulRequests: true,
});

// Emergency consultation rate limiting (more permissive for urgent needs)
export const emergencyLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 emergency requests per hour
  message: {
    error: 'Emergency consultation limit reached. For immediate assistance, call our 24/7 hotline.',
    emergencyContact: '1-800-MILITARY-LAW'
  },
});

// Attorney search rate limiting
export const attorneySearchLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 20, // 20 searches per 5 minutes
  message: {
    error: 'Too many attorney searches. Please refine your criteria and try again.',
    retryAfter: '5 minutes'
  },
});

// Document generation rate limiting with premium user exemption
export const documentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 document generations per hour for free users
  message: {
    error: 'Document generation limit reached. Upgrade to premium for unlimited access.',
    upgradeUrl: '/pricing'
  },
  skip: (req: Request) => {
    const user = (req as any).user;
    return user && user.subscriptionTier === 'premium';
  }
});

// AI case analysis rate limiting with premium exemption
export const aiAnalysisLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 AI analyses per hour for free users
  message: {
    error: 'AI case analysis limit reached. Upgrade to premium for unlimited access.',
    upgradeUrl: '/pricing'
  },
  skip: (req: Request) => {
    const user = (req as any).user;
    return user && user.subscriptionTier === 'premium';
  }
});

// Premium user rate limiter (more generous limits)
export const premiumLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // 500 requests per 15 minutes for premium users
  message: {
    error: 'Premium rate limit exceeded. Please contact support if you need higher limits.',
    support: '/contact-support'
  },
});

// Consultation booking rate limiting
export const consultationLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 3, // 3 consultation bookings per day for free users
  message: {
    error: 'Daily consultation booking limit reached. Upgrade to premium for unlimited bookings.',
    upgradeUrl: '/pricing'
  },
  skip: (req: Request) => {
    const user = (req as any).user;
    return user && user.subscriptionTier === 'premium';
  }
});

// Create tiered rate limiter based on user subscription
export function createTieredLimiter(req: Request, res: Response, next: NextFunction) {
  const user = (req as any).user;
  
  if (user && user.subscriptionTier === 'premium') {
    return premiumLimiter(req, res, next);
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
  const sessionToken = req.session?.csrfToken;
  
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
  
  if (!req.session) {
    req.session = {};
  }
  req.session.csrfToken = token;
  
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