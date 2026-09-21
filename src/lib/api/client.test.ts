import type { InternalAxiosRequestConfig } from 'axios';
import { afterEach, expect, it, vi } from 'vitest';

import { apiClient } from '@/lib/api/client';

afterEach(() => localStorage.clear());

it('does not attach a previous session token to Google sign-in', async () => {
  localStorage.setItem('accessToken', 'expired-session-token');
  const adapter = vi.fn(async (config: InternalAxiosRequestConfig) => ({ data: {}, status: 200, statusText: 'OK', headers: {}, config }));

  await apiClient.post('/auth/google', { authorizationCode: 'fresh-code' }, {
    adapter,
    headers: { Authorization: 'Bearer previous-token' },
  });

  const config = adapter.mock.calls[0]?.[0];
  expect(config?.headers.has('Authorization')).toBe(false);
  expect(config?.data).toBe(JSON.stringify({ authorizationCode: 'fresh-code' }));
});

it('continues attaching the session token to protected API requests', async () => {
  localStorage.setItem('accessToken', 'current-session-token');
  const adapter = vi.fn(async (config: InternalAxiosRequestConfig) => ({ data: {}, status: 200, statusText: 'OK', headers: {}, config }));

  await apiClient.get('/users/me', { adapter });

  expect(adapter.mock.calls[0]?.[0].headers.get('Authorization')).toBe('Bearer current-session-token');
});
