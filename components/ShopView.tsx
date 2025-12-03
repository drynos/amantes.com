import React, { useState } from 'react';

interface PackItem {
  id: string;
  title: string;
  author: string;
  price: number;
  coverImage: string;
  images: string[];
  description: string;
  category: string;
}

// Mock Data
const MOCK_PACKS: PackItem[] = [
  {
    id: '1',
    title: 'Ensaio Neon Cyberpunk',
    author: '@juliasilva',
    price: 450,
    category: 'Mulher',
    coverImage: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1974&auto=format&fit=crop',
    description: 'Um ensaio exclusivo com estética futurista, luzes neon e muita atitude. Contém 10 fotos em alta resolução.',
    images: Array(10).fill('https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1974&auto=format&fit=crop')
  },
  {
    id: '2',
    title: 'Casual Sunday Morning',
    author: '@marcos_fit',
    price: 300,
    category: 'Homens',
    coverImage: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?q=80&w=1974&auto=format&fit=crop',
    description: 'Rotina matinal fitness e casual. Fotos naturais e espontâneas.',
    images: Array(10).fill('https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?q=80&w=1974&auto=format&fit=crop')
  },
  {
    id: '3',
    title: 'Couple Goals Trip',
    author: '@casal_viajante',
    price: 899,
    category: 'Casal',
    coverImage: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=1974&auto=format&fit=crop',
    description: 'Nossa viagem romântica para Paris. Momentos íntimos e paisagens incríveis.',
    images: Array(10).fill('https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=1974&auto=format&fit=crop')
  },
  {
    id: '4',
    title: 'Vibes Urbanas',
    author: '@alex_trans',
    price: 550,
    category: 'Trans',
    coverImage: 'https://images.unsplash.com/photo-1573140247632-f84660f67126?q=80&w=1988&auto=format&fit=crop',
    description: 'Expressão e liberdade no centro da cidade.',
    images: Array(10).fill('https://images.unsplash.com/photo-1573140247632-f84660f67126?q=80&w=1988&auto=format&fit=crop')
  },
  {
    id: '5',
    title: 'Pride Parade Exclusive',
    author: '@lucas_pride',
    price: 200,
    category: 'Gays',
    coverImage: 'https://images.unsplash.com/photo-1573053986275-840ffc7cc685?q=80&w=1974&auto=format&fit=crop',
    description: 'Cobertura exclusiva e looks incríveis da parada.',
    images: Array(10).fill('https://images.unsplash.com/photo-1573053986275-840ffc7cc685?q=80&w=1974&auto=format&fit=crop')
  }
];

const CATEGORIES = ['Homens', 'Casal', 'Mulher', 'Gays', 'Lésbicas', 'Trans'];

