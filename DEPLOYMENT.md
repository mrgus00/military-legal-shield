# Deployment Guide - Military Legal Shield Platform

This guide provides comprehensive instructions for deploying the Military Legal Shield platform to production environments.

## Overview

The Military Legal Shield platform is designed for enterprise-grade deployment with high availability, security, and global accessibility for military personnel.

## Deployment Options

### 1. Replit Deployment (Recommended for Development)
- **Best for**: Development, testing, and small-scale deployments
- **Features**: Automatic SSL, built-in monitoring, easy scaling
- **Limitations**: Shared resources, limited customization

### 2. Cloud Provider Deployment
- **Best for**: Production environments requiring full control
- **Options**: AWS, Google Cloud, Azure, DigitalOcean
- **Features**: Full control, advanced scaling, custom configurations

### 3. On-Premises Deployment
- **Best for**: Organizations with strict security requirements
- **Features**: Complete control, custom security configurations
- **Requirements**: Dedicated infrastructure team

## Pre-Deployment Checklist

### Environment Requirements
- [ ] Node.js 18+ runtime environment
- [ ] PostgreSQL 14+ database
- [ ] SSL certificates configured
- [ ] Domain name and DNS configuration
- [ ] Content Delivery Network (CDN) setup
- [ ] Monitoring and logging systems

### Security Requirements
- [ ] Environment variables properly secured
- [ ] Database access restricted to application only
- [ ] API keys stored in secure key management system
- [ ] Regular security updates scheduled
- [ ] Backup and disaster recovery plan implemented

### Accessibility Verification
- [ ] WCAG 2.1 AA compliance tested
- [ ] Mobile responsiveness verified
- [ ] Screen reader compatibility confirmed
- [ ] Keyboard navigation validated
- [ ] Performance on assistive technologies tested

## Environment Configuration

### Required Environment Variables

```bash
# Database Configuration
DATABASE_URL=postgresql://user:password@host:port/database
PGHOST=your_postgres_host
PGPORT=5432
PGUSER=your_postgres_user
PGPASSWORD=your_postgres_password
PGDATABASE=military_legal_shield

# Application Security
SESSION_SECRET=your_32_character_session_secret
NODE_ENV=production

# External Services
OPENAI_API_KEY=your_openai_api_key
STRIPE_SECRET_KEY=your_stripe_secret_key
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# CDN and Performance
CLOUDFLARE_ZONE_ID=your_cloudflare_zone_id
CLOUDFLARE_API_TOKEN=your_cloudflare_api_token
CDN_DOMAIN=cdn.militarylegalshield.com

# Monitoring and Logging
LOG_LEVEL=info
SENTRY_DSN=your_sentry_dsn
ANALYTICS_ID=your_analytics_id

# Domain Configuration
DOMAIN=militarylegalshield.com
REPLIT_DOMAINS=militarylegalshield.com,www.militarylegalshield.com
```

### Optional Configuration

```bash
# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# File Upload Limits
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=pdf,doc,docx,txt

# Email Configuration
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password

# Cache Configuration
REDIS_URL=redis://user:password@host:port
CACHE_TTL=3600
```

## Replit Deployment

### Step 1: Prepare Repository
```bash
# Ensure all dependencies are listed
npm install

# Run production build test
npm run build

# Verify all tests pass
npm test
```

### Step 2: Configure Secrets
In Replit Secrets tab, add all required environment variables listed above.

### Step 3: Deploy
```bash
# Deploy to Replit
npm run deploy:replit
```

### Step 4: Custom Domain Setup
1. Configure DNS records:
   ```
   Type: CNAME
   Name: @
   Value: your-repl-name.replit.app
   
   Type: CNAME
   Name: www
   Value: your-repl-name.replit.app
   ```

2. Update Replit domain settings to use custom domain

## Cloud Provider Deployment

### AWS Deployment

