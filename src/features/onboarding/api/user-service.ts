import { z } from 'zod';

import { apiClient } from '@/lib/api/client';
import { envelope } from '@/lib/api/response';

const nicknameAvailability = z.object({ nickname: z.string(), available: z.boolean() });

export const usersKeys = { all: ['users'] as const, me: () => ['users', 'me'] as const };

export async function getMyProfile() {
  const response = await apiClient.get<unknown>('/users/me');
  return envelope(z.unknown()).parse(response.data).data;
}

export async function checkNicknameAvailability(nickname: string) {
  const response = await apiClient.get<unknown>('/users/nickname-availability', { params: { nickname } });
  return envelope(nicknameAvailability).parse(response.data).data;
}

export async function updateMyNickname(nickname: string) {
  const response = await apiClient.patch<unknown>('/users/me', { nickname });
  return envelope(z.unknown()).parse(response.data).data;
}
