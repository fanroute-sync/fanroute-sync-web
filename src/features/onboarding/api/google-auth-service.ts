import { apiClient } from '@/lib/api/client';
import { googleAuthResponseSchema } from '@/features/onboarding/model/google-auth';

export async function exchangeGoogleAuthorizationCode(authorizationCode: string) {
  const response = await apiClient.post<unknown>('/auth/google', { authorizationCode });
  return googleAuthResponseSchema.parse(response.data).data;
}
