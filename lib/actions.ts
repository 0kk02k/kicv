'use server';

import { db } from '@/db';
import { portfolios, users, documents, embeddings, projects } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth, currentUser } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { extractTextFromPDF, generateEmbedding, extractProjectsFromText } from './ai';

export async function getOrCreateUser() {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      console.log('getOrCreateUser: No userId found in auth()');
      return null;
    }

    console.log(`getOrCreateUser: Checking DB for clerkId: ${clerkId}`);
    let user = await db.query.users.findFirst({
      where: eq(users.clerkId, clerkId),
    });

    if (!user) {
      console.log('getOrCreateUser: User not found, creating new user');
      // Fetch full user details from Clerk to get the email
      const clerkUser = await currentUser();
      const email = clerkUser?.emailAddresses[0]?.emailAddress || '';
      
      if (!email) {
        console.warn('getOrCreateUser: No email found for Clerk user');
      }

      const [newUser] = await db.insert(users).values({
        clerkId,
        email: email,
      }).returning();
      user = newUser;
      console.log(`getOrCreateUser: New user created with ID: ${user.id}`);
    }

    return user;
  } catch (error) {
    console.error('getOrCreateUser CRASH:', error);
    throw error;
  }
}

export interface ThemeConfig {
  primaryColor: string;
  layout: string;
  fontFamily: string;
}

export async function updatePortfolioTheme(config: ThemeConfig) {
  const { userId: clerkId } = await auth();
  if (!clerkId) throw new Error('Unauthorized');

  const user = await getOrCreateUser();
  if (!user) throw new Error('User not found');

  let portfolio = await db.query.portfolios.findFirst({
    where: eq(portfolios.userId, user.id),
  });

  if (!portfolio) {
    const [newPortfolio] = await db.insert(portfolios).values({
      userId: user.id,
      subdomain: `user-${user.id}`,
      themeConfig: config,
    }).returning();
    portfolio = newPortfolio;
  } else {
    await db.update(portfolios)
      .set({ themeConfig: config })
      .where(eq(portfolios.id, portfolio.id));
  }

  revalidatePath('/dashboard');
  revalidatePath(`/p/${portfolio.subdomain}`);
  
  return { success: true };
}

export async function processCVUpload(formData: FormData) {
  const file = formData.get('file') as File;
  if (!file) throw new Error('No file uploaded');

  const { userId: clerkId } = await auth();
  if (!clerkId) throw new Error('Unauthorized');

  const user = await getOrCreateUser();
  if (!user) throw new Error('User not found');

  const portfolio = await db.query.portfolios.findFirst({
    where: eq(portfolios.userId, user.id),
  });

  if (!portfolio) throw new Error('Portfolio not found. Please save theme first.');

  const buffer = Buffer.from(await file.arrayBuffer());
  const text = await extractTextFromPDF(buffer);

  // Store document
  const [doc] = await db.insert(documents).values({
    portfolioId: portfolio.id,
    content: text,
    metadata: { fileName: file.name },
  }).returning();

  // Generate and store embedding
  const embedding = await generateEmbedding(text.slice(0, 4000)); 
  await db.insert(embeddings).values({
    documentId: doc.id,
    embedding: embedding,
  });

  // Extract and store projects
  try {
    const extractedProjects = await extractProjectsFromText(text);
    if (extractedProjects.length > 0) {
      await db.insert(projects).values(
        extractedProjects.map((p: { title: string, description: string, tags: string[] }) => ({
          portfolioId: portfolio.id,
          title: p.title,
          description: p.description,
          tags: p.tags,
        }))
      );
    }
  } catch (error) {
    console.error('Failed to extract projects:', error);
  }

  revalidatePath('/dashboard');
  revalidatePath(`/p/${portfolio.subdomain}`);
  return { success: true };
}
