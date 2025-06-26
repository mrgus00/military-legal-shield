import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';
import { storage } from './storage';

// Enhanced authentication features for premium users
export class AuthEnhancement {
  private jwtSecret: string;
  
  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || 'fallback-secret-key-change-in-production';
  }

  // Two-factor authentication setup (for premium users)
  async setupTwoFactor(userId: string) {
    const secret = this.generateTOTPSecret();
    await storage.updateUserTwoFactor?.(userId, { 
      twoFactorSecret: secret,
      twoFactorEnabled: false // User needs to verify setup first
    });
    
    return {
      secret,
      qrCodeUrl: this.generateQRCodeUrl(secret, userId),
      backupCodes: this.generateBackupCodes()
    };
  }

  // Verify two-factor authentication token
  verifyTwoFactor(secret: string, token: string): boolean {
    // Simple TOTP verification (in production, use proper TOTP library)
    const window = Math.floor(Date.now() / 30000);
    const expectedToken = this.generateTOTP(secret, window);
    
    return token === expectedToken || 
           token === this.generateTOTP(secret, window - 1) ||
           token === this.generateTOTP(secret, window + 1);
  }

  // Generate secure session token for premium features
  generateSecureToken(userId: string, permissions: string[] = []): string {
    const payload = {
      userId,
      permissions,
      type: 'secure_session',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hour expiration
    };
    
    return jwt.sign(payload, this.jwtSecret);
  }

  // Verify secure session token
  verifySecureToken(token: string): any {
    try {
      return jwt.verify(token, this.jwtSecret);
    } catch (error) {
      return null;
    }
  }

  // Password strength validation for military users
  validatePasswordStrength(password: string): { 
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

    // Common pattern checks
    if (/(.)\1{2,}/.test(password)) {
      score -= 1;
      recommendations.push('Avoid repeating characters');
    }

    return {
      isValid: score >= 5 && requirements.length === 0,
      score: Math.max(0, Math.min(10, score)),
      requirements,
      recommendations: recommendations.length > 0 ? recommendations : undefined
    };
  }

  // Enhanced login with security features
  async enhancedLogin(email: string, password: string, ipAddress: string): Promise<{
    success: boolean;
    user?: any;
    token?: string;
    requiresTwoFactor?: boolean;
    securityWarnings?: string[];
  }> {
    const user = await storage.getUserByEmail?.(email);
    if (!user) {
      return { success: false };
    }

    // Check if account is locked
    if (user.lockedUntil && new Date(user.lockedUntil) > new Date()) {
      return { 
        success: false, 
        securityWarnings: ['Account temporarily locked due to security concerns'] 
      };
    }

    // Verify password
    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      await this.recordFailedLogin(user.id, ipAddress);
      return { success: false };
    }

    // Check for suspicious login patterns
    const securityWarnings = await this.checkSecurityWarnings(user.id, ipAddress);

    // Two-factor authentication for premium users
    if (user.subscriptionTier === 'premium' && user.twoFactorEnabled) {
      return {
        success: true,
        user: { ...user, password: undefined }, // Remove password from response
        requiresTwoFactor: true,
        securityWarnings
      };
    }

    // Generate secure token
    const token = this.generateSecureToken(user.id, user.permissions || []);

    // Update last login
    await storage.updateLastLogin?.(user.id, ipAddress);

    return {
      success: true,
      user: { ...user, password: undefined },
      token,
      securityWarnings
    };
  }

  // Device fingerprinting for premium users
  generateDeviceFingerprint(req: Request): string {
    const userAgent = req.headers['user-agent'] || '';
    const acceptLanguage = req.headers['accept-language'] || '';
    const acceptEncoding = req.headers['accept-encoding'] || '';
    
    const fingerprint = `${userAgent}:${acceptLanguage}:${acceptEncoding}`;
    return Buffer.from(fingerprint).toString('base64').substring(0, 32);
  }

  // Session security monitoring
  async monitorSession(userId: string, sessionId: string, ipAddress: string): Promise<{
    isValid: boolean;
    riskLevel: 'low' | 'medium' | 'high';
    warnings: string[];
  }> {
    const warnings = [];
    let riskLevel: 'low' | 'medium' | 'high' = 'low';

    // Check for multiple concurrent sessions (premium feature)
    const activeSessions = await storage.getActiveSessions?.(userId);
    if (activeSessions && activeSessions.length > 3) {
      warnings.push('Multiple active sessions detected');
      riskLevel = 'medium';
    }

    // Check for unusual login patterns
    const recentLogins = await storage.getRecentLogins?.(userId, 24); // Last 24 hours
    if (recentLogins) {
      const uniqueIPs = new Set(recentLogins.map(login => login.ipAddress));
      if (uniqueIPs.size > 3) {
        warnings.push('Logins from multiple locations detected');
        riskLevel = 'high';
      }
    }

    return {
      isValid: riskLevel !== 'high',
      riskLevel,
      warnings
    };
  }

  // Private helper methods
  private generateTOTPSecret(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let secret = '';
    for (let i = 0; i < 32; i++) {
      secret += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return secret;
  }

  private generateTOTP(secret: string, timeWindow: number): string {
    // Simplified TOTP implementation - use proper library in production
    const hash = require('crypto').createHmac('sha1', secret).update(timeWindow.toString()).digest('hex');
    return (parseInt(hash.substring(0, 6), 16) % 1000000).toString().padStart(6, '0');
  }

  private generateQRCodeUrl(secret: string, userId: string): string {
    const issuer = 'MilitaryLegalShield';
    const label = `${issuer}:${userId}`;
    const params = new URLSearchParams({
      secret,
      issuer,
      algorithm: 'SHA1',
      digits: '6',
      period: '30'
    });
    
    return `otpauth://totp/${encodeURIComponent(label)}?${params}`;
  }

  private generateBackupCodes(): string[] {
    const codes = [];
    for (let i = 0; i < 10; i++) {
      codes.push(Math.random().toString(36).substring(2, 10).toUpperCase());
    }
    return codes;
  }

  private async recordFailedLogin(userId: string, ipAddress: string): Promise<void> {
    await storage.recordFailedLogin?.(userId, ipAddress);
  }

  private async checkSecurityWarnings(userId: string, ipAddress: string): Promise<string[]> {
    const warnings = [];
    
    // Check for logins from new locations
    const isNewLocation = await storage.isNewLoginLocation?.(userId, ipAddress);
    if (isNewLocation) {
      warnings.push('Login from new location detected');
    }

    return warnings;
  }
}

// Middleware for enhanced authentication
export const authEnhancement = new AuthEnhancement();

// Premium user session middleware
export function requireSecureSession(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Secure session token required' });
  }

  const decoded = authEnhancement.verifySecureToken(token);
  if (!decoded) {
    return res.status(401).json({ error: 'Invalid or expired secure session' });
  }

  (req as any).secureSession = decoded;
  next();
}

// Two-factor authentication middleware
export function requireTwoFactor(req: Request, res: Response, next: NextFunction) {
  const user = (req as any).user;
  
  if (!user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  if (user.subscriptionTier === 'premium' && user.twoFactorEnabled) {
    const twoFactorToken = req.headers['x-2fa-token'];
    
    if (!twoFactorToken) {
      return res.status(403).json({ 
        error: 'Two-factor authentication required',
        message: 'Please provide your 2FA token'
      });
    }

    const isValid = authEnhancement.verifyTwoFactor(user.twoFactorSecret, twoFactorToken as string);
    if (!isValid) {
      return res.status(403).json({ error: 'Invalid two-factor authentication token' });
    }
  }

  next();
}