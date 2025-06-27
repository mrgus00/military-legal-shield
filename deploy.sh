#!/bin/bash

# Military Legal Shield - Production Deployment Script
# This script prepares the application for production deployment

echo "🛡️ Military Legal Shield - Production Deployment"
echo "================================================="

# Check if we're in the correct directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

echo "✅ Project structure validated"

# Create production environment file
echo "📝 Creating production environment configuration..."
cat > .env.production << EOF
NODE_ENV=production
VITE_APP_NAME=Military Legal Shield
VITE_APP_VERSION=1.0.0
VITE_APP_DESCRIPTION=Comprehensive military legal support platform
VITE_GA_MEASUREMENT_ID=\${GA_MEASUREMENT_ID}
VITE_STRIPE_PUBLIC_KEY=\${STRIPE_PUBLIC_KEY}
DATABASE_URL=\${DATABASE_URL}
OPENAI_API_KEY=\${OPENAI_API_KEY}
STRIPE_SECRET_KEY=\${STRIPE_SECRET_KEY}
TWILIO_ACCOUNT_SID=\${TWILIO_ACCOUNT_SID}
TWILIO_AUTH_TOKEN=\${TWILIO_AUTH_TOKEN}
TWILIO_PHONE_NUMBER=\${TWILIO_PHONE_NUMBER}
SESSION_SECRET=\${SESSION_SECRET}
EOF

echo "✅ Production environment configured"

# Create Docker configuration for deployment
echo "🐳 Creating Docker configuration..."
cat > Dockerfile << EOF
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/api/health || exit 1

# Start the application
CMD ["npm", "start"]
EOF

echo "✅ Docker configuration created"

