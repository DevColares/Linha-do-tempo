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
      currency: 'BRL'
    }).format(val);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-5xl mx-auto px-4 w-full">
      <div className="p-3.5 rounded-2xl bg-zinc-950/60 border border-white/10 backdrop-blur-xl shadow-lg">
        <div className="flex items-center gap-2 text-zinc-400 text-xs mb-1">
          <DollarSign className="w-3.5 h-3.5 text-blue-400" />
          <span>Total Investido</span>
        </div>
        <div className="text-xl font-bold text-white tracking-tight font-mono">
          {formatCurrency(totalAmount)}
        </div>
      </div>

      <div className="p-3.5 rounded-2xl bg-zinc-950/60 border border-white/10 backdrop-blur-xl shadow-lg">
        <div className="flex items-center gap-2 text-zinc-400 text-xs mb-1">
          <Heart className="w-3.5 h-3.5 text-pink-400" />
          <span>Momentos & Memórias</span>
        </div>
        <div className="text-xl font-bold text-pink-400 tracking-tight font-mono">
          {momentEvents.length} lembranças
        </div>
      </div>

      <div className="p-3.5 rounded-2xl bg-zinc-950/60 border border-white/10 backdrop-blur-xl shadow-lg">
        <div className="flex items-center gap-2 text-zinc-400 text-xs mb-1">
          <Layers className="w-3.5 h-3.5 text-purple-400" />
          <span>Gastos Essenciais</span>
        </div>
        <div className="text-xl font-bold text-purple-300 tracking-tight font-mono">
          {formatCurrency(essentialAmount)}
        </div>
      </div>

      <div className="p-3.5 rounded-2xl bg-zinc-950/60 border border-white/10 backdrop-blur-xl shadow-lg">
        <div className="flex items-center gap-2 text-zinc-400 text-xs mb-1">
          <FileCheck className="w-3.5 h-3.5 text-amber-400" />
          <span>Fotos & Comprovantes</span>
        </div>
        <div className="text-xl font-bold text-amber-400 tracking-tight font-mono">
          {events.reduce((acc, curr) => acc + curr.attachments.length, 0)} arquivos
        </div>
      </div>
    </div>
  );
};
