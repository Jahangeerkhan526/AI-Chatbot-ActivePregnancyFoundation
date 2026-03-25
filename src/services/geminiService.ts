/// <reference types="vite/client" />
import { GoogleGenAI } from "@google/genai";
import { retrieveContext } from "./ragService";

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

const SYSTEM_INSTRUCTION = `
You are the APF Safety Assistant — a specialized assistant for pre-activity screening 
and physical activity safety during pregnancy.

STRICT RULES:
1. You ONLY answer using the CONTEXT provided below each question. 
2. If the context does not contain enough information to answer, say: 
   "I don't have specific information on that in my database. Please consult your healthcare provider."
3. Do NOT use any outside knowledge. Do NOT make things up.
4. Be clear, concise, and clinically accurate.
5. Always recommend consulting a healthcare provider for personal medical decisions.
6. Cite your source at the end of each answer in parentheses, e.g. (Source: GAQ-P Guidelines Document).
`;

export const getGeminiResponse = async (history: ChatMessage[]): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || '' });
  const lastUserMessage = [...history].reverse().find(m => m.role === 'user');
  if (!lastUserMessage) return "Please ask a question.";
  const contexts = await retrieveContext(lastUserMessage.text, 5);
  
  const contextBlock = contexts
    .map((c, i) => `[${i + 1}] (${c.sourceLabel})\n${c.text}`)
    .join('\n\n');
  const augmentedHistory = history.map((m, idx) => {
    if (idx === history.length - 1 && m.role === 'user') {
      return {
        ...m,
        text: `CONTEXT FROM DATABASE:\n${contextBlock}\n\nUSER QUESTION: ${m.text}`
      };
    }
    return m;
  });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: augmentedHistory.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      })),
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.1,
      },
    });

    return response.text || "I'm having trouble retrieving that information right now. Please try again.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I encountered a technical error. Please check your connection and try again.";
  }
};
