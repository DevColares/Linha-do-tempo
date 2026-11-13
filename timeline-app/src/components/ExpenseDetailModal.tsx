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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl bg-zinc-950/85 border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-2xl overflow-hidden max-h-[90vh] flex flex-col"
        style={{
          boxShadow: `0 25px 60px -15px ${config.bgGlow}, 0 0 1px 1px rgba(255,255,255,0.1)`
        }}
      >
        {/* Glow de fundo */}
        <div 
          className="absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: config.color }}
        />

        {/* Top Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              {isMoment ? (
                <>
                  <CategoryBadge type="moment" momentTag={event.momentTag} />
                  <span className="text-[11px] uppercase tracking-wider text-pink-400 font-semibold px-2 py-0.5 rounded-full bg-pink-500/10 border border-pink-500/20 flex items-center gap-1">
                    <Heart className="w-3 h-3 fill-pink-400/30" /> Registro de Momento
                  </span>
                </>
              ) : (
                <>
                  <CategoryBadge type="category" category={event.category} />
                  {event.isEssential ? (
                    <span className="text-[11px] uppercase tracking-wider text-emerald-400 font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                      Gasto Essencial
                    </span>
                  ) : (
                    <span className="text-[11px] uppercase tracking-wider text-purple-400 font-semibold px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Gasto Extra / Presente
                    </span>
                  )}
                </>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
              {event.title}
            </h2>
          </div>

          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conteúdo rolável */}
        <div className="overflow-y-auto py-5 space-y-6 flex-1 pr-1">
          {/* Card de Destaque */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/5">
            {isMoment ? (
              <div>
                <span className="text-xs uppercase tracking-widest text-zinc-400 font-mono">Sentimento do Momento</span>
                <div className="text-2xl font-bold tracking-tight mt-0.5 capitalize text-pink-300 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-pink-400 fill-pink-400/40" />
                  {event.emotion || 'Afeto e Amor'}
                </div>
              </div>
            ) : (
              <div>
                <span className="text-xs uppercase tracking-widest text-zinc-400 font-mono">Valor Total</span>
                <div 
                  className="text-3xl font-bold tracking-tight mt-0.5 font-mono"
                  style={{ color: config.color }}
                >
                  {formatCurrency(event.amount)}
                </div>
              </div>
            )}

            <div className="flex flex-col items-end text-xs text-zinc-400 gap-1.5 font-mono">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-zinc-400" /> {formatDate(event.date)}
              </span>
              {!isMoment && event.paymentMethod && (
                <span className="flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-zinc-400" /> {event.paymentMethod}
                </span>
              )}
            </div>
          </div>

          {/* Descrição / Memória */}
          <div>
            <h4 className="text-xs uppercase tracking-wider text-zinc-400 font-mono mb-2">
              {isMoment ? 'História & Memória' : 'Descrição & Detalhes'}
            </h4>
            <p className="text-sm leading-relaxed text-zinc-300 bg-white/[0.02] p-4 rounded-xl border border-white/5">
              {event.description || "Sem notas adicionais informadas."}
            </p>
          </div>

          {event.location && (
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <MapPin className="w-4 h-4 text-zinc-400" />
              <span>Local do Acontecimento: <strong className="text-zinc-200">{event.location}</strong></span>
            </div>
          )}

          {/* Fotos e Anexos */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs uppercase tracking-wider text-zinc-400 font-mono flex items-center gap-2">
                <Paperclip className="w-3.5 h-3.5" />
                {isMoment ? 'Fotos & Registros Visuais' : 'Comprovantes & Recibos'} ({event.attachments.length})
              </h4>
            </div>

            {event.attachments.length === 0 ? (
              <p className="text-xs text-zinc-400 italic">Nenhum anexo registrado neste evento.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {event.attachments.map((att) => (
                  <div 
                    key={att.id}
                    className="group relative flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 transition-all cursor-pointer"
                    onClick={() => setSelectedPreview(att.url)}
                  >
                    {att.type === 'image' ? (
                      <div className="w-14 h-14 rounded-lg overflow-hidden bg-zinc-900 border border-white/10 shrink-0">
                        <img 
                          src={att.url} 
                          alt={att.name} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                        />
                      </div>
                    ) : (
                      <div className="w-14 h-14 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0 text-red-400">
                        <FileText className="w-6 h-6" />
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-zinc-200 truncate group-hover:text-blue-400 transition-colors">
                        {att.name}
                      </p>
                      <span className="text-[10px] text-zinc-400">{att.size || 'Arquivo'}</span>
                    </div>

                    <Maximize2 className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Rodapé de Ações */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between">
          {onDelete ? (
            <button
              onClick={() => {
                if (confirm('Tem certeza que deseja excluir este evento?')) {
                  onDelete(event.id);
                  onClose();
                }
              }}
              className="text-xs text-red-400/80 hover:text-red-300 hover:underline cursor-pointer"
            >
              Excluir Registro
            </button>
          ) : <div />}

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-medium bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
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
