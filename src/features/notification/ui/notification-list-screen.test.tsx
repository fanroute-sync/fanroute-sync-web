import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { listNotifications } from '@/features/notification/api/notification-service';
import { NotificationListScreen } from './notification-list-screen';

vi.mock('next/navigation', () => ({ usePathname: () => '/notifications', useRouter: () => ({ back: vi.fn() }) }));
vi.mock('@/features/notification/api/notification-service', async (importOriginal) => ({ ...await importOriginal<typeof import('@/features/notification/api/notification-service')>(), listNotifications: vi.fn() }));

function wrapper({ children }: { children: ReactNode }) {
  return <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>{children}</QueryClientProvider>;
}

afterEach(() => vi.clearAllMocks());

describe('notification list screen', () => {
  it('shows unread count and notification content', async () => {
    vi.mocked(listNotifications).mockResolvedValue({ notifications: [{ id: 1, type: 'CHAT', title: '새 메시지', content: '새 메시지가 도착했습니다.', resourceId: 1, createdAt: '2026-09-01T12:00:00Z', readAt: null }], unreadCount: 1 });
    render(<NotificationListScreen />, { wrapper });
    expect(await screen.findByText('새 메시지')).toBeInTheDocument();
    expect(screen.getByText('읽지 않은 알림 1개')).toBeInTheDocument();
    expect(screen.getByText('읽지 않음')).toBeInTheDocument();
  });

  it('shows an empty state', async () => {
    vi.mocked(listNotifications).mockResolvedValue({ notifications: [], unreadCount: 0 });
    render(<NotificationListScreen />, { wrapper });
    expect(await screen.findByText('아직 알림이 없어요')).toBeInTheDocument();
  });
});
