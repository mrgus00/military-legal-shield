import { pgTable, text, varchar, serial, integer, boolean, timestamp, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Authentication users table for Replit Auth (separate from main users)
export const authUsers = pgTable("auth_users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  branch: text("branch"),
  rank: text("rank"),
  subscriptionTier: text("subscription_tier").notNull().default("free"), // free, premium
  subscriptionStatus: text("subscription_status").default("active"), // active, cancelled, expired
  subscriptionStartDate: timestamp("subscription_start_date"),
  subscriptionEndDate: timestamp("subscription_end_date"),
  stripeCustomerId: varchar("stripe_customer_id"),
  stripeSubscriptionId: varchar("stripe_subscription_id"),
  emergencyCredits: integer("emergency_credits").default(0), // For emergency response usage
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Google OAuth users table
export const googleUsers = pgTable("google_users", {
  id: serial("id").primaryKey(),
  googleId: varchar("google_id").unique().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  displayName: varchar("display_name"),
  profileImageUrl: varchar("profile_image_url"),
  branch: text("branch"),
  rank: text("rank"),
  subscriptionTier: text("subscription_tier").notNull().default("free"),
  subscriptionStatus: text("subscription_status").default("active"),
  subscriptionStartDate: timestamp("subscription_start_date"),
  subscriptionEndDate: timestamp("subscription_end_date"),
  stripeCustomerId: varchar("stripe_customer_id"),
  stripeSubscriptionId: varchar("stripe_subscription_id"),
  emergencyCredits: integer("emergency_credits").default(0),
  isActive: boolean("is_active").default(true),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Main users table (existing structure preserved)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  branch: text("branch").notNull(),
  rank: text("rank"),
  isActive: boolean("is_active").default(true),
  email: text("email").notNull(),
  subscriptionTier: text("subscription_tier").notNull().default("free"),
  subscriptionStatus: text("subscription_status").default("active"),
  subscriptionStartDate: timestamp("subscription_start_date"),
  subscriptionEndDate: timestamp("subscription_end_date"),
  emergencyCredits: integer("emergency_credits").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  stripeCustomerId: varchar("stripe_customer_id"),
  stripeSubscriptionId: varchar("stripe_subscription_id"),
  profileImageUrl: varchar("profile_image_url"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const attorneys = pgTable("attorneys", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  firmName: text("firm_name"),
  title: text("title").notNull(),
  specialties: text("specialties").array().notNull(),
  location: text("location").notNull(),
  state: text("state").notNull(),
  city: text("city").notNull(),
  region: text("region"), // Atlantic, Pacific, Nationwide
  attorneyType: text("attorney_type").notNull(), // civilian, dso, jag
  experience: text("experience").notNull(),
  rating: integer("rating").notNull(),
  reviewCount: integer("review_count").notNull(),
  email: text("email"),
  phone: text("phone"),
  website: text("website"),
  address: text("address"),
  bio: text("bio"),
  pricingTier: text("pricing_tier").notNull(), // affordable, standard, premium
  hourlyRate: text("hourly_rate"),
  availableForEmergency: boolean("available_for_emergency").default(false),
  responseTime: text("response_time"), // "< 2 hours", "< 24 hours", etc.
  servicesOffered: text("services_offered").array(),
  militaryBranches: text("military_branches").array(), // Army, Navy, Air Force, Marines, Coast Guard, Space Force
  practiceAreas: text("practice_areas").array(),
  languages: text("languages").array().default(Array<string>()),
  isVerified: boolean("is_verified").default(true),
  verificationDate: timestamp("verification_date"),
  licenseNumber: text("license_number"),
  barNumber: text("bar_number"),
  verificationStatus: text("verification_status").default("verified"), // pending, verified, rejected, expired
  verificationNotes: text("verification_notes"),
  credentialsUploaded: boolean("credentials_uploaded").default(true),
  lastVerificationCheck: timestamp("last_verification_check"),
  establishedYear: integer("established_year"),
  notableAchievements: text("notable_achievements").array(),
  caseSuccessRate: integer("case_success_rate"), // percentage
  totalCasesHandled: integer("total_cases_handled"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const legalResources = pgTable("legal_resources", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  tags: text("tags").array().notNull(),
  readTime: text("read_time").notNull(),
  isPremium: boolean("is_premium").default(false),
  isActive: boolean("is_active").default(true),
});

export const educationModules = pgTable("education_modules", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  duration: text("duration").notNull(),
  level: text("level").notNull(),
  studentCount: integer("student_count").notNull(),
  isPremium: boolean("is_premium").default(false),
  hasVideo: boolean("has_video").default(false),
  hasCertificate: boolean("has_certificate").default(false),
  isActive: boolean("is_active").default(true),
});

export const consultations = pgTable("consultations", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  branch: text("branch").notNull(),
  issueType: text("issue_type").notNull(),
  description: text("description").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  status: text("status").default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

// One-click emergency legal consultation booking system
export const emergencyConsultations = pgTable("emergency_consultations", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id"), // Can be null for guest bookings
  fullName: text("full_name").notNull(),
  rank: text("rank"),
  branch: text("branch").notNull(), // Army, Navy, Air Force, Marines, Coast Guard, Space Force
  unit: text("unit"),
  location: text("location").notNull(), // Base/state for attorney matching
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  legalIssueType: text("legal_issue_type").notNull(), // court-martial, administrative, security-clearance, etc.
  urgencyLevel: text("urgency_level").notNull(), // immediate, urgent, priority
  issueDescription: text("issue_description").notNull(),
  timeConstraints: text("time_constraints"), // court date, deadline, etc.
  contactMethod: text("contact_method").notNull(), // phone, video, in-person
  preferredTime: text("preferred_time"), // ASAP, specific time slot
  priorAttorney: boolean("prior_attorney").default(false),
  status: text("status").default("pending"), // pending, matched, in-progress, completed, cancelled
  assignedAttorneyId: integer("assigned_attorney_id").references(() => attorneys.id),
  matchedAt: timestamp("matched_at"),
  consultationDate: timestamp("consultation_date"),
  consultationDuration: integer("consultation_duration"), // in minutes
  consultationNotes: text("consultation_notes"),
  followUpRequired: boolean("follow_up_required").default(false),
  followUpDate: timestamp("follow_up_date"),
  satisfactionRating: integer("satisfaction_rating"), // 1-5
  feedback: text("feedback"),
  isEmergency: boolean("is_emergency").default(true),
  priorityScore: integer("priority_score").default(100), // For triage ranking
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Legal Cases for tracking
export const legalCases = pgTable("legal_cases", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  attorneyId: integer("attorney_id").references(() => attorneys.id),
  caseNumber: text("case_number").notNull(),
  title: text("title").notNull(),
  caseType: text("case_type").notNull(),
  status: text("status").notNull(), // pending, active, resolved, appealed
  priority: text("priority").notNull(), // urgent, high, normal, low
  description: text("description").notNull(),
  nextHearing: timestamp("next_hearing"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Emergency Legal Resources
export const emergencyResources = pgTable("emergency_resources", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  contactNumber: text("contact_number").notNull(),
  availability: text("availability").notNull(), // 24/7, business hours, etc.
  category: text("category").notNull(), // legal aid, crisis hotline, etc.
  branch: text("branch"), // specific to branch or null for all
  isActive: boolean("is_active").default(true),
});

// Anonymous Q&A Forum
export const forumQuestions = pgTable("forum_questions", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  branch: text("branch"),
  userId: integer("user_id").references(() => users.id),
  isAnswered: boolean("is_answered").default(false),
  isUrgent: boolean("is_urgent").default(false),
  upvotes: integer("upvotes").default(0),
  tags: text("tags").array(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const forumAnswers = pgTable("forum_answers", {
  id: serial("id").primaryKey(),
  questionId: integer("question_id").references(() => forumQuestions.id),
  userId: integer("user_id").references(() => users.id),
  content: text("content").notNull(),
  isVerified: boolean("is_verified").default(false), // verified by legal professional
  isExpert: boolean("is_expert").default(false), // answered by verified legal expert
  upvotes: integer("upvotes").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Legal Documents (POA, Wills, etc.)
export const legalDocuments = pgTable("legal_documents", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  documentType: text("document_type").notNull(), // POA, will, etc.
  title: text("title").notNull(),
  status: text("status").notNull(), // draft, completed, notarized
  content: text("content"), // document content/form data
  attorneyId: integer("attorney_id").references(() => attorneys.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Subscription Plans
export const subscriptionPlans = pgTable("subscription_plans", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  tier: text("tier").notNull(), // free, premium
  monthlyPrice: integer("monthly_price").notNull(), // in cents
  yearlyPrice: integer("yearly_price").notNull(), // in cents
  features: text("features").array().notNull(),
  isActive: boolean("is_active").default(true),
});

// User Subscriptions
export const userSubscriptions = pgTable("user_subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  planId: integer("plan_id").references(() => subscriptionPlans.id),
  status: text("status").notNull(), // active, cancelled, expired, past_due
  currentPeriodStart: timestamp("current_period_start"),
  currentPeriodEnd: timestamp("current_period_end"),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false),
  stripeSubscriptionId: text("stripe_subscription_id"),
  stripeCustomerId: text("stripe_customer_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Emergency Consultation Bookings - Enhanced for one-click system
export const emergencyBookings = pgTable("emergency_bookings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  attorneyId: integer("attorney_id").references(() => attorneys.id),
  bookingReference: text("booking_reference").notNull().unique(), // Quick reference for tracking
  urgencyLevel: text("urgency_level").notNull(), // critical, urgent, high, routine
  issueType: text("issue_type").notNull(), // court-martial, security-clearance, administrative, etc.
  briefDescription: text("brief_description").notNull(),
  preferredContactMethod: text("preferred_contact_method").notNull(), // phone, video, in-person
  contactInfo: jsonb("contact_info").notNull(), // phone, email, location preference
  status: text("status").notNull().default("pending"), // pending, confirmed, in-progress, completed, cancelled
  scheduledDateTime: timestamp("scheduled_date_time"),
  estimatedDuration: integer("estimated_duration").default(30), // minutes
  attorneyResponseTime: timestamp("attorney_response_time"),
  connectionTime: timestamp("connection_time"),
  completionTime: timestamp("completion_time"),
  cost: integer("cost").default(0), // in cents
  isEmergencyCredit: boolean("is_emergency_credit").default(false),
  meetingLink: text("meeting_link"), // For video consultations
  meetingPassword: text("meeting_password"),
  notes: text("notes"), // Attorney notes
  followUpRequired: boolean("follow_up_required").default(false),
  satisfaction: integer("satisfaction"), // 1-5 rating
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Attorney Availability for real-time booking
export const attorneyAvailability = pgTable("attorney_availability", {
  id: serial("id").primaryKey(),
  attorneyId: integer("attorney_id").references(() => attorneys.id),
  dayOfWeek: integer("day_of_week").notNull(), // 0-6 (Sunday-Saturday)
  startTime: text("start_time").notNull(), // "09:00"
  endTime: text("end_time").notNull(), // "17:00"
  timezone: text("timezone").notNull().default("America/New_York"),
  isEmergencyAvailable: boolean("is_emergency_available").default(false),
  emergencyResponseTime: integer("emergency_response_time").default(15), // minutes
  maxDailyEmergencyBookings: integer("max_daily_emergency_bookings").default(3),
  currentEmergencyBookings: integer("current_emergency_bookings").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Emergency Service Usage
export const emergencyServices = pgTable("emergency_services", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  attorneyId: integer("attorney_id").references(() => attorneys.id),
  serviceType: text("service_type").notNull(), // emergency_consultation, immediate_connection
  status: text("status").notNull(), // requested, connected, completed
  cost: integer("cost").notNull(), // in cents
  paymentStatus: text("payment_status").notNull(), // pending, paid, failed
  requestedAt: timestamp("requested_at").defaultNow(),
  connectedAt: timestamp("connected_at"),
  completedAt: timestamp("completed_at"),
});

// Feature Usage Tracking
export const featureUsage = pgTable("feature_usage", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  feature: text("feature").notNull(), // attorney_search, case_tracking, documents, forum_post
  usageCount: integer("usage_count").default(1),
  lastUsed: timestamp("last_used").defaultNow(),
  monthYear: text("month_year").notNull(), // "2024-12" for tracking monthly limits
});

// Conversations between users and attorneys
export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  attorneyId: integer("attorney_id").references(() => attorneys.id),
  caseId: integer("case_id").references(() => legalCases.id),
  subject: text("subject").notNull(),
  status: text("status").notNull().default("active"), // active, archived, closed
  lastMessageAt: timestamp("last_message_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Messages within conversations
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").references(() => conversations.id),
  senderId: integer("sender_id").notNull(), // can be user or attorney
  senderType: text("sender_type").notNull(), // "user" or "attorney"
  content: text("content").notNull(),
  messageType: text("message_type").notNull().default("text"), // text, file, image
  isRead: boolean("is_read").default(false),
  isEncrypted: boolean("is_encrypted").default(true),
  readAt: timestamp("read_at"),
  sentAt: timestamp("sent_at").defaultNow(),
});

// Message attachments
export const messageAttachments = pgTable("message_attachments", {
  id: serial("id").primaryKey(),
  messageId: integer("message_id").references(() => messages.id),
  fileName: text("file_name").notNull(),
  fileSize: integer("file_size"),
  fileType: text("file_type"),
  filePath: text("file_path").notNull(),
  isEncrypted: boolean("is_encrypted").default(true),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
});

// Attorney verification documents
export const attorneyVerificationDocs = pgTable("attorney_verification_docs", {
  id: serial("id").primaryKey(),
  attorneyId: integer("attorney_id").references(() => attorneys.id),
  documentType: text("document_type").notNull(), // license, bar_certificate, education, malpractice_insurance
  fileName: text("file_name").notNull(),
  filePath: text("file_path").notNull(),
  verificationStatus: text("verification_status").default("pending"), // pending, approved, rejected
  uploadedAt: timestamp("uploaded_at").defaultNow(),
  verifiedAt: timestamp("verified_at"),
  verifiedBy: text("verified_by"), // admin user who verified
  rejectionReason: text("rejection_reason"),
});

// Attorney reviews and ratings
export const attorneyReviews = pgTable("attorney_reviews", {
  id: serial("id").primaryKey(),
  attorneyId: integer("attorney_id").references(() => attorneys.id),
  userId: integer("user_id").references(() => users.id),
  caseId: integer("case_id").references(() => legalCases.id),
  rating: integer("rating").notNull(), // 1-5 stars
  reviewTitle: text("review_title"),
  reviewText: text("review_text"),
  communicationRating: integer("communication_rating"), // 1-5
  expertiseRating: integer("expertise_rating"), // 1-5
  responsivenessRating: integer("responsiveness_rating"), // 1-5
  valueRating: integer("value_rating"), // 1-5
  isVerifiedClient: boolean("is_verified_client").default(false),
  isAnonymous: boolean("is_anonymous").default(false),
  status: text("status").default("pending"), // pending, approved, flagged, rejected
  helpfulVotes: integer("helpful_votes").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Attorney verification requests
export const attorneyVerificationRequests = pgTable("attorney_verification_requests", {
  id: serial("id").primaryKey(),
  attorneyId: integer("attorney_id").references(() => attorneys.id),
  requestType: text("request_type").notNull(), // initial, renewal, update
  status: text("status").default("pending"), // pending, in_review, approved, rejected
  submittedAt: timestamp("submitted_at").defaultNow(),
  reviewedAt: timestamp("reviewed_at"),
  reviewedBy: text("reviewed_by"),
  notes: text("notes"),
  requiredDocuments: text("required_documents").array(),
  completedDocuments: text("completed_documents").array(),
});

// Legal scenario simulations
export const legalScenarios = pgTable("legal_scenarios", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // court-martial, administrative, clearance, etc.
  difficulty: text("difficulty").notNull(), // beginner, intermediate, advanced
  branch: text("branch"), // Army, Navy, Air Force, Marines, Coast Guard, Space Force, All
  scenario: text("scenario").notNull(), // AI-generated scenario text
  learningObjectives: text("learning_objectives").array(),
  tags: text("tags").array(),
  estimatedTime: integer("estimated_time"), // in minutes
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Scenario sessions (user progress tracking)
export const scenarioSessions = pgTable("scenario_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  scenarioId: integer("scenario_id").references(() => legalScenarios.id),
  status: text("status").default("in_progress"), // in_progress, completed, abandoned
  currentStep: integer("current_step").default(1),
  totalSteps: integer("total_steps"),
  score: integer("score"), // 0-100
  decisions: text("decisions").array(), // JSON array of user decisions
  aiResponses: text("ai_responses").array(), // AI-generated responses to decisions
  feedback: text("feedback"), // Final AI feedback
  timeSpent: integer("time_spent"), // in minutes
  startedAt: timestamp("started_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

// Scenario analytics
export const scenarioAnalytics = pgTable("scenario_analytics", {
  id: serial("id").primaryKey(),
  scenarioId: integer("scenario_id").references(() => legalScenarios.id),
  userId: integer("user_id").references(() => users.id),
  completionRate: integer("completion_rate"), // percentage
  averageScore: integer("average_score"),
  commonMistakes: text("common_mistakes").array(),
  improvementAreas: text("improvement_areas").array(),
  generatedAt: timestamp("generated_at").defaultNow(),
});



// Benefits eligibility calculations
export const benefitsEligibility = pgTable("benefits_eligibility", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id"), // Optional - can be used for guests
  serviceStatus: text("service_status").notNull(), // active, veteran, retired, discharged
  branch: text("branch").notNull(), // Army, Navy, Air Force, Marines, Coast Guard, Space Force
  serviceDates: jsonb("service_dates").notNull(), // { startDate, endDate, totalYears, totalMonths }
  deployments: jsonb("deployments"), // Array of deployment records
  dischargeType: text("discharge_type"), // honorable, general, other_than_honorable, dishonorable
  disabilityRating: integer("disability_rating"), // VA disability percentage 0-100
  combatVeteran: boolean("combat_veteran").default(false),
  prisonerOfWar: boolean("prisoner_of_war").default(false),
  purpleHeart: boolean("purple_heart").default(false),
  medals: text("medals").array(), // Array of medals/decorations
  dependents: jsonb("dependents"), // Spouse and children information
  income: jsonb("income"), // Household income information
  location: jsonb("location"), // State, ZIP for location-based benefits
  eligibleBenefits: jsonb("eligible_benefits"), // Calculated benefits array
  calculatedAt: timestamp("calculated_at").defaultNow(),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

// Benefits database
export const benefitsDatabase = pgTable("benefits_database", {
  id: serial("id").primaryKey(),
  benefitType: text("benefit_type").notNull(), // healthcare, education, disability, housing, etc.
  benefitName: text("benefit_name").notNull(),
  description: text("description").notNull(),
  eligibilityCriteria: jsonb("eligibility_criteria").notNull(),
  applicationProcess: text("application_process"),
  requiredDocuments: text("required_documents").array(),
  processingTime: text("processing_time"),
  benefitAmount: text("benefit_amount"),
  renewalRequired: boolean("renewal_required").default(false),
  websiteUrl: text("website_url"),
  phoneNumber: text("phone_number"),
  isActive: boolean("is_active").default(true),
  lastUpdated: timestamp("last_updated").defaultNow(),
});



// Learning paths for gamified education
export const learningPaths = pgTable("learning_paths", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // beginner, intermediate, advanced
  totalModules: integer("total_modules").notNull(),
  estimatedHours: integer("estimated_hours").notNull(),
  difficulty: text("difficulty").notNull(), // easy, medium, hard
  prerequisites: text("prerequisites").array(),
  badge: text("badge"), // badge earned upon completion
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// User progress through learning paths
export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  pathId: integer("path_id").references(() => learningPaths.id),
  currentModule: integer("current_module").default(1),
  completedModules: integer("completed_modules").array(),
  totalScore: integer("total_score").default(0),
  timeSpent: integer("time_spent").default(0), // in minutes
  lastAccessed: timestamp("last_accessed").defaultNow(),
  completedAt: timestamp("completed_at"),
  certificateEarned: boolean("certificate_earned").default(false),
});

// Achievement system
export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(), // icon name or emoji
  category: text("category").notNull(), // learning, community, expertise
  points: integer("points").notNull(),
  requirement: text("requirement").notNull(), // what triggers this achievement
  badgeColor: text("badge_color").default("blue"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// User achievements earned
export const userAchievements = pgTable("user_achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  achievementId: integer("achievement_id").references(() => achievements.id),
  earnedAt: timestamp("earned_at").defaultNow(),
  progress: integer("progress").default(0), // for progressive achievements
});

// Learning streaks and statistics
export const learningStats = pgTable("learning_stats", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  currentStreak: integer("current_streak").default(0),
  longestStreak: integer("longest_streak").default(0),
  totalPoints: integer("total_points").default(0),
  totalHoursLearned: integer("total_hours_learned").default(0),
  level: integer("level").default(1),
  experiencePoints: integer("experience_points").default(0),
  lastActivityDate: timestamp("last_activity_date").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Micro-challenges for knowledge retention
export const microChallenges = pgTable("micro_challenges", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // quiz, scenario, case-study, true-false
  difficulty: text("difficulty").notNull(), // easy, medium, hard
  topic: text("topic").notNull(), // ucmj, clearance, administrative, etc
  questionType: text("question_type").notNull(), // multiple-choice, true-false, scenario-based
  question: text("question").notNull(),
  options: text("options").array(), // for multiple choice questions
  correctAnswer: text("correct_answer").notNull(),
  explanation: text("explanation").notNull(),
  points: integer("points").default(10),
  timeLimit: integer("time_limit").default(60), // seconds
  tags: text("tags").array(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// User challenge attempts and results
export const challengeAttempts = pgTable("challenge_attempts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  challengeId: integer("challenge_id").references(() => microChallenges.id),
  userAnswer: text("user_answer").notNull(),
  isCorrect: boolean("is_correct").notNull(),
  timeSpent: integer("time_spent"), // seconds taken to answer
  pointsEarned: integer("points_earned").default(0),
  hintsUsed: integer("hints_used").default(0),
  attemptedAt: timestamp("attempted_at").defaultNow(),
});

// Daily challenge system
export const dailyChallenges = pgTable("daily_challenges", {
  id: serial("id").primaryKey(),
  challengeDate: timestamp("challenge_date").notNull(),
  challengeId: integer("challenge_id").references(() => microChallenges.id),
  category: text("category").notNull(),
  difficulty: text("difficulty").notNull(),
  bonusPoints: integer("bonus_points").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Challenge streaks and completion tracking
export const challengeStats = pgTable("challenge_stats", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  totalChallengesCompleted: integer("total_challenges_completed").default(0),
  correctAnswers: integer("correct_answers").default(0),
  currentStreak: integer("current_streak").default(0),
  longestStreak: integer("longest_streak").default(0),
  averageScore: integer("average_score").default(0),
  fastestTime: integer("fastest_time"), // fastest completion time in seconds
  totalTimeSpent: integer("total_time_spent").default(0),
  lastChallengeDate: timestamp("last_challenge_date"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  isActive: true,
});

export const insertAttorneySchema = createInsertSchema(attorneys).omit({
  id: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
});



export const insertLegalResourceSchema = createInsertSchema(legalResources).omit({
  id: true,
  isActive: true,
});

export const insertEducationModuleSchema = createInsertSchema(educationModules).omit({
  id: true,
  isActive: true,
});

export const insertConsultationSchema = createInsertSchema(consultations).omit({
  id: true,
  status: true,
  createdAt: true,
});



// Type exports for emergency consultations (moved to end of file to avoid duplicates)

export const insertLegalCaseSchema = createInsertSchema(legalCases).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertEmergencyResourceSchema = createInsertSchema(emergencyResources).omit({
  id: true,
  isActive: true,
});

export const insertForumQuestionSchema = createInsertSchema(forumQuestions).omit({
  id: true,
  isAnswered: true,
  upvotes: true,
  createdAt: true,
});

export const insertForumAnswerSchema = createInsertSchema(forumAnswers).omit({
  id: true,
  isVerified: true,
  upvotes: true,
  createdAt: true,
});

export const insertLegalDocumentSchema = createInsertSchema(legalDocuments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSubscriptionPlanSchema = createInsertSchema(subscriptionPlans).omit({
  id: true,
  isActive: true,
});

export const insertBenefitsEligibilitySchema = createInsertSchema(benefitsEligibility).omit({
  id: true,
  calculatedAt: true,
  lastUpdated: true,
});

export const insertBenefitsDatabaseSchema = createInsertSchema(benefitsDatabase).omit({
  id: true,
  isActive: true,
  lastUpdated: true,
});

export const insertUserSubscriptionSchema = createInsertSchema(userSubscriptions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertEmergencyServiceSchema = createInsertSchema(emergencyServices).omit({
  id: true,
  requestedAt: true,
});

export const insertFeatureUsageSchema = createInsertSchema(featureUsage).omit({
  id: true,
  lastUsed: true,
});

export const insertConversationSchema = createInsertSchema(conversations).omit({
  id: true,
  lastMessageAt: true,
  createdAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  sentAt: true,
});

export const insertMessageAttachmentSchema = createInsertSchema(messageAttachments).omit({
  id: true,
  uploadedAt: true,
});

export const insertAttorneyVerificationDocSchema = createInsertSchema(attorneyVerificationDocs).omit({
  id: true,
  uploadedAt: true,
  verifiedAt: true,
});

export const insertAttorneyReviewSchema = createInsertSchema(attorneyReviews).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  helpfulVotes: true,
});

export const insertAttorneyVerificationRequestSchema = createInsertSchema(attorneyVerificationRequests).omit({
  id: true,
  submittedAt: true,
  reviewedAt: true,
});

export const insertLegalScenarioSchema = createInsertSchema(legalScenarios).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertScenarioSessionSchema = createInsertSchema(scenarioSessions).omit({
  id: true,
  startedAt: true,
});

export const insertScenarioAnalyticsSchema = createInsertSchema(scenarioAnalytics).omit({
  id: true,
  generatedAt: true,
});

export const insertLearningPathSchema = createInsertSchema(learningPaths).omit({
  id: true,
  isActive: true,
  createdAt: true,
});

export const insertUserProgressSchema = createInsertSchema(userProgress).omit({
  id: true,
  lastAccessed: true,
});

export const insertAchievementSchema = createInsertSchema(achievements).omit({
  id: true,
  isActive: true,
  createdAt: true,
});

export const insertUserAchievementSchema = createInsertSchema(userAchievements).omit({
  id: true,
  earnedAt: true,
});

export const insertLearningStatsSchema = createInsertSchema(learningStats).omit({
  id: true,
  lastActivityDate: true,
  updatedAt: true,
});

export const insertMicroChallengeSchema = createInsertSchema(microChallenges).omit({
  id: true,
  isActive: true,
  createdAt: true,
});

export const insertChallengeAttemptSchema = createInsertSchema(challengeAttempts).omit({
  id: true,
  attemptedAt: true,
});

export const insertDailyChallengeSchema = createInsertSchema(dailyChallenges).omit({
  id: true,
  isActive: true,
  createdAt: true,
});

export const insertChallengeStatsSchema = createInsertSchema(challengeStats).omit({
  id: true,
  updatedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;

export type InsertAttorney = z.infer<typeof insertAttorneySchema>;
export type Attorney = typeof attorneys.$inferSelect;

export type InsertLegalResource = z.infer<typeof insertLegalResourceSchema>;
export type LegalResource = typeof legalResources.$inferSelect;

export type InsertEducationModule = z.infer<typeof insertEducationModuleSchema>;
export type EducationModule = typeof educationModules.$inferSelect;

export type InsertConsultation = z.infer<typeof insertConsultationSchema>;
export type Consultation = typeof consultations.$inferSelect;



export type InsertBenefitsEligibility = z.infer<typeof insertBenefitsEligibilitySchema>;
export type BenefitsEligibility = typeof benefitsEligibility.$inferSelect;

export type InsertBenefitsDatabase = z.infer<typeof insertBenefitsDatabaseSchema>;
export type BenefitsDatabase = typeof benefitsDatabase.$inferSelect;

export type InsertLegalCase = z.infer<typeof insertLegalCaseSchema>;
export type LegalCase = typeof legalCases.$inferSelect;

export type InsertEmergencyResource = z.infer<typeof insertEmergencyResourceSchema>;
export type EmergencyResource = typeof emergencyResources.$inferSelect;

export type InsertForumQuestion = z.infer<typeof insertForumQuestionSchema>;
export type ForumQuestion = typeof forumQuestions.$inferSelect;

export type InsertForumAnswer = z.infer<typeof insertForumAnswerSchema>;
export type ForumAnswer = typeof forumAnswers.$inferSelect;

export type InsertLegalDocument = z.infer<typeof insertLegalDocumentSchema>;
export type LegalDocument = typeof legalDocuments.$inferSelect;

export type InsertSubscriptionPlan = z.infer<typeof insertSubscriptionPlanSchema>;
export type SubscriptionPlan = typeof subscriptionPlans.$inferSelect;

export type InsertUserSubscription = z.infer<typeof insertUserSubscriptionSchema>;
export type UserSubscription = typeof userSubscriptions.$inferSelect;

export type InsertEmergencyService = z.infer<typeof insertEmergencyServiceSchema>;
export type EmergencyService = typeof emergencyServices.$inferSelect;

export type InsertFeatureUsage = z.infer<typeof insertFeatureUsageSchema>;
export type FeatureUsage = typeof featureUsage.$inferSelect;

export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type Conversation = typeof conversations.$inferSelect;

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

export type InsertMessageAttachment = z.infer<typeof insertMessageAttachmentSchema>;
export type MessageAttachment = typeof messageAttachments.$inferSelect;

export type InsertAttorneyVerificationDoc = z.infer<typeof insertAttorneyVerificationDocSchema>;
export type AttorneyVerificationDoc = typeof attorneyVerificationDocs.$inferSelect;

export type InsertAttorneyReview = z.infer<typeof insertAttorneyReviewSchema>;
export type AttorneyReview = typeof attorneyReviews.$inferSelect;

export type InsertAttorneyVerificationRequest = z.infer<typeof insertAttorneyVerificationRequestSchema>;
export type AttorneyVerificationRequest = typeof attorneyVerificationRequests.$inferSelect;

export type InsertLegalScenario = z.infer<typeof insertLegalScenarioSchema>;
export type LegalScenario = typeof legalScenarios.$inferSelect;

export type InsertScenarioSession = z.infer<typeof insertScenarioSessionSchema>;
export type ScenarioSession = typeof scenarioSessions.$inferSelect;

export type InsertScenarioAnalytics = z.infer<typeof insertScenarioAnalyticsSchema>;
export type ScenarioAnalytics = typeof scenarioAnalytics.$inferSelect;

export type InsertLearningPath = z.infer<typeof insertLearningPathSchema>;
export type LearningPath = typeof learningPaths.$inferSelect;

export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type UserProgress = typeof userProgress.$inferSelect;

export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
export type Achievement = typeof achievements.$inferSelect;

export type InsertUserAchievement = z.infer<typeof insertUserAchievementSchema>;
export type UserAchievement = typeof userAchievements.$inferSelect;

export type InsertLearningStats = z.infer<typeof insertLearningStatsSchema>;
export type LearningStats = typeof learningStats.$inferSelect;

export type InsertMicroChallenge = z.infer<typeof insertMicroChallengeSchema>;
export type MicroChallenge = typeof microChallenges.$inferSelect;

export type InsertChallengeAttempt = z.infer<typeof insertChallengeAttemptSchema>;
export type ChallengeAttempt = typeof challengeAttempts.$inferSelect;

export type InsertDailyChallenge = z.infer<typeof insertDailyChallengeSchema>;
export type DailyChallenge = typeof dailyChallenges.$inferSelect;

export type InsertChallengeStats = z.infer<typeof insertChallengeStatsSchema>;
export type ChallengeStats = typeof challengeStats.$inferSelect;

// Stories table for veterans' storytelling corner
export const stories = pgTable("stories", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  authorName: varchar("author_name", { length: 255 }),
  authorBranch: varchar("author_branch", { length: 100 }),
  authorRank: varchar("author_rank", { length: 100 }),
  content: text("content").notNull(),
  mediaType: varchar("media_type", { length: 20 }).notNull().default("text"), // text, audio, video
  mediaUrl: varchar("media_url", { length: 500 }),
  category: varchar("category", { length: 100 }).notNull(),
  location: varchar("location", { length: 255 }),
  timeframe: varchar("timeframe", { length: 100 }).notNull(),
  likes: integer("likes").notNull().default(0),
  comments: integer("comments").notNull().default(0),
  views: integer("views").notNull().default(0),
  tags: text("tags").array().default([]),
  isAnonymous: boolean("is_anonymous").notNull().default(false),
  isApproved: boolean("is_approved").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertStorySchema = createInsertSchema(stories).omit({
  id: true,
  likes: true,
  comments: true,
  views: true,
  isApproved: true,
  createdAt: true,
  updatedAt: true,
});

// Document templates for legal document wizard
export const documentTemplates = pgTable("document_templates", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  description: text("description").notNull(),
  template: text("template").notNull(), // Template with placeholder variables
  requiredFields: text("required_fields").array().notNull(),
  optionalFields: text("optional_fields").array().default([]),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertDocumentTemplateSchema = createInsertSchema(documentTemplates).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Generated documents
export const generatedDocuments = pgTable("generated_documents", {
  id: serial("id").primaryKey(),
  templateId: integer("template_id").references(() => documentTemplates.id),
  userId: varchar("user_id"),
  documentName: varchar("document_name", { length: 255 }).notNull(),
  documentContent: text("document_content").notNull(),
  formData: text("form_data").notNull(), // JSON string of form inputs
  status: varchar("status", { length: 50 }).notNull().default("draft"), // draft, completed, signed
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertGeneratedDocumentSchema = createInsertSchema(generatedDocuments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertDocumentTemplate = z.infer<typeof insertDocumentTemplateSchema>;
export type DocumentTemplate = typeof documentTemplates.$inferSelect;

export type InsertGeneratedDocument = z.infer<typeof insertGeneratedDocumentSchema>;
export type GeneratedDocument = typeof generatedDocuments.$inferSelect;

export type InsertStory = z.infer<typeof insertStorySchema>;
export type Story = typeof stories.$inferSelect;

// Gamified Legal Preparedness Challenges
export const legalChallenges = pgTable("legal_challenges", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // ucmj, military-law, financial, family, emergency
  difficulty: text("difficulty").notNull(), // beginner, intermediate, advanced
  branch: text("branch"), // specific branch or null for all
  questions: jsonb("questions").notNull(), // array of challenge questions
  timeLimit: integer("time_limit"), // in minutes
  passingScore: integer("passing_score").notNull(), // percentage required to pass
  pointsReward: integer("points_reward").notNull(),
  badgeId: integer("badge_id"), // references achievement_badges.id
  prerequisites: text("prerequisites").array(), // challenge IDs that must be completed first
  tags: text("tags").array(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Achievement Badges
export const achievementBadges = pgTable("achievement_badges", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  iconName: text("icon_name").notNull(), // lucide icon name
  iconColor: text("icon_color").notNull(), // hex color
  badgeType: text("badge_type").notNull(), // challenge, streak, milestone, special
  requirement: jsonb("requirement").notNull(), // conditions to earn the badge
  pointsValue: integer("points_value").notNull(),
  rarity: text("rarity").notNull(), // common, rare, epic, legendary
  category: text("category"), // legal-expert, quick-learner, dedicated, etc.
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// User Challenge Progress
export const userChallengeProgress = pgTable("user_challenge_progress", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  challengeId: integer("challenge_id").references(() => legalChallenges.id),
  status: text("status").default("not_started"), // not_started, in_progress, completed, failed
  score: integer("score").default(0), // percentage score
  attempts: integer("attempts").default(0),
  bestScore: integer("best_score").default(0),
  timeSpent: integer("time_spent").default(0), // in seconds
  answersGiven: jsonb("answers_given"), // user's answers
  completedAt: timestamp("completed_at"),
  startedAt: timestamp("started_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User Earned Badges
export const userBadges = pgTable("user_badges", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  badgeId: integer("badge_id").references(() => achievementBadges.id),
  earnedAt: timestamp("earned_at").defaultNow(),
  progress: integer("progress").default(0), // for badges that require multiple completions
  isDisplayed: boolean("is_displayed").default(true), // whether user displays this badge
});

// User Gamification Stats
export const userGameStats = pgTable("user_game_stats", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  totalPoints: integer("total_points").default(0),
  level: integer("level").default(1),
  experiencePoints: integer("experience_points").default(0),
  challengesCompleted: integer("challenges_completed").default(0),
  badgesEarned: integer("badges_earned").default(0),
  currentStreak: integer("current_streak").default(0), // days
  longestStreak: integer("longest_streak").default(0), // days
  lastActivityDate: timestamp("last_activity_date"),
  weeklyGoal: integer("weekly_goal").default(3), // challenges per week
  weeklyProgress: integer("weekly_progress").default(0),
  monthlyGoal: integer("monthly_goal").default(12), // challenges per month
  monthlyProgress: integer("monthly_progress").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Challenge Leaderboard
export const challengeLeaderboard = pgTable("challenge_leaderboard", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  period: text("period").notNull(), // weekly, monthly, all-time
  rank: integer("rank").notNull(),
  points: integer("points").notNull(),
  challengesCompleted: integer("challenges_completed").notNull(),
  averageScore: integer("average_score").notNull(),
  periodStart: timestamp("period_start").notNull(),
  periodEnd: timestamp("period_end").notNull(),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

// User types for Replit Auth
export type UpsertUser = typeof authUsers.$inferInsert;
export type User = typeof authUsers.$inferSelect;
export type AuthUser = typeof authUsers.$inferSelect;
export type InsertAuthUser = typeof authUsers.$inferInsert;

// Gamification types
export type LegalChallenge = typeof legalChallenges.$inferSelect;
export type InsertLegalChallenge = typeof legalChallenges.$inferInsert;
export type UserChallengeProgress = typeof userChallengeProgress.$inferSelect;
export type InsertUserChallengeProgress = typeof userChallengeProgress.$inferInsert;
export type AchievementBadge = typeof achievementBadges.$inferSelect;
export type InsertAchievementBadge = typeof achievementBadges.$inferInsert;
export type UserBadge = typeof userBadges.$inferSelect;
export type InsertUserBadge = typeof userBadges.$inferInsert;

// Emergency consultation schema and types
export const insertEmergencyConsultationSchema = createInsertSchema(emergencyConsultations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  matchedAt: true,
  consultationDate: true,
  consultationDuration: true,
  consultationNotes: true,
  followUpRequired: true,
  followUpDate: true,
  satisfactionRating: true,
  feedback: true,
  isEmergency: true,
  priorityScore: true,
  assignedAttorneyId: true,
  status: true,
}).extend({
  urgencyLevel: z.enum(["immediate", "urgent", "priority"]),
  legalIssueType: z.enum([
    "court-martial", 
    "administrative", 
    "security-clearance", 
    "meb-peb", 
    "discharge", 
    "finance", 
    "family", 
    "landlord-tenant",
    "criminal",
    "other"
  ]),
  branch: z.enum(["Army", "Navy", "Air Force", "Marines", "Coast Guard", "Space Force"]),
  contactMethod: z.enum(["phone", "video", "in-person"]),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  email: z.string().email(),
  issueDescription: z.string().min(50, "Please provide at least 50 characters describing your legal issue"),
  location: z.string().min(2, "Location is required for attorney matching"),
});

export type EmergencyConsultation = typeof emergencyConsultations.$inferSelect;
export type InsertEmergencyConsultation = z.infer<typeof insertEmergencyConsultationSchema>;

// Emergency Booking Schemas
export const insertEmergencyBookingSchema = createInsertSchema(emergencyBookings, {
  urgencyLevel: z.enum(["critical", "urgent", "high", "routine"]),
  issueType: z.enum([
    "court-martial",
    "security-clearance", 
    "administrative-action",
    "meb-peb",
    "discharge-upgrade",
    "family-law",
    "finance",
    "criminal",
    "other"
  ]),
  briefDescription: z.string().min(20, "Please provide at least 20 characters describing the issue"),
  preferredContactMethod: z.enum(["phone", "video", "in-person"]),
  contactInfo: z.object({
    phone: z.string().min(10, "Phone number required"),
    email: z.string().email("Valid email required"),
    location: z.string().optional(),
    preferredTime: z.string().optional(),
    timezone: z.string().default("America/New_York")
  }),
  estimatedDuration: z.number().min(15).max(240).default(30),
});

export const insertAttorneyAvailabilitySchema = createInsertSchema(attorneyAvailability, {
  dayOfWeek: z.number().min(0).max(6),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
  timezone: z.string().default("America/New_York"),
  emergencyResponseTime: z.number().min(5).max(60).default(15),
  maxDailyEmergencyBookings: z.number().min(1).max(10).default(3),
});

export type EmergencyBooking = typeof emergencyBookings.$inferSelect;
export type InsertEmergencyBooking = z.infer<typeof insertEmergencyBookingSchema>;
export type AttorneyAvailability = typeof attorneyAvailability.$inferSelect;
export type InsertAttorneyAvailability = z.infer<typeof insertAttorneyAvailabilitySchema>;

// Marketing Integration Tables

// Referral tracking system
export const referrals = pgTable("referrals", {
  id: serial("id").primaryKey(),
  referrerUserId: varchar("referrer_user_id").notNull(),
  referredUserId: varchar("referred_user_id"),
  referredEmail: varchar("referred_email").notNull(),
  referralCode: varchar("referral_code").unique().notNull(),
  source: varchar("source").notNull(), // email, social, direct, affiliate
  campaignId: varchar("campaign_id"),
  status: varchar("status").notNull().default("pending"), // pending, completed, failed
  metadata: jsonb("metadata"), // Additional tracking data
  rewardAmount: integer("reward_amount").default(0),
  convertedAt: timestamp("converted_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// SEO metrics tracking
export const seoMetrics = pgTable("seo_metrics", {
  id: serial("id").primaryKey(),
  page: varchar("page").notNull(),
  keywords: text("keywords").array().notNull(),
  impressions: integer("impressions").notNull().default(0),
  clicks: integer("clicks").notNull().default(0),
  avgPosition: integer("avg_position").notNull().default(0),
  ctr: integer("ctr").notNull().default(0), // Click-through rate as percentage
  conversionRate: integer("conversion_rate").notNull().default(0),
  organicTraffic: integer("organic_traffic").notNull().default(0),
  trackedAt: timestamp("tracked_at").defaultNow(),
});

// Social media sharing tracking
export const socialShares = pgTable("social_shares", {
  id: serial("id").primaryKey(),
  platform: varchar("platform").notNull(), // facebook, twitter, linkedin, instagram, tiktok
  contentType: varchar("content_type").notNull(), // attorney-match, emergency-booking, legal-guide, success-story
  contentId: varchar("content_id").notNull(),
  userId: varchar("user_id"),
  shareText: text("share_text").notNull(),
  shareUrl: varchar("share_url").notNull(),
  likes: integer("likes").notNull().default(0),
  shares: integer("shares").notNull().default(0),
  comments: integer("comments").notNull().default(0),
  clickThroughs: integer("click_throughs").notNull().default(0),
  sharedAt: timestamp("shared_at").defaultNow(),
});

// Marketing campaigns management
export const marketingCampaigns = pgTable("marketing_campaigns", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  type: varchar("type").notNull(), // social, email, ppc, content, referral
  status: varchar("status").notNull().default("active"), // active, paused, completed
  budget: integer("budget").notNull().default(0),
  spend: integer("spend").notNull().default(0),
  targetAudience: jsonb("target_audience").notNull(),
  impressions: integer("impressions").notNull().default(0),
  clicks: integer("clicks").notNull().default(0),
  conversions: integer("conversions").notNull().default(0),
  cost: integer("cost").notNull().default(0),
  roi: integer("roi").notNull().default(0), // Return on investment as percentage
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// UTM tracking for campaign attribution
export const utmTracking = pgTable("utm_tracking", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id"),
  sessionId: varchar("session_id").notNull(),
  utmSource: varchar("utm_source"),
  utmMedium: varchar("utm_medium"),
  utmCampaign: varchar("utm_campaign"),
  utmContent: varchar("utm_content"),
  utmTerm: varchar("utm_term"),
  landingPage: varchar("landing_page").notNull(),
  referrer: varchar("referrer"),
  userAgent: text("user_agent"),
  ipAddress: varchar("ip_address"),
  converted: boolean("converted").default(false),
  conversionType: varchar("conversion_type"), // signup, consultation, subscription
  conversionValue: integer("conversion_value").default(0),
  trackedAt: timestamp("tracked_at").defaultNow(),
});

// A/B testing framework
export const abTests = pgTable("ab_tests", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description"),
  status: varchar("status").notNull().default("active"), // active, paused, completed
  variants: jsonb("variants").notNull(), // Array of test variants
  trafficSplit: jsonb("traffic_split").notNull(), // Percentage allocation
  targetPages: text("target_pages").array(),
  conversionGoal: varchar("conversion_goal").notNull(),
  startDate: timestamp("start_date").defaultNow(),
  endDate: timestamp("end_date"),
  results: jsonb("results"), // Test results and statistics
  winningVariant: varchar("winning_variant"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User participation in A/B tests
export const userAbTests = pgTable("user_ab_tests", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id"),
  sessionId: varchar("session_id").notNull(),
  testId: integer("test_id").references(() => abTests.id),
  variant: varchar("variant").notNull(),
  converted: boolean("converted").default(false),
  conversionValue: integer("conversion_value").default(0),
  assignedAt: timestamp("assigned_at").defaultNow(),
  convertedAt: timestamp("converted_at"),
});

// Email marketing campaigns
export const emailCampaigns = pgTable("email_campaigns", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  subject: varchar("subject").notNull(),
  content: text("content").notNull(),
  segmentId: integer("segment_id"),
  status: varchar("status").notNull().default("draft"), // draft, scheduled, sent, paused
  scheduledAt: timestamp("scheduled_at"),
  sentAt: timestamp("sent_at"),
  recipients: integer("recipients").default(0),
  opens: integer("opens").default(0),
  clicks: integer("clicks").default(0),
  unsubscribes: integer("unsubscribes").default(0),
  bounces: integer("bounces").default(0),
  conversions: integer("conversions").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User email engagement tracking
export const emailEngagement = pgTable("email_engagement", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  campaignId: integer("campaign_id").references(() => emailCampaigns.id),
  emailAddress: varchar("email_address").notNull(),
  status: varchar("status").notNull(), // sent, opened, clicked, bounced, unsubscribed
  actionTaken: varchar("action_taken"), // link_clicked, button_clicked, reply, forward
  actionData: jsonb("action_data"), // Additional context about the action
  trackedAt: timestamp("tracked_at").defaultNow(),
});

// Create insert schemas for marketing tables
export const insertReferralSchema = createInsertSchema(referrals).omit({
  id: true,
  convertedAt: true,
  rewardAmount: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSeoMetricsSchema = createInsertSchema(seoMetrics).omit({
  id: true,
  trackedAt: true,
});

export const insertSocialShareSchema = createInsertSchema(socialShares).omit({
  id: true,
  sharedAt: true,
});

export const insertMarketingCampaignSchema = createInsertSchema(marketingCampaigns).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUtmTrackingSchema = createInsertSchema(utmTracking).omit({
  id: true,
  trackedAt: true,
});

export const insertAbTestSchema = createInsertSchema(abTests).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertEmailCampaignSchema = createInsertSchema(emailCampaigns).omit({
  id: true,
  sentAt: true,
  createdAt: true,
  updatedAt: true,
});

// Marketing integration types
export type Referral = typeof referrals.$inferSelect;
export type InsertReferral = z.infer<typeof insertReferralSchema>;

export type SeoMetric = typeof seoMetrics.$inferSelect;
export type InsertSeoMetric = z.infer<typeof insertSeoMetricsSchema>;

export type SocialShare = typeof socialShares.$inferSelect;
export type InsertSocialShare = z.infer<typeof insertSocialShareSchema>;

export type MarketingCampaign = typeof marketingCampaigns.$inferSelect;
export type InsertMarketingCampaign = z.infer<typeof insertMarketingCampaignSchema>;

export type UtmTracking = typeof utmTracking.$inferSelect;
export type InsertUtmTracking = z.infer<typeof insertUtmTrackingSchema>;

export type AbTest = typeof abTests.$inferSelect;
export type InsertAbTest = z.infer<typeof insertAbTestSchema>;

export type EmailCampaign = typeof emailCampaigns.$inferSelect;
export type InsertEmailCampaign = z.infer<typeof insertEmailCampaignSchema>;




