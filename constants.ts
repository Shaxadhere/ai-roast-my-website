
import { RoastStyle } from './types';

export const APP_NAME = "Roast My Site";
export const APP_TAGLINE = "AI-powered emotional damage for your web design choices.";

export const STYLE_DESCRIPTIONS: Record<RoastStyle, string> = {
  [RoastStyle.LIGHT]: "A gentle poke at your margins. Good for sensitive souls.",
  [RoastStyle.SAVAGE]: "No mercy. Your CSS will cry.",
  [RoastStyle.PROFESSIONAL]: "Constructive criticism, but with a side of salt.",
  [RoastStyle.GENZ]: "No cap, your UI is giving mid vibes. Fr fr.",
  [RoastStyle.CORPORATE]: "Leveraging synergies to pivot your design paradigm into a trash can."
};

export const LOADING_MESSAGES = [
  "Analyzing your questionable design choices...",
  "Consulting the gods of UI/UX...",
  "Cringing at your font selection...",
  "Checking if this site was built in 1998...",
  "Extracting 'vibe' data (loading... loading...)",
  "Preparing the burn ward...",
  "Polishing the sarcasm modules...",
  "Calculating the level of mid..."
];
