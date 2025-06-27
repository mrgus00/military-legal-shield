# Military Legal Shield - Deployment Guide

## Pre-Deployment Checklist

### 1. Environment Variables
Ensure these secrets are configured in your deployment platform:
- `DATABASE_URL` - PostgreSQL database connection string
- `OPENAI_API_KEY` - OpenAI API key for AI features
- `STRIPE_SECRET_KEY` - Stripe secret key for payments
- `STRIPE_PUBLIC_KEY` - Stripe publishable key
- `TWILIO_ACCOUNT_SID` - Twilio account SID
- `TWILIO_AUTH_TOKEN` - Twilio auth token
- `TWILIO_PHONE_NUMBER` - Twilio phone number
- `GA_MEASUREMENT_ID` - Google Analytics measurement ID
- `SESSION_SECRET` - Secret for session encryption

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
```bash
# Build Docker image
docker build -t military-legal-shield .

# Run container
docker run -p 5000:5000 --env-file .env.production military-legal-shield
```

### Option 3: Traditional VPS Deployment
```bash
# Install dependencies
npm ci --production

# Build application
npm run build

# Start with PM2
pm2 start npm --name "military-legal-shield" -- start
pm2 startup
pm2 save
```

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
