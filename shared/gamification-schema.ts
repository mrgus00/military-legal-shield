import { pgTable, serial, text, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { users } from "./schema";

// Legal preparedness challenges
export const legalChallenges = pgTable("legal_challenges", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // knowledge, scenario, document-prep, emergency-response
  difficulty: text("difficulty").notNull(), // beginner, intermediate, advanced, expert
  branch: text("branch"), // Army, Navy, Air Force, Marines, Coast Guard, Space Force, All
  pointsValue: integer("points_value").notNull(),
  timeLimit: integer("time_limit"), // in minutes
  prerequisites: text("prerequisites").array(), // other challenge IDs required
  questions: jsonb("questions").notNull(), // JSON array of questions/scenarios
  correctAnswers: jsonb("correct_answers").notNull(), // JSON array of correct responses
  explanations: text("explanations").array(), // educational explanations
  resources: text("resources").array(), // links to relevant resources
  badges: text("badges").array(), // badge IDs awarded upon completion
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User challenge progress
export const userChallengeProgress = pgTable("user_challenge_progress", {
  id: serial("id").primaryKey(),
  userId: text("user_id").references(() => users.id),
  challengeId: integer("challenge_id").references(() => legalChallenges.id),
  status: text("status").notNull(), // not_started, in_progress, completed, failed
  score: integer("score"), // 0-100
  timeSpent: integer("time_spent"), // in minutes
  attempts: integer("attempts").default(1),
  maxAttempts: integer("max_attempts").default(3),
  answers: jsonb("answers"), // user's answers
  feedback: text("feedback"), // personalized feedback
  hintsUsed: integer("hints_used").default(0),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  lastAttemptAt: timestamp("last_attempt_at").defaultNow(),
});

// Achievement badges
export const achievementBadges = pgTable("achievement_badges", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(), // icon identifier
  category: text("category").notNull(), // knowledge, completion, streak, excellence, special
  tier: text("tier").notNull(), // bronze, silver, gold, platinum, legendary
  requirements: jsonb("requirements").notNull(), // JSON string of requirements
  pointsAwarded: integer("points_awarded").notNull(),
  rarity: text("rarity").notNull(), // common, uncommon, rare, epic, legendary
  isSecret: boolean("is_secret").default(false), // hidden until earned
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// User badges (earned achievements)
export const userBadges = pgTable("user_badges", {
  id: serial("id").primaryKey(),
  userId: text("user_id").references(() => users.id),
  badgeId: integer("badge_id").references(() => achievementBadges.id),
  earnedAt: timestamp("earned_at").defaultNow(),
  progress: integer("progress").default(0), // for progressive badges
  isDisplayed: boolean("is_displayed").default(true), // user chooses to display
});

// User gamification stats
export const userGamificationStats = pgTable("user_gamification_stats", {
  id: serial("id").primaryKey(),
  userId: text("user_id").references(() => users.id),
  totalPoints: integer("total_points").default(0),
  currentStreak: integer("current_streak").default(0), // consecutive days active
  longestStreak: integer("longest_streak").default(0),
  totalChallengesCompleted: integer("total_challenges_completed").default(0),
  totalBadgesEarned: integer("total_badges_earned").default(0),
  rank: text("rank").default("Recruit"), // Recruit, Private, Specialist, Sergeant, Lieutenant, Captain, Major, Colonel, General
  level: integer("level").default(1),
  experiencePoints: integer("experience_points").default(0),
  nextLevelPoints: integer("next_level_points").default(100),
  lastActiveDate: timestamp("last_active_date").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Daily challenges
export const dailyChallenges = pgTable("daily_challenges", {
  id: serial("id").primaryKey(),
  challengeDate: timestamp("challenge_date").notNull(),
  challengeId: integer("challenge_id").references(() => legalChallenges.id),
  bonusMultiplier: integer("bonus_multiplier").default(1), // 1x, 2x, 3x points
  isActive: boolean("is_active").default(true),
});

// Leaderboards
export const leaderboards = pgTable("leaderboards", {
  id: serial("id").primaryKey(),
  userId: text("user_id").references(() => users.id),
  category: text("category").notNull(), // overall, weekly, monthly, by_branch
  branch: text("branch"), // for branch-specific leaderboards
  points: integer("points").notNull(),
  rank: integer("rank").notNull(),
  period: text("period").notNull(), // all_time, weekly, monthly
  periodStart: timestamp("period_start"),
  periodEnd: timestamp("period_end"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Types
export type LegalChallenge = typeof legalChallenges.$inferSelect;
export type InsertLegalChallenge = typeof legalChallenges.$inferInsert;
export type UserChallengeProgress = typeof userChallengeProgress.$inferSelect;
export type InsertUserChallengeProgress = typeof userChallengeProgress.$inferInsert;
export type AchievementBadge = typeof achievementBadges.$inferSelect;
export type InsertAchievementBadge = typeof achievementBadges.$inferInsert;
export type UserBadge = typeof userBadges.$inferSelect;
export type InsertUserBadge = typeof userBadges.$inferInsert;
export type UserGamificationStats = typeof userGamificationStats.$inferSelect;
export type InsertUserGamificationStats = typeof userGamificationStats.$inferInsert;