import { Request, Response } from 'express';
import { db } from './db';
import { referrals, marketingCampaigns, socialShares, seoMetrics } from '@shared/schema';
import { eq, desc, count, sum, and, gte } from 'drizzle-orm';

export interface ReferralData {
  referrerUserId: string;
  referredEmail: string;
  referralCode: string;
  campaignId?: string;
  source: 'email' | 'social' | 'direct' | 'affiliate';
  metadata?: {
    socialPlatform?: string;
    campaignName?: string;
    incentiveType?: string;
  };
}

export interface SEOMetrics {
  page: string;
  keywords: string[];
  impressions: number;
  clicks: number;
  avgPosition: number;
  ctr: number;
  conversionRate: number;
  organicTraffic: number;
}

export interface SocialShareData {
  platform: 'facebook' | 'twitter' | 'linkedin' | 'instagram' | 'tiktok';
  contentType: 'attorney-match' | 'emergency-booking' | 'legal-guide' | 'success-story';
  contentId: string;
  userId?: string;
  shareText: string;
  shareUrl: string;
  engagement: {
    likes: number;
    shares: number;
    comments: number;
    clickThroughs: number;
  };
}

export interface MarketingCampaign {
  name: string;
  type: 'social' | 'email' | 'ppc' | 'content' | 'referral';
  status: 'active' | 'paused' | 'completed';
  budget: number;
  spend: number;
  targetAudience: {
    demographics: string[];
    interests: string[];
    militaryBranches: string[];
    locations: string[];
  };
  performance: {
    impressions: number;
    clicks: number;
    conversions: number;
    cost: number;
    roi: number;
  };
  startDate: Date;
  endDate?: Date;
}

class MarketingIntegrationService {
  // Referral System
  async createReferral(data: ReferralData): Promise<{ success: boolean; referralId?: number; error?: string }> {
    try {
      const [referral] = await db.insert(referrals).values({
        referrerUserId: data.referrerUserId,
        referredEmail: data.referredEmail,
        referralCode: data.referralCode,
        source: data.source,
        campaignId: data.campaignId,
        metadata: data.metadata,
        status: 'pending',
        createdAt: new Date()
      }).returning();

      return { success: true, referralId: referral.id };
    } catch (error) {
      console.error('Error creating referral:', error);
      return { success: false, error: 'Failed to create referral' };
    }
  }

  async trackReferralConversion(referralCode: string, newUserId: string): Promise<{ success: boolean; reward?: number }> {
    try {
      const [referral] = await db.select().from(referrals).where(eq(referrals.referralCode, referralCode));
      
      if (!referral) {
        return { success: false };
      }

      await db.update(referrals)
        .set({
          referredUserId: newUserId,
          status: 'completed',
          convertedAt: new Date()
        })
        .where(eq(referrals.id, referral.id));

      // Calculate reward based on conversion type
      const rewardAmount = this.calculateReferralReward(referral.source);
      
      return { success: true, reward: rewardAmount };
    } catch (error) {
      console.error('Error tracking referral conversion:', error);
      return { success: false };
    }
  }

  private calculateReferralReward(source: string): number {
    const rewards = {
      'social': 25,
      'email': 15,
      'direct': 20,
      'affiliate': 50
    };
    return rewards[source as keyof typeof rewards] || 10;
  }

  async getReferralStats(userId: string): Promise<{
    totalReferrals: number;
    completedReferrals: number;
    totalRewards: number;
    topPerformingSource: string;
  }> {
    try {
      const stats = await db.select({
        totalReferrals: count(referrals.id),
        source: referrals.source
      })
      .from(referrals)
      .where(eq(referrals.referrerUserId, userId))
      .groupBy(referrals.source);

      const completed = await db.select({ count: count(referrals.id) })
        .from(referrals)
        .where(and(
          eq(referrals.referrerUserId, userId),
          eq(referrals.status, 'completed')
        ));

      return {
        totalReferrals: stats.reduce((sum, stat) => sum + stat.totalReferrals, 0),
        completedReferrals: completed[0]?.count || 0,
        totalRewards: completed[0]?.count * 25 || 0, // Average reward
        topPerformingSource: stats.sort((a, b) => b.totalReferrals - a.totalReferrals)[0]?.source || 'none'
      };
    } catch (error) {
      console.error('Error getting referral stats:', error);
      return { totalReferrals: 0, completedReferrals: 0, totalRewards: 0, topPerformingSource: 'none' };
    }
  }

