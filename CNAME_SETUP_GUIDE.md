# CNAME Setup Guide for MilitaryLegalShield

## Quick Setup Instructions

### Step 1: Access Your Domain's DNS Settings
1. Log into your domain registrar (SiteGround, GoDaddy, Namecheap, etc.)
2. Navigate to DNS Management or DNS Zone Editor
3. Look for "Manage DNS" or "DNS Records"

### Step 2: Add CNAME Record
Add the following CNAME record:

```
Type: CNAME
Name/Host: www
Value/Points To: workspace.mrgus2.repl.co
TTL: 3600 (or Auto)
```

### Step 3: Add Root Domain Record
For the root domain (militarylegalshield.com without www), add:

```
Type: A
Name/Host: @ (or leave blank)
Value/Points To: 34.60.168.28
TTL: 3600 (or Auto)
```

### Step 4: Optional - Redirect Root to WWW
Some providers require a redirect from root to www. If available, set up:
- Redirect `militarylegalshield.com` → `www.militarylegalshield.com`

## Provider-Specific Instructions

### SiteGround
1. Login to SiteGround User Area
2. Go to **Websites** → **Manage**
3. Select your domain
4. Click **DNS Zone Editor**
5. Click **Add Record**
6. Add both CNAME and A records as shown above

### GoDaddy
1. Login to GoDaddy Account Manager
2. Go to **My Products** → **DNS**
3. Click **Manage** next to your domain
4. Add the CNAME and A records

### Namecheap
1. Login to Namecheap Account
2. Go to **Domain List** → **Manage**
3. Click **Advanced DNS**
4. Add the CNAME and A records

## Verification Steps

### 1. Check DNS Propagation (15 minutes - 48 hours)
Test your domain using online DNS checkers:
- https://dnschecker.org
- https://whatsmydns.net

### 2. Test Your Domain
Once DNS propagates, test these URLs:
- `https://militarylegalshield.com/api/health`
- `https://www.militarylegalshield.com/api/health`

Both should return:
```json
{
  "status": "healthy",
  "domain": "militarylegalshield.com",
  "application": "MilitaryLegalShield",
  "verified": true
}
```

### 3. SSL Certificate
Replit automatically provisions SSL certificates. This may take 1-24 hours after DNS propagation.

## Troubleshooting

### Common Issues
- **"Site can't be reached"**: DNS hasn't propagated yet (wait 2-4 hours)
- **"Not secure" warning**: SSL certificate still provisioning (wait 1-24 hours)
- **502 Bad Gateway**: Check CNAME points to `workspace.mrgus2.repl.co`

### Quick Fixes
1. Clear your browser cache
2. Try incognito/private browsing
3. Test from different devices/networks
4. Wait for full DNS propagation

## Current Status
✅ Replit application running on port 5000
✅ Domain verification configured
✅ HTTPS redirection enabled
✅ CORS headers configured
⏳ Awaiting CNAME record setup

## Next Steps After DNS Setup
1. Verify domain loads correctly
2. Test all application features
3. Configure any additional subdomains needed
4. Update any hardcoded URLs in application

---

**Need Help?** If you encounter issues:
1. Share screenshots of your DNS settings
2. Let me know which domain registrar you're using
3. Mention any error messages you see