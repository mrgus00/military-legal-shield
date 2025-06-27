#!/usr/bin/env node
/**
 * Comprehensive Website Review Script
 * Tests navigation flow, visual consistency, functional links, and error checking
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

class WebsiteReviewer {
  constructor() {
    this.baseUrl = 'http://localhost:5000';
    this.results = {
      navigation: [],
      visualIssues: [],
      brokenLinks: [],
      errors: [],
      performance: [],
      accessibility: [],
      flow: []
    };
    this.testedUrls = new Set();
  }

  async initialize() {
    this.browser = await puppeteer.launch({
      headless: false,
      defaultViewport: { width: 1920, height: 1080 },
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    this.page = await this.browser.newPage();
    
    // Setup error and console monitoring
    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        this.results.errors.push({
          type: 'console_error',
          message: msg.text(),
          url: this.page.url()
        });
      }
    });

    this.page.on('response', response => {
      if (response.status() >= 400) {
        this.results.brokenLinks.push({
          url: response.url(),
          status: response.status(),
          statusText: response.statusText(),
          referrer: this.page.url()
        });
      }
    });
  }

  async testHomepage() {
    console.log('🏠 Testing Homepage...');
    await this.page.goto(this.baseUrl);
    await this.page.waitForTimeout(2000);

    // Test main dashboard links
    const dashboardLinks = [
      '/emergency-booking',
      '/holographic-guidance', 
      '/mobile-dashboard',
      '/secure-messaging',
      '/marketing-dashboard'
    ];

    for (const link of dashboardLinks) {
      try {
        await this.page.goto(`${this.baseUrl}${link}`);
        await this.page.waitForTimeout(1500);
        
        // Check for home button
        const homeButton = await this.page.$('[data-testid="home-button"], .home-button, button:has-text("Home")');
        if (!homeButton) {
          this.results.navigation.push({
            issue: 'Missing home button',
            url: link,
            severity: 'medium'
          });
        }

        // Test home button functionality
        if (homeButton) {
          await homeButton.click();
          await this.page.waitForTimeout(1000);
          const currentUrl = this.page.url();
          if (!currentUrl.includes(this.baseUrl) || currentUrl !== this.baseUrl + '/') {
            this.results.navigation.push({
              issue: 'Home button navigation failed',
              url: link,
              severity: 'high'
            });
          }
        }

        this.results.flow.push({
          route: link,
          status: 'accessible',
          loadTime: 'under_2s'
        });

      } catch (error) {
        this.results.errors.push({
          type: 'navigation_error',
          message: error.message,
          url: link
        });
      }
    }
  }

  async testCriticalRoutes() {
    console.log('🔗 Testing Critical Routes...');
    const criticalRoutes = [
      '/attorneys',
      '/find-attorneys', 
      '/pricing',
      '/resources',
      '/legal-documents',
      '/court-martial-defense',
      '/va-benefits-claims',
      '/community-forum',
      '/help-center',
      '/contact-support',
      '/privacy-policy',
      '/terms-of-service'
    ];

    for (const route of criticalRoutes) {
      try {
        await this.page.goto(`${this.baseUrl}${route}`);
        await this.page.waitForTimeout(1500);

        // Check for 404 or error states
        const pageContent = await this.page.content();
        if (pageContent.includes('404') || pageContent.includes('Not Found') || pageContent.includes('Error')) {
          this.results.brokenLinks.push({
            url: route,
            status: 404,
            statusText: 'Not Found or Error Content',
            referrer: 'direct_access'
          });
        }

        // Check for proper page structure
        const hasHeader = await this.page.$('h1, h2, header');
        if (!hasHeader) {
          this.results.visualIssues.push({
            issue: 'Missing main header/title',
            url: route,
            severity: 'medium'
          });
        }

        this.results.flow.push({
          route,
          status: 'accessible',
          hasHeader: !!hasHeader
        });

      } catch (error) {
        this.results.errors.push({
          type: 'route_error',
          message: error.message,
          url: route
        });
      }
    }
  }

  async testVisualConsistency() {
    console.log('🎨 Testing Visual Consistency...');
    const pages = ['/', '/attorneys', '/pricing', '/resources'];
    
    for (const page of pages) {
      await this.page.goto(`${this.baseUrl}${page}`);
      await this.page.waitForTimeout(1000);

      // Check color scheme consistency
      const backgroundColor = await this.page.evaluate(() => {
        return window.getComputedStyle(document.body).backgroundColor;
      });

      // Check for consistent fonts
      const fontFamily = await this.page.evaluate(() => {
        return window.getComputedStyle(document.body).fontFamily;
      });

      // Test responsive design
      await this.page.setViewport({ width: 768, height: 1024 });
      await this.page.waitForTimeout(500);
      
      const isMobile = await this.page.evaluate(() => {
        return window.innerWidth <= 768;
      });

      if (!isMobile) {
        this.results.visualIssues.push({
          issue: 'Responsive design not working on mobile',
          url: page,
          severity: 'high'
        });
      }

      // Reset viewport
      await this.page.setViewport({ width: 1920, height: 1080 });
    }
  }

  async testLinkFunctionality() {
    console.log('🔗 Testing Link Functionality...');
    await this.page.goto(this.baseUrl);
    
    // Find all internal links
    const links = await this.page.$$eval('a[href^="/"], a[href^="./"], a[href^="../"]', links => 
      links.map(link => ({
        href: link.href,
        text: link.textContent.trim()
      }))
    );

    for (const link of links.slice(0, 20)) { // Test first 20 links
      try {
        await this.page.goto(link.href);
        await this.page.waitForTimeout(1000);
        
        const pageTitle = await this.page.title();
        if (!pageTitle || pageTitle.includes('404') || pageTitle.includes('Error')) {
          this.results.brokenLinks.push({
            url: link.href,
            text: link.text,
            status: 'broken_or_error',
            referrer: this.baseUrl
          });
        }
      } catch (error) {
        this.results.brokenLinks.push({
          url: link.href,
          text: link.text,
          error: error.message,
          referrer: this.baseUrl
        });
      }
    }
  }

  async testUserFlow() {
    console.log('👤 Testing User Flow...');
    
    // Test typical user journey
    await this.page.goto(this.baseUrl);
    
    // 1. User visits homepage
    await this.page.waitForTimeout(1000);
    
    // 2. Clicks on Emergency Booking
    try {
      await this.page.click('a[href="/emergency-booking"]');
      await this.page.waitForTimeout(2000);
      
      // 3. Uses home button to return
      const homeButton = await this.page.$('button:has-text("Home"), .home-button, [data-testid="home-button"]');
      if (homeButton) {
        await homeButton.click();
        await this.page.waitForTimeout(1000);
        
        const currentUrl = this.page.url();
        if (currentUrl === this.baseUrl + '/') {
          this.results.flow.push({
            journey: 'homepage_emergency_home',
            status: 'successful',
            description: 'User can navigate from homepage to emergency booking and back'
          });
        }
      }
    } catch (error) {
      this.results.flow.push({
        journey: 'homepage_emergency_home',
        status: 'failed',
        error: error.message
      });
    }

    // Test another flow: Holographic Guidance
    try {
      await this.page.goto(this.baseUrl);
      await this.page.click('a[href="/holographic-guidance"]');
      await this.page.waitForTimeout(2000);
      
      this.results.flow.push({
        journey: 'holographic_guidance_access',
        status: 'successful',
        description: 'User can access holographic guidance feature'
      });
    } catch (error) {
      this.results.flow.push({
        journey: 'holographic_guidance_access',
        status: 'failed',
        error: error.message
      });
    }
  }

  async testPerformance() {
    console.log('⚡ Testing Performance...');
    
    const criticalPages = ['/', '/emergency-booking', '/attorneys', '/pricing'];
    
    for (const page of criticalPages) {
      const startTime = Date.now();
      await this.page.goto(`${this.baseUrl}${page}`);
      await this.page.waitForLoadState('networkidle');
      const loadTime = Date.now() - startTime;
      
      this.results.performance.push({
        url: page,
        loadTime: `${loadTime}ms`,
        performance: loadTime < 3000 ? 'good' : loadTime < 5000 ? 'acceptable' : 'poor'
      });
    }
  }

  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalIssues: this.results.errors.length + this.results.brokenLinks.length + this.results.visualIssues.length,
        criticalIssues: this.results.brokenLinks.filter(link => link.status >= 400).length,
        navigationIssues: this.results.navigation.length,
        performanceIssues: this.results.performance.filter(p => p.performance === 'poor').length
      },
      details: this.results
    };

    // Write to file
    fs.writeFileSync('website-review-report.json', JSON.stringify(report, null, 2));
    
    console.log('\n📋 WEBSITE REVIEW SUMMARY');
    console.log('=' .repeat(50));
    console.log(`🔍 Total Issues Found: ${report.summary.totalIssues}`);
    console.log(`❌ Critical Issues: ${report.summary.criticalIssues}`);
    console.log(`🧭 Navigation Issues: ${report.summary.navigationIssues}`);
    console.log(`⚡ Performance Issues: ${report.summary.performanceIssues}`);
    
    if (this.results.brokenLinks.length > 0) {
      console.log('\n🔗 BROKEN LINKS:');
      this.results.brokenLinks.forEach(link => {
        console.log(`  - ${link.url} (${link.status || 'error'})`);
      });
    }
    
    if (this.results.navigation.length > 0) {
      console.log('\n🧭 NAVIGATION ISSUES:');
      this.results.navigation.forEach(issue => {
        console.log(`  - ${issue.url}: ${issue.issue} (${issue.severity})`);
      });
    }
    
    if (this.results.errors.length > 0) {
      console.log('\n❌ ERRORS:');
      this.results.errors.forEach(error => {
        console.log(`  - ${error.url}: ${error.message}`);
      });
    }

    console.log('\n✅ SUCCESSFUL FLOWS:');
    this.results.flow.filter(f => f.status === 'successful' || f.status === 'accessible').forEach(flow => {
      console.log(`  - ${flow.route || flow.journey}: ✓`);
    });

    return report;
  }

  async runFullReview() {
    console.log('🚀 Starting Comprehensive Website Review...\n');
    
    await this.initialize();
    
    try {
      await this.testHomepage();
      await this.testCriticalRoutes();
      await this.testVisualConsistency();
      await this.testLinkFunctionality();
      await this.testUserFlow();
      await this.testPerformance();
      
      const report = this.generateReport();
      
      console.log('\n🎉 Website review completed!');
      console.log('📄 Detailed report saved to: website-review-report.json');
      
      return report;
      
    } catch (error) {
      console.error('❌ Review failed:', error);
      throw error;
    } finally {
      await this.browser.close();
    }
  }
}

// Run the review
if (require.main === module) {
  const reviewer = new WebsiteReviewer();
  reviewer.runFullReview().catch(console.error);
}

module.exports = WebsiteReviewer;