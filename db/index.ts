import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl && process.env.NODE_ENV === 'production') {
  console.warn('DATABASE_URL is missing. Database queries will fail at runtime.');
}

// Lazy initialization is not strictly necessary with drizzle-orm/neon-http, 
// but we ensure we don't pass an empty string to neon() which could cause immediate issues.
const sql = neon(databaseUrl || 'postgres://placeholder:placeholder@localhost:5432/placeholder');
export const db = drizzle(sql, { schema });
