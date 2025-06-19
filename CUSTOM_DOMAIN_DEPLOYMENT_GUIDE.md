# Custom Domain Infrastructure Setup - militarylegalshield.com

## Complete Production Deployment Guide

### Phase 1: Server Preparation

#### 1. Initial Server Setup
```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install essential packages
sudo apt install -y git curl wget nginx ufw fail2ban

# Run production deployment script
sudo chmod +x infrastructure/production-deploy.sh
sudo ./infrastructure/production-deploy.sh
```

#### 2. Application Deployment
```bash
# Navigate to application directory
cd /var/www/militarylegalshield

# Configure environment variables
sudo nano .env

# Required variables:
DATABASE_URL=postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
OPENAI_API_KEY=sk-[your-openai-api-key]
STRIPE_SECRET_KEY=sk_[your-stripe-secret-key]
VITE_STRIPE_PUBLIC_KEY=pk_[your-stripe-public-key]
TWILIO_ACCOUNT_SID=AC[your-twilio-account-sid]
TWILIO_AUTH_TOKEN=[your-twilio-auth-token]
TWILIO_PHONE_NUMBER=+1[your-twilio-phone-number]
NODE_ENV=production
PORT=5000
```

### Phase 2: DNS Configuration

#### Configure DNS Records at Your Domain Registrar:

**A Records:**
```
Type: A
Name: @
Value: [Your Server IP]
TTL: 300

Type: A  
Name: www
Value: [Your Server IP]
TTL: 300
```

**CNAME Records:**
```
Type: CNAME
Name: api
Value: militarylegalshield.com
TTL: 300
```

**TXT Records:**
```
Type: TXT
Name: @
Value: "militarylegalshield-domain-verification=Q85aT0P23qZ2zCKZHOIHSzE6ve727hMw5mBqlsect6k"
TTL: 300

Type: TXT
Name: @
Value: "v=spf1 include:_spf.google.com ~all"
TTL: 3600
```

#### Verify DNS Propagation:
```bash
# Check A record
dig A militarylegalshield.com

# Check WWW record
dig A www.militarylegalshield.com

# Expected response: Your server IP address
```

### Phase 3: SSL Certificate Installation

#### Run SSL Setup Script:
```bash
# Make executable and run
sudo chmod +x infrastructure/ssl-setup.sh
sudo ./infrastructure/ssl-setup.sh
```

#### Manual SSL Configuration (Alternative):
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d militarylegalshield.com -d www.militarylegalshield.com

# Verify auto-renewal
sudo certbot renew --dry-run
```

### Phase 4: CloudFlare CDN Setup (Optional but Recommended)

#### 1. Add Domain to CloudFlare:
- Sign up at cloudflare.com
- Add militarylegalshield.com
- Update nameservers at your registrar

#### 2. Configure CloudFlare Settings:
```javascript
// Use infrastructure/cloudflare-config.js for API automation
const cf = new CloudFlareManager('your-api-token', 'your-zone-id');
await cf.setupDNS();
await cf.configureSSL();
await cf.setupPageRules();
```

#### 3. CloudFlare Recommended Settings:
- SSL/TLS: Full (Strict)
- Always Use HTTPS: On
- Auto Minify: CSS, HTML, JS
- Brotli Compression: On
- Security Level: Medium

### Phase 5: Production Verification

#### 1. Health Check Verification:
```bash
# Test application health
curl -f https://militarylegalshield.com/api/health

# Expected response:
# {"status":"healthy","timestamp":"2024-06-19T...","version":"2.1.0"}
```

#### 2. PWA Installation Test:
- Visit https://militarylegalshield.com in Chrome
- Look for install banner or address bar install icon
- Test "Add to Home Screen" on mobile devices

#### 3. SSL Certificate Verification:
```bash
# Check SSL certificate
echo | openssl s_client -connect militarylegalshield.com:443 -servername militarylegalshield.com 2>/dev/null | openssl x509 -noout -dates

# Test SSL rating
curl -s "https://api.ssllabs.com/api/v3/analyze?host=militarylegalshield.com"
```

### Phase 6: Monitoring and Maintenance

#### 1. Access Monitoring Dashboard:
```bash
# Copy monitoring dashboard to web directory
sudo cp infrastructure/monitoring-dashboard.html /var/www/militarylegalshield/public/admin/

