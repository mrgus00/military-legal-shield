import type { Express, Request, Response } from 'express';
import { 
  authLimiter, 
  generateCSRFToken, 
  validateCSRF, 
  requirePremium, 
  requireEnhancedAuth,
  validateMilitaryAccess,
  documentLimiter,
  aiAnalysisLimiter,
  emergencyLimiter
} from './security';

export function setupSecurityRoutes(app: Express) {
  // CSRF token endpoint
  app.get('/api/security/csrf-token', generateCSRFToken);

  // Enhanced authentication status endpoint
  app.get('/api/security/auth-status', (req: Request, res: Response) => {
    const user = (req as any).user;
    
    if (!user) {
      return res.json({ 
        authenticated: false,
        securityLevel: 'none'
      });
    }

    const securityLevel = user.subscriptionTier === 'premium' ? 'premium' : 'basic';
    const hasTwoFactor = user.twoFactorEnabled || false;
    const hasEnhancedAuth = user.lastVerificationAt && 
      new Date(user.lastVerificationAt) > new Date(Date.now() - 30 * 60 * 1000);

    res.json({
      authenticated: true,
      securityLevel,
      features: {
        twoFactorEnabled: hasTwoFactor,
        enhancedAuthActive: hasEnhancedAuth,
        premiumAccess: user.subscriptionTier === 'premium',
        militaryVerified: !!(user.branch && user.rank)
      },
      limits: {
        documentsPerHour: user.subscriptionTier === 'premium' ? 'unlimited' : 10,
        aiAnalysisPerHour: user.subscriptionTier === 'premium' ? 'unlimited' : 5,
        emergencyConsultationsPerHour: 10
      }
    });
  });

  // Password strength validation endpoint
  app.post('/api/security/validate-password', authLimiter, (req: Request, res: Response) => {
    const { password } = req.body;
    
    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    const validation = validatePasswordStrength(password);
    res.json(validation);
  });

  // Enhanced login endpoint with security features
  app.post('/api/security/enhanced-login', authLimiter, async (req: Request, res: Response) => {
    const { email, password, twoFactorToken } = req.body;
    const ipAddress = req.ip || 'unknown';

    try {
      // Basic validation
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      // Simulate enhanced login (would integrate with actual auth system)
      const loginResult = {
        success: true,
        user: {
          id: '123',
          email,
          subscriptionTier: 'premium',
          twoFactorEnabled: true,
          branch: 'Army',
          rank: 'E-8'
        },
        requiresTwoFactor: true,
        securityWarnings: []
      };

      if (loginResult.requiresTwoFactor && !twoFactorToken) {
        return res.json({
          success: false,
          requiresTwoFactor: true,
          message: 'Two-factor authentication required'
        });
      }

      res.json({
        success: true,
        user: loginResult.user,
        securityWarnings: loginResult.securityWarnings
      });

    } catch (error) {
      res.status(500).json({ error: 'Login failed' });
    }
  });

  // Security monitoring endpoint (premium feature)
  app.get('/api/security/monitoring', requirePremium, async (req: Request, res: Response) => {
    const user = (req as any).user;
    
    try {
      const monitoring = {
        activeSessions: 2,
        recentLogins: [
          { timestamp: new Date(), location: 'Fort Bragg, NC', device: 'Chrome on Windows' },
          { timestamp: new Date(Date.now() - 3600000), location: 'Fort Bragg, NC', device: 'Mobile Safari' }
        ],
        securityScore: 85,
        recommendations: [
          'Enable two-factor authentication for enhanced security',
          'Update password - last changed 3 months ago',
          'Review active sessions and log out unused devices'
        ],
        riskLevel: 'low'
      };

      res.json(monitoring);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve security monitoring data' });
    }
  });

  // Security settings update (premium feature)
  app.post('/api/security/settings', requirePremium, validateCSRF, async (req: Request, res: Response) => {
    const user = (req as any).user;
    const { twoFactorEnabled, enhancedAuthRequired, sessionTimeout } = req.body;

    try {
      // Update security settings (would integrate with database)
      const updatedSettings = {
        twoFactorEnabled: twoFactorEnabled !== undefined ? twoFactorEnabled : user.twoFactorEnabled,
        enhancedAuthRequired: enhancedAuthRequired !== undefined ? enhancedAuthRequired : false,
        sessionTimeout: sessionTimeout || 3600000 // 1 hour default
      };

      res.json({
        success: true,
        settings: updatedSettings,
        message: 'Security settings updated successfully'
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update security settings' });
    }
  });

  // Document generation with rate limiting
  app.post('/api/security/generate-document', 
    validateMilitaryAccess, 
    documentLimiter, 
    validateCSRF, 
    async (req: Request, res: Response) => {
      const { documentType, content } = req.body;
      const user = (req as any).user;

      try {
        // Simulate document generation
        const document = {
          id: Date.now().toString(),
          type: documentType,
          status: 'generated',
          downloadUrl: `/api/documents/download/${Date.now()}`,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
        };

        res.json({
          success: true,
          document,
          remainingGenerations: user.subscriptionTier === 'premium' ? 'unlimited' : 9
        });
      } catch (error) {
        res.status(500).json({ error: 'Document generation failed' });
      }
    }
  );

  // AI case analysis with rate limiting
  app.post('/api/security/ai-analysis', 
    validateMilitaryAccess, 
    aiAnalysisLimiter, 
    validateCSRF, 
    async (req: Request, res: Response) => {
      const { caseDetails } = req.body;
      const user = (req as any).user;

      try {
        // Simulate AI analysis
        const analysis = {
          caseId: Date.now().toString(),
          riskLevel: 'medium',
          recommendations: [
            'Gather character references from commanding officers',
            'Document any mitigating circumstances',
            'Consider plea negotiations with command'
          ],
          estimatedOutcome: 'Article 15 likely, court-martial unlikely',
          confidenceScore: 0.85
        };

        res.json({
          success: true,
          analysis,
          remainingAnalyses: user.subscriptionTier === 'premium' ? 'unlimited' : 4
        });
      } catch (error) {
        res.status(500).json({ error: 'AI analysis failed' });
      }
    }
  );

  // Emergency consultation with rate limiting
  app.post('/api/security/emergency-consultation', 
    emergencyLimiter, 
    async (req: Request, res: Response) => {
      const { urgencyLevel, situation, location } = req.body;

      try {
        const consultation = {
          consultationId: Date.now().toString(),
          status: 'queued',
          estimatedWaitTime: urgencyLevel === 'immediate' ? '5 minutes' : '15 minutes',
          emergencyHotline: '1-800-MILITARY-LAW',
          assignedAttorney: 'Available within estimated wait time'
        };

        res.json({
          success: true,
          consultation,
          message: 'Emergency consultation request submitted'
        });
      } catch (error) {
        res.status(500).json({ error: 'Emergency consultation request failed' });
      }
    }
  );
}

// Helper function for password validation
function validatePasswordStrength(password: string): { 
  isValid: boolean; 
  score: number; 
  requirements: string[];
  recommendations?: string[] 
} {
  const requirements = [];
  const recommendations = [];
  let score = 0;

  // Length check
  if (password.length >= 12) {
    score += 2;
  } else if (password.length >= 8) {
    score += 1;
    requirements.push('Consider using at least 12 characters for better security');
  } else {
    requirements.push('Password must be at least 8 characters long');
  }

  // Character variety checks
  if (/[a-z]/.test(password)) score += 1;
  else requirements.push('Include lowercase letters');

  if (/[A-Z]/.test(password)) score += 1;
  else requirements.push('Include uppercase letters');

  if (/\d/.test(password)) score += 1;
  else requirements.push('Include numbers');

  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 2;
  else requirements.push('Include special characters (!@#$%^&* etc.)');

  // Military-specific recommendations
  if (password.toLowerCase().includes('password')) {
    score -= 2;
    recommendations.push('Avoid using the word "password"');
  }

  if (password.toLowerCase().includes('military')) {
    score -= 1;
    recommendations.push('Avoid obvious military-related terms');
  }

  return {
    isValid: score >= 5 && requirements.length === 0,
    score: Math.max(0, Math.min(10, score)),
    requirements,
    recommendations: recommendations.length > 0 ? recommendations : undefined
  };
}