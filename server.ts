import dotenv from "dotenv";
dotenv.config({ override: true });
import express from "express";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import path from "path";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes FIRST
  app.post("/api/optimize", async (req, res) => {
    try {
      const { code, language, action = 'optimize' } = req.body;

      if (!code || !language) {
        return res.status(400).json({ error: "Code and language are required" });
      }

      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "GEMINI_API_KEY is missing. Please configure it in the AI Studio Secrets panel." });
      }

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

      let prompt = "";
      if (action === 'explain') {
        prompt = `You are an expert software engineer.
Explain the following ${language} code step-by-step.
Focus on what the code does, its logic, and any potential edge cases.

Code to explain:
\`\`\`${language}
${code}
\`\`\`
`;
      } else if (action === 'tests') {
        prompt = `You are an expert software engineer in testing.
Write comprehensive unit tests for the following ${language} code.
Include edge cases, typical use cases, and handle potential errors.

Code to test:
\`\`\`${language}
${code}
\`\`\`
`;
      } else {
        prompt = `You are an expert competitive programmer and software engineer.
Optimize the following ${language} code.
Focus on improving time complexity, space efficiency, readability, and removing redundant operations.
Strictly preserve the original logic and output of the program.
Only use basic standard libraries required for normal problem solving. Do not introduce heavy frameworks or external dependencies.

Code to optimize:
\`\`\`${language}
${code}
\`\`\`
`;
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              optimizedCode: {
                type: Type.STRING,
                description: "The resulting code (optimized code, generated tests, or the original code with comments if explaining).",
              },
              improvements: {
                type: Type.ARRAY,
                items: {
                  type: Type.STRING,
                },
                description: "A list of specific improvements made, key points explained, or test cases covered.",
              },
              complexityAnalysis: {
                type: Type.STRING,
                description: "A short analysis of the time and space complexity, or a general summary of the explanation/tests.",
              },
            },
            required: ["optimizedCode", "improvements", "complexityAnalysis"],
          },
        },
      });

      const resultText = response.text;
      if (!resultText) {
        throw new Error("Failed to generate optimized code");
      }

      const result = JSON.parse(resultText);
      res.json(result);
    } catch (error: any) {
      console.error("Optimization error:", error);
      let errorMessage = "Failed to optimize code";
      
      if (error?.message) {
        try {
          const parsed = JSON.parse(error.message);
          if (parsed?.error?.message) {
            errorMessage = parsed.error.message;
          } else {
            errorMessage = error.message;
          }
        } catch (e) {
          errorMessage = error.message;
        }
      }
      
      res.status(500).json({ error: errorMessage });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
