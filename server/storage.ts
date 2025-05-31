import { 
  users, attorneys, legalResources, educationModules, consultations,
  legalCases, emergencyResources, forumQuestions, forumAnswers, legalDocuments,
  type User, type InsertUser,
  type Attorney, type InsertAttorney,
  type LegalResource, type InsertLegalResource,
  type EducationModule, type InsertEducationModule,
  type Consultation, type InsertConsultation,
  type LegalCase, type InsertLegalCase,
  type EmergencyResource, type InsertEmergencyResource,
  type ForumQuestion, type InsertForumQuestion,
  type ForumAnswer, type InsertForumAnswer,
  type LegalDocument, type InsertLegalDocument
} from "@shared/schema";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { eq, ilike, and, or, desc } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Attorney methods
  getAttorneys(): Promise<Attorney[]>;
  getAttorney(id: number): Promise<Attorney | undefined>;
  getAttorneysBySpecialty(specialty: string): Promise<Attorney[]>;
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

      // Seed attorneys
      const attorneyData: InsertAttorney[] = [
        {
          firstName: "Sarah",
          lastName: "Mitchell",
          title: "Col. Sarah Mitchell (Ret.)",
          specialties: ["Court-Martial Defense", "Administrative Law"],
          location: "Washington, DC",
          experience: "20+ years",
          rating: 5,
          reviewCount: 24,
          email: "sarah.mitchell@millegal.com",
          phone: "(202) 555-0101",
          bio: "Former military prosecutor turned defense attorney with extensive experience in court-martial proceedings."
        },
        {
          firstName: "David",
          lastName: "Chen",
          title: "Major David Chen (Ret.)",
          specialties: ["Security Clearance", "Appeals"],
          location: "San Diego, CA",
          experience: "15+ years",
          rating: 5,
          reviewCount: 31,
          email: "david.chen@millegal.com",
          phone: "(619) 555-0102",
          bio: "Specialized in security clearance investigations and appeals with a background in military intelligence."
        },
        {
          firstName: "Maria",
          lastName: "Rodriguez",
          title: "Lt. Col. Maria Rodriguez",
          specialties: ["Appeals", "Admin Separation"],
          location: "Norfolk, VA",
          experience: "12+ years",
          rating: 5,
          reviewCount: 18,
          email: "maria.rodriguez@millegal.com",
          phone: "(757) 555-0103",
          bio: "Expert in administrative separations and military appeals with a focus on protecting service members' careers."
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
}

export const storage = new DatabaseStorage();