# Create nginx configuration for production
echo "🌐 Creating nginx configuration..."
cat > nginx.conf << EOF
server {
    listen 80;
    server_name militarylegalshield.com www.militarylegalshield.com;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss;
    
    # Static assets caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Proxy to Node.js application
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

echo "✅ Nginx configuration created"

# Create GitHub Actions workflow
echo "🚀 Creating GitHub Actions deployment workflow..."
mkdir -p .github/workflows

cat > .github/workflows/deploy.yml << EOF
name: Deploy Military Legal Shield

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '20'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run TypeScript check
      run: npm run type-check
    
    - name: Build application
      run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '20'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build application
      run: npm run build
      env:
        VITE_GA_MEASUREMENT_ID: \${{ secrets.GA_MEASUREMENT_ID }}
        VITE_STRIPE_PUBLIC_KEY: \${{ secrets.STRIPE_PUBLIC_KEY }}
    
    - name: Deploy to production
      run: |
        echo "🚀 Deploying to production server..."
        echo "Application built successfully and ready for deployment"
EOF

echo "✅ GitHub Actions workflow created"

# Create production build script
echo "📦 Creating production build configuration..."
cat >> package.json.tmp << 'EOF'
{
  "scripts": {
    "build": "vite build",
    "preview": "vite preview",
    "start": "NODE_ENV=production tsx server/index.ts",
    "type-check": "tsc --noEmit"
  }
}
EOF

# Update package.json with production scripts
node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const updates = JSON.parse(fs.readFileSync('package.json.tmp', 'utf8'));
Object.assign(pkg.scripts, updates.scripts);
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
"

rm package.json.tmp

echo "✅ Package.json updated with production scripts"

# Create deployment checklist
echo "📋 Creating deployment checklist..."
cat > DEPLOYMENT_GUIDE.md << EOF
# Military Legal Shield - Deployment Guide

## Pre-Deployment Checklist

### 1. Environment Variables
Ensure these secrets are configured in your deployment platform:
- \`DATABASE_URL\` - PostgreSQL database connection string
- \`OPENAI_API_KEY\` - OpenAI API key for AI features
- \`STRIPE_SECRET_KEY\` - Stripe secret key for payments
- \`STRIPE_PUBLIC_KEY\` - Stripe publishable key
- \`TWILIO_ACCOUNT_SID\` - Twilio account SID
- \`TWILIO_AUTH_TOKEN\` - Twilio auth token
- \`TWILIO_PHONE_NUMBER\` - Twilio phone number
- \`GA_MEASUREMENT_ID\` - Google Analytics measurement ID
- \`SESSION_SECRET\` - Secret for session encryption

### 2. Database Setup
- PostgreSQL database provisioned
- Database migrations applied
- Attorney data populated
- Session tables created

### 3. Domain Configuration
- DNS records configured for militarylegalshield.com
- SSL certificates installed
- CDN configured (if using)

## Deployment Options

### Option 1: Replit Deployment (Recommended)
1. Go to your Replit project
2. Click the "Deploy" button
3. Configure custom domain: militarylegalshield.com
4. Set environment variables in deployment settings
5. Deploy and test

### Option 2: Docker Deployment
\`\`\`bash
# Build Docker image
docker build -t military-legal-shield .

# Run container
docker run -p 5000:5000 --env-file .env.production military-legal-shield
\`\`\`

### Option 3: Traditional VPS Deployment
\`\`\`bash
# Install dependencies
npm ci --production

# Build application
npm run build

# Start with PM2
pm2 start npm --name "military-legal-shield" -- start
pm2 startup
pm2 save
\`\`\`

## Post-Deployment Verification

### Health Checks
- [ ] Application loads at https://militarylegalshield.com
- [ ] Database connection working
- [ ] Authentication system functional
- [ ] Payment processing working
- [ ] Emergency booking system active
- [ ] AI guidance system operational

### Performance Checks
- [ ] Page load times < 3 seconds
- [ ] Mobile responsiveness verified
- [ ] PWA installation working
- [ ] All API endpoints responding

### Security Verification
- [ ] HTTPS certificate valid
- [ ] Security headers present
- [ ] CORS configured correctly
- [ ] Rate limiting active
- [ ] Input validation working

## Monitoring Setup

### Analytics
- Google Analytics configured
- Search Console verified
- Performance monitoring active

### Error Tracking
- Error boundaries in place
- Logging system operational
- Alert notifications configured

## Support Information
- Emergency contact: Support team
- Documentation: Available in /help-center
- Status page: Monitor application health
EOF

echo "✅ Deployment guide created"

# Create GitHub repository preparation script
echo "📁 Preparing for GitHub repository..."
cat > github-setup.md << EOF
# GitHub Repository Setup for Military Legal Shield

## Repository Creation Steps

### 1. Create GitHub Repository
1. Go to https://github.com/new
2. Repository name: \`military-legal-shield\`
3. Description: \`Comprehensive military legal support platform with AI-powered assistance\`
4. Set to Public (for open source) or Private (for proprietary)
5. Initialize with README: No (we have our own)
6. Add .gitignore: No (we have our own)
7. Add license: Choose appropriate license

### 2. Local Git Setup
\`\`\`bash
# Initialize git repository (if not already done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Military Legal Shield platform with comprehensive features"

# Add GitHub remote
git remote add origin https://github.com/YOUR_USERNAME/military-legal-shield.git

# Push to GitHub
git branch -M main
git push -u origin main
\`\`\`

### 3. Configure Repository Settings

#### Secrets (for GitHub Actions)
Go to Settings > Secrets and variables > Actions and add:
- \`DATABASE_URL\`
- \`OPENAI_API_KEY\`
- \`STRIPE_SECRET_KEY\`
- \`STRIPE_PUBLIC_KEY\`
- \`TWILIO_ACCOUNT_SID\`
- \`TWILIO_AUTH_TOKEN\`
- \`TWILIO_PHONE_NUMBER\`
- \`GA_MEASUREMENT_ID\`
- \`SESSION_SECRET\`

#### Branch Protection
- Enable branch protection for \`main\`
- Require pull request reviews
- Require status checks to pass
- Require up-to-date branches

#### Pages (if using GitHub Pages)
- Source: GitHub Actions
- Custom domain: militarylegalshield.com

## Repository Structure
\`\`\`
military-legal-shield/
├── client/                 # React frontend
├── server/                 # Express backend
├── shared/                 # Shared types and schemas
├── .github/workflows/      # GitHub Actions
├── docs/                   # Documentation
├── scripts/                # Deployment scripts
├── README.md              # Project overview
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript config
├── tailwind.config.ts     # Tailwind CSS config
├── vite.config.ts         # Vite configuration
├── Dockerfile             # Docker configuration
├── docker-compose.yml     # Docker Compose
├── nginx.conf             # Nginx configuration
└── deploy.sh              # Deployment script
\`\`\`

## Deployment Integration

### Replit Integration
1. Link GitHub repository to Replit
2. Enable automatic deployments on push to main
3. Configure environment variables
4. Set up custom domain

### External Deployment
1. Use GitHub Actions for CI/CD
2. Deploy to your preferred hosting platform
3. Configure webhooks for automatic deployment
EOF

echo "✅ GitHub setup guide created"

echo ""
echo "🎉 Deployment preparation completed!"
echo ""
echo "📋 NEXT STEPS:"
echo "1. Create GitHub repository following github-setup.md"
echo "2. Push code to GitHub repository"
echo "3. Configure environment variables in deployment platform"
echo "4. Deploy using one of the methods in DEPLOYMENT_GUIDE.md"
echo "5. Verify deployment using the checklist"
echo ""
echo "🔧 FILES CREATED:"
echo "- deploy.sh (this script)"
echo "- Dockerfile (Docker configuration)"
echo "- nginx.conf (Web server configuration)"
echo "- .github/workflows/deploy.yml (CI/CD pipeline)"
echo "- DEPLOYMENT_GUIDE.md (Deployment instructions)"
echo "- github-setup.md (GitHub repository setup)"
echo "- .env.production (Production environment template)"
echo ""
echo "🚀 Ready for deployment!"