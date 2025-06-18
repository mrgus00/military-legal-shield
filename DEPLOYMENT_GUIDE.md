# MilitaryLegalShield Deployment Guide

## Overview
This guide provides step-by-step instructions for deploying MilitaryLegalShield to GitHub, Supabase, and the custom domain https://militarylegalshield.com.

## Phase 1: GitHub Repository Setup

### Repository Creation
1. Create new repository on GitHub: `MilitaryLegalShield`
2. Set repository to public for open-source contributions
3. Add comprehensive README and project documentation

### Git Configuration
```bash
# Initialize git repository
git init
git branch -M main

# Add all project files
git add .
git commit -m "Initial commit: MilitaryLegalShield PWA with AI case analysis"

# Connect to GitHub repository
git remote add origin https://github.com/[username]/MilitaryLegalShield.git
git push -u origin main
```

### GitHub Actions CI/CD
Create automated deployment pipeline with security scanning and testing:

```yaml
# .github/workflows/deploy.yml
name: Deploy MilitaryLegalShield

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run test
      - run: npm run lint
      - run: npm run build

  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm audit --audit-level moderate

  deploy:
    needs: [test, security-scan]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run build
      
      - name: Deploy to Production
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
          STRIPE_SECRET_KEY: ${{ secrets.STRIPE_SECRET_KEY }}
        run: |
          echo "Deploying to production environment"
```

## Phase 2: Supabase Database Setup

### Database Migration
1. Create new Supabase project: `militarylegalshield`
2. Configure PostgreSQL database with required schemas
3. Set up Row Level Security (RLS) for military data protection

### Supabase Configuration
```sql
-- Create attorney profiles table
CREATE TABLE attorney_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  firm TEXT,
  location TEXT NOT NULL,
  specializations TEXT[] DEFAULT '{}',
  experience_years INTEGER DEFAULT 0,
  success_rate DECIMAL(5,2) DEFAULT 0.00,
  contact_info JSONB DEFAULT '{}',
  military_branches TEXT[] DEFAULT '{}',
  security_clearance TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create case analysis table
CREATE TABLE case_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  case_type TEXT NOT NULL,
  case_details JSONB NOT NULL,
  ai_analysis JSONB,
  predicted_outcomes JSONB,
  recommendations JSONB,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create military legal resources table
CREATE TABLE legal_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  military_branch TEXT,
  classification TEXT DEFAULT 'unclassified',
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE attorney_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_resources ENABLE ROW LEVEL SECURITY;

-- Create policies for secure access
CREATE POLICY "Attorney profiles are viewable by everyone" 
ON attorney_profiles FOR SELECT 
USING (true);

CREATE POLICY "Users can view their own case analyses" 
ON case_analyses FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Legal resources are viewable by authenticated users" 
ON legal_resources FOR SELECT 
TO authenticated 
USING (true);
```

### Environment Variables Setup
```bash
# Production environment variables for Supabase
DATABASE_URL="postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres"
SUPABASE_URL="https://[project-ref].supabase.co"
SUPABASE_ANON_KEY="[your-anon-key]"
SUPABASE_SERVICE_ROLE_KEY="[your-service-role-key]"
```

## Phase 3: Custom Domain Configuration

### DNS Configuration for militarylegalshield.com
Configure DNS records with your domain registrar:

```
# A Records
@ (root domain) → [Server IP Address]
www → [Server IP Address]

# CNAME Records (if using CDN)
@ → militarylegalshield.netlify.app
www → militarylegalshield.netlify.app

# MX Records (for email)
@ → mail.militarylegalshield.com (Priority: 10)

# TXT Records
@ → "v=spf1 include:_spf.google.com ~all"
_dmarc → "v=DMARC1; p=none; rua=mailto:dmarc@militarylegalshield.com"

# Security Headers
@ → "militarylegalshield-site-verification=Q85aT0P23qZ2zCKZHOIHSzE6ve727hMw5mBqlsect6k"
```

### SSL Certificate Configuration
```nginx
# nginx configuration for militarylegalshield.com
server {
    listen 443 ssl http2;
    server_name militarylegalshield.com www.militarylegalshield.com;

    ssl_certificate /etc/letsencrypt/live/militarylegalshield.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/militarylegalshield.com/privkey.pem;
    
    # Security headers for military compliance
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options DENY always;
    add_header X-Content-Type-Options nosniff always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';" always;

    location / {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name militarylegalshield.com www.militarylegalshield.com;
    return 301 https://$server_name$request_uri;
}
```

## Phase 4: Production Environment Setup

### Docker Configuration
```dockerfile
# Dockerfile for production deployment
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM node:20-alpine AS production

WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./server
COPY --from=builder /app/shared ./shared
COPY --from=builder /app/package.json ./

EXPOSE 5000

CMD ["npm", "start"]
```

### Docker Compose for Development
```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}
      - TWILIO_ACCOUNT_SID=${TWILIO_ACCOUNT_SID}
      - TWILIO_AUTH_TOKEN=${TWILIO_AUTH_TOKEN}
    depends_on:
      - redis
      - postgres

  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: militarylegalshield
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

## Phase 5: Monitoring and Analytics

### Application Monitoring
```javascript
// server/monitoring.ts
import { createLogger, format, transports } from 'winston';

export const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json()
  ),
  transports: [
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/combined.log' }),
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.simple()
      )
    })
  ]
});

