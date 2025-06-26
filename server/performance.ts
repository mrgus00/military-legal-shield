import { Request, Response, NextFunction } from 'express';
import { createHash } from 'crypto';

// Memory cache for API responses
interface CacheEntry {
  data: any;
  timestamp: number;
  ttl: number;
  etag: string;
  contentType?: string;
}

class PerformanceCache {
  private cache = new Map<string, CacheEntry>();
  private readonly maxSize = 1000; // Maximum cache entries
  private readonly defaultTTL = 5 * 60 * 1000; // 5 minutes default TTL

  constructor() {
    // Clean expired entries every 10 minutes
    setInterval(() => this.cleanup(), 10 * 60 * 1000);
  }

  generateKey(req: Request): string {
    const baseKey = `${req.method}:${req.path}`;
    const queryKey = Object.keys(req.query).sort().map(k => `${k}=${req.query[k]}`).join('&');
    return queryKey ? `${baseKey}?${queryKey}` : baseKey;
  }

  generateETag(data: any): string {
    return createHash('md5').update(JSON.stringify(data)).digest('hex');
  }

  set(key: string, data: any, ttl: number = this.defaultTTL, contentType?: string): void {
    // Remove oldest entries if cache is full
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }

    const etag = this.generateETag(data);
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
      etag,
      contentType
    });
  }

  get(key: string): CacheEntry | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry;
  }

  invalidate(pattern: string): void {
    const regex = new RegExp(pattern);
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }

  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hitRate: 0 // Would need hit tracking for actual implementation
    };
  }
}

export const performanceCache = new PerformanceCache();

// Caching middleware with different TTL strategies
export function cacheMiddleware(ttlSeconds: number = 300) {
  return (req: Request, res: Response, next: NextFunction) => {
    // Skip caching for non-GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const cacheKey = performanceCache.generateKey(req);
    const cached = performanceCache.get(cacheKey);

    if (cached) {
      // Check if client has the same version (ETag)
      const clientETag = req.headers['if-none-match'];
      if (clientETag === cached.etag) {
        return res.status(304).end();
      }

      // Set cache headers
      res.set({
        'Cache-Control': `public, max-age=${ttlSeconds}`,
        'ETag': cached.etag,
        'X-Cache': 'HIT',
        'Content-Type': cached.contentType || 'application/json'
      });

      return res.json(cached.data);
    }

    // Intercept response to cache it
    const originalSend = res.json;
    res.json = function(data: any) {
      const contentType = res.get('Content-Type') || 'application/json';
      performanceCache.set(cacheKey, data, ttlSeconds * 1000, contentType);
      
      const etag = performanceCache.generateETag(data);
      res.set({
        'Cache-Control': `public, max-age=${ttlSeconds}`,
        'ETag': etag,
        'X-Cache': 'MISS'
      });

      return originalSend.call(this, data);
    };

    next();
  };
}

// Compression middleware for responses
export function compressionMiddleware(req: Request, res: Response, next: NextFunction) {
  const acceptEncoding = req.headers['accept-encoding'] || '';
  
  if (acceptEncoding.includes('gzip')) {
    res.set('Content-Encoding', 'gzip');
    res.set('Vary', 'Accept-Encoding');
  }
  
  next();
}

// Performance monitoring middleware
export function performanceMonitoring(req: Request, res: Response, next: NextFunction) {
  const startTime = Date.now();
  
  // Set response time header before response is sent
  const originalSend = res.send;
  const originalJson = res.json;
  
  res.send = function(data) {
    const duration = Date.now() - startTime;
    if (!res.headersSent) {
      res.set('X-Response-Time', `${duration}ms`);
    }
    return originalSend.call(this, data);
  };
  
  res.json = function(data) {
    const duration = Date.now() - startTime;
    if (!res.headersSent) {
      res.set('X-Response-Time', `${duration}ms`);
    }
    return originalJson.call(this, data);
  };
  
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    
    // Log slow requests
    if (duration > 1000) {
      console.warn(`Slow request: ${req.method} ${req.path} took ${duration}ms`);
    }
    
    // Record metrics
    performanceMetrics.recordRequest(duration, false);
  });
  
  next();
}

// Static asset optimization
export function staticAssetOptimization(req: Request, res: Response, next: NextFunction) {
  // Set cache headers for static assets
  if (req.path.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/)) {
    const isImmutable = req.path.includes('/assets/') || req.path.includes('.min.');
    const maxAge = isImmutable ? 31536000 : 86400; // 1 year for immutable, 1 day for others
    
    res.set({
      'Cache-Control': `public, max-age=${maxAge}${isImmutable ? ', immutable' : ''}`,
      'Expires': new Date(Date.now() + maxAge * 1000).toUTCString()
    });
  }
  
  next();
}

