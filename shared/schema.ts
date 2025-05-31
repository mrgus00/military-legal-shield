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
  isActive: boolean("is_active").default(true),
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
