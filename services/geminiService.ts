
import { GoogleGenAI, Type } from "@google/genai";
import { AppState } from "../types";

/* Initializing with process.env.GEMINI_API_KEY directly as per guidelines */
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const getProcurementInsights = async (state: AppState) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze this procurement data and provide 3 key insights or recommendations:
        Suppliers: ${JSON.stringify(state.suppliers)}
        POs: ${JSON.stringify(state.purchaseOrders)}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              priority: { type: Type.STRING, enum: ["High", "Medium", "Low"] }
            },
            required: ["title", "description", "priority"]
          }
        }
      }
    });
    
    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Gemini Insight Error:", error);
    return [];
  }
};
