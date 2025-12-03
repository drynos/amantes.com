import React, { useState, useRef, useEffect } from 'react';
import { generateChatResponse } from '../services/geminiService';
import { ChatMessage } from '../types';

export const ChatView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'model', text: 'Olá! Como posso ajudar você hoje?', timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [useGrounding, setUseGrounding] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const response = await generateChatResponse(history, userMsg.text, useGrounding);
      const text = response.text || "Não consegui gerar uma resposta.";
      
      const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => {
          if (chunk.web) return { uri: chunk.web.uri, title: chunk.web.title };
          return null;
      }).filter(Boolean) || [];

      const modelMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: text,
        timestamp: Date.now(),
        groundingSources: sources
      };

      setMessages(prev => [...prev, modelMsg]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: "Desculpe, ocorreu um erro de conexão.",
        timestamp: Date.now()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 pb-20">
      
      {/* Search Header */}
      <div className="p-4 pt-6 bg-zinc-950/90 backdrop-blur-md sticky top-0 z-10 border-b border-zinc-900">
          <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-bold text-white">Mensagens</h1>
              <button className="text-zinc-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
              </button>
          </div>
          <div className="relative">
              <input 
                  type="text" 
                  placeholder="Pesquisar conversas..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-pink-500 transition-shadow"
                  disabled
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-zinc-500 absolute left-3 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
          </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Mock DM List Header inside Chat View for context */}
        <div className="flex items-center space-x-3 pb-4 border-b border-zinc-900">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                <span className="text-white text-xs font-bold">IA</span>
            </div>
            <div>
                <h3 className="text-white font-bold text-sm">Assistente Amantes</h3>
                <p className="text-zinc-400 text-xs">Online agora</p>
            </div>
        </div>

        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3.5 rounded-2xl shadow-sm ${
              msg.role === 'user' 
                ? 'bg-gradient-to-br from-fuchsia-600 to-pink-500 text-white rounded-br-none' 
                : 'bg-zinc-800 text-zinc-200 rounded-bl-none'
            }`}>
              <div className="text-sm leading-relaxed">{msg.text}</div>
              {msg.groundingSources && msg.groundingSources.length > 0 && (
                <div className="mt-2 pt-2 border-t border-white/20">
                   <p className="text-[10px] text-zinc-300 font-semibold mb-1 flex items-center">
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                           <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                       </svg>
                       Fontes Verificadas:
                   </p>
                   <ul className="space-y-1">
                     {msg.groundingSources.map((source, idx) => (
                       <li key={idx}>
                         <a href={source.uri} target="_blank" rel="noreferrer" className="text-[10px] text-blue-300 hover:underline truncate block">
                           {source.title || source.uri}
                         </a>
                       </li>
                     ))}
                   </ul>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex justify-start">
                <div className="bg-zinc-800 p-3 rounded-2xl rounded-bl-none">
                    <div className="flex space-x-1.5 px-1">
                        <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce delay-75"></div>
                        <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce delay-150"></div>
                    </div>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-zinc-950 border-t border-zinc-900">
        <div className="flex items-center space-x-2 mb-2 px-1">
             <label className="flex items-center space-x-2 cursor-pointer text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
                <input 
                    type="checkbox" 
                    checked={useGrounding} 
                    onChange={(e) => setUseGrounding(e.target.checked)}
                    className="form-checkbox h-3.5 w-3.5 text-pink-500 rounded bg-zinc-800 border-zinc-700 focus:ring-offset-0 focus:ring-1 focus:ring-pink-500"
                />
                <span>Pesquisar na Web</span>
            </label>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Enviar mensagem..."
            className="flex-1 bg-zinc-900 border border-zinc-800 rounded-full px-5 py-3 text-white focus:outline-none focus:border-pink-500 transition-all placeholder-zinc-600 text-sm"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-pink-600 hover:bg-pink-500 text-white p-3 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-pink-900/30"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform -rotate-45 translate-x-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};