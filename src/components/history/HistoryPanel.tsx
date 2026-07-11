import { useState } from 'react';
import { useHistory } from '../../hooks/useHistory';
import type { JornadaResumen, Pedido } from '../../types';

function formatCurrency(amount: number): string {
  return `S/ ${amount.toFixed(2)}`;
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' });
}

function OrderRow({ pedido }: { pedido: Pedido }) {
  return (
    <div className="flex items-center justify-between p-3 text-sm hover:bg-[#2A2A3E]/20">
      <div className="flex items-center gap-3 min-w-0">
        <span className="text-text-muted text-xs shrink-0 w-14">
          {formatTime(pedido.updatedAt)}
        </span>
        <div className="min-w-0">
          <p className="text-[#F1FAEE] truncate">{pedido.usuario.nombre}</p>
          <p className="text-text-muted text-xs truncate">
            {pedido.detalle.map((d) => `${d.cantidad}x ${d.producto.nombre}`).join(', ')}
          </p>
        </div>
      </div>
      <span className="font-semibold text-[#F4A261] shrink-0 ml-2">
        {formatCurrency(pedido.total)}
      </span>
    </div>
  );
}

function JornadaCard({
  jornada,
  isCurrent,
  defaultExpanded,
}: {
  jornada: JornadaResumen;
  isCurrent: boolean;
  defaultExpanded: boolean;
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <div
      className={`bg-[#1A1A2E] border border-[#2A2A3E] rounded-xl overflow-hidden ${
        isCurrent ? 'ring-1 ring-[#FFD60A]' : ''
      }`}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-[#2A2A3E]/30 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-3">
          {isCurrent && <span className="text-lg">🔥</span>}
          <div className="text-left">
            <p className="text-sm font-semibold text-[#F1FAEE]">{jornada.etiqueta}</p>
            {isCurrent && <p className="text-xs text-[#FFD60A]">Jornada actual</p>}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-bold text-[#22C55E]">{formatCurrency(jornada.totalGanancia)}</p>
            <p className="text-xs text-text-muted">{jornada.totalPedidos} pedidos</p>
          </div>
          <span className="text-text-muted text-sm">{expanded ? '▲' : '▼'}</span>
        </div>
      </button>
      {expanded && (
        <div className="border-t border-[#2A2A3E]">
          {jornada.pedidos.length === 0 ? (
            <p className="p-4 text-sm text-text-muted text-center">Sin pedidos en esta jornada</p>
          ) : (
            <div className="divide-y divide-[#2A2A3E]">
              {jornada.pedidos.map((pedido) => (
                <OrderRow key={pedido.id} pedido={pedido} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function HistoryPanel() {
  const { history, loading } = useHistory();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-text-muted">
          <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          <p className="text-sm">Cargando historial...</p>
        </div>
      </div>
    );
  }

  if (!history || history.jornadas.length === 0) {
    return (
      <div className="bg-[#1A1A2E] border border-[#2A2A3E] rounded-xl p-8 text-center">
        <p className="text-4xl mb-3">📭</p>
        <p className="text-text-muted text-sm">No hay pedidos entregados aún</p>
      </div>
    );
  }

  const currentJornada = history.jornadas[0];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-[#F1FAEE]">📋 Historial de Entregados</h2>
        <div className="text-xs text-text-muted">
          <span className="font-semibold text-[#22C55E]">{formatCurrency(history.resumenGeneral.totalGanancia)}</span>
          {' · '}
          <span>{history.resumenGeneral.totalPedidos} pedidos</span>
        </div>
      </div>

      <JornadaCard jornada={currentJornada} isCurrent={true} defaultExpanded={true} />

      {history.jornadas.slice(1).map((jornada) => (
        <JornadaCard key={jornada.inicio} jornada={jornada} isCurrent={false} defaultExpanded={false} />
      ))}
    </div>
  );
}