// Security monitoring for military compliance
export const securityLogger = createLogger({
  level: 'warn',
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    new transports.File({ filename: 'logs/security.log' })
  ]
});
```

### Google Analytics 4 Configuration
```html
<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX', {
    privacy_policy: 'https://militarylegalshield.com/privacy',
    terms_of_service: 'https://militarylegalshield.com/terms'
  });

  // Track military-specific events
  gtag('event', 'case_analysis_started', {
    'military_branch': branch,
    'case_type': type
  });
</script>
```

## Phase 6: Security and Compliance

### HTTPS and Security Headers
```javascript
// server/security.ts
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

export const securityMiddleware = [
  // Rate limiting for API endpoints
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP'
  }),

  // Security headers
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", "https://api.openai.com", "https://api.stripe.com"]
      }
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    }
  })
];
```

### Data Encryption
```javascript
// server/encryption.ts
import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY; // 32 bytes key
const ALGORITHM = 'aes-256-gcm';

export function encryptSensitiveData(text: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipher(ALGORITHM, ENCRYPTION_KEY);
  cipher.setAAD(Buffer.from('military-legal-data'));
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  return iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted;
}

export function decryptSensitiveData(encryptedData: string): string {
  const parts = encryptedData.split(':');
  const iv = Buffer.from(parts[0], 'hex');
  const authTag = Buffer.from(parts[1], 'hex');
  const encrypted = parts[2];
  
  const decipher = crypto.createDecipher(ALGORITHM, ENCRYPTION_KEY);
  decipher.setAAD(Buffer.from('military-legal-data'));
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}
```

## Phase 7: Performance Optimization

### CDN Configuration
```javascript
// server/cdn-config.ts
export const cdnConfig = {
  cloudflare: {
    zoneId: process.env.CLOUDFLARE_ZONE_ID,
    apiToken: process.env.CLOUDFLARE_API_TOKEN,
    cacheRules: {
      static: { ttl: 31536000 }, // 1 year for static assets
      api: { ttl: 300 }, // 5 minutes for API responses
      html: { ttl: 3600 } // 1 hour for HTML pages
    }
  },
  compression: {
    threshold: 1024,
    level: 6,
    types: ['text/html', 'text/css', 'application/javascript', 'application/json']
  }
};
```

### Database Optimization
```sql
-- Create indexes for optimal query performance
CREATE INDEX idx_attorney_location ON attorney_profiles USING GIN (location);
CREATE INDEX idx_attorney_specializations ON attorney_profiles USING GIN (specializations);
CREATE INDEX idx_attorney_branches ON attorney_profiles USING GIN (military_branches);
CREATE INDEX idx_case_analyses_user_id ON case_analyses (user_id);
CREATE INDEX idx_case_analyses_created_at ON case_analyses (created_at DESC);
CREATE INDEX idx_legal_resources_branch ON legal_resources (military_branch);
CREATE INDEX idx_legal_resources_tags ON legal_resources USING GIN (tags);

-- Enable query plan analysis
EXPLAIN ANALYZE SELECT * FROM attorney_profiles 
WHERE location ILIKE '%fort%' 
AND 'court-martial' = ANY(specializations);
```

## Deployment Checklist

### Pre-Deployment
- [ ] Environment variables configured
- [ ] Database migrations completed
- [ ] SSL certificates installed
- [ ] DNS records configured
- [ ] Security headers implemented
- [ ] Rate limiting configured
- [ ] Monitoring systems setup

### Post-Deployment
- [ ] Health checks passing
- [ ] SSL certificate valid
- [ ] CDN cache configured
- [ ] Google Analytics tracking
- [ ] Search engine submission
- [ ] Performance monitoring active
- [ ] Security scanning completed

### Testing Checklist
- [ ] PWA installation works on all platforms
- [ ] AI case analysis functional
- [ ] Attorney matching system operational
- [ ] Document generation working
- [ ] Emergency consultation flow tested
- [ ] Payment processing functional
- [ ] Push notifications working
- [ ] Offline functionality verified

## Maintenance and Updates

### Regular Maintenance Tasks
1. **Weekly**: Security updates and dependency patches
2. **Monthly**: Database performance optimization
3. **Quarterly**: Comprehensive security audit
4. **Annually**: SSL certificate renewal and DNS configuration review

### Backup Strategy
```bash
# Automated database backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="militarylegalshield_backup_$DATE.sql"

pg_dump $DATABASE_URL > backups/$BACKUP_FILE
aws s3 cp backups/$BACKUP_FILE s3://militarylegalshield-backups/

# Keep only last 30 days of backups
find backups/ -name "*.sql" -mtime +30 -delete
```

### Rollback Procedures
```bash
# Quick rollback to previous version
git log --oneline -5
git checkout [previous-commit-hash]
docker-compose down
docker-compose up -d

# Database rollback (if needed)
psql $DATABASE_URL < backups/militarylegalshield_backup_[timestamp].sql
```

## Success Metrics

### Technical Metrics
- Uptime: 99.9%
- Page load time: < 2 seconds
- API response time: < 500ms
- Database query time: < 100ms
- SSL Labs score: A+

### Business Metrics
- User registrations: Track military branch distribution
- Case analysis completions: Monitor AI accuracy
- Attorney matches: Success rate and user satisfaction
- PWA installations: Cross-platform adoption rates
- Emergency consultations: Response time and resolution rate

This deployment guide ensures MilitaryLegalShield is deployed securely and efficiently across GitHub, Supabase, and the custom domain with military-grade security and compliance standards.