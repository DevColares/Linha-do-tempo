import React from 'react';
import type { TimelineEvent } from '../types';
import { DollarSign, FileCheck, Layers, Heart } from 'lucide-react';

interface StatsOverviewProps {
  events: TimelineEvent[];
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ events }) => {
  const financialEvents = events.filter(e => e.eventType === 'financial');
  const momentEvents = events.filter(e => e.eventType === 'moment');

  const totalAmount = financialEvents.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const essentialAmount = financialEvents
    .filter(e => e.isEssential)
    .reduce((acc, curr) => acc + (curr.amount || 0), 0);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 max-w-5xl mx-auto px-3 sm:px-4 w-full">
      <div className="p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-zinc-950/70 border border-white/10 backdrop-blur-xl shadow-lg">
        <div className="flex items-center gap-1.5 text-zinc-400 text-[11px] sm:text-xs mb-0.5 sm:mb-1">
          <DollarSign className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-400 shrink-0" />
          <span className="truncate">Total Investido</span>
        </div>
        <div className="text-base sm:text-xl font-bold text-white tracking-tight font-mono truncate">
          {formatCurrency(totalAmount)}
        </div>
      </div>

      <div className="p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-zinc-950/70 border border-white/10 backdrop-blur-xl shadow-lg">
        <div className="flex items-center gap-1.5 text-zinc-400 text-[11px] sm:text-xs mb-0.5 sm:mb-1">
          <Heart className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-pink-400 shrink-0" />
          <span className="truncate">Memórias</span>
        </div>
        <div className="text-base sm:text-xl font-bold text-pink-400 tracking-tight font-mono truncate">
          {momentEvents.length} <span className="text-xs font-normal text-pink-300/80">itens</span>
        </div>
      </div>

      <div className="p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-zinc-950/70 border border-white/10 backdrop-blur-xl shadow-lg">
        <div className="flex items-center gap-1.5 text-zinc-400 text-[11px] sm:text-xs mb-0.5 sm:mb-1">
          <Layers className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-purple-400 shrink-0" />
          <span className="truncate">Essenciais</span>
        </div>
        <div className="text-base sm:text-xl font-bold text-purple-300 tracking-tight font-mono truncate">
          {formatCurrency(essentialAmount)}
        </div>
      </div>

      <div className="p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-zinc-950/70 border border-white/10 backdrop-blur-xl shadow-lg">
        <div className="flex items-center gap-1.5 text-zinc-400 text-[11px] sm:text-xs mb-0.5 sm:mb-1">
          <FileCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400 shrink-0" />
          <span className="truncate">Comprovantes</span>
        </div>
        <div className="text-base sm:text-xl font-bold text-amber-400 tracking-tight font-mono truncate">
          {events.reduce((acc, curr) => acc + curr.attachments.length, 0)} <span className="text-xs font-normal text-amber-300/80">anexos</span>
        </div>
      </div>
    </div>
  );
};
