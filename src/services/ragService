import { pipeline } from '@xenova/transformers';
import type { Chunk } from '../scripts/ingest';
let chunks: Chunk[] | null = null;
let embedder: any = null;

async function getEmbedder() {
  if (!embedder) {
    embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  }
  return embedder;
}

async function getChunks(): Promise<Chunk[]> {
  if (!chunks) {
    const data = await import('../constants/chunks.json');
    chunks = data.default as Chunk[];
  }
  return chunks;
}

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

export interface RetrievedContext {
  text: string;
  sourceLabel: string;
  score: number;
}

export async function retrieveContext(query: string, topK = 5): Promise<RetrievedContext[]> {
  const [embed, allChunks] = await Promise.all([getEmbedder(), getChunks()]);

  const output = await embed(query, { pooling: 'mean', normalize: true });
  const queryEmbedding = Array.from(output.data as Float32Array);

  const scored = allChunks.map(chunk => ({
    text: chunk.text,
    sourceLabel: chunk.sourceLabel,
    score: cosineSimilarity(queryEmbedding as number[], chunk.embedding),
  }));

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}