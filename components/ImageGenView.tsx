import React, { useState } from 'react';
import { generateImage } from '../services/geminiService';
import { uploadFileToStorage } from '../services/storageService';

interface ImageGenViewProps {
  onImageGenerated: (images: string[]) => void;
}

type CreateTab = 'POST' | 'PACK' | 'LIVE';
type PostMode = 'PUBLIC' | 'SELL';
type LiveMode = 'PUBLIC' | 'PRIVATE';

export const ImageGenView: React.FC<ImageGenViewProps> = ({ onImageGenerated }) => {
  const [activeTab, setActiveTab] = useState<CreateTab>('POST');
  
  // Post/Reels State
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDesc, setVideoDesc] = useState('');
  const [postMode, setPostMode] = useState<PostMode>('PUBLIC');
  const [videoPrice, setVideoPrice] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Pack State
  const [packTitle, setPackTitle] = useState('');
  const [packPrice, setPackPrice] = useState('');
  
  // Live State
  const [liveTitle, setLiveTitle] = useState('');
  const [liveMode, setLiveMode] = useState<LiveMode>('PUBLIC');
  const [livePrice, setLivePrice] = useState('');

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        setVideoFile(e.target.files[0]);
    }
  };

  const handlePostVideo = async () => {
      if (!videoFile || !videoTitle) return;

      setUploading(true);
      setUploadProgress(0);

      try {
          // Usa o serviço de armazenamento (AWS Mock ou Real)
          const result = await uploadFileToStorage(videoFile, (progress) => {
              setUploadProgress(progress);
          });

          console.log("Upload concluído:", result);
          
          // Delay pequeno para UX (para ver o 100%)
          setTimeout(() => {
            setUploading(false);
            alert(`Reel "${videoTitle}" enviado com sucesso! ${postMode === 'SELL' ? `Valor: ${videoPrice} PROTO` : 'Modo Público'}`);
            
            // Reset fields
            setVideoFile(null);
            setVideoTitle('');
            setVideoDesc('');
            setVideoPrice('');
            setUploadProgress(0);
          }, 500);

      } catch (error) {
          console.error("Erro ao enviar:", error);
          setUploading(false);
          alert("Erro ao fazer upload do vídeo.");
      }
  };

  const handleCreatePack = () => {
      alert(`Pack "${packTitle}" criado por ${packPrice} CRISEX!`);
      setPackTitle('');
      setPackPrice('');
  };

  const handleStartLive = () => {
      const modeText = liveMode === 'PRIVATE' ? `Privado (${livePrice} PROTO/min)` : 'Público';
      alert(`Iniciando live: "${liveTitle}" em modo ${modeText}...`);
      setLiveTitle('');
      setLivePrice('');
  };

  const renderTabs = () => (
      <div className="flex p-1 bg-zinc-900 rounded-xl mb-6 mx-6 border border-zinc-800">
          {(['POST', 'PACK', 'LIVE'] as CreateTab[]).map((tab) => (
              <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                      activeTab === tab
                          ? 'bg-zinc-800 text-white shadow-lg'
                          : 'text-zinc-500 hover:text-zinc-300'
                  }`}
              >
                  {tab === 'POST' && 'POST / REELS'}
                  {tab === 'PACK' && 'NOVO PACK'}
                  {tab === 'LIVE' && 'INICIAR LIVE'}
              </button>
          ))}
      </div>
  );

  return (
    <div className="flex flex-col h-full bg-zinc-950 pb-20 overflow-y-auto scrollbar-hide">
       <div className="pt-8 pb-4 px-6 bg-zinc-950 sticky top-0 z-10">
           <div className="flex items-center space-x-3 mb-6">
               <div className="w-10 h-10 rounded-full bg-gradient-to-br from-fuchsia-600 to-pink-500 flex items-center justify-center shadow-lg shadow-pink-900/30">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                   </svg>
               </div>
               <h2 className="text-2xl font-bold text-white">Criar</h2>
           </div>
       </div>

       {renderTabs()}
       
       {/* POST / REELS TAB */}
       {activeTab === 'POST' && (
           <div className="px-6 space-y-6">
                <p className="text-zinc-400 text-sm mb-2">Compartilhe seus momentos. Vídeos de até 10 minutos.</p>
                
                {/* Video Upload Area */}
                <div className="relative group">
                    <input 
                        type="file" 
                        accept="video/*" 
                        onChange={handleVideoUpload}
                        disabled={uploading}
                        className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer disabled:cursor-not-allowed"
                    />
                    <div className={`bg-zinc-900 border-2 border-dashed ${videoFile ? 'border-pink-500 bg-zinc-800/50' : 'border-zinc-800'} rounded-2xl h-48 flex flex-col items-center justify-center transition-all group-hover:border-zinc-600`}>
                        {videoFile ? (
                            <div className="flex flex-col items-center">
                                <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center mb-2 shadow-lg shadow-pink-500/20">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <p className="text-white font-medium text-sm truncate max-w-[200px]">{videoFile.name}</p>
                                <p className="text-pink-400 text-xs mt-1">Toque para alterar</p>
                            </div>
                        ) : (
                            <>
                                <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center mb-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <p className="text-zinc-400 text-sm font-medium">Carregar Vídeo</p>
                                <p className="text-zinc-600 text-xs mt-1">MP4, MOV (Max 10min)</p>
                            </>
                        )}
                    </div>
                </div>

                <div className="space-y-4">
                     {/* Title */}
                    <div>
                        <label className="block text-zinc-500 text-[10px] font-bold mb-2 uppercase tracking-wider">Título do Vídeo</label>
                        <input 
                            type="text" 
                            value={videoTitle}
                            onChange={(e) => setVideoTitle(e.target.value)}
                            disabled={uploading}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500 placeholder-zinc-600 text-sm disabled:opacity-50"
                            placeholder="Ex: Vlog de Viagem #1"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-zinc-500 text-[10px] font-bold mb-2 uppercase tracking-wider">Descrição</label>
                        <textarea
                            value={videoDesc}
                            onChange={(e) => setVideoDesc(e.target.value)}
                            disabled={uploading}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500 placeholder-zinc-600 h-24 resize-none text-sm disabled:opacity-50"
                            placeholder="Conte mais sobre esse vídeo..."
                        />
                    </div>

                    {/* Post Type Selector */}
                    <div>
                        <label className="block text-zinc-500 text-[10px] font-bold mb-2 uppercase tracking-wider">Visibilidade & Monetização</label>
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <button 
                                onClick={() => setPostMode('PUBLIC')}
                                disabled={uploading}
                                className={`p-3 rounded-xl border flex flex-col items-center justify-center transition-all disabled:opacity-50 ${
                                    postMode === 'PUBLIC' 
                                    ? 'bg-zinc-800 border-white text-white' 
                                    : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:bg-zinc-800'
                                }`}
                            >
                                <span className="text-lg mb-1">🌍</span>
                                <span className="text-xs font-bold">Público</span>
                            </button>
                            <button 
                                onClick={() => setPostMode('SELL')}
                                disabled={uploading}
                                className={`p-3 rounded-xl border flex flex-col items-center justify-center transition-all disabled:opacity-50 ${
                                    postMode === 'SELL' 
                                    ? 'bg-pink-900/20 border-pink-500 text-pink-500' 
                                    : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:bg-zinc-800'
                                }`}
                            >
                                <span className="text-lg mb-1">💎</span>
                                <span className="text-xs font-bold">Vender</span>
                            </button>
                        </div>

                        {/* Price Input (Conditional) */}
                        {postMode === 'SELL' && (
                            <div className="animate-fade-in-down">
                                <label className="block text-pink-500 text-[10px] font-bold mb-2 uppercase tracking-wider">Valor (PROTO)</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-3.5 text-pink-500 font-bold text-sm">💎</span>
                                    <input 
                                        type="number" 
                                        value={videoPrice}
                                        onChange={(e) => setVideoPrice(e.target.value)}
                                        disabled={uploading}
                                        className="w-full bg-zinc-900 border border-pink-500/50 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-pink-500 placeholder-zinc-600 disabled:opacity-50"
                                        placeholder="0.00"
                                    />
                                </div>
                                <p className="text-[10px] text-zinc-500 mt-2 ml-1">
                                    * Usuários precisarão pagar este valor para assistir ao conteúdo completo.
                                </p>
                            </div>
                        )}
                    </div>

                    {uploading && (
                        <div className="space-y-1">
                            <div className="flex justify-between text-xs font-semibold text-zinc-400">
                                <span>Enviando para AWS...</span>
                                <span>{uploadProgress}%</span>
                            </div>
                            <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
                                <div 
                                    className="bg-gradient-to-r from-fuchsia-600 to-pink-500 h-full rounded-full transition-all duration-300 ease-out"
                                    style={{ width: `${uploadProgress}%` }}
                                ></div>
                            </div>
                        </div>
                    )}

                    <button
                        onClick={handlePostVideo}
                        disabled={uploading || !videoFile || !videoTitle}
                        className="w-full bg-gradient-to-r from-fuchsia-600 to-pink-500 hover:from-fuchsia-500 hover:to-pink-400 text-white py-4 rounded-xl font-bold text-lg shadow-xl shadow-pink-900/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4 transform active:scale-95"
                    >
                        {uploading ? "Processando..." : "Publicar Reel"}
                    </button>
                </div>
           </div>
       )}

       {/* PACK TAB */}
       {activeTab === 'PACK' && (
           <div className="px-6 space-y-6">
               <p className="text-zinc-400 text-sm mb-2">Monetize seu conteúdo exclusivo criando packs.</p>
               
               <div className="bg-zinc-900 border border-dashed border-zinc-800 rounded-2xl h-48 flex flex-col items-center justify-center cursor-pointer hover:bg-zinc-800/50 transition-colors group">
                   <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mb-3 group-hover:bg-zinc-700">
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                       </svg>
                   </div>
                   <p className="text-zinc-500 text-sm font-medium">Toque para adicionar capa</p>
                   <p className="text-zinc-600 text-xs mt-1">ou arraste arquivos</p>
               </div>

               <div className="space-y-4">
                   <div>
                       <label className="block text-zinc-500 text-xs font-bold mb-2 uppercase">Nome do Pack</label>
                       <input 
                           type="text" 
                           value={packTitle}
                           onChange={(e) => setPackTitle(e.target.value)}
                           className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500 placeholder-zinc-600"
                           placeholder="Ex: Ensaio Urbano Exclusivo"
                       />
                   </div>
                   
                   <div>
                       <label className="block text-zinc-500 text-xs font-bold mb-2 uppercase">Valor (CRISEX)</label>
                       <div className="relative">
                            <span className="absolute left-4 top-3.5 text-pink-500 font-bold">💎</span>
                            <input 
                                type="number" 
                                value={packPrice}
                                onChange={(e) => setPackPrice(e.target.value)}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-pink-500 placeholder-zinc-600"
                                placeholder="499"
                            />
                       </div>
                   </div>

                   <button 
                       onClick={handleCreatePack}
                       className="w-full bg-zinc-100 text-zinc-900 py-4 rounded-xl font-bold text-lg hover:bg-white transition-colors mt-4"
                   >
                       Criar Pack
                   </button>
               </div>
           </div>
       )}

       {/* LIVE TAB */}
       {activeTab === 'LIVE' && (
           <div className="px-6 space-y-6 flex flex-col items-center">
               <div className="w-32 h-32 rounded-full border-4 border-zinc-800 p-1 mb-4">
                    <img 
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                        alt="User" 
                        className="w-full h-full rounded-full object-cover"
                    />
               </div>
               
               <div className="w-full">
                   <label className="block text-zinc-500 text-xs font-bold mb-2 uppercase text-center">Título da Live</label>
                   <input 
                       type="text" 
                       value={liveTitle}
                       onChange={(e) => setLiveTitle(e.target.value)}
                       className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white text-center focus:outline-none focus:border-pink-500 placeholder-zinc-600"
                       placeholder="Sobre o que vamos conversar hoje?"
                   />
               </div>

               {/* Live Mode Selection */}
               <div className="w-full">
                   <label className="block text-zinc-500 text-[10px] font-bold mb-2 uppercase tracking-wider text-center">Modo de Transmissão</label>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                        <button 
                            onClick={() => setLiveMode('PUBLIC')}
                            className={`p-3 rounded-xl border flex flex-col items-center justify-center transition-all ${
                                liveMode === 'PUBLIC' 
                                ? 'bg-zinc-800 border-white text-white' 
                                : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:bg-zinc-800'
                            }`}
                        >
                            <span className="text-lg mb-1">📡</span>
                            <span className="text-xs font-bold">Público</span>
                        </button>
                        <button 
                            onClick={() => setLiveMode('PRIVATE')}
                            className={`p-3 rounded-xl border flex flex-col items-center justify-center transition-all ${
                                liveMode === 'PRIVATE' 
                                ? 'bg-pink-900/20 border-pink-500 text-pink-500' 
                                : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:bg-zinc-800'
                            }`}
                        >
                            <span className="text-lg mb-1">🔒</span>
                            <span className="text-xs font-bold">Privado</span>
                        </button>
                    </div>

                    {/* Private Price Input */}
                    {liveMode === 'PRIVATE' && (
                        <div className="animate-fade-in-down mb-2">
                            <label className="block text-pink-500 text-[10px] font-bold mb-2 uppercase tracking-wider text-center">Cobrança por Minuto (PROTO)</label>
                            <div className="relative">
                                <span className="absolute left-4 top-3.5 text-pink-500 font-bold text-sm">💎</span>
                                <input 
                                    type="number" 
                                    value={livePrice}
                                    onChange={(e) => setLivePrice(e.target.value)}
                                    className="w-full bg-zinc-900 border border-pink-500/50 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-pink-500 placeholder-zinc-600 text-center"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>
                    )}
               </div>

               <div className="flex items-center space-x-2 bg-zinc-900 px-4 py-2 rounded-lg border border-zinc-800">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                    <span className="text-zinc-400 text-xs">Microfone Ativo</span>
               </div>

               <button 
                   onClick={handleStartLive}
                   className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white py-4 rounded-xl font-bold text-lg shadow-xl shadow-red-900/30 transition-all transform hover:scale-105"
               >
                   Iniciar Transmissão
               </button>
           </div>
       )}
    </div>
  );
};
