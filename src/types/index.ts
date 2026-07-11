export type EstadoPedido = 'PENDIENTE' | 'CONFIRMADO' | 'EN_COCINA' | 'EN_RUTA' | 'ENTREGADO' | 'CANCELADO';

export interface Producto {
  id: string;
  nombre: string;
  precio: number;
}

export interface DetallePedido {
  id: string;
  productoId: string;
  cantidad: number;
  precioUnitario: number;
  producto: Producto;
}

export interface Usuario {
  id: string;
  nombre: string;
  celular: string;
}

export interface Pedido {
  id: string;
  usuarioId: string;
  usuario: Usuario;
  estado: EstadoPedido;
  total: number;
  tiempoEstimado: number | null;
  createdAt: string;
  updatedAt: string;
  detalle: DetallePedido[];
}

export interface Saturation {
  nivel: 'bajo' | 'medio' | 'alto';
  pedidosEnCocina: number;
  tiempoExtraMin: number;
}

export interface JornadaResumen {
  inicio: string;
  fin: string;
  etiqueta: string;
  totalPedidos: number;
  totalGanancia: number;
  pedidos: Pedido[];
}

export interface HistoryData {
  jornadas: JornadaResumen[];
  resumenGeneral: {
    totalPedidos: number;
    totalGanancia: number;
  };
}
