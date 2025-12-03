import React, { useEffect, useRef, useState } from 'react';
import { LiveClient } from '../services/geminiService';

export const LiveView: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [status, setStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');
  const [transcript, setTranscript] = useState<string>('');
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const liveClientRef = useRef<LiveClient | null>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    return () => {
      stopSession();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startSession = async () => {
    if (liveClientRef.current) return;

    setStatus('connecting');
    
    liveClientRef.current = new LiveClient({
      onOpen: () => {
        setIsConnected(true);
        setStatus('connected');
        setTranscript('Ouvindo...');
      },
      onClose: () => {
        setIsConnected(false);
        setStatus('idle');
      },
      onError: (err) => {
        console.error(err);
        setStatus('error');
        setIsConnected(false);
      },
      onTranscript: (text) => {
          setTranscript(text);
      },
      onAudioData: (buffer) => {
        // Audio visualization hook
      }
    });

    await liveClientRef.current.connect();
    startVisualizer();
  };

  const stopSession = () => {
    if (liveClientRef.current) {
      liveClientRef.current.disconnect();
      liveClientRef.current = null;
    }
    setIsConnected(false);
    setStatus('idle');
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  const startVisualizer = () => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      const width = canvasRef.current!.width;
      const height = canvasRef.current!.height;
      ctx.clearRect(0, 0, width, height);

      if (isConnected) {
        const time = Date.now() / 300;
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#ec4899'; // Pink-500
        
        for (let x = 0; x < width; x++) {
            // More chaotic "voice" wave
            const y = height / 2 + Math.sin(x * 0.02 + time) * 40 + Math.sin(x * 0.1 + time * 2) * 10;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      animationFrameRef.current = requestAnimationFrame(draw);
    };
    draw();
  };

  const getStatusIndicator = () => {
      switch (status) {
          case 'connecting':
              return (
                  <div className="flex items-center space-x-2 bg-yellow-500/90 backdrop-blur-xl px-4 py-2 rounded-full animate-pulse border border-yellow-400/30 shadow-lg shadow-yellow-900/20">
                      <div className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                      </div>
                      <span className="text-xs font-bold text-white uppercase tracking-wider">Conectando...</span>
                  </div>
              );
          case 'connected':
               return (
                  <div className="flex items-center space-x-2 bg-green-500/90 backdrop-blur-xl px-4 py-2 rounded-full border border-green-400/30 shadow-lg shadow-green-900/20">
                      <div className="w-3 h-3 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]"></div>
                      <span className="text-xs font-bold text-white uppercase tracking-wider">Ao Vivo • Conectado</span>
                  </div>
              );
          case 'error':
              return (
                  <div className="flex items-center space-x-2 bg-red-500/90 backdrop-blur-xl px-4 py-2 rounded-full border border-red-400/30">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                      <span className="text-xs font-bold text-white uppercase tracking-wider">Erro na Conexão</span>
                  </div>
              );
          default:
              return (
                   <div className="flex items-center space-x-2 bg-zinc-800/80 backdrop-blur-xl px-4 py-2 rounded-full border border-zinc-700">
                      <div className="w-3 h-3 bg-zinc-500 rounded-full"></div>
                      <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Desconectado</span>
                  </div>
              );
      }
  };

  return (
    <div className="h-full w-full bg-black relative flex flex-col">
       
       {/* Central Status Indicator - Positioned prominently below top nav */}
       <div className="absolute top-24 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none">
           {getStatusIndicator()}
       </div>

       {/* Top Right Live Count */}
       <div className="absolute top-24 right-4 z-30 flex items-center space-x-2">
           <div className="px-2 py-1 bg-black/50 backdrop-blur-md rounded flex items-center space-x-1 border border-white/10">
               <span className="text-white text-xs font-bold">👀 1.2K</span>
           </div>
           <button 
                onClick={stopSession} 
                className="p-2 rounded-full transition-colors shadow-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700"
                title="Fechar"
           >
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                   <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
               </svg>
           </button>
       </div>

       {/* Main Visual Content */}
       <div className="flex-1 flex flex-col items-center justify-center relative bg-zinc-900/50">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-black/80 pointer-events-none"></div>

           {/* AI Avatar */}
           <div className={`w-40 h-40 rounded-full border-4 ${isConnected ? 'border-pink-500 shadow-[0_0_60px_rgba(236,72,153,0.5)]' : 'border-zinc-700'} mb-8 overflow-hidden relative transition-all duration-700 z-10`}>
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" className="w-full h-full object-cover" alt="AI Host" />
                {!isConnected && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[2px]">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                )}
           </div>

           <div className="h-24 w-full flex items-center justify-center z-10">
                <canvas 
                        ref={canvasRef} 
                        width={300} 
                        height={100} 
                        className="w-full max-w-sm h-full"
                />
           </div>

           <div className="h-16 flex items-center justify-center z-10 px-8 w-full max-w-md">
                <p className={`text-center font-medium transition-all duration-300 ${status === 'connecting' ? 'text-yellow-400 animate-pulse' : 'text-white/90 text-lg shadow-black drop-shadow-md'}`}>
                    {status === 'connecting' ? "Sintonizando frequência..." : transcript}
                </p>
           </div>

           {!isConnected && (
               <button 
                onClick={startSession}
                className="mt-8 px-8 py-3 bg-gradient-to-r from-fuchsia-600 to-pink-500 hover:from-fuchsia-500 hover:to-pink-400 text-white font-bold rounded-full shadow-lg shadow-pink-500/40 transition-all transform hover:scale-105 z-10 flex items-center space-x-2"
               >
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                       <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                   </svg>
                   <span>Iniciar Live</span>
               </button>
           )}
       </div>

       {/* Chat Overlay (Mock) */}
       <div className="h-1/3 bg-gradient-to-t from-black via-black/80 to-transparent p-4 pb-24 flex flex-col justify-end space-y-2 z-20">
            <div className="space-y-3 opacity-90 mask-image-gradient pl-2">
                <div className="flex items-start space-x-2">
                    <img src="https://i.pravatar.cc/150?u=1" className="w-6 h-6 rounded-full border border-white/20" alt="avatar"/>
                    <div>
                        <span className="text-pink-400 text-xs font-bold mr-2">@joao_gamer</span>
                        <span className="text-white text-xs">Essa IA é incrível! 🔥</span>
                    </div>
                </div>
                <div className="flex items-start space-x-2">
                    <img src="https://i.pravatar.cc/150?u=2" className="w-6 h-6 rounded-full border border-white/20" alt="avatar"/>
                    <div>
                        <span className="text-blue-400 text-xs font-bold mr-2">@aninha_dance</span>
                        <span className="text-white text-xs">Manda um beijo! 😘</span>
                    </div>
                </div>
                <div className="flex items-start space-x-2">
                    <img src="https://i.pravatar.cc/150?u=3" className="w-6 h-6 rounded-full border border-white/20" alt="avatar"/>
                    <div>
                        <span className="text-yellow-400 text-xs font-bold mr-2">@crypto_king</span>
                        <span className="text-white text-xs">CRISEX to the moon 🚀</span>
                    </div>
                </div>
            </div>
            
            <div className="flex items-center space-x-2 mt-2 pt-2 border-t border-white/10">
                {/* Microphone Button */}
                <button 
                    onClick={isConnected ? stopSession : startSession}
                    className={`p-3 rounded-full transition-all border ${
                        isConnected 
                        ? 'bg-red-500 hover:bg-red-600 border-red-400 text-white animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)]' 
                        : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-600 text-white'
                    }`}
                >
                    {isConnected ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                           <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        </svg>
                    )}
                </button>

                <input 
                    type="text" 
                    placeholder={isConnected ? "Fale com a IA..." : "Conecte para interagir..."}
                    className="flex-1 bg-zinc-800/50 backdrop-blur-md border border-zinc-700 rounded-full px-4 py-2.5 text-white text-sm focus:outline-none focus:border-pink-500 placeholder-zinc-500"
                    disabled={!isConnected}
                />
                <button className="p-2.5 bg-gradient-to-r from-fuchsia-600 to-pink-600 rounded-full text-white shadow-lg shadow-pink-900/30">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                    </svg>
                </button>
            </div>
       </div>
    </div>
  );
};