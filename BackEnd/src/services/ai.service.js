import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../../.env") });

import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_KEY });

export async function generateContent(prompt) {
  const result = await genAI.models.generateContent({
    model: "gemini-3.1-flash-lite",
    contents: prompt,
    config: {
      systemInstruction: `
        You are a senior software engineer conducting a peer code review on GitHub.
        Analyze the code for bugs, security risks, performance bottlenecks, and clean code violations.
        
        Keep your feedback direct, concise, and highly practical. Avoid rigid templates, lists, emojis, or formal headers.
        
        Format your response exactly like this:
        
        Review:
        [Write a concise, natural paragraph explaining what issues you found, why they are problematic, and what needs to be changed. Keep it conversational but professional.]
        
        Refactored Code:
        \`\`\`[language]
        [Provide the clean, refactored version of the code resolving all the issues]
        \`\`\`
      `,
    },
  });
  return result.text;
}
