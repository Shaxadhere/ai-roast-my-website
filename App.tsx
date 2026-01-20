import React, { useState, useEffect, useCallback } from "react";
import {
  Flame,
  Search,
  History as HistoryIcon,
  Info,
  RotateCcw,
  Share2,
  Copy,
  Twitter,
  Linkedin,
  ExternalLink,
  MessageSquare,
  AlertCircle,
} from "lucide-react";
import {
  RoastStyle,
  RoastResult,
  RoastHistoryItem,
  WebsiteData,
} from "./types";
import {
  STYLE_DESCRIPTIONS,
  LOADING_MESSAGES,
  APP_NAME,
  APP_TAGLINE,
} from "./constants";
import { scrapeWebsite } from "./services/webScraper";
import { generateRoast } from "./services/geminiService";

import html2canvas from "html2canvas";

const App: React.FC = () => {
  const [url, setUrl] = useState("");
  const [style, setStyle] = useState<RoastStyle>(RoastStyle.SAVAGE);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0]);
  const [currentRoast, setCurrentRoast] = useState<RoastResult | null>(null);
  const [history, setHistory] = useState<RoastHistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const resultsRef = React.useRef<HTMLDivElement>(null);

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("roast_history");
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  // Update history
  const updateHistory = (roast: RoastResult) => {
    const newItem: RoastHistoryItem = {
      id: roast.id,
      url: roast.url,
      title: roast.websiteTitle,
      vibeScore: roast.vibeScore,
      timestamp: roast.timestamp,
    };
    const newHistory = [newItem, ...history].slice(0, 5);
    setHistory(newHistory);
    localStorage.setItem("roast_history", JSON.stringify(newHistory));
  };

  // Cycling loading messages
  useEffect(() => {
    let interval: number;
    if (isLoading) {
      interval = window.setInterval(() => {
        setLoadingMessage(
          LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)],
        );
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleRoast = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!url.startsWith("http")) {
      setError("URL must start with http:// or https://");
      return;
    }

    setError(null);
    setIsLoading(true);
    setCurrentRoast(null);

    try {
      const siteData = await scrapeWebsite(url);
      const roast = await generateRoast(siteData, style);
      setCurrentRoast(roast);
      updateHistory(roast);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  const shareOnTwitter = (text: string) => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
      "_blank",
    );
  };

  const generateAndShareImage = async () => {
    if (!resultsRef.current || !currentRoast) return;

    try {
      const canvas = await html2canvas(resultsRef.current, {
        backgroundColor: "#020617", // Match slate-950
        scale: 2, // Better quality
      });

      canvas.toBlob(async (blob) => {
        if (!blob) {
          alert("Failed to generate image");
          return;
        }

        const file = new File([blob], "roast-result.png", {
          type: "image/png",
        });
        const shareData = {
          title: `My Website Roast - ${currentRoast.websiteTitle}`,
          text: `My site got a ${currentRoast.vibeScore}/10! "${currentRoast.summary}" #RoastMyWebsite`,
          files: [file],
        };

        if (navigator.canShare && navigator.canShare(shareData)) {
          try {
            await navigator.share(shareData);
          } catch (err) {
            if ((err as Error).name !== "AbortError") {
              console.error("Error sharing:", err);
            }
          }
        } else {
          // Fallback to download
          const link = document.createElement("a");
          link.download = "roast-result.png";
          link.href = canvas.toDataURL();
          link.click();
          alert(
            "Image downloaded! You can now share it on LinkedIn or Twitter.",
          );
        }
      });
    } catch (err) {
      console.error("Failed to generate image:", err);
      alert("Could not generate image.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-rose-500 selection:text-white pb-20">
      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setCurrentRoast(null)}
          >
            <Flame className="w-8 h-8 text-rose-500 fill-rose-500" />
            <span className="font-bangers text-2xl tracking-wider text-rose-500">
              {APP_NAME}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="p-2 hover:bg-slate-800 rounded-full transition-colors relative"
            >
              <HistoryIcon className="w-5 h-5" />
              {history.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full"></span>
              )}
            </button>
            <button
              onClick={() => setShowDisclaimer(true)}
              className="p-2 hover:bg-slate-800 rounded-full transition-colors"
            >
              <Info className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 pt-12">
        {/* Landing View */}
        {!currentRoast && !isLoading && (
          <div className="text-center space-y-8 py-10">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-r from-rose-500 via-orange-400 to-rose-600 bg-clip-text text-transparent drop-shadow-sm">
                Roast My Website
              </h1>
              <p className="text-xl text-slate-400 max-w-xl mx-auto">
                {APP_TAGLINE} Enter a URL and let our AI judge your life
                choices.
              </p>
            </div>

            <form
              onSubmit={handleRoast}
              className="space-y-6 max-w-2xl mx-auto bg-slate-900/40 p-8 rounded-3xl border border-slate-800 shadow-2xl"
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                <input
                  type="url"
                  placeholder="https://your-shameful-site.com"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all text-lg"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {Object.values(RoastStyle).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStyle(s)}
                    className={`p-3 rounded-xl border text-sm font-medium transition-all text-left flex flex-col gap-1 ${
                      style === s
                        ? "bg-rose-500/10 border-rose-500 text-rose-500"
                        : "bg-slate-950 border-slate-800 hover:border-slate-600"
                    }`}
                  >
                    <span>{s}</span>
                    <span className="text-[10px] opacity-60 leading-tight">
                      {STYLE_DESCRIPTIONS[s]}
                    </span>
                  </button>
                ))}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-rose-600 hover:bg-rose-500 disabled:bg-slate-800 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-lg shadow-rose-900/20 transition-all text-xl flex items-center justify-center gap-2 group"
              >
                Let's Go!
                <Flame className="w-6 h-6 group-hover:animate-bounce" />
              </button>

              {error && (
                <div className="flex items-center gap-2 text-rose-400 text-sm justify-center bg-rose-500/10 p-3 rounded-lg border border-rose-500/20">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}
            </form>

            <div className="pt-8">
              <p className="text-slate-500 text-sm italic">
                No personal traits roasted. Just pixels and bad CSS.
              </p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="py-20 flex flex-col items-center justify-center text-center space-y-8 animate-pulse">
            <div className="relative">
              <div className="w-24 h-24 bg-rose-500/20 rounded-full flex items-center justify-center animate-ping absolute inset-0 opacity-40"></div>
              <Flame className="w-24 h-24 text-rose-500 relative z-10" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-200">
                {loadingMessage}
              </h2>
              <p className="text-slate-500">Sharpening the virtual tongue...</p>
            </div>
          </div>
        )}

        {/* Results View */}
        {currentRoast && !isLoading && (
          <div
            ref={resultsRef}
            className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 bg-slate-950 p-4 rounded-3xl"
          >
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
              <div>
                <h2 className="text-3xl font-extrabold text-white mb-2">
                  {currentRoast.websiteTitle}
                </h2>
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <ExternalLink className="w-4 h-4" />
                  <a
                    href={currentRoast.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-rose-400 underline transition-colors"
                  >
                    {currentRoast.url}
                  </a>
                  <span className="mx-2">•</span>
                  <span className="bg-slate-800 px-2 py-0.5 rounded text-rose-400 font-medium">
                    {currentRoast.style}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentRoast(null)}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm transition-all"
                >
                  <RotateCcw className="w-4 h-4" /> Roast Another
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Vibe Score Card */}
              <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl flex flex-col items-center justify-center text-center space-y-4">
                <span className="text-slate-500 font-semibold uppercase tracking-widest text-xs">
                  Vibe Score
                </span>
                <div className="relative">
                  <div className="text-8xl font-bangers text-rose-500">
                    {currentRoast.vibeScore}
                  </div>
                  <span className="absolute -right-6 bottom-4 text-2xl text-slate-700 font-bold">
                    / 10
                  </span>
                </div>
                <p className="text-slate-400 italic">
                  "The audacity level is high."
                </p>
              </div>

              {/* Summary Card */}
              <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-4 flex flex-col justify-center">
                <div className="flex items-center gap-2 text-rose-400">
                  <MessageSquare className="w-5 h-5" />
                  <span className="font-bold uppercase tracking-widest text-xs">
                    The Punchline
                  </span>
                </div>
                <p className="text-2xl font-bold text-white italic leading-relaxed">
                  "{currentRoast.summary}"
                </p>
                <div className="flex items-center gap-3 pt-4">
                  <button
                    onClick={() => copyToClipboard(currentRoast.summary)}
                    className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all"
                    title="Copy Summary"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() =>
                      shareOnTwitter(
                        `${currentRoast.summary} Roast your site at ${window.location.href}`,
                      )
                    }
                    className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all text-blue-400"
                    title="Share on X"
                  >
                    <Twitter className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => {
                      const text = `${currentRoast.summary} Roast your site at ${window.location.href}`;
                      window.open(
                        `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}&summary=${encodeURIComponent(text)}`,
                        "_blank",
                      );
                    }}
                    className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all text-blue-600"
                    title="Share on LinkedIn"
                  >
                    <Linkedin className="w-5 h-5" />
                  </button>
                  <button
                    onClick={generateAndShareImage}
                    className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all text-purple-400"
                    title="Share Screenshot"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Detailed Categories */}
            <div className="grid grid-cols-1 gap-6">
              <RoastSection
                title="First Impression"
                content={currentRoast.firstImpression}
                emoji="👀"
              />
              <RoastSection
                title="Design & UI"
                content={currentRoast.designUI}
                emoji="🎨"
              />
              <RoastSection
                title="Content & Copy"
                content={currentRoast.contentCopy}
                emoji="✍️"
              />
              <RoastSection
                title="Performance & UX"
                content={currentRoast.performanceUX}
                emoji="⚡"
              />
            </div>

            {/* Social Share Call to Action */}
            <div className="bg-gradient-to-br from-rose-600 to-orange-500 p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 text-white">
              <div className="space-y-1">
                <h3 className="text-2xl font-bold">Spread the Roast!</h3>
                <p className="opacity-90">
                  Let the world see this masterpiece of judgment.
                </p>
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto">
                <button
                  onClick={() =>
                    copyToClipboard(
                      `My site got a ${currentRoast.vibeScore}/10 on ${APP_NAME}! Roast: ${currentRoast.summary}`,
                    )
                  }
                  className="flex-1 md:flex-none px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
                >
                  <Share2 className="w-5 h-5" /> Share Full Roast
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* History Sidebar */}
      {showHistory && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-slate-900 border-l border-slate-800 shadow-2xl p-6 flex flex-col animate-in slide-in-from-right duration-500">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <HistoryIcon className="w-6 h-6 text-rose-500" />
                <h2 className="text-xl font-bold">Recent Victims</h2>
              </div>
              <button
                onClick={() => setShowHistory(false)}
                className="p-2 hover:bg-slate-800 rounded-full"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4">
              {history.length === 0 ? (
                <div className="text-center py-20 text-slate-500">
                  <Flame className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p>No sites roasted yet.</p>
                  <p className="text-xs">Go find some ugly sites!</p>
                </div>
              ) : (
                history.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      // In a real app we'd fetch the full roast, for now let's just let user roast again
                      setUrl(item.url);
                      setShowHistory(false);
                      handleRoast();
                    }}
                    className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl hover:border-rose-500/50 transition-all text-left group"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-bold text-white truncate text-sm">
                        {item.title}
                      </span>
                      <span className="text-rose-500 font-bangers text-lg">
                        {item.vibeScore}/10
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 truncate">
                      {item.url}
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-[10px] text-slate-600 font-mono">
                      {new Date(item.timestamp).toLocaleString()}
                    </div>
                  </button>
                ))
              )}
            </div>

            <div className="pt-6 border-t border-slate-800">
              <button
                onClick={() => {
                  setHistory([]);
                  localStorage.removeItem("roast_history");
                }}
                className="w-full py-3 text-xs text-slate-500 hover:text-rose-400 transition-colors"
              >
                Clear History
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Disclaimer Modal */}
      {showDisclaimer && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full space-y-6 shadow-2xl animate-in zoom-in-95 duration-300">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Info className="text-rose-500" /> Wait a second...
            </h2>
            <div className="space-y-4 text-slate-400 leading-relaxed">
              <p>
                This app is for <strong>entertainment purposes only</strong>.
                The AI generated content is intended to be humorous and
                satirical.
              </p>
              <p>
                We do not store your data or the analyzed website's content
                permanently beyond your local browser history.
              </p>
              <p>
                Please don't take these roasts personally. Your code is probably
                fine. Mostly.
              </p>
            </div>
            <button
              onClick={() => setShowDisclaimer(false)}
              className="w-full py-4 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl transition-all"
            >
              Got it, roast me!
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-20 border-t border-slate-900 py-10 text-center">
        <p className="text-slate-600 text-sm">
          Made with 🔥 and a pinch of sass by AI Roast My Site.
        </p>
      </footer>
    </div>
  );
};

interface SectionProps {
  title: string;
  content: string;
  emoji: string;
}

const RoastSection: React.FC<SectionProps> = ({ title, content, emoji }) => {
  return (
    <div className="group bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-4 hover:border-slate-700 transition-all duration-300 shadow-sm hover:shadow-xl">
      <div className="flex items-center gap-3">
        <span className="text-3xl">{emoji}</span>
        <h3 className="text-xl font-bold text-rose-500 group-hover:text-rose-400 transition-colors uppercase tracking-tight">
          {title}
        </h3>
      </div>
      <p className="text-slate-300 leading-relaxed text-lg">{content}</p>
    </div>
  );
};

export default App;
