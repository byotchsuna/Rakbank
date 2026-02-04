import { GoogleGenAI } from "@google/genai";
import { UserProfile } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async getRakAssistantResponse(query: string, user: UserProfile) {
    const systemInstruction = `
      You are the RAKBANK Digital Assistant. 
      Your goal is to provide helpful, secure, and accurate banking information to RAKBANK customers.
      
      User Context:
      - Name: ${user.name}
      - Account Balance: ${user.balance.toLocaleString()} AED
      - Credit Score: ${user.creditScore}
      - Status: Elite Client
      
      Guidelines:
      1. Tone: Professional, friendly, and efficient (RAKBANK's "Simply Better" philosophy).
      2. Currency: Use AED for all financial references.
      3. Products: Reference RAKBANK products like RAKrewards, Red Account, and Titanium Cards.
      4. Security: Never ask for passwords or OTPs.
      5. Conciseness: Provide clear, short answers.
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: query,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });
      
      return response.text || "I apologize, I'm having trouble connecting to my systems. Please try again shortly.";
    } catch (error) {
      console.error("RAKBANK Assistant Error:", error);
      return "I'm sorry, I encountered an error. Please try again later.";
    }
  }
}

export const geminiService = new GeminiService();