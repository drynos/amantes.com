import { Modality } from "@google/genai";

// Extend Window interface for AI Studio helpers
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  interface Window {
    AudioContext: typeof AudioContext;
    webkitAudioContext: typeof AudioContext;
  }
}

export enum AppMode {
  HOME = 'HOME',
  SHOP = 'SHOP',     // Replaces EXPLORE
  CREATE = 'CREATE',
  MESSAGES = 'MESSAGES', // Replaces PACKS
  PROFILE = 'PROFILE'
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  groundingSources?: Array<{
    uri: string;
    title: string;
  }>;
}

export interface LiveConnectionState {
  isConnected: boolean;
  isStreaming: boolean;
  error: string | null;
}

export interface ImageGenerationState {
  isGenerating: boolean;
  generatedImages: string[];
  error: string | null;
}

export interface SparkConfig {
  model: string;
  systemInstruction?: string;
}

export interface FeedItem {
  id: string;
  username: string;
  handle: string;
  avatar: string;
  contentUrl: string;
  likes: number;
  comments: number;
  description: string;
}