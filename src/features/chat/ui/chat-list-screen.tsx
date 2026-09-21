'use client';
import Link from 'next/link';
import { AppShell, ContentContainer, PageHeader } from '@/components/layout';
import { EmptyState, ErrorState, Loading } from '@/components/common';
import { useChatRooms } from '../api/chat-queries';
import { getApiErrorMessage } from '@/lib/api/error-message';
export function ChatListScreen() {
  const rooms = useChatRooms();
  return <AppShell header={<PageHeader title='동행 채팅' backHref='/community' />}><ContentContainer>
    {rooms.isPending ? <Loading /> : rooms.isError ? <ErrorState description={getApiErrorMessage(rooms.error)} onRetry={() => void rooms.refetch()} /> : rooms.data.length === 0 ? <EmptyState title='참여 중인 채팅방이 없어요' description='동행 모집에서 대화를 시작해보세요.' /> : <ul className='space-y-3'>{rooms.data.map((room) => <li key={room.roomId}><Link href={`/chat/${room.roomId}`} className='block rounded-2xl border border-gray-200 p-4'><div className='flex justify-between gap-3'><strong>{room.title}</strong>{room.unreadCount > 0 ? <span aria-label={`읽지 않은 메시지 ${room.unreadCount}개`} className='rounded-full bg-violet-600 px-2 text-xs text-white'>{room.unreadCount}</span> : null}</div><p className='mt-2 truncate text-sm text-gray-600'>{room.lastMessage ?? '아직 메시지가 없습니다.'}</p>{room.lastMessageAt ? <time dateTime={room.lastMessageAt} className='text-xs text-gray-400'>{new Date(room.lastMessageAt).toLocaleString('ko-KR')}</time> : null}</Link></li>)}</ul>}
  </ContentContainer></AppShell>;
}
