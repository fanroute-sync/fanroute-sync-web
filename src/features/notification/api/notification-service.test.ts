import { afterEach, describe, expect, it, vi } from 'vitest';

import { apiClient } from '@/lib/api/client';
import { listNotifications, markNotificationRead } from './notification-service';

afterEach(() => vi.restoreAllMocks());

describe('notification list API', () => {
  it('requests 30 items and parses unread status', async () => {
    const get = vi.spyOn(apiClient, 'get').mockResolvedValue({ data: {
      success: true, status: 200, code: 'OK', message: 'ok',
      data: { notifications: [{ id: 1, type: 'CHAT', title: '새 메시지', content: '새 메시지가 도착했습니다.', resourceId: 1, createdAt: '2026-09-01T12:00:00Z', readAt: null }], unreadCount: 1 },
    } });

    const result = await listNotifications();
    expect(get).toHaveBeenCalledWith('/notifications', { params: { size: 30 } });
    expect(result.notifications[0].readAt).toBeNull();
    expect(result.unreadCount).toBe(1);
  });
  it('marks a notification read without a request body', async () => {
    const patch = vi.spyOn(apiClient, 'patch').mockResolvedValue({ data: null });
    await markNotificationRead(7);
    expect(patch).toHaveBeenCalledWith('/notifications/7/read');
  });
});
