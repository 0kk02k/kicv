import { google } from '@ai-sdk/google';
import { streamText, embed } from 'ai';
import { db } from '@/db';
import { embeddings, documents } from '@/db/schema';
import { eq, sql, and } from 'drizzle-orm';

export const maxDuration = 30;
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const { messages, portfolioId } = await req.json();

  // 1. Get the last message
  const lastMessage = messages[messages.length - 1].content;

  // 2. Generate embedding for the question using Gemini text-embedding-004
  const { embedding } = await embed({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    model: google.embedding('text-embedding-004') as any, // Bypassing type version mismatch
    value: lastMessage,
  });

  // 3. Search for context
  // Similarity search using <=> (cosine distance)
  const context = await db
    .select({
      content: documents.content,
    })
    .from(embeddings)
    .innerJoin(documents, eq(embeddings.documentId, documents.id))
    .where(
      and(
        eq(documents.portfolioId, portfolioId),
        // This is a raw SQL fragment for vector similarity
        sql`${embeddings.embedding} <=> ${JSON.stringify(embedding)}::vector < 0.5`
      )
    )
    .limit(3);

  const contextText = context.map(c => c.content).join('\n\n');

  // 4. Stream response
  const result = await streamText({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    model: google('gemini-1.5-flash') as any,
    system: `Du bist der "AI Career Twin" dieses Nutzers. 
    Deine Aufgabe ist es, Fragen zum Lebenslauf und den Projekten des Nutzers professionell zu beantworten.
    Nutze den folgenden Kontext für deine Antworten. Wenn du etwas nicht weißt, sag es ehrlich.
    
    KONTEXT:
    ${contextText}`,
    messages,
  });

  return result.toDataStreamResponse();
}

