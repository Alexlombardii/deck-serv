"use client";
import { useEffect, useState } from "react";
import { DECK_CONFIG } from '@/config/deck';

declare global {
  interface Window {
    Deck: {
      create: (config: {
        token: string;
        onSuccess: (data: { public_token: string }) => void;
        onExit: () => void;
        onError: (error: Error) => void;
      }) => {
        open: () => void;
      };
    };
  }
}

export default function Home() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [deckLoaded, setDeckLoaded] = useState(false);

  // 1. Load Deck SDK
  useEffect(() => {
    if (window.Deck) {
      setDeckLoaded(true);
      return;
    }
    const script = document.createElement("script");
    script.src = DECK_CONFIG.sdkUrl;
    script.async = true;
    script.onload = () => setDeckLoaded(true);
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // 2. Get link token and open widget
  const openDeckWidget = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/create-link-token", { method: "POST" });
      const data = await res.json();
      
      if (res.ok && data.link_token) {
        if (window.Deck) {
          const handler = window.Deck.create({
            token: data.link_token,
            onSuccess: async ({ public_token }: { public_token: string }) => {
              // Exchange public_token for access_token
              try {
                const res = await fetch("/api/exchange-public-token", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ public_token }),
                });
                const data = await res.json();
                if (res.ok && data.access_token) {
                  // You can now use/store the access_token as needed
                } else {
                  setError("Error exchanging token: " + (data.error || "Unknown error"));
                  console.error("Exchange error:", data);
                }
              } catch (error) {
                setError("Network error exchanging token");
                console.error("Network error:", error);
              }
            },
            onExit: () => setLoading(false),
            onError: (error: Error) => {
              setError(error?.message || "Deck widget error");
              setLoading(false);
            },
          });
          handler.open();
        } else {
          setError("Deck SDK not loaded");
        }
      } else {
        setError(data.error ? JSON.stringify(data.error) : "Unknown error");
        console.error('Link token error:', { status: res.status, data });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Request failed";
      setError(errorMessage);
      console.error('Link token request failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 gap-6">
      <h1 className="text-2xl font-bold mb-4">Connect Your Utility Account</h1>
      <button
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        onClick={openDeckWidget}
        disabled={loading || !deckLoaded}
      >
        {loading ? "Loading..." : !deckLoaded ? "Loading Deck..." : "Connect with Deck"}
      </button>
      {error && (
        <div className="mt-4 p-4 bg-red-100 rounded text-red-800 break-all">
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  );
}
