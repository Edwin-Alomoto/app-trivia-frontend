/* Cliente HTTP con soporte de Authorization y refresh token (una vez) */

const BASE_URL = 'https://backend-trivia-nest.onrender.com';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestOptions {
  headers?: Record<string, string>;
  query?: Record<string, string | number | boolean | undefined | null>;
  timeoutMs?: number;
}

function buildUrl(path: string, query?: RequestOptions['query']): string {
  const url = new URL(path.startsWith('http') ? path : `${BASE_URL}${path}`);
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) url.searchParams.append(key, String(value));
    });
  }
  return url.toString();
}

import { tokenStorage } from './tokenStorage';

let currentAccessToken: string | null = null;
let currentRefreshToken: string | null = null;
let loadingTokensPromise: Promise<void> | null = null;

async function ensureTokensLoaded(): Promise<void> {
  if (currentAccessToken !== null || currentRefreshToken !== null) return;
  if (!loadingTokensPromise) {
    loadingTokensPromise = (async () => {
      try {
        const { accessToken, refreshToken } = await tokenStorage.load();
        currentAccessToken = accessToken;
        currentRefreshToken = refreshToken;
      } finally {
        loadingTokensPromise = null;
      }
    })();
  }
  await loadingTokensPromise;
}

async function doFetch(method: HttpMethod, url: string, body?: unknown, headers?: Record<string, string>, signal?: AbortSignal) {
  return fetch(url, {
    method,
    headers,
    body: body != null ? JSON.stringify(body) : undefined,
    signal,
  });
}

async function request<T>(method: HttpMethod, path: string, body?: unknown, options: RequestOptions = {}): Promise<T> {
  await ensureTokensLoaded();
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), options.timeoutMs ?? 15000);
  try {
    const baseHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    };
    // Adjuntar Authorization si tenemos accessToken y no es auth/login ni auth/refresh
    const pathLower = path.toLowerCase();
    if (currentAccessToken && !pathLower.includes('/auth/login') && !pathLower.includes('/auth/refresh')) {
      baseHeaders['Authorization'] = `Bearer ${currentAccessToken}`;
    }

    let res = await doFetch(method, buildUrl(path, options.query), body, baseHeaders, controller.signal);

    const isJson = res.headers.get('content-type')?.includes('application/json');
    const payload = isJson ? await res.json() : await res.text();

    if (!res.ok) {
      // Intento de refresh UNA sola vez ante 401
      if (res.status === 401 && currentRefreshToken && !pathLower.includes('/auth/login') && !pathLower.includes('/auth/refresh')) {
        try {
          const refreshRes = await doFetch('POST', buildUrl('/auth/refresh'), { refreshToken: currentRefreshToken }, { 'Content-Type': 'application/json' }, controller.signal);
          const refreshIsJson = refreshRes.headers.get('content-type')?.includes('application/json');
          const refreshPayload: any = refreshIsJson ? await refreshRes.json() : await refreshRes.text();
          if (refreshRes.ok) {
            const newAccess = refreshPayload?.data?.accessToken;
            const newRefresh = refreshPayload?.data?.refreshToken ?? currentRefreshToken;
            if (newAccess) {
              currentAccessToken = newAccess;
              currentRefreshToken = newRefresh;
              await tokenStorage.save(newAccess, newRefresh);
              // Reintentar la solicitud original con nuevo token
              baseHeaders['Authorization'] = `Bearer ${currentAccessToken}`;
              res = await doFetch(method, buildUrl(path, options.query), body, baseHeaders, controller.signal);
              const retryIsJson = res.headers.get('content-type')?.includes('application/json');
              const retryPayload = retryIsJson ? await res.json() : await res.text();
              if (!res.ok) {
                const err: any = new Error((retryPayload as any)?.message || 'HTTP Error');
                err.status = res.status;
                err.payload = retryPayload;
                throw err;
              }
              return retryPayload as T;
            }
          }
        } catch (_) {
          // Si el refresh falla, continuamos lanzando el 401 original
        }
      }
      const error: any = new Error((payload as any)?.message || 'HTTP Error');
      error.status = res.status;
      error.payload = payload;
      throw error;
    }

    return payload as T;
  } finally {
    clearTimeout(id);
  }
}

export const apiClient = {
  get: <T>(path: string, options?: RequestOptions) => request<T>('GET', path, undefined, options),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) => request<T>('POST', path, body, options),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) => request<T>('PUT', path, body, options),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) => request<T>('PATCH', path, body, options),
  delete: <T>(path: string, options?: RequestOptions) => request<T>('DELETE', path, undefined, options),
  setTokens: async (accessToken: string | null, refreshToken?: string | null) => {
    currentAccessToken = accessToken;
    currentRefreshToken = refreshToken ?? currentRefreshToken;
  },
};

export type { RequestOptions };


