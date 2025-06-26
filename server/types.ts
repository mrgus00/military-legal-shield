// Extended types for Express with session support
import type { Request, Response } from 'express';

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      session?: any;
      user?: any;
    }
  }
}

// Simple interface for requests with typed bodies
export interface TypedRequest<T = any> extends Request {
  body: T;
}

// Interface for authenticated requests
export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    militaryBranch?: string;
    rank?: string;
  };
}