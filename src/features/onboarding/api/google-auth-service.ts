import { apiClient } from '@/lib/api/client';
import { googleAuthResponseSchema } from '@/features/onboarding/model/google-auth';

export async function exchangeGoogleAuthorizationCode(authorizationCode: string) {
  if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
    throw new Error('API_BASE_URL_MISSING');
  }
  const response = await apiClient.post<unknown>('/auth/google', { authorizationCode });
  return googleAuthResponseSchema.parse(response.data).data;
}
