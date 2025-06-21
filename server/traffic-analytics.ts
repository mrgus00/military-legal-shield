import { Request, Response } from 'express';
import { db } from './db';
import { sql } from 'drizzle-orm';

interface TrafficMetrics {
  timestamp: string;
  pageViews: number;
  uniqueVisitors: number;
  avgSessionDuration: number;
  bounceRate: number;
  topPages: Array<{
    path: string;
    views: number;
    uniqueViews: number;
  }>;
  userAgent: {
    mobile: number;
    desktop: number;
    tablet: number;
  };
  geoLocation: Array<{
    country: string;
    visitors: number;
  }>;
  referralSources: Array<{
    source: string;
    visitors: number;
  }>;
}

interface MilitarySpecificMetrics {
  attorneyConsultations: number;
  emergencyConsultationRequests: number;
  documentGenerationRequests: number;
  aiCaseAnalysisUsage: number;
  legalRoadmapViews: number;
  militaryBranchBreakdown: {
    army: number;
    navy: number;
    airForce: number;
    marines: number;
    coastGuard: number;
    spaceForce: number;
  };
  topLegalCategories: Array<{
    category: string;
    requests: number;
  }>;
  attorneyMatchSuccessRate: number;
}

class TrafficAnalytics {
  private metrics: Map<string, any> = new Map();
  private realTimeData: any = {};

  constructor() {
    this.initializeMetrics();
    this.startRealTimeTracking();
  }

  private initializeMetrics() {
    this.realTimeData = {
      activeUsers: 0,
      currentSessions: new Set(),
      hourlyStats: {
        pageViews: 0,
        uniqueVisitors: new Set(),
        consultationRequests: 0,
        attorneyMatches: 0,
        documentDownloads: 0
      },
      performance: {
        avgLoadTime: 0,
        errorRate: 0,
        uptime: 100
      }
    };
  }

  private startRealTimeTracking() {
    // Reset hourly stats every hour
    setInterval(() => {
      this.resetHourlyStats();
    }, 3600000); // 1 hour

    // Update real-time metrics every minute
    setInterval(() => {
      this.updateRealTimeMetrics();
    }, 60000); // 1 minute
  }

  private resetHourlyStats() {
    this.realTimeData.hourlyStats = {
      pageViews: 0,
      uniqueVisitors: new Set(),
      consultationRequests: 0,
      attorneyMatches: 0,
      documentDownloads: 0
    };
  }

  private updateRealTimeMetrics() {
    // Update active users count
    this.realTimeData.activeUsers = this.realTimeData.currentSessions.size;
    
    // Clean up old sessions (older than 30 minutes)
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    this.realTimeData.currentSessions.forEach((sessionId: string) => {
      const session = this.metrics.get(`session_${sessionId}`);
      if (session && new Date(session.lastActivity) < thirtyMinutesAgo) {
        this.realTimeData.currentSessions.delete(sessionId);
        this.metrics.delete(`session_${sessionId}`);
      }
    });
  }

  trackPageView(req: Request) {
    const sessionId = req.sessionID || this.generateSessionId();
    const userAgent = req.get('User-Agent') || '';
    const ip = req.ip || req.connection.remoteAddress;
    const path = req.path;
    const timestamp = new Date().toISOString();

    // Track session
    this.realTimeData.currentSessions.add(sessionId);
    this.realTimeData.hourlyStats.pageViews++;
    this.realTimeData.hourlyStats.uniqueVisitors.add(sessionId);

    // Store detailed metrics
    const pageViewData = {
      sessionId,
      path,
      timestamp,
      userAgent,
      ip,
      referrer: req.get('Referer'),
      loadTime: Date.now()
    };

    this.metrics.set(`pageview_${Date.now()}_${sessionId}`, pageViewData);

    // Track specific military legal pages
    this.trackMilitaryPageViews(path);
  }

