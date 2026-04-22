/// <reference types="vite/client" />
// src/services/geminiService.ts
import { GoogleGenAI } from "@google/genai";
import Groq from 'groq-sdk';
import { retrieveContext } from "./ragService";
import { logUnknownQuestion } from "./unknownQuestionsLogger";
import { MEDICAL_GLOSSARY, findMedicalTerm } from "../constants/medicalGlossary";

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

const MIN_RAG_SCORE = 4;

// ── AUTO-GENERATE SAFETY KEYWORDS FROM GLOSSARY ───────────────────────────
const GLOSSARY_KEYWORDS = MEDICAL_GLOSSARY.map(t => t.term.toLowerCase());

const EXTRA_SAFETY_KEYWORDS = [
  "chest pain", "chest tightness", "chest pressure", "chest discomfort",
  "heart pain", "heart racing", "heart pounding",
  "heart disease", "cardiac",
  "shortness of breath", "cant breathe", "can't breathe",
  "breathing difficulty", "breathless", "out of breath",
  "bleeding", "vaginal bleeding", "spotting", "blood loss",
  "waters broke", "waters breaking", "leaking fluid",
  "dizzy", "faint", "fainting", "lightheaded", "light headed",
  "blurred vision", "blurry vision", "seeing spots",
  "severe headache", "headache", "migraine",
  "severe pain", "stomach pain", "tummy pain",
  "pelvic pressure", "lower back pain", "back pain",
  "hip pain", "groin pain", "rib pain", "pubic pain",
  "round ligament pain", "spd pain",
  "baby not moving", "no movement", "reduced movement", "less movement",
  "baby moving less", "cant feel baby", "can't feel baby",
  "high blood pressure", "high bp", "low blood pressure", "low bp",
  "swollen face", "swollen hands", "swollen feet",
  "swelling face", "swelling hands", "swelling feet",
  "anemia", "iron deficiency", "blood clot",
  "tumour", "tumor", "cancer", "thyroid", "kidney pain",
  "cervical stitch", "low placenta",
  "premature labour", "premature labor", "early labour",
  "contractions", "labour", "labor", "waters",
  "pregnancy loss",
  "fell", "fall", "fallen", "accident", "injured", "injury",
  "fracture", "broken bone", "fever", "infection",
  "vomiting", "severe nausea",
  "suicidal", "self harm",
  "postnatal depression", "postpartum depression",
];

const ALL_SAFETY_KEYWORDS = [...new Set([...GLOSSARY_KEYWORDS, ...EXTRA_SAFETY_KEYWORDS])];

// ── SYSTEM INSTRUCTION ────────────────────────────────────────────────────
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

// ── GROQ ──────────────────────────────────────────────────────────────────
async function tryGroq(
  contents: { role: string; parts: { text: string }[] }[],
  systemInstruction: string
): Promise<string> {
  const groqKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!groqKey) throw new Error('No Groq API key');

  const groq = new Groq({ apiKey: groqKey, dangerouslyAllowBrowser: true });

  const messages = [
    { role: 'system' as const, content: systemInstruction },
    ...contents.map(c => ({
      role: c.role === 'model' ? 'assistant' as const : 'user' as const,
      content: c.parts[0].text,
    })),
  ];

  const completion = await groq.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    messages,
    temperature: 0.1,
    max_tokens: 400,
  });

  const text = completion.choices[0]?.message?.content;
  if (!text) throw new Error('Groq returned empty response');
  return text;
}

// ── GEMINI ────────────────────────────────────────────────────────────────
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

