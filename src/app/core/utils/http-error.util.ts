export function mensajeError(err: any): string {
  if (!err) return 'Error inesperado.';
  switch (err.status) {
    case 401: return 'Sesión expirada. Vuelve a iniciar sesión.';
    case 403: return 'No tienes permiso para realizar esta acción.';
    case 404: return 'El recurso solicitado no fue encontrado.';
    case 500: return 'Error del servidor. Intenta más tarde.';
    default:  return err.error?.mensaje || err.error?.message || 'Ocurrió un error inesperado.';
  }
}
