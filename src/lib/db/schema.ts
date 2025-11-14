import {
  boolean,
  jsonb,
  pgTable,
  real,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

// User table for BetterAuth (exact schema required)
export const users = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Session table for BetterAuth (exact schema required)
export const sessions = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
});

// Account table for OAuth providers (exact schema required)
export const accounts = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Verification table for magic links (exact schema required)
export const verifications = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Personality profiles table
export const personalityProfiles = pgTable('personality_profiles', {
  id: text('id').primaryKey(),
  userId: text('userId').references(() => users.id, { onDelete: 'cascade' }),
  bigFive: jsonb('bigFive').$type<{
    openness: number;
    conscientiousness: number;
    extraversion: number;
    agreeableness: number;
    neuroticism: number;
  }>(),
  mbti: text('mbti'),
  zodiac: jsonb('zodiac').$type<{
    sun: string;
    moon?: string;
    rising?: string;
  }>(),
  chineseZodiac: jsonb('chineseZodiac').$type<{
    animal: string;
    element: string;
    year: number;
  }>(),
  humanDesign: jsonb('humanDesign').$type<{
    type: string;
    authority?: string;
    profile?: string;
  }>(),
  attachmentStyle: text('attachmentStyle'),
  loveLanguages: jsonb('loveLanguages').$type<
    Array<{
      type: string;
      rank: number;
    }>
  >(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

// Analysis results table
export const analysisResults = pgTable('analysis_results', {
  id: text('id').primaryKey(),
  profileId: text('profileId')
    .notNull()
    .references(() => personalityProfiles.id, { onDelete: 'cascade' }),
  selfImprovement: jsonb('selfImprovement').$type<
    Array<{
      id: string;
      title: string;
      description: string;
      explanation: string;
      actionable: string;
      confidence: number;
      sources: string[];
    }>
  >(),
  strengths: jsonb('strengths').$type<
    Array<{
      id: string;
      title: string;
      description: string;
      explanation: string;
      actionable: string;
      confidence: number;
      sources: string[];
    }>
  >(),
  greenFlags: jsonb('greenFlags').$type<
    Array<{
      id: string;
      title: string;
      description: string;
      explanation: string;
      actionable: string;
      confidence: number;
      sources: string[];
    }>
  >(),
  redFlags: jsonb('redFlags').$type<
    Array<{
      id: string;
      title: string;
      description: string;
      explanation: string;
      actionable: string;
      confidence: number;
      sources: string[];
    }>
  >(),
  confidence: real('confidence'),
  completeness: real('completeness'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
});
