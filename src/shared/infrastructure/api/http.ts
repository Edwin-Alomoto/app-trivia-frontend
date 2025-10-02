import * as SecureStore from 'expo-secure-store';
import { API_ENV } from './env';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
const DEFAULT_TIMEOUT_MS = 25000; // 25s
const MAX_RETRIES = 2; // total de intentos = 1 inicial + 2 reintentos

let isRefreshing = false;
let pendingWaiters: Array<(token: string | null) => void> = [];

async function attachAuth(headers: Record<string, string>): Promise<Record<string, string>> {
  const accessToken = await SecureStore.getItemAsync('auth_access_token');
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;
  headers['Content-Type'] = headers['Content-Type'] ?? 'application/json';
  return headers;
}

async function refreshAccessToken(): Promise<string | null> {
  if (isRefreshing) {
    return new Promise((resolve) => pendingWaiters.push(resolve));
  }
  isRefreshing = true;
  try {
    const refreshToken = await SecureStore.getItemAsync('auth_refresh_token');
    if (!refreshToken) return null;
    const resp = await fetch(`${API_ENV.BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    if (!resp.ok) return null;
    const json: any = await resp.json();
    const newAccess: string | undefined = json?.data?.accessToken;
    const newRefresh: string | undefined = json?.data?.refreshToken;
    if (newAccess) await SecureStore.setItemAsync('auth_access_token', newAccess);
    if (newRefresh) await SecureStore.setItemAsync('auth_refresh_token', newRefresh);
    return newAccess ?? null;
  } catch {
    await SecureStore.deleteItemAsync('auth_access_token');
    await SecureStore.deleteItemAsync('auth_refresh_token');
    await SecureStore.deleteItemAsync('user_data');
    return null;
  } finally {
    isRefreshing = false;
    pendingWaiters.forEach((w) => w(null));
    pendingWaiters = [];
  }
}

async function request<T>(method: HttpMethod, path: string, body?: unknown): Promise<T> {
  let attempt = 0;
  let lastError: any = null;
  while (attempt <= MAX_RETRIES) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);
    try {
      const headers = await attachAuth({});
      const resp = await fetch(`${API_ENV.BASE_URL}${path}`, {
        method,
        headers,
        body: body !== undefined ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (resp.status === 401) {
        const newToken = await refreshAccessToken();
        if (newToken) {
          const retryHeaders = await attachAuth({});
          const retry = await fetch(`${API_ENV.BASE_URL}${path}`, {
            method,
            headers: retryHeaders,
            body: body !== undefined ? JSON.stringify(body) : undefined,
            signal: controller.signal,
          });
          if (!retry.ok) throw await toError(retry);
          return (await retry.json()) as T;
        }
      }

      if (!resp.ok) throw await toError(resp);
      return (await resp.json()) as T;
    } catch (error: any) {
      clearTimeout(timeout);
      lastError = error;
      // Reintentos solo para errores de red/timeout (AbortError/TypeError) o 5xx simulados por toError
      const isAbort = error?.name === 'AbortError';
      const isNetwork = error instanceof TypeError;
      const shouldRetry = isAbort || isNetwork || /HTTP 5\d\d/.test(String(error?.message || ''));
      if (attempt < MAX_RETRIES && shouldRetry) {
        const backoffMs = 500 * Math.pow(2, attempt); // 0.5s, 1s
        await new Promise(res => setTimeout(res, backoffMs));
        attempt += 1;
        continue;
      }
      throw error;
    }
  }
  throw lastError ?? new Error('Network error');
}

async function toError(resp: Response): Promise<Error> {
  try {
    const data = await resp.json();
    const message = data?.message || `HTTP ${resp.status}`;
    return new Error(message);
  } catch {
    return new Error(`HTTP ${resp.status}`);
  }
}

export function httpPost<T>(path: string, body?: unknown): Promise<T> {
  return request<T>('POST', path, body);
}



