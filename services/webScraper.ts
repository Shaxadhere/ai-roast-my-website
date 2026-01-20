
import { WebsiteData } from '../types';

export const scrapeWebsite = async (url: string): Promise<WebsiteData> => {
  try {
    // We use a CORS proxy to fetch the HTML content
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
    const response = await fetch(proxyUrl);
    
    if (!response.ok) {
      throw new Error("Could not reach the website. It might be blocking us.");
    }

    const data = await response.json();
    const html = data.contents;

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Title
    const title = doc.querySelector('title')?.innerText || url;

    // Meta Description
    const description = doc.querySelector('meta[name="description"]')?.getAttribute('content') || "";

    // Headings
    const headings = Array.from(doc.querySelectorAll('h1, h2, h3'))
      .map(h => h.textContent?.trim() || "")
      .filter(t => t.length > 0)
      .slice(0, 10);

    // Images
    const images = Array.from(doc.querySelectorAll('img'));
    const imageCount = images.length;
    const hasAltText = images.some(img => img.getAttribute('alt'));

    // Text content (first 1000 chars)
    const bodyText = doc.body.innerText.replace(/\s+/g, ' ').trim();
    const textPreview = bodyText.slice(0, 1000);

    // Simple Color Extraction (Looking at inline styles as a hint, very limited)
    const primaryColors: string[] = [];
    doc.querySelectorAll('*[style]').forEach(el => {
      const color = (el as HTMLElement).style.color || (el as HTMLElement).style.backgroundColor;
      if (color && !primaryColors.includes(color)) primaryColors.push(color);
    });

    return {
      url,
      title,
      description,
      headings,
      imageCount,
      hasAltText,
      primaryColors: primaryColors.slice(0, 5),
      textPreview
    };
  } catch (error) {
    console.error("Scraping error:", error);
    // Fallback: If we can't scrape, we just return basic info from URL
    const urlObj = new URL(url);
    return {
      url,
      title: urlObj.hostname,
      description: "Unable to fetch site description due to CORS or blocking.",
      headings: [],
      imageCount: 0,
      hasAltText: false,
      primaryColors: [],
      textPreview: `Analysis based on URL: ${url}`
    };
  }
};
