import pdf from 'pdf-parse';
import { google } from '@ai-sdk/google';
import { embed, generateObject } from 'ai';
import { z } from 'zod';

export async function extractTextFromPDF(buffer: Buffer) {
  const data = await pdf(buffer);
  return data.text;
}

export async function generateEmbedding(text: string) {
  const { embedding } = await embed({
    model: google.embedding('text-embedding-004'),
    value: text,
  });
  return embedding;
}

export async function extractProjectsFromText(text: string) {
  const { object } = await generateObject({
    model: google('gemini-1.5-flash'),
    schema: z.object({
      projects: z.array(z.object({
        title: z.string(),
        description: z.string(),
        tags: z.array(z.string()),
      }))
    }),
    prompt: `Extrahiere eine Liste von Projekten aus dem folgenden Lebenslauf-Text. 
    Für jedes Projekt gib einen Titel, eine kurze Beschreibung und relevante Tech-Tags an.
    
    TEXT:
    ${text}`,
  });
  return object.projects;
}
