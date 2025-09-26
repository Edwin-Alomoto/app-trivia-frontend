export type NormalizedApiError = {
  status?: number;
  message: string;
  raw?: unknown;
};

export function handleApiError(e: any): NormalizedApiError {
  const status: number | undefined = e?.status ?? e?.response?.status;
  const payload = e?.payload ?? e?.response?.data;
  const backendMessage: string | undefined = payload?.message || payload?.error || e?.message;

  // Mensajes amigables por status
  if (status === 401) return { status, message: 'Credenciales inválidas', raw: payload };
  if (status === 400) return { status, message: backendMessage || 'Solicitud inválida', raw: payload };
  if (status === 403) return { status, message: 'No autorizado', raw: payload };
  if (status === 404) return { status, message: 'Recurso no encontrado', raw: payload };
  if (status && status >= 500) return { status, message: 'Error del servidor', raw: payload };

  return { status, message: backendMessage || 'Error de red', raw: payload };
}


