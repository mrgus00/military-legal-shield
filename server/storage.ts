import { 
  users, attorneys, legalResources, educationModules, consultations,
  legalCases, emergencyResources, forumQuestions, forumAnswers, legalDocuments,
  conversations, messages, attorneyVerificationDocs, attorneyReviews, attorneyVerificationRequests,
  legalScenarios, scenarioSessions, scenarioAnalytics,
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
  type ScenarioAnalytics, type InsertScenarioAnalytics
} from "@shared/schema";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { eq, ilike, and, or, desc, sql } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

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

      // Seed attorneys with enhanced data for urgent-response matching
      const attorneyData: InsertAttorney[] = [
        {
          firstName: "Sarah",
          lastName: "Mitchell",
          title: "Col. Sarah Mitchell (Ret.)",
          specialties: ["Court-Martial Defense", "Administrative Law"],
          location: "Washington, DC",
          state: "DC",
          city: "Washington",
          experience: "20+ years",
          rating: 5,
          reviewCount: 24,
          email: "sarah.mitchell@millegal.com",
          phone: "(202) 555-0101",
          bio: "Former military prosecutor turned defense attorney with extensive experience in court-martial proceedings.",
          pricingTier: "premium",
          hourlyRate: "$450-650/hour",
          availableForEmergency: true,
          responseTime: "< 2 hours"
        },
        {
          firstName: "David",
          lastName: "Chen",
          title: "Major David Chen (Ret.)",
          specialties: ["Security Clearance", "Appeals"],
          location: "San Diego, CA",
          state: "CA",
          city: "San Diego",
          experience: "15+ years",
          rating: 5,
          reviewCount: 31,
          email: "david.chen@millegal.com",
          phone: "(619) 555-0102",
          bio: "Specialized in security clearance investigations and appeals with a background in military intelligence.",
          pricingTier: "standard",
          hourlyRate: "$275-400/hour",
          availableForEmergency: false,
          responseTime: "< 24 hours"
        },
        {
          firstName: "Maria",
          lastName: "Rodriguez",
          title: "Lt. Col. Maria Rodriguez",
          specialties: ["Appeals", "Admin Separation"],
          location: "Norfolk, VA",
          state: "VA",
          city: "Norfolk",
          experience: "12+ years",
          rating: 5,
          reviewCount: 18,
          email: "maria.rodriguez@millegal.com",
          phone: "(757) 555-0103",
          bio: "Expert in administrative separations and military appeals with a focus on protecting service members' careers.",
          pricingTier: "affordable",
          hourlyRate: "$150-250/hour",
          availableForEmergency: true,
          responseTime: "< 4 hours"
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
    } catch (error) {
      console.error("Error seeding data:", error);
    }
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await this.db.insert(users).values(insertUser).returning();
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
}

export const storage = new DatabaseStorage();
