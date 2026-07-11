import { useState, useEffect, useCallback, useRef } from 'react';
import type { Pedido } from '../types';
import { api, connectSSE } from '../services/api';
import { printTicket } from '../lib/print';

const NEW_ORDER_STATUSES = new Set(['PENDIENTE', 'CONFIRMADO']);

export function useOrders() {
  const [orders, setOrders] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const knownIdsRef = useRef<Set<string>>(new Set());
  const isFirstLoad = useRef(true);

  const loadOrders = useCallback(async () => {
    try {
      const data = await api.getOrders();
      if (!isFirstLoad.current) {
        const known = knownIdsRef.current;
        for (const pedido of data) {
          if (NEW_ORDER_STATUSES.has(pedido.estado) && !known.has(pedido.id)) {
            printTicket(pedido);
          }
        }
      }
      knownIdsRef.current = new Set(data.map((o: Pedido) => o.id));
      isFirstLoad.current = false;
      setOrders(data);
    } catch {
      console.error('Error loading orders');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
    const cleanup = connectSSE(() => loadOrders());
    return cleanup;
  }, [loadOrders]);

  const updateStatus = useCallback(async (id: string, estado: string) => {
    try {
      await api.updateStatus(id, estado);
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, estado: estado as any } : o))
      );
    } catch {
      console.error('Error updating status');
    }
  }, []);

  const ordersByStatus = {
    PENDIENTE: orders.filter((o) => o.estado === 'PENDIENTE'),
    CONFIRMADO: orders.filter((o) => o.estado === 'CONFIRMADO'),
    EN_COCINA: orders.filter((o) => o.estado === 'EN_COCINA'),
    EN_RUTA: orders.filter((o) => o.estado === 'EN_RUTA'),
    ENTREGADO: orders.filter((o) => o.estado === 'ENTREGADO'),
  };

  return { orders, ordersByStatus, loading, updateStatus, loadOrders };
}
