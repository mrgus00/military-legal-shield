/**
 * Military-Grade End-to-End Encryption System
 * Implements Signal-like privacy features for secure military legal communications
 */

export interface EncryptedMessage {
  encryptedData: string;
  iv: string;
  ephemeralPublicKey: string;
  messageId: string;
  timestamp: number;
  expiresAt?: number; // For self-destructing messages
}

export interface KeyPair {
  publicKey: string;
  privateKey: string;
}

export interface MessageOptions {
  selfDestruct?: boolean;
  expirationMinutes?: number;
}

export class MilitaryEncryption {
  private keyPair: CryptoKeyPair | null = null;

  /**
   * Initialize encryption system - generates key pair for user
   */
  async initialize(): Promise<KeyPair> {
    this.keyPair = await window.crypto.subtle.generateKey(
      {
        name: "ECDH",
        namedCurve: "P-256"
      },
      true,
      ["deriveKey"]
    );

    const publicKeyBuffer = await window.crypto.subtle.exportKey(
      "raw",
      this.keyPair.publicKey
    );
    
    const privateKeyBuffer = await window.crypto.subtle.exportKey(
      "pkcs8",
      this.keyPair.privateKey
    );

    return {
      publicKey: this.arrayBufferToBase64(publicKeyBuffer),
      privateKey: this.arrayBufferToBase64(privateKeyBuffer)
    };
  }

  /**
   * Encrypt message with forward secrecy using ephemeral keys
   */
  async encryptMessage(
    message: string, 
    recipientPublicKey: string,
    options: MessageOptions = {}
  ): Promise<EncryptedMessage> {
    if (!this.keyPair) {
      throw new Error("Encryption not initialized. Call initialize() first.");
    }

    // Generate ephemeral key pair for forward secrecy
    const ephemeralKeyPair = await window.crypto.subtle.generateKey(
      {
        name: "ECDH",
        namedCurve: "P-256"
      },
      true,
      ["deriveKey"]
    );

    // Import recipient's public key
    const recipientKey = await window.crypto.subtle.importKey(
      "raw",
      this.base64ToArrayBuffer(recipientPublicKey),
      {
        name: "ECDH",
        namedCurve: "P-256"
      },
      false,
      []
    );

    // Derive shared secret
    const sharedSecret = await window.crypto.subtle.deriveKey(
      {
        name: "ECDH",
        public: recipientKey
      },
      ephemeralKeyPair.privateKey,
      {
        name: "AES-GCM",
        length: 256
      },
      false,
      ["encrypt"]
    );

    // Generate random IV
    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    // Encrypt the message
    const encodedMessage = new TextEncoder().encode(message);
    const encryptedData = await window.crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv
      },
      sharedSecret,
      encodedMessage
    );

    // Export ephemeral public key
    const ephemeralPublicKeyBuffer = await window.crypto.subtle.exportKey(
      "raw",
      ephemeralKeyPair.publicKey
    );

    const now = Date.now();
    const expiresAt = options.selfDestruct 
      ? now + (options.expirationMinutes || 60) * 60 * 1000 
      : undefined;

    return {
      encryptedData: this.arrayBufferToBase64(encryptedData),
      iv: this.arrayBufferToBase64(iv),
      ephemeralPublicKey: this.arrayBufferToBase64(ephemeralPublicKeyBuffer),
      messageId: this.generateMessageId(),
      timestamp: now,
      expiresAt
    };
  }

  /**
   * Decrypt message using ephemeral key
   */
  async decryptMessage(
    encryptedMessage: EncryptedMessage
  ): Promise<string | null> {
    if (!this.keyPair) {
      throw new Error("Encryption not initialized. Call initialize() first.");
    }

    // Check if message has expired (self-destruct)
    if (encryptedMessage.expiresAt && Date.now() > encryptedMessage.expiresAt) {
      console.warn("Message has self-destructed");
      return null;
    }

    try {
      // Import ephemeral public key
      const ephemeralPublicKey = await window.crypto.subtle.importKey(
        "raw",
        this.base64ToArrayBuffer(encryptedMessage.ephemeralPublicKey),
        {
          name: "ECDH",
          namedCurve: "P-256"
        },
        false,
        []
      );

      // Derive the same shared secret
      const sharedSecret = await window.crypto.subtle.deriveKey(
        {
          name: "ECDH",
          public: ephemeralPublicKey
        },
        this.keyPair.privateKey,
        {
          name: "AES-GCM",
          length: 256
        },
        false,
        ["decrypt"]
      );

      // Decrypt the message
      const decryptedData = await window.crypto.subtle.decrypt(
        {
          name: "AES-GCM",
          iv: this.base64ToArrayBuffer(encryptedMessage.iv)
        },
        sharedSecret,
        this.base64ToArrayBuffer(encryptedMessage.encryptedData)
      );

      return new TextDecoder().decode(decryptedData);
    } catch (error) {
      console.error("Decryption failed:", error);
      return null;
    }
  }

  /**
   * Generate secure message ID without revealing metadata
   */
  private generateMessageId(): string {
    const randomBytes = window.crypto.getRandomValues(new Uint8Array(16));
    return Array.from(randomBytes, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Utility functions for base64 conversion
   */
  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = window.atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }
}

/**
 * Message expiration manager for self-destructing messages
 */
export class MessageExpirationManager {
  private expirationTimers: Map<string, NodeJS.Timeout> = new Map();

  /**
   * Schedule message for self-destruction
   */
  scheduleDestruction(messageId: string, expirationMs: number, onExpire: () => void): void {
    // Clear existing timer if any
    const existingTimer = this.expirationTimers.get(messageId);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    // Set new timer
    const timer = setTimeout(() => {
      onExpire();
      this.expirationTimers.delete(messageId);
    }, expirationMs);

    this.expirationTimers.set(messageId, timer);
  }

  /**
   * Cancel scheduled destruction
   */
  cancelDestruction(messageId: string): void {
    const timer = this.expirationTimers.get(messageId);
    if (timer) {
      clearTimeout(timer);
      this.expirationTimers.delete(messageId);
    }
  }

  /**
   * Clean up all timers
   */
  cleanup(): void {
    this.expirationTimers.forEach(timer => clearTimeout(timer));
    this.expirationTimers.clear();
  }
}

// Global instances
export const militaryEncryption = new MilitaryEncryption();
export const messageExpirationManager = new MessageExpirationManager();