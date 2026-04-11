export interface Usuario{
    id?: number;
    nombre: string;
    email: string;
    passwordHash: string;
    rol: string;
    createdAt: Date;
    estado: boolean
}