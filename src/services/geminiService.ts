/// <reference types="vite/client" />
// src/services/geminiService.ts
import { GoogleGenAI } from "@google/genai";
import Groq from 'groq-sdk';
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

const MIN_RAG_SCORE = 4;

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

// ── GROQ ──────────────────────────────────────────────────────────────────────
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
    max_tokens: 800,
  });

  const text = completion.choices[0]?.message?.content;
  if (!text) throw new Error('Groq returned empty response');
  return text;
}

// ── GEMINI ────────────────────────────────────────────────────────────────────
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

// ── MAIN ──────────────────────────────────────────────────────────────────────
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
    // Chest & heart
    "chest pain", "chest tightness", "chest pressure", "chest discomfort",
    "heart pain", "heart racing", "heart pounding", "palpitations",
    "heart condition", "heart disease", "cardiac",

    // Breathing
    "shortness of breath", "cant breathe", "can't breathe",
    "breathing difficulty", "breathless", "out of breath",

    // Bleeding & fluids
    "bleeding", "vaginal bleeding", "spotting", "blood loss",
    "amniotic fluid", "waters broke", "waters breaking", "leaking fluid",

    // Dizziness & head
    "dizziness", "dizzy", "faint", "fainting", "lightheaded", "light headed",
    "blurred vision", "blurry vision", "seeing spots",
    "severe headache", "headache", "migraine",

    // Pain
    "severe pain", "abdominal pain", "stomach pain", "tummy pain",
    "pelvic pain", "pelvic pressure", "lower back pain", "back pain",
    "hip pain", "groin pain", "rib pain", "pubic pain",
    "round ligament pain", "spd pain",

    // Baby movement
    "baby not moving", "no movement", "reduced movement", "less movement",
    "baby moving less", "cant feel baby", "can't feel baby",

    // Blood pressure
    "high blood pressure", "high bp", "low blood pressure", "low bp",
    "blood pressure", "hypertension", "hypotension",
    "preeclampsia", "eclampsia",
    "swollen face", "swollen hands", "swollen feet",
    "swelling face", "swelling hands", "swelling feet",

    // Conditions
    "gestational diabetes", "diabetes", "epilepsy", "seizure",
    "blood clot", "dvt", "cancer", "tumour", "tumor",
    "thyroid", "kidney disease", "kidney pain",
    "anaemia", "anemia", "iron deficiency",

    // Pregnancy complications
    "placenta previa", "placenta praevia", "low placenta",
    "incompetent cervix", "weak cervix", "cerclage", "cervical stitch",
    "premature labour", "premature labor", "preterm", "early labour",
    "contractions", "labour", "labor", "waters",

    // History
    "miscarriage", "ectopic", "stillbirth", "pregnancy loss",

    // Injury & illness
    "fell", "fall", "fallen", "accident", "injured", "injury",
    "fracture", "broken bone", "fever", "infection", "temperature",
    "vomiting", "hyperemesis", "severe nausea",

    // Mental health
    "suicidal", "self harm", "postnatal depression", "postpartum depression",
  ];

  if (SAFETY_KEYWORDS.some(kw => userText.includes(kw))) {
    await logUnknownQuestion(lastUserMessage.text, category ?? 'unknown', userName ?? 'unknown');
    return `⚠️ ${userName ? userName + ', t' : 'T'}hat's really important to get checked out properly. I'm not able to give personal medical advice on that, but please speak to your GP or midwife — they'll give you the right guidance for your situation. If you need urgent help, call NHS 111. Take care of yourself! 💜`;
  }

  // ── RAG CONTEXT ───────────────────────────────────────────────────────────
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

  // ── 1. GROQ FIRST (no daily limits) ──────────────────────────────────────
  try {
    console.log('Trying Groq: llama-3.1-8b-instant');
    const text = await tryGroq(contents, systemInstruction);
    console.log('✅ Groq succeeded');
    return text;
  } catch (err) {
    console.warn('Groq failed → trying Gemini:', err);
  }

  // ── 2. GEMINI FALLBACK ────────────────────────────────────────────────────
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

  // ── 3. ALL FAILED ─────────────────────────────────────────────────────────
  console.error('All models failed:\n' + errors.join('\n'));
  return "I'm having trouble connecting right now. Please try again in a moment, or contact the APF team directly if the problem persists.";
};
