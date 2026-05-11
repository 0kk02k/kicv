import { describe, it, expect, vi } from 'vitest';
import { extractTextFromPDF } from './ai';

vi.mock('pdf-parse', () => {
  return {
    default: vi.fn().mockResolvedValue({ text: 'Extracted Text Content' })
  };
});

describe('AI Utilities', () => {
  it('should extract text from PDF buffer', async () => {
    const mockBuffer = Buffer.from('mock pdf content');
    const text = await extractTextFromPDF(mockBuffer);
    expect(text).toBe('Extracted Text Content');
  });
});
