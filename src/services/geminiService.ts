/// <reference types="vite/client" />
// src/services/geminiService.ts
import { GoogleGenAI } from "@google/genai";
import { retrieveContext } from "./ragService";

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

const MODEL_CHAIN = [
  'gemini-2.5-flash-lite',  
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-1.5-flash',
  'gemma-3-27b-it',         
  'gemma-3-12b-it',     
  'gemma-3-4b-it', 
];

function buildSystemInstruction(
  userName: string,
  category: UserCategory
): string {
  const categoryContext: Record<NonNullable<UserCategory>, string> = {
    preconception:
      "This user is thinking of becoming pregnant. Focus on preconception physical activity guidance from the APF preconception resources (https://www.activepregnancyfoundation.org/preconception). Help them understand how staying active before pregnancy benefits both them and their future baby.",
    pregnant:
      "This user is currently pregnant. Focus on safe physical activity during pregnancy. The user has already completed the pregnancy pre-screening questions. Do not repeat the screening. Answer their specific questions using APF resources.",
    postnatal:
      "This user has recently had a baby. Focus on safe return to physical activity after childbirth. The user has already completed the postnatal pre-screening questions. Do not repeat the screening. Use APF postnatal resources and POGP guidance.",
    professional:
      "This user is a healthcare or fitness professional supporting someone who is pregnant or postnatal. They may ask clinical questions. Point them to the This Mum Moves educational programme (https://www.activepregnancyfoundation.org/thismummoves) where appropriate. Be more technically detailed in your answers.",
    supporter:
      "This user is a partner, parent, or friend supporting someone who is pregnant or postnatal. Help them understand how to encourage and support physical activity safely. Keep answers warm, practical, and non-clinical.",
    other:
      "This user has described a situation that doesn't fit the standard categories. Do your best with available APF resources. Be especially careful to stay within your knowledge base and recommend professional advice when in doubt.",
  };
 
  const contextLine = category
    ? categoryContext[category]
    : "The user's situation is not yet known. Answer general APF questions only.";
 
  return `
You are Nancy — a warm, friendly, and knowledgeable assistant from the Active Pregnancy Foundation (APF).
You support women and their families with safe, personalised guidance on physical activity before, during, and after pregnancy.
 
USER CONTEXT:
- Name: ${userName || 'the user'}
- Situation: ${contextLine}
 
YOUR PERSONALITY:
- Speak like a knowledgeable, supportive friend — warm, encouraging, and clear.
- Use the user's first name occasionally to keep things personal.
- Avoid cold or clinical language. Replace medical jargon with plain English where possible.
- Use gentle emoji occasionally (💛 ✨ 😊) but don't overdo it.
- Keep answers concise and scannable — use short paragraphs, not walls of text.
 
STRICT RULES:
1. ONLY answer using the CONTEXT provided below each question.
2. CRITICAL: If the context does not contain enough information to answer the question fully,
   you MUST respond with this sentence word-for-word as your ENTIRE response (do not add anything before or after it):
   "I don't have specific information on that in my database. Please consult your healthcare provider."
   Do NOT paraphrase it. Do NOT say "I don't have specific information about X" — use the exact phrase above.
3. Do NOT use any outside knowledge. Do NOT make things up.
4. Always recommend consulting a GP or midwife for personal medical decisions.
5. If a user reports a YES to any screening question, clearly advise them to speak to their GP or midwife before resuming physical activity.
6. Cite your source at the end of each answer in parentheses, e.g. (Source: APF General FAQs).
7. Never diagnose conditions or prescribe specific treatments.
`.trim();
}
 
// ── TRY A SINGLE MODEL ─────────────────────────────────────────────────────
async function tryModel(
  ai: GoogleGenAI,
  model: string,
  contents: { role: string; parts: { text: string }[] }[],
  systemInstruction: string
): Promise<string> {
  const response = await ai.models.generateContent({
    model,
    contents,
    config: {
      systemInstruction,
      temperature: 0.2,
    },
  });
 
  const text = response.text;
  if (!text) throw new Error(`${model} returned empty response`);
  return text;
}
 
// ── MAIN EXPORT ────────────────────────────────────────────────────────────
export const getGeminiResponse = async (
  history: ChatMessage[],
  userName: string = '',
  category: UserCategory = null
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || '' });
 
  const lastUserMessage = [...history].reverse().find(m => m.role === 'user');
  if (!lastUserMessage) return "Please ask a question.";
 
// ── SAFETY KEYWORD FILTER ─────────────────────────────────────────────────
const SAFETY_KEYWORDS = [
  "chest pain", "chest tightness", "heart pain", "palpitations",
  "shortness of breath", "bleeding", "vaginal bleeding",
  "amniotic fluid", "waters broke", "dizziness", "dizzy", "faint",
  "fainting", "lightheaded", "severe pain", "abdominal pain", "pelvic pain",
  "baby not moving", "no movement", "reduced movement",
  "blurred vision", "severe headache", "high blood pressure", "high bp","low bp","low blood pressure",
  "hypertension", "preeclampsia", "gestational diabetes", "diabetes",
  "epilepsy", "seizure", "heart condition", "heart disease", "cardiac",
  "blood clot", "cancer", "tumour", "tumor", "thyroid", "kidney disease",
  "placenta previa", "incompetent cervix", "cerclage", "premature labour",
  "preterm", "miscarriage", "ectopic", "fell", "fall", "accident",
  "injured", "fever", "contractions", "labour", "labor",
  "swollen face", "swollen hands"
];

const hasSafetyKeyword = SAFETY_KEYWORDS.some(kw =>
  lastUserMessage.text.toLowerCase().includes(kw)
);

if (hasSafetyKeyword) {
  return `⚠️ ${userName ? userName + ', t' : 'T'}hat sounds like something to discuss directly with your GP or midwife — please don't rely on me for personal medical advice. If it's urgent please call NHS 111. 💜`;
}

const contexts = await retrieveContext(lastUserMessage.text, 5); 
  const contextBlock = contexts.length > 0
    ? contexts.map((c, i) => `[${i + 1}] (${c.sourceLabel})\n${c.text}`).join('\n\n')
    : 'No relevant context found in the APF database.';
 
  const augmentedHistory = history.map((m, idx) => {
    if (idx === history.length - 1 && m.role === 'user') {
      return {
        ...m,
        text: `CONTEXT FROM APF DATABASE:\n${contextBlock}\n\nUSER QUESTION: ${m.text}`,
      };
    }
    return m;
  });
 
  const contents = augmentedHistory.map(m => ({
    role: m.role,
    parts: [{ text: m.text }],
  }));
 
  const systemInstruction = buildSystemInstruction(userName, category);
 
  // ── FALLBACK CHAIN ───────────────────────────────────────────────────────
  // Try each model in order. Move to the next if one fails.
  const errors: string[] = [];
 
  for (const model of MODEL_CHAIN) {
    try {
      console.log(`Trying model: ${model}`);
      const text = await tryModel(ai, model, contents, systemInstruction);
      // Log which model was actually used if it wasn't the first choice
      if (model !== MODEL_CHAIN[0]) {
        console.warn(`Fell back to model: ${model}`);
      }
      return text;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      errors.push(`${model}: ${message}`);
      console.warn(`Model ${model} failed — ${message}`);
      // Continue to next model
    }
  }
 
  // All models failed
  console.error('All models failed:\n' + errors.join('\n'));
  return "I'm having trouble connecting right now. Please try again in a moment, or contact the APF team directly if the problem persists.";
};