// ── EXPLAIN MEDICAL TERM (exported for ChatInterface Not Sure flow) ────────
export async function explainMedicalTerm(
  term: string,
  definition: string,
  source: string,
  userName: string = ''
): Promise<string> {
  const prompt = `The user selected "Not sure" when asked about "${term}" in a pregnancy health screening.

  Definition from ${source}: "${definition}"

  Please explain what "${term}" means in 1-2 warm, friendly sentences using ONLY this definition.
  Use plain English — like a knowledgeable friend explaining something.
  ${userName ? `Address the user as ${userName}.` : ''}
  Do NOT add medical advice. Do NOT suggest treatments. Keep it under 3 sentences total.
  At the end of your explanation, always add: (Source: ${source})`;

    const systemInstruction = `You are Nancy, a warm friendly assistant from the Active Pregnancy Foundation. 
  Explain medical terms in plain English using only the definition provided. Keep responses short and warm.`;

    const contents = [{ role: 'user', parts: [{ text: prompt }] }];

  try {
    return await tryGroq(contents, systemInstruction);
  } catch {
    try {
      const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || '' });
      return await tryGeminiModel(ai, 'gemini-2.5-flash', contents, systemInstruction);
    } catch {
      // Fallback — return raw definition
      return `No worries! **${term}** means: ${definition} _(Source: ${source})_`;
    }
  }
}

// ── MAIN EXPORT ───────────────────────────────────────────────────────────
export const getGeminiResponse = async (
  history: ChatMessage[],
  userName: string = '',
  category: UserCategory = null
): Promise<string> => {

  const lastUserMessage = [...history].reverse().find(m => m.role === 'user');
  if (!lastUserMessage) return "Please ask a question.";

  const userText = lastUserMessage.text.toLowerCase();

  // ── SAFETY KEYWORD CHECK ──────────────────────────────────────────────
  const matchedKeyword = ALL_SAFETY_KEYWORDS.find(kw => userText.includes(kw));

  if (matchedKeyword) {
    await logUnknownQuestion(lastUserMessage.text, category ?? 'unknown', userName ?? 'unknown');

    const glossaryEntry = findMedicalTerm(userText);

    if (glossaryEntry) {
      console.log(`📖 Found glossary term: "${glossaryEntry.term}" (${glossaryEntry.source})`);
      const explainPrompt = `The user ${userName ? `(${userName}) ` : ''}mentioned the medical term: "${glossaryEntry.term}"

Definition from ${glossaryEntry.source}: "${glossaryEntry.definition}"

Using ONLY this definition, please:
1. Explain what "${glossaryEntry.term}" means in 1-2 warm, plain English sentences
2. Advise them to speak to their GP or midwife before any physical activity
3. If it sounds urgent or serious, mention NHS 111 as well`;

      const systemInstruction = `You are Nancy, a warm friendly assistant from the Active Pregnancy Foundation.
Explain medical terms in plain English using only the definition provided. Keep responses short, warm and supportive.`;

      try {
        const contents = [{ role: 'user', parts: [{ text: explainPrompt }] }];
        return await tryGroq(contents, systemInstruction);
      } catch {
        try {
          const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || '' });
          const contents = [{ role: 'user', parts: [{ text: explainPrompt }] }];
          return await tryGeminiModel(ai, 'gemini-2.5-flash', contents, systemInstruction);
        } catch {
          return `⚠️ Just so you know — "${glossaryEntry.term}" means: ${glossaryEntry.definition} (Source: ${glossaryEntry.source})\n\nPlease speak to your GP or midwife before doing any physical activity. If you need urgent help, call NHS 111. 💜`;
        }
      }
    }

    return `⚠️ ${userName ? userName + ', t' : 'T'}hat's really important to get checked out properly. I'm not able to give personal medical advice on that, but please speak to your GP or midwife — they'll give you the right guidance for your situation. If you need urgent help, call NHS 111. Take care of yourself! 💜`;
  }

  // ── RAG CONTEXT ───────────────────────────────────────────────────────
  const contexts = await retrieveContext(lastUserMessage.text, 5);
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

  // ── 1. GROQ FIRST ────────────────────────────────────────────────────
  try {
    console.log('Trying Groq: llama-3.1-8b-instant');
    const text = await tryGroq(contents, systemInstruction);
    console.log('✅ Groq succeeded');
    return text;
  } catch (err) {
    console.warn('Groq failed → trying Gemini:', err);
  }

  // ── 2. GEMINI FALLBACK ────────────────────────────────────────────────
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