  // SEO Optimization
  async trackSEOMetrics(data: SEOMetrics): Promise<{ success: boolean }> {
    try {
      await db.insert(seoMetrics).values({
        page: data.page,
        keywords: data.keywords,
        impressions: data.impressions,
        clicks: data.clicks,
        avgPosition: data.avgPosition,
        ctr: data.ctr,
        conversionRate: data.conversionRate,
        organicTraffic: data.organicTraffic,
        trackedAt: new Date()
      });

      return { success: true };
    } catch (error) {
      console.error('Error tracking SEO metrics:', error);
      return { success: false };
    }
  }

  async getSEOReport(timeRange: 'week' | 'month' | 'quarter' = 'month'): Promise<{
    totalImpressions: number;
    totalClicks: number;
    avgCTR: number;
    avgPosition: number;
    topKeywords: Array<{ keyword: string; clicks: number; position: number }>;
    topPages: Array<{ page: string; clicks: number; impressions: number }>;
  }> {
    try {
      const days = timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 90;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const metrics = await db.select()
        .from(seoMetrics)
        .where(gte(seoMetrics.trackedAt, startDate))
        .orderBy(desc(seoMetrics.trackedAt));

      const totalImpressions = metrics.reduce((sum, m) => sum + m.impressions, 0);
      const totalClicks = metrics.reduce((sum, m) => sum + m.clicks, 0);
      const avgCTR = totalClicks > 0 ? (totalClicks / totalImpressions) * 100 : 0;
      const avgPosition = metrics.reduce((sum, m) => sum + m.avgPosition, 0) / Math.max(metrics.length, 1);

      // Process keywords and pages data
      const keywordMap = new Map();
      const pageMap = new Map();

      metrics.forEach(metric => {
        metric.keywords.forEach(keyword => {
          if (!keywordMap.has(keyword)) {
            keywordMap.set(keyword, { keyword, clicks: 0, position: 0, count: 0 });
          }
          const data = keywordMap.get(keyword);
          data.clicks += metric.clicks;
          data.position += metric.avgPosition;
          data.count++;
        });

        if (!pageMap.has(metric.page)) {
          pageMap.set(metric.page, { page: metric.page, clicks: 0, impressions: 0 });
        }
        const pageData = pageMap.get(metric.page);
        pageData.clicks += metric.clicks;
        pageData.impressions += metric.impressions;
      });

      const topKeywords = Array.from(keywordMap.values())
        .map(k => ({ ...k, position: k.position / k.count }))
        .sort((a, b) => b.clicks - a.clicks)
        .slice(0, 10);

      const topPages = Array.from(pageMap.values())
        .sort((a, b) => b.clicks - a.clicks)
        .slice(0, 10);

      return {
        totalImpressions,
        totalClicks,
        avgCTR,
        avgPosition,
        topKeywords,
        topPages
      };
    } catch (error) {
      console.error('Error generating SEO report:', error);
      return {
        totalImpressions: 0,
        totalClicks: 0,
        avgCTR: 0,
        avgPosition: 0,
        topKeywords: [],
        topPages: []
      };
    }
  }

  // Social Media Integration
  async trackSocialShare(data: SocialShareData): Promise<{ success: boolean; shareId?: number }> {
    try {
      const [share] = await db.insert(socialShares).values({
        platform: data.platform,
        contentType: data.contentType,
        contentId: data.contentId,
        userId: data.userId,
        shareText: data.shareText,
        shareUrl: data.shareUrl,
        likes: data.engagement.likes,
        shares: data.engagement.shares,
        comments: data.engagement.comments,
        clickThroughs: data.engagement.clickThroughs,
        sharedAt: new Date()
      }).returning();

      return { success: true, shareId: share.id };
    } catch (error) {
      console.error('Error tracking social share:', error);
      return { success: false };
    }
  }

