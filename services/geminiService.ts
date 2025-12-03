import { GoogleGenAI, GenerateContentResponse, LiveServerMessage, Modality } from "@google/genai";
import { decode, decodeAudioData, createBlob } from "./audioUtils";

// Define LiveSession type via inference as it is not exported directly
type LiveSession = Awaited<ReturnType<GoogleGenAI["live"]["connect"]>>;

// Initialize AI Client. Note: We create a fresh instance in calls to ensure latest key is used.
const getAIClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- Chat Service ---

export async function generateChatResponse(
  history: { role: string; parts: { text: string }[] }[],
  newMessage: string,
  useGrounding: boolean = false
): Promise<GenerateContentResponse> {
  const ai = getAIClient();
  const tools = useGrounding ? [{ googleSearch: {} }] : [];
  
  // We use the chat interface to maintain history simply
  const chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    history: history,
    config: {
        tools: tools,
    }
  });

  const response = await chat.sendMessage({ message: newMessage });
  return response;
}

// --- Image Generation Service ---

export async function generateImage(prompt: string, aspectRatio: string = "1:1"): Promise<string[]> {
  const ai = getAIClient();
  // Using the Pro Image Preview model for high quality results
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: {
      parts: [{ text: prompt }],
    },
    config: {
      imageConfig: {
        aspectRatio: aspectRatio,
        imageSize: "1K"
      },
    },
  });

  const images: string[] = [];
  if (response.candidates?.[0]?.content?.parts) {
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        images.push(`data:image/png;base64,${part.inlineData.data}`);
      }
    }
  }
  return images;
}

// --- Live Service ---

export interface LiveSessionCallbacks {
  onOpen: () => void;
  onAudioData: (buffer: AudioBuffer) => void;
  onClose: () => void;
  onError: (error: Error) => void;
  onTranscript: (text: string, isUser: boolean) => void;
}

export class LiveClient {
  private session: LiveSession | null = null;
  private audioContext: AudioContext;
  private inputContext: AudioContext;
  private nextStartTime: number = 0;
  private stream: MediaStream | null = null;
  private processor: ScriptProcessorNode | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private activeSources: Set<AudioBufferSourceNode> = new Set();
  
  constructor(private callbacks: LiveSessionCallbacks) {
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 24000 });
    this.inputContext = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 16000 });
  }

  async connect() {
    try {
      const ai = getAIClient();
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            this.callbacks.onOpen();
            this.startAudioInput(sessionPromise);
          },
          onmessage: async (message: LiveServerMessage) => {
            // Handle Audio
            const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64Audio) {
              this.handleAudioOutput(base64Audio);
            }

            // Handle Transcripts
             if (message.serverContent?.outputTranscription?.text) {
                this.callbacks.onTranscript(message.serverContent.outputTranscription.text, false);
             }
             if (message.serverContent?.inputTranscription?.text) {
                 // For input, we often just want the final result, but streaming is fine
                // Not enforcing turnComplete here for simplicity in UI, just stream it
             }
             if (message.serverContent?.turnComplete) {
                 // Could finalize transcripts here
             }

            // Handle Interruption
            if (message.serverContent?.interrupted) {
              this.stopAudioOutput();
            }
          },
          onclose: () => {
            this.callbacks.onClose();
            this.cleanup();
          },
          onerror: (e) => {
            this.callbacks.onError(new Error("Live session error"));
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
          },
          systemInstruction: "You are a creative brainstorming partner in 'Amantes.com'. Be energetic, concise, and helpful.",
          outputAudioTranscription: {}, 
        }
      });
      
      // Store session logic if needed, but we rely on sessionPromise inside callbacks
      
    } catch (err) {
      this.callbacks.onError(err instanceof Error ? err : new Error("Failed to connect"));
    }
  }

  private startAudioInput(sessionPromise: Promise<LiveSession>) {
    if (!this.stream) return;

    this.source = this.inputContext.createMediaStreamSource(this.stream);
    this.processor = this.inputContext.createScriptProcessor(4096, 1, 1);

    this.processor.onaudioprocess = (e) => {
      const inputData = e.inputBuffer.getChannelData(0);
      const blob = createBlob(inputData);
      
      sessionPromise.then(session => {
        session.sendRealtimeInput({ media: blob });
      });
    };

    this.source.connect(this.processor);
    this.processor.connect(this.inputContext.destination);
  }

  private async handleAudioOutput(base64: string) {
    // Sync start time
    this.nextStartTime = Math.max(this.nextStartTime, this.audioContext.currentTime);

    const audioBuffer = await decodeAudioData(
      decode(base64),
      this.audioContext,
      24000,
      1
    );

    const source = this.audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(this.audioContext.destination);
    
    source.onended = () => {
      this.activeSources.delete(source);
      // Optional: Visualize end
    };
    
    source.start(this.nextStartTime);
    this.nextStartTime += audioBuffer.duration;
    this.activeSources.add(source);
    
    // Pass buffer to UI for visualization
    this.callbacks.onAudioData(audioBuffer);
  }

  private stopAudioOutput() {
    this.activeSources.forEach(s => s.stop());
    this.activeSources.clear();
    this.nextStartTime = this.audioContext.currentTime;
  }

  disconnect() {
    this.cleanup();
  }

  private cleanup() {
    if (this.processor) {
        this.processor.disconnect();
        this.processor = null;
    }
    if (this.source) {
        this.source.disconnect();
        this.source = null;
    }
    if (this.stream) {
        this.stream.getTracks().forEach(t => t.stop());
        this.stream = null;
    }
    this.stopAudioOutput();
  }
}