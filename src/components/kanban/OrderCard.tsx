import { useState, useEffect } from 'react';
import type { Pedido } from '../../types';
import { useSwipe } from '../../hooks/useSwipe';
import { printTicket } from '../../lib/print';

interface Props {
  pedido: Pedido;
  onNext: (id: string) => void;
  onCancel?: (id: string) => void;
  nextLabel: string;
  nextColor: string;
  isMobile: boolean;
}

export function OrderCard({ pedido, onNext, onCancel, nextLabel, nextColor, isMobile }: Props) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const update = () => setElapsed(
      pedido.createdAt
        ? Math.floor((Date.now() - new Date(pedido.createdAt).getTime()) / 60000)
        : 0
    );
    update();
    const interval = setInterval(update, 30000);
    return () => clearInterval(interval);
  }, [pedido.createdAt]);

  const isOverdue = elapsed > 15;
  const nextStatuses: Record<string, string> = {
    'A Cocina': 'EN_COCINA',
    'A Delivery': 'EN_RUTA',
    Entregado: 'ENTREGADO',
  };

  const swipeHandlers = useSwipe({
    onSwipeLeft: () => onNext(pedido.id),
    onSwipeRight: () => onCancel?.(pedido.id),
  });

  return (
    <div
      className={`bg-[#1A1A2E] rounded-xl p-3 md:p-4 border transition-all duration-200 shadow-lg
        ${isOverdue ? 'border-red-500/50 ring-1 ring-red-500/20' : 'border-[#2A2A3E] hover:border-primary/50'}`}
      {...(isMobile ? swipeHandlers : {})}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-text-muted">
              #{pedido.id.slice(0, 6)}
            </span>
            {isOverdue && (
              <span className="badge bg-red-500/20 text-red-400 border border-red-500/30">
                🔴 Atrasado
              </span>
            )}
          </div>
          <h3 className="font-bold text-[#F1FAEE] text-sm md:text-base mt-0.5 truncate">
            {pedido.usuario.nombre}
          </h3>
        </div>
        <div className="flex items-center gap-1 ml-2">
          <button
            onClick={() => printTicket(pedido)}
            className="text-xs p-1 rounded hover:bg-[#2A2A3E] transition-colors cursor-pointer"
            title="Imprimir ticket"
          >
            🖨️
          </button>
          <span className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap
            ${isOverdue ? 'bg-red-500/20 text-red-400' : 'bg-[#2A2A3E] text-text-muted'}`}>
            {elapsed} min
          </span>
        </div>
      </div>

      <div className={`space-y-1 mb-3 overflow-hidden ${isMobile ? '' : ''}`}>
        {pedido.detalle.slice(0, isMobile ? 2 : 99).map((d) => (
          <div key={d.id} className="flex justify-between text-xs">
            <span className="text-[#6B7280] truncate">
              {d.cantidad}x {d.producto.nombre}
            </span>
            <span className="text-text-muted ml-2 whitespace-nowrap">
              S/ {(Number(d.precioUnitario) * d.cantidad).toFixed(2)}
            </span>
          </div>
        ))}
        {isMobile && pedido.detalle.length > 2 && (
          <p className="text-xxs text-text-muted">+{pedido.detalle.length - 2} mas</p>
        )}
      </div>

      {pedido.tiempoEstimado && !isMobile && (
        <div className="text-xs text-text-muted mb-3">
          ETA: {pedido.tiempoEstimado} min
        </div>
      )}

      {isMobile ? (
        <div className="flex items-center justify-between text-xxs text-text-muted pt-1 border-t border-[#2A2A3E]">
          <span>← Cancelar</span>
          <span className="text-primary font-semibold">{nextLabel} →</span>
        </div>
      ) : (
        <div className="flex gap-2">
          <button
            onClick={() => onNext(pedido.id)}
            className={`flex-1 text-xs font-bold py-2 rounded-lg transition-colors cursor-pointer active:scale-95 ${nextColor}`}
          >
            {nextLabel}
          </button>
          <button
            onClick={() => printTicket(pedido)}
            className="text-xs bg-[#2A2A3E] text-text-muted px-2.5 py-2 rounded-lg hover:bg-[#3A3A4E] transition-colors cursor-pointer"
            title="Imprimir ticket"
          >
            🖨️
          </button>
          {onCancel && (
            <button
              onClick={() => onCancel(pedido.id)}
              className="text-xs bg-red-900/30 text-red-400 px-3 py-2 rounded-lg hover:bg-red-900/50 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
          )}
        </div>
      )}
    </div>
  );
}
