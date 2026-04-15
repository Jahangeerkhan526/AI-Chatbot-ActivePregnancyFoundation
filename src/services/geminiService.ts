/// <reference types="vite/client" />
// src/services/geminiService.ts
import { GoogleGenAI } from "@google/genai";
import { retrieveContext } from "./ragService";
import { logUnknownQuestion } from "./unknownQuestionsLogger";

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export type UserCategory =
  | 'preconception'
  | 'pregnant'
  | 'postnatal'
  | 'professional'
  | 'supporter'
  | 'other'
  | null;

const GEMINI_MODEL_CHAIN = [
  'gemini-2.5-flash-lite',
  'gemini-2.5-flash',
  'gemini-2.0-flash',
];

const SENTINEL = "I don't have specific information on that in my database. Please consult your healthcare provider.";

// RAG score threshold
// Score = 2pts per stem match + 1pt per partial match
// APF topics (swimming, walking, yoga) score 8-15+
// Unrelated topics (cricket, mountain) score 2-4
// Threshold of 6 = at least 3 strong word matches needed
const MIN_RAG_SCORE = 2;

function buildSystemInstruction(userName: string, category: UserCategory): string {
  const categoryContext: Record<NonNullable<UserCategory>, string> = {
    preconception: "This user is thinking of becoming pregnant. Focus on preconception physical activity guidance from APF resources.",
    pregnant: "This user is currently pregnant. The user has already completed screening. Do not repeat screening. Use APF resources.",
    postnatal: "This user has recently had a baby. The user has already completed screening. Use APF postnatal resources and POGP guidance.",
    professional: "This user is a healthcare or fitness professional. Be more technically detailed. Point to This Mum Moves programme where appropriate.",
    supporter: "This user is supporting someone who is pregnant or postnatal. Keep answers warm, practical, and non-clinical.",
    other: "This user's situation doesn't fit standard categories. Stay within APF knowledge base and recommend professional advice when unsure.",
  };

  const contextLine = category ? categoryContext[category] : "Answer general APF questions only.";

  return `
OVERRIDING RULE — READ THIS FIRST AND FOLLOW IT ALWAYS:
You are a RETRIEVAL-ONLY system. You ONLY use the APF CONTEXT provided below.
If the APF CONTEXT does not contain relevant information:
→ Your ENTIRE response must be ONLY: "${SENTINEL}"
→ No alternatives. No general advice. No outside knowledge. No exceptions.

You are Nancy — a warm assistant from the Active Pregnancy Foundation (APF).

USER: ${userName || 'the user'} | SITUATION: ${contextLine}

PERSONALITY: Warm, friendly, supportive friend. Use first name occasionally. Plain English. Short answers.

RULES:
1. Use ONLY the APF CONTEXT. Never use outside knowledge.
2. No APF context on topic → respond with ONLY the sentinel phrase. Nothing else.
3. Recommend GP/midwife for personal medical decisions.
4. Cite source e.g. (Source: APF General FAQs).
5. Never diagnose or prescribe.
6. Never reproduce raw questionnaire text.
`.trim();
}

async function tryGeminiModel(
  ai: GoogleGenAI,
  model: string,
  contents: { role: string; parts: { text: string }[] }[],
  systemInstruction: string
): Promise<string> {
  const response = await ai.models.generateContent({
    model,
    contents,
    config: { systemInstruction, temperature: 0.1 },
  });
  const text = response.text;
  if (!text) throw new Error(`${model} returned empty response`);
  return text;
}

export const getGeminiResponse = async (
  history: ChatMessage[],
  userName: string = '',
  category: UserCategory = null
): Promise<string> => {

  const lastUserMessage = [...history].reverse().find(m => m.role === 'user');
  if (!lastUserMessage) return "Please ask a question.";

  const userText = lastUserMessage.text.toLowerCase();

  // ── SAFETY KEYWORD FILTER ─────────────────────────────────────────────────
  const SAFETY_KEYWORDS = [
    "chest pain", "chest tightness", "heart pain", "palpitations",
    "shortness of breath", "bleeding", "vaginal bleeding",
    "amniotic fluid", "waters broke", "dizziness", "dizzy", "faint",
    "fainting", "lightheaded", "severe pain", "abdominal pain", "pelvic pain",
    "baby not moving", "no movement", "reduced movement",
    "blurred vision", "severe headache", "high blood pressure", "high bp",
    "low bp", "low blood pressure", "blood pressure",
    "hypertension", "preeclampsia", "gestational diabetes", "diabetes",
    "epilepsy", "seizure", "heart condition", "heart disease", "cardiac",
    "blood clot", "cancer", "tumour", "tumor", "thyroid", "kidney disease",
    "placenta previa", "incompetent cervix", "cerclage", "premature labour",
    "preterm", "miscarriage", "ectopic", "fell", "fall", "accident",
    "injured", "fever", "contractions", "labour", "labor",
    "swollen face", "swollen hands"
  ];

  if (SAFETY_KEYWORDS.some(kw => userText.includes(kw))) {
    await logUnknownQuestion(lastUserMessage.text, category ?? 'unknown', userName ?? 'unknown');
    return `⚠️ ${userName ? userName + ', t' : 'T'}hat's really important to get checked out properly. I'm not able to give personal medical advice on that, but please speak to your GP or midwife — they'll give you the right guidance for your situation. If you need urgent help, call NHS 111. Take care of yourself! 💜`;
  }

  // ── RAG CONTEXT ───────────────────────────────────────────────────────────
  const contexts = await retrieveContext(lastUserMessage.text, 5);

  // Filter to only HIGH confidence matches using score threshold
  // This prevents weak/accidental matches (cricket, mountain) from reaching the LLM
  const goodContexts = contexts.filter(c => c.score >= MIN_RAG_SCORE);

  console.log(`📚 RAG: ${contexts.length} results, ${goodContexts.length} above threshold (${MIN_RAG_SCORE})`);
  contexts.forEach((c, i) => console.log(`  [${i+1}] score=${c.score} | ${c.sourceLabel} | ${c.text.slice(0, 60)}...`));

  if (goodContexts.length === 0) {
    await logUnknownQuestion(lastUserMessage.text, category ?? 'unknown', userName ?? 'unknown');
    console.log('⚠️ No good RAG context → sentinel');
    return SENTINEL;
  }

  const contextBlock = goodContexts
    .map((c, i) => `[${i + 1}] (${c.sourceLabel})\n${c.text}`)
    .join('\n\n');

  const augmentedHistory = history.map((m, idx) => {
    if (idx === history.length - 1 && m.role === 'user') {
      return {
        ...m,
        text: `APF CONTEXT — use ONLY this, no outside knowledge:\n${contextBlock}\n\nUSER QUESTION: ${m.text}`,
      };
    }
    return m;
  });

  const contents = augmentedHistory.map(m => ({
    role: m.role,
    parts: [{ text: m.text }],
  }));

  const systemInstruction = buildSystemInstruction(userName, category);

  // ── GEMINI FALLBACK CHAIN ─────────────────────────────────────────────────
  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || '' });
  const errors: string[] = [];

  for (const model of GEMINI_MODEL_CHAIN) {
    try {
      console.log(`Trying Gemini: ${model}`);
      const text = await tryGeminiModel(ai, model, contents, systemInstruction);
      console.log(`✅ Gemini succeeded: ${model}`);
      return text;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      errors.push(`${model}: ${message}`);
      console.warn(`Gemini ${model} failed — ${message}`);
    }
  }

  console.error('All models failed:\n' + errors.join('\n'));
  return "I'm having trouble connecting right now. Please try again in a moment, or contact the APF team directly if the problem persists.";
};
