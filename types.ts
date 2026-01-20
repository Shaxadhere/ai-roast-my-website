
export enum RoastStyle {
  LIGHT = 'Light & Friendly',
  SAVAGE = 'Savage but Smart',
  PROFESSIONAL = 'Professional Critique',
  GENZ = 'Gen-Z Internet Roast',
  CORPORATE = 'Corporate Buzzword Roast'
}

export interface WebsiteData {
  url: string;
  title: string;
  description: string;
  headings: string[];
  imageCount: number;
  hasAltText: boolean;
  primaryColors: string[];
  textPreview: string;
}

export interface RoastResult {
  id: string;
  url: string;
  websiteTitle: string;
  style: RoastStyle;
  firstImpression: string;
  designUI: string;
  contentCopy: string;
  performanceUX: string;
  vibeScore: number;
  timestamp: number;
  summary: string;
}

export interface RoastHistoryItem {
  id: string;
  url: string;
  title: string;
  vibeScore: number;
  timestamp: number;
}
