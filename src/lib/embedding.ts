import { openai } from './openai';

export const EMBEDDING_DIM = 1536;
export const EMBEDDING_MODEL = 'text-embedding-3-small';

export interface Embedder {
  dim: number;
  embed(texts: string[]): Promise<number[][]>;
}

export function openAIEmbedder(): Embedder {
  const model = EMBEDDING_MODEL;
  const dim = EMBEDDING_DIM;

  return {
    dim,
    async embed(texts: string[]) {
      const res = await openai.embeddings.create({ model, input: texts });
      return res.data.map((d) => d.embedding as number[]);
    },
  };
}

export async function embedBatch(texts: string[]) {
  const res = await openai.embeddings.create({ model: EMBEDDING_MODEL, input: texts });
  return res.data.map((d) => d.embedding as number[]);
}

// tiny retry wrapper (exponential backoff)
export async function withRetry<T>(fn: () => Promise<T>, tries = 3) {
  let attempt = 0,
    lastErr: Error | undefined;
  while (attempt < tries) {
    try {
      return await fn();
    } catch (e) {
      lastErr = e as Error;
      await new Promise((r) => setTimeout(r, 500 * 2 ** attempt));
      attempt++;
    }
  }
  throw lastErr;
}
