import { z } from 'zod';

import { apiClient } from '@/lib/api/client';
import { envelope } from '@/lib/api/response';

const notification = z.object({
  id: z.number(),
  type: z.string(),
  title: z.string(),
  content: z.string(),
  resourceId: z.number().nullable(),
  createdAt: z.iso.datetime({ offset: true }),
  readAt: z.iso.datetime({ offset: true }).nullable(),
});

const notificationList = z.object({
  notifications: z.array(notification),
  unreadCount: z.number().int().nonnegative(),
});

export type NotificationItem = z.infer<typeof notification>;

export const notificationKeys = {
  list: (size: number) => ['notifications', 'list', size] as const,
};

export async function listNotifications(size = 30) {
  const response = await apiClient.get<unknown>('/notifications', { params: { size } });
  return envelope(notificationList).parse(response.data).data;
}
export async function markNotificationRead(id: number) {
  await apiClient.patch(`/notifications/${id}/read`);
}
