import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Bookmark } from 'lucide-react';
import { entries, Entry } from './entries';

export default function App() {
  const [currentPage, setCurrentPage] = useState(0);
  const [bookmarkedPage, setBookmarkedPage] = useState<number | null>(null);
  const [pages, setPages] = useState<any[]>([]);

  useEffect(() => {
    const generatedPages: any[] = [];
    generatedPages.push({ type: 'cover' });
    generatedPages.push({ type: 'intro' });
    
    // Index pages
    const entriesPerPage = 10;
    for (let i = 0; i < entries.length; i += entriesPerPage) {
      generatedPages.push({
        type: 'index',
        indexEntries: entries.slice(i, i + entriesPerPage),
        startIndex: i
      });
    }

    entries.forEach((entry, idx) => {
      const pageWeightLimit = 900; // Lowered to ensure text doesn't hit the bottom
      let entryText = entry.texto;
      let chunkIdx = 0;
      
      while (entryText.length > 0) {
        let weightedLength = 0;
        let splitPos = 0;

        // Lógica de Peso: Caracteres + Penalidade por Quebras de Linha
        for (let i = 0; i < entryText.length; i++) {
          weightedLength += 1;
          if (entryText[i] === '\n') {
            weightedLength += 60; // Increased penalty for line breaks to save vertical space
          }

          if (weightedLength > pageWeightLimit) {
            splitPos = i;
            break;
          }
          splitPos = i + 1;
        }

        // Tenta não cortar palavras no meio
        if (splitPos < entryText.length) {
          const lastSpace = entryText.lastIndexOf(' ', splitPos);
          if (lastSpace > splitPos * 0.7) {
            splitPos = lastSpace;
          }
        }

        generatedPages.push({
          type: 'entry',
          title: entry.titulo,
          date: entry.data,
          text: entryText.substring(0, splitPos),
          isContinuation: chunkIdx > 0,
          originalIndex: idx
        });

        entryText = entryText.substring(splitPos).trim();
        chunkIdx++;
      }
    });

    generatedPages.push({ type: 'conclusion' });
    setPages(generatedPages);

    const saved = localStorage.getItem('fuguete_bookmark');
    if (saved) {
      const pageNum = parseInt(saved, 10);
      setBookmarkedPage(pageNum);
      setCurrentPage(pageNum);
    }
  }, []);

  const handleNext = () => {
    if (currentPage < pages.length - 1) setCurrentPage(currentPage + 1);
  };

  const handlePrev = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  const toggleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (bookmarkedPage === currentPage) {
      setBookmarkedPage(null);
      localStorage.removeItem('fuguete_bookmark');
    } else {
      setBookmarkedPage(currentPage);
      localStorage.setItem('fuguete_bookmark', currentPage.toString());
    }
  };

  const goToEntry = (entryIdx: number) => {
    const pageIndex = pages.findIndex((p: any) => p.type === 'entry' && p.originalIndex === entryIdx);
    if (pageIndex !== -1) setCurrentPage(pageIndex);
  };

  return (
    <div 
      className="fixed inset-0 w-full h-full flex items-center justify-center overflow-hidden font-serif"
      style={{
        backgroundColor: '#1a0f0a',
        backgroundImage: 'radial-gradient(circle, #2d1b11 0%, #1a0f0a 100%)'
      }}
    >
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none" 
        style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 0px, #000 2px, transparent 2px, transparent 4px)' }}
      />

      {/* Book Container */}
      <div className="relative w-[1100px] h-[820px] max-w-[95vw] max-h-[92vh] flex shadow-[0_50px_100px_-20px_rgba(0,0,0,0.7)] transform scale-90 md:scale-100 transition-transform">
        
        {/* Bookmark Ribbon */}
        <div 
          onClick={toggleBookmark}
          className={`absolute -top-4 right-12 w-8 h-40 bg-[#8b0000] shadow-md z-30 transition-all duration-500 cursor-pointer flex flex-col items-center pt-2 ${bookmarkedPage === currentPage ? 'translate-y-4' : '-translate-y-32 opacity-40 hover:-translate-y-28'}`}
        >
          <div className="w-px h-full bg-[#a52a2a] opacity-30"></div>
          <div className="absolute bottom-0 left-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-b-[16px] border-b-[#1a0f0a]"></div>
        </div>

        {/* LEFT PAGE (N-1) */}
        <div 
          className="w-1/2 h-full bg-[#f2e8c9] border-r border-black/10 relative px-8 md:px-12 py-8 md:pt-10 md:pb-16 flex flex-col"
          style={{ boxShadow: 'inset -20px 0 30px -10px rgba(0,0,0,0.2)' }}
        >
          <div className="absolute inset-0 opacity-40 pointer-events-none" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=\"0 0 200 200\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"n\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.65\"/%3E%3C/filter%3E%3Crect width=\"100%25\" height=\"100%25\" filter=\"url(%23n)\" opacity=\"0.05\"/%3E%3C/svg%3E')" }}></div>
          <PageContent page={pages[currentPage - 1]} pageNumber={currentPage} isLeft goToEntry={goToEntry} />
        </div>

        {/* RIGHT PAGE (N) Content */}
        <div 
          className="w-1/2 h-full bg-[#f4ecd8] relative px-8 md:px-12 py-8 md:pt-10 md:pb-16 flex flex-col"
          style={{ boxShadow: 'inset 20px 0 30px -10px rgba(0,0,0,0.2)', borderLeft: '1px solid rgba(0,0,0,0.1)' }}
        >
          <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=\"0 0 200 200\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"n\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.8\"/%3E%3C/filter%3E%3Crect width=\"100%25\" height=\"100%25\" filter=\"url(%23n)\" opacity=\"0.05\"/%3E%3C/svg%3E')" }}></div>
          <PageContent page={pages[currentPage]} pageNumber={currentPage + 1} isLeft={false} goToEntry={goToEntry} />
        </div>

        {/* Decorative Controls Mockup */}
        <div className="absolute -left-16 top-1/2 -translate-y-1/2 flex flex-col space-y-4">
          <button 
            onClick={handlePrev}
            className="w-10 h-10 rounded-full border border-white/20 text-white/40 hover:text-white transition-colors flex items-center justify-center disabled:opacity-5"
            disabled={currentPage <= 0}
          >
            ←
          </button>
        </div>
        <div className="absolute -right-16 top-1/2 -translate-y-1/2 flex flex-col space-y-4">
          <button 
            onClick={handleNext}
            className="w-10 h-10 rounded-full border border-white/20 text-white/40 hover:text-white transition-colors flex items-center justify-center disabled:opacity-5"
            disabled={currentPage >= pages.length - 1}
          >
            →
          </button>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-6 text-[10px] uppercase tracking-[0.3em] text-white/30">
        <span>Próxima Página [Setas]</span>
        <span>•</span>
        <span>Salvar Marcador [Clique na Fita]</span>
      </div>
    </div>
  );
}