#### Infrastructure Setup
```yaml
# docker-compose.yml for AWS ECS
version: '3.8'
services:
  app:
    image: military-legal-shield:latest
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
    depends_on:
      - postgres
  
  postgres:
    image: postgres:14
    environment:
      - POSTGRES_DB=military_legal_shield
      - POSTGRES_USER=${PGUSER}
      - POSTGRES_PASSWORD=${PGPASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

#### Deployment Commands
```bash
# Build Docker image
docker build -t military-legal-shield .

# Push to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 123456789012.dkr.ecr.us-east-1.amazonaws.com
docker tag military-legal-shield:latest 123456789012.dkr.ecr.us-east-1.amazonaws.com/military-legal-shield:latest
docker push 123456789012.dkr.ecr.us-east-1.amazonaws.com/military-legal-shield:latest

# Deploy with ECS
aws ecs update-service --cluster production --service military-legal-shield --force-new-deployment
```

### Google Cloud Deployment

```bash
# Build and deploy to Cloud Run
gcloud builds submit --tag gcr.io/PROJECT_ID/military-legal-shield
gcloud run deploy military-legal-shield \
  --image gcr.io/PROJECT_ID/military-legal-shield \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars DATABASE_URL=$DATABASE_URL
```

### Azure Deployment

```bash
# Deploy to Azure Container Instances
az container create \
  --resource-group military-legal-shield \
  --name military-legal-shield \
  --image military-legal-shield:latest \
  --ports 5000 \
  --environment-variables DATABASE_URL=$DATABASE_URL
```

## Database Setup

### Production Database Configuration

```sql
-- Create database and user
CREATE DATABASE military_legal_shield;
CREATE USER military_app WITH ENCRYPTED PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE military_legal_shield TO military_app;

-- Configure connection limits
ALTER USER military_app CONNECTION LIMIT 20;

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
```

### Database Migration

```bash
# Run database migrations
npm run db:push

# Seed production data (if needed)
npm run db:seed:production

# Verify database setup
npm run db:verify
```

### Backup Strategy

```bash
# Daily backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump $DATABASE_URL > backups/military_legal_shield_$DATE.sql
gzip backups/military_legal_shield_$DATE.sql

