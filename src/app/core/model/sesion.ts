export interface Sesion {
  id?: number;
  entrada: Date;
  salida?: Date;
  usuarioId: number;
  usuarioNombre?: string;
  usuarioEmail?: string;
  rolNombre?: string;
}