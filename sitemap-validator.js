const http = require('http');

// URLs from the sitemap to validate
const sitemapUrls = [
  'http://localhost:5000/',
  'http://localhost:5000/urgent-match',
  'http://localhost:5000/lawyer-database',
  'http://localhost:5000/legal-challenges',
  'http://localhost:5000/emergency-consultation',
  'http://localhost:5000/document-generator',
  'http://localhost:5000/military-justice',
  'http://localhost:5000/consultation-booking',
  'http://localhost:5000/benefits-eligibility'
];

async function validateUrls() {
  console.log('Validating sitemap URLs...\n');
  
  for (const url of sitemapUrls) {
    try {
      const response = await fetch(url);
      console.log(`${url}: ${response.status} ${response.statusText}`);
      
      if (response.status !== 200) {
        console.log(`  ❌ ERROR: ${url} returned ${response.status}`);
      } else {
        console.log(`  ✅ OK: ${url}`);
      }
    } catch (error) {
      console.log(`  ❌ FAILED: ${url} - ${error.message}`);
    }
  }
  
  // Test sitemap itself
  try {
    const sitemapResponse = await fetch('http://localhost:5000/sitemap.xml');
    const sitemapContent = await sitemapResponse.text();
    console.log('\nSitemap validation:');
    console.log(`Status: ${sitemapResponse.status}`);
    console.log(`Content-Type: ${sitemapResponse.headers.get('content-type')}`);
    console.log(`Size: ${sitemapContent.length} bytes`);
    
    // Basic XML validation
    if (sitemapContent.includes('<?xml') && sitemapContent.includes('</urlset>')) {
      console.log('✅ Sitemap XML structure looks valid');
    } else {
      console.log('❌ Sitemap XML structure appears invalid');
    }
  } catch (error) {
    console.log(`❌ Sitemap fetch failed: ${error.message}`);
  }
}

validateUrls();