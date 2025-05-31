import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  branch: text("branch").notNull(),
  rank: text("rank"),
  email: text("email").notNull().unique(),
  subscriptionTier: text("subscription_tier").notNull().default("free"), // free, premium
  subscriptionStatus: text("subscription_status").default("active"), // active, cancelled, expired
  subscriptionStartDate: timestamp("subscription_start_date"),
  subscriptionEndDate: timestamp("subscription_end_date"),
  emergencyCredits: integer("emergency_credits").default(0), // For emergency response usage
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
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
  isAnswered: boolean("is_answered").default(false),
  upvotes: integer("upvotes").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const forumAnswers = pgTable("forum_answers", {
  id: serial("id").primaryKey(),
  questionId: integer("question_id").references(() => forumQuestions.id),
  content: text("content").notNull(),
  isVerified: boolean("is_verified").default(false), // verified by legal professional
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

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

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
