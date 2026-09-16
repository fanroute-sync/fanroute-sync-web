import { afterEach, expect, it, vi } from 'vitest';

import { exchangeGoogleAuthorizationCode } from '@/features/onboarding/api/google-auth-service';
import { apiClient } from '@/lib/api/client';

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

it('does not send an authorization code to the frontend origin when the API URL is missing', async () => {
  vi.stubEnv('NEXT_PUBLIC_API_BASE_URL', '');
  const post = vi.spyOn(apiClient, 'post');

  await expect(exchangeGoogleAuthorizationCode('one-time-code')).rejects.toThrow('API_BASE_URL_MISSING');
  expect(post).not.toHaveBeenCalled();
});