export const ShopView: React.FC = () => {
  const [selectedPack, setSelectedPack] = useState<PackItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('Todos');

  // Internal Page View
  if (selectedPack) {
    return (
      <div className="flex flex-col h-full bg-zinc-950 overflow-y-auto pb-20 relative animate-fade-in">
        {/* Header with Back Button */}
        <div className="absolute top-0 left-0 p-4 z-20">
          <button 
            onClick={() => setSelectedPack(null)}
            className="bg-black/50 backdrop-blur-md p-2 rounded-full text-white hover:bg-black/70 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* Main Cover */}
        <div className="h-96 w-full relative shrink-0">
          <img 
            src={selectedPack.coverImage} 
            alt={selectedPack.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent"></div>
          
          <div className="absolute bottom-0 left-0 p-6 w-full">
            <span className="bg-pink-600 text-white text-xs font-bold px-2 py-1 rounded-md mb-2 inline-block shadow-lg">
              {selectedPack.category}
            </span>
            <h1 className="text-3xl font-bold text-white mb-1 shadow-black drop-shadow-md">{selectedPack.title}</h1>
            <p className="text-zinc-300 font-medium flex items-center shadow-black drop-shadow-md">
              <span className="mr-2">por</span> 
              <span className="text-pink-400">{selectedPack.author}</span>
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4 flex-1">
          <div className="flex items-center justify-between mb-6 bg-zinc-900 p-4 rounded-xl border border-zinc-800">
             <div>
                <p className="text-zinc-400 text-xs uppercase font-bold">Valor do Pack</p>
                <div className="flex items-center space-x-1">
                    <span className="text-pink-500 text-xl">💎</span>
                    <span className="text-2xl font-bold text-white">{selectedPack.price}</span>
                    <span className="text-xs text-zinc-500 font-bold mt-2">CRISEX</span>
                </div>
             </div>
             <button className="bg-gradient-to-r from-fuchsia-600 to-pink-500 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-pink-900/30 active:scale-95 transition-transform">
                 COMPRAR
             </button>
          </div>

          <div className="mb-8">
            <h3 className="text-white font-bold mb-2">Descrição</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              {selectedPack.description}
            </p>
          </div>

          <div>
             <h3 className="text-white font-bold mb-4 flex items-center justify-between">
                <span>Prévia do Conteúdo</span>
                <span className="text-xs text-zinc-500 font-normal">10 fotos</span>
             </h3>
             <div className="grid grid-cols-2 gap-3">
                {selectedPack.images.map((img, i) => (
                    <div key={i} className="aspect-[3/4] rounded-lg overflow-hidden relative border border-zinc-800 group">
                        <img src={`${img}&sig=${i}`} alt={`Preview ${i}`} className="w-full h-full object-cover opacity-50 blur-sm transition-all duration-500" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                             <span className="text-white text-xs font-bold bg-black/50 px-2 py-1 rounded border border-white/10">🔒 Bloqueado</span>
                        </div>
                    </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Shop View
  return (
    <div className="flex flex-col h-full bg-zinc-950 overflow-y-auto pb-20 scrollbar-hide">
      
      {/* Header */}
      <div className="p-4 pt-6 bg-zinc-950/90 backdrop-blur-md sticky top-0 z-10 border-b border-zinc-900 flex justify-between items-center">
         <h1 className="text-xl font-bold text-white">Loja de Packs 🛍️</h1>
         <div className="bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800 flex items-center space-x-2">
            <span className="text-pink-500 text-xs">💎</span>
            <span className="text-white text-xs font-bold">120</span>
         </div>
      </div>

      {/* Featured Slider (Top - 10 images) */}
      <div className="pt-4 pb-2">
          <div className="flex overflow-x-auto space-x-4 px-4 scrollbar-hide snap-x snap-mandatory">
              {[...Array(10)].map((_, i) => (
                  <div key={i} className="min-w-[85vw] h-48 rounded-2xl overflow-hidden relative shadow-lg shadow-pink-900/10 snap-center shrink-0 border border-zinc-800">
                      <img 
                        src={`https://images.unsplash.com/photo-1542206395-9feb3edaa68d?q=80&w=600&auto=format&fit=crop&sig=${i}`} 
                        className="w-full h-full object-cover"
                        alt={`Featured ${i}`} 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                      <div className="absolute bottom-4 left-4">
                          <span className="bg-pink-600 text-white text-[10px] font-bold px-2 py-0.5 rounded mb-1 inline-block">DESTAQUE #{i+1}</span>
                          <h2 className="text-xl font-bold text-white leading-tight">Pack Exclusivo {i+1}</h2>
                          <p className="text-zinc-300 text-xs">A partir de 💎 300</p>
                      </div>
                  </div>
              ))}
          </div>
      </div>

      {/* Categories (Middle) */}
      <div className="py-4 pl-4 overflow-x-auto whitespace-nowrap scrollbar-hide border-b border-zinc-900 sticky top-[60px] bg-zinc-950/95 z-10">
          <button 
             onClick={() => setActiveCategory('Todos')}
             className={`px-5 py-2 rounded-full text-xs font-bold mr-3 transition-colors ${
                 activeCategory === 'Todos' 
                 ? 'bg-white text-black' 
                 : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
             }`}
          >
              Todos
          </button>
          {CATEGORIES.map(cat => (
              <button 
                 key={cat}
                 onClick={() => setActiveCategory(cat)}
                 className={`px-5 py-2 rounded-full text-xs font-bold mr-3 transition-colors ${
                     activeCategory === cat 
                     ? 'bg-pink-600 text-white' 
                     : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
                 }`}
              >
                  {cat}
              </button>
          ))}
      </div>

      {/* Sections Helper (Bottom) */}
      {['Destaques', 'Recém Criados', 'Mais Vendidos'].map((section, idx) => (
        <div key={section} className="mt-4 mb-4">
            <div className="px-4 flex justify-between items-end mb-3">
                <h3 className="text-lg font-bold text-white">{section}</h3>
                <span className="text-xs text-pink-500 font-bold cursor-pointer hover:underline">Ver tudo</span>
            </div>
            
            <div className="flex overflow-x-auto space-x-4 pl-4 pr-4 scrollbar-hide">
                {MOCK_PACKS.map((pack, i) => (
                    <div 
                        key={`${section}-${pack.id}-${i}`}
                        onClick={() => setSelectedPack(pack)}
                        className="min-w-[160px] w-[160px] cursor-pointer group"
                    >
                        <div className="aspect-[3/4] rounded-xl overflow-hidden relative mb-2 border border-zinc-800 bg-zinc-900">
                            <img 
                                src={`${pack.coverImage}&sig=${i + idx}`} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                alt={pack.title}
                            />
                            <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-md border border-white/10 flex items-center space-x-1">
                                <span className="text-[10px] text-pink-400">💎</span>
                                <span className="text-[10px] text-white font-bold">{pack.price}</span>
                            </div>
                        </div>
                        <h4 className="text-white text-sm font-bold truncate">{pack.title}</h4>
                        <p className="text-zinc-500 text-xs truncate">{pack.author}</p>
                    </div>
                ))}
            </div>
        </div>
      ))}
    </div>
  );
};