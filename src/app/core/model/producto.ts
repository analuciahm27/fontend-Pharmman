export interface Producto {
  id?: number;
  codigo: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  stock: number;
  activo: boolean;
  categoriaId: number;
  categoriaNombre?: string; // Para mostrar en la tabla sin buscar el ID
}