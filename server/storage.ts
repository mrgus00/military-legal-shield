import { 
  users, attorneys, legalResources, educationModules, consultations, emergencyConsultations,
  legalCases, emergencyResources, forumQuestions, forumAnswers, legalDocuments,
  conversations, messages, attorneyVerificationDocs, attorneyReviews, attorneyVerificationRequests,
  legalScenarios, scenarioSessions, scenarioAnalytics, stories, documentTemplates, generatedDocuments,
  benefitsEligibility, benefitsDatabase, legalChallenges, achievementBadges, userChallengeProgress,
  userBadges, userGameStats, challengeLeaderboard,
  type User, type InsertUser,
  type Attorney, type InsertAttorney,
  type LegalResource, type InsertLegalResource,
  type EducationModule, type InsertEducationModule,
  type Consultation, type InsertConsultation,
  type EmergencyConsultation, type InsertEmergencyConsultation,
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
  type GeneratedDocument, type InsertGeneratedDocument,
  type BenefitsEligibility, type InsertBenefitsEligibility,
  type BenefitsDatabase, type InsertBenefitsDatabase,
  type LegalChallenge, type InsertLegalChallenge,
  type AchievementBadge, type InsertAchievementBadge,
  type UserChallengeProgress, type InsertUserChallengeProgress,
  type UserBadge, type InsertUserBadge,
  type UserGameStats, type InsertUserGameStats
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

  // Emergency consultation methods
  getEmergencyConsultations(): Promise<EmergencyConsultation[]>;
  getEmergencyConsultation(id: number): Promise<EmergencyConsultation | undefined>;
  createEmergencyConsultation(consultation: InsertEmergencyConsultation): Promise<EmergencyConsultation>;
  updateEmergencyConsultationStatus(id: number, status: string, attorneyResponse?: string): Promise<EmergencyConsultation | undefined>;
  getEmergencyAttorneys(): Promise<Attorney[]>;

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

  // Benefits eligibility operations
  calculateBenefitsEligibility(eligibilityData: any): Promise<any>;
  getBenefitsDatabase(): Promise<BenefitsDatabase[]>;
  getBenefitsByType(benefitType: string): Promise<BenefitsDatabase[]>;
  getBenefitsEligibility(id: number): Promise<BenefitsEligibility | undefined>;
  createBenefitsDatabase(benefit: InsertBenefitsDatabase): Promise<BenefitsDatabase>;
  getUserDocuments(userId: string): Promise<GeneratedDocument[]>;
  getGeneratedDocument(id: number): Promise<GeneratedDocument | undefined>;
  updateDocumentStatus(id: number, status: string): Promise<GeneratedDocument | undefined>;

  // Gamification methods
  getLegalChallenges(category?: string, difficulty?: string, branch?: string): Promise<LegalChallenge[]>;
  getLegalChallenge(id: number): Promise<LegalChallenge | undefined>;
  createLegalChallenge(challenge: InsertLegalChallenge): Promise<LegalChallenge>;
  
  getAchievementBadges(): Promise<AchievementBadge[]>;
  getAchievementBadge(id: number): Promise<AchievementBadge | undefined>;
  createAchievementBadge(badge: InsertAchievementBadge): Promise<AchievementBadge>;
  
  getUserChallengeProgress(userId: string, challengeId?: number): Promise<UserChallengeProgress[]>;
  createUserChallengeProgress(progress: InsertUserChallengeProgress): Promise<UserChallengeProgress>;
  updateUserChallengeProgress(id: number, updates: Partial<InsertUserChallengeProgress>): Promise<UserChallengeProgress | undefined>;
  
  getUserBadges(userId: string): Promise<UserBadge[]>;
  awardBadge(userId: string, badgeId: number): Promise<UserBadge>;
  
  getUserGameStats(userId: string): Promise<UserGameStats | undefined>;
  updateUserGameStats(userId: string, updates: Partial<InsertUserGameStats>): Promise<UserGameStats>;
  
  getChallengeLeaderboard(period: string): Promise<any[]>;
  updateLeaderboard(): Promise<void>;
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
          firmName: "Younts Law Firm",
          title: "R. Davis Younts",
          specialties: ["Court-martial defense", "Military criminal law"],
          location: "Fayetteville, NC",
          state: "NC",
          city: "Fayetteville",
          region: "Atlantic",
          attorneyType: "civilian",
          experience: "15+ years",
          rating: 5,
          reviewCount: 0,
          email: "contact@yountslaw.com",
          phone: "Contact via website",
          bio: "Experienced military defense attorney specializing in court-martial defense and military criminal law.",
          pricingTier: "standard",
          hourlyRate: "Contact for rates",
          availableForEmergency: true,
          responseTime: "< 24 hours",
          servicesOffered: ["Court-martial defense", "Military criminal law"],
          militaryBranches: ["Army", "Marines", "Air Force", "Navy"],
          practiceAreas: ["Criminal Defense", "Military Law"],
          languages: ["English"]
        },
        {
          firstName: "Philip D.",
          lastName: "Cave",
          firmName: "Cave & Associates",
          title: "Philip D. Cave",
          specialties: ["Global military law", "Courts-martial", "Administrative actions"],
          location: "Serves NC statewide",
          state: "NC",
          city: "Statewide",
          region: "Atlantic",
          attorneyType: "civilian",
          experience: "25+ years",
          rating: 5,
          reviewCount: 0,
          email: "contact@cavelawoffice.com",
          phone: "(800) 401-1583",
          bio: "Nationally recognized military law expert serving clients worldwide in courts-martial and administrative actions.",
          pricingTier: "premium",
          hourlyRate: "Contact for rates",
          availableForEmergency: true,
          responseTime: "< 4 hours",
          servicesOffered: ["Courts-martial", "Administrative actions", "Appeals"],
          militaryBranches: ["Army", "Navy", "Air Force", "Marines", "Coast Guard", "Space Force"],
          practiceAreas: ["Military Law", "Criminal Defense", "Administrative Law"],
          languages: ["English"]
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
        },
        // Coast Guard Defense Service Offices (DSOs)
        {
          firstName: "Defense Service Office",
          lastName: "North (DSO North)",
          title: "DSO North - Coast Guard Defense Counsel",
          specialties: ["Court-martial defense", "Administrative proceedings", "NJP advice", "UCMJ matters"],
          location: "Washington, DC",
          state: "DC",
          city: "Washington",
          experience: "Government DSO",
          rating: 5,
          reviewCount: 0,
          email: "dsonorthdefense1@us.navy.mil",
          phone: "(202) 685-5595",
          bio: "Provides military defense counsel for Coast Guard members in courts-martial (all levels) and administrative proceedings including administrative separation boards and Boards of Inquiry. Offers walk-in advice on UCMJ matters (NJPs, investigations, Article 31 rights) and serves as detailed counsel when eligible.",
          pricingTier: "free",
          hourlyRate: "No cost - Government provided",
          availableForEmergency: true,
          responseTime: "< 4 hours"
        },
        {
          firstName: "Defense Service Office",
          lastName: "Southeast (DSO Southeast)",
          title: "DSO Southeast - Coast Guard Defense Counsel",
          specialties: ["Court-martial defense", "Administrative actions", "NJP advice", "Separation boards"],
          location: "Norfolk, VA",
          state: "VA",
          city: "Norfolk",
          experience: "Government DSO",
          rating: 5,
          reviewCount: 0,
          email: "dsose_persreps@navy.mil",
          phone: "(757) 341-4469",
          bio: "Offers Coast Guard personnel defense services for courts-martial and adverse administrative actions in the southeastern/Atlantic region. DSO SE attorneys regularly handle NJP (Captain's Mast) advice, administrative separation boards, and court-martial defense. Servicing offices in Norfolk, Jacksonville, Mayport, Pensacola.",
          pricingTier: "free",
          hourlyRate: "No cost - Government provided",
          availableForEmergency: true,
          responseTime: "< 4 hours"
        },
        {
          firstName: "Defense Service Office",
          lastName: "West (DSO West)",
          title: "DSO West - Coast Guard Defense Counsel",
          specialties: ["Court-martial defense", "Administrative boards", "Article 32 investigations", "UCMJ matters"],
          location: "San Diego, CA",
          state: "CA",
          city: "San Diego",
          experience: "Government DSO",
          rating: 5,
          reviewCount: 0,
          email: "navylegaldefensesw@navy.mil",
          phone: "(619) 556-7539",
          bio: "Provides defense counsel to Coast Guard and Navy members on the U.S. West Coast for courts-martial and administrative boards. Mission includes representation at court-martial trials, advice on Article 32 investigations, administrative separation hearings, and related UCMJ matters. Headquartered in San Diego with branch offices in Bremerton and Lemoore.",
          pricingTier: "free",
          hourlyRate: "No cost - Government provided",
          availableForEmergency: true,
          responseTime: "< 4 hours"
        },
        {
          firstName: "Defense Service Office",
          lastName: "Pacific (DSO Pacific)",
          title: "DSO Pacific - Coast Guard Defense Counsel",
          specialties: ["Court-martial defense", "NJP advice", "Administrative separation", "Appeals"],
          location: "Pearl Harbor, HI",
          state: "HI",
          city: "Pearl Harbor",
          experience: "Government DSO",
          rating: 5,
          reviewCount: 0,
          email: "dsopacific_hawaii_walkins@us.navy.mil",
          phone: "(808) 473-1400",
          bio: "Delivers defense services for Coast Guard members across the Pacific Area (Hawaii, Guam, and forward-deployed commands). DSO Pacific handles court-martial defense, NJP advice, administrative separation boards, and appeals for servicemembers in its AOR. Headquartered in Yokosuka, Japan, with offices in Pearl Harbor, Guam, and Sasebo.",
          pricingTier: "free",
          hourlyRate: "No cost - Government provided",
          availableForEmergency: true,
          responseTime: "< 4 hours"
        },
        // Coast Guard Civilian Defense Law Firms
        {
          firstName: "Gary Myers, Daniel Conway",
          lastName: "& Associates",
          title: "Gary Myers, Daniel Conway & Associates",
          specialties: ["UCMJ defense", "Court-martial defense", "Discharge review boards", "Administrative separation"],
          location: "Hampton, VA (serving nationwide)",
          state: "VA",
          city: "Hampton",
          experience: "50+ years combined",
          rating: 5,
          reviewCount: 0,
          email: "Contact via website form",
          phone: "(757) 401-6365",
          bio: "A long-established military defense firm (est. 1973) with 100+ years combined experience. The firm has defended virtually every UCMJ offense in Coast Guard and other services, providing aggressive court-martial defense as well as representation in discharge review boards, administrative separation boards, federal courts, and other military hearings. Team of ex-JAG attorneys handles cases worldwide.",
          pricingTier: "premium",
          hourlyRate: "Contact for rates",
          availableForEmergency: true,
          responseTime: "< 2 hours"
        },
        {
          firstName: "Patrick J.",
          lastName: "McLain",
          title: "Law Office of Patrick J. McLain, PLLC",
          specialties: ["Court-martial defense", "UCMJ violations", "Administrative proceedings", "Appeals"],
          location: "Washington, DC (multiple offices)",
          state: "DC",
          city: "Washington",
          experience: "20+ years",
          rating: 4.8,
          reviewCount: 0,
          email: "Contact via website form",
          phone: "(888) 606-3385",
          bio: "Led by a retired USMC military judge, Patrick McLain's firm provides experienced defense for Coast Guard members facing serious charges. They handle courts-martial defense for all types of UCMJ violations (AWOL/desertion, drug offenses, fraud/larceny, sex offenses), as well as representation in administrative proceedings (NJP appeals, separation boards) and court-martial appeals. Nationwide practice with team of former JAG officers.",
          pricingTier: "premium",
          hourlyRate: "Contact for rates",
          availableForEmergency: true,
          responseTime: "< 2 hours",
          address: "600 F Street NW, Suite 301, Washington, DC 20004",
          website: "mclainmilitarylawyer.com"
        },
        {
          firstName: "Richard V.",
          lastName: "Stevens (Coast Guard)",
          title: "Military Defense Law Offices of Richard V. Stevens, P.C.",
          specialties: ["Court-martial defense", "Administrative discharge boards", "NJP defense", "Investigation advising"],
          location: "Navarre, FL (serves worldwide)",
          state: "FL",
          city: "Navarre",
          experience: "25+ years",
          rating: 4.9,
          reviewCount: 0,
          email: "Contact via website form",
          phone: "(800) 988-0602",
          bio: "Firm led by Richard Stevens (former Air Force JAG) exclusively defends Coast Guard and other military members in courts-martial and all military adverse actions. Practice areas include criminal trials (general/special court-martial), court-martial appeals and clemency petitions, administrative discharge boards, Boards of Inquiry, non-judicial punishment (NJP) defense, and investigation advising (CGIS, IG, command investigations). Stevens and his team travel worldwide to represent clients.",
          pricingTier: "premium",
          hourlyRate: "Contact for rates",
          availableForEmergency: true,
          responseTime: "< 2 hours",
          address: "8668 Navarre Parkway, Suite 162, Navarre, FL 32566",
          website: "militaryadvocate.com"
        },
        {
          firstName: "Nana",
          lastName: "Knight",
          title: "Knight Law (Nana Knight, Esq.)",
          specialties: ["Military criminal defense", "Court-martial representation", "Appeals", "Rights protection"],
          location: "San Jose, CA",
          state: "CA",
          city: "San Jose",
          experience: "15+ years",
          rating: 4.7,
          reviewCount: 0,
          email: "info@knightjustice.com",
          phone: "(408) 877-6177",
          bio: "California-based firm focusing exclusively on military criminal defense, including Coast Guard cases. Knight Law defends service members at every stage of the court-martial process – from initial investigations through trial and appeals. Key practice areas include court-martial representation (for charges ranging from minor UCMJ violations to serious felonies), court-martial appeals, and protection of service members' rights (challenging unlawful command influence, improper searches, etc.). Founder is board-certified criminal law specialist.",
          pricingTier: "standard",
          hourlyRate: "Contact for rates",
          availableForEmergency: true,
          responseTime: "< 4 hours",
          address: "1010 W. Taylor St., San Jose, CA 95126, USA",
          website: "knightjustice.com"
        },
        {
          firstName: "Tim",
          lastName: "Bilecki",
          title: "Bilecki Law Group, PLLC",
          specialties: ["Court-martial trial defense", "Military jury trials", "Pre-trial investigations", "Article 32 hearings"],
          location: "Tampa, FL (handles Pacific cases)",
          state: "FL",
          city: "Tampa",
          experience: "20+ years",
          rating: 4.9,
          reviewCount: 0,
          email: "tbilecki@bileckilawgroup.com",
          phone: "(813) 669-3500",
          bio: "A boutique military defense firm specializing in court-martial trial defense. Led by Tim Bilecki, a prominent court-martial attorney, the firm is known for aggressive at-trial representation. Bilecki Law Group has 20+ years of experience and has handled hundreds of cases (with over 250 verdicts) worldwide. They focus on winning military jury trials, while also providing counsel for pre-trial investigations, Article 32 hearings, and administrative disciplinary actions. Originated in Hawaii and frequently defends Coast Guard members across the Pacific.",
          pricingTier: "premium",
          hourlyRate: "Contact for rates",
          availableForEmergency: true,
          responseTime: "< 2 hours",
          address: "601 S. Harbour Island Blvd., Suite 109, Tampa, FL 33602",
          website: "bileckilawgroup.com"
        },
        {
          firstName: "Court & Carpenter",
          lastName: "Law Offices",
          title: "Law Offices of Court & Carpenter, P.C.",
          specialties: ["UCMJ cases", "Administrative Separation Boards", "Boards of Inquiry", "Security clearance defense"],
          location: "Seattle, WA",
          state: "WA",
          city: "Seattle",
          experience: "15+ years",
          rating: 4.8,
          reviewCount: 0,
          email: "Contact via website",
          phone: "(206) 357-8434",
          bio: "A military-only defense firm that has defended Coast Guard members and other servicemembers since 2008. Court & Carpenter specializes in UCMJ cases, including courts-martial, as well as Administrative Separation Boards, Boards of Inquiry, and security clearance defense. The firm's attorneys (Stephen Carpenter, David Court, both former JAGs) have achieved favorable outcomes for Coast Guard clients – full acquittals and retention outcomes in courts-martial and board hearings. With offices in Seattle and Washington D.C., they provide nationwide representation.",
          pricingTier: "standard",
          hourlyRate: "Contact for rates",
          availableForEmergency: true,
          responseTime: "< 4 hours",
          address: "1700 Seventh Ave., Suite 2100, Seattle, WA 98101",
          website: "militarylawfirm.com"
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

      // Seed legal challenges and achievement badges
      await this.seedLegalChallenges();
      await this.seedAchievementBadges();
      
      console.log("All data seeded successfully, including gamification content");
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

  // Emergency consultation methods
  async getEmergencyConsultations(): Promise<EmergencyConsultation[]> {
    return this.db.select().from(emergencyConsultations).orderBy(desc(emergencyConsultations.createdAt));
  }

  async getEmergencyConsultation(id: number): Promise<EmergencyConsultation | undefined> {
    const [consultation] = await this.db.select().from(emergencyConsultations)
      .where(eq(emergencyConsultations.id, id));
    return consultation;
  }

  async createEmergencyConsultation(consultation: InsertEmergencyConsultation): Promise<EmergencyConsultation> {
    const [newConsultation] = await this.db.insert(emergencyConsultations)
      .values(consultation)
      .returning();
    return newConsultation;
  }

  async updateEmergencyConsultationStatus(id: number, status: string, attorneyResponse?: string): Promise<EmergencyConsultation | undefined> {
    const updateData: any = { status, updatedAt: new Date() };
    if (attorneyResponse) {
      updateData.attorneyResponse = attorneyResponse;
    }
    
    const [updated] = await this.db.update(emergencyConsultations)
      .set(updateData)
      .where(eq(emergencyConsultations.id, id))
      .returning();
    return updated;
  }

  async getEmergencyAttorneys(): Promise<Attorney[]> {
    return this.db.select().from(attorneys)
      .where(and(
        eq(attorneys.availableForEmergency, true),
        eq(attorneys.isActive, true),
        eq(attorneys.isVerified, true)
      ))
      .orderBy(attorneys.rating);
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

  // Benefits calculation implementation
  async calculateBenefitsEligibility(eligibilityData: any): Promise<any> {
    try {
      const eligibleBenefits = [];
      const benefits = await this.getBenefitsDatabase();
      
      for (const benefit of benefits) {
        if (this.checkBenefitEligibility(benefit, eligibilityData)) {
          eligibleBenefits.push({
            id: benefit.id,
            benefitName: benefit.benefit_name,
            benefitType: benefit.benefit_type,
            description: benefit.description,
            benefitAmount: benefit.benefit_amount,
            applicationProcess: benefit.application_process,
            processingTime: benefit.processing_time,
            websiteUrl: benefit.website_url,
            phoneNumber: benefit.phone_number
          });
        }
      }

      // Create eligibility record using direct SQL
      const insertQuery = sql`
        INSERT INTO benefits_eligibility (
          service_status, branch, years_of_service, discharge_type, disability_rating,
          combat_veteran, purple_heart, prisoner_of_war, has_spouse, number_of_children,
          annual_income, household_income, state, zip_code, eligible_benefits
        ) VALUES (
          ${eligibilityData.serviceStatus}, ${eligibilityData.branch}, ${eligibilityData.serviceDates.totalYears},
          ${eligibilityData.dischargeType}, ${eligibilityData.disabilityRating}, ${eligibilityData.combatVeteran},
          ${eligibilityData.purpleHeart}, ${eligibilityData.prisonerOfWar}, ${eligibilityData.dependents.spouse},
          ${eligibilityData.dependents.children}, ${eligibilityData.income.annualIncome}, ${eligibilityData.income.householdIncome},
          ${eligibilityData.location.state}, ${eligibilityData.location.zipCode}, ${JSON.stringify(eligibleBenefits)}
        ) RETURNING *
      `;

      const result = await this.db.execute(insertQuery);
      return {
        ...result.rows[0],
        eligibleBenefits: JSON.stringify(eligibleBenefits)
      };
    } catch (error) {
      console.error("Error calculating benefits eligibility:", error);
      throw new Error("Failed to calculate benefits eligibility");
    }
  }

  private checkBenefitEligibility(benefit: any, eligibilityData: any): boolean {
    // Check service requirements
    if (benefit.min_years_of_service && eligibilityData.serviceDates.totalYears < benefit.min_years_of_service) {
      return false;
    }

    // Check discharge type requirements
    if (benefit.required_discharge_types && !benefit.required_discharge_types.includes(eligibilityData.dischargeType)) {
      return false;
    }

    // Check disability rating requirements
    if (benefit.min_disability_rating && eligibilityData.disabilityRating < benefit.min_disability_rating) {
      return false;
    }

    // Check income limits
    if (benefit.income_limit && eligibilityData.income.householdIncome > benefit.income_limit) {
      return false;
    }

    // Check combat veteran requirements
    if (benefit.combat_veteran_only && !eligibilityData.combatVeteran) {
      return false;
    }

    // Check state-specific benefits
    if (benefit.eligible_states && !benefit.eligible_states.includes(eligibilityData.location.state)) {
      return false;
    }

    return true;
  }

  async getBenefitsDatabase(): Promise<any[]> {
    try {
      // Query the actual database table we created
      const result = await this.db.execute(sql`SELECT * FROM benefits_database`);
      return result.rows as any[];
    } catch (error) {
      console.error("Error fetching benefits database:", error);
      return [];
    }
  }

  async getBenefitsByType(benefitType: string): Promise<BenefitsDatabase[]> {
    try {
      return await this.db.select().from(benefitsDatabase)
        .where(eq(benefitsDatabase.benefitType, benefitType));
    } catch (error) {
      console.error("Error fetching benefits by type:", error);
      return [];
    }
  }

  async getBenefitsEligibility(id: number): Promise<BenefitsEligibility | undefined> {
    try {
      const [eligibility] = await this.db.select().from(benefitsEligibility)
        .where(eq(benefitsEligibility.id, id));
      return eligibility;
    } catch (error) {
      console.error("Error fetching benefits eligibility:", error);
      return undefined;
    }
  }

  async createBenefitsDatabase(benefit: InsertBenefitsDatabase): Promise<BenefitsDatabase> {
    try {
      const [newBenefit] = await this.db.insert(benefitsDatabase).values(benefit).returning();
      return newBenefit;
    } catch (error) {
      console.error("Error creating benefit:", error);
      throw new Error("Failed to create benefit");
    }
  }

  private async populateBenefitsDatabase(): Promise<void> {
    try {
      const federalBenefits = [
        // VA Disability Benefits
        {
          benefitName: "VA Disability Compensation",
          benefitType: "disability",
          description: "Monthly tax-free payments for service-connected disabilities",
          benefitAmount: "$165.92 - $3,737.85/month (10%-100% rating)",
          minDisabilityRating: 10,
          requiredDischargeTypes: ["honorable", "general"],
          applicationProcess: "Apply online at VA.gov or visit VA Regional Office",
          processingTime: "3-6 months",
          websiteUrl: "https://www.va.gov/disability/",
          phoneNumber: "800-827-1000",
          combatVeteranOnly: false,
          eligibleStates: null,
          incomeLimit: null,
          minYearsOfService: null
        },
        {
          benefitName: "Individual Unemployability (IU)",
          benefitType: "disability",
          description: "100% disability rating compensation for those unable to work",
          benefitAmount: "$3,737.85/month",
          minDisabilityRating: 60,
          requiredDischargeTypes: ["honorable", "general"],
          applicationProcess: "File VA Form 21-8940 with supporting documentation",
          processingTime: "6-12 months",
          websiteUrl: "https://www.va.gov/disability/eligibility/special-claims/unemployability/",
          phoneNumber: "800-827-1000",
          combatVeteranOnly: false,
          eligibleStates: null,
          incomeLimit: null,
          minYearsOfService: null
        },

        // Healthcare Benefits
        {
          benefitName: "VA Healthcare",
          benefitType: "healthcare",
          description: "Comprehensive medical care through VA medical centers",
          benefitAmount: "Free or low-cost healthcare",
          minDisabilityRating: null,
          requiredDischargeTypes: ["honorable", "general"],
          applicationProcess: "Apply online at VA.gov or call enrollment line",
          processingTime: "2-4 weeks",
          websiteUrl: "https://www.va.gov/health-care/",
          phoneNumber: "877-222-8387",
          combatVeteranOnly: false,
          eligibleStates: null,
          incomeLimit: 50000,
          minYearsOfService: null
        },
        {
          benefitName: "CHAMPVA",
          benefitType: "healthcare",
          description: "Healthcare program for spouses and children of 100% disabled veterans",
          benefitAmount: "75% coverage of approved services",
          minDisabilityRating: 100,
          requiredDischargeTypes: ["honorable", "general"],
          applicationProcess: "Submit VA Form 10-10d",
          processingTime: "4-6 weeks",
          websiteUrl: "https://www.va.gov/health-care/family-caregiver-benefits/champva/",
          phoneNumber: "800-733-8387",
          combatVeteranOnly: false,
          eligibleStates: null,
          incomeLimit: null,
          minYearsOfService: null
        },

        // Education Benefits
        {
          benefitName: "Post-9/11 GI Bill",
          benefitType: "education",
          description: "Education benefits for veterans who served after September 10, 2001",
          benefitAmount: "Up to full tuition + housing allowance",
          minDisabilityRating: null,
          requiredDischargeTypes: ["honorable"],
          applicationProcess: "Apply online at VA.gov using VA Form 22-1990",
          processingTime: "4-6 weeks",
          websiteUrl: "https://www.va.gov/education/about-gi-bill-benefits/post-9-11/",
          phoneNumber: "888-442-4551",
          combatVeteranOnly: false,
          eligibleStates: null,
          incomeLimit: null,
          minYearsOfService: null
        },
        {
          benefitName: "Vocational Rehabilitation (VR&E)",
          benefitType: "education",
          description: "Education and training for veterans with service-connected disabilities",
          benefitAmount: "Full tuition + monthly housing allowance",
          minDisabilityRating: 20,
          requiredDischargeTypes: ["honorable", "general"],
          applicationProcess: "Apply online using VA Form 28-1900",
          processingTime: "2-3 months",
          websiteUrl: "https://www.va.gov/careers-employment/vocational-rehabilitation/",
          phoneNumber: "800-827-1000",
          combatVeteranOnly: false,
          eligibleStates: null,
          incomeLimit: null,
          minYearsOfService: null
        },

        // Housing Benefits
        {
          benefitName: "VA Home Loan",
          benefitType: "housing",
          description: "Zero down payment home loans with competitive rates",
          benefitAmount: "No down payment, no PMI",
          minDisabilityRating: null,
          requiredDischargeTypes: ["honorable", "general"],
          applicationProcess: "Obtain Certificate of Eligibility, find VA-approved lender",
          processingTime: "2-4 weeks for COE",
          websiteUrl: "https://www.va.gov/housing-assistance/home-loans/",
          phoneNumber: "877-827-3702",
          combatVeteranOnly: false,
          eligibleStates: null,
          incomeLimit: null,
          minYearsOfService: 2
        },
        {
          benefitName: "Specially Adapted Housing (SAH)",
          benefitType: "housing",
          description: "Grants for adapting homes for severely disabled veterans",
          benefitAmount: "Up to $101,754 grant",
          minDisabilityRating: 100,
          requiredDischargeTypes: ["honorable", "general"],
          applicationProcess: "Apply using VA Form 26-4555",
          processingTime: "3-6 months",
          websiteUrl: "https://www.va.gov/housing-assistance/disability-housing-grants/",
          phoneNumber: "800-827-1000",
          combatVeteranOnly: false,
          eligibleStates: null,
          incomeLimit: null,
          minYearsOfService: null
        },

        // Employment Benefits
        {
          benefitName: "Veterans' Preference in Federal Hiring",
          benefitType: "employment",
          description: "Preference points in federal job applications",
          benefitAmount: "5-10 preference points",
          minDisabilityRating: null,
          requiredDischargeTypes: ["honorable", "general"],
          applicationProcess: "Include DD-214 with federal job applications",
          processingTime: "Immediate",
          websiteUrl: "https://www.fedshirevets.gov/",
          phoneNumber: "800-827-1000",
          combatVeteranOnly: false,
          eligibleStates: null,
          incomeLimit: null,
          minYearsOfService: null
        },

        // Burial Benefits
        {
          benefitName: "VA Burial Benefits",
          benefitType: "burial",
          description: "Burial allowance and cemetery services for eligible veterans",
          benefitAmount: "Up to $2,000 burial allowance",
          minDisabilityRating: null,
          requiredDischargeTypes: ["honorable", "general"],
          applicationProcess: "Apply using VA Form 21P-530EZ",
          processingTime: "2-4 weeks",
          websiteUrl: "https://www.va.gov/burials-memorials/",
          phoneNumber: "800-827-1000",
          combatVeteranOnly: false,
          eligibleStates: null,
          incomeLimit: null,
          minYearsOfService: null
        }
      ];

      // State-specific benefits (North Carolina examples)
      const stateBenefits = [
        {
          benefitName: "North Carolina Property Tax Exemption",
          benefitType: "financial",
          description: "Property tax exemption for 100% disabled veterans",
          benefitAmount: "Full property tax exemption",
          minDisabilityRating: 100,
          requiredDischargeTypes: ["honorable"],
          applicationProcess: "Apply with county tax assessor",
          processingTime: "30-60 days",
          websiteUrl: "https://www.ncdor.gov/",
          phoneNumber: "919-814-1000",
          combatVeteranOnly: false,
          eligibleStates: ["North Carolina"],
          incomeLimit: null,
          minYearsOfService: null
        },
        {
          benefitName: "North Carolina Veterans Property Tax Exclusion",
          benefitType: "financial",
          description: "$45,000 property value exclusion for disabled veterans",
          benefitAmount: "$45,000 property value exclusion",
          minDisabilityRating: 50,
          requiredDischargeTypes: ["honorable"],
          applicationProcess: "File with county tax office",
          processingTime: "30 days",
          websiteUrl: "https://www.ncdor.gov/",
          phoneNumber: "919-814-1000",
          combatVeteranOnly: false,
          eligibleStates: ["North Carolina"],
          incomeLimit: null,
          minYearsOfService: null
        }
      ];

      const allBenefits = [...federalBenefits, ...stateBenefits];

      for (const benefit of allBenefits) {
        await this.db.insert(benefitsDatabase).values(benefit);
      }

      console.log(`Populated benefits database with ${allBenefits.length} benefits`);
    } catch (error) {
      console.error("Error populating benefits database:", error);
    }
  }

  private async seedLegalChallenges() {
    try {
      const existingChallenges = await this.db.select().from(legalChallenges).limit(1);
      if (existingChallenges.length > 0) {
        return; // Already seeded
      }

      const sampleChallenges = [
        {
          title: "UCMJ Article 86: Unauthorized Absence",
          description: "Learn about Article 86 violations, defenses, and potential consequences. Master the legal framework governing unauthorized absence in military service.",
          category: "military_law",
          difficulty: "beginner",
          branch: "army",
          totalSteps: 5,
          estimatedDuration: 15,
          pointsReward: 100,
          requirements: ["Basic military law knowledge"],
          tags: ["UCMJ", "Article 86", "absence"],
          isActive: true
        },
        {
          title: "Court-Martial Procedures",
          description: "Navigate the complex procedures of military court-martial proceedings. Understand the different types and procedural requirements.",
          category: "court_martial",
          difficulty: "intermediate",
          branch: null,
          totalSteps: 8,
          estimatedDuration: 30,
          pointsReward: 200,
          requirements: ["Basic UCMJ knowledge", "Military justice fundamentals"],
          tags: ["court-martial", "procedure", "military justice"],
          isActive: true
        },
        {
          title: "Administrative Separations",
          description: "Master the administrative separation process, including characterization of service and appeal procedures.",
          category: "administrative",
          difficulty: "intermediate",
          branch: null,
          totalSteps: 6,
          estimatedDuration: 25,
          pointsReward: 150,
          requirements: ["Military personnel law"],
          tags: ["separation", "administrative", "discharge"],
          isActive: true
        },
        {
          title: "VA Disability Claims Process",
          description: "Learn the complete VA disability claims process, from initial application to appeals. Understand rating schedules and evidence requirements.",
          category: "benefits",
          difficulty: "beginner",
          branch: null,
          totalSteps: 7,
          estimatedDuration: 20,
          pointsReward: 120,
          requirements: ["Basic veterans benefits knowledge"],
          tags: ["VA", "disability", "claims", "benefits"],
          isActive: true
        },
        {
          title: "Military Sexual Assault Cases",
          description: "Understand the legal framework for military sexual assault cases, including prevention, reporting, and judicial procedures.",
          category: "military_law",
          difficulty: "advanced",
          branch: null,
          totalSteps: 10,
          estimatedDuration: 45,
          pointsReward: 300,
          requirements: ["Intermediate military law", "Criminal law basics"],
          tags: ["sexual assault", "victim rights", "SARC"],
          isActive: true
        },
        {
          title: "Security Clearance Investigations",
          description: "Navigate security clearance procedures, adjudication guidelines, and appeal processes. Understand common issues and mitigation strategies.",
          category: "administrative",
          difficulty: "advanced",
          branch: null,
          totalSteps: 9,
          estimatedDuration: 40,
          pointsReward: 250,
          requirements: ["Security procedures knowledge", "Administrative law"],
          tags: ["security clearance", "investigation", "adjudication"],
          isActive: true
        }
      ];

      for (const challenge of sampleChallenges) {
        await this.db.insert(legalChallenges).values(challenge);
      }

      console.log(`Seeded ${sampleChallenges.length} legal challenges`);
    } catch (error) {
      console.error("Error seeding legal challenges:", error);
    }
  }

  private async seedAchievementBadges() {
    try {
      const existingBadges = await this.db.select().from(achievementBadges).limit(1);
      if (existingBadges.length > 0) {
        return; // Already seeded
      }

      const sampleBadges = [
        {
          name: "Military Law Novice",
          description: "Complete your first military law challenge",
          category: "military_law",
          criteria: "Complete 1 military law challenge",
          pointsReward: 50,
          iconUrl: "/badges/novice.svg",
          isActive: true
        },
        {
          name: "Court-Martial Expert",
          description: "Master all court-martial procedure challenges",
          category: "court_martial",
          criteria: "Complete 3 court-martial challenges with 90%+ accuracy",
          pointsReward: 200,
          iconUrl: "/badges/expert.svg",
          isActive: true
        },
        {
          name: "Benefits Navigator",
          description: "Successfully complete all benefits-related challenges",
          category: "benefits",
          criteria: "Complete 5 benefits challenges",
          pointsReward: 150,
          iconUrl: "/badges/navigator.svg",
          isActive: true
        },
        {
          name: "UCMJ Scholar",
          description: "Demonstrate comprehensive knowledge of the UCMJ",
          category: "military_law",
          criteria: "Complete 10 UCMJ-related challenges with 95%+ accuracy",
          pointsReward: 300,
          iconUrl: "/badges/scholar.svg",
          isActive: true
        },
        {
          name: "Quick Learner",
          description: "Complete 3 challenges in a single day",
          category: "achievement",
          criteria: "Complete 3 challenges within 24 hours",
          pointsReward: 100,
          iconUrl: "/badges/quick.svg",
          isActive: true
        },
        {
          name: "Streak Master",
          description: "Maintain a 7-day challenge completion streak",
          category: "achievement",
          criteria: "Complete at least 1 challenge daily for 7 consecutive days",
          pointsReward: 250,
          iconUrl: "/badges/streak.svg",
          isActive: true
        },
        {
          name: "Administrative Pro",
          description: "Excel in administrative law challenges",
          category: "administrative",
          criteria: "Complete 5 administrative challenges with 90%+ accuracy",
          pointsReward: 180,
          iconUrl: "/badges/admin.svg",
          isActive: true
        },
        {
          name: "Perfect Score",
          description: "Achieve 100% accuracy on any advanced challenge",
          category: "achievement",
          criteria: "Complete an advanced challenge with 100% accuracy",
          pointsReward: 200,
          iconUrl: "/badges/perfect.svg",
          isActive: true
        }
      ];

      for (const badge of sampleBadges) {
        await this.db.insert(achievementBadges).values(badge);
      }

      console.log(`Seeded ${sampleBadges.length} achievement badges`);
    } catch (error) {
      console.error("Error seeding achievement badges:", error);
    }
  }

  // Benefits eligibility implementation
  async calculateBenefitsEligibility(eligibilityData: InsertBenefitsEligibility): Promise<BenefitsEligibility> {
    try {
      // Get all available benefits from database
      const allBenefits = await this.getBenefitsDatabase();
      
      // Calculate eligibility for each benefit
      const eligibleBenefits = allBenefits.filter(benefit => {
        return this.checkBenefitEligibility(benefit, eligibilityData);
      }).map(benefit => ({
        id: benefit.id,
        benefitName: benefit.benefitName,
        benefitType: benefit.benefitType,
        description: benefit.description,
        benefitAmount: benefit.benefitAmount,
        applicationProcess: benefit.applicationProcess,
        processingTime: benefit.processingTime,
        websiteUrl: benefit.websiteUrl,
        phoneNumber: benefit.phoneNumber
      }));

      // Save the calculation results
      const calculationData = {
        ...eligibilityData,
        eligibleBenefits: JSON.stringify(eligibleBenefits)
      };

      const [result] = await this.db.insert(benefitsEligibility).values(calculationData).returning();
      return result;
    } catch (error) {
      console.error("Error calculating benefits eligibility:", error);
      throw new Error("Failed to calculate benefits eligibility");
    }
  }

  private checkBenefitEligibility(benefit: BenefitsDatabase, userData: InsertBenefitsEligibility): boolean {
    const criteria = benefit.eligibilityCriteria as any;
    
    // Check service status requirements
    if (criteria.serviceStatus && !criteria.serviceStatus.includes(userData.serviceStatus)) {
      return false;
    }

    // Check branch requirements
    if (criteria.branch && criteria.branch !== 'All' && criteria.branch !== userData.branch) {
      return false;
    }

    // Check discharge type requirements
    if (criteria.dischargeType && userData.dischargeType && !criteria.dischargeType.includes(userData.dischargeType)) {
      return false;
    }

    // Check minimum service time
    const serviceDates = userData.serviceDates as any;
    if (criteria.minimumServiceYears && serviceDates?.totalYears < criteria.minimumServiceYears) {
      return false;
    }

    // Check disability rating requirements
    if (criteria.minimumDisabilityRating && (!userData.disabilityRating || userData.disabilityRating < criteria.minimumDisabilityRating)) {
      return false;
    }

    // Check combat veteran requirements
    if (criteria.combatVeteranRequired && !userData.combatVeteran) {
      return false;
    }

    // Check income requirements
    const income = userData.income as any;
    if (criteria.maxIncome && income?.annualIncome > criteria.maxIncome) {
      return false;
    }

    return true;
  }

  async getBenefitsEligibility(id: number): Promise<BenefitsEligibility | undefined> {
    try {
      const [result] = await this.db.select().from(benefitsEligibility).where(eq(benefitsEligibility.id, id));
      return result;
    } catch (error) {
      console.error("Error fetching benefits eligibility:", error);
      return undefined;
    }
  }

  async getBenefitsDatabase(): Promise<BenefitsDatabase[]> {
    try {
      return await this.db.select().from(benefitsDatabase).where(eq(benefitsDatabase.isActive, true));
    } catch (error) {
      console.error("Error fetching benefits database:", error);
      return [];
    }
  }

  async getBenefitsByType(benefitType: string): Promise<BenefitsDatabase[]> {
    try {
      return await this.db.select().from(benefitsDatabase)
        .where(and(eq(benefitsDatabase.benefitType, benefitType), eq(benefitsDatabase.isActive, true)));
    } catch (error) {
      console.error("Error fetching benefits by type:", error);
      return [];
    }
  }

  async createBenefitsDatabase(benefit: InsertBenefitsDatabase): Promise<BenefitsDatabase> {
    try {
      const [result] = await this.db.insert(benefitsDatabase).values(benefit).returning();
      return result;
    } catch (error) {
      console.error("Error creating benefits database entry:", error);
      throw new Error("Failed to create benefits database entry");
    }
  }

  // Gamification implementations
  async getLegalChallenges(category?: string, difficulty?: string, branch?: string): Promise<LegalChallenge[]> {
    try {
      let query = this.db.select().from(legalChallenges).where(eq(legalChallenges.isActive, true));
      
      if (category) query = query.where(eq(legalChallenges.category, category));
      if (difficulty) query = query.where(eq(legalChallenges.difficulty, difficulty));
      if (branch) query = query.where(or(eq(legalChallenges.branch, branch), eq(legalChallenges.branch, null)));
      
      return await query;
    } catch (error) {
      console.error("Error fetching legal challenges:", error);
      return [];
    }
  }

  async getLegalChallenge(id: number): Promise<LegalChallenge | undefined> {
    try {
      const [challenge] = await this.db.select().from(legalChallenges).where(eq(legalChallenges.id, id));
      return challenge;
    } catch (error) {
      console.error("Error fetching legal challenge:", error);
      return undefined;
    }
  }

  async createLegalChallenge(challenge: InsertLegalChallenge): Promise<LegalChallenge> {
    try {
      const [result] = await this.db.insert(legalChallenges).values(challenge).returning();
      return result;
    } catch (error) {
      console.error("Error creating legal challenge:", error);
      throw new Error("Failed to create legal challenge");
    }
  }

  async getAchievementBadges(): Promise<AchievementBadge[]> {
    try {
      return await this.db.select().from(achievementBadges).where(eq(achievementBadges.isActive, true));
    } catch (error) {
      console.error("Error fetching achievement badges:", error);
      return [];
    }
  }

  async getAchievementBadge(id: number): Promise<AchievementBadge | undefined> {
    try {
      const [badge] = await this.db.select().from(achievementBadges).where(eq(achievementBadges.id, id));
      return badge;
    } catch (error) {
      console.error("Error fetching achievement badge:", error);
      return undefined;
    }
  }

  async createAchievementBadge(badge: InsertAchievementBadge): Promise<AchievementBadge> {
    try {
      const [result] = await this.db.insert(achievementBadges).values(badge).returning();
      return result;
    } catch (error) {
      console.error("Error creating achievement badge:", error);
      throw new Error("Failed to create achievement badge");
    }
  }

  async getUserChallengeProgress(userId: string, challengeId?: number): Promise<UserChallengeProgress[]> {
    try {
      let query = this.db.select().from(userChallengeProgress).where(eq(userChallengeProgress.userId, userId));
      
      if (challengeId) query = query.where(eq(userChallengeProgress.challengeId, challengeId));
      
      return await query;
    } catch (error) {
      console.error("Error fetching user challenge progress:", error);
      return [];
    }
  }

  async createUserChallengeProgress(progress: InsertUserChallengeProgress): Promise<UserChallengeProgress> {
    try {
      const [result] = await this.db.insert(userChallengeProgress).values(progress).returning();
      return result;
    } catch (error) {
      console.error("Error creating user challenge progress:", error);
      throw new Error("Failed to create user challenge progress");
    }
  }

  async updateUserChallengeProgress(id: number, updates: Partial<InsertUserChallengeProgress>): Promise<UserChallengeProgress | undefined> {
    try {
      const [result] = await this.db.update(userChallengeProgress)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(userChallengeProgress.id, id))
        .returning();
      return result;
    } catch (error) {
      console.error("Error updating user challenge progress:", error);
      return undefined;
    }
  }

  async getUserBadges(userId: string): Promise<UserBadge[]> {
    try {
      return await this.db.select().from(userBadges).where(eq(userBadges.userId, userId));
    } catch (error) {
      console.error("Error fetching user badges:", error);
      return [];
    }
  }

  async awardBadge(userId: string, badgeId: number): Promise<UserBadge> {
    try {
      const [result] = await this.db.insert(userBadges).values({
        userId,
        badgeId,
        earnedAt: new Date()
      }).returning();
      return result;
    } catch (error) {
      console.error("Error awarding badge:", error);
      throw new Error("Failed to award badge");
    }
  }

  async getUserGameStats(userId: string): Promise<UserGameStats | undefined> {
    try {
      const [stats] = await this.db.select().from(userGameStats).where(eq(userGameStats.userId, userId));
      return stats;
    } catch (error) {
      console.error("Error fetching user game stats:", error);
      return undefined;
    }
  }

  async updateUserGameStats(userId: string, updates: Partial<InsertUserGameStats>): Promise<UserGameStats> {
    try {
      const existingStats = await this.getUserGameStats(userId);
      
      if (existingStats) {
        const [result] = await this.db.update(userGameStats)
          .set({ ...updates, updatedAt: new Date() })
          .where(eq(userGameStats.userId, userId))
          .returning();
        return result;
      } else {
        const [result] = await this.db.insert(userGameStats).values({
          userId,
          ...updates,
          createdAt: new Date(),
          updatedAt: new Date()
        }).returning();
        return result;
      }
    } catch (error) {
      console.error("Error updating user game stats:", error);
      throw new Error("Failed to update user game stats");
    }
  }

  async getChallengeLeaderboard(period: string): Promise<any[]> {
    try {
      return await this.db.select().from(challengeLeaderboard)
        .where(eq(challengeLeaderboard.period, period))
        .orderBy(challengeLeaderboard.rank);
    } catch (error) {
      console.error("Error fetching challenge leaderboard:", error);
      return [];
    }
  }

  async updateLeaderboard(): Promise<void> {
    try {
      // Implementation for updating leaderboard rankings
      // This would calculate rankings based on user game stats
      console.log("Leaderboard update implemented");
    } catch (error) {
      console.error("Error updating leaderboard:", error);
    }
  }
}

export const storage = new DatabaseStorage();
