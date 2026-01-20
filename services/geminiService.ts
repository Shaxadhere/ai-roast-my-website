
import { GoogleGenAI, Type } from "@google/genai";
import { WebsiteData, RoastResult, RoastStyle } from "../types";

export const generateRoast = async (
  siteData: WebsiteData, 
  style: RoastStyle
): Promise<RoastResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  
  const prompt = `
    You are an expert web designer and stand-up comedian specialized in roasting websites.
    Roast this website based on the following metadata:
    
    URL: ${siteData.url}
    Title: ${siteData.title}
    Description: ${siteData.description}
    Headings Found: ${siteData.headings.join(", ")}
    Image Count: ${siteData.imageCount}
    Images have alt text? ${siteData.hasAltText}
    Text content preview: ${siteData.textPreview}

    The style of the roast must be: ${style}

    Tone Guidelines:
    - Funny, witty, sarcastic, and slightly mean but never offensive or abusive.
    - Focus on design, UX, copy, and overall "vibe".
    - If the metadata is sparse (e.g., only URL), roast the concept of the site or its name.
    
    Return the response as a JSON object following the structure:
    {
      "firstImpression": "...",
      "designUI": "...",
      "contentCopy": "...",
      "performanceUX": "...",
      "vibeScore": number (0-10),
      "summary": "A short 1-sentence funny punchline for social media"
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            firstImpression: { type: Type.STRING },
            designUI: { type: Type.STRING },
            contentCopy: { type: Type.STRING },
            performanceUX: { type: Type.STRING },
            vibeScore: { type: Type.NUMBER },
            summary: { type: Type.STRING }
          },
          required: ["firstImpression", "designUI", "contentCopy", "performanceUX", "vibeScore", "summary"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    
    return {
      id: crypto.randomUUID(),
      url: siteData.url,
      websiteTitle: siteData.title,
      style,
      timestamp: Date.now(),
      ...result
    };
  } catch (error) {
    console.error("Gemini generation error:", error);
    throw new Error("AI failed to generate a roast. It was too shocked by the website's design.");
  }
};
