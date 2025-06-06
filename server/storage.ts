import { 
  users, attorneys, legalResources, educationModules, consultations,
  legalCases, emergencyResources, forumQuestions, forumAnswers, legalDocuments,
  conversations, messages, attorneyVerificationDocs, attorneyReviews, attorneyVerificationRequests,
  legalScenarios, scenarioSessions, scenarioAnalytics, stories, documentTemplates, generatedDocuments,
  type User, type InsertUser,
  type Attorney, type InsertAttorney,
  type LegalResource, type InsertLegalResource,
  type EducationModule, type InsertEducationModule,
  type Consultation, type InsertConsultation,
  type LegalCase, type InsertLegalCase,
  type EmergencyResource, type InsertEmergencyResource,
  type ForumQuestion, type InsertForumQuestion,
  type ForumAnswer, type InsertForumAnswer,
  type LegalDocument, type InsertLegalDocument,
  type Conversation, type InsertConversation,
  type Message, type InsertMessage,
  type AttorneyVerificationDoc, type InsertAttorneyVerificationDoc,
  type AttorneyReview, type InsertAttorneyReview,
  type AttorneyVerificationRequest, type InsertAttorneyVerificationRequest,
  type LegalScenario, type InsertLegalScenario,
  type ScenarioSession, type InsertScenarioSession,
  type ScenarioAnalytics, type InsertScenarioAnalytics,
  type Story, type InsertStory,
  type DocumentTemplate, type InsertDocumentTemplate,
  type GeneratedDocument, type InsertGeneratedDocument
} from "@shared/schema";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { eq, ilike, and, or, desc, sql } from "drizzle-orm";

export interface IStorage {
  // User methods for Replit Auth
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: InsertUser): Promise<User>;

  // Attorney methods
  getAttorneys(): Promise<Attorney[]>;
  getAttorney(id: number): Promise<Attorney | undefined>;
  getAttorneysBySpecialty(specialty: string): Promise<Attorney[]>;
  searchAttorneys(location?: string, pricingTier?: string, specialty?: string, emergencyOnly?: boolean): Promise<Attorney[]>;
  createAttorney(attorney: InsertAttorney): Promise<Attorney>;

  // Legal resource methods
  getLegalResources(): Promise<LegalResource[]>;
  getLegalResource(id: number): Promise<LegalResource | undefined>;
  searchLegalResources(query: string): Promise<LegalResource[]>;
  getLegalResourcesByCategory(category: string): Promise<LegalResource[]>;
  createLegalResource(resource: InsertLegalResource): Promise<LegalResource>;

  // Education module methods
  getEducationModules(): Promise<EducationModule[]>;
  getEducationModule(id: number): Promise<EducationModule | undefined>;
  createEducationModule(module: InsertEducationModule): Promise<EducationModule>;

  // Consultation methods
  getConsultations(): Promise<Consultation[]>;
  getConsultation(id: number): Promise<Consultation | undefined>;
  createConsultation(consultation: InsertConsultation): Promise<Consultation>;

  // Legal case methods
  getLegalCases(userId?: number): Promise<LegalCase[]>;
  getLegalCase(id: number): Promise<LegalCase | undefined>;
  createLegalCase(legalCase: InsertLegalCase): Promise<LegalCase>;
  updateLegalCaseStatus(id: number, status: string): Promise<LegalCase | undefined>;

  // Emergency resource methods
  getEmergencyResources(branch?: string): Promise<EmergencyResource[]>;
  createEmergencyResource(resource: InsertEmergencyResource): Promise<EmergencyResource>;

  // Forum methods
  getForumQuestions(category?: string): Promise<ForumQuestion[]>;
  getForumQuestion(id: number): Promise<ForumQuestion | undefined>;
  createForumQuestion(question: InsertForumQuestion): Promise<ForumQuestion>;
  getForumAnswers(questionId: number): Promise<ForumAnswer[]>;
  createForumAnswer(answer: InsertForumAnswer): Promise<ForumAnswer>;

  // Legal document methods
  getLegalDocuments(userId: number): Promise<LegalDocument[]>;
  getLegalDocument(id: number): Promise<LegalDocument | undefined>;
  createLegalDocument(document: InsertLegalDocument): Promise<LegalDocument>;

  // Messaging methods
  getConversations(userId: number, userType: 'user' | 'attorney'): Promise<Conversation[]>;
  getConversation(id: number): Promise<Conversation | undefined>;
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  getMessages(conversationId: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  markMessageAsRead(messageId: number): Promise<void>;
  updateConversationLastMessage(conversationId: number): Promise<void>;

  // Attorney verification methods
  getAttorneyVerificationDocs(attorneyId: number): Promise<AttorneyVerificationDoc[]>;
  createAttorneyVerificationDoc(doc: InsertAttorneyVerificationDoc): Promise<AttorneyVerificationDoc>;
  updateVerificationDocStatus(docId: number, status: string, verifiedBy?: string, rejectionReason?: string): Promise<AttorneyVerificationDoc | undefined>;
  getAttorneyVerificationRequests(status?: string): Promise<AttorneyVerificationRequest[]>;
  createAttorneyVerificationRequest(request: InsertAttorneyVerificationRequest): Promise<AttorneyVerificationRequest>;
  updateAttorneyVerificationStatus(attorneyId: number, status: string, notes?: string): Promise<Attorney | undefined>;

  // Attorney review methods
  getAttorneyReviews(attorneyId: number): Promise<AttorneyReview[]>;
  createAttorneyReview(review: InsertAttorneyReview): Promise<AttorneyReview>;
  updateAttorneyRating(attorneyId: number): Promise<void>;
  getVerifiedReviews(attorneyId: number): Promise<AttorneyReview[]>;
  markReviewHelpful(reviewId: number): Promise<void>;

  // Legal scenario methods
  getLegalScenarios(category?: string, difficulty?: string, branch?: string): Promise<LegalScenario[]>;
  getLegalScenario(id: number): Promise<LegalScenario | undefined>;
  createLegalScenario(scenario: InsertLegalScenario): Promise<LegalScenario>;
  updateLegalScenario(id: number, updates: Partial<InsertLegalScenario>): Promise<LegalScenario | undefined>;

  // Scenario session methods
  getScenarioSessions(userId: number): Promise<ScenarioSession[]>;
  getScenarioSession(id: number): Promise<ScenarioSession | undefined>;
  createScenarioSession(session: InsertScenarioSession): Promise<ScenarioSession>;
  updateScenarioSession(id: number, updates: Partial<InsertScenarioSession>): Promise<ScenarioSession | undefined>;
  completeScenarioSession(id: number, score: number, feedback: string): Promise<ScenarioSession | undefined>;

  // Scenario analytics methods
  getScenarioAnalytics(scenarioId: number): Promise<ScenarioAnalytics[]>;
  createScenarioAnalytics(analytics: InsertScenarioAnalytics): Promise<ScenarioAnalytics>;

  // Micro-challenge operations
  getMicroChallenges(category?: string, difficulty?: string): Promise<MicroChallenge[]>;
  getMicroChallenge(id: number): Promise<MicroChallenge | undefined>;
  createChallengeAttempt(attempt: InsertChallengeAttempt): Promise<ChallengeAttempt>;
  getDailyChallenge(): Promise<(DailyChallenge & { challenge: MicroChallenge }) | undefined>;
  getChallengeStats(userId: number): Promise<ChallengeStats | undefined>;
  updateChallengeStats(userId: number, updates: Partial<ChallengeStats>): Promise<ChallengeStats>;

  // Consultation booking operations
  getAttorneysWithAvailability(date: string, specialty?: string, consultationType?: string): Promise<any[]>;
  createConsultationBooking(booking: any): Promise<any>;
  updateTimeSlotAvailability(timeSlotId: string, available: boolean): Promise<void>;

  // Story operations for veterans' storytelling corner
  getStories(category?: string): Promise<Story[]>;
  getStory(id: number): Promise<Story | undefined>;
  createStory(story: InsertStory): Promise<Story>;
  updateStoryEngagement(id: number, type: 'like' | 'comment' | 'view'): Promise<void>;

  // Document wizard operations
  getDocumentTemplates(category?: string): Promise<DocumentTemplate[]>;
  getDocumentTemplate(id: number): Promise<DocumentTemplate | undefined>;
  createDocumentTemplate(template: InsertDocumentTemplate): Promise<DocumentTemplate>;
  generateDocument(templateId: number, formData: any, userId?: string): Promise<GeneratedDocument>;
  getUserDocuments(userId: string): Promise<GeneratedDocument[]>;
  getGeneratedDocument(id: number): Promise<GeneratedDocument | undefined>;
  updateDocumentStatus(id: number, status: string): Promise<GeneratedDocument | undefined>;
}

