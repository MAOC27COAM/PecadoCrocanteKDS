import type { Pedido } from '../../types';
import { OrderCard } from './OrderCard';

interface Props {
  title: string;
  icon: string;
  color: string;
  orders: Pedido[];
  onNext: (id: string) => void;
  onCancel?: (id: string) => void;
  nextLabel: string;
  nextColor: string;
  isMobile: boolean;
}

export function KanbanColumn({
  title,
  icon,
  color,
  orders,
  onNext,
  onCancel,
  nextLabel,
  nextColor,
  isMobile,
}: Props) {
  return (
    <div className="bg-dark/30 rounded-2xl p-3 min-h-[40vh] md:min-h-[60vh]">
      <div className="flex items-center gap-2 mb-3 px-2" id={`column-${title.toLowerCase().replace(/\s/g, '-')}`}>
        <span className="text-lg">{icon}</span>
        <h2 className={`font-bold text-sm ${color}`}>{title}</h2>
        <span className="ml-auto text-xs bg-[#1A1A2E] text-text-muted px-2 py-0.5 rounded-full border border-[#2A2A3E]">
          {orders.length}
        </span>
      </div>
      <div className="space-y-3">
        {orders.length === 0 && (
          <p className="text-text-muted text-xs text-center py-8">Sin pedidos</p>
        )}
        {orders.map((pedido) => (
          <OrderCard
            key={pedido.id}
            pedido={pedido}
            onNext={onNext}
            onCancel={onCancel}
            nextLabel={nextLabel}
            nextColor={nextColor}
            isMobile={isMobile}
          />
        ))}
      </div>
    </div>
  );
}
