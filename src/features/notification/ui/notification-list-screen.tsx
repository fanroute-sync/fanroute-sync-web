'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Bell } from 'lucide-react';
import { toast } from 'sonner';

import { EmptyState, ErrorState, Loading } from '@/components/common';
import { AppShell, ContentContainer, PageHeader } from '@/components/layout';
import { listNotifications, markNotificationRead, notificationKeys, type NotificationItem } from '@/features/notification/api/notification-service';
import { Button } from '@/components/ui';

const dateFormatter = new Intl.DateTimeFormat('ko-KR', {
  timeZone: 'Asia/Seoul',
  year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
});

function NotificationRow({ notification, onRead, reading }: { notification: NotificationItem; onRead: (id: number) => void; reading: boolean }) {
  const unread = notification.readAt === null;
  return <li className={`rounded-2xl border p-4 ${unread ? 'border-violet-200 bg-violet-50/60' : 'border-gray-200 bg-white'}`}>
    <article>
      <div className='flex items-start justify-between gap-3'>
        <h2 className='font-semibold text-gray-950'>{notification.title}</h2>
        {unread ? <span className='shrink-0 rounded-full bg-violet-100 px-2 py-0.5 text-xs font-semibold text-violet-700'>읽지 않음</span> : null}
      </div>
      <p className='mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-700'>{notification.content}</p>
      {unread ? <Button size='sm' variant='outline' disabled={reading} onClick={() => onRead(notification.id)}>읽음 표시</Button> : null}
      <time dateTime={notification.createdAt} className='mt-3 block text-xs text-gray-500'>{dateFormatter.format(new Date(notification.createdAt))}</time>
    </article>
  </li>;
}

export function NotificationListScreen() {
  const client = useQueryClient();
  const notifications = useQuery({ queryKey: notificationKeys.list(30), queryFn: () => listNotifications(30) });
  const read = useMutation({ mutationFn: markNotificationRead, onSuccess: () => client.invalidateQueries({ queryKey: notificationKeys.list(30) }), onError: () => toast.error('알림을 읽음 처리하지 못했어요.') });

  return <AppShell header={<PageHeader title='알림' backHref='/' />}><ContentContainer className='space-y-5'>
    {notifications.isPending ? <Loading label='알림을 불러오고 있어요' />
      : notifications.isError ? <ErrorState title='알림을 불러오지 못했어요' onRetry={() => void notifications.refetch()} />
      : <>
        <p className='text-sm text-gray-600' aria-live='polite'>읽지 않은 알림 {notifications.data.unreadCount}개</p>
        {notifications.data.notifications.length === 0 ? <EmptyState title='아직 알림이 없어요' description='새 알림이 오면 이곳에서 확인할 수 있어요.' icon={<Bell aria-hidden='true' size={24} />} />
          : <ul className='space-y-3'>{notifications.data.notifications.map((notification) => <NotificationRow key={notification.id} notification={notification} onRead={(id) => read.mutate(id)} reading={read.isPending} />)}</ul>}
      </>}
  </ContentContainer></AppShell>;
}
