import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export const apiClient = axios.create({
  baseURL: apiBaseUrl,
  timeout: 10_000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

const refreshClient = axios.create({ baseURL: apiBaseUrl, timeout: 10_000, withCredentials: true });
let refreshPromise: Promise<string> | null = null;

function isAuthEndpoint(url?: string) {
  return url === '/auth/google' || url === '/auth/token/refresh' || url === '/auth/logout';
}

async function refreshAccessToken(): Promise<string> {
  const response = await refreshClient.post<unknown>('/auth/token/refresh', undefined, {
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
  });
  const body = response.data;
  if (typeof body !== 'object' || body === null || !('data' in body)) throw new Error('INVALID_REFRESH_RESPONSE');
  const data = body.data;
  if (typeof data !== 'object' || data === null || !('accessToken' in data) || typeof data.accessToken !== 'string') {
    throw new Error('INVALID_REFRESH_RESPONSE');
  }
  localStorage.setItem('accessToken', data.accessToken);
  window.dispatchEvent(new Event('auth-session-change'));
  return data.accessToken;
}

export function restoreAccessToken(): Promise<string> {
  refreshPromise ??= refreshAccessToken().finally(() => { refreshPromise = null; });
  return refreshPromise;
}

apiClient.interceptors.request.use((config) => {
  if (typeof window === 'undefined') {
    return config;
  }

  const accessToken = localStorage.getItem('accessToken');

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!(error instanceof AxiosError) || error.response?.status !== 401 || typeof window === 'undefined') {
      return Promise.reject(error);
    }
    const config = error.config as (InternalAxiosRequestConfig & { _authRetried?: boolean }) | undefined;
    if (!config || config._authRetried || isAuthEndpoint(config.url)) return Promise.reject(error);
    config._authRetried = true;
    try {
      config.headers.Authorization = `Bearer ${await restoreAccessToken()}`;
      return await apiClient(config);
    } catch {
      localStorage.removeItem('accessToken');
      window.dispatchEvent(new Event('auth-session-change'));
      return Promise.reject(error);
    }
  }
);
