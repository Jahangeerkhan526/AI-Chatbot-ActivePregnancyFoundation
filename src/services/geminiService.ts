
import { GoogleGenAI } from "@google/genai";
import { APF_DATASET } from "../constants/apfData";

const DATASET_STRING = JSON.stringify(APF_DATASET, null, 2);

const SYSTEM_INSTRUCTION = `
You are the "APF Safety Assistant," a dedicated helper for the Active Pregnancy Foundation. 
Your goal is to accurately answer queries about physical activity during pregnancy using ONLY the provided APF Dataset, which includes the full GAQ-P (Get Active Questionnaire for Pregnancy).

CORE GUIDELINES:
1. DATA FIDELITY: Only use information from the dataset provided below. Do not provide medical advice not present in this data.
2. GAQ-P SCREENING: You have access to the 13 core screening questions (GAQP-01-A through M). If a user asks about screening, you can list these requirements.
3. CITATIONS: When you answer, mention which part of the data you are referring to if possible (e.g., "Based on the GAQ-P screening question regarding...").
4. SAFETY FIRST: If a user mentions red flag symptoms like dizziness, chest pain, contractions, bleeding, or leakage, immediately prioritize the "SAFETY-STOP" record instructions.
5. UNKNOWN QUERIES: If the dataset does not contain an answer, politely say: "I'm sorry, but my current records don't contain information on that. Please consult a healthcare professional for specific medical advice."
6. TONE: Professional, supportive, and clear.

DATASET:
${DATASET_STRING}
`;

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export const getGeminiResponse = async (history: ChatMessage[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.VITE_GEMINI_API_KEY || '' });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: history.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      })),
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.2, // Low temperature for high accuracy
      },
    });

    return response.text || "I'm having trouble retrieving that information right now. Please try again.";
  } catch (error) {
    console.error("Gemini Assistant Error:", error);
    return "I encountered a technical error. Please check your connection and try again.";
  }
};
