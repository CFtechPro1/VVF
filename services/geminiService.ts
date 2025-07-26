import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { ScriptData } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: "A catchy, SEO-friendly title for a vertical video (YouTube Short/TikTok). Max 70 characters.",
    },
    description: {
      type: Type.STRING,
      description: "A short, engaging description for the video, including a call to action.",
    },
    hashtags: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "An array of 5-7 relevant hashtags, including #shorts.",
    },
    script: {
      type: Type.OBJECT,
      properties: {
        hook: {
          type: Type.STRING,
          description: "A 3-5 second hook to grab the viewer's attention immediately."
        },
        body: {
          type: Type.STRING,
          description: "The main content of the script, delivering surprising or emotional information. Should be speakable in about 45-50 seconds."
        },
        cta: {
          type: Type.STRING,
          description: "A clear call to action for the end of the video (e.g., 'Follow for more!', 'Comment your thoughts!')."
        }
      },
      required: ["hook", "body", "cta"]
    },
    bRollKeywords: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "An array of 10-15 concise keywords or short phrases representing visuals for B-roll footage (e.g., 'futuristic city', 'scientist in lab', 'running water')."
    },
    captions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "An array of short, punchy text captions (3-5 words each) that can be overlaid on the video, synchronized with the script."
    }
  },
  required: ["title", "description", "hashtags", "script", "bRollKeywords", "captions"],
};

export async function generateScriptForTopic(topic: string): Promise<ScriptData> {
  const prompt = `
    Create a complete content package for a 60-second vertical video (like a YouTube Short or TikTok) about the topic: "${topic}".

    The tone should be engaging, surprising, and highly shareable. The goal is to maximize viewer retention and engagement.

    Generate the following components based on the topic:
    1.  **Title:** A viral-style title.
    2.  **Description:** A short description.
    3.  **Hashtags:** A list of relevant hashtags.
    4.  **Script:** A full script divided into a hook, main body, and a call-to-action (CTA). The total spoken time should be under 60 seconds.
    5.  **B-Roll Keywords:** A list of visual keywords to find stock footage.
    6.  **Captions:** Short, overlay captions that correspond to the script.

    Ensure the output is a valid JSON object matching the provided schema.
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.8,
      },
    });

    const jsonText = response.text.trim();
    const parsedData = JSON.parse(jsonText);

    // Basic validation to ensure the parsed data looks like our ScriptData
    if (parsedData && parsedData.script && parsedData.bRollKeywords) {
        return parsedData as ScriptData;
    } else {
        throw new Error("Parsed data does not match ScriptData structure.");
    }

  } catch (error) {
    console.error("Error generating content from Gemini:", error);
    // You might want to re-throw or handle this more gracefully
    throw new Error("Failed to parse or receive valid data from the AI model.");
  }
}