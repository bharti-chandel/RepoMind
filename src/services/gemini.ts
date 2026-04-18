import { GoogleGenAI, Modality, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

// ... existing functions ...

export async function generateAudio(text: string) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' },
        },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  return base64Audio;
}

export async function chatWithCodebase(repoName: string, files: any[], history: any[], userMessage: string) {
  // We'll send a summary of the codebase or relevant files
  // For now, let's assume we send the file structure and some key file contents
  const systemInstruction = `You are RepoMind, an AI expert on the codebase of the repository: ${repoName}. 
  You have access to the repository's file structure and contents. 
  Answer the user's questions accurately based on the provided code.
  If you don't know the answer, say so.
  
  Codebase Structure:
  ${files.map(f => f.path).join('\n')}
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      ...history.map(m => ({ role: m.role, parts: [{ text: m.text }] })),
      { role: 'user', parts: [{ text: userMessage }] }
    ],
    config: {
      systemInstruction,
    }
  });

  return response.text;
}

export async function generateRepoReport(repoName: string, files: any[]) {
  const prompt = `Generate a comprehensive repository report for ${repoName}. 
  Include:
  1. Project Overview
  2. Key Components & Architecture
  3. Getting Started Guide
  4. Technology Stack
  
  File Structure:
  ${files.map(f => f.path).join('\n')}
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
  });

  return response.text;
}

export async function generateAudioOverview(repoName: string, files: any[]) {
  // This would typically involve TTS, but we'll generate the script first
  const prompt = `Create a podcast-style script explaining the repository ${repoName} to a new developer. 
  Make it engaging and clear.
  
  File Structure:
  ${files.map(f => f.path).join('\n')}
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
  });

  return response.text;
}

export async function generateCodeEvolution(repoName: string, files: any[]) {
  const prompt = `Analyze the repository ${repoName} and describe its logical evolution or architectural layers. 
  Imagine how this codebase grew from a simple idea to its current state.
  Break it down into 4-5 key "Evolutionary Milestones".
  
  File Structure:
  ${files.map(f => f.path).join('\n')}
  
  Return the response as a JSON array of objects:
  [{ "milestone": "Title", "description": "What happened", "impact": "Architectural impact" }]
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
    }
  });

  try {
    return JSON.parse(response.text);
  } catch (e) {
    return [];
  }
}

export async function generateGuidedTour(repoName: string, files: any[]) {
  const prompt = `Create an interactive guided tour of the repository ${repoName}. 
  Identify 5-7 key files or modules and explain their role in the system.
  For each step, provide a "focus" file path and a clear explanation.
  
  File Structure:
  ${files.map(f => f.path).join('\n')}
  
  Return the response as a JSON array of objects:
  [{ "step": 1, "title": "Title", "filePath": "path/to/file", "explanation": "Why this is important" }]
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
    }
  });

  try {
    return JSON.parse(response.text);
  } catch (e) {
    return [];
  }
}

export async function generateArchitecturalBlueprint(repoName: string, files: any[]) {
  const prompt = `Analyze the repository ${repoName} and create a high-level architectural blueprint.
  Identify the core modules, their responsibilities, and how they interact.
  
  File Structure:
  ${files.map(f => f.path).join('\n')}
  
  Return the response as a JSON object:
  {
    "architectureType": "e.g. MVC, Microservices, Layered",
    "modules": [{ "name": "Module Name", "purpose": "Description", "keyFiles": ["path1", "path2"] }],
    "dataFlow": "Description of how data moves through the system"
  }
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
    }
  });

  try {
    return JSON.parse(response.text);
  } catch (e) {
    return null;
  }
}

export async function generateOnboardingPath(repoName: string, files: any[]) {
  const prompt = `Create a 7-day onboarding path for a new developer joining the ${repoName} project.
  Each day should have a specific focus, tasks, and recommended files to study.
  
  File Structure:
  ${files.map(f => f.path).join('\n')}
  
  Return the response as a JSON array of objects:
  [{ "day": 1, "focus": "Topic", "tasks": ["Task 1", "Task 2"], "filesToStudy": ["path1", "path2"] }]
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
    }
  });

  try {
    return JSON.parse(response.text);
  } catch (e) {
    return [];
  }
}
