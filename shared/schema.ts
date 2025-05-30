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
  experience: text("experience").notNull(),
  rating: integer("rating").notNull(),
  reviewCount: integer("review_count").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  bio: text("bio"),
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
