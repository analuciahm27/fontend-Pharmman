import { Usuario } from '../../core/model/usuario';

export const USUARIOS_MOCK: Usuario[] = [
  {
    id: 1,
    nombre: 'Carlos Admin',
    email: 'admin@pharmman.com',
    passwordHash: '123456',
    rol: 'ADMIN',
    estado: true,
    createdAt: new Date()
  },
  {
    id: 2,
    nombre: 'María Vendedor',
    email: 'vendedor@pharmman.com',
    passwordHash: '123456',
    rol: 'VENDEDOR',
    estado: true,
    createdAt: new Date()
  }
];