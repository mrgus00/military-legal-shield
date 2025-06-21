import { Request, Response } from 'express';

interface TrafficData {
  pageViews: number;
  uniqueVisitors: Set<string>;
  consultationRequests: number;
  attorneyMatches: number;
  documentDownloads: number;
  emergencyRequests: number;
  aiAnalysisUsage: number;
  legalRoadmapViews: number;
  militaryBranches: Record<string, number>;
  topPages: Record<string, number>;
  startTime: Date;
}

class SimpleAnalytics {
  private data: TrafficData;
  private sessions: Set<string>;

  constructor() {
    this.data = {
      pageViews: 0,
      uniqueVisitors: new Set(),
      consultationRequests: 0,
      attorneyMatches: 0,
      documentDownloads: 0,
      emergencyRequests: 0,
      aiAnalysisUsage: 0,
      legalRoadmapViews: 0,
      militaryBranches: {},
      topPages: {},
      startTime: new Date()
    };
    this.sessions = new Set();
  }

  trackPageView(req: Request) {
    const sessionId = req.sessionID || this.generateSessionId(req);
    const path = req.path;

    this.data.pageViews++;
    this.data.uniqueVisitors.add(sessionId);
    this.sessions.add(sessionId);

    // Track specific pages
    this.data.topPages[path] = (this.data.topPages[path] || 0) + 1;

    // Track military-specific pages
    if (path === '/legal-roadmap') {
      this.data.legalRoadmapViews++;
    }
  }

  trackConsultation(militaryBranch?: string) {
    this.data.consultationRequests++;
    if (militaryBranch) {
      this.data.militaryBranches[militaryBranch] = (this.data.militaryBranches[militaryBranch] || 0) + 1;
    }
  }

  trackEmergencyRequest() {
    this.data.emergencyRequests++;
  }

  trackAttorneyMatch() {
    this.data.attorneyMatches++;
  }

  trackDocumentDownload() {
    this.data.documentDownloads++;
  }

  trackAIAnalysis() {
    this.data.aiAnalysisUsage++;
  }

  private generateSessionId(req: Request): string {
    return `${req.ip}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  getMetrics() {
    const uptime = Date.now() - this.data.startTime.getTime();
    const hoursSinceStart = uptime / (1000 * 60 * 60);

    return {
      realTime: {
        activeUsers: this.sessions.size,
        pageViews: this.data.pageViews,
        uniqueVisitors: this.data.uniqueVisitors.size,
        hourlyPageViews: hoursSinceStart > 0 ? Math.round(this.data.pageViews / hoursSinceStart) : 0
      },
      military: {
        consultationRequests: this.data.consultationRequests,
        emergencyRequests: this.data.emergencyRequests,
        attorneyMatches: this.data.attorneyMatches,
        documentDownloads: this.data.documentDownloads,
        aiAnalysisUsage: this.data.aiAnalysisUsage,
        legalRoadmapViews: this.data.legalRoadmapViews,
        militaryBranches: this.data.militaryBranches
      },
      pages: {
        topPages: Object.entries(this.data.topPages)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 10)
          .map(([path, views]) => ({ path, views }))
      },
      system: {
        uptime: Math.round(uptime / 1000), // seconds
        startTime: this.data.startTime.toISOString()
      }
    };
  }

  reset() {
    this.data = {
      pageViews: 0,
      uniqueVisitors: new Set(),
      consultationRequests: 0,
      attorneyMatches: 0,
      documentDownloads: 0,
      emergencyRequests: 0,
      aiAnalysisUsage: 0,
      legalRoadmapViews: 0,
      militaryBranches: {},
      topPages: {},
      startTime: new Date()
    };
    this.sessions.clear();
  }
}

export const analytics = new SimpleAnalytics();

// Middleware to track page views
export const analyticsMiddleware = (req: Request, res: Response, next: any) => {
  if (req.method === 'GET' && !req.path.startsWith('/api/') && !req.path.includes('.')) {
    analytics.trackPageView(req);
  }
  next();
};

// Analytics API endpoints
export async function getAnalytics(req: Request, res: Response) {
  try {
    const metrics = analytics.getMetrics();
    res.json(metrics);
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
}

export async function resetAnalytics(req: Request, res: Response) {
  try {
    analytics.reset();
    res.json({ message: 'Analytics reset successfully' });
  } catch (error) {
    console.error('Analytics reset error:', error);
    res.status(500).json({ error: 'Failed to reset analytics' });
  }
}