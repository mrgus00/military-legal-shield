# Cloudflare CDN Setup Guide for Military Legal Shield

## Overview

This guide provides step-by-step instructions for configuring Cloudflare as a CDN for the Military Legal Shield platform, optimizing performance, security, and global content delivery.

## Prerequisites

- Cloudflare account with your domain added
- Access to DNS management
- Cloudflare API token with appropriate permissions

## Initial Setup

### 1. Domain Configuration

1. **Add Domain to Cloudflare**
   - Log into Cloudflare dashboard
   - Click "Add a Site"
   - Enter your domain: `militarylegalshield.com`
   - Select appropriate plan (Pro recommended for image optimization)

2. **Update Nameservers**
   ```
   Replace your current nameservers with Cloudflare's:
   - amber.ns.cloudflare.com
   - cruz.ns.cloudflare.com
   ```

3. **SSL/TLS Configuration**
   - Navigate to SSL/TLS > Overview
   - Set encryption mode to "Full (strict)"
   - Enable "Always Use HTTPS"
   - Enable "Automatic HTTPS Rewrites"

### 2. DNS Records Setup

Configure the following DNS records:

```
Type    Name    Content                 Proxy Status
A       @       YOUR_SERVER_IP         Proxied (Orange Cloud)
A       www     YOUR_SERVER_IP         Proxied (Orange Cloud)
CNAME   cdn     militarylegalshield.com Proxied (Orange Cloud)
CNAME   api     militarylegalshield.com Proxied (Orange Cloud)
```

### 3. Page Rules Configuration

Create these page rules for optimal caching:

#### Rule 1: Static Assets (Order: 1)
```
URL Pattern: *militarylegalshield.com/assets/*
Settings:
- Cache Level: Cache Everything
- Edge Cache TTL: 1 year
- Browser Cache TTL: 1 year
```

#### Rule 2: Images (Order: 2)
```
URL Pattern: *militarylegalshield.com/images/*
Settings:
- Cache Level: Cache Everything
- Edge Cache TTL: 1 year
- Browser Cache TTL: 1 year
```

#### Rule 3: API Routes (Order: 3)
```
URL Pattern: *militarylegalshield.com/api/*
Settings:
- Cache Level: Bypass
```

#### Rule 4: HTML Pages (Order: 4)
```
URL Pattern: *militarylegalshield.com/*
Settings:
- Cache Level: Standard
- Edge Cache TTL: 4 hours
- Browser Cache TTL: 4 hours
```

## Performance Optimization

### 1. Speed Settings

Navigate to Speed > Optimization:

- **Auto Minify**: Enable CSS, HTML, JavaScript
- **Brotli**: Enable
- **Early Hints**: Enable
- **HTTP/2**: Enable (automatic)
- **HTTP/3 (with QUIC)**: Enable
- **0-RTT Connection Resumption**: Enable

### 2. Caching Configuration

Navigate to Caching > Configuration:

- **Caching Level**: Standard
- **Browser Cache TTL**: 4 hours
- **Always Online**: Enable
- **Development Mode**: Disable (for production)

### 3. Image Optimization (Pro+ Plans)

Navigate to Speed > Optimization > Image Resizing:

- **Polish**: Lossy
- **WebP**: Enable
- **AVIF**: Enable (if available)

## Security Configuration

### 1. Security Level

Navigate to Security > Settings:

- **Security Level**: Medium
- **Challenge Passage**: 30 minutes
- **Browser Integrity Check**: Enable

### 2. Bot Fight Mode

Navigate to Security > Bots:

- **Bot Fight Mode**: Enable
- **Super Bot Fight Mode**: Enable (Pro+ plans)

### 3. Rate Limiting

Create rate limiting rules:

#### API Protection
```
Rule Name: API Rate Limit
Expression: (http.request.uri.path matches "^/api/")
Rate: 100 requests per minute per IP
Action: Challenge
```

#### Emergency Endpoint Protection
```
Rule Name: Emergency Rate Limit
Expression: (http.request.uri.path matches "^/api/emergency-consultation")
Rate: 5 requests per minute per IP
Action: Block
```

### 4. Firewall Rules

#### Block Known Attack Patterns
```
Rule Name: Block SQL Injection
Expression: (http.request.uri.query contains "union select" or http.request.body contains "union select")
Action: Block
```

#### Geographic Restrictions (Optional)
```
Rule Name: Allow US Military Bases
Expression: (ip.geoip.country ne "US" and not ip.geoip.is_in_european_union)
Action: Challenge
```

## Environment Variables

Set these environment variables in your application:

```bash
# Cloudflare Configuration
CLOUDFLARE_ZONE_ID=your_zone_id_here
CLOUDFLARE_API_TOKEN=your_api_token_here
CDN_DOMAIN=cdn.militarylegalshield.com

# Optional: Cloudflare Analytics
CLOUDFLARE_EMAIL=your_email@example.com
```

