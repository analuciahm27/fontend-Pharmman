export interface Usuario{
    id?: number;
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno?: string;
    email: string;
    dni: string;
    rol: string;
    estado: boolean;
    mustChangePassword?: boolean;
}