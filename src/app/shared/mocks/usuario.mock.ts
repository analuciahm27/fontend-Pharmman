import { Usuario } from "../../core/models/usuarios.model";


export const USUARIOS_MOCK: Usuario[] = [
  {
    id: 1,
    nombre: 'Carlos Admin',
    email: 'admin@pharmman.com',
    password: '123456',
    rol: 'ADMIN',
    activo: true
  },
  {
    id: 2,
    nombre: 'María Vendedor',
    email: 'vendedor@pharmman.com',
    password: '123456',
    rol: 'VENDEDOR',
    activo: true
  }
];