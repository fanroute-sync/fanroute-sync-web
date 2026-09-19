import { apiClient } from '@/lib/api/client';

export async function registerPushToken(token: string) {
  await apiClient.post('/notifications/push-tokens', { token });
}

export async function unregisterPushToken(token: string) {
  await apiClient.delete('/notifications/push-tokens', { data: { token } });
}
