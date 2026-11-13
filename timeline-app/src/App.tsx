import { useState, useEffect } from 'react';
import { CosmicCanvas } from './components/CosmicCanvas';
import { CosmicTimeline } from './components/CosmicTimeline';
import { ExpenseDetailModal } from './components/ExpenseDetailModal';
import { AddExpenseModal } from './components/AddExpenseModal';
import { StatsOverview } from './components/StatsOverview';
import { INITIAL_EXPENSES } from './data/initialData';
import type { TimelineEvent } from './types';
import { Plus, Sparkles, Cloud, CloudOff } from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  subscribeToEvents, 
  addEventToFirestore, 
  deleteEventFromFirestore,
  seedInitialDataIfEmpty 
} from './lib/eventsService';

export function App() {
  const [events, setEvents] = useState<TimelineEvent[]>(() => {
    const saved = localStorage.getItem('timeline_hybrid_events_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_EXPENSES;
      }
    }
    return INITIAL_EXPENSES;
  });

  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(true);
  const [syncError, setSyncError] = useState<string | null>(null);

  // Sincronização em tempo real com Firestore
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const setupSync = async () => {
      try {
        await seedInitialDataIfEmpty();
        unsubscribe = subscribeToEvents(
          (cloudEvents) => {
            if (cloudEvents.length > 0) {
              setEvents(cloudEvents);
              localStorage.setItem('timeline_hybrid_events_v2', JSON.stringify(cloudEvents));
            }
            setIsSyncing(false);
            setSyncError(null);
          },
          (err) => {
            console.warn('Firestore offline ou restrito. Usando cache local:', err);
            setIsSyncing(false);
            setSyncError('Offline/Local');
          }
        );
      } catch (err: any) {
        console.warn('Erro ao conectar Firestore:', err);
        setIsSyncing(false);
        setSyncError('Offline/Local');
      }
    };

    setupSync();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const handleAddEvent = async (newEventData: Omit<TimelineEvent, 'id'>) => {
    // 1. Otimista local
    const tempId = (newEventData.eventType === 'moment' ? 'mom-' : 'exp-') + Date.now();
    const newEvent: TimelineEvent = {
      ...newEventData,
      id: tempId
    };
    setEvents(prev => [newEvent, ...prev]);

    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.8 },
      colors: newEvent.eventType === 'moment' 
        ? ['#f472b6', '#fb7185', '#c084fc'] 
        : ['#60a5fa', '#34d399', '#fbbf24']
    });

    // 2. Grava no Firestore
    try {
      await addEventToFirestore(newEventData);
    } catch (err) {
      console.error('Falha ao salvar no Firestore, mantido localmente:', err);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
    try {
      await deleteEventFromFirestore(id);
    } catch (err) {
      console.error('Falha ao excluir no Firestore:', err);
    }
  };

  return (
    <div className="relative min-h-screen text-zinc-100 flex flex-col justify-between overflow-x-hidden selection:bg-blue-500/30">
      {/* 1. Cenário 3D Espacial e Partículas Bokeh Desfocadas */}
      <CosmicCanvas />

      {/* 2. Top Header Glassmorphism */}
      <header className="relative z-30 pt-6 px-6 sm:px-12 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-pink-500 flex items-center justify-center shadow-lg shadow-blue-500/20 border border-white/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white">
                Aetheris <span className="text-blue-400 font-light">| Pai & Filho</span>
              </h1>
              {isSyncing ? (
                <span className="flex items-center gap-1 text-[10px] text-zinc-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
                  <Cloud className="w-3 h-3 text-blue-400 animate-pulse" /> Sincronizando...
                </span>
              ) : syncError ? (
                <span className="flex items-center gap-1 text-[10px] text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full" title="Operando com armazenamento local">
                  <CloudOff className="w-3 h-3" /> Modo Local
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                  <Cloud className="w-3 h-3" /> Nuvem Ativa
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-400 tracking-wide font-light">
              Cronologia de memórias afetivas e prestação de cuidados financeiros
            </p>
          </div>
        </div>

        {/* Botão de Adição */}
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm bg-gradient-to-r from-blue-600 to-pink-600 hover:from-blue-500 hover:to-pink-500 text-white shadow-lg shadow-blue-600/25 border border-white/20 transition-all cursor-pointer transform hover:scale-105 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Novo Registro
        </button>
      </header>

      {/* 3. Palco Principal: Linha do Tempo */}
      <main className="relative z-20 flex-1 flex flex-col justify-center">
        <CosmicTimeline
          events={events}
          onSelectEvent={(item) => setSelectedEvent(item)}
        />
      </main>

      {/* 4. Painel Inferior de Estatísticas */}
      <footer className="relative z-30 pb-8 pt-2">
        <StatsOverview events={events} />
        <div className="text-center mt-6 text-[11px] text-zinc-500 font-mono">
          Desenvolvido com carinho para registro do legado e cuidado com meu filho.
        </div>
      </footer>

      {/* 5. Modais de Detalhe e Adição */}
      <ExpenseDetailModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onDelete={handleDeleteEvent}
      />

      <AddExpenseModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddEvent}
      />
    </div>
  );
}

export default App;
