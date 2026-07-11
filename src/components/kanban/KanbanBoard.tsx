import { useOrders } from '../../hooks/useOrders';
import { useResponsive } from '../../hooks/useResponsive';
import { KanbanColumn } from './KanbanColumn';

export function KanbanBoard() {
  const { ordersByStatus, updateStatus, loading } = useOrders();
  const { isMobile, isTablet, isDesktop } = useResponsive();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-text-muted">
          <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          <p className="text-sm">Cargando pedidos...</p>
        </div>
      </div>
    );
  }

  const pendientes = [...ordersByStatus.PENDIENTE, ...ordersByStatus.CONFIRMADO];
  const cocina = ordersByStatus.EN_COCINA;
  const ruta = ordersByStatus.EN_RUTA;

  if (isMobile) {
    return (
      <div className="space-y-4">
        <KanbanColumn
          title="PENDIENTE"
          icon="⏳"
          color="text-yellow-400"
          orders={pendientes}
          onNext={(id) => updateStatus(id, 'EN_COCINA')}
          nextLabel="A Cocina"
          nextColor="bg-yellow-600 hover:bg-yellow-700 text-white"
          isMobile={true}
        />
        <KanbanColumn
          title="EN COCINA"
          icon="👨‍🍳"
          color="text-orange-400"
          orders={cocina}
          onNext={(id) => updateStatus(id, 'EN_RUTA')}
          nextLabel="A Delivery"
          nextColor="bg-orange-600 hover:bg-orange-700 text-white"
          isMobile={true}
        />
        <KanbanColumn
          title="EN RUTA"
          icon="🛵"
          color="text-green-400"
          orders={ruta}
          onNext={(id) => updateStatus(id, 'ENTREGADO')}
          nextLabel="Entregado"
          nextColor="bg-green-600 hover:bg-green-700 text-white"
          onCancel={(id) => updateStatus(id, 'CANCELADO')}
          isMobile={true}
        />
      </div>
    );
  }

  if (isTablet) {
    return (
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-4">
          <KanbanColumn
            title="PENDIENTE"
            icon="⏳"
            color="text-yellow-400"
            orders={pendientes}
            onNext={(id) => updateStatus(id, 'EN_COCINA')}
            nextLabel="A Cocina"
            nextColor="bg-yellow-600 hover:bg-yellow-700 text-white"
            isMobile={false}
          />
          <KanbanColumn
            title="EN COCINA"
            icon="👨‍🍳"
            color="text-orange-400"
            orders={cocina}
            onNext={(id) => updateStatus(id, 'EN_RUTA')}
            nextLabel="A Delivery"
            nextColor="bg-orange-600 hover:bg-orange-700 text-white"
            isMobile={false}
          />
        </div>
        <KanbanColumn
          title="EN RUTA"
          icon="🛵"
          color="text-green-400"
          orders={ruta}
          onNext={(id) => updateStatus(id, 'ENTREGADO')}
          nextLabel="Entregado"
          nextColor="bg-green-600 hover:bg-green-700 text-white"
          onCancel={(id) => updateStatus(id, 'CANCELADO')}
          isMobile={false}
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      <KanbanColumn
        title="PENDIENTE"
        icon="⏳"
        color="text-yellow-400"
        orders={pendientes}
        onNext={(id) => updateStatus(id, 'EN_COCINA')}
        nextLabel="A Cocina"
        nextColor="bg-yellow-600 hover:bg-yellow-700 text-white"
        isMobile={false}
      />
      <KanbanColumn
        title="EN COCINA"
        icon="👨‍🍳"
        color="text-orange-400"
        orders={cocina}
        onNext={(id) => updateStatus(id, 'EN_RUTA')}
        nextLabel="A Delivery"
        nextColor="bg-orange-600 hover:bg-orange-700 text-white"
        isMobile={false}
      />
      <KanbanColumn
        title="EN RUTA"
        icon="🛵"
        color="text-green-400"
        orders={ruta}
        onNext={(id) => updateStatus(id, 'ENTREGADO')}
        nextLabel="Entregado"
        nextColor="bg-green-600 hover:bg-green-700 text-white"
        onCancel={(id) => updateStatus(id, 'CANCELADO')}
        isMobile={false}
      />
    </div>
  );
}
