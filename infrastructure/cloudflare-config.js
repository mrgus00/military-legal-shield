// CloudFlare CDN Configuration for militarylegalshield.com
// Production-optimized caching and security rules

const CLOUDFLARE_CONFIG = {
  // Zone configuration
  zone: {
    name: "militarylegalshield.com",
    plan: "pro", // Recommended for production
    type: "full"
  },

  // DNS records to create via API
  dnsRecords: [
    {
      type: "A",
      name: "@",
      content: "YOUR_SERVER_IP",
      ttl: 300,
      proxied: true
    },
    {
      type: "A", 
      name: "www",
      content: "YOUR_SERVER_IP",
      ttl: 300,
      proxied: true
    },
    {
      type: "CNAME",
      name: "api",
      content: "militarylegalshield.com",
      ttl: 300,
      proxied: true
    },
    {
      type: "TXT",
      name: "@",
      content: "militarylegalshield-domain-verification=Q85aT0P23qZ2zCKZHOIHSzE6ve727hMw5mBqlsect6k",
      ttl: 300,
      proxied: false
    }
  ],

  // SSL/TLS Configuration
  ssl: {
    mode: "full_strict",
    always_use_https: true,
    automatic_https_rewrites: true,
    min_tls_version: "1.2",
    tls_1_3: "on",
    http_strict_transport_security: {
      enabled: true,
      max_age: 31536000,
      include_subdomains: true,
      preload: true
    }
  },

  // Security settings for military compliance
  security: {
    security_level: "medium",
    challenge_ttl: 1800,
    browser_integrity_check: true,
    hotlink_protection: true,
    server_side_exclude: true,
    privacy_pass: true,
    ip_geolocation: true
  },

  // Page Rules for performance optimization
  pageRules: [
    {
      targets: ["militarylegalshield.com/api/*"],
      actions: {
        cache_level: "bypass",
        security_level: "high"
      }
    },
    {
      targets: ["militarylegalshield.com/sw.js"],
      actions: {
        cache_level: "bypass",
        edge_cache_ttl: 0
      }
    },
    {
      targets: ["militarylegalshield.com/manifest.json"],
      actions: {
        cache_level: "cache_everything",
        edge_cache_ttl: 86400,
        browser_cache_ttl: 86400
      }
    },
    {
      targets: ["militarylegalshield.com/*.js", "militarylegalshield.com/*.css"],
      actions: {
        cache_level: "cache_everything",
        edge_cache_ttl: 2592000,
        browser_cache_ttl: 2592000
      }
    },
    {
      targets: ["militarylegalshield.com/*.png", "militarylegalshield.com/*.jpg", "militarylegalshield.com/*.svg"],
      actions: {
        cache_level: "cache_everything",
        edge_cache_ttl: 2592000,
        browser_cache_ttl: 2592000
      }
    }
  ],

  // Caching configuration
  caching: {
    caching_level: "aggressive",
    browser_cache_ttl: 14400, // 4 hours
    development_mode: false,
    query_string_sort: true,
    always_online: true,
    opportunistic_encryption: true
  },

  // Performance optimizations
  performance: {
    brotli: true,
    minify: {
      css: true,
      html: true,
      js: true
    },
    mirage: true,
    polish: "lossless",
    webp: true,
    early_hints: true,
    http2_prioritization: true
  },

  // Network settings
  network: {
    http2: "on",
    http3: "on",
    zero_rtt: "on",
    ipv6: "on",
    websocket: "on",
    pseudo_ipv4: "off"
  },

  // Firewall rules for enhanced security
  firewallRules: [
    {
      description: "Block malicious countries",
      expression: '(ip.geoip.country in {"CN" "RU" "KP"})',
      action: "challenge"
    },
    {
      description: "Rate limit API endpoints", 
      expression: '(http.request.uri.path matches "/api/.*")',
      action: "managed_challenge",
      rateLimit: {
        threshold: 100,
        period: 60
      }
    },
    {
      description: "Block known bad user agents",
      expression: '(http.user_agent contains "bot" and not http.user_agent contains "googlebot")',
      action: "block"
    }
  ],

  // Workers for advanced functionality
  workers: [
    {
      name: "security-headers",
      script: `
        addEventListener('fetch', event => {
          event.respondWith(handleRequest(event.request))
        })

        async function handleRequest(request) {
          const response = await fetch(request)
          const newResponse = new Response(response.body, response)
          
          // Add security headers
          newResponse.headers.set('X-Frame-Options', 'DENY')
          newResponse.headers.set('X-Content-Type-Options', 'nosniff')
          newResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
          newResponse.headers.set('Permissions-Policy', 'geolocation=(self), microphone=(), camera=()')
          
          return newResponse
        }
      `,
      routes: ["militarylegalshield.com/*"]
    }
  ],

  // Analytics and monitoring
  analytics: {
    web_analytics: true,
    bot_management: true,
    logpush: true
  }
};

// CloudFlare API management functions
class CloudFlareManager {
  constructor(apiToken, zoneId) {
    this.apiToken = apiToken;
    this.zoneId = zoneId;
    this.baseUrl = 'https://api.cloudflare.com/client/v4';
  }

  async makeRequest(endpoint, method = 'GET', data = null) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method,
      headers: {
        'Authorization': `Bearer ${this.apiToken}`,
        'Content-Type': 'application/json'
      },
      body: data ? JSON.stringify(data) : null
    });

    return response.json();
  }

  async setupDNS() {
    console.log('Setting up DNS records...');
    
    for (const record of CLOUDFLARE_CONFIG.dnsRecords) {
      await this.makeRequest(`/zones/${this.zoneId}/dns_records`, 'POST', record);
    }
  }

  async configureSSL() {
    console.log('Configuring SSL settings...');
    
    await this.makeRequest(`/zones/${this.zoneId}/settings/ssl`, 'PATCH', {
      value: CLOUDFLARE_CONFIG.ssl.mode
    });

    await this.makeRequest(`/zones/${this.zoneId}/settings/always_use_https`, 'PATCH', {
      value: CLOUDFLARE_CONFIG.ssl.always_use_https ? 'on' : 'off'
    });
  }

  async setupPageRules() {
    console.log('Creating page rules...');
    
    for (const rule of CLOUDFLARE_CONFIG.pageRules) {
      await this.makeRequest(`/zones/${this.zoneId}/pagerules`, 'POST', rule);
    }
  }

  async configureFirewall() {
    console.log('Setting up firewall rules...');
    
    for (const rule of CLOUDFLARE_CONFIG.firewallRules) {
      await this.makeRequest(`/zones/${this.zoneId}/firewall/rules`, 'POST', rule);
    }
  }

  async purgeCache() {
    console.log('Purging cache...');
    
    return await this.makeRequest(`/zones/${this.zoneId}/purge_cache`, 'POST', {
      purge_everything: true
    });
  }

  async getAnalytics(since = '-7d') {
    return await this.makeRequest(`/zones/${this.zoneId}/analytics/dashboard?since=${since}`);
  }
}

// Export configuration
module.exports = {
  CLOUDFLARE_CONFIG,
  CloudFlareManager
};

// Usage example:
// const cf = new CloudFlareManager('your-api-token', 'your-zone-id');
// await cf.setupDNS();
// await cf.configureSSL();
// await cf.setupPageRules();
// await cf.configureFirewall();