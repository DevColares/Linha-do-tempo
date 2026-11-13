import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  CreditCard, 
  Paperclip, 
  FileText, 
  ExternalLink, 
  Sparkles,
  MapPin,
  Maximize2,
  Heart
} from 'lucide-react';
import type { TimelineEvent } from '../types';
import { CATEGORY_CONFIG, MOMENT_TAG_CONFIG } from '../types';
import { CategoryBadge } from './CategoryBadge';

interface EventDetailModalProps {
  event: TimelineEvent | null;
  onClose: () => void;
  onDelete?: (id: string) => void;
}

export const ExpenseDetailModal: React.FC<EventDetailModalProps> = ({ 
  event, 
  onClose,
  onDelete 
}) => {
  const [selectedPreview, setSelectedPreview] = useState<string | null>(null);

  if (!event) return null;

  const isMoment = event.eventType === 'moment';

  const config = isMoment
    ? (event.momentTag ? MOMENT_TAG_CONFIG[event.momentTag] : MOMENT_TAG_CONFIG.afeto)
    : (event.category ? CATEGORY_CONFIG[event.category] : CATEGORY_CONFIG.outros);

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

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl bg-zinc-950/95 sm:bg-zinc-950/85 border border-white/10 rounded-t-3xl sm:rounded-2xl p-5 sm:p-8 shadow-2xl backdrop-blur-2xl overflow-hidden max-h-[92vh] sm:max-h-[90vh] flex flex-col"
        style={{
          boxShadow: `0 25px 60px -15px ${config.bgGlow}, 0 0 1px 1px rgba(255,255,255,0.1)`
        }}
      >
        {/* Barra de arraste para mobile */}
        <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-3 sm:hidden" />

        {/* Glow de fundo */}
        <div 
          className="absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: config.color }}
        />

        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 pb-3 sm:pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2 flex-wrap">
              {isMoment ? (
                <>
                  <CategoryBadge type="moment" momentTag={event.momentTag} className="!text-[10px] !py-0.5 !px-2" />
                  <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-pink-400 font-semibold px-2 py-0.5 rounded-full bg-pink-500/10 border border-pink-500/20 flex items-center gap-1">
                    <Heart className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-pink-400/30" /> Momento
                  </span>
                </>
              ) : (
                <>
                  <CategoryBadge type="category" category={event.category} className="!text-[10px] !py-0.5 !px-2" />
                  {event.isEssential ? (
                    <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-emerald-400 font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                      Essencial
                    </span>
                  ) : (
                    <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-purple-400 font-semibold px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> Extra
                    </span>
                  )}
                </>
              )}
            </div>
            <h2 className="text-lg sm:text-2xl font-semibold text-white tracking-tight">
              {event.title}
            </h2>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conteúdo rolável */}
        <div className="overflow-y-auto py-4 sm:py-5 space-y-4 sm:space-y-6 flex-1 pr-1 overscroll-contain">
          {/* Card de Destaque */}
          <div className="flex items-center justify-between p-3.5 sm:p-4 rounded-xl bg-white/[0.03] border border-white/5">
            {isMoment ? (
              <div>
                <span className="text-[10px] sm:text-xs uppercase tracking-widest text-zinc-400 font-mono">Sentimento</span>
                <div className="text-lg sm:text-2xl font-bold tracking-tight mt-0.5 capitalize text-pink-300 flex items-center gap-1.5 sm:gap-2">
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-pink-400 fill-pink-400/40" />
                  {event.emotion || 'Afeto'}
                </div>
              </div>
            ) : (
              <div>
                <span className="text-[10px] sm:text-xs uppercase tracking-widest text-zinc-400 font-mono">Valor Total</span>
                <div 
                  className="text-2xl sm:text-3xl font-bold tracking-tight mt-0.5 font-mono"
                  style={{ color: config.color }}
                >
                  {formatCurrency(event.amount)}
                </div>
              </div>
            )}

            <div className="flex flex-col items-end text-[11px] sm:text-xs text-zinc-400 gap-1 font-mono">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-zinc-400" /> {formatDate(event.date)}
              </span>
              {!isMoment && event.paymentMethod && (
                <span className="flex items-center gap-1">
                  <CreditCard className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-zinc-400" /> {event.paymentMethod}
                </span>
              )}
            </div>
          </div>

          {/* Descrição / Memória */}
          <div>
            <h4 className="text-[10px] sm:text-xs uppercase tracking-wider text-zinc-400 font-mono mb-1.5 sm:mb-2">
              {isMoment ? 'História & Memória' : 'Descrição & Detalhes'}
            </h4>
            <p className="text-xs sm:text-sm leading-relaxed text-zinc-300 bg-white/[0.02] p-3 sm:p-4 rounded-xl border border-white/5">
              {event.description || "Sem notas adicionais informadas."}
            </p>
          </div>

          {event.location && (
            <div className="flex items-center gap-1.5 text-xs text-zinc-400">
              <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
              <span>Local: <strong className="text-zinc-200">{event.location}</strong></span>
            </div>
          )}

          {/* Fotos e Anexos */}
          <div>
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <h4 className="text-[10px] sm:text-xs uppercase tracking-wider text-zinc-400 font-mono flex items-center gap-1.5 sm:gap-2">
                <Paperclip className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                {isMoment ? 'Fotos & Registros' : 'Comprovantes'} ({event.attachments.length})
              </h4>
            </div>

            {event.attachments.length === 0 ? (
              <p className="text-xs text-zinc-400 italic">Nenhum anexo registrado.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                {event.attachments.map((att) => (
                  <div 
                    key={att.id}
                    className="group relative flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] active:bg-white/[0.1] border border-white/10 transition-all cursor-pointer"
                    onClick={() => setSelectedPreview(att.url)}
                  >
                    {att.type === 'image' ? (
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden bg-zinc-900 border border-white/10 shrink-0">
                        <img 
                          src={att.url} 
                          alt={att.name} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0 text-red-400">
                        <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-zinc-200 truncate group-hover:text-blue-400 transition-colors">
                        {att.name}
                      </p>
                      <span className="text-[10px] text-zinc-400">{att.size || 'Arquivo'}</span>
                    </div>

                    <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-400 group-hover:text-white transition-colors shrink-0" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Rodapé de Ações */}
        <div className="pt-3 sm:pt-4 border-t border-white/10 flex items-center justify-between pb-1 sm:pb-0">
          {onDelete ? (
            <button
              onClick={() => {
                if (confirm('Tem certeza que deseja excluir este evento?')) {
                  onDelete(event.id);
                  onClose();
                }
              }}
              className="text-xs text-red-400/80 hover:text-red-300 hover:underline cursor-pointer py-1"
            >
              Excluir
            </button>
          ) : <div />}

          <button
            onClick={onClose}
            className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs font-medium bg-white/10 hover:bg-white/20 active:bg-white/25 text-white transition-all cursor-pointer"
          >
            Fechar
          </button>
        </div>

        {/* Modal de Zoom do Anexo */}
        {selectedPreview && (
          <div className="fixed inset-0 z-60 bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center p-4">
            <button 
              onClick={() => setSelectedPreview(null)}
              className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="max-w-4xl max-h-[85vh] p-2">
              <img 
                src={selectedPreview} 
                alt="Foto em Alta Resolução" 
                className="max-h-[80vh] w-auto rounded-lg shadow-2xl border border-white/20 object-contain" 
              />
            </div>
            <a 
              href={selectedPreview} 
              target="_blank" 
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-xs text-blue-400 hover:underline"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Abrir imagem original
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