# Upload to cloud storage
aws s3 cp backups/military_legal_shield_$DATE.sql.gz s3://military-legal-shield-backups/
```

## CDN and Performance

### Cloudflare Configuration

```javascript
// cloudflare-workers.js
export default {
  async fetch(request, env) {
    // Security headers
    const securityHeaders = {
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin'
    };

    // Performance optimization
    const response = await fetch(request);
    const newResponse = new Response(response.body, response);
    
    Object.entries(securityHeaders).forEach(([key, value]) => {
      newResponse.headers.set(key, value);
    });

    return newResponse;
  }
};
```

### Caching Strategy

```nginx
# nginx.conf for reverse proxy
server {
    listen 80;
    server_name militarylegalshield.com;
    
    # Static assets
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # API routes
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_cache_bypass $http_pragma;
        proxy_cache_revalidate on;
    }
    
    # Main application
    location / {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Monitoring and Logging

### Application Monitoring

```javascript
// monitoring.js
import Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});

// Custom metrics
export const metrics = {
  legalConsultations: new Counter('legal_consultations_total'),
  attorneyMatches: new Counter('attorney_matches_total'),
  emergencyRequests: new Counter('emergency_requests_total'),
  accessibilityEvents: new Counter('accessibility_events_total')
};
```

### Health Check Endpoint

```javascript
// health.js
app.get('/health', async (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      database: await checkDatabase(),
      openai: await checkOpenAI(),
      stripe: await checkStripe(),
      twilio: await checkTwilio()
    }
  };
  
  const allHealthy = Object.values(health.services).every(s => s.status === 'healthy');
  res.status(allHealthy ? 200 : 503).json(health);
});
```

## Security Configuration

### SSL/TLS Configuration

```bash
# Generate SSL certificate with Let's Encrypt
certbot certonly --webroot -w /var/www/html -d militarylegalshield.com -d www.militarylegalshield.com

# Configure automatic renewal
echo "0 12 * * * /usr/bin/certbot renew --quiet" | crontab -
```

### Firewall Rules

```bash
# UFW configuration
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 5432/tcp  # PostgreSQL (restrict to app servers only)
ufw enable
```

### Security Headers

```javascript
// security.js
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'", "https://js.stripe.com"],
      connectSrc: ["'self'", "https://api.stripe.com"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
```

## Accessibility Verification

### Pre-Deployment Testing

```bash
# Run accessibility audit
npm run accessibility:audit

# Generate accessibility report
npm run accessibility:report

# Validate WCAG compliance
npm run wcag:validate
```

### Production Monitoring

```javascript
// accessibility-monitor.js
export function monitorAccessibility() {
  // Track accessibility metrics
  window.addEventListener('load', () => {
    // Monitor color contrast
    checkColorContrast();
    
    // Monitor keyboard navigation
    trackKeyboardUsage();
    
    // Monitor screen reader usage
    detectScreenReader();
  });
}
```

## Deployment Verification

### Post-Deployment Checklist

- [ ] Application loads correctly on production domain
- [ ] Database connections working properly
- [ ] All external API integrations functional
- [ ] SSL certificate valid and properly configured
- [ ] CDN serving static assets correctly
- [ ] Monitoring and logging systems operational
- [ ] Backup systems functioning
- [ ] Security headers properly set
- [ ] Accessibility compliance maintained
- [ ] Performance metrics within acceptable ranges

### Smoke Tests

```bash
# Automated smoke tests
npm run test:smoke:production

# Manual verification
curl -f https://militarylegalshield.com/health
curl -f https://militarylegalshield.com/api/health
```

## Troubleshooting

### Common Issues

1. **Database Connection Issues**
   ```bash
   # Check database connectivity
   psql $DATABASE_URL -c "SELECT 1;"
   
   # Verify connection pool settings
   echo "SELECT count(*) FROM pg_stat_activity;" | psql $DATABASE_URL
   ```

2. **SSL Certificate Problems**
   ```bash
   # Check certificate validity
   openssl s_client -connect militarylegalshield.com:443 -servername militarylegalshield.com
   
   # Verify certificate chain
   curl -vI https://militarylegalshield.com
   ```

3. **Performance Issues**
   ```bash
   # Monitor memory usage
   free -h
   
   # Check CPU utilization
   top -p $(pgrep -f "node")
   
   # Analyze slow queries
   SELECT query, mean_time FROM pg_stat_statements ORDER BY mean_time DESC LIMIT 10;
   ```

### Emergency Procedures

1. **Rollback Deployment**
   ```bash
   # Revert to previous deployment
   git revert HEAD
   npm run deploy:rollback
   ```

2. **Scale Up Resources**
   ```bash
   # Increase server capacity
   kubectl scale deployment military-legal-shield --replicas=5
   ```

3. **Database Recovery**
   ```bash
   # Restore from backup
   gunzip -c backups/military_legal_shield_YYYYMMDD.sql.gz | psql $DATABASE_URL
   ```

## Support Contacts

### Technical Issues
- **Primary**: devops@militarylegalshield.com
- **Emergency**: +1-800-MIL-TECH
- **Slack**: #production-support

### Security Incidents
- **Security Team**: security@militarylegalshield.com
- **Emergency Hotline**: +1-800-SEC-HELP
- **PagerDuty**: Military Legal Shield Security

### Accessibility Issues
- **Accessibility Team**: accessibility@militarylegalshield.com
- **WCAG Expert**: wcag@militarylegalshield.com

---

This deployment guide ensures the Military Legal Shield platform maintains its high standards for security, accessibility, and reliability in production environments.