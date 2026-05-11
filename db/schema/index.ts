import { pgTable, serial, text, timestamp, integer, boolean, jsonb, vector } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  clerkId: text('clerk_id').notNull().unique(),
  email: text('email').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const portfolios = pgTable('portfolios', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  subdomain: text('subdomain').notNull().unique(),
  themeConfig: jsonb('theme_config').default({
    primaryColor: '#000000',
    layout: 'bento',
    fontFamily: 'Inter',
  }).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const documents = pgTable('documents', {
  id: serial('id').primaryKey(),
  portfolioId: integer('portfolio_id').references(() => portfolios.id).notNull(),
  content: text('content').notNull(),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const embeddings = pgTable('embeddings', {
  id: serial('id').primaryKey(),
  documentId: integer('document_id').references(() => documents.id).notNull(),
  embedding: vector('embedding', { dimensions: 768 }).notNull(), // Optimized for Gemini text-embedding-004
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const chatLogs = pgTable('chat_logs', {
  id: serial('id').primaryKey(),
  portfolioId: integer('portfolio_id').references(() => portfolios.id).notNull(),
  message: text('message').notNull(),
  response: text('response').notNull(),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  portfolioId: integer('portfolio_id').references(() => portfolios.id).notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  imageUrl: text('image_url'),
  tags: jsonb('tags').default([]).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
