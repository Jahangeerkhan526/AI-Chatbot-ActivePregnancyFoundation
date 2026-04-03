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

// ── SYSTEM PROMPT ──────────────────────────────────────────────────────────
// Nancy is warm, friendly, and personal — but still clinically safe.
// The category context is injected at call-time so the same function
// powers all user types while staying appropriately focused.

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
2. If the context does not contain enough information to answer, say EXACTLY:
   "I don't have specific information on that in my database. Please consult your healthcare provider."
   (This exact phrase is used to detect and log unanswered questions — do not paraphrase it.)
3. Do NOT use any outside knowledge. Do NOT make things up.
4. Always recommend consulting a GP or midwife for personal medical decisions.
5. If a user reports a YES to any screening question, clearly advise them to speak to their GP or midwife before resuming physical activity.
6. Cite your source at the end of each answer in parentheses, e.g. (Source: APF General FAQs).
7. Never diagnose conditions or prescribe specific treatments.
`.trim();
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

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: augmentedHistory.map(m => ({
        role: m.role,
        parts: [{ text: m.text }],
      })),
      config: {
        systemInstruction: buildSystemInstruction(userName, category),
        temperature: 0.2,
      },
    });

    return response.text || "I'm having trouble retrieving that information right now. Please try again.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I encountered a technical error. Please check your connection and try again.";
  }
};