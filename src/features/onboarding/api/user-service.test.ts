import { afterEach, describe, expect, it, vi } from 'vitest';

import { apiClient } from '@/lib/api/client';
import { getMyProfile } from './user-service';

describe('getMyProfile', () => {
  afterEach(() => vi.restoreAllMocks());

  it('returns the validated profile from the current-user response', async () => {
    const data = { id: 1, nickname: 'fanroute', email: 'user@example.com', authProvider: 'GOOGLE', status: 'ACTIVE' };
    const get = vi.spyOn(apiClient, 'get').mockResolvedValue({ data: { success: true, status: 200, code: 'OK', message: '요청이 성공적으로 처리되었습니다.', data } });

    await expect(getMyProfile()).resolves.toEqual(data);
    expect(get).toHaveBeenCalledWith('/users/me');
  });

  it('rejects a response without the required user fields', async () => {
    vi.spyOn(apiClient, 'get').mockResolvedValue({ data: { success: true, status: 200, code: 'OK', message: 'OK', data: { nickname: 'fanroute' } } });

    await expect(getMyProfile()).rejects.toThrow();
  });
});
