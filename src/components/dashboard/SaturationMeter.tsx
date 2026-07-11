import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import type { Saturation } from '../../types';

export function SaturationMeter() {
  const [saturation, setSaturation] = useState<Saturation | null>(null);
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await api.getSaturation();
        setSaturation(data);
      } catch {
        console.error('Error loading saturation');
      }
    };
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!saturation) return null;

  const colors = { bajo: 'bg-green-500', medio: 'bg-yellow-500', alto: 'bg-red-500' };
  const labels = { bajo: 'Baja', medio: 'Media', alto: 'Alta' };
  const barWidths = { bajo: 'w-1/3', medio: 'w-2/3', alto: 'w-full' };

  return (
    <div className="bg-[#1A1A2E] border border-[#2A2A3E] rounded-xl px-4 py-3">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-2 cursor-pointer md:cursor-default"
      >
        <span className="text-lg">🔥</span>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-text-muted">Saturacion</span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full text-white ${colors[saturation.nivel]}`}>
              {labels[saturation.nivel]}
            </span>
          </div>
          <div className="h-1.5 bg-[#2A2A3E] rounded-full overflow-hidden">
            <div className={`h-full ${colors[saturation.nivel]} rounded-full transition-all duration-500 ${barWidths[saturation.nivel]}`} />
          </div>
        </div>
        <span className="text-xs text-text-muted md:hidden">{expanded ? '▲' : '▼'}</span>
      </button>
      {expanded && (
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#2A2A3E] text-xs text-text-muted">
          <span>{saturation.pedidosEnCocina} pedidos en cocina</span>
          <span>
            Tiempo extra: <strong className="text-[#F4A261]">+{saturation.tiempoExtraMin} min</strong>
          </span>
        </div>
      )}
    </div>
  );
}