  async getSocialEngagementReport(): Promise<{
    totalShares: number;
    totalEngagement: number;
    platformBreakdown: Array<{ platform: string; shares: number; engagement: number }>;
    topContent: Array<{ contentType: string; shares: number; engagement: number }>;
    viralityScore: number;
  }> {
    try {
      const shares = await db.select().from(socialShares);

      const totalShares = shares.length;
      const totalEngagement = shares.reduce((sum, s) => 
        sum + s.likes + s.shares + s.comments + s.clickThroughs, 0);

      // Platform breakdown
      const platformMap = new Map();
      shares.forEach(share => {
        if (!platformMap.has(share.platform)) {
          platformMap.set(share.platform, { platform: share.platform, shares: 0, engagement: 0 });
        }
        const data = platformMap.get(share.platform);
        data.shares++;
        data.engagement += share.likes + share.shares + share.comments + share.clickThroughs;
      });

      // Content type breakdown
      const contentMap = new Map();
      shares.forEach(share => {
        if (!contentMap.has(share.contentType)) {
          contentMap.set(share.contentType, { contentType: share.contentType, shares: 0, engagement: 0 });
        }
        const data = contentMap.get(share.contentType);
        data.shares++;
        data.engagement += share.likes + share.shares + share.comments + share.clickThroughs;
      });

      const viralityScore = totalShares > 0 ? (totalEngagement / totalShares) * 100 : 0;

      return {
        totalShares,
        totalEngagement,
        platformBreakdown: Array.from(platformMap.values()),
        topContent: Array.from(contentMap.values()).sort((a, b) => b.engagement - a.engagement),
        viralityScore
      };
    } catch (error) {
      console.error('Error generating social engagement report:', error);
      return {
        totalShares: 0,
        totalEngagement: 0,
        platformBreakdown: [],
        topContent: [],
        viralityScore: 0
      };
    }
  }

  // Marketing Campaign Management
  async createCampaign(campaign: Omit<MarketingCampaign, 'performance'>): Promise<{ success: boolean; campaignId?: number }> {
    try {
      const [newCampaign] = await db.insert(marketingCampaigns).values({
        name: campaign.name,
        type: campaign.type,
        status: campaign.status,
        budget: campaign.budget,
        spend: campaign.spend,
        targetAudience: campaign.targetAudience,
        impressions: 0,
        clicks: 0,
        conversions: 0,
        cost: 0,
        roi: 0,
        startDate: campaign.startDate,
        endDate: campaign.endDate,
        createdAt: new Date()
      }).returning();

      return { success: true, campaignId: newCampaign.id };
    } catch (error) {
      console.error('Error creating campaign:', error);
      return { success: false };
    }
  }

  async updateCampaignPerformance(campaignId: number, performance: MarketingCampaign['performance']): Promise<{ success: boolean }> {
    try {
      await db.update(marketingCampaigns)
        .set({
          impressions: performance.impressions,
          clicks: performance.clicks,
          conversions: performance.conversions,
          cost: performance.cost,
          roi: performance.roi,
          updatedAt: new Date()
        })
        .where(eq(marketingCampaigns.id, campaignId));

      return { success: true };
    } catch (error) {
      console.error('Error updating campaign performance:', error);
      return { success: false };
    }
  }

  // Generate marketing attribution tracking pixels
  generateTrackingPixel(campaignId: string, source: string): string {
    return `<img src="/api/marketing/track-pixel?campaign=${campaignId}&source=${source}&t=${Date.now()}" width="1" height="1" style="display:none;" />`;
  }

  // Generate UTM parameters for campaigns
  generateUTMParams(campaign: string, source: string, medium: string, content?: string): string {
    const params = new URLSearchParams({
      utm_campaign: campaign,
      utm_source: source,
      utm_medium: medium,
    });
    
    if (content) {
      params.set('utm_content', content);
    }
    
    return params.toString();
  }
}

const marketingService = new MarketingIntegrationService();

