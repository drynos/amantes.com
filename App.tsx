import React, { useState } from 'react';
import { ApiKeyWrapper } from './components/ApiKeyWrapper';
import { ChatView } from './components/ChatView';
import { ImageGenView } from './components/ImageGenView';
import { ProfileView } from './components/ProfileView';
import { FeedView } from './components/FeedView';
import { AppMode } from './types';

function App() {
  const [mode, setMode] = useState<AppMode>(AppMode.HOME);
  const [userImages, setUserImages] = useState<string[]>([]);

  // Function to add generated images to the user's profile
  const handleImageGenerated = (newImages: string[]) => {
    setUserImages(prev => [...newImages, ...prev]);
    // Optionally switch to profile, but sticking to create flow is often better UX for tools
    // setMode(AppMode.PROFILE); 
  };

  const NavItem = ({ target, icon, label, isAction = false }: { target: AppMode; icon: React.ReactNode; label?: string; isAction?: boolean }) => {
    const isActive = mode === target;
    return (
      <button
        onClick={() => setMode(target)}
        className={`flex flex-col items-center justify-center w-full h-full space-y-1 relative ${isActive ? 'text-white' : 'text-zinc-500'}`}
      >
        {isAction ? (
          <div className="w-12 h-12 bg-gradient-to-tr from-fuchsia-600 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-pink-500/30 text-white mb-2 transform transition-transform hover:scale-105 active:scale-95 border border-pink-400/50">
             {icon}
          </div>
        ) : (
          <>
            <div className={`transition-all duration-200 ${isActive ? 'text-white scale-110' : 'text-zinc-500'}`}>
                {icon}
            </div>
            <span className={`text-[10px] font-medium transition-colors ${isActive ? 'text-white' : 'text-zinc-600'}`}>{label}</span>
          </>
        )}
      </button>
    );
  };

  return (
    <ApiKeyWrapper>
      <div className="flex flex-col h-screen w-screen bg-zinc-950 text-zinc-100 font-sans overflow-hidden">
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-hidden relative bg-zinc-950">
           {mode === AppMode.HOME && <FeedView />}
           
           {/* PACKS / SHOP VIEW (Previously Explore position) */}
           {mode === AppMode.SHOP && (
             <div className="h-full flex flex-col items-center justify-center text-zinc-500 space-y-4 p-8 text-center bg-zinc-950">
               <div className="w-20 h-20 bg-zinc-900 rounded-2xl flex items-center justify-center mb-4 border border-zinc-800 shadow-lg shadow-purple-900/10">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
               </div>
               <h2 className="text-2xl font-bold text-white">Loja de Packs</h2>
               <p className="text-sm text-zinc-400 max-w-xs mx-auto">Em breve você poderá adquirir conteúdo exclusivo dos seus criadores favoritos.</p>
               <button className="px-8 py-3 bg-gradient-to-r from-fuchsia-600 to-pink-500 text-white rounded-full text-sm font-bold shadow-lg shadow-pink-900/20 hover:opacity-90 transition-opacity">
                 Notifique-me
               </button>
             </div>
           )}

           {mode === AppMode.CREATE && <ImageGenView onImageGenerated={handleImageGenerated} />}
           
           {/* MESSAGES VIEW (Previously Packs position) */}
           {mode === AppMode.MESSAGES && <ChatView />}
           
           {mode === AppMode.PROFILE && <ProfileView userImages={userImages} />}
        </main>

        {/* Bottom Navigation */}
        <nav className="h-20 bg-zinc-950 border-t border-zinc-900 flex items-center justify-between px-2 pb-2 z-50 shrink-0">
          <NavItem 
            target={AppMode.HOME} 
            label="Home"
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={mode === AppMode.HOME ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={mode === AppMode.HOME ? 0 : 2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>}
          />
          
          {/* Pos 2: SHOP/PACKS */}
          <NavItem 
            target={AppMode.SHOP} 
            label="Packs"
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>}
          />
          
          <div className="w-16 flex justify-center -mt-6">
            <NavItem 
                target={AppMode.CREATE} 
                isAction={true}
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>}
            />
          </div>

          {/* Pos 4: MESSAGES */}
          <NavItem 
            target={AppMode.MESSAGES} 
            label="Mensagens"
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={mode === AppMode.MESSAGES ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={mode === AppMode.MESSAGES ? 0 : 2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>}
          />
          
          <NavItem 
            target={AppMode.PROFILE} 
            label="Perfil"
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={mode === AppMode.PROFILE ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={mode === AppMode.PROFILE ? 0 : 2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
          />
        </nav>

      </div>
    </ApiKeyWrapper>
  );
}

export default App;