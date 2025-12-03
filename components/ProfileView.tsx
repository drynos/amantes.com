import React, { useState } from 'react';
import { saveUserProfile } from '../services/apiService';

interface ProfileViewProps {
  userImages: string[];
}

export const ProfileView: React.FC<ProfileViewProps> = ({ userImages }) => {
  const [saving, setSaving] = useState(false);

  const handleSettings = async () => {
    setSaving(true);
    // Dados que seriam enviados para o DynamoDB via Lambda
    const userData = {
      userId: "user_123", // Em um app real, viria da autenticação
      name: "Maria Eduarda",
      stats: {
        videos: 142,
        followers: 12400,
        crisex: 45230
      },
      lastBackup: new Date().toISOString()
    };

    try {
        await saveUserProfile(userData);
        alert("Dados sincronizados com a nuvem (AWS DynamoDB) com sucesso!");
    } catch (e) {
        alert("Erro ao salvar na nuvem.");
    } finally {
        setSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 overflow-y-auto pb-20 scrollbar-hide">
      {/* Header */}
      <div className="flex items-center justify-between p-4 sticky top-0 bg-zinc-950/90 backdrop-blur-md z-10">
        <h1 className="text-xl font-bold text-white">Perfil</h1>
        <button 
            onClick={handleSettings}
            disabled={saving}
            className="text-zinc-400 hover:text-white transition-colors p-2 rounded-full hover:bg-zinc-800 disabled:opacity-50"
            title="Sincronizar com Nuvem"
        >
          {saving ? (
             <span className="block w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          ) : (
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
             </svg>
          )}
        </button>
      </div>

      {/* Profile Card */}
      <div className="mx-4 mt-2 p-5 bg-[#1a1a20] rounded-2xl border border-zinc-800/50 shadow-lg">
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-full p-[2px] bg-gradient-to-tr from-fuchsia-600 to-pink-500">
               <img 
                 src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                 alt="Profile" 
                 className="w-full h-full rounded-full object-cover border-2 border-zinc-900"
               />
            </div>
            <div className="absolute bottom-0 right-0 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center border-2 border-zinc-900 text-[10px] text-white">
                🔗
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-white">Maria Eduarda</h2>
            <p className="text-zinc-500 text-sm">@mariaeduarda</p>
            <p className="text-zinc-300 text-xs mt-1 truncate">
              Criadora de conteúdo 📸 | Apaixonada por dança 💃
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex justify-between px-2 mb-6 border-t border-b border-zinc-800 py-4">
          <div className="text-center">
            <p className="flex items-center justify-center text-white font-bold space-x-1">
                <span className="text-pink-500">📹</span> <span>142</span>
            </p>
            <p className="text-[10px] text-zinc-500 uppercase tracking-wider mt-1">Videos</p>
          </div>
          <div className="text-center">
            <p className="flex items-center justify-center text-white font-bold space-x-1">
                <span className="text-pink-500">👥</span> <span>12.400</span>
            </p>
            <p className="text-[10px] text-zinc-500 uppercase tracking-wider mt-1">Seguidores</p>
          </div>
          <div className="text-center">
            <p className="flex items-center justify-center text-white font-bold space-x-1">
                <span className="text-pink-500">💎</span> <span>45.230</span>
            </p>
            <p className="text-[10px] text-zinc-500 uppercase tracking-wider mt-1">CRISEX</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-3">
          <button className="flex-1 bg-gradient-to-r from-fuchsia-600 to-pink-500 text-white py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-pink-900/20 active:opacity-90 transition-opacity">
            Editar Perfil
          </button>
          <button className="flex-1 bg-zinc-900 text-zinc-200 py-2.5 rounded-xl text-sm font-semibold border border-zinc-800 active:bg-zinc-800 transition-colors">
            Compartilhar
          </button>
        </div>
      </div>

      {/* Shop Section */}
      <div className="mt-8 px-4">
        <div className="flex items-center justify-between mb-4">
           <h3 className="text-white font-bold flex items-center space-x-2">
               <span className="text-pink-500">🛍️</span>
               <span>Minha Loja</span>
           </h3>
           <button className="text-xs text-blue-400 font-medium hover:text-blue-300">Ver todos</button>
        </div>
        
        <div className="flex space-x-3 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
            {[1, 2, 3].map(i => (
                <div key={i} className="min-w-[140px] h-40 bg-zinc-900 rounded-xl border border-zinc-800 relative group overflow-hidden shadow-lg">
                    <img 
                        src={`https://source.unsplash.com/random/300x400?fashion,dark&sig=${i}`} 
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity"
                        alt={`Pack ${i}`}
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x400/18181b/ffffff?text=Pack';
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
                    <span className="absolute top-2 left-2 text-white text-[10px] font-bold bg-pink-600 px-2 py-0.5 rounded-full">New</span>
                    <span className="absolute bottom-3 left-3 text-white text-sm font-bold">Pack {i}</span>
                    <div className="absolute bottom-3 right-3 text-zinc-400">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                         </svg>
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* Videos Section */}
      <div className="mt-4 px-4">
        <h3 className="text-white font-bold mb-4">Meus Vídeos</h3>
        <div className="grid grid-cols-3 gap-2">
            {/* User Generated Images First */}
            {userImages.map((img, idx) => (
                <div key={`gen-${idx}`} className="aspect-[3/4] bg-zinc-900 rounded-lg overflow-hidden relative border border-zinc-800 group">
                    <img src={img} alt="Generated" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                    <div className="absolute bottom-1 left-2 flex items-center space-x-1">
                         <div className="w-3 h-3 bg-pink-500 rounded-full flex items-center justify-center">
                            <span className="text-[6px] text-white">★</span>
                         </div>
                        <span className="text-white text-[10px] font-bold shadow-black drop-shadow-md">AI</span>
                    </div>
                </div>
            ))}
            
            {/* Mock Placeholders */}
            {[...Array(6)].map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-[#1a1a20] rounded-lg overflow-hidden relative border border-zinc-800/50 group hover:border-zinc-600 transition-colors">
                    <div className="absolute inset-0 flex items-center justify-center text-zinc-700 bg-zinc-900">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div className="absolute bottom-1 left-2 flex items-center space-x-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white drop-shadow-md" viewBox="0 0 20 20" fill="currentColor">
                             <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                             <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-white text-[10px] font-bold drop-shadow-md">{10 + i * 5}K</span>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};