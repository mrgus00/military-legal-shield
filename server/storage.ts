import { 
  users, attorneys, legalResources, educationModules, consultations,
  type User, type InsertUser,
  type Attorney, type InsertAttorney,
  type LegalResource, type InsertLegalResource,
  type EducationModule, type InsertEducationModule,
  type Consultation, type InsertConsultation
} from "@shared/schema";

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

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private attorneys: Map<number, Attorney>;
  private legalResources: Map<number, LegalResource>;
  private educationModules: Map<number, EducationModule>;
  private consultations: Map<number, Consultation>;
  
  private currentUserId: number;
  private currentAttorneyId: number;
  private currentLegalResourceId: number;
  private currentEducationModuleId: number;
  private currentConsultationId: number;

  constructor() {
    this.users = new Map();
    this.attorneys = new Map();
    this.legalResources = new Map();
    this.educationModules = new Map();
    this.consultations = new Map();
    
    this.currentUserId = 1;
    this.currentAttorneyId = 1;
    this.currentLegalResourceId = 1;
    this.currentEducationModuleId = 1;
    this.currentConsultationId = 1;

    this.seedData();
  }

  private seedData() {
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

    attorneyData.forEach(attorney => this.createAttorney(attorney));

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

    resourceData.forEach(resource => this.createLegalResource(resource));

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

    moduleData.forEach(module => this.createEducationModule(module));
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id, isActive: true };
    this.users.set(id, user);
    return user;
  }

  // Attorney methods
  async getAttorneys(): Promise<Attorney[]> {
    return Array.from(this.attorneys.values()).filter(attorney => attorney.isActive);
  }

  async getAttorney(id: number): Promise<Attorney | undefined> {
    const attorney = this.attorneys.get(id);
    return attorney?.isActive ? attorney : undefined;
  }

  async getAttorneysBySpecialty(specialty: string): Promise<Attorney[]> {
    return Array.from(this.attorneys.values()).filter(
      attorney => attorney.isActive && attorney.specialties.includes(specialty)
    );
  }

  async createAttorney(insertAttorney: InsertAttorney): Promise<Attorney> {
    const id = this.currentAttorneyId++;
    const attorney: Attorney = { ...insertAttorney, id, isActive: true };
    this.attorneys.set(id, attorney);
    return attorney;
  }

  // Legal resource methods
  async getLegalResources(): Promise<LegalResource[]> {
    return Array.from(this.legalResources.values()).filter(resource => resource.isActive);
  }

  async getLegalResource(id: number): Promise<LegalResource | undefined> {
    const resource = this.legalResources.get(id);
    return resource?.isActive ? resource : undefined;
  }

  async searchLegalResources(query: string): Promise<LegalResource[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.legalResources.values()).filter(
      resource => resource.isActive && (
        resource.title.toLowerCase().includes(lowercaseQuery) ||
        resource.content.toLowerCase().includes(lowercaseQuery) ||
        resource.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
      )
    );
  }

  async getLegalResourcesByCategory(category: string): Promise<LegalResource[]> {
    return Array.from(this.legalResources.values()).filter(
      resource => resource.isActive && resource.category === category
    );
  }

  async createLegalResource(insertResource: InsertLegalResource): Promise<LegalResource> {
    const id = this.currentLegalResourceId++;
    const resource: LegalResource = { ...insertResource, id, isActive: true };
    this.legalResources.set(id, resource);
    return resource;
  }

  // Education module methods
  async getEducationModules(): Promise<EducationModule[]> {
    return Array.from(this.educationModules.values()).filter(module => module.isActive);
  }

  async getEducationModule(id: number): Promise<EducationModule | undefined> {
    const module = this.educationModules.get(id);
    return module?.isActive ? module : undefined;
  }

  async createEducationModule(insertModule: InsertEducationModule): Promise<EducationModule> {
    const id = this.currentEducationModuleId++;
    const module: EducationModule = { ...insertModule, id, isActive: true };
    this.educationModules.set(id, module);
    return module;
  }

  // Consultation methods
  async getConsultations(): Promise<Consultation[]> {
    return Array.from(this.consultations.values());
  }

  async getConsultation(id: number): Promise<Consultation | undefined> {
    return this.consultations.get(id);
  }

  async createConsultation(insertConsultation: InsertConsultation): Promise<Consultation> {
    const id = this.currentConsultationId++;
    const consultation: Consultation = { 
      ...insertConsultation, 
      id, 
      status: "pending",
      createdAt: new Date()
    };
    this.consultations.set(id, consultation);
    return consultation;
  }
}

export const storage = new MemStorage();
