import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { db, pool } from "./db";
import { sql } from "drizzle-orm";
import { insertConsultationSchema, insertEmergencyConsultationSchema, attorneys, emergencyConsultations } from "@shared/schema";
import { eq, ilike, and, or } from "drizzle-orm";
import { z } from "zod";
import { analyzeCareerTransition, type CareerAssessmentRequest, getLegalAssistantResponse, type LegalAssistantRequest } from "./openai";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { handleRSSFeed, handleJSONFeed } from "./rss";
import { twilioService, type EmergencyAlert } from "./twilio";
import { cdnService, cacheMiddleware } from "./cdn";
import gamificationRoutes from "./gamification-routes";
import { 
  generateStructuredData, 
  generateMetaTags, 
  handleSearchEngineVerification,
  generateBreadcrumbs,
  generateFAQStructuredData
} from "./seo";
import Stripe from "stripe";
import path from "path";
import fs from "fs";
// Note: Using CommonJS-style __dirname for this TypeScript compilation

// Initialize Stripe only if the secret key is available
let stripe: Stripe | null = null;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
}

// VA Disability Compensation rates (2024)
function calculateDisabilityCompensation(disabilityRating: number, dependents: { spouse: boolean; children: number }): number {
  const baseRates: { [key: number]: number } = {
    10: 171,
    20: 338,
    30: 524,
    40: 755,
    50: 1075,
    60: 1361,
    70: 1663,
    80: 1933,
    90: 2172,
    100: 3737
  };

  let compensation = baseRates[disabilityRating] || 0;
  
  // Add dependent compensation for ratings 30% and above
  if (disabilityRating >= 30) {
    const dependentRates: { [key: number]: { spouse: number; child: number } } = {
      30: { spouse: 62, child: 32 },
      40: { spouse: 83, child: 42 },
      50: { spouse: 103, child: 52 },
      60: { spouse: 123, child: 62 },
      70: { spouse: 143, child: 72 },
      80: { spouse: 163, child: 82 },
      90: { spouse: 183, child: 92 },
      100: { spouse: 203, child: 102 }
    };
    
    const rates = dependentRates[disabilityRating];
    if (rates) {
      if (dependents.spouse) {
        compensation += rates.spouse;
      }
      compensation += rates.child * dependents.children;
    }
  }
  
  return compensation;
}

function getStateBenefits(state: string): any[] {
  // Simplified state benefits - in real app this would come from database
  const stateBenefits = {
    "CA": [
      { name: "California Disabled Veteran Property Tax Exemption", amount: "Up to $196,264 exemption" },
      { name: "CalVet Home Loans", amount: "Low-interest home loans" }
    ],
    "TX": [
      { name: "Hazlewood Act", amount: "Free tuition at state universities" },
      { name: "Property Tax Exemption", amount: "Up to $12,000 exemption" }
    ],
    "FL": [
      { name: "Disabled Veteran Property Tax Discount", amount: "Up to $5,000 discount" },
      { name: "Driver License Fee Waiver", amount: "$48 savings" }
    ]
  };
  
  return stateBenefits[state as keyof typeof stateBenefits] || [];
}

