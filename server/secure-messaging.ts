/**
 * Secure Messaging System with Minimal Metadata Storage
 * Implements Signal-like privacy principles for military legal communications
 */

import { Request, Response } from "express";
import crypto from "crypto";

interface SecureMessage {
  messageId: string;
  encryptedPayload: string; // Contains encrypted message + metadata
  ephemeralKey: string;
  createdAt: number;
  expiresAt?: number;
  deliveryStatus: 'pending' | 'delivered' | 'read';
}

interface UserKeys {
  userId: string;
  publicKey: string;
  lastSeen: number;
}

/**
 * Minimal storage that doesn't persist sensitive data
 * Messages are stored temporarily and auto-deleted
 */
class SecureMessageStorage {
  private messages: Map<string, SecureMessage> = new Map();
  private userKeys: Map<string, UserKeys> = new Map();
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Clean up expired messages every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanupExpiredMessages();
    }, 5 * 60 * 1000);
  }

  /**
   * Store encrypted message temporarily
   * No IP addresses, user metadata, or message content is logged
   */
  storeMessage(message: SecureMessage): void {
    this.messages.set(message.messageId, message);
    
    // Auto-expire messages that don't have explicit expiration
    if (!message.expiresAt) {
      message.expiresAt = Date.now() + (24 * 60 * 60 * 1000); // 24 hours default
    }
  }

  /**
   * Retrieve and optionally delete message
   */
  getMessage(messageId: string, deleteAfterRead: boolean = true): SecureMessage | null {
    const message = this.messages.get(messageId);
    
    if (!message) {
      return null;
    }

    // Check expiration
    if (message.expiresAt && Date.now() > message.expiresAt) {
      this.messages.delete(messageId);
      return null;
    }

    if (deleteAfterRead) {
      this.messages.delete(messageId);
    }

    return message;
  }

  /**
   * Store user's public key for secure communication
   */
  storeUserKey(userId: string, publicKey: string): void {
    this.userKeys.set(userId, {
      userId,
      publicKey,
      lastSeen: Date.now()
    });
  }

  /**
   * Get user's public key for encryption
   */
  getUserKey(userId: string): string | null {
    const userKey = this.userKeys.get(userId);
    return userKey ? userKey.publicKey : null;
  }

  /**
   * Clean up expired messages
   */
  private cleanupExpiredMessages(): void {
    const now = Date.now();
    const expiredMessages: string[] = [];

    this.messages.forEach((message, messageId) => {
      if (message.expiresAt && now > message.expiresAt) {
        expiredMessages.push(messageId);
      }
    });

    expiredMessages.forEach(messageId => {
      this.messages.delete(messageId);
    });

    console.log(`Cleaned up ${expiredMessages.length} expired messages`);
  }

  /**
   * Get pending messages for user (without exposing content)
   */
  getPendingMessages(userId: string): Array<{messageId: string, timestamp: number}> {
    const pending: Array<{messageId: string, timestamp: number}> = [];
    
    this.messages.forEach((message, messageId) => {
      // This is a simplified check - in practice, you'd need to associate messages with users
      // without storing user identifiers in plaintext
      if (message.deliveryStatus === 'pending') {
        pending.push({
          messageId,
          timestamp: message.createdAt
        });
      }
    });

    return pending;
  }

  /**
   * Clean shutdown
   */
  shutdown(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    // Clear all data
    this.messages.clear();
    this.userKeys.clear();
  }
}

// Global secure storage instance
const secureStorage = new SecureMessageStorage();

/**
 * Generate secure session token without user identification
 */
function generateSecureSessionToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Secure message sending endpoint
 * Minimizes logging and metadata storage
 */
export async function sendSecureMessage(req: Request, res: Response) {
  try {
    const {
      encryptedPayload,
      ephemeralKey,
      recipientId,
      expirationMinutes
    } = req.body;

    // Generate secure message ID
    const messageId = crypto.randomBytes(16).toString('hex');
    
    const now = Date.now();
    const expiresAt = expirationMinutes 
      ? now + (expirationMinutes * 60 * 1000)
      : undefined;

    const secureMessage: SecureMessage = {
      messageId,
      encryptedPayload,
      ephemeralKey,
      createdAt: now,
      expiresAt,
      deliveryStatus: 'pending'
    };

    secureStorage.storeMessage(secureMessage);

    // Return minimal response
    res.json({
      success: true,
      messageId,
      deliveryEstimate: '< 1 second'
    });

    // No logging of user IPs, message content, or sensitive metadata
    console.log(`Secure message queued: ${messageId}`);

  } catch (error) {
    console.error('Secure messaging error (details not logged)');
    res.status(500).json({
      success: false,
      error: 'Message delivery failed'
    });
  }
}

/**
 * Secure message retrieval endpoint
 */
export async function getSecureMessage(req: Request, res: Response) {
  try {
    const { messageId } = req.params;
    const { deleteAfterRead = true } = req.query;

    const message = secureStorage.getMessage(
      messageId, 
      deleteAfterRead === 'true'
    );

    if (!message) {
      return res.status(404).json({
        success: false,
        error: 'Message not found or expired'
      });
    }

    // Update delivery status
    message.deliveryStatus = 'delivered';

    res.json({
      success: true,
      encryptedPayload: message.encryptedPayload,
      ephemeralKey: message.ephemeralKey,
      timestamp: message.createdAt,
      expiresAt: message.expiresAt
    });

    console.log(`Secure message delivered: ${messageId}`);

  } catch (error) {
    console.error('Message retrieval error (details not logged)');
    res.status(500).json({
      success: false,
      error: 'Message retrieval failed'
    });
  }
}

/**
 * Register user's public key for secure communication
 */
export async function registerUserKey(req: Request, res: Response) {
  try {
    const { publicKey } = req.body;
    
    // Generate anonymous user ID (no personal data stored)
    const userId = crypto.randomBytes(16).toString('hex');
    
    secureStorage.storeUserKey(userId, publicKey);

    res.json({
      success: true,
      userId, // Used for message routing only
      message: 'Public key registered for secure communication'
    });

    console.log(`Public key registered for secure communication`);

  } catch (error) {
    console.error('Key registration error (details not logged)');
    res.status(500).json({
      success: false,
      error: 'Key registration failed'
    });
  }
}

/**
 * Get user's public key for message encryption
 */
export async function getUserPublicKey(req: Request, res: Response) {
  try {
    const { userId } = req.params;
    
    const publicKey = secureStorage.getUserKey(userId);
    
    if (!publicKey) {
      return res.status(404).json({
        success: false,
        error: 'User key not found'
      });
    }

    res.json({
      success: true,
      publicKey
    });

  } catch (error) {
    console.error('Key retrieval error (details not logged)');
    res.status(500).json({
      success: false,
      error: 'Key retrieval failed'
    });
  }
}

/**
 * Health check endpoint that doesn't reveal system information
 */
export async function secureMessagingHealth(req: Request, res: Response) {
  res.json({
    status: 'operational',
    timestamp: Date.now()
  });
}

// Cleanup on process exit
process.on('SIGINT', () => {
  console.log('Shutting down secure messaging system...');
  secureStorage.shutdown();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Shutting down secure messaging system...');
  secureStorage.shutdown();
  process.exit(0);
});

export { secureStorage };