  private trackMilitaryPageViews(path: string) {
    const militaryPages: Record<string, string> = {
      '/attorneys': 'attorney_directory',
      '/emergency-consultation': 'emergency_consultation',
      '/court-martial-defense': 'court_martial',
      '/family-law-poas': 'family_legal',
      '/legal-roadmap': 'legal_roadmap',
      '/ai-case-analysis': 'ai_analysis',
      '/urgent-match': 'urgent_matching'
    };

    if (militaryPages[path]) {
      const metric = `military_${militaryPages[path]}_views`;
      const current = this.metrics.get(metric) || 0;
      this.metrics.set(metric, current + 1);
    }
  }

  trackConsultationRequest(req: Request, consultationType: string) {
    const sessionId = req.sessionID || this.generateSessionId();
    const timestamp = new Date().toISOString();

    this.realTimeData.hourlyStats.consultationRequests++;

    const consultationData = {
      sessionId,
      type: consultationType,
      timestamp,
      urgency: req.body.urgency || 'routine',
      militaryBranch: req.body.militaryBranch,
      caseType: req.body.caseType
    };

    this.metrics.set(`consultation_${Date.now()}_${sessionId}`, consultationData);

    // Track by military branch
    if (req.body.militaryBranch) {
      const branchMetric = `branch_${req.body.militaryBranch.toLowerCase()}_consultations`;
      const current = this.metrics.get(branchMetric) || 0;
      this.metrics.set(branchMetric, current + 1);
    }
  }

  trackAttorneyMatch(req: Request, matchData: any) {
    const sessionId = req.sessionID || this.generateSessionId();
    const timestamp = new Date().toISOString();

    this.realTimeData.hourlyStats.attorneyMatches++;

    const matchMetric = {
      sessionId,
      attorneyId: matchData.attorneyId,
      matchScore: matchData.matchScore,
      responseTime: matchData.responseTime,
      timestamp,
      successful: matchData.successful
    };

    this.metrics.set(`attorney_match_${Date.now()}_${sessionId}`, matchMetric);
  }

  trackDocumentGeneration(req: Request, documentType: string) {
    const sessionId = req.sessionID || this.generateSessionId();
    const timestamp = new Date().toISOString();

    this.realTimeData.hourlyStats.documentDownloads++;

    const documentData = {
      sessionId,
      documentType,
      timestamp,
      militaryBranch: req.body.militaryBranch,
      generationTime: Date.now()
    };

    this.metrics.set(`document_${Date.now()}_${sessionId}`, documentData);
  }

