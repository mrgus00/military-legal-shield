# Custom Domain Setup for MilitaryLegalShield

## Overview
This guide helps you connect your SiteGround-hosted domain to your Replit MilitaryLegalShield application.

## Current Replit Configuration
- **Replit URL**: `workspace.mrgus2.repl.co`
- **Server IP**: `34.60.168.28`
- **Port**: 5000 (mapped to 80)

## Step 1: SiteGround DNS Configuration

### Option A: CNAME Record (Recommended)
1. Login to your SiteGround hosting panel
2. Navigate to DNS Zone Editor
3. Add a CNAME record:
   ```
   Type: CNAME
   Host: www (or @ for root domain)
   Points to: workspace.mrgus2.repl.co
   TTL: 3600
   ```

### Option B: A Record
1. Add an A record:
   ```
   Type: A
   Host: @ (root domain) or www
   Points to: 34.60.168.28
   TTL: 3600
   ```

## Step 2: Subdomain Configuration (Optional)
For subdomains like `app.yourdomain.com`:
```
Type: CNAME
Host: app
Points to: workspace.mrgus2.repl.co
TTL: 3600
```

## Step 3: Replit Deployment Setup

### Update .replit Configuration
The application is configured to handle custom domains automatically.

### Supported Custom Domains
The server is pre-configured for:
- `militarylegalshield.com`
- `www.militarylegalshield.com`
- `militarylegal.app`
- `www.militarylegal.app`

## Step 4: SSL/TLS Configuration
Replit automatically provides SSL certificates for custom domains. The application enforces HTTPS redirects.

## Step 5: Domain Verification

### Verification Endpoints
- Test domain: `https://yourdomain.com/api/health`
- Verification header: Check for `X-Domain-Verification: militarylegalshield-verified`

### Manual Verification
```bash
curl -I https://yourdomain.com
# Should return: X-Domain-Verification: militarylegalshield-verified
```

## Step 6: DNS Propagation
- DNS changes take 24-48 hours to fully propagate
- Use tools like `dig` or online DNS checkers to monitor:
  ```bash
  dig yourdomain.com
  ```

## Troubleshooting

### Common Issues
1. **502 Bad Gateway**: DNS not fully propagated
2. **Certificate errors**: Wait for Replit SSL provisioning
3. **Redirect loops**: Check SiteGround redirect settings

### Debug Commands
```bash
# Check DNS resolution
nslookup yourdomain.com

# Test HTTP response
curl -I https://yourdomain.com

# Check SSL certificate
openssl s_client -connect yourdomain.com:443
```

## SiteGround Specific Steps

### Access DNS Management
1. Login to SiteGround User Area
2. Go to `Websites` → `Manage`
3. Select your domain
4. Click `DNS Zone Editor`

### Add DNS Records
1. Click `Add Record`
2. Select record type (CNAME or A)
3. Enter the host and target values
4. Save changes

### Disable SiteGround Redirects
1. Go to `Speed` → `Caching`
2. Disable any conflicting redirects
3. Clear SiteGround cache

## Post-Setup Verification Checklist

- [ ] DNS records added in SiteGround
- [ ] Domain points to Replit application
- [ ] HTTPS works correctly
- [ ] All application features functional
- [ ] No redirect loops
- [ ] SSL certificate valid

## Support Contacts
- **Replit Support**: For deployment and SSL issues
- **SiteGround Support**: For DNS and hosting configuration
- **Application Issues**: Check server logs in Replit console

## Security Notes
- Application uses HTTPS enforcement
- CORS headers configured for cross-origin requests
- Domain verification headers prevent unauthorized access
- No authentication required (public deployment)

---

**Next Steps**: After DNS configuration, test your domain and verify all application features work correctly.