function PageContent({ page, pageNumber, isLeft, goToEntry }: { page: any, pageNumber: number, isLeft: boolean, goToEntry: (idx: number) => void }) {
  if (!page) return <div className="flex-1" />;

  switch (page.type) {
    case 'cover':
      return (
        <div className="flex-1 flex flex-col items-center justify-center text-center border-2 border-[#d1c4a5]/30 m-4 p-8">
           <h2 className="text-xs uppercase tracking-[0.2em] text-[#8c7e60] mb-8 font-sans">Arquivo Pessoal</h2>
           <h1 className="text-5xl font-bold text-[#3d2b1f] tracking-tight mb-4">Diário do Fuguete</h1>
           <div className="w-24 h-px bg-[#d1c4a5] my-6"></div>
           <p className="text-[#8c7e60] italic text-lg leading-relaxed max-w-sm">
             \"2006 — as noites que não devíamos lembrar, mas não conseguimos esquecer\"
           </p>
        </div>
      );
    case 'intro':
      return (
        <div className="flex-1 flex flex-col relative z-10">
          <header className="mb-8 border-b border-[#d1c4a5] pb-4 text-center">
            <h2 className="text-xs uppercase tracking-[0.2em] text-[#8c7e60] mb-2 font-sans">2006 — Noites Inesquecíveis</h2>
            <h1 className="text-3xl font-bold text-[#3d2b1f] tracking-tight">Prefácio</h1>
          </header>
          <div className="flex-1 text-[#2c1e14] leading-relaxed space-y-4 text-sm md:text-base text-justify">
             <p>Este livro não é apenas uma coletânea de textos digitais; é o registro de uma época. Quando criei este espaço, o mundo parecia girar em um ritmo diferente. Entre um café e outro em Londrina, as palavras fluíam como as trilhas sonoras que marcaram nossas vidas.</p>
             <p>Ao ler estas páginas, é preciso considerar o contexto de quem eramos. Naquela época, a vida era vivida com uma certa inconsequência, talvez com alguns excessos de bebidas e noites que pareciam não ter fim. Eram outros tempos, outras intensidades. Hoje, o olhar é diferente. A maturidade trouxe um novo ritmo, mas as memórias daqueles excessos e daquela liberdade ainda vibram nestes textos como um registro honesto de uma fase que passou, mas que foi essencial para nos tornarmos quem somos agora.</p>
          </div>
          <footer className="mt-auto text-center pt-4">
            <span className="text-[#8c7e60] text-sm tracking-widest">— {pageNumber} —</span>
          </footer>
        </div>
      );
    case 'index':
      return (
        <div className="flex-1 flex flex-col relative z-10">
          <header className="mb-8 border-b border-[#d1c4a5] pb-4 text-center">
            <h2 className="text-xs uppercase tracking-[0.1em] text-[#8c7e60] mb-2 font-sans italic">Memórias Digitais</h2>
            <h1 className="text-3xl font-bold text-[#3d2b1f] tracking-tight">Índice</h1>
          </header>
          <nav className="flex-1 overflow-hidden">
            <ul className="space-y-2">
              {page.indexEntries.map((entry: any, idx: number) => {
                const globalIdx = page.startIndex + idx;
                return (
                  <li 
                    key={globalIdx} 
                    onClick={() => goToEntry(globalIdx)}
                    className="flex items-baseline group cursor-pointer border-b border-dotted border-[#d1c4a5]/40 pb-1"
                  >
                    <span className="text-[#8c7e60] text-[10px] tabular-nums mr-2">{String(globalIdx + 1).padStart(2, '0')}.</span>
                    <span className="flex-1 text-sm font-medium text-[#4a3728] group-hover:text-black transition-colors truncate">
                      {entry.titulo || "Sem título"}
                    </span>
                    <span className="text-[#8c7e60] text-[9px] ml-2 italic whitespace-nowrap opacity-60">{entry.data.split(' ')[0]}</span>
                  </li>
                );
              })}
            </ul>
          </nav>
          <footer className="mt-auto text-center pt-2">
            <span className="text-[#8c7e60] text-sm tracking-widest">— {pageNumber} —</span>
          </footer>
        </div>
      );
    case 'entry':
      const renderFormattedText = (text: string) => {
        return text.split('\n').map((line, i) => {
          const trimmed = line.trim();
          if (!trimmed) return <div key={i} className="h-2" />;

          // Padrão de Diálogo (Nome: Texto ou - Nome: Texto ou - Texto)
          const dialogueMatch = trimmed.match(/^([- ]+)?([^:]+):(.+)$/);
          const isDashDialogue = trimmed.startsWith('- ') && !dialogueMatch;
          
          if (dialogueMatch && dialogueMatch[2].length < 30) {
            return (
              <div key={i} className="pl-6 border-l-[3px] border-[#d1c4a5] italic my-4 text-[#4a3728] leading-relaxed relative">
                <span className="font-bold not-italic text-[#3d2b1f] uppercase text-[10px] tracking-wider block mb-1">
                  {dialogueMatch[2].replace('-', '').trim()}
                </span>
                {dialogueMatch[3].trim()}
              </div>
            );
          }

          if (isDashDialogue) {
            return (
              <div key={i} className="pl-6 italic my-3 text-[#4a3728] leading-relaxed relative before:content-['—'] before:absolute before:left-0 before:not-italic before:text-[#d1c4a5]">
                {trimmed.substring(1).trim()}
              </div>
            );
          }

          // Citações ou Versos
          if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
            return <p key={i} className="italic text-center my-6 text-[#3d2b1f] px-8 text-lg font-medium tracking-tight">“{trimmed.replace(/"/g, '')}”</p>;
          }

          return <p key={i} className="mb-4 leading-relaxed last:mb-0">{trimmed}</p>;
        });
      };

      return (
        <div className="flex-1 flex flex-col relative z-10">
          <header className="mb-6 flex justify-between items-center">
            <span className="text-[#8c7e60] text-xs font-sans tracking-tighter italic">{page.date}</span>
            <div className="w-8 h-8 rounded-full border border-[#d1c4a5] flex items-center justify-center">
               <span className="text-[10px] text-[#8c7e60]">FGT</span>
            </div>
          </header>
          <main className="flex-1 leading-relaxed text-[#2c1e14] overflow-y-auto no-scrollbar text-sm md:text-base selection:bg-[#8b0000]/10">
            {!page.isContinuation && (
              <h3 className="text-2xl font-bold mb-3 italic tracking-tight">{page.title}</h3>
            )}
            <div className="text-justify relative pb-4">
              {!page.isContinuation && (
                <span className="float-left text-6xl font-bold leading-[0.8] mr-2 mt-1 text-[#3d2b1f] font-serif">
                  {page.text.trim().charAt(0)}
                </span>
              )}
              {renderFormattedText(page.isContinuation ? page.text : page.text.trim().substring(1))}
            </div>
          </main>
          <footer className="mt-auto text-center pt-2">
            <span className="text-[#8c7e60] text-sm tracking-widest">— {pageNumber} —</span>
          </footer>
        </div>
      );
    case 'conclusion':
      return (
        <div className="flex-1 flex flex-col items-center justify-center text-center">
           <div className="text-[#d1c4a5] text-5xl mb-6">❧</div>
           <p className="text-[#8c7e60] italic">Fim das memórias de 2006.</p>
           <footer className="mt-auto text-center w-full">
            <span className="text-[#8c7e60] text-sm tracking-widest">— {pageNumber} —</span>
          </footer>
        </div>
      );
    default: return <div />
  }
}