// Database query optimization
export class QueryOptimizer {
  private queryCache = new Map<string, any>();
  private readonly maxQueryCacheSize = 500;

  cacheQuery(query: string, params: any[], result: any, ttl: number = 300000): void {
    const key = this.generateQueryKey(query, params);
    
    if (this.queryCache.size >= this.maxQueryCacheSize) {
      const firstKey = this.queryCache.keys().next().value;
      this.queryCache.delete(firstKey);
    }
    
    this.queryCache.set(key, {
      result,
      timestamp: Date.now(),
      ttl
    });
  }

  getCachedQuery(query: string, params: any[]): any | null {
    const key = this.generateQueryKey(query, params);
    const cached = this.queryCache.get(key);
    
    if (!cached) return null;
    
    if (Date.now() - cached.timestamp > cached.ttl) {
      this.queryCache.delete(key);
      return null;
    }
    
    return cached.result;
  }

  private generateQueryKey(query: string, params: any[]): string {
    return createHash('md5').update(query + JSON.stringify(params)).digest('hex');
  }

  invalidatePattern(pattern: string): void {
    const regex = new RegExp(pattern);
    for (const key of this.queryCache.keys()) {
      if (regex.test(key)) {
        this.queryCache.delete(key);
      }
    }
  }
}

export const queryOptimizer = new QueryOptimizer();

// CDN integration helpers
export class CDNOptimizer {
  private readonly cdnBase: string;
  private readonly enableOptimization: boolean;

  constructor() {
    this.cdnBase = process.env.CDN_BASE_URL || '';
    this.enableOptimization = process.env.NODE_ENV === 'production';
  }

  getOptimizedImageUrl(imagePath: string, options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'avif' | 'jpg' | 'png';
  } = {}): string {
    if (!this.enableOptimization || !this.cdnBase) {
      return imagePath;
    }

    const params = new URLSearchParams();
    if (options.width) params.set('w', options.width.toString());
    if (options.height) params.set('h', options.height.toString());
    if (options.quality) params.set('q', options.quality.toString());
    if (options.format) params.set('f', options.format);

    const queryString = params.toString();
    const separator = imagePath.includes('?') ? '&' : '?';
    
    return `${this.cdnBase}${imagePath}${queryString ? separator + queryString : ''}`;
  }

  generateResponsiveImageSrcSet(imagePath: string, sizes: number[] = [320, 640, 960, 1280]): string {
    return sizes
      .map(size => `${this.getOptimizedImageUrl(imagePath, { width: size, quality: 85 })} ${size}w`)
      .join(', ');
  }

  preloadCriticalResources(): string[] {
    return [
      '/css/critical.css',
      '/js/critical.js',
      '/fonts/inter-var.woff2'
    ].map(path => this.cdnBase + path);
  }
}

export const cdnOptimizer = new CDNOptimizer();

// Resource hints for browser optimization
export function generateResourceHints(): string {
  const hints = [
    '<link rel="dns-prefetch" href="//fonts.googleapis.com">',
    '<link rel="dns-prefetch" href="//api.openai.com">',
    '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
    '<link rel="prefetch" href="/api/jargon/popular">',
    '<link rel="prefetch" href="/api/attorneys/featured">'
  ];

  if (process.env.CDN_BASE_URL) {
    hints.unshift(`<link rel="dns-prefetch" href="${process.env.CDN_BASE_URL}">`);
    hints.unshift(`<link rel="preconnect" href="${process.env.CDN_BASE_URL}" crossorigin>`);
  }

  return hints.join('\n');
}

// Performance metrics collection
export class PerformanceMetrics {
  private metrics = {
    requests: 0,
    cacheHits: 0,
    cacheMisses: 0,
    averageResponseTime: 0,
    slowRequests: 0,
    totalResponseTime: 0
  };

  recordRequest(duration: number, cacheHit: boolean = false): void {
    this.metrics.requests++;
    this.metrics.totalResponseTime += duration;
    this.metrics.averageResponseTime = this.metrics.totalResponseTime / this.metrics.requests;
    
    if (cacheHit) {
      this.metrics.cacheHits++;
    } else {
      this.metrics.cacheMisses++;
    }
    
    if (duration > 1000) {
      this.metrics.slowRequests++;
    }
  }

  getMetrics() {
    return {
      ...this.metrics,
      cacheHitRate: this.metrics.requests > 0 ? 
        (this.metrics.cacheHits / this.metrics.requests) * 100 : 0,
      slowRequestRate: this.metrics.requests > 0 ? 
        (this.metrics.slowRequests / this.metrics.requests) * 100 : 0
    };
  }

  reset(): void {
    this.metrics = {
      requests: 0,
      cacheHits: 0,
      cacheMisses: 0,
      averageResponseTime: 0,
      slowRequests: 0,
      totalResponseTime: 0
    };
  }
}

export const performanceMetrics = new PerformanceMetrics();