import { Request, Response, NextFunction } from 'express';
import { pool } from './db';

// Real-time performance monitoring
class ApplicationMonitor {
  private metrics = {
    requests: 0,
    errors: 0,
    totalResponseTime: 0,
    slowQueries: 0,
    cacheHits: 0,
    cacheMisses: 0
  };

  private activeConnections = new Set<string>();
  private queryTimes: number[] = [];
  
  recordRequest(duration: number): void {
    this.metrics.requests++;
    this.metrics.totalResponseTime += duration;
    
    if (duration > 1000) {
      this.metrics.slowQueries++;
    }
    
    // Keep only last 100 query times for rolling average
    this.queryTimes.push(duration);
    if (this.queryTimes.length > 100) {
      this.queryTimes.shift();
    }
  }

  recordError(): void {
    this.metrics.errors++;
  }

  recordCacheHit(): void {
    this.metrics.cacheHits++;
  }

  recordCacheMiss(): void {
    this.metrics.cacheMisses++;
  }

  addConnection(id: string): void {
    this.activeConnections.add(id);
  }

  removeConnection(id: string): void {
    this.activeConnections.delete(id);
  }

  getMetrics() {
    const avgResponseTime = this.metrics.requests > 0 
      ? this.metrics.totalResponseTime / this.metrics.requests 
      : 0;
    
    const recentAvgResponseTime = this.queryTimes.length > 0
      ? this.queryTimes.reduce((a, b) => a + b, 0) / this.queryTimes.length
      : 0;

    const cacheHitRate = (this.metrics.cacheHits + this.metrics.cacheMisses) > 0
      ? (this.metrics.cacheHits / (this.metrics.cacheHits + this.metrics.cacheMisses)) * 100
      : 0;

    return {
      ...this.metrics,
      activeConnections: this.activeConnections.size,
      averageResponseTime: Math.round(avgResponseTime),
      recentAverageResponseTime: Math.round(recentAvgResponseTime),
      cacheHitRate: Math.round(cacheHitRate * 100) / 100,
      errorRate: this.metrics.requests > 0 
        ? Math.round((this.metrics.errors / this.metrics.requests) * 100 * 100) / 100
        : 0
    };
  }

  reset(): void {
    this.metrics = {
      requests: 0,
      errors: 0,
      totalResponseTime: 0,
      slowQueries: 0,
      cacheHits: 0,
      cacheMisses: 0
    };
    this.queryTimes = [];
  }
}

export const monitor = new ApplicationMonitor();

// Enhanced monitoring middleware
export const monitoringMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();
  const connectionId = `${req.ip}-${Date.now()}`;
  
  monitor.addConnection(connectionId);

  const cleanup = () => {
    const duration = Date.now() - start;
    monitor.recordRequest(duration);
    monitor.removeConnection(connectionId);
    
    if (res.statusCode >= 400) {
      monitor.recordError();
    }
    
    // Log detailed performance data
    if (duration > 500) {
      console.warn(`⚠️  Slow request: ${req.method} ${req.path} - ${duration}ms`);
    }
  };

  res.on('finish', cleanup);
  res.on('close', cleanup);

  next();
};

// Database health check
export const checkDatabaseHealth = async (): Promise<{
  status: string;
  connectionCount: number;
  responseTime: number;
}> => {
  const start = Date.now();
  
  try {
    const result = await pool.query('SELECT 1 as health_check');
    const responseTime = Date.now() - start;
    
    const connectionResult = await pool.query(`
      SELECT count(*) as connection_count 
      FROM pg_stat_activity 
      WHERE state = 'active'
    `);
    
    return {
      status: 'healthy',
      connectionCount: parseInt(connectionResult.rows[0].connection_count),
      responseTime
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      connectionCount: 0,
      responseTime: Date.now() - start
    };
  }
};

// System resource monitoring
export const getSystemMetrics = () => {
  const memUsage = process.memoryUsage();
  
  return {
    memory: {
      rss: Math.round(memUsage.rss / 1024 / 1024), // MB
      heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024), // MB
      heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024), // MB
      external: Math.round(memUsage.external / 1024 / 1024) // MB
    },
    uptime: Math.round(process.uptime()),
    nodeVersion: process.version,
    platform: process.platform,
    cpuUsage: process.cpuUsage()
  };
};

// Enhanced health endpoint
export const healthCheckEndpoint = async (req: Request, res: Response): Promise<void> => {
  try {
    const [dbHealth, appMetrics, systemMetrics] = await Promise.all([
      checkDatabaseHealth(),
      monitor.getMetrics(),
      getSystemMetrics()
    ]);

    const health = {
      status: dbHealth.status === 'healthy' && appMetrics.errorRate < 5 ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      version: '2.1.0',
      environment: process.env.NODE_ENV || 'development',
      services: {
        database: dbHealth,
        application: appMetrics,
        system: systemMetrics
      },
      features: {
        pwa: true,
        aiAnalysis: true,
        emergencyConsultation: true,
        attorneyMatching: true,
        documentGeneration: true
      }
    };

    const statusCode = health.status === 'healthy' ? 200 : 503;
    res.status(statusCode).json(health);
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Health check failed'
    });
  }
};

// Performance analytics endpoint
export const performanceAnalytics = (req: Request, res: Response): void => {
  const metrics = monitor.getMetrics();
  const systemMetrics = getSystemMetrics();
  
  res.json({
    performance: {
      ...metrics,
      recommendations: generatePerformanceRecommendations(metrics)
    },
    system: systemMetrics,
    timestamp: new Date().toISOString()
  });
};

// Generate performance improvement recommendations
const generatePerformanceRecommendations = (metrics: any): string[] => {
  const recommendations: string[] = [];
  
  if (metrics.averageResponseTime > 500) {
    recommendations.push('Consider implementing database query optimization');
  }
  
  if (metrics.cacheHitRate < 70) {
    recommendations.push('Increase cache TTL or implement more aggressive caching');
  }
  
  if (metrics.errorRate > 1) {
    recommendations.push('Investigate and fix recurring errors');
  }
  
  if (metrics.slowQueries > metrics.requests * 0.1) {
    recommendations.push('Optimize slow database queries with proper indexing');
  }
  
  return recommendations;
};

// Cache performance tracking
export const cacheTrackingMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const originalJson = res.json;
  
  res.json = function(data: any) {
    const cacheHeader = res.get('X-Cache');
    
    if (cacheHeader === 'HIT') {
      monitor.recordCacheHit();
    } else {
      monitor.recordCacheMiss();
    }
    
    return originalJson.call(this, data);
  };
  
  next();
};