
import { GoogleGenAI } from "@google/genai";
import { APF_DATASET } from "../constants/apfData";

const DATASET_JSON = JSON.stringify(APF_DATASET, null, 2);

/**
 * INFERENCE ENGINE CONFIGURATION
 * Task: Extractive Question Answering
 * Model Architecture: Simulated BERT/RoBERTa
 */
const SYSTEM_INSTRUCTION = `
TASK: extractive-question-answering
MODEL_ID: apf-safety-roberta-v1

You are a specialized Question Answering Inference API. 
You are NOT a generative AI or a chatbot. 

INSTRUCTIONS:
1. Input: A question about physical activity during pregnancy.
2. Context: The APF_DATASET provided below.
3. Behavior: Extract the exact sentence or phrase from the context that answers the question.
4. Output: Return a JSON object ONLY. Do not include any conversational text.

JSON SCHEMA:
{
  "answer": "The string extracted from the dataset",
  "score": 0.985,
  "id": "RECORD_ID_FROM_DATASET",
  "source": "GAQ-P Page Reference"
}

If no relevant data is found, return:
{
  "answer": "NO_MATCH_FOUND",
  "score": 0.0,
  "id": null,
  "source": null
}

DATASET_CONTEXT:
${DATASET_JSON}
`;

export const runInference = async (query: string, params: { temperature: number }) => {
  const ai = new GoogleGenAI({ apiKey: process.env.VITE_GEMINI_API_KEY || '' });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ role: 'user', parts: [{ text: query }] }],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: params.temperature,
        responseMimeType: "application/json"
      },
    });

    const resultText = response.text || '{"error": "Empty response"}';
    return JSON.parse(resultText);
  } catch (error) {
    console.error("Inference Error:", error);
    return { error: "Model Inference Failed", status: 500 };
  }
};
