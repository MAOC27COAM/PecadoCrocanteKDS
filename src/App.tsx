import { useState } from 'react';
import { KanbanBoard } from './components/kanban/KanbanBoard';
import { SaturationMeter } from './components/dashboard/SaturationMeter';
import { HistoryPanel } from './components/history/HistoryPanel';

type ViewMode = 'kanban' | 'history';

export default function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');

  return (
    <div className="min-h-screen bg-[#0D0D1A] text-[#F1FAEE] p-3 md:p-6">
      <header className="max-w-6xl mx-auto mb-4 md:mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg md:text-xl font-black tracking-tight">
            🍗 <span className="text-[#E63946]">Pecado</span> Crocante
            <span className="text-text-muted text-xs md:text-sm ml-2 font-normal">KDS</span>
          </h1>
          <div className="flex items-center gap-3 text-xxs md:text-xs text-text-muted">
            <button
              onClick={() => setViewMode(viewMode === 'kanban' ? 'history' : 'kanban')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                viewMode === 'history'
                  ? 'bg-[#E63946] text-white'
                  : 'bg-[#2A2A3E] text-text-muted hover:bg-[#3A3A4E]'
              }`}
            >
              {viewMode === 'kanban' ? '📋 Historial' : '◀ Kanban'}
            </button>
            <span className="hidden md:flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              En vivo
            </span>
            <span className="font-mono">
              {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>
        <SaturationMeter />
      </header>
      <main className="max-w-6xl mx-auto">
        {viewMode === 'kanban' ? <KanbanBoard /> : <HistoryPanel />}
      </main>
    </div>
  );
}
