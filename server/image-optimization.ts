import { Request, Response, NextFunction } from 'express';
import { createHash } from 'crypto';
import path from 'path';

export interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'avif' | 'jpg' | 'png' | 'auto';
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
  progressive?: boolean;
  blur?: number;
}

export class ImageOptimizer {
  private cache = new Map<string, Buffer>();
  private readonly maxCacheSize = 100 * 1024 * 1024; // 100MB cache limit
  private currentCacheSize = 0;

  constructor() {
    // Clean cache every hour
    setInterval(() => this.cleanCache(), 60 * 60 * 1000);
  }

  generateCacheKey(imagePath: string, options: ImageOptimizationOptions): string {
    return createHash('md5').update(imagePath + JSON.stringify(options)).digest('hex');
  }

  async optimizeImage(imagePath: string, options: ImageOptimizationOptions = {}): Promise<{
    buffer: Buffer;
    contentType: string;
    cacheKey: string;
  }> {
    const cacheKey = this.generateCacheKey(imagePath, options);
    
    // Check cache first
    const cached = this.cache.get(cacheKey);
    if (cached) {
      return {
        buffer: cached,
        contentType: this.getContentType(options.format || 'jpg'),
        cacheKey
      };
    }

    // For demo purposes, we'll return a placeholder
    // In production, you'd use Sharp or similar for actual image processing
    const placeholderSvg = this.generatePlaceholderSvg(
      options.width || 800,
      options.height || 600,
      imagePath
    );
    
    const buffer = Buffer.from(placeholderSvg);
    
    // Cache the result
    this.addToCache(cacheKey, buffer);
    
    return {
      buffer,
      contentType: 'image/svg+xml',
      cacheKey
    };
  }

  private generatePlaceholderSvg(width: number, height: number, imagePath: string): string {
    const fileName = path.basename(imagePath);
    return `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f3f4f6"/>
        <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="16" 
              fill="#6b7280" text-anchor="middle" dominant-baseline="middle">
          ${fileName} (${width}x${height})
        </text>
      </svg>
    `;
  }

  private addToCache(key: string, buffer: Buffer): void {
    const size = buffer.length;
    
    // Check if adding this would exceed cache limit
    if (this.currentCacheSize + size > this.maxCacheSize) {
      this.cleanCache();
    }
    
    this.cache.set(key, buffer);
    this.currentCacheSize += size;
  }

  private cleanCache(): void {
    // Simple LRU-like cleanup - remove all entries
    // In production, you'd implement proper LRU eviction
    this.cache.clear();
    this.currentCacheSize = 0;
  }

  private getContentType(format: string): string {
    const types: Record<string, string> = {
      'webp': 'image/webp',
      'avif': 'image/avif',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'svg': 'image/svg+xml'
    };
    return types[format] || 'image/jpeg';
  }

  generateResponsiveImageHTML(src: string, alt: string, options: {
    sizes?: string;
    widths?: number[];
    loading?: 'lazy' | 'eager';
    className?: string;
  } = {}): string {
    const {
      sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
      widths = [320, 640, 960, 1280],
      loading = 'lazy',
      className = ''
    } = options;

    const srcSet = widths
      .map(width => `/api/images/optimize?src=${encodeURIComponent(src)}&w=${width}&q=85 ${width}w`)
      .join(', ');

    const optimizedSrc = `/api/images/optimize?src=${encodeURIComponent(src)}&w=${widths[widths.length - 1]}&q=85`;

    return `
      <img 
        src="${optimizedSrc}"
        srcset="${srcSet}"
        sizes="${sizes}"
        alt="${alt}"
        loading="${loading}"
        ${className ? `class="${className}"` : ''}
        style="width: 100%; height: auto;"
      />
    `;
  }

  generateWebPWithFallback(src: string, alt: string, options: ImageOptimizationOptions = {}): string {
    const webpSrc = `/api/images/optimize?src=${encodeURIComponent(src)}&f=webp&w=${options.width || 800}&q=${options.quality || 85}`;
    const jpgSrc = `/api/images/optimize?src=${encodeURIComponent(src)}&f=jpg&w=${options.width || 800}&q=${options.quality || 85}`;

    return `
      <picture>
        <source srcset="${webpSrc}" type="image/webp">
        <img src="${jpgSrc}" alt="${alt}" loading="lazy" style="width: 100%; height: auto;">
      </picture>
    `;
  }

