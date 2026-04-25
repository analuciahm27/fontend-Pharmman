export interface DetalleVenta {
  productoId: number;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface Venta {
  id?: number;
  metodoPago: string;
  total: number;
  usuarioId: number;
  detalles: DetalleVenta[];
}