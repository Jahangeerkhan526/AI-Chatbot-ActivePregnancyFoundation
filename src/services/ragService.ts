import type { Chunk } from '../scripts/ingest';

let chunks: Chunk[] | null = null;

async function getChunks(): Promise<Chunk[]> {
  if (!chunks) {
    const data = await import('../constants/chunks.json');
    chunks = data.default as Chunk[];
  }
  return chunks;
}

export interface RetrievedContext {
  text: string;
  sourceLabel: string;
  score: number;
}

export async function retrieveContext(query: string, topK = 8): Promise<RetrievedContext[]> {
  const allChunks = await getChunks();

  // Strip common words that don't help matching
  const stopWords = new Set(['what', 'when', 'where', 'which', 'while', 'that', 'this', 'with', 'from', 'they', 'them', 'have', 'will', 'your', 'about', 'can', 'the', 'and', 'for', 'are', 'was', 'its']);

  // Break query into root stems (e.g. "running" → "run", "pregnant" → "pregnan")
  const queryWords = query
    .toLowerCase()
    .replace(/[^a-z\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 2 && !stopWords.has(w))
    .map(w => w.slice(0, 5));

  if (queryWords.length === 0) return [];

  const scored = allChunks
    .filter(chunk => {
      const matches = (chunk.text.match(/YOUR GUIDE TO DURING PREGNANCY AND BEYOND/g) || []).length;
      return matches < 2;
    })
    .map(chunk => {
      const text = chunk.text.toLowerCase();
      const label = chunk.sourceLabel.toLowerCase();
      let score = 0;

      for (const word of queryWords) {
        // Label matches — weighted heavily so e.g. "yoga" always surfaces yoga chunks first
        if (label.includes(word)) {
          score += 10;
        }

        // Text matches
        if (text.includes(word)) {
          score += 2;
        }
        if (text.includes(word.slice(0, 4))) {
          score += 1;
        }
      }

      return {
        text: chunk.text,
        sourceLabel: chunk.sourceLabel,
        score,
      };
    });

  return scored
    .filter(c => c.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}