### Getting Cloudflare Credentials

1. **Zone ID**: Found in the right sidebar of your domain overview
2. **API Token**: 
   - Go to "My Profile" > "API Tokens"
   - Create token with permissions:
     - Zone:Zone Settings:Edit
     - Zone:Zone:Read
     - Zone:Cache Purge:Edit

## Advanced Features

### 1. Workers (Optional)

Deploy Cloudflare Workers for advanced logic:

```javascript
// Example: Emergency Request Prioritization
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  
  // Priority routing for emergency requests
  if (url.pathname.includes('/api/emergency-consultation')) {
    const response = await fetch(request, {
      cf: {
        cacheEverything: false,
        cacheTtl: 0
      }
    })
    return response
  }
  
  return fetch(request)
}
```

### 2. Load Balancing

Configure load balancing for high availability:

1. Navigate to Traffic > Load Balancing
2. Create origin pools for your servers
3. Set up health checks
4. Configure geographic steering

### 3. Argo Smart Routing

Enable Argo for improved routing:

- Navigate to Speed > Argo
- Enable Argo Smart Routing
- Monitor performance improvements

## Monitoring and Analytics

### 1. Analytics Dashboard

Monitor performance in Cloudflare Analytics:

- **Traffic**: Requests, bandwidth, unique visitors
- **Security**: Threats blocked, challenges served
- **Performance**: Response time, cache ratio
- **Reliability**: Uptime, error rate

### 2. Real User Monitoring (RUM)

Enable RUM for detailed performance insights:

- Navigate to Speed > Real User Monitoring
- Add RUM script to your pages
- Monitor Core Web Vitals

### 3. Log Analysis

Configure log delivery for detailed analysis:

- Navigate to Analytics > Logs
- Set up Logpush to your preferred destination
- Analyze traffic patterns and security events

## Testing and Validation

### 1. Performance Testing

Use these tools to validate CDN performance:

```bash
# Test cache headers
curl -I https://militarylegalshield.com/assets/css/main.css

# Test image optimization
curl -H "Accept: image/webp" https://militarylegalshield.com/images/logo.png

# Test API response times
curl -w "@curl-format.txt" https://militarylegalshield.com/api/health
```

### 2. Security Testing

Validate security configuration:

```bash
# Test rate limiting
for i in {1..150}; do curl https://militarylegalshield.com/api/health; done

# Test firewall rules
curl "https://militarylegalshield.com/?test=union%20select"
```

### 3. Global Performance Testing

Test from multiple locations:

- Use tools like GTmetrix, WebPageTest
- Test from different geographic regions
- Validate CDN edge server responses

## Troubleshooting

### Common Issues

1. **504 Gateway Timeout**
   - Check origin server health
   - Verify DNS settings
   - Review firewall rules

2. **Slow TTFB (Time to First Byte)**
   - Enable Argo Smart Routing
   - Optimize origin server
   - Review caching configuration

3. **Mixed Content Warnings**
   - Enable "Automatic HTTPS Rewrites"
   - Update hardcoded HTTP links
   - Use relative URLs for assets

### Cache Purging

Purge cache when deploying updates:

```bash
# Purge specific URLs
curl -X POST "https://api.cloudflare.com/client/v4/zones/{zone_id}/purge_cache" \
  -H "Authorization: Bearer {api_token}" \
  -H "Content-Type: application/json" \
  --data '{"files":["https://militarylegalshield.com/assets/css/main.css"]}'

# Purge everything (use sparingly)
curl -X POST "https://api.cloudflare.com/client/v4/zones/{zone_id}/purge_cache" \
  -H "Authorization: Bearer {api_token}" \
  -H "Content-Type: application/json" \
  --data '{"purge_everything":true}'
```

## Best Practices

### 1. Development Workflow

- Use development mode during active development
- Test changes in staging environment
- Gradually roll out configuration changes

### 2. Cache Strategy

- Cache static assets aggressively (1 year)
- Cache HTML moderately (4 hours)
- Never cache API responses with sensitive data
- Use cache tags for selective purging

### 3. Security

- Regular review of firewall rules
- Monitor security events
- Keep SSL certificates updated
- Use strong CSP headers

### 4. Performance

- Monitor Core Web Vitals
- Optimize image sizes and formats
- Use HTTP/2 server push for critical resources
- Implement proper preload headers

## Maintenance

### Monthly Tasks

- Review analytics and performance metrics
- Update firewall rules based on threat patterns
- Check SSL certificate expiration
- Review and optimize cache hit ratios

### Quarterly Tasks

- Security audit of all configurations
- Performance benchmarking
- Review and update page rules
- Evaluate new Cloudflare features

This configuration provides enterprise-grade CDN performance, security, and reliability for the Military Legal Shield platform while maintaining optimal user experience for service members worldwide.