// Comprehensive benefits calculation function
function calculateComprehensiveBenefits(eligibilityData: any) {
  const { personalInfo, disabilityInfo } = eligibilityData;
  
  // Calculate VA Disability Compensation
  const vaDisabilityEligible = disabilityInfo.rating > 0;
  const monthlyDisability = vaDisabilityEligible ? 
    calculateDisabilityCompensation(disabilityInfo.rating, personalInfo.dependents) : 0;
  const dependentAllowance = vaDisabilityEligible && disabilityInfo.rating >= 30 ? 
    (personalInfo.dependents.spouse ? 62 : 0) + (personalInfo.dependents.children * 32) : 0;
  
  // Calculate Retirement Eligibility
  const retirementEligible = personalInfo.yearsOfService >= 20 || 
    (personalInfo.activeStatus === 'veteran' && personalInfo.yearsOfService >= 20);
  const monthlyRetirement = retirementEligible ? 
    Math.round(2500 * (personalInfo.yearsOfService * 0.025)) : 0; // Simplified calculation
  
  // Calculate Education Benefits (GI Bill)
  const giEligible = personalInfo.yearsOfService >= 2 || personalInfo.activeStatus === 'veteran';
  const educationMonths = Math.min(36, personalInfo.yearsOfService * 3); // Up to 36 months
  const housingAllowance = giEligible ? 2200 : 0; // Average BAH
  const bookStipend = giEligible ? 1200 : 0; // Annual
  const transferable = personalInfo.yearsOfService >= 6;
  
  // Calculate Healthcare Eligibility
  const vaHealthcareEligible = personalInfo.yearsOfService >= 2 || disabilityInfo.rating > 0;
  const tricareEligible = personalInfo.activeStatus === 'active' || personalInfo.activeStatus === 'retired';
  const priorityGroup = disabilityInfo.rating >= 50 ? 1 : 
    (disabilityInfo.rating >= 30 ? 2 : 
    (disabilityInfo.combatRelated ? 3 : 5));
  
  // Calculate Other Benefits
  const lifeInsurance = personalInfo.activeStatus === 'active' ? 400000 : 0; // SGLI
  const homeLoansEligible = personalInfo.yearsOfService >= 2 || personalInfo.activeStatus === 'veteran';
  const vocationalRehab = disabilityInfo.rating >= 30;
  const dependentEducation = personalInfo.yearsOfService >= 10 && personalInfo.dependents.children > 0;
  
  return {
    vaDisability: {
      monthlyPayment: monthlyDisability,
      eligible: vaDisabilityEligible,
      dependentAllowance: dependentAllowance,
      totalMonthly: monthlyDisability + dependentAllowance
    },
    retirement: {
      eligible: retirementEligible,
      monthlyPension: monthlyRetirement,
      lumpSum: retirementEligible ? monthlyRetirement * 12 * 5 : 0, // 5 year equivalent
      survivorBenefits: retirementEligible ? monthlyRetirement * 0.55 : 0
    },
    education: {
      giEligible: giEligible,
      months: educationMonths,
      housingAllowance: housingAllowance,
      bookStipend: bookStipend,
      transferable: transferable
    },
    healthcare: {
      vaHealthcare: vaHealthcareEligible,
      tricare: tricareEligible,
      dental: tricareEligible || disabilityInfo.rating >= 100,
      vision: disabilityInfo.rating >= 100,
      priorityGroup: priorityGroup
    },
    other: {
      lifeInsurance: lifeInsurance,
      homeLoans: homeLoansEligible,
      vocationalRehab: vocationalRehab,
      dependentEducation: dependentEducation
    }
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication middleware
  await setupAuth(app);
  
  // Domain verification endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: "healthy",
      domain: req.hostname,
      application: "MilitaryLegalShield",
      verified: true,
      timestamp: new Date().toISOString(),
      version: "2.0.0",
      features: ["high-converting-landing", "world-clock", "faq-accordion"]
    });
  });
  // Public access - no authentication
  
  // Apply CDN cache headers to static assets
  app.use('/assets', cacheMiddleware);
  app.use('/images', cacheMiddleware);
  app.use('/fonts', cacheMiddleware);

  // RSS Feed routes
  app.get('/rss.xml', handleRSSFeed);
  app.get('/feed.xml', handleRSSFeed);
  app.get('/feed.json', handleJSONFeed);

  // SEO and Search Engine routes
  app.get('/sitemap.xml', (req, res) => {
    res.type('application/xml');
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://militarylegalshield.com/</loc>
    <lastmod>2025-01-16</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://militarylegalshield.com/urgent-match</loc>
    <lastmod>2025-01-16</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://militarylegalshield.com/lawyer-database</loc>
    <lastmod>2025-01-16</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://militarylegalshield.com/legal-challenges</loc>
    <lastmod>2025-01-16</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://militarylegalshield.com/emergency-consultation</loc>
    <lastmod>2025-01-16</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://militarylegalshield.com/document-generator</loc>
    <lastmod>2025-01-16</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://militarylegalshield.com/military-justice</loc>
    <lastmod>2025-01-16</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://militarylegalshield.com/consultation-booking</loc>
    <lastmod>2025-01-16</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://militarylegalshield.com/benefits-eligibility</loc>
    <lastmod>2025-01-16</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://militarylegalshield.com/rss.xml</loc>
    <lastmod>2025-01-16</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.5</priority>
  </url>
</urlset>`;
    res.send(sitemap);
  });

  app.get('/robots.txt', (req, res) => {
    res.type('text/plain');
    const robots = `User-agent: *
Allow: /

Sitemap: https://militarylegalshield.com/sitemap.xml

User-agent: Googlebot
Allow: /
Crawl-delay: 1

User-agent: Bingbot
Allow: /
Crawl-delay: 1

User-agent: Slurp
Allow: /
Crawl-delay: 1

Disallow: /admin/
Disallow: /api/
Allow: /rss.xml
Allow: /feed.xml`;
    res.send(robots);
  });

  // Search engine verification files
  app.get('/:filename(google.*\\.html|BingSiteAuth\\.xml|yahoo.*\\.html|yandex.*\\.html)', handleSearchEngineVerification);

  // Structured data endpoints for enhanced search visibility
  app.get('/api/seo/structured-data/:page', (req, res) => {
    const { page } = req.params;
    const structuredData = generateStructuredData(page);
    res.json(structuredData);
  });

  app.get('/api/seo/meta-tags/:page', (req, res) => {
    const { page } = req.params;
    const metaTags = generateMetaTags(page);
    res.json(metaTags);
  });

  app.get('/api/seo/breadcrumbs', (req, res) => {
    const path = req.query.path as string || '/';
    const breadcrumbs = generateBreadcrumbs(path);
    res.json(breadcrumbs);
  });

  app.get('/api/seo/faq', (req, res) => {
    const faqData = generateFAQStructuredData();
    res.json(faqData);
  });

  // Gamification routes
  app.use(gamificationRoutes);

  // Health check endpoint - add explicit API prefix
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString(), service: 'MilitaryLegalShield' });
  });
  
  // Attorney search endpoint - returns authentic military defense attorneys
  app.get("/api/attorneys", async (req, res) => {
    try {
      res.setHeader('Content-Type', 'application/json');
      const { search, state, emergencyOnly } = req.query;
      
      const attorneys = await storage.getAttorneys();
      let filteredAttorneys = attorneys;

      if (search) {
        const searchTerm = (search as string).toLowerCase();
        filteredAttorneys = filteredAttorneys.filter(attorney => 
          attorney.firstName.toLowerCase().includes(searchTerm) ||
          attorney.lastName.toLowerCase().includes(searchTerm) ||
          (attorney.firmName && attorney.firmName.toLowerCase().includes(searchTerm))
        );
      }
      
      if (state && state !== "All States") {
        filteredAttorneys = filteredAttorneys.filter(attorney => attorney.state === state);
      }
      
      if (emergencyOnly === 'true') {
        filteredAttorneys = filteredAttorneys.filter(attorney => attorney.availableForEmergency);
      }

      // Sort by rating and review count
      filteredAttorneys.sort((a, b) => {
        if (b.rating !== a.rating) return b.rating - a.rating;
        return b.reviewCount - a.reviewCount;
      });

      res.status(200).json(filteredAttorneys);
    } catch (error) {
      console.error("Error fetching attorneys:", error);
      res.setHeader('Content-Type', 'application/json');
      res.status(500).json({ message: "Failed to fetch attorneys" });
    }
  });

  app.get("/api/attorneys/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const result = await pool.query('SELECT * FROM attorneys WHERE id = $1', [id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ message: "Attorney not found" });
      }
      
      res.json(result.rows[0]);
    } catch (error) {
      console.error("Error fetching attorney:", error);
      res.status(500).json({ message: "Failed to fetch attorney" });
    }
  });

  // Benefits calculator endpoint
  app.post("/api/calculate-benefits", async (req, res) => {
    try {
      const { disabilityRating, dependents, state, additionalInfo } = req.body;
      
      const monthlyCompensation = calculateDisabilityCompensation(disabilityRating, dependents);
      const annualCompensation = monthlyCompensation * 12;
      const stateBenefits = getStateBenefits(state);
      
      res.json({
        monthlyCompensation,
        annualCompensation,
        stateBenefits,
        totalEstimatedValue: annualCompensation + 2000 // Rough estimate including state benefits
      });
    } catch (error) {
      console.error("Error calculating benefits:", error);
      res.status(500).json({ message: "Failed to calculate benefits" });
    }
  });

  // Legal Assistant Chatbot API - Multiple endpoints for fallback
  app.post("/api/legal-assistant/chat", async (req, res) => {
    try {
      const { message, context, userId, conversationHistory } = req.body;
      
      const assistantRequest: LegalAssistantRequest = {
        message,
        context: context || "military_legal",
        userId: userId || "guest",
        conversationHistory: conversationHistory || []
      };
      
      const response = await getLegalAssistantResponse(assistantRequest);
      res.json(response);
    } catch (error: any) {
      console.error("Legal assistant chat error:", error);
      res.status(500).json({ 
        message: "Legal assistant temporarily unavailable",
        error: error.message 
      });
    }
  });

  // Fallback endpoint for legal assistant
  app.post("/api/legal-assistant", async (req, res) => {
    try {
      const { message, context, conversationHistory } = req.body;
      
      const assistantRequest: LegalAssistantRequest = {
        message,
        context: context || "military_legal",
        userId: "guest",
        conversationHistory: conversationHistory || []
      };
      
      const response = await getLegalAssistantResponse(assistantRequest);
      res.json(response);
    } catch (error: any) {
      console.error("Legal assistant error:", error);
      res.status(500).json({ 
        message: "Legal assistant temporarily unavailable",
        error: error.message 
      });
    }
  });

  // Emergency consultation booking endpoint
  app.post("/api/emergency-consultation", async (req, res) => {
    try {
      // Validate request data
      const consultationData = insertEmergencyConsultationSchema.parse(req.body);
      
      // Insert emergency consultation into database
      const [consultation] = await db
        .insert(emergencyConsultations)
        .values({
          ...consultationData,
          status: "pending",
          createdAt: new Date(),
          updatedAt: new Date()
        })
        .returning();

      // Find available emergency attorneys based on legal issue and location
      const availableAttorneys = await db
        .select()
        .from(attorneys)
        .where(
          and(
            eq(attorneys.availableForEmergency, true),
            eq(attorneys.isActive, true)
          )
        )
        .limit(3);

      // Auto-assign to highest rated available attorney if any found
      if (availableAttorneys.length > 0) {
        const assignedAttorney = availableAttorneys[0]; // Highest rated due to default ordering
        
        await db
          .update(emergencyConsultations)
          .set({
            assignedAttorneyId: assignedAttorney.id,
            status: "assigned",
            updatedAt: new Date()
          })
          .where(eq(emergencyConsultations.id, consultation.id));

        // Send SMS notification to assigned attorney and client
        const emergencyAlert: EmergencyAlert = {
          fullName: consultationData.fullName,
          rank: consultationData.rank || 'Unknown',
          branch: consultationData.branch || 'Unknown',
          phoneNumber: consultationData.phone,
          legalIssue: consultationData.legalIssue,
          urgencyLevel: consultationData.urgencyLevel as 'critical' | 'high' | 'medium',
          location: consultationData.preferredContactMethod,
          additionalDetails: consultationData.description || ''
        };

        // Send emergency alert via SMS
        await twilioService.sendEmergencyAlert(emergencyAlert);
        // 3. Calendar scheduling integration
        // 4. Emergency response workflow activation
        
        console.log(`Emergency consultation ${consultation.id} assigned to attorney ${assignedAttorney.id}`);
      }

      res.status(201).json({
        success: true,
        consultationId: consultation.id,
        message: "Emergency consultation request submitted successfully",
        estimatedResponseTime: consultationData.urgencyLevel === "immediate" ? "30 minutes" : 
                              consultationData.urgencyLevel === "urgent" ? "2 hours" : "4 hours",
        assignedAttorney: availableAttorneys.length > 0 ? {
          name: `${availableAttorneys[0].firstName} ${availableAttorneys[0].lastName}`,
          firmName: availableAttorneys[0].firmName,
          specialties: availableAttorneys[0].specialties
        } : null
      });

    } catch (error) {
      console.error("Error processing emergency consultation:", error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Invalid request data",
          errors: error.errors
        });
      }

      res.status(500).json({
        success: false,
        message: "Failed to process emergency consultation request"
      });
    }
  });

  // Career assessment endpoint
  app.post("/api/career-assessment", async (req, res) => {
    try {
      const assessment: CareerAssessmentRequest = req.body.assessment;
      const analysis = await analyzeCareerTransition(assessment);
      res.json(analysis);
    } catch (error) {
      console.error("Error with career assessment:", error);
      res.status(500).json({ message: "Failed to complete career assessment" });
    }
  });

  // Get attorneys with availability for consultation booking
  app.get("/api/availability/attorneys", async (req, res) => {
    try {
      res.setHeader('Content-Type', 'application/json');
      const { date, specialty, consultationType } = req.query;
      const attorneys = await storage.getAttorneysWithAvailability(
        date as string || new Date().toISOString().split('T')[0],
        specialty as string,
        consultationType as string
      );
      res.status(200).json(attorneys);
    } catch (error) {
      console.error("Error fetching attorney availability:", error);
      res.setHeader('Content-Type', 'application/json');
      res.status(500).json({ message: "Failed to fetch attorney availability" });
    }
  });

  // PREMIUM FEATURE: Book consultation endpoint
  app.post("/api/consultations/book", isAuthenticated, async (req: any, res) => {
    try {
      // Check if user has premium access
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user || user.subscriptionTier === 'free') {
        return res.status(403).json({ 
          message: "This is a premium feature. Please upgrade your subscription to book consultations.",
          requiresUpgrade: true
        });
      }

      const { booking } = req.body;
      
      if (!booking || !booking.attorneyId || !booking.clientName || !booking.clientEmail) {
        return res.status(400).json({ message: "Missing required booking information" });
      }

      const consultation = await storage.createConsultationBooking(booking);
      
      // Update time slot availability
      if (booking.timeSlotId) {
        await storage.updateTimeSlotAvailability(booking.timeSlotId, false);
      }

      res.json({
        success: true,
        consultationId: consultation.id,
        message: "Consultation booked successfully"
      });
    } catch (error) {
      console.error("Error booking consultation:", error);
      res.status(500).json({ message: "Failed to book consultation" });
    }
  });

  // Benefits eligibility calculation endpoint
  app.post("/api/calculate-benefits-eligibility", async (req, res) => {
    try {
      const eligibilityData = req.body;
      const calculations = calculateComprehensiveBenefits(eligibilityData);
      res.json(calculations);
    } catch (error) {
      console.error("Benefits calculation error:", error);
      res.status(500).json({ message: "Failed to calculate benefits eligibility" });
    }
  });

  // Stripe subscription management endpoints
  
  // Create subscription checkout session
  app.post("/api/create-subscription", isAuthenticated, async (req: any, res) => {
    try {
      if (!stripe) {
        return res.status(500).json({ message: "Payment processing not available" });
      }

      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user || !user.email) {
        return res.status(400).json({ message: "User email required for subscription" });
      }

      // Create or retrieve Stripe customer
      let customerId = user.stripeCustomerId;
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: user.email,
          metadata: { userId: userId }
        });
        customerId = customer.id;
        await storage.updateUserStripeInfo(userId, customerId, null);
      }

      // Create checkout session for premium subscription
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'MilitaryLegalShield Premium',
                description: 'Access to attorney consultations, document review, case tracking, and priority support'
              },
              recurring: {
                interval: 'month'
              },
              unit_amount: 2999 // $29.99/month
            },
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${req.protocol}://${req.hostname}/subscription-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.protocol}://${req.hostname}/pricing`,
        metadata: {
          userId: userId
        }
      });

      res.json({ sessionId: session.id, url: session.url });
    } catch (error) {
      console.error("Error creating subscription:", error);
      res.status(500).json({ message: "Failed to create subscription" });
    }
  });

  // Handle Stripe webhooks
  app.post("/api/stripe-webhook", express.raw({type: 'application/json'}), async (req, res) => {
    if (!stripe) {
      return res.status(500).json({ error: "Payment processing not available" });
    }

    const sig = req.headers['stripe-signature'];
    if (!sig) {
      return res.status(400).send('Missing stripe signature');
    }

    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET || 'dummy');
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return res.status(400).send(`Webhook Error: ${err}`);
    }

    try {
      switch (event.type) {
        case 'checkout.session.completed':
          const session = event.data.object;
          const userId = session.metadata?.userId;
          if (userId && session.subscription) {
            await storage.updateUserSubscription(userId, 'premium', 'active', session.subscription as string);
          }
          break;

        case 'invoice.payment_succeeded':
          const invoice = event.data.object as any;
          if (invoice.subscription && invoice.customer) {
            const invoiceCustomer = await stripe.customers.retrieve(invoice.customer as string);
            const invoiceUserId = (invoiceCustomer as any).metadata?.userId;
            if (invoiceUserId) {
              await storage.updateUserSubscription(invoiceUserId, 'premium', 'active', invoice.subscription as string);
            }
          }
          break;

        case 'customer.subscription.deleted':
          const subscription = event.data.object as any;
          const subscriptionCustomer = await stripe.customers.retrieve(subscription.customer as string);
          const subscriptionUserId = (subscriptionCustomer as any).metadata?.userId;
          if (subscriptionUserId) {
            await storage.updateUserSubscription(subscriptionUserId, 'free', 'cancelled', null);
          }
          break;
      }

      res.json({received: true});
    } catch (error) {
      console.error('Webhook processing error:', error);
      res.status(500).json({ error: 'Webhook processing failed' });
    }
  });

  // Get user subscription status
  app.get("/api/subscription-status", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const isPremium = (user.subscriptionTier === 'premium' && user.subscriptionStatus === 'active') ||
                       user.subscriptionStatus === 'premium' ||
                       (user.stripeSubscriptionId && user.subscriptionStatus !== 'cancelled');

      res.json({
        subscriptionTier: user.subscriptionTier || 'free',
        subscriptionStatus: user.subscriptionStatus || 'free',
        subscription_status: user.subscriptionStatus || 'free',
        status: user.subscriptionStatus || 'free',
        isPremium,
        stripeCustomerId: user.stripeCustomerId,
        stripeSubscriptionId: user.stripeSubscriptionId,
        plan: isPremium ? 'premium' : 'free'
      });
    } catch (error) {
      console.error("Error fetching subscription status:", error);
      res.status(500).json({ message: "Failed to fetch subscription status" });
    }
  });

  // Cancel subscription
  app.post("/api/cancel-subscription", isAuthenticated, async (req: any, res) => {
    try {
      if (!stripe) {
        return res.status(500).json({ message: "Payment processing not available" });
      }

      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user || !user.stripeSubscriptionId) {
        return res.status(404).json({ message: "No active subscription found" });
      }

      await stripe.subscriptions.update(user.stripeSubscriptionId, {
        cancel_at_period_end: true
      });

      res.json({ message: "Subscription will be cancelled at period end" });
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      res.status(500).json({ message: "Failed to cancel subscription" });
    }
  });

  // WebSocket server for video consultation
  const httpServer = createServer(app);
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  // Store active connections
  const activeConnections = new Map<string, WebSocket>();
  const roomParticipants = new Map<string, Set<string>>();

  wss.on('connection', (ws: WebSocket) => {
    let connectionId: string | null = null;
    let currentRoom: string | null = null;

    ws.on('message', (message: Buffer) => {
      try {
        const data = JSON.parse(message.toString());
        
        switch (data.type) {
          case 'join-call':
            handleJoinCall(ws, data);
            break;
          case 'signal':
            relaySignalingMessage(ws, data);
            break;
          case 'leave-call':
            handleLeaveCall(ws, data);
            break;
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      handleDisconnect(ws);
    });

    function handleJoinCall(ws: WebSocket, data: any) {
      connectionId = data.connectionId;
      currentRoom = data.roomId;
      
      activeConnections.set(connectionId, ws);
      
      if (!roomParticipants.has(currentRoom)) {
        roomParticipants.set(currentRoom, new Set());
      }
      roomParticipants.get(currentRoom)!.add(connectionId);
      
      // Notify other participants
      broadcastToRoom(currentRoom, {
        type: 'participant-joined',
        connectionId,
        participantCount: roomParticipants.get(currentRoom)!.size
      }, connectionId);
    }

    function relaySignalingMessage(ws: WebSocket, data: any) {
      const targetConnection = activeConnections.get(data.targetId);
      if (targetConnection && targetConnection.readyState === WebSocket.OPEN) {
        targetConnection.send(JSON.stringify({
          type: 'signal',
          fromId: connectionId,
          signal: data.signal
        }));
      }
    }

    function handleLeaveCall(ws: WebSocket, data: any) {
      if (connectionId && currentRoom) {
        roomParticipants.get(currentRoom)?.delete(connectionId);
        activeConnections.delete(connectionId);
        
        broadcastToRoom(currentRoom, {
          type: 'participant-left',
          connectionId,
          participantCount: roomParticipants.get(currentRoom)?.size || 0
        }, connectionId);
      }
    }

    function handleDisconnect(ws: WebSocket) {
      if (connectionId && currentRoom) {
        roomParticipants.get(currentRoom)?.delete(connectionId);
        activeConnections.delete(connectionId);
        
        broadcastToRoom(currentRoom, {
          type: 'participant-left',
          connectionId,
          participantCount: roomParticipants.get(currentRoom)?.size || 0
        }, connectionId);
      }
    }

    function broadcastToRoom(roomId: string, message: any, excludeId?: string) {
      const participants = roomParticipants.get(roomId);
      if (participants) {
        participants.forEach(participantId => {
          if (participantId !== excludeId) {
            const connection = activeConnections.get(participantId);
            if (connection && connection.readyState === WebSocket.OPEN) {
              connection.send(JSON.stringify(message));
            }
          }
        });
      }
    }
  });

  // Twilio SMS webhook for incoming messages
  app.post('/api/sms/webhook', express.urlencoded({ extended: false }), async (req, res) => {
    try {
      const { From, Body } = req.body;
      const response = await twilioService.handleIncomingSMS(From, Body);
      
      // Send TwiML response
      res.type('text/xml');
      res.send(`<?xml version="1.0" encoding="UTF-8"?>
        <Response>
          <Message>${response}</Message>
        </Response>`);
    } catch (error) {
      console.error('SMS webhook error:', error);
      res.status(500).send('Error processing SMS');
    }
  });

  // Send appointment reminder SMS
  app.post('/api/sms/appointment-reminder', async (req, res) => {
    try {
      const { phoneNumber, appointmentDetails } = req.body;
      const success = await twilioService.sendAppointmentReminder(phoneNumber, appointmentDetails);
      res.json({ success });
    } catch (error) {
      console.error('Appointment reminder error:', error);
      res.status(500).json({ error: 'Failed to send appointment reminder' });
    }
  });

  // Send case update SMS
  app.post('/api/sms/case-update', async (req, res) => {
    try {
      const { phoneNumber, caseUpdate } = req.body;
      const success = await twilioService.sendCaseUpdate(phoneNumber, caseUpdate);
      res.json({ success });
    } catch (error) {
      console.error('Case update SMS error:', error);
      res.status(500).json({ error: 'Failed to send case update' });
    }
  });

  // Send welcome SMS for new users
  app.post('/api/sms/welcome', async (req, res) => {
    try {
      const { phoneNumber, serviceMemberName } = req.body;
      const success = await twilioService.sendWelcomeSMS(phoneNumber, serviceMemberName);
      res.json({ success });
    } catch (error) {
      console.error('Welcome SMS error:', error);
      res.status(500).json({ error: 'Failed to send welcome SMS' });
    }
  });

  // CDN and Cloudflare management endpoints
  app.post('/api/cdn/purge-cache', async (req, res) => {
    try {
      const { urls } = req.body;
      if (!urls || !Array.isArray(urls)) {
        return res.status(400).json({ error: 'URLs array required' });
      }

      const success = await cdnService.purgeCache(urls);
      res.json({ success, purgedUrls: urls.length });
    } catch (error) {
      console.error('Cache purge error:', error);
      res.status(500).json({ error: 'Failed to purge cache' });
    }
  });

  // Get CDN asset URL with optimization
  app.post('/api/cdn/asset-url', async (req, res) => {
    try {
      const { assetPath, optimization } = req.body;
      if (!assetPath) {
        return res.status(400).json({ error: 'Asset path required' });
      }

      let url;
      if (optimization && (optimization.width || optimization.height)) {
        url = cdnService.getResponsiveImageUrl(assetPath, optimization);
      } else {
        url = cdnService.getAssetUrl(assetPath);
      }

      res.json({ url, original: assetPath });
    } catch (error) {
      console.error('Asset URL generation error:', error);
      res.status(500).json({ error: 'Failed to generate asset URL' });
    }
  });

  // CDN performance metrics endpoint
  app.get('/api/cdn/metrics', async (req, res) => {
    try {
      const metrics = {
        cdnEnabled: !!process.env.CDN_DOMAIN,
        cloudflareEnabled: !!(process.env.CLOUDFLARE_ZONE_ID && process.env.CLOUDFLARE_API_TOKEN),
        cdnDomain: process.env.CDN_DOMAIN || 'Not configured',
        cacheHeaders: {
          images: '1 year',
          fonts: '1 year',
          css: '1 year (immutable)',
          js: '1 year (immutable)',
          html: '1 hour'
        },
        features: {
          imageOptimization: true,
          autoMinify: true,
          brotliCompression: true,
          http2Push: true,
          preloadHeaders: true,
          securityHeaders: true
        }
      };

      res.json(metrics);
    } catch (error) {
      console.error('CDN metrics error:', error);
      res.status(500).json({ error: 'Failed to get CDN metrics' });
    }
  });

  return httpServer;
}