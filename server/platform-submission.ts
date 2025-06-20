import { Request, Response } from "express";

// Platform submission and indexing service
export class PlatformSubmissionService {
  private readonly baseUrl = "https://militarylegalshield.com";
  
  // Submit sitemap to Google Search Console
  async submitToGoogle(): Promise<boolean> {
    try {
      const sitemapUrl = `${this.baseUrl}/sitemap.xml`;
      const googlePingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
      
      const response = await fetch(googlePingUrl, { method: 'GET' });
      return response.ok;
    } catch (error) {
      console.error('Google submission failed:', error);
      return false;
    }
  }

  // Submit sitemap to Bing Webmaster Tools
  async submitToBing(): Promise<boolean> {
    try {
      const sitemapUrl = `${this.baseUrl}/sitemap.xml`;
      const bingPingUrl = `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
      
      const response = await fetch(bingPingUrl, { method: 'GET' });
      return response.ok;
    } catch (error) {
      console.error('Bing submission failed:', error);
      return false;
    }
  }

  // Submit to Yandex
  async submitToYandex(): Promise<boolean> {
    try {
      const sitemapUrl = `${this.baseUrl}/sitemap.xml`;
      const yandexPingUrl = `https://webmaster.yandex.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
      
      const response = await fetch(yandexPingUrl, { method: 'GET' });
      return response.ok;
    } catch (error) {
      console.error('Yandex submission failed:', error);
      return false;
    }
  }

  // Submit individual URLs for immediate indexing
  async submitUrlForIndexing(url: string): Promise<boolean> {
    try {
      // Google URL submission
      const googleUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(url)}`;
      await fetch(googleUrl, { method: 'GET' });
      
      // Bing URL submission
      const bingUrl = `https://www.bing.com/ping?sitemap=${encodeURIComponent(url)}`;
      await fetch(bingUrl, { method: 'GET' });
      
      return true;
    } catch (error) {
      console.error('URL submission failed:', error);
      return false;
    }
  }

  // Generate and submit schema.org structured data
  generateStructuredData() {
    return {
      "@context": "https://schema.org",
      "@type": "LegalService",
      "name": "MilitaryLegalShield",
      "description": "AI-powered military legal support platform providing comprehensive legal assistance for service members across all branches",
      "url": this.baseUrl,
      "logo": `${this.baseUrl}/logo.png`,
      "sameAs": [
        "https://www.facebook.com/militarylegalshield",
        "https://www.twitter.com/militarylegalsupport",
        "https://www.linkedin.com/company/militarylegalshield"
      ],
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "US"
      },
      "serviceType": "Military Legal Support",
      "areaServed": {
        "@type": "Country",
        "name": "United States"
      },
      "availableLanguage": ["English"],
      "priceRange": "Free - Premium",
      "openingHours": "Mo-Su 00:00-24:00",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Military Legal Services",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Court-Martial Defense",
              "description": "Expert legal representation for UCMJ violations and court-martial proceedings"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Family Legal Services",
              "description": "Legal support for military families including powers of attorney and family care plans"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "AI Case Analysis",
              "description": "Advanced AI-powered legal case analysis and outcome prediction"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Emergency Consultation",
              "description": "24/7 emergency legal consultation for urgent military legal matters"
            }
          }
        ]
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+1-800-MIL-LEGAL",
        "contactType": "customer service",
        "availableLanguage": "English",
        "areaServed": "US"
      }
    };
  }

  // Submit to all major platforms
  async submitToAllPlatforms(): Promise<{ google: boolean; bing: boolean; yandex: boolean }> {
    const results = {
      google: await this.submitToGoogle(),
      bing: await this.submitToBing(),
      yandex: await this.submitToYandex()
    };

    console.log('Platform submission results:', results);
    return results;
  }
}

// Express route handlers
export async function submitSitemapToSearchEngines(req: Request, res: Response) {
  try {
    const submissionService = new PlatformSubmissionService();
    const results = await submissionService.submitToAllPlatforms();
    
    res.json({
      success: true,
      message: "Sitemap submitted to all major search engines",
      results
    });
  } catch (error) {
    console.error('Sitemap submission error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to submit sitemap",
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

export async function submitUrlForImmediateIndexing(req: Request, res: Response) {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({
        success: false,
        message: "URL is required"
      });
    }

    const submissionService = new PlatformSubmissionService();
    const success = await submissionService.submitUrlForIndexing(url);
    
    res.json({
      success,
      message: success ? "URL submitted for indexing" : "URL submission failed",
      url
    });
  } catch (error) {
    console.error('URL submission error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to submit URL",
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

export async function getStructuredData(req: Request, res: Response) {
  try {
    const submissionService = new PlatformSubmissionService();
    const structuredData = submissionService.generateStructuredData();
    
    res.json({
      success: true,
      structuredData
    });
  } catch (error) {
    console.error('Structured data error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to generate structured data",
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// Analytics and tracking setup
export function generateGoogleAnalyticsConfig() {
  return {
    trackingId: process.env.VITE_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX',
    config: {
      page_title: 'MilitaryLegalShield',
      page_location: 'https://militarylegalshield.com',
      content_group1: 'Military Legal Services',
      custom_map: {
        custom_parameter: 'military_branch'
      }
    }
  };
}

export function generateFacebookPixelConfig() {
  return {
    pixelId: process.env.FACEBOOK_PIXEL_ID || 'XXXXXXXXXXXX',
    events: [
      'PageView',
      'Lead',
      'CompleteRegistration',
      'Contact',
      'Schedule'
    ]
  };
}

export function generateLinkedInInsightConfig() {
  return {
    partnerId: process.env.LINKEDIN_PARTNER_ID || 'XXXXXXX',
    conversionIds: {
      consultation_booking: 'XXXXXXX',
      attorney_contact: 'XXXXXXX',
      premium_signup: 'XXXXXXX'
    }
  };
}