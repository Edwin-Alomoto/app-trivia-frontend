import * as SecureStore from 'expo-secure-store';
import { API_ENV } from './env';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

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
  const headers = await attachAuth({});
  const resp = await fetch(`${API_ENV.BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  if (resp.status === 401) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      const retryHeaders = await attachAuth({});
      const retry = await fetch(`${API_ENV.BASE_URL}${path}`, {
        method,
        headers: retryHeaders,
        body: body !== undefined ? JSON.stringify(body) : undefined,
      });
      if (!retry.ok) throw await toError(retry);
      return (await retry.json()) as T;
    }
  }
  if (!resp.ok) throw await toError(resp);
  return (await resp.json()) as T;
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



