'use client';

import { useQuery } from '@tanstack/react-query';
import { Bell } from 'lucide-react';
import Link from 'next/link';

import { listNotifications, notificationKeys } from '@/features/notification/api/notification-service';

export function NotificationBell() {
  const notifications = useQuery({ queryKey: notificationKeys.list(30), queryFn: () => listNotifications(30) });
  const unreadCount = notifications.data?.unreadCount ?? 0;

  return <Link href='/notifications' aria-label={unreadCount > 0 ? `알림 ${unreadCount}개 읽지 않음` : '알림'} className='relative grid size-10 place-items-center rounded-full text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500'>
    <Bell aria-hidden='true' size={20} />
    {unreadCount > 0 ? <span aria-hidden='true' className='absolute right-0 top-0 min-w-4 rounded-full bg-violet-600 px-1 text-center text-[10px] leading-4 text-white'>{unreadCount > 99 ? '99+' : unreadCount}</span> : null}
  </Link>;
}