# Access at: https://militarylegalshield.com/admin/monitoring-dashboard.html
```

#### 2. PM2 Process Management:
```bash
# Check application status
pm2 status

# View logs
pm2 logs militarylegalshield

# Restart application
pm2 restart militarylegalshield

# Monitor resources
pm2 monit
```

#### 3. Log Monitoring:
```bash
# Application logs
tail -f /var/log/militarylegalshield/app.log

# Error logs
tail -f /var/log/militarylegalshield/error.log

# Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### Phase 7: Security Hardening

#### 1. Firewall Configuration:
```bash
# UFW status
sudo ufw status

# Allow only necessary ports
sudo ufw allow 22/tcp   # SSH
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS
```

#### 2. Fail2ban Configuration:
```bash
# Check fail2ban status
sudo fail2ban-client status

# Monitor banned IPs
sudo fail2ban-client status nginx-http-auth
```

#### 3. Security Headers Verification:
```bash
# Test security headers
curl -I https://militarylegalshield.com

# Should include:
# Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
# X-Frame-Options: DENY
# X-Content-Type-Options: nosniff
```

### Phase 8: Performance Optimization

#### 1. Database Optimization:
```bash
# Check database performance
curl -s "https://militarylegalshield.com/api/health/detailed" | grep database
```

#### 2. CDN Cache Verification:
```bash
# Test cache headers
curl -I "https://militarylegalshield.com/manifest.json"

# Should include cache-control headers
```

#### 3. Load Testing:
```bash
# Install Apache Bench
sudo apt install apache2-utils

# Basic load test
ab -n 100 -c 10 https://militarylegalshield.com/

# Test API endpoints
ab -n 50 -c 5 https://militarylegalshield.com/api/health
```

### Phase 9: Backup and Recovery

#### 1. Automated Backups:
```bash
# Check backup script
ls -la /usr/local/bin/backup-app.sh

# Manual backup
sudo /usr/local/bin/backup-app.sh

# Verify backups
ls -la /var/backups/militarylegalshield/
```

#### 2. Database Backups:
```bash
# Manual database backup
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# Restore from backup (if needed)
psql $DATABASE_URL < backup_20240619.sql
```

### Phase 10: Go-Live Checklist

**Pre-Launch Verification:**
- [ ] DNS records propagated globally
- [ ] SSL certificate installed and valid
- [ ] Application health check passes
- [ ] PWA installation works on mobile
- [ ] All API endpoints responding correctly
- [ ] Monitoring dashboard accessible
- [ ] Backup systems operational
- [ ] Security headers configured
- [ ] Firewall rules active

**Performance Targets:**
- [ ] Page load time < 2 seconds
- [ ] API response time < 500ms
- [ ] SSL Labs rating A or higher
- [ ] Lighthouse PWA score > 90
- [ ] 99.9% uptime monitoring

**Post-Launch Tasks:**
- [ ] Submit sitemap to Google Search Console
- [ ] Configure Google Analytics 4
- [ ] Set up uptime monitoring alerts
- [ ] Schedule regular security audits
- [ ] Plan scaling strategy

### Emergency Procedures

#### Application Down:
```bash
# Check PM2 status
pm2 status

# Restart application
pm2 restart militarylegalshield

# Check logs for errors
pm2 logs militarylegalshield --lines 50
```

#### SSL Certificate Issues:
```bash
# Force certificate renewal
sudo certbot renew --force-renewal

# Test nginx configuration
sudo nginx -t && sudo systemctl reload nginx
```

#### Database Connection Issues:
```bash
# Test database connectivity
psql $DATABASE_URL -c "SELECT 1;"

# Check connection pool
curl -s "https://militarylegalshield.com/api/health/detailed" | grep database
```

### Support Contacts

**Technical Issues:**
- Server: Check /var/log/militarylegalshield/
- SSL: Let's Encrypt documentation
- DNS: Domain registrar support
- CDN: CloudFlare support

**Monitoring Alerts:**
- Health checks fail: Restart application
- High memory usage: Scale server resources
- SSL expiry: Certificate auto-renewal
- Database issues: Check Supabase status

Your MilitaryLegalShield platform is now production-ready with military-grade security, global CDN performance, and comprehensive monitoring. The custom domain infrastructure provides enterprise-level reliability for serving military personnel worldwide.