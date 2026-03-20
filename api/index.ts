import dotenv from "dotenv";
dotenv.config({ override: true });
import express from "express";
import { GoogleGenAI, Type } from "@google/genai";

const app = express();

app.use(express.json());

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
    } else if (action === 'debug') {
      prompt = `You are an expert software engineer and debugger.
Find and fix bugs in the following ${language} code.
Explain the root cause of the bugs and how you fixed them.

Code to debug:
\`\`\`${language}
${code}
\`\`\`
`;
    } else if (action === 'document') {
      prompt = `You are an expert software engineer and technical writer.
Add comprehensive documentation (JSDoc, docstrings, or equivalent) to the following ${language} code.
Explain the parameters, return types, and purpose of functions/classes.

Code to document:
\`\`\`${language}
${code}
\`\`\`
`;
    } else if (action === 'security') {
      prompt = `You are an expert security researcher and software engineer.
Perform a comprehensive security audit on the following ${language} code.
Identify vulnerabilities (e.g., injection, XSS, memory leaks, race conditions, logic flaws) and provide secure remediation.

Code to audit:
\`\`\`${language}
${code}
\`\`\`
`;
    } else if (action === 'refactor') {
      prompt = `You are an expert software architect and clean code advocate.
Refactor the following ${language} code to improve its structure, readability, and maintainability.
Apply appropriate design patterns, SOLID principles, and better naming conventions without changing the external behavior.

Code to refactor:
\`\`\`${language}
${code}
\`\`\`
`;
    } else if (action === 'review') {
      prompt = `You are an expert Senior Software Engineer.
Perform a thorough code review on the following ${language} code.
Provide actionable feedback, point out anti-patterns, suggest improvements, and highlight what was done well.

Code to review:
\`\`\`${language}
${code}
\`\`\`
`;
    } else if (action === 'modernize') {
      prompt = `You are an expert Software Engineer.
Update the following ${language} code to use the latest language features, idioms, and best practices.
Replace deprecated APIs, use modern syntax (e.g., ES6+ for JS, Java 17+ features, modern C++), and explain the changes made.

Code to modernize:
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
      model: "gemini-2.5-flash-lite",
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

export default app;
