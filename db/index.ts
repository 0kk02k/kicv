import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

if (!process.env.DATABASE_URL && process.env.NODE_ENV === 'production') {
  // During build we might not have the DB URL, but we don't want to crash
  // unless we are actually trying to query the DB.
  console.warn('DATABASE_URL is missing. Database queries will fail.');
}

const sql = neon(process.env.DATABASE_URL || 'postgres://dummy:dummy@localhost:5432/dummy');
export const db = drizzle(sql, { schema });
