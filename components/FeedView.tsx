import React, { useState, useEffect } from 'react';
import { LiveView } from './LiveView';

// Base templates for generating infinite feed content
const FEED_TEMPLATES = [
  {
    image: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?ixlib=rb-1.2.1&auto=format&fit=crop&w=668&q=80",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    username: "@juliasilva",
    description: "Aprendendo novos passos de dança com a IA! 💃 #dancachallenge #amantes",
    likes: 2456,
    comments: 189,
    isPro: true
  },
  {
    image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?ixlib=rb-1.2.1&auto=format&fit=crop&w=668&q=80",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    username: "@marcos_travel",
    description: "Cinque Terre é surreal! 🇮🇹 #travel #italy",
    likes: 12000,
    comments: 432,
    isPro: false
  },
  {
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-1.2.1&auto=format&fit=crop&w=668&q=80",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    username: "@ana_tech",
    description: "Meu setup novo tá ficando pronto 🖥️ #setup #tech",
    likes: 8500,
    comments: 95,
    isPro: true
  },
  {
    image: "https://images.unsplash.com/photo-1517849845537-4d257902454a?ixlib=rb-1.2.1&auto=format&fit=crop&w=668&q=80",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    username: "@dog_lover",
    description: "Dia de parque com o melhor amigo 🐶 #dog #pet",
    likes: 3200,
    comments: 210,
    isPro: false
  }
];

// Helper to format large numbers (e.g., 12000 -> 12K)
const formatNumber = (num: number) => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

const generateFeedItems = (count: number, startIndex: number) => {
  return Array.from({ length: count }).map((_, i) => {
    const template = FEED_TEMPLATES[(startIndex + i) % FEED_TEMPLATES.length];
    // Add some variation so duplicates aren't identical
    const variation = Math.floor(Math.random() * 1000);
    return {
      ...template,
      id: `feed-${startIndex + i}-${Date.now()}`,
      likes: template.likes + variation,
      comments: template.comments + Math.floor(variation / 10),
      // Append ID to image URL to avoid caching identical images if needed, or keep same
      image: `${template.image}&v=${startIndex + i}`
    };
  });
};

