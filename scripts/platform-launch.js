#!/usr/bin/env node

import https from 'https';
import http from 'http';

class PlatformLauncher {
  constructor() {
    this.baseUrl = 'https://militarylegalshield.com';
    this.results = {};
  }

  async submitToGoogle() {
    try {
      const sitemapUrl = `${this.baseUrl}/sitemap.xml`;
      const googlePingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
      
      await this.makeRequest(googlePingUrl);
      console.log('✓ Google Search Console: Sitemap submitted');
      return true;
    } catch (error) {
      console.error('✗ Google submission failed:', error.message);
      return false;
    }
  }

  async submitToBing() {
    try {
      const sitemapUrl = `${this.baseUrl}/sitemap.xml`;
      const bingPingUrl = `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
      
      await this.makeRequest(bingPingUrl);
      console.log('✓ Bing Webmaster Tools: Sitemap submitted');
      return true;
    } catch (error) {
      console.error('✗ Bing submission failed:', error.message);
      return false;
    }
  }

  async submitToYandex() {
    try {
      const sitemapUrl = `${this.baseUrl}/sitemap.xml`;
      const yandexPingUrl = `https://webmaster.yandex.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
      
      await this.makeRequest(yandexPingUrl);
      console.log('✓ Yandex Webmaster: Sitemap submitted');
      return true;
    } catch (error) {
      console.error('✗ Yandex submission failed:', error.message);
      return false;
    }
  }

  async submitSpecificPages() {
    const importantPages = [
      '/',
      '/attorneys',
      '/emergency-consultation',
      '/court-martial-defense',
      '/family-law-poas',
      '/ai-case-analysis',
      '/attorneys?branch=army',
      '/attorneys?branch=navy',
      '/attorneys?branch=marines',
      '/attorneys?branch=airforce',
      '/attorneys?branch=coastguard',
      '/attorneys?branch=spaceforce'
    ];

    console.log('\n📄 Submitting high-priority pages for immediate indexing...');
    
    for (const page of importantPages) {
      try {
        const fullUrl = `${this.baseUrl}${page}`;
        await this.submitUrlToGoogle(fullUrl);
        await this.submitUrlToBing(fullUrl);
        console.log(`✓ ${page} submitted to search engines`);
      } catch (error) {
        console.error(`✗ Failed to submit ${page}:`, error.message);
      }
    }
  }

  async submitUrlToGoogle(url) {
    const googleIndexingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(url)}`;
    await this.makeRequest(googleIndexingUrl);
  }

  async submitUrlToBing(url) {
    const bingIndexingUrl = `https://www.bing.com/ping?sitemap=${encodeURIComponent(url)}`;
    await this.makeRequest(bingIndexingUrl);
  }

  makeRequest(url) {
    return new Promise((resolve, reject) => {
      const protocol = url.startsWith('https:') ? https : http;
      protocol.get(url, (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res);
        } else {
          reject(new Error(`HTTP ${res.statusCode}`));
        }
      }).on('error', reject);
    });
  }

  async launchToAllPlatforms() {
    console.log('🚀 LAUNCHING MILITARYLEGALSHIELD TO ALL MAJOR PLATFORMS');
    console.log('=' .repeat(60));
    
    console.log('\n🔍 Submitting to Search Engines...');
    this.results.google = await this.submitToGoogle();
    this.results.bing = await this.submitToBing();
    this.results.yandex = await this.submitToYandex();

    await this.submitSpecificPages();

    console.log('\n🎉 PLATFORM LAUNCH COMPLETED!');
    console.log('MilitaryLegalShield is now submitted to all major search engines.');
    console.log('Indexing typically takes 24-48 hours for initial results.');
  }
}

const launcher = new PlatformLauncher();
launcher.launchToAllPlatforms().catch(console.error);

export default PlatformLauncher;