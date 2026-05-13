import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// Vercel Neon integration might provide these under different names
const databaseUrl = process.env.DATABASE_URL || 
                    process.env.POSTGRES_URL || 
                    process.env.POSTGRES_PRISMA_URL ||
                    process.env.NEON_DATABASE_URL;

if (!databaseUrl) {
  console.warn('DATABASE_URL or equivalent is missing. Database connection will likely fail.');
  // Log available keys to help debugging (but not values)
  const envKeys = Object.keys(process.env);
  console.log('Available connection-related env vars:', envKeys.filter(k => k.includes('URL') || k.includes('POSTGRES') || k.includes('NEON')));
}

// Ensure we have a valid-looking URL even if it's a dummy one, to prevent neon() from crashing during build
const connectionString = databaseUrl || 'postgres://placeholder:placeholder@localhost:5432/placeholder';

const sql = neon(connectionString);
export const db = drizzle(sql, { schema });
