# Google Search Console Setup for MilitaryLegalShield.com

## Step 1: Access Google Search Console
1. Go to [Google Search Console](https://search.google.com/search-console/)
2. Sign in with your Google account
3. Click "Add Property"

## Step 2: Add Your Website
1. Select "URL prefix" property type
2. Enter: `https://militarylegalshield.com`
3. Click "Continue"

## Step 3: Verify Ownership (Choose One Method)

### Method A: HTML Meta Tag (Recommended)
1. Copy the verification meta tag provided by Google
2. The tag looks like: `<meta name="google-site-verification" content="YOUR_TOKEN_HERE" />`
3. This is automatically handled by our SEO components - just provide the token

### Method B: HTML File Upload
1. Download the verification HTML file from Google
2. The file will be automatically served at: `https://militarylegalshield.com/google-site-verification.html`

### Method C: DNS Verification
1. Add the TXT record to your domain's DNS settings
2. Use your domain registrar's DNS management panel

## Step 4: Submit Sitemap
1. After verification, go to "Sitemaps" in the left menu
2. Click "Add a new sitemap"
3. Enter: `sitemap.xml`
4. Click "Submit"
5. Also submit: `rss.xml` for content feeds

## Step 5: Enable Rich Results
1. Go to "Rich results" in the left menu
2. Our structured data is already implemented for:
   - Legal Services
   - Business Information
   - FAQ Pages
   - Breadcrumbs
   - Reviews

## Step 6: Set Up Google Analytics 4
1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new GA4 property for militarylegalshield.com
3. Copy the Measurement ID (starts with G-)
4. Update the GA_MEASUREMENT_ID in google-analytics.tsx

## Step 7: Connect Search Console to Analytics
1. In Google Search Console, go to "Settings"
2. Click "Associate with Analytics property"
3. Select your GA4 property

## Step 8: Monitor Performance
Check these sections regularly:
- **Performance**: Search queries, clicks, impressions
- **Coverage**: Indexing status and errors
- **Enhancements**: Rich results status
- **Security Issues**: Any security problems

## Step 9: Submit to Google My Business (Optional)
1. Go to [Google My Business](https://business.google.com/)
2. Add your business (if applicable)
3. Verify your business listing

## Expected Results Timeline
- **Verification**: Immediate
- **Initial Crawling**: 24-48 hours
- **Full Indexing**: 1-2 weeks
- **Rich Results**: 2-4 weeks
- **Performance Data**: 3-7 days after indexing

## Key URLs to Monitor
- Homepage: https://militarylegalshield.com/
- Attorney Database: https://militarylegalshield.com/lawyer-database
- Emergency Services: https://militarylegalshield.com/urgent-match
- Legal Challenges: https://militarylegalshield.com/legal-challenges
- Sitemap: https://militarylegalshield.com/sitemap.xml

## Troubleshooting Common Issues

### Verification Failed
- Check that the meta tag is properly placed in the <head> section
- Ensure the domain is correctly spelled
- Wait 24 hours and try again

### Sitemap Not Found
- Verify sitemap is accessible: https://militarylegalshield.com/sitemap.xml
- Check for any server errors
- Ensure proper XML formatting

### Pages Not Indexed
- Check robots.txt allows crawling
- Verify pages are linked internally
- Submit individual URLs for indexing

## Advanced SEO Features Implemented
✅ Structured Data (JSON-LD)
✅ Open Graph Tags
✅ Twitter Cards
✅ Canonical URLs
✅ Meta Descriptions
✅ Title Tag Optimization
✅ Mobile Optimization
✅ Fast Loading Times
✅ HTTPS Security
✅ Internal Linking
✅ Breadcrumb Navigation

## Next Steps After Setup
1. Request indexing for important pages
2. Monitor search performance weekly
3. Optimize based on search query data
4. Add new content regularly
5. Build quality backlinks from military/legal websites
6. Monitor Core Web Vitals
7. Set up Google Alerts for brand mentions