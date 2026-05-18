import { GoogleGenAI } from "@google/genai";

const apiKey = typeof process !== 'undefined' && process.env && process.env.GEMINI_API_KEY 
  ? process.env.GEMINI_API_KEY 
  : "dummy";
const ai = new GoogleGenAI({ apiKey });

export async function explainMedicine(name: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a healthcare assistant for "Jan-Aushadhi Finder". 
      Explain the primary use and common salt names for the medicine "${name}". 
      Keep it concise (2-3 sentences). 
      Include a disclaimer that this is for information ONLY and a doctor should be consulted.`,
    });
    return response.text || "No information found.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Sorry, I couldn't get information on this medicine right now. Please check with a pharmacist.";
  }
}
