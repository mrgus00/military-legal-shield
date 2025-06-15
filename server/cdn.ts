import path from 'path';
import fs from 'fs';

export interface CDNConfig {
  cloudflareZoneId?: string;
  cloudflareApiToken?: string;
  cdnDomain?: string;
  enableOptimization: boolean;
  cacheHeaders: Record<string, string>;
}

export class CDNService {
  private config: CDNConfig;

  constructor(config: CDNConfig) {
    this.config = config;
  }

  // Generate optimized URLs for static assets
  getAssetUrl(assetPath: string): string {
    if (this.config.cdnDomain) {
      // Use CDN domain for static assets
      return `https://${this.config.cdnDomain}${assetPath}`;
    }
    return assetPath;
  }

  // Generate responsive image URLs with Cloudflare Image Resizing
  getResponsiveImageUrl(imagePath: string, options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'jpeg' | 'png' | 'avif';
  } = {}): string {
    if (!this.config.cdnDomain) {
      return imagePath;
    }

    const params = new URLSearchParams();
    if (options.width) params.append('width', options.width.toString());
    if (options.height) params.append('height', options.height.toString());
    if (options.quality) params.append('quality', options.quality.toString());
    if (options.format) params.append('format', options.format);

    const queryString = params.toString() ? `?${params.toString()}` : '';
    return `https://${this.config.cdnDomain}/cdn-cgi/image/${queryString}${imagePath}`;
  }

  // Get cache headers for different file types
  getCacheHeaders(filePath: string): Record<string, string> {
    const ext = path.extname(filePath).toLowerCase();
    const defaultHeaders = {
      'Cache-Control': 'public, max-age=31536000', // 1 year
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block'
    };

    switch (ext) {
      case '.html':
        return {
          ...defaultHeaders,
          'Cache-Control': 'public, max-age=3600', // 1 hour for HTML
        };
      case '.css':
      case '.js':
        return {
          ...defaultHeaders,
          'Cache-Control': 'public, max-age=31536000, immutable', // 1 year for versioned assets
        };
      case '.jpg':
      case '.jpeg':
      case '.png':
      case '.webp':
      case '.avif':
      case '.svg':
        return {
          ...defaultHeaders,
          'Cache-Control': 'public, max-age=31536000', // 1 year for images
        };
      case '.woff':
      case '.woff2':
      case '.ttf':
      case '.eot':
        return {
          ...defaultHeaders,
          'Cache-Control': 'public, max-age=31536000', // 1 year for fonts
          'Access-Control-Allow-Origin': '*',
        };
      default:
        return {
          ...defaultHeaders,
          'Cache-Control': 'public, max-age=86400', // 1 day default
        };
    }
  }

  // Purge Cloudflare cache for specific URLs
  async purgeCache(urls: string[]): Promise<boolean> {
    if (!this.config.cloudflareZoneId || !this.config.cloudflareApiToken) {
      console.log('Cloudflare credentials not configured, skipping cache purge');
      return false;
    }

    try {
      const response = await fetch(
        `https://api.cloudflare.com/client/v4/zones/${this.config.cloudflareZoneId}/purge_cache`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.config.cloudflareApiToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ files: urls }),
        }
      );

      if (response.ok) {
        console.log(`Cache purged for ${urls.length} URLs`);
        return true;
      } else {
        console.error('Failed to purge cache:', await response.text());
        return false;
      }
    } catch (error) {
      console.error('Cache purge error:', error);
      return false;
    }
  }

  // Preload critical resources
  generatePreloadHeaders(criticalResources: string[]): string {
    return criticalResources
      .map(resource => {
        const ext = path.extname(resource).toLowerCase();
        let type = 'fetch';
        
        if (['.css'].includes(ext)) type = 'style';
        else if (['.js'].includes(ext)) type = 'script';
        else if (['.woff', '.woff2'].includes(ext)) type = 'font';
        else if (['.jpg', '.jpeg', '.png', '.webp', '.avif'].includes(ext)) type = 'image';

        const url = this.getAssetUrl(resource);
        return `<${url}>; rel=preload; as=${type}${type === 'font' ? '; crossorigin' : ''}`;
      })
      .join(', ');
  }

  // Generate CSP headers with CDN domains
  generateCSPHeader(): string {
    const cdnDomain = this.config.cdnDomain || "'self'";
    
    return [
      "default-src 'self'",
      `script-src 'self' 'unsafe-inline' 'unsafe-eval' ${cdnDomain} https://js.stripe.com https://cdn.jsdelivr.net`,
      `style-src 'self' 'unsafe-inline' ${cdnDomain} https://fonts.googleapis.com`,
      `img-src 'self' data: blob: ${cdnDomain} https://images.unsplash.com`,
      `font-src 'self' ${cdnDomain} https://fonts.gstatic.com`,
      `connect-src 'self' ${cdnDomain} https://api.stripe.com wss: ws:`,
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests"
    ].join('; ');
  }
}

// Initialize CDN service with environment configuration
export const cdnService = new CDNService({
  cloudflareZoneId: process.env.CLOUDFLARE_ZONE_ID,
  cloudflareApiToken: process.env.CLOUDFLARE_API_TOKEN,
  cdnDomain: process.env.CDN_DOMAIN,
  enableOptimization: process.env.NODE_ENV === 'production',
  cacheHeaders: {}
});

// Middleware for setting cache headers
export function cacheMiddleware(req: any, res: any, next: any) {
  const filePath = req.path;
  const headers = cdnService.getCacheHeaders(filePath);
  
  Object.entries(headers).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  // Add preload headers for critical resources
  if (filePath === '/' || filePath === '/index.html') {
    const criticalResources = [
      '/assets/css/main.css',
      '/assets/js/app.js',
      '/assets/fonts/inter-var.woff2'
    ];
    
    const preloadHeader = cdnService.generatePreloadHeaders(criticalResources);
    if (preloadHeader) {
      res.setHeader('Link', preloadHeader);
    }
  }

  // Add CSP header
  res.setHeader('Content-Security-Policy', cdnService.generateCSPHeader());

  next();
}