  getCacheStats() {
    return {
      entries: this.cache.size,
      sizeBytes: this.currentCacheSize,
      sizeMB: Math.round(this.currentCacheSize / (1024 * 1024) * 100) / 100,
      maxSizeMB: this.maxCacheSize / (1024 * 1024)
    };
  }
}

export const imageOptimizer = new ImageOptimizer();

// Middleware for image optimization API
export function imageOptimizationMiddleware(req: Request, res: Response, next: NextFunction) {
  if (!req.path.startsWith('/api/images/optimize')) {
    return next();
  }

  const { src, w, h, q, f, fit } = req.query;
  
  if (!src || typeof src !== 'string') {
    return res.status(400).json({ error: 'Missing src parameter' });
  }

  const options: ImageOptimizationOptions = {
    width: w ? parseInt(w as string) : undefined,
    height: h ? parseInt(h as string) : undefined,
    quality: q ? parseInt(q as string) : 85,
    format: (f as any) || 'auto',
    fit: (fit as any) || 'cover'
  };

  imageOptimizer.optimizeImage(src, options)
    .then(({ buffer, contentType, cacheKey }) => {
      // Set cache headers
      res.set({
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'ETag': cacheKey,
        'X-Image-Cache': 'HIT'
      });

      res.send(buffer);
    })
    .catch(error => {
      console.error('Image optimization error:', error);
      res.status(500).json({ error: 'Image optimization failed' });
    });
}

// Critical resource preloader
export class CriticalResourcePreloader {
  private criticalImages: string[] = [
    '/images/logo.png',
    '/images/hero-background.jpg',
    '/images/military-branches.png'
  ];

  private criticalCSS = [
    '/css/critical.css',
    '/css/fonts.css'
  ];

  private criticalJS = [
    '/js/critical.js'
  ];

  generatePreloadTags(): string {
    const imagePreloads = this.criticalImages.map(img => 
      `<link rel="preload" as="image" href="${img}" />`
    ).join('\n');

    const cssPreloads = this.criticalCSS.map(css => 
      `<link rel="preload" as="style" href="${css}" />`
    ).join('\n');

    const jsPreloads = this.criticalJS.map(js => 
      `<link rel="preload" as="script" href="${js}" />`
    ).join('\n');

    return [imagePreloads, cssPreloads, jsPreloads].join('\n');
  }

  generateCriticalCSS(): string {
    // In production, this would contain actual critical CSS
    return `
      /* Critical CSS for above-the-fold content */
      body { font-family: Inter, sans-serif; margin: 0; }
      .hero { min-height: 50vh; background: linear-gradient(135deg, #1e3a8a, #3b82f6); }
      .loading { display: flex; justify-content: center; align-items: center; height: 100vh; }
      .nav { position: fixed; top: 0; width: 100%; background: rgba(255,255,255,0.95); backdrop-filter: blur(10px); }
    `;
  }
}

export const criticalResourcePreloader = new CriticalResourcePreloader();

// Image format detection and optimization
export class ImageFormatOptimizer {
  private supportedFormats = {
    webp: 'image/webp',
    avif: 'image/avif',
    jpg: 'image/jpeg',
    png: 'image/png'
  };

  detectOptimalFormat(userAgent: string, acceptHeader: string): string {
    // Check for AVIF support (newest, best compression)
    if (acceptHeader.includes('image/avif')) {
      return 'avif';
    }
    
    // Check for WebP support (good compression, wide support)
    if (acceptHeader.includes('image/webp')) {
      return 'webp';
    }
    
    // Fallback to JPEG
    return 'jpg';
  }

  generateOptimizedImageUrl(originalUrl: string, req: Request, options: ImageOptimizationOptions = {}): string {
    const format = options.format === 'auto' 
      ? this.detectOptimalFormat(req.headers['user-agent'] || '', req.headers.accept || '')
      : options.format || 'jpg';

    const params = new URLSearchParams({
      src: originalUrl,
      f: format,
      w: (options.width || 800).toString(),
      h: (options.height || 600).toString(),
      q: (options.quality || 85).toString()
    });

    return `/api/images/optimize?${params.toString()}`;
  }
}

export const imageFormatOptimizer = new ImageFormatOptimizer();