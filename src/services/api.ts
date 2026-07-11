const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const api = {
  async getOrders() {
    const res = await fetch(`${API_URL}/api/kds/orders`);
    return res.json();
  },

  async updateStatus(id: string, estado: string) {
    const res = await fetch(`${API_URL}/api/orders/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado }),
    });
    return res.json();
  },

  async getSaturation() {
    const res = await fetch(`${API_URL}/api/kds/saturation`);
    return res.json();
  },

  async getHistory(days: number = 7) {
    const res = await fetch(`${API_URL}/api/kds/history?days=${days}`);
    return res.json();
  },
};

export function connectSSE(onOrder: (data: any) => void) {
  const evtSource = new EventSource(`${API_URL}/api/kds/events`);

  evtSource.addEventListener('order:created', (e) => {
    onOrder(JSON.parse(e.data));
  });

  evtSource.addEventListener('order:status_changed', (e) => {
    onOrder(JSON.parse(e.data));
  });

  return () => evtSource.close();
}