  trackAICaseAnalysis(req: Request, analysisData: any) {
    const sessionId = req.sessionID || this.generateSessionId();
    const timestamp = new Date().toISOString();

    const aiMetric = {
      sessionId,
      caseType: analysisData.caseType,
      analysisTime: analysisData.processingTime,
      accuracy: analysisData.confidenceScore,
      timestamp,
      militaryBranch: req.body.militaryBranch
    };

    this.metrics.set(`ai_analysis_${Date.now()}_${sessionId}`, aiMetric);
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  getRealTimeMetrics(): any {
    return {
      activeUsers: this.realTimeData.activeUsers,
      hourlyStats: {
        ...this.realTimeData.hourlyStats,
        uniqueVisitors: this.realTimeData.hourlyStats.uniqueVisitors.size
      },
      performance: this.realTimeData.performance,
      timestamp: new Date().toISOString()
    };
  }

  getTrafficSummary(): TrafficMetrics {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    // Calculate metrics from stored data
    const recentPageViews = Array.from(this.metrics.entries())
      .filter(([key]) => key.startsWith('pageview_'))
      .filter(([key, data]) => new Date(data.timestamp) > oneHourAgo);

    const uniqueVisitors = new Set(
      recentPageViews.map(([key, data]) => data.sessionId)
    ).size;

    const topPages = this.calculateTopPages(recentPageViews);

    return {
      timestamp: now.toISOString(),
      pageViews: recentPageViews.length,
      uniqueVisitors,
      avgSessionDuration: this.calculateAvgSessionDuration(),
      bounceRate: this.calculateBounceRate(),
      topPages,
      userAgent: this.calculateUserAgentBreakdown(recentPageViews),
      geoLocation: this.calculateGeoBreakdown(recentPageViews),
      referralSources: this.calculateReferralSources(recentPageViews)
    };
  }

  getMilitaryMetrics(): MilitarySpecificMetrics {
    const consultations = Array.from(this.metrics.entries())
      .filter(([key]) => key.startsWith('consultation_')).length;

    const emergencyConsultations = Array.from(this.metrics.entries())
      .filter(([key, data]) => key.startsWith('consultation_') && data.urgency === 'emergency').length;

    const documentRequests = Array.from(this.metrics.entries())
      .filter(([key]) => key.startsWith('document_')).length;

    const aiAnalysisUsage = Array.from(this.metrics.entries())
      .filter(([key]) => key.startsWith('ai_analysis_')).length;

    const legalRoadmapViews = this.metrics.get('military_legal_roadmap_views') || 0;

    const attorneyMatches = Array.from(this.metrics.entries())
      .filter(([key]) => key.startsWith('attorney_match_'));

    const successfulMatches = attorneyMatches.filter(([key, data]) => data.successful).length;
    const matchSuccessRate = attorneyMatches.length > 0 ? (successfulMatches / attorneyMatches.length) * 100 : 0;

    return {
      attorneyConsultations: consultations,
      emergencyConsultationRequests: emergencyConsultations,
      documentGenerationRequests: documentRequests,
      aiCaseAnalysisUsage: aiAnalysisUsage,
      legalRoadmapViews,
      militaryBranchBreakdown: {
        army: this.metrics.get('branch_army_consultations') || 0,
        navy: this.metrics.get('branch_navy_consultations') || 0,
        airForce: this.metrics.get('branch_air_force_consultations') || 0,
        marines: this.metrics.get('branch_marines_consultations') || 0,
        coastGuard: this.metrics.get('branch_coast_guard_consultations') || 0,
        spaceForce: this.metrics.get('branch_space_force_consultations') || 0
      },
      topLegalCategories: this.calculateTopLegalCategories(),
      attorneyMatchSuccessRate: matchSuccessRate
    };
  }

  private calculateTopPages(pageViews: Array<[string, any]>): Array<{path: string, views: number, uniqueViews: number}> {
    const pageStats = new Map<string, {views: number, uniqueVisitors: Set<string>}>();

    pageViews.forEach(([key, data]) => {
      const path = data.path;
      if (!pageStats.has(path)) {
        pageStats.set(path, {views: 0, uniqueVisitors: new Set()});
      }
      const stats = pageStats.get(path)!;
      stats.views++;
      stats.uniqueVisitors.add(data.sessionId);
    });

    return Array.from(pageStats.entries())
      .map(([path, stats]) => ({
        path,
        views: stats.views,
        uniqueViews: stats.uniqueVisitors.size
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);
  }

  private calculateAvgSessionDuration(): number {
    // Calculate average session duration from active sessions
    const sessionDurations: number[] = [];
    this.realTimeData.currentSessions.forEach((sessionId: string) => {
      const session = this.metrics.get(`session_${sessionId}`);
      if (session) {
        const duration = Date.now() - new Date(session.startTime).getTime();
        sessionDurations.push(duration);
      }
    });

    if (sessionDurations.length === 0) return 0;
    return sessionDurations.reduce((sum, duration) => sum + duration, 0) / sessionDurations.length / 1000; // Convert to seconds
  }

  private calculateBounceRate(): number {
    const sessions = Array.from(this.realTimeData.currentSessions);
    if (sessions.length === 0) return 0;

    const singlePageSessions = sessions.filter(sessionId => {
      const pageViews = Array.from(this.metrics.entries())
        .filter(([key, data]) => key.startsWith('pageview_') && data.sessionId === sessionId);
      return pageViews.length === 1;
    });

    return (singlePageSessions.length / sessions.length) * 100;
  }

  private calculateUserAgentBreakdown(pageViews: Array<[string, any]>): {mobile: number, desktop: number, tablet: number} {
    const breakdown = {mobile: 0, desktop: 0, tablet: 0};

    pageViews.forEach(([key, data]) => {
      const userAgent = data.userAgent.toLowerCase();
      if (userAgent.includes('mobile')) {
        breakdown.mobile++;
      } else if (userAgent.includes('tablet')) {
        breakdown.tablet++;
      } else {
        breakdown.desktop++;
      }
    });

    return breakdown;
  }

  private calculateGeoBreakdown(pageViews: Array<[string, any]>): Array<{country: string, visitors: number}> {
    // In a real implementation, you would use a GeoIP service
    // For now, return mock data based on IP patterns
    const geoData = new Map<string, Set<string>>();
    
    pageViews.forEach(([key, data]) => {
      // Mock country detection based on IP (in production, use MaxMind or similar)
      const country = this.detectCountryFromIP(data.ip);
      if (!geoData.has(country)) {
        geoData.set(country, new Set());
      }
      geoData.get(country)!.add(data.sessionId);
    });

    return Array.from(geoData.entries())
      .map(([country, visitors]) => ({country, visitors: visitors.size}))
      .sort((a, b) => b.visitors - a.visitors)
      .slice(0, 10);
  }

  private detectCountryFromIP(ip: string): string {
    // Mock implementation - in production, use a GeoIP service
    if (!ip || ip.includes('127.0.0.1') || ip.includes('::1')) return 'Local';
    if (ip.startsWith('192.168.')) return 'United States'; // Common military base ranges
    return 'Unknown';
  }

  private calculateReferralSources(pageViews: Array<[string, any]>): Array<{source: string, visitors: number}> {
    const referralData = new Map<string, Set<string>>();

    pageViews.forEach(([key, data]) => {
      const referrer = data.referrer || 'Direct';
      const source = this.extractDomain(referrer);
      if (!referralData.has(source)) {
        referralData.set(source, new Set());
      }
      referralData.get(source)!.add(data.sessionId);
    });

    return Array.from(referralData.entries())
      .map(([source, visitors]) => ({source, visitors: visitors.size}))
      .sort((a, b) => b.visitors - a.visitors)
      .slice(0, 10);
  }

  private extractDomain(url: string): string {
    if (!url || url === 'Direct') return 'Direct';
    try {
      const domain = new URL(url).hostname;
      return domain.replace('www.', '');
    } catch {
      return 'Unknown';
    }
  }

  private calculateTopLegalCategories(): Array<{category: string, requests: number}> {
    const categories = new Map<string, number>();

    Array.from(this.metrics.entries())
      .filter(([key]) => key.startsWith('consultation_'))
      .forEach(([key, data]) => {
        const category = data.caseType || 'General';
        categories.set(category, (categories.get(category) || 0) + 1);
      });

    return Array.from(categories.entries())
      .map(([category, requests]) => ({category, requests}))
      .sort((a, b) => b.requests - a.requests)
      .slice(0, 10);
  }
}

// Middleware to track all requests
export const trackingMiddleware = (req: Request, res: Response, next: any) => {
  // Track page views for GET requests to pages
  if (req.method === 'GET' && !req.path.startsWith('/api/') && !req.path.includes('.')) {
    trafficAnalytics.trackPageView(req);
  }

  // Track performance metrics
  const startTime = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    // You can store performance metrics here
  });

  next();
};

// API endpoints for analytics
export async function getTrafficAnalytics(req: Request, res: Response) {
  try {
    const metrics = trafficAnalytics.getTrafficSummary();
    res.json(metrics);
  } catch (error) {
    console.error('Error fetching traffic analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
}

export async function getMilitaryAnalytics(req: Request, res: Response) {
  try {
    const metrics = trafficAnalytics.getMilitaryMetrics();
    res.json(metrics);
  } catch (error) {
    console.error('Error fetching military analytics:', error);
    res.status(500).json({ error: 'Failed to fetch military analytics' });
  }
}

export async function getRealTimeAnalytics(req: Request, res: Response) {
  try {
    const metrics = trafficAnalytics.getRealTimeMetrics();
    res.json(metrics);
  } catch (error) {
    console.error('Error fetching real-time analytics:', error);
    res.status(500).json({ error: 'Failed to fetch real-time analytics' });
  }
}

const analytics = new TrafficAnalytics();
export { analytics as trafficAnalytics };