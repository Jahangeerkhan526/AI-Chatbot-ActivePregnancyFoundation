import * as fs from 'fs';
import * as path from 'path';
import { createRequire } from 'module';
import { pipeline } from '@xenova/transformers';
import { fromPath } from 'pdf2pic';
import Tesseract from 'tesseract.js';
import { SOURCES } from '../constants/sources';

const require = createRequire(import.meta.url);
const PDFParser = require('pdf2json');

// ── CONFIG ─────────────────────────────────────────────────────────────────
const CHUNK_SIZE = 400;
const CHUNK_OVERLAP = 80;
const OUTPUT_PATH = './src/constants/chunks.json';
const TMP_IMAGE_DIR = './data/tmp_images';

// ── TYPES ──────────────────────────────────────────────────────────────────
export interface Chunk {
  id: string;
  sourceId: string;
  sourceLabel: string;
  text: string;
  embedding: number[];
}

// ── SAFE DECODE ────────────────────────────────────────────────────────────
// pdf2json URI-encodes text but some PDFs produce malformed sequences
function safeDecode(str: string): string {
  try {
    return decodeURIComponent(str);
  } catch {
    // Fall back: decode only safe percent-sequences, leave the rest as-is
    return str.replace(/%[0-9A-Fa-f]{2}/g, (seq) => {
      try { return decodeURIComponent(seq); } catch { return ''; }
    });
  }
}

// ── TEXT SPLITTER ──────────────────────────────────────────────────────────
function splitIntoChunks(
  text: string,
  sourceId: string,
  sourceLabel: string
): Omit<Chunk, 'embedding'>[] {
  const clean = text.replace(/\s+/g, ' ').trim();
  const chunks: Omit<Chunk, 'embedding'>[] = [];
  let i = 0;
  let chunkIndex = 0;

  while (i < clean.length) {
    const chunk = clean.slice(i, i + CHUNK_SIZE);
    if (chunk.trim().length > 40) {
      chunks.push({
        id: `${sourceId}-chunk-${chunkIndex++}`,
        sourceId,
        sourceLabel,
        text: chunk.trim(),
      });
    }
    i += CHUNK_SIZE - CHUNK_OVERLAP;
  }

  return chunks;
}

// ── TXT EXTRACTOR ──────────────────────────────────────────────────────────
function extractTxt(filePath: string): string {
  return fs.readFileSync(filePath, 'utf-8');
}

// ── PDF EXTRACTOR (pdf2json) ───────────────────────────────────────────────
async function extractPDF(filePath: string): Promise<{ text: string; pageCount: number }> {
  return new Promise((resolve, reject) => {
    const parser = new PDFParser(null, 1);

    parser.on('pdfParser_dataError', (err: any) => {
      reject(new Error(err.parserError ?? String(err)));
    });

    parser.on('pdfParser_dataReady', (data: any) => {
      const pages: any[] = data?.Pages ?? [];
      let fullText = '';

      for (const page of pages) {
        const pageText = (page.Texts ?? [])
          .map((t: any) =>
            (t.R ?? [])
              .map((r: any) => safeDecode(r.T ?? ''))  // ← safe decode here
              .join('')
          )
          .join(' ');
        fullText += pageText + '\n';
      }

      resolve({ text: fullText, pageCount: pages.length });
    });

    parser.loadPDF(filePath);
  });
}