// API Endpoints
export async function createReferral(req: Request, res: Response) {
  try {
    const result = await marketingService.createReferral(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create referral' });
  }
}

export async function trackReferralConversion(req: Request, res: Response) {
  try {
    const { referralCode, userId } = req.body;
    const result = await marketingService.trackReferralConversion(referralCode, userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to track referral conversion' });
  }
}

export async function getReferralStats(req: Request, res: Response) {
  try {
    const { userId } = req.params;
    const stats = await marketingService.getReferralStats(userId);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get referral stats' });
  }
}

export async function trackSEOMetrics(req: Request, res: Response) {
  try {
    const result = await marketingService.trackSEOMetrics(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to track SEO metrics' });
  }
}

export async function getSEOReport(req: Request, res: Response) {
  try {
    const { timeRange } = req.query;
    const report = await marketingService.getSEOReport(timeRange as 'week' | 'month' | 'quarter');
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate SEO report' });
  }
}

export async function trackSocialShare(req: Request, res: Response) {
  try {
    const result = await marketingService.trackSocialShare(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to track social share' });
  }
}

export async function getSocialEngagementReport(req: Request, res: Response) {
  try {
    const report = await marketingService.getSocialEngagementReport();
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate social engagement report' });
  }
}

export async function createMarketingCampaign(req: Request, res: Response) {
  try {
    const result = await marketingService.createCampaign(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create marketing campaign' });
  }
}

export async function updateCampaignPerformance(req: Request, res: Response) {
  try {
    const { campaignId } = req.params;
    const result = await marketingService.updateCampaignPerformance(parseInt(campaignId), req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update campaign performance' });
  }
}

export async function trackPixel(req: Request, res: Response) {
  try {
    const { campaign, source } = req.query;
    
    // Track the pixel hit
    console.log(`Tracking pixel hit: Campaign ${campaign}, Source ${source}`);
    
    // Return a 1x1 transparent GIF
    const pixel = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
    res.setHeader('Content-Type', 'image/gif');
    res.setHeader('Content-Length', pixel.length);
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.end(pixel);
  } catch (error) {
    res.status(500).end();
  }
}

export async function generateShareableContent(req: Request, res: Response) {
  try {
    const { contentType, contentId } = req.body;
    
    const shareableContent = {
      'attorney-match': {
        title: "Found My Perfect Military Defense Attorney! 🎖️",
        description: "MilitaryLegalShield helped me connect with an experienced attorney who understands military law. Get matched in minutes!",
        image: "/assets/attorney-match-share.png",
        hashtags: ["#MilitaryLegal", "#VeteranSupport", "#LegalShield", "#MilitaryLaw"]
      },
      'emergency-booking': {
        title: "Emergency Legal Help When I Needed It Most 🚨",
        description: "24/7 emergency legal consultations for military personnel. Don't face legal challenges alone!",
        image: "/assets/emergency-legal-share.png",
        hashtags: ["#EmergencyLegal", "#MilitarySupport", "#LegalHelp", "#24/7Support"]
      },
      'legal-guide': {
        title: "Military Legal Rights Guide 📖",
        description: "Know your rights as a service member. Comprehensive legal guidance from military law experts.",
        image: "/assets/legal-guide-share.png",
        hashtags: ["#MilitaryRights", "#LegalEducation", "#ServiceMember", "#KnowYourRights"]
      },
      'success-story': {
        title: "Another Victory for Our Service Members! 🏆",
        description: "Real results from real military personnel. See how MilitaryLegalShield makes a difference.",
        image: "/assets/success-story-share.png",
        hashtags: ["#SuccessStory", "#MilitaryWin", "#LegalVictory", "#ProudToServe"]
      }
    };

    const content = shareableContent[contentType as keyof typeof shareableContent] || shareableContent['legal-guide'];
    
    res.json({
      ...content,
      shareUrl: `${req.protocol}://${req.get('host')}?utm_campaign=social_share&utm_source=organic&utm_medium=social&utm_content=${contentType}_${contentId}`,
      trackingPixel: marketingService.generateTrackingPixel(`social_${contentType}`, 'organic_social')
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate shareable content' });
  }
}

export { marketingService };