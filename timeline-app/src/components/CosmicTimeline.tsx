import React, { useRef } from 'react';
import type { TimelineEvent } from '../types';
import { CATEGORY_CONFIG, MOMENT_TAG_CONFIG } from '../types';
import { CategoryBadge } from './CategoryBadge';
import { Calendar, ChevronRight, Paperclip, Heart, DollarSign } from 'lucide-react';

interface CosmicTimelineProps {
  events: TimelineEvent[];
  onSelectEvent: (event: TimelineEvent) => void;
}

export const CosmicTimeline: React.FC<CosmicTimelineProps> = ({
  events,
  onSelectEvent
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Ordenar eventos pela data cronológica
  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const formatCurrency = (val?: number) => {
    if (val === undefined) return '';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(val);
  };

  const formatDate = (dateStr: string) => {
    try {
      const [year, month, day] = dateStr.split('-');
      return `${day}/${month}/${year}`;
    } catch {
      return dateStr;
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (containerRef.current) {
      containerRef.current.scrollLeft += e.deltaY * 1.5;
    }
  };

  return (
    <div className="relative w-full h-[65vh] min-h-[480px] flex flex-col justify-center select-none overflow-hidden">
      {/* Guia sutil da linha de tempo cósmica (Eixo central com gradiente e glow) */}
      <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500/0 via-blue-400/25 to-pink-500/0 -translate-y-1/2 pointer-events-none z-10">
        <div className="absolute inset-0 bg-blue-400/15 blur-sm" />
      </div>

      {/* Container rolável da Linha do Tempo */}
      <div
        ref={containerRef}
        onWheel={handleWheel}
        className="w-full h-full overflow-x-auto overflow-y-hidden flex items-center px-16 sm:px-32 scroll-smooth no-scrollbar cursor-grab active:cursor-grabbing z-20"
      >
        <div className="flex items-center gap-16 sm:gap-24 relative py-20 min-w-max">
          {sortedEvents.map((item, index) => {
            const isTop = index % 2 === 0;
            const isMoment = item.eventType === 'moment';

            const config = isMoment
              ? (item.momentTag ? MOMENT_TAG_CONFIG[item.momentTag] : MOMENT_TAG_CONFIG.afeto)
              : (item.category ? CATEGORY_CONFIG[item.category] : CATEGORY_CONFIG.outros);

            return (
              <div
                key={item.id}
                className="relative flex flex-col items-center group"
                style={{ width: '280px' }}
              >
                {/* Card Posicionado (Acima ou Abaixo do Eixo) */}
                <div
                  onClick={() => onSelectEvent(item)}
                  className={`cursor-pointer transition-all duration-300 transform group-hover:scale-105 active:scale-95 ${
                    isTop ? 'mb-12 origin-bottom' : 'mt-12 origin-top order-3'
                  }`}
                >
                  <div 
                    className="p-5 rounded-2xl bg-zinc-950/75 border border-white/10 backdrop-blur-xl shadow-xl hover:border-white/30 transition-all w-[280px] relative overflow-hidden"
                    style={{
                      boxShadow: `0 12px 35px -10px ${config.bgGlow}, 0 0 1px 1px rgba(255,255,255,0.06)`
                    }}
                  >
                    {/* Tarja indicadora de tipo */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[11px] font-mono text-zinc-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-zinc-500" />
                        {formatDate(item.date)}
                      </span>

                      {isMoment ? (
                        <CategoryBadge type="moment" momentTag={item.momentTag} className="!text-[10px] !py-0.5 !px-2" />
                      ) : (
                        <CategoryBadge type="category" category={item.category} className="!text-[10px] !py-0.5 !px-2" />
                      )}
                    </div>

                    <h3 className="text-sm font-semibold text-white tracking-tight line-clamp-1 mb-1">
                      {item.title}
                    </h3>

                    {/* Exibe Valor Financeiro ou Destaque Afetivo */}
                    {isMoment ? (
                      <div className="flex items-center gap-1.5 text-xs font-medium text-pink-400 my-1.5">
                        <Heart className="w-3.5 h-3.5 fill-pink-400/20" />
                        <span className="capitalize">{item.emotion ? `Sentimento: ${item.emotion}` : 'Memória Especial'}</span>
                      </div>
                    ) : (
                      <div 
                        className="text-lg font-bold font-mono tracking-tight my-1"
                        style={{ color: config.color }}
                      >
                        {formatCurrency(item.amount)}
                      </div>
                    )}

                    <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed font-light mb-3">
                      {item.description}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px] text-zinc-400">
                      <span className="flex items-center gap-1">
                        {item.attachments.length > 0 && (
                          <>
                            <Paperclip className="w-3 h-3 text-blue-400" />
                            {item.attachments.length} foto/anexo
                          </>
                        )}
                      </span>

                      <span className="text-blue-400/90 group-hover:text-blue-300 flex items-center gap-0.5 font-medium">
                        Ver detalhes <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>

                {/* Haste conectora do nó até a linha */}
                <div
                  className={`w-[1px] bg-gradient-to-b ${
                    isTop 
                      ? 'from-transparent via-white/20 to-white/60 -mb-2' 
                      : 'from-white/60 via-white/20 to-transparent -mt-2 order-2'
                  } h-8 transition-opacity duration-300 group-hover:opacity-100 opacity-40`}
                />

                {/* Ponto / Estrela Luminosa Central na Linha */}
                <button
                  onClick={() => onSelectEvent(item)}
                  className={`relative flex items-center justify-center p-2 rounded-full cursor-pointer transition-transform duration-300 group-hover:scale-125 ${
                    isTop ? 'order-2' : 'order-1'
                  }`}
                  aria-label={item.title}
                >
                  {/* Anel Orbital */}
                  <div 
                    className="w-7 h-7 rounded-full border border-white/30 animate-pulse transition-all duration-300 group-hover:scale-110 flex items-center justify-center"
                    style={{ borderColor: config.color }}
                  >
                    {isMoment ? (
                      <Heart className="w-2.5 h-2.5 text-pink-300" />
                    ) : (
                      <DollarSign className="w-2.5 h-2.5 text-blue-300" />
                    )}
                  </div>
                  {/* Núcleo Estelar com Glow */}
                  <div
                    className="absolute w-2.5 h-2.5 rounded-full bg-white shadow-lg transition-transform duration-300 group-hover:scale-125"
                    style={{
                      boxShadow: `0 0 16px ${config.color}, 0 0 30px ${config.color}`
                    }}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dica de interação sutil */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[11px] text-zinc-400/70 font-mono tracking-wider uppercase pointer-events-none flex items-center gap-2">
        <span>Arraste ou use a rolagem do mouse para navegar pelo tempo</span>
      </div>
    </div>
  );
};
