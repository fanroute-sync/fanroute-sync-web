import { apiClient } from '@/lib/api/client';

export async function logoutSession() {
  try {
    await apiClient.post('/auth/logout', undefined, {
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
    });
  } finally {
    // A failed server request must not leave a usable local access token behind.
    localStorage.removeItem('accessToken');
    window.dispatchEvent(new Event('auth-session-change'));
  }
}
