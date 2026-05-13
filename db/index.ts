import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.warn('DATABASE_URL is missing. Database connection will likely fail.');
}

// Ensure we have a valid-looking URL even if it's a dummy one, to prevent neon() from crashing
const connectionString = databaseUrl || 'postgres://placeholder:placeholder@localhost:5432/placeholder';

const sql = neon(connectionString);
export const db = drizzle(sql, { schema });