// ── OCR EXTRACTOR for image-based PDFs ────────────────────────────────────
async function extractPDFWithOCR(filePath: string, pageCount: number): Promise<string> {
  if (!fs.existsSync(TMP_IMAGE_DIR)) {
    fs.mkdirSync(TMP_IMAGE_DIR, { recursive: true });
  }

  console.log(`\n  OCR scanning ${pageCount} pages...`);

  const converter = fromPath(filePath, {
    density: 200,
    saveFilename: 'page',
    savePath: TMP_IMAGE_DIR,
    format: 'png',
    width: 1654,
    height: 2339,
  });

  let fullText = '';

  for (let page = 1; page <= pageCount; page++) {
    try {
      const result = await converter(page, { responseType: 'image' });
      const imagePath = result.path!;

      const { data: { text } } = await Tesseract.recognize(imagePath, 'eng', {
        logger: () => {},
      });

      fullText += text + '\n';

      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);

      process.stdout.write(`  OCR page ${page}/${pageCount}\r`);
    } catch (err) {
      console.error(`\n  Warning: Failed to OCR page ${page}:`, err);
    }
  }

  if (fs.existsSync(TMP_IMAGE_DIR)) {
    fs.rmSync(TMP_IMAGE_DIR, { recursive: true, force: true });
  }

  return fullText;
}

// ── HYBRID PDF EXTRACTOR ───────────────────────────────────────────────────
async function extractPDFHybrid(filePath: string, forceOCR: boolean): Promise<string> {
  const { text, pageCount } = await extractPDF(filePath);

  if (forceOCR) {
    console.log(`  OCR forced for this file`);
    return extractPDFWithOCR(filePath, pageCount);
  }

  if (text.trim().length < 200) {
    console.log(`  Low text yield (${text.trim().length} chars) - switching to OCR automatically`);
    return extractPDFWithOCR(filePath, pageCount);
  }

  return text;
}

// ── MAIN ───────────────────────────────────────────────────────────────────
async function main() {
  console.log('APF Knowledge Base Ingestion\n');

  const outputDir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Suppress the noisy pdf2json warnings about fake workers and unsupported fields
  const originalWarn = console.warn;
  console.warn = (...args: any[]) => {
    const msg = String(args[0] ?? '');
    if (
      msg.includes('Setting up fake worker') ||
      msg.includes('Unsupported') ||
      msg.includes('NOT valid form') ||
      msg.includes('JPX error')
    ) return;
    originalWarn(...args);
  };

  console.log('Loading embedding model (first run downloads ~25MB)...');
  const embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  console.log('Embedding model ready\n');

  const allChunks: Chunk[] = [];
  let successCount = 0;
  let failCount = 0;

  for (const source of SOURCES) {
    console.log(`[${source.id}] ${source.label}`);

    if (!fs.existsSync(source.location)) {
      console.error(`  File not found: ${source.location} - skipping\n`);
      failCount++;
      continue;
    }

    let rawText = '';

    try {
      if (source.type === 'txt') {
        rawText = extractTxt(source.location);
        console.log(`  TXT extracted (${rawText.length} chars)`);
      } else if (source.type === 'pdf') {
        rawText = await extractPDFHybrid(source.location, source.hasImages ?? false);
        console.log(`  PDF extracted (${rawText.length} chars)`);
      }
    } catch (err) {
      console.error(`  Extraction failed:`, err);
      failCount++;
      console.log('');
      continue;
    }

    if (rawText.trim().length === 0) {
      console.warn(`  No text extracted - skipping\n`);
      failCount++;
      continue;
    }

    const chunks = splitIntoChunks(rawText, source.id, source.label);
    console.log(`  Split into ${chunks.length} chunks`);

    process.stdout.write(`  Embedding`);
    for (const chunk of chunks) {
      const output = await embedder(chunk.text, { pooling: 'mean', normalize: true });
      const embedding = Array.from(output.data as Float32Array);
      allChunks.push({ ...chunk, embedding });
      process.stdout.write('.');
    }

    console.log(` done\n`);
    successCount++;
  }

  // Restore console.warn
  console.warn = originalWarn;

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(allChunks, null, 2));

  console.log('--- Ingestion Complete ---');
  console.log(`Sources processed : ${successCount}`);
  console.log(`Sources failed    : ${failCount}`);
  console.log(`Total chunks      : ${allChunks.length}`);
  console.log(`Output            : ${OUTPUT_PATH}`);
}

main().catch((err) => {
  console.error('\nFatal error during ingestion:', err);
  process.exit(1);
});