export const FeedView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'FOR_YOU' | 'FOLLOWING' | 'LIVES'>('FOR_YOU');
  
  // Initialize with 4 items
  const [items, setItems] = useState(() => generateFeedItems(4, 0));
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Infinite Scroll Handler
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (activeTab === 'LIVES') return;

    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    const threshold = clientHeight * 1.5; // Load more when 1.5 screens away from bottom

    if (scrollHeight - scrollTop <= clientHeight + threshold && !isLoadingMore) {
      loadMoreItems();
    }
  };

  const loadMoreItems = async () => {
    setIsLoadingMore(true);
    // Simulate network delay
    setTimeout(() => {
      const newItems = generateFeedItems(4, items.length);
      setItems(prev => [...prev, ...newItems]);
      setIsLoadingMore(false);
    }, 1000);
  };

  return (
    <div className="h-full relative bg-black">
       {/* Top Navigation Overlay */}
       <div className="absolute top-0 left-0 right-0 z-20 pt-6 pb-4 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
         <div className="flex items-center justify-center space-x-6 text-sm font-semibold pointer-events-auto">
           <button 
             onClick={() => setActiveTab('FOLLOWING')}
             className={`${activeTab === 'FOLLOWING' ? 'text-white scale-110' : 'text-zinc-400 hover:text-zinc-200'} transition-all`}
           >
             Seguindo
           </button>
           <button 
             onClick={() => setActiveTab('FOR_YOU')}
             className={`${activeTab === 'FOR_YOU' ? 'text-white border-b-2 border-white pb-1' : 'text-zinc-400 hover:text-zinc-200'} transition-all`}
           >
             Para Você
           </button>
           <button 
             onClick={() => setActiveTab('LIVES')}
             className={`${activeTab === 'LIVES' ? 'text-pink-500 border-b-2 border-pink-500 pb-1 animate-pulse' : 'text-zinc-400 hover:text-zinc-200'} transition-all flex items-center space-x-1`}
           >
             <div className="w-2 h-2 bg-pink-500 rounded-full shadow-[0_0_10px_#ec4899]"></div>
             <span>Lives</span>
           </button>
         </div>
         <div className="absolute top-6 right-4 text-white pointer-events-auto">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
         </div>
       </div>

       {/* Content */}
       <div className="h-full w-full">
         {activeTab === 'LIVES' ? (
           <LiveView />
         ) : (
           <div 
            className="h-full w-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
            onScroll={handleScroll}
           >
             {items.map((item, index) => (
                <div key={item.id} className="h-full w-full relative bg-zinc-900 snap-start shrink-0">
                    {/* Background Image with Lazy Loading Strategy */}
                    <div className="absolute inset-0 bg-zinc-900">
                        <img 
                            src={item.image} 
                            className="h-full w-full object-cover opacity-80"
                            alt="Feed Content"
                            // Eager load the first image for LCP, lazy load subsequent images
                            loading={index === 0 ? "eager" : "lazy"} 
                            decoding={index === 0 ? "sync" : "async"}
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60"></div>
                    </div>
                    
                    {/* Right Sidebar Actions */}
                    <div className="absolute bottom-24 right-2 flex flex-col items-center space-y-6 z-20">
                        <div className="flex flex-col items-center space-y-1 relative">
                        <div className="w-12 h-12 rounded-full p-[2px] bg-white">
                            <img 
                                src={item.avatar} 
                                className="w-full h-full rounded-full object-cover" 
                                alt="User" 
                                loading="lazy"
                            />
                        </div>
                        <div className="absolute -bottom-2 w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center text-white text-xs border border-black font-bold">
                            +
                        </div>
                        </div>
                        
                        <div className="flex flex-col items-center space-y-1">
                        <button className="p-3 rounded-full bg-white/10 backdrop-blur-sm active:scale-90 transition-transform">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white fill-white" viewBox="0 0 24 24">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                            </svg>
                        </button>
                        <span className="text-white text-xs font-bold shadow-black drop-shadow-md">{formatNumber(item.likes)}</span>
                        </div>

                        <div className="flex flex-col items-center space-y-1">
                        <button className="p-3 rounded-full bg-white/10 backdrop-blur-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white fill-white" viewBox="0 0 24 24">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                            </svg>
                        </button>
                        <span className="text-white text-xs font-bold shadow-black drop-shadow-md">{formatNumber(item.comments)}</span>
                        </div>

                        <div className="flex flex-col items-center space-y-1">
                        <button className="p-3 rounded-full bg-white/10 backdrop-blur-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                            </svg>
                        </button>
                        <span className="text-white text-xs font-bold shadow-black drop-shadow-md">Share</span>
                        </div>
                    </div>

                    {/* Bottom Info Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 pb-24 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10">
                        <div className="mb-4">
                            <button className="bg-gradient-to-r from-fuchsia-600 to-pink-500 text-white font-bold py-2 px-6 rounded-full shadow-lg shadow-pink-500/30 flex items-center space-x-2 transform active:scale-95 transition-transform animate-bounce-slight border border-pink-400/50">
                                <span>💖</span>
                                <span>+342 CRISEX</span>
                            </button>
                        </div>
                        
                        <div className="flex flex-col items-start space-y-2 mb-2">
                            <div className="flex items-center space-x-2">
                                <h3 className="text-white font-bold text-lg shadow-black drop-shadow-md">{item.username}</h3>
                                {item.isPro && <span className="px-1.5 py-0.5 bg-pink-500 rounded text-[10px] font-bold text-white">PRO</span>}
                            </div>
                            <p className="text-white/90 text-sm line-clamp-2 shadow-black drop-shadow-md max-w-[80%]">
                                {item.description}
                            </p>
                        </div>

                        <div className="flex items-center space-x-3 mt-2">
                            <div className="flex items-center space-x-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white animate-spin-slow" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                                </svg>
                                <span className="text-xs text-white">Original Sound - Amantes AI</span>
                            </div>
                        </div>
                    </div>
                </div>
             ))}
             {isLoadingMore && (
               <div className="h-full w-full flex items-center justify-center bg-zinc-900 snap-start shrink-0">
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-zinc-400 text-sm font-medium">Carregando mais...</span>
                  </div>
               </div>
             )}
           </div>
         )}
       </div>
    </div>
  );
};