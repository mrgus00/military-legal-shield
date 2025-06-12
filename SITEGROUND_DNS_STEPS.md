# SiteGround DNS Setup for MilitaryLegalShield

## Step-by-Step Instructions

### 1. Access SiteGround DNS Management
1. Login to your **SiteGround User Area**
2. Click **Websites** in the top menu
3. Click **Manage** next to your militarylegalshield.com domain
4. Scroll down and click **DNS Zone Editor**

### 2. Add CNAME Record (for www subdomain)
1. Click **Add Record** button
2. Select **CNAME** from the record type dropdown
3. Fill in the fields:
   - **Host**: `www`
   - **Points to**: `workspace.mrgus2.repl.co`
   - **TTL**: Leave as default (3600) or select "1 Hour"
4. Click **Add Record**

### 3. Add A Record (for root domain)
1. Click **Add Record** button again
2. Select **A** from the record type dropdown
3. Fill in the fields:
   - **Host**: `@` (or leave blank if @ isn't available)
   - **Points to**: `34.60.168.28`
   - **TTL**: Leave as default (3600) or select "1 Hour"
4. Click **Add Record**

### 4. Optional: Remove Conflicting Records
Look for any existing A or CNAME records for:
- `@` (root domain)
- `www`

If you see any pointing to SiteGround's servers, you may need to delete them to avoid conflicts.

### 5. Disable SiteGround Website Tools (if applicable)
If you have SiteGround's Site Tools active:
1. Go to **Speed** → **Caching**
2. Disable any redirects or caching for this domain
3. This prevents conflicts with your Replit application

## What Your DNS Records Should Look Like

After setup, your DNS Zone should contain:
```
Type    Host    Points To                 TTL
CNAME   www     workspace.mrgus2.repl.co  3600
A       @       34.60.168.28              3600
```

## Verification Timeline
- **Immediate**: Changes visible in SiteGround DNS editor
- **15-60 minutes**: DNS begins propagating globally
- **2-4 hours**: Most locations will see the new DNS
- **24-48 hours**: Complete global propagation
- **1-24 hours**: SSL certificate automatically provisioned

## Testing Your Setup
After 30-60 minutes, test these URLs:
- `http://militarylegalshield.com/api/health`
- `http://www.militarylegalshield.com/api/health`

Both should show your application's health status.

## SiteGround-Specific Notes
- SiteGround DNS changes are usually fast (15-30 minutes)
- If you see "parking page" initially, DNS is still propagating
- SSL certificates are handled by Replit, not SiteGround
- You can keep your SiteGround hosting for other domains/services

## Troubleshooting SiteGround Issues
- **Can't find DNS Zone Editor**: Make sure you're managing the correct domain
- **@ symbol not accepted**: Try leaving the Host field blank for root domain
- **Changes not saving**: Ensure you're clicking "Add Record" after each entry
- **Still seeing SiteGround page**: Clear browser cache and wait for propagation

---

**Ready to proceed?** Follow these steps in your SiteGround control panel, then let me know when you've added both DNS records.