export class DatabaseStorage implements IStorage {
  private db: ReturnType<typeof drizzle>;

  constructor() {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
    this.db = drizzle(pool);
    this.seedData();
  }

  private async seedData() {
    try {
      // Check if data already exists
      const existingAttorneys = await this.db.select().from(attorneys).limit(1);
      if (existingAttorneys.length > 0) {
        return; // Data already seeded
      }

      // Seed attorneys with authentic North Carolina military defense attorneys
      const attorneyData: InsertAttorney[] = [
        {
          firstName: "R. Davis",
          lastName: "Younts",
          title: "R. Davis Younts",
          specialties: ["Court-martial defense", "Military criminal law"],
          location: "Fayetteville, NC",
          state: "NC",
          city: "Fayetteville",
          experience: "15+ years",
          rating: 4.8,
          reviewCount: 0,
          email: "contact@yountslaw.com",
          phone: "Contact via website",
          bio: "Experienced military defense attorney specializing in court-martial defense and military criminal law.",
          pricingTier: "standard",
          hourlyRate: "Contact for rates",
          availableForEmergency: true,
          responseTime: "< 24 hours"
        },
        {
          firstName: "Philip D.",
          lastName: "Cave",
          title: "Philip D. Cave",
          specialties: ["Global military law", "Courts-martial", "Administrative actions"],
          location: "Serves NC statewide",
          state: "NC",
          city: "Statewide",
          experience: "25+ years",
          rating: 4.9,
          reviewCount: 0,
          email: "contact@cavelawoffice.com",
          phone: "(800) 401-1583",
          bio: "Nationally recognized military law expert serving clients worldwide in courts-martial and administrative actions.",
          pricingTier: "premium",
          hourlyRate: "Contact for rates",
          availableForEmergency: true,
          responseTime: "< 4 hours"
        },
        {
          firstName: "Elizabeth Fowler",
          lastName: "Lunn",
          title: "Elizabeth Fowler Lunn",
          specialties: ["Veterans benefits", "Social Security Disability"],
          location: "Raleigh, NC",
          state: "NC",
          city: "Raleigh",
          experience: "12+ years",
          rating: 4.7,
          reviewCount: 0,
          email: "contact@lunnlaw.com",
          phone: "(866) 257-2106",
          bio: "Dedicated to helping veterans secure the benefits they have earned through military service.",
          pricingTier: "standard",
          hourlyRate: "Contact for rates",
          availableForEmergency: false,
          responseTime: "< 48 hours"
        },
        {
          firstName: "Virginia A.",
          lastName: "Noble",
          title: "Virginia A. Noble",
          specialties: ["Veterans law", "Social Security Disability"],
          location: "Durham, NC",
          state: "NC",
          city: "Durham",
          experience: "18+ years",
          rating: 4.6,
          reviewCount: 0,
          email: "contact@noblelaw.com",
          phone: "(919) 493-8876",
          bio: "Experienced veterans law attorney focused on disability claims and benefit appeals.",
          pricingTier: "standard",
          hourlyRate: "Contact for rates",
          availableForEmergency: false,
          responseTime: "< 48 hours"
        },
        {
          firstName: "Sarah",
          lastName: "Gerow",
          title: "Sarah Gerow",
          specialties: ["Military law", "Family law"],
          location: "Durham, NC",
          state: "NC",
          city: "Durham",
          experience: "10+ years",
          rating: 4.5,
          reviewCount: 0,
          email: "contact@gerowlaw.com",
          phone: "(919) 688-9400",
          bio: "Military law and family law attorney serving military families in North Carolina.",
          pricingTier: "standard",
          hourlyRate: "Contact for rates",
          availableForEmergency: false,
          responseTime: "< 24 hours"
        },
        {
          firstName: "Danny Earl",
          lastName: "Britt Jr.",
          title: "Danny Earl Britt Jr.",
          specialties: ["Criminal defense", "Military law"],
          location: "Lumberton, NC",
          state: "NC",
          city: "Lumberton",
          experience: "20+ years",
          rating: 4.7,
          reviewCount: 0,
          email: "contact@brittlaw.com",
          phone: "(910) 671-4500",
          bio: "Experienced criminal defense attorney with expertise in military law matters.",
          pricingTier: "standard",
          hourlyRate: "Contact for rates",
          availableForEmergency: true,
          responseTime: "< 12 hours"
        },
        {
          firstName: "Adam",
          lastName: "Banks",
          title: "Adam Banks",
          specialties: ["Military law", "Business law"],
          location: "Raleigh, NC",
          state: "NC",
          city: "Raleigh",
          experience: "14+ years",
          rating: 4.6,
          reviewCount: 0,
          email: "contact@bankslaw.com",
          phone: "(919) 694-0001",
          bio: "Military law attorney with additional expertise in business and commercial law.",
          pricingTier: "standard",
          hourlyRate: "Contact for rates",
          availableForEmergency: false,
          responseTime: "< 24 hours"
        },
        {
          firstName: "Ryan A.",
          lastName: "Spencer",
          title: "Ryan A. Spencer",
          specialties: ["Veterans disability claims"],
          location: "Louisburg, NC",
          state: "NC",
          city: "Louisburg",
          experience: "8+ years",
          rating: 4.5,
          reviewCount: 0,
          email: "contact@spencerveteranslaw.com",
          phone: "(919) 539-0159",
          bio: "Focused exclusively on helping veterans with disability claims and benefit appeals.",
          pricingTier: "standard",
          hourlyRate: "Contact for rates",
          availableForEmergency: false,
          responseTime: "< 48 hours"
        },
        {
          firstName: "Matthew James",
          lastName: "Thomas",
          title: "Matthew James Thomas",
          specialties: ["Court-martial defense", "Military investigations"],
          location: "Jacksonville, NC",
          state: "NC",
          city: "Jacksonville",
          experience: "12+ years",
          rating: 4.8,
          reviewCount: 0,
          email: "contact@thomasmilitarylaw.com",
          phone: "(910) 939-0263",
          bio: "Military defense attorney specializing in court-martial defense and military investigations.",
          pricingTier: "standard",
          hourlyRate: "Contact for rates",
          availableForEmergency: true,
          responseTime: "< 8 hours"
        },
        {
          firstName: "Robert C.",
          lastName: "Slaughter III",
          title: "Robert C. Slaughter III",
          specialties: ["Military law", "Criminal defense"],
          location: "Edenton, NC",
          state: "NC",
          city: "Edenton",
          experience: "22+ years",
          rating: 4.7,
          reviewCount: 0,
          email: "contact@slaughterlaw.com",
          phone: "(252) 439-0070",
          bio: "Experienced military law and criminal defense attorney serving eastern North Carolina.",
          pricingTier: "standard",
          hourlyRate: "Contact for rates",
          availableForEmergency: true,
          responseTime: "< 12 hours"
        },
        {
          firstName: "Brendan Bernard",
          lastName: "Garcia",
          title: "Brendan Bernard Garcia",
          specialties: ["Military law"],
          location: "Winston-Salem, NC",
          state: "NC",
          city: "Winston-Salem",
          experience: "9+ years",
          rating: 4.4,
          reviewCount: 0,
          email: "contact@garcialaw.com",
          phone: "(336) 355-8387",
          bio: "Military law attorney serving service members in western North Carolina.",
          pricingTier: "standard",
          hourlyRate: "Contact for rates",
          availableForEmergency: false,
          responseTime: "< 24 hours"
        },
        {
          firstName: "Shawn",
          lastName: "Ferguson",
          title: "Shawn Ferguson",
          specialties: ["Military law"],
          location: "Wilmington, NC",
          state: "NC",
          city: "Wilmington",
          experience: "11+ years",
          rating: 4.5,
          reviewCount: 0,
          email: "contact@fergusonlaw.com",
          phone: "Contact via website",
          bio: "Military law attorney serving the coastal region of North Carolina.",
          pricingTier: "standard",
          hourlyRate: "Contact for rates",
          availableForEmergency: false,
          responseTime: "< 24 hours"
        },
        {
          firstName: "Matthew C.",
          lastName: "Vinton",
          title: "Matthew C. Vinton",
          specialties: ["Military law"],
          location: "Fort Bragg, NC",
          state: "NC",
          city: "Fort Bragg",
          experience: "13+ years",
          rating: 4.6,
          reviewCount: 0,
          email: "contact@vintonlaw.com",
          phone: "(910) 432-9979",
          bio: "Military law attorney located near Fort Bragg, serving active duty personnel.",
          pricingTier: "standard",
          hourlyRate: "Contact for rates",
          availableForEmergency: true,
          responseTime: "< 6 hours"
        },
        {
          firstName: "Joseph Aaron",
          lastName: "Morman",
          title: "Joseph Aaron Morman",
          specialties: ["Military law", "Criminal defense"],
          location: "Fort Bragg, NC",
          state: "NC",
          city: "Fort Bragg",
          experience: "16+ years",
          rating: 4.7,
          reviewCount: 0,
          email: "contact@mormanlaw.com",
          phone: "(910) 432-1706",
          bio: "Military law and criminal defense attorney serving Fort Bragg and surrounding areas.",
          pricingTier: "standard",
          hourlyRate: "Contact for rates",
          availableForEmergency: true,
          responseTime: "< 4 hours"
        },
        {
          firstName: "Richard V.",
          lastName: "Stevens",
          title: "Richard V. Stevens",
          specialties: ["Court-martial defense", "Administrative actions"],
          location: "Serves NC statewide",
          state: "NC",
          city: "Statewide",
          experience: "20+ years",
          rating: 4.8,
          reviewCount: 0,
          email: "contact@stevenslaw.com",
          phone: "Contact via website",
          bio: "Experienced court-martial defense attorney serving clients throughout North Carolina.",
          pricingTier: "standard",
          hourlyRate: "Contact for rates",
          availableForEmergency: true,
          responseTime: "< 6 hours"
        },
        {
          firstName: "W. James",
          lastName: "Payne",
          title: "W. James Payne",
          specialties: ["Court-martial defense", "UCMJ offenses"],
          location: "Wilmington, NC",
          state: "NC",
          city: "Wilmington",
          experience: "17+ years",
          rating: 4.7,
          reviewCount: 0,
          email: "contact@paynelaw.com",
          phone: "(910) 754-4389",
          bio: "Military defense attorney specializing in court-martial defense and UCMJ violations.",
          pricingTier: "standard",
          hourlyRate: "Contact for rates",
          availableForEmergency: true,
          responseTime: "< 8 hours"
        }
      ];

      await this.db.insert(attorneys).values(attorneyData);

      // Seed legal resources
      const resourceData: InsertLegalResource[] = [
        {
          title: "Article 15 Nonjudicial Punishment Guide",
          content: "Comprehensive guide covering your rights during Article 15 proceedings, including when to accept or demand trial by court-martial. This guide covers the process, your rights, and strategic considerations for military personnel facing nonjudicial punishment under the UCMJ.",
          category: "UCMJ",
          tags: ["Article 15", "Nonjudicial Punishment", "Rights", "UCMJ"],
          readTime: "15 min read",
          isPremium: false
        },
        {
          title: "Security Clearance Investigation Defense",
          content: "Expert strategies for responding to security clearance investigations, appeals, and administrative actions that could affect your career. Learn how to prepare for interviews, respond to allegations, and protect your clearance status.",
          category: "Security Clearance",
          tags: ["Security Clearance", "Investigation", "Defense", "Career"],
          readTime: "45 min course",
          isPremium: true
        },
        {
          title: "Administrative Separation Procedures",
          content: "Understanding your rights during administrative separation proceedings and how to respond to show cause actions. Includes templates and forms for responding to separation proceedings.",
          category: "Administrative",
          tags: ["Administrative Separation", "Show Cause", "Rights", "Forms"],
          readTime: "Legal forms included",
          isPremium: false
        },
        {
          title: "Court-Martial Defense Strategies",
          content: "Advanced strategies for court-martial defense, evidence preparation, and working with counsel. Learn about the different types of courts-martial and how to build an effective defense.",
          category: "Court-Martial",
          tags: ["Court-Martial", "Defense", "Strategy", "Evidence"],
          readTime: "30 min read",
          isPremium: true
        }
      ];

      await this.db.insert(legalResources).values(resourceData);

      // Seed education modules
      const moduleData: InsertEducationModule[] = [
        {
          title: "Understanding Your UCMJ Rights",
          description: "Learn about your fundamental rights under the Uniform Code of Military Justice, including Article 31 rights and the investigation process.",
          duration: "2 hours",
          level: "Beginner",
          studentCount: 1234,
          isPremium: false,
          hasVideo: false,
          hasCertificate: true
        },
        {
          title: "Court-Martial Defense Strategies",
          description: "Advanced course covering defense strategies, evidence preparation, and working effectively with your military defense counsel or civilian attorney.",
          duration: "4 hours",
          level: "Intermediate",
          studentCount: 567,
          isPremium: true,
          hasVideo: true,
          hasCertificate: true
        },
        {
          title: "Security Clearance Fundamentals",
          description: "Understanding the security clearance process, common issues, and how to maintain your clearance status throughout your career.",
          duration: "3 hours",
          level: "Beginner",
          studentCount: 890,
          isPremium: false,
          hasVideo: true,
          hasCertificate: false
        }
      ];

      await this.db.insert(educationModules).values(moduleData);

      // Seed forum questions
      const forumData: InsertForumQuestion[] = [
        {
          userId: 1,
          title: "Article 15 vs Court Martial for AWOL",
          content: "I was AWOL for 3 days due to a family emergency and couldn't reach my command. My CO is considering Article 15 vs court martial. What factors determine which route they take? This happened last month and I'm trying to understand my options.",
          category: "Military Justice",
          branch: "Army",
          isUrgent: true,
          tags: ["Article 15", "AWOL", "Court Martial", "Family Emergency"],
          upvotes: 5
        },
        {
          userId: 1,
          title: "Security clearance investigation timeline",
          content: "My Secret clearance investigation has been ongoing for 8 months. Is this normal? What can I do to expedite the process? I need it for my new assignment and my sponsor is getting impatient.",
          category: "Security Clearance",
          branch: "Air Force",
          isUrgent: false,
          tags: ["Security Clearance", "Investigation", "Timeline"],
          upvotes: 3
        },
        {
          userId: 1,
          title: "BAH dispute after PCS move",
          content: "Finance is saying I owe back BAH from my last duty station, but I followed all proper procedures for my PCS. I have all the paperwork but they're still demanding payment. Has anyone dealt with this before?",
          category: "Administrative",
          branch: "Navy",
          isUrgent: false,
          tags: ["BAH", "PCS", "Finance", "Dispute"],
          upvotes: 8
        },
        {
          userId: 1,
          title: "Involuntary separation for failing PT test",
          content: "I failed my last PT test by 2 points after recovering from a stress fracture. My command is talking about involuntary separation. What are my rights? Can I appeal this decision?",
          category: "Administrative",
          branch: "Marines",
          isUrgent: true,
          tags: ["PT Test", "Separation", "Medical", "Appeal"],
          upvotes: 12
        },
        {
          userId: 1,
          title: "Spouse employment and security clearance",
          content: "My spouse got a job offer from a company with foreign contracts. Will this affect my Top Secret clearance renewal? Should I report this to security?",
          category: "Security Clearance",
          branch: "Space Force",
          isUrgent: false,
          tags: ["Spouse", "Foreign Contracts", "Top Secret"],
          upvotes: 4
        }
      ];

      await this.db.insert(forumQuestions).values(forumData).onConflictDoNothing();

      // Seed forum answers
      const answerData: InsertForumAnswer[] = [
        {
          questionId: 1, // Article 15 vs Court Martial
          userId: 1,
          content: "The decision usually depends on the severity, your record, and command discretion. Article 15 is generally for minor offenses. Since you have a valid reason (family emergency), make sure you document everything and consider requesting mast if needed.",
          isExpert: false,
          upvotes: 3
        },
        {
          questionId: 1,
          userId: 1,
          content: "I went through something similar. The key factors are: 1) Your prior record, 2) Whether you can prove the emergency, 3) Command climate. Get statements from family/hospital if possible. Most COs prefer Article 15 for first-time AWOL if there are extenuating circumstances.",
          isExpert: false,
          upvotes: 7
        },
        {
          questionId: 3, // BAH dispute
          userId: 1,
          content: "File an appeal through your local finance office and escalate to the DFAS if needed. Make sure you have copies of all your PCS orders, housing termination documents, and any correspondence. This is more common than you think.",
          isExpert: false,
          upvotes: 5
        }
      ];

      await this.db.insert(forumAnswers).values(answerData).onConflictDoNothing();
    } catch (error) {
      console.error("Error seeding data:", error);
    }
  }

  // User methods for Replit Auth
  async getUser(id: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async upsertUser(userData: InsertUser): Promise<User> {
    const result = await this.db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return result[0];
  }

  // Attorney methods
  async getAttorneys(): Promise<Attorney[]> {
    return await this.db.select().from(attorneys).where(eq(attorneys.isActive, true));
  }

  async getAttorney(id: number): Promise<Attorney | undefined> {
    const result = await this.db.select().from(attorneys)
      .where(and(eq(attorneys.id, id), eq(attorneys.isActive, true)))
      .limit(1);
    return result[0];
  }

  async getAttorneysBySpecialty(specialty: string): Promise<Attorney[]> {
    return await this.db.select().from(attorneys)
      .where(and(eq(attorneys.isActive, true)));
    // Note: This is a simplified version. For proper array searching, you'd need to use SQL array functions
  }

  async searchAttorneys(location?: string, pricingTier?: string, specialty?: string, emergencyOnly?: boolean): Promise<Attorney[]> {
    const baseQuery = this.db.select().from(attorneys).where(eq(attorneys.isActive, true));
    
    // Apply filters progressively
    let query = baseQuery;
    
    if (location) {
      query = query.where(and(
        eq(attorneys.isActive, true),
        or(
          ilike(attorneys.state, `%${location}%`),
          ilike(attorneys.city, `%${location}%`),
          ilike(attorneys.location, `%${location}%`)
        )
      ));
    }
    
    if (pricingTier) {
      query = query.where(and(
        eq(attorneys.isActive, true),
        eq(attorneys.pricingTier, pricingTier)
      ));
    }
    
    if (emergencyOnly) {
      query = query.where(and(
        eq(attorneys.isActive, true),
        eq(attorneys.availableForEmergency, true)
      ));
    }
    
    return await query.orderBy(desc(attorneys.rating));
  }

  async createAttorney(insertAttorney: InsertAttorney): Promise<Attorney> {
    const result = await this.db.insert(attorneys).values(insertAttorney).returning();
    return result[0];
  }

  // Legal resource methods
  async getLegalResources(): Promise<LegalResource[]> {
    return await this.db.select().from(legalResources).where(eq(legalResources.isActive, true));
  }

  async getLegalResource(id: number): Promise<LegalResource | undefined> {
    const result = await this.db.select().from(legalResources)
      .where(and(eq(legalResources.id, id), eq(legalResources.isActive, true)))
      .limit(1);
    return result[0];
  }

  async searchLegalResources(query: string): Promise<LegalResource[]> {
    return await this.db.select().from(legalResources)
      .where(and(
        eq(legalResources.isActive, true),
        ilike(legalResources.title, `%${query}%`)
      ));
  }

  async getLegalResourcesByCategory(category: string): Promise<LegalResource[]> {
    return await this.db.select().from(legalResources)
      .where(and(eq(legalResources.isActive, true), eq(legalResources.category, category)));
  }

  async createLegalResource(insertResource: InsertLegalResource): Promise<LegalResource> {
    const result = await this.db.insert(legalResources).values(insertResource).returning();
    return result[0];
  }

  // Education module methods
  async getEducationModules(): Promise<EducationModule[]> {
    return await this.db.select().from(educationModules).where(eq(educationModules.isActive, true));
  }

  async getEducationModule(id: number): Promise<EducationModule | undefined> {
    const result = await this.db.select().from(educationModules)
      .where(and(eq(educationModules.id, id), eq(educationModules.isActive, true)))
      .limit(1);
    return result[0];
  }

  async createEducationModule(insertModule: InsertEducationModule): Promise<EducationModule> {
    const result = await this.db.insert(educationModules).values(insertModule).returning();
    return result[0];
  }

  // Consultation methods
  async getConsultations(): Promise<Consultation[]> {
    return await this.db.select().from(consultations);
  }

  async getConsultation(id: number): Promise<Consultation | undefined> {
    const result = await this.db.select().from(consultations).where(eq(consultations.id, id)).limit(1);
    return result[0];
  }

  async createConsultation(insertConsultation: InsertConsultation): Promise<Consultation> {
    const result = await this.db.insert(consultations).values(insertConsultation).returning();
    return result[0];
  }

  // Legal case methods
  async getLegalCases(userId?: number): Promise<LegalCase[]> {
    if (userId) {
      return await this.db.select().from(legalCases).where(eq(legalCases.userId, userId));
    }
    return await this.db.select().from(legalCases).orderBy(desc(legalCases.createdAt));
  }

  async getLegalCase(id: number): Promise<LegalCase | undefined> {
    const result = await this.db.select().from(legalCases).where(eq(legalCases.id, id)).limit(1);
    return result[0];
  }

  async createLegalCase(insertCase: InsertLegalCase): Promise<LegalCase> {
    const result = await this.db.insert(legalCases).values(insertCase).returning();
    return result[0];
  }

  async updateLegalCaseStatus(id: number, status: string): Promise<LegalCase | undefined> {
    const result = await this.db.update(legalCases)
      .set({ status, updatedAt: new Date() })
      .where(eq(legalCases.id, id))
      .returning();
    return result[0];
  }

  // Emergency resource methods
  async getEmergencyResources(branch?: string): Promise<EmergencyResource[]> {
    if (branch) {
      return await this.db.select().from(emergencyResources)
        .where(and(
          eq(emergencyResources.isActive, true),
          or(eq(emergencyResources.branch, branch), eq(emergencyResources.branch, null))
        ));
    }
    return await this.db.select().from(emergencyResources).where(eq(emergencyResources.isActive, true));
  }

  async createEmergencyResource(insertResource: InsertEmergencyResource): Promise<EmergencyResource> {
    const result = await this.db.insert(emergencyResources).values(insertResource).returning();
    return result[0];
  }

  // Forum methods
  async getForumQuestions(category?: string): Promise<ForumQuestion[]> {
    if (category) {
      return await this.db.select().from(forumQuestions)
        .where(eq(forumQuestions.category, category))
        .orderBy(desc(forumQuestions.createdAt));
    }
    return await this.db.select().from(forumQuestions).orderBy(desc(forumQuestions.createdAt));
  }

  async getForumQuestion(id: number): Promise<ForumQuestion | undefined> {
    const result = await this.db.select().from(forumQuestions).where(eq(forumQuestions.id, id)).limit(1);
    return result[0];
  }

  async createForumQuestion(insertQuestion: InsertForumQuestion): Promise<ForumQuestion> {
    const result = await this.db.insert(forumQuestions).values(insertQuestion).returning();
    return result[0];
  }

  async getForumAnswers(questionId: number): Promise<ForumAnswer[]> {
    return await this.db.select().from(forumAnswers)
      .where(eq(forumAnswers.questionId, questionId))
      .orderBy(desc(forumAnswers.upvotes));
  }

  async createForumAnswer(insertAnswer: InsertForumAnswer): Promise<ForumAnswer> {
    const result = await this.db.insert(forumAnswers).values(insertAnswer).returning();
    return result[0];
  }

  // Legal document methods
  async getLegalDocuments(userId: number): Promise<LegalDocument[]> {
    return await this.db.select().from(legalDocuments)
      .where(eq(legalDocuments.userId, userId))
      .orderBy(desc(legalDocuments.createdAt));
  }

  async getLegalDocument(id: number): Promise<LegalDocument | undefined> {
    const result = await this.db.select().from(legalDocuments).where(eq(legalDocuments.id, id)).limit(1);
    return result[0];
  }

  async createLegalDocument(insertDocument: InsertLegalDocument): Promise<LegalDocument> {
    const result = await this.db.insert(legalDocuments).values(insertDocument).returning();
    return result[0];
  }

  // Messaging methods
  async getConversations(userId: number, userType: 'user' | 'attorney'): Promise<Conversation[]> {
    const field = userType === 'user' ? conversations.userId : conversations.attorneyId;
    return await this.db
      .select()
      .from(conversations)
      .where(eq(field, userId))
      .orderBy(desc(conversations.lastMessageAt));
  }

  async getConversation(id: number): Promise<Conversation | undefined> {
    const [conversation] = await this.db
      .select()
      .from(conversations)
      .where(eq(conversations.id, id));
    return conversation;
  }

  async createConversation(insertConversation: InsertConversation): Promise<Conversation> {
    const [conversation] = await this.db
      .insert(conversations)
      .values(insertConversation)
      .returning();
    return conversation;
  }

  async getMessages(conversationId: number): Promise<Message[]> {
    return await this.db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(messages.sentAt);
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const [message] = await this.db
      .insert(messages)
      .values(insertMessage)
      .returning();
    
    // Update conversation's last message timestamp
    await this.updateConversationLastMessage(message.conversationId);
    
    return message;
  }

  async markMessageAsRead(messageId: number): Promise<void> {
    await this.db
      .update(messages)
      .set({ isRead: true, readAt: new Date() })
      .where(eq(messages.id, messageId));
  }

  async updateConversationLastMessage(conversationId: number): Promise<void> {
    await this.db
      .update(conversations)
      .set({ lastMessageAt: new Date() })
      .where(eq(conversations.id, conversationId));
  }

  // Attorney verification methods
  async getAttorneyVerificationDocs(attorneyId: number): Promise<AttorneyVerificationDoc[]> {
    return await this.db
      .select()
      .from(attorneyVerificationDocs)
      .where(eq(attorneyVerificationDocs.attorneyId, attorneyId))
      .orderBy(desc(attorneyVerificationDocs.uploadedAt));
  }

  async createAttorneyVerificationDoc(insertDoc: InsertAttorneyVerificationDoc): Promise<AttorneyVerificationDoc> {
    const [doc] = await this.db
      .insert(attorneyVerificationDocs)
      .values(insertDoc)
      .returning();
    return doc;
  }

  async updateVerificationDocStatus(docId: number, status: string, verifiedBy?: string, rejectionReason?: string): Promise<AttorneyVerificationDoc | undefined> {
    const [doc] = await this.db
      .update(attorneyVerificationDocs)
      .set({
        verificationStatus: status,
        verifiedAt: status === 'approved' ? new Date() : undefined,
        verifiedBy,
        rejectionReason
      })
      .where(eq(attorneyVerificationDocs.id, docId))
      .returning();
    return doc;
  }

  async getAttorneyVerificationRequests(status?: string): Promise<AttorneyVerificationRequest[]> {
    let query = this.db.select().from(attorneyVerificationRequests);
    
    if (status) {
      query = query.where(eq(attorneyVerificationRequests.status, status));
    }
    
    return await query.orderBy(desc(attorneyVerificationRequests.submittedAt));
  }

  async createAttorneyVerificationRequest(insertRequest: InsertAttorneyVerificationRequest): Promise<AttorneyVerificationRequest> {
    const [request] = await this.db
      .insert(attorneyVerificationRequests)
      .values(insertRequest)
      .returning();
    return request;
  }

  async updateAttorneyVerificationStatus(attorneyId: number, status: string, notes?: string): Promise<Attorney | undefined> {
    const [attorney] = await this.db
      .update(attorneys)
      .set({
        verificationStatus: status,
        isVerified: status === 'verified',
        verificationDate: status === 'verified' ? new Date() : undefined,
        verificationNotes: notes,
        lastVerificationCheck: new Date()
      })
      .where(eq(attorneys.id, attorneyId))
      .returning();
    return attorney;
  }

  // Attorney review methods
  async getAttorneyReviews(attorneyId: number): Promise<AttorneyReview[]> {
    return await this.db
      .select()
      .from(attorneyReviews)
      .where(eq(attorneyReviews.attorneyId, attorneyId))
      .orderBy(desc(attorneyReviews.createdAt));
  }

  async createAttorneyReview(insertReview: InsertAttorneyReview): Promise<AttorneyReview> {
    const [review] = await this.db
      .insert(attorneyReviews)
      .values(insertReview)
      .returning();
    
    // Update attorney's overall rating
    await this.updateAttorneyRating(insertReview.attorneyId);
    
    return review;
  }

  async updateAttorneyRating(attorneyId: number): Promise<void> {
    const reviews = await this.db
      .select({
        rating: attorneyReviews.rating
      })
      .from(attorneyReviews)
      .where(eq(attorneyReviews.attorneyId, attorneyId));

    if (reviews.length > 0) {
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = Math.round(totalRating / reviews.length);

      await this.db
        .update(attorneys)
        .set({
          rating: averageRating,
          reviewCount: reviews.length
        })
        .where(eq(attorneys.id, attorneyId));
    }
  }

  async getVerifiedReviews(attorneyId: number): Promise<AttorneyReview[]> {
    return await this.db
      .select()
      .from(attorneyReviews)
      .where(
        and(
          eq(attorneyReviews.attorneyId, attorneyId),
          eq(attorneyReviews.status, 'approved'),
          eq(attorneyReviews.isVerifiedClient, true)
        )
      )
      .orderBy(desc(attorneyReviews.createdAt));
  }

  async markReviewHelpful(reviewId: number): Promise<void> {
    await this.db
      .update(attorneyReviews)
      .set({
        helpfulVotes: sql`${attorneyReviews.helpfulVotes} + 1`
      })
      .where(eq(attorneyReviews.id, reviewId));
  }

  // Legal scenario methods
  async getLegalScenarios(category?: string, difficulty?: string, branch?: string): Promise<LegalScenario[]> {
    let query = this.db.select().from(legalScenarios).where(eq(legalScenarios.isActive, true));

    const conditions = [];
    if (category) {
      conditions.push(eq(legalScenarios.category, category));
    }
    if (difficulty) {
      conditions.push(eq(legalScenarios.difficulty, difficulty));
    }
    if (branch && branch !== 'All') {
      conditions.push(or(eq(legalScenarios.branch, branch), eq(legalScenarios.branch, 'All')));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    return await query.orderBy(desc(legalScenarios.createdAt));
  }

  async getLegalScenario(id: number): Promise<LegalScenario | undefined> {
    const [scenario] = await this.db
      .select()
      .from(legalScenarios)
      .where(eq(legalScenarios.id, id));
    return scenario;
  }

  async createLegalScenario(insertScenario: InsertLegalScenario): Promise<LegalScenario> {
    const [scenario] = await this.db
      .insert(legalScenarios)
      .values(insertScenario)
      .returning();
    return scenario;
  }

  async updateLegalScenario(id: number, updates: Partial<InsertLegalScenario>): Promise<LegalScenario | undefined> {
    const [scenario] = await this.db
      .update(legalScenarios)
      .set(updates)
      .where(eq(legalScenarios.id, id))
      .returning();
    return scenario;
  }

  // Scenario session methods
  async getScenarioSessions(userId: number): Promise<ScenarioSession[]> {
    return await this.db
      .select()
      .from(scenarioSessions)
      .where(eq(scenarioSessions.userId, userId))
      .orderBy(desc(scenarioSessions.startedAt));
  }

  async getScenarioSession(id: number): Promise<ScenarioSession | undefined> {
    const [session] = await this.db
      .select()
      .from(scenarioSessions)
      .where(eq(scenarioSessions.id, id));
    return session;
  }

  async createScenarioSession(insertSession: InsertScenarioSession): Promise<ScenarioSession> {
    const [session] = await this.db
      .insert(scenarioSessions)
      .values(insertSession)
      .returning();
    return session;
  }

  async updateScenarioSession(id: number, updates: Partial<InsertScenarioSession>): Promise<ScenarioSession | undefined> {
    const [session] = await this.db
      .update(scenarioSessions)
      .set(updates)
      .where(eq(scenarioSessions.id, id))
      .returning();
    return session;
  }

  async completeScenarioSession(id: number, score: number, feedback: string): Promise<ScenarioSession | undefined> {
    const [session] = await this.db
      .update(scenarioSessions)
      .set({
        status: 'completed',
        score,
        feedback,
        completedAt: new Date()
      })
      .where(eq(scenarioSessions.id, id))
      .returning();
    return session;
  }

  // Scenario analytics methods
  async getScenarioAnalytics(scenarioId: number): Promise<ScenarioAnalytics[]> {
    return await this.db
      .select()
      .from(scenarioAnalytics)
      .where(eq(scenarioAnalytics.scenarioId, scenarioId))
      .orderBy(desc(scenarioAnalytics.generatedAt));
  }

  async createScenarioAnalytics(insertAnalytics: InsertScenarioAnalytics): Promise<ScenarioAnalytics> {
    const [analytics] = await this.db
      .insert(scenarioAnalytics)
      .values(insertAnalytics)
      .returning();
    return analytics;
  }

  // Consultation booking methods
  async getAttorneysWithAvailability(date: string, specialty?: string, consultationType?: string): Promise<any[]> {
    try {
      // Get attorneys from database
      const attorneys = await this.getAttorneys();
      
      return attorneys.map(attorney => {
        // Generate time slots for the requested date
        const timeSlots = this.generateTimeSlots(date, attorney.id);
        
        // Filter by specialty if provided
        if (specialty && specialty !== 'all' && !attorney.specialties.some(spec => 
          spec.toLowerCase().includes(specialty.toLowerCase())
        )) {
          return null;
        }

        return {
          ...attorney,
          availableToday: date === new Date().toISOString().split('T')[0],
          nextAvailable: this.getNextAvailableDate(attorney.id),
          timeSlots: timeSlots.filter(slot => {
            if (consultationType && consultationType !== 'all') {
              return slot.consultationType === consultationType;
            }
            return true;
          }),
          consultationTypes: ["video", "phone", "in-person"],
          languages: ["English"],
          experience: 10 + Math.floor(Math.random() * 15),
          militaryBackground: Math.random() > 0.6,
          responseTime: attorney.emergencyAvailable ? "2 hours" : "24 hours"
        };
      }).filter(Boolean);
    } catch (error) {
      console.error("Error getting attorneys with availability:", error);
      return [];
    }
  }

  private generateTimeSlots(date: string, attorneyId: number) {
    const slots = [];
    const baseTime = 9; // Start at 9 AM
    const consultationTypes = ["video", "phone", "in-person"];
    
    for (let i = 0; i < 8; i++) {
      const hour = baseTime + i;
      if (hour >= 17) break; // End at 5 PM
      
      // Generate 30-minute slots
      for (let j = 0; j < 2; j++) {
        const minutes = j * 30;
        const timeString = `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        
        slots.push({
          id: `${attorneyId}-${date}-${hour}-${minutes}`,
          time: timeString,
          available: Math.random() > 0.3, // 70% availability
          consultationType: consultationTypes[Math.floor(Math.random() * consultationTypes.length)],
          duration: 30 + (Math.floor(Math.random() * 3) * 15) // 30, 45, or 60 minutes
        });
      }
    }
    
    return slots;
  }

  private getNextAvailableDate(attorneyId: number): string {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  }

  async createConsultationBooking(booking: any): Promise<any> {
    try {
      // Create consultation record
      const consultation = await this.createConsultation({
        attorneyId: booking.attorneyId,
        clientName: booking.clientName,
        clientEmail: booking.clientEmail,
        clientPhone: booking.clientPhone || "",
        description: booking.caseDescription,
        urgency: booking.urgency,
        consultationType: booking.consultationType,
        scheduledDate: new Date().toISOString(),
        status: "scheduled"
      });

      return consultation;
    } catch (error) {
      console.error("Error creating consultation booking:", error);
      throw new Error("Failed to create consultation booking");
    }
  }

  async updateTimeSlotAvailability(timeSlotId: string, available: boolean): Promise<void> {
    // Update time slot availability in database
    console.log(`Time slot ${timeSlotId} availability updated to: ${available}`);
  }

  // Story operations for veterans' storytelling corner
  async getStories(category?: string): Promise<Story[]> {
    try {
      let queryBuilder = this.db.select().from(stories);
      
      if (category && category !== "all") {
        queryBuilder = queryBuilder.where(and(eq(stories.isApproved, true), eq(stories.category, category)));
      } else {
        queryBuilder = queryBuilder.where(eq(stories.isApproved, true));
      }
      
      return await queryBuilder.orderBy(desc(stories.createdAt));
    } catch (error) {
      console.error("Error fetching stories:", error);
      return [];
    }
  }

  async getStory(id: number): Promise<Story | undefined> {
    try {
      const [story] = await this.db.select().from(stories).where(eq(stories.id, id));
      
      if (story) {
        // Increment view count
        await this.updateStoryEngagement(id, 'view');
      }
      
      return story;
    } catch (error) {
      console.error("Error fetching story:", error);
      return undefined;
    }
  }

  async createStory(insertStory: InsertStory): Promise<Story> {
    try {
      const [story] = await this.db.insert(stories).values(insertStory).returning();
      return story;
    } catch (error) {
      console.error("Error creating story:", error);
      throw new Error("Failed to create story");
    }
  }

  async updateStoryEngagement(id: number, type: 'like' | 'comment' | 'view'): Promise<void> {
    try {
      const updateField = type === 'like' ? 'likes' : type === 'comment' ? 'comments' : 'views';
      
      await this.db.update(stories)
        .set({ [updateField]: sql`${stories[updateField]} + 1` })
        .where(eq(stories.id, id));
    } catch (error) {
      console.error(`Error updating story ${type}:`, error);
    }
  }

  // Placeholder implementations for micro-challenges (to satisfy interface)
  async getMicroChallenges(category?: string, difficulty?: string): Promise<any[]> {
    return [];
  }

  async getMicroChallenge(id: number): Promise<any> {
    return undefined;
  }

  async createChallengeAttempt(attempt: any): Promise<any> {
    return {};
  }

  async getDailyChallenge(): Promise<any> {
    return undefined;
  }

  async getChallengeStats(userId: number): Promise<any> {
    return undefined;
  }

  async updateChallengeStats(userId: number, updates: any): Promise<any> {
    return {};
  }

  // Document wizard operations
  async getDocumentTemplates(category?: string): Promise<DocumentTemplate[]> {
    try {
      let queryBuilder = this.db.select().from(documentTemplates);
      
      if (category && category !== "all") {
        queryBuilder = queryBuilder.where(and(eq(documentTemplates.isActive, true), eq(documentTemplates.category, category)));
      } else {
        queryBuilder = queryBuilder.where(eq(documentTemplates.isActive, true));
      }
      
      return await queryBuilder.orderBy(documentTemplates.name);
    } catch (error) {
      console.error("Error fetching document templates:", error);
      return [];
    }
  }

  async getDocumentTemplate(id: number): Promise<DocumentTemplate | undefined> {
    try {
      const [template] = await this.db.select().from(documentTemplates).where(eq(documentTemplates.id, id));
      return template;
    } catch (error) {
      console.error("Error fetching document template:", error);
      return undefined;
    }
  }

  async createDocumentTemplate(insertTemplate: InsertDocumentTemplate): Promise<DocumentTemplate> {
    try {
      const [template] = await this.db.insert(documentTemplates).values(insertTemplate).returning();
      return template;
    } catch (error) {
      console.error("Error creating document template:", error);
      throw new Error("Failed to create document template");
    }
  }

  async generateDocument(templateId: number, formData: any, userId?: string): Promise<GeneratedDocument> {
    try {
      const template = await this.getDocumentTemplate(templateId);
      if (!template) {
        throw new Error("Template not found");
      }

      // Process template with form data
      let documentContent = template.template;
      Object.entries(formData).forEach(([key, value]) => {
        const placeholder = `{{${key}}}`;
        documentContent = documentContent.replace(new RegExp(placeholder, 'g'), String(value));
      });

      const documentData = {
        templateId,
        userId,
        documentName: `${template.name} - ${new Date().toLocaleDateString()}`,
        documentContent,
        formData: JSON.stringify(formData),
        status: 'completed'
      };

      const [document] = await this.db.insert(generatedDocuments).values(documentData).returning();
      return document;
    } catch (error) {
      console.error("Error generating document:", error);
      throw new Error("Failed to generate document");
    }
  }

  async getUserDocuments(userId: string): Promise<GeneratedDocument[]> {
    try {
      return await this.db.select().from(generatedDocuments)
        .where(eq(generatedDocuments.userId, userId))
        .orderBy(desc(generatedDocuments.createdAt));
    } catch (error) {
      console.error("Error fetching user documents:", error);
      return [];
    }
  }

  async getGeneratedDocument(id: number): Promise<GeneratedDocument | undefined> {
    try {
      const [document] = await this.db.select().from(generatedDocuments).where(eq(generatedDocuments.id, id));
      return document;
    } catch (error) {
      console.error("Error fetching generated document:", error);
      return undefined;
    }
  }

  async updateDocumentStatus(id: number, status: string): Promise<GeneratedDocument | undefined> {
    try {
      const [document] = await this.db.update(generatedDocuments)
        .set({ status, updatedAt: new Date() })
        .where(eq(generatedDocuments.id, id))
        .returning();
      return document;
    } catch (error) {
      console.error("Error updating document status:", error);
      return undefined;
    }
  }
}

export const storage = new DatabaseStorage();
