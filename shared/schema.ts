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

// User storage table for Replit Auth
export const users = pgTable("users", {
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
  emergencyCredits: integer("emergency_credits").default(0), // For emergency response usage
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const attorneys = pgTable("attorneys", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  title: text("title").notNull(),
  specialties: text("specialties").array().notNull(),
  location: text("location").notNull(),
  state: text("state").notNull(),
  city: text("city").notNull(),
  experience: text("experience").notNull(),
  rating: integer("rating").notNull(),
  reviewCount: integer("review_count").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  bio: text("bio"),
  pricingTier: text("pricing_tier").notNull(), // affordable, standard, premium
  hourlyRate: text("hourly_rate"),
  availableForEmergency: boolean("available_for_emergency").default(false),
  responseTime: text("response_time"), // "< 2 hours", "< 24 hours", etc.
  isVerified: boolean("is_verified").default(false),
  verificationDate: timestamp("verification_date"),
  licenseNumber: text("license_number"),
  barNumber: text("bar_number"),
  verificationStatus: text("verification_status").default("pending"), // pending, verified, rejected, expired
  verificationNotes: text("verification_notes"),
  credentialsUploaded: boolean("credentials_uploaded").default(false),
  lastVerificationCheck: timestamp("last_verification_check"),
  isActive: boolean("is_active").default(true),
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

// User types for Replit Auth
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
