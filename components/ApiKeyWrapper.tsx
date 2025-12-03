import React, { useEffect, useState } from 'react';

interface ApiKeyWrapperProps {
  children: React.ReactNode;
}

export const ApiKeyWrapper: React.FC<ApiKeyWrapperProps> = ({ children }) => {
  const [hasKey, setHasKey] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const checkKey = async () => {
    try {
      if (window.aistudio && window.aistudio.hasSelectedApiKey) {
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasKey(selected);
      } else {
        // Fallback for dev environments without the wrapper, or if user provides env var
        if (process.env.API_KEY) {
            setHasKey(true);
        }
      }
    } catch (e) {
      console.error("Error checking API key:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    try {
        if(window.aistudio && window.aistudio.openSelectKey) {
            await window.aistudio.openSelectKey();
            // Assume success as per instructions/race condition handling
            setHasKey(true);
        }
    } catch (e) {
        console.error("Error selecting key:", e);
    }
  };

  if (loading) {
    return (
        <div className="flex items-center justify-center h-screen w-screen bg-zinc-950 text-zinc-400">
            <div className="animate-pulse">Loading Amantes.com...</div>
        </div>
    );
  }

  if (!hasKey) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-screen bg-zinc-950 text-zinc-100 p-8">
        <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-xl p-8 shadow-2xl">
            <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">Amantes.com</h1>
            <p className="text-zinc-400 mb-6">
                To access the advanced Gemini models (Live Audio, High-Fidelity Images), you need to select a paid API key from a Google Cloud Project.
            </p>
            <button
                onClick={handleSelectKey}
                className="w-full py-3 px-4 bg-zinc-100 text-zinc-900 font-semibold rounded-lg hover:bg-white transition-colors mb-4"
            >
                Select API Key
            </button>
            <p className="text-xs text-zinc-500 text-center">
                Review billing information <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="underline hover:text-zinc-300">here</a>.
            </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};