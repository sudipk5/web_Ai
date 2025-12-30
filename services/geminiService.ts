
import { GoogleGenAI, Type } from "@google/genai";
import { ProjectAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Refines a user idea into a detailed technical prompt for website generation.
 * Acts as the "ChatGPT" layer of the application.
 */
export const refinePromptWithAI = async (userIdea: string): Promise<string> => {
  const systemPrompt = `You are a high-end UI/UX consultant and prompt engineer. 
Take the user's short idea for a website and expand it into a rich, detailed, professional technical prompt.
Describe specific sections (Hero, Features, Pricing, Footer), color palettes, typography, and interactive behaviors.
Focus on modern web aesthetics (Glassmorphism, Bento grids, sleek animations).
Return only the refined descriptive prompt.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview", // Use flash for fast reasoning
      contents: `User Idea: ${userIdea}`,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.8,
      }
    });

    return response.text || userIdea;
  } catch (error) {
    console.error("Prompt refinement failed:", error);
    return userIdea;
  }
};

export const generateWebsite = async (detailedPrompt: string): Promise<{ html: string, name: string }> => {
  const systemPrompt = `You are a master frontend developer. 
Generate a complete, high-quality, modern, and responsive single-file website (HTML/CSS/JS) based on the detailed description provided.
Use Tailwind CSS (via CDN) for styling and Lucide Icons or similar if needed.
Ensure the design is professional, mobile-friendly, and has a premium feel.
Return only the HTML code and a short, catchy name for the project.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Detailed Description: ${detailedPrompt}`,
      config: {
        systemInstruction: systemPrompt,
        thinkingConfig: { thinkingBudget: 4096 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            html: { type: Type.STRING, description: "The full HTML code of the website" },
            name: { type: Type.STRING, description: "A catchy 1-2 word name for the site" }
          },
          required: ["html", "name"]
        }
      }
    });

    const json = JSON.parse(response.text || "{}");
    return json;
  } catch (error) {
    console.error("Website generation failed:", error);
    return {
      html: "<html><body class='bg-gray-900 text-white flex items-center justify-center h-screen'><h1>Generation Failed</h1></body></html>",
      name: "Fallback Project"
    };
  }
};

export const analyzeProjectFiles = async (files: string[]): Promise<ProjectAnalysis> => {
  const fileList = files.join('\n');
  const prompt = `You are a world-class DevOps engineer and AI Build Agent. 
Analyze the following file structure and determine how to build and deploy it:

FILES:
${fileList}

TASK:
1. Identify framework.
2. Provide build commands.
3. Predict output directory.
4. Summarize project.
5. GENERATE A FALLBACK PREVIEW: If the project is complex (React/Vite/Next), write a high-quality single-file HTML/CSS/JS "Coming Soon" or "Project Dashboard" splash page that accurately reflects what the uploaded project name/summary suggests. 

Return the result strictly in JSON format.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 4096 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            framework: { type: Type.STRING },
            confidence: { type: Type.NUMBER },
            buildCommands: { type: Type.ARRAY, items: { type: Type.STRING } },
            suggestedDistDir: { type: Type.STRING },
            summary: { type: Type.STRING },
            generatedPreview: { type: Type.STRING, description: "Full HTML content for a preview splash page" }
          },
          required: ["framework", "confidence", "buildCommands", "suggestedDistDir", "summary", "generatedPreview"]
        }
      }
    });

    const jsonStr = response.text || "{}";
    return JSON.parse(jsonStr) as ProjectAnalysis;
  } catch (error) {
    console.error("Gemini analysis failed:", error);
    return {
      framework: "Static / Unknown",
      confidence: 0.1,
      buildCommands: ["npm install", "npm run build"],
      suggestedDistDir: "dist",
      summary: "Generic web project.",
      generatedPreview: "<html><body><h1>Deployment Live</h1><p>Your site is ready.</p></body></html>"
    };
  }
};
