'use client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AppShell, ContentContainer, PageHeader } from '@/components/layout';
import { Button, Input } from '@/components/ui';
import { EmptyState, ErrorState, Loading } from '@/components/common';
import { getApiErrorMessage } from '@/lib/api/error-message';
import { getMyProfile, usersKeys } from '@/features/onboarding/api/user-service';
import { chatKeys, useChatMessages, useChatRooms } from '../api/chat-queries';
import { chatService, mergeMessages, type ChatMessage } from '../api/chat-service';
import { connectChat } from '../api/chat-socket';

export function ChatRoomScreen({ roomId }: { roomId: number }) {
  const client = useQueryClient(); const rooms = useChatRooms(); const history = useChatMessages(roomId);
  const profile = useQuery({ queryKey: usersKeys.me(), queryFn: getMyProfile });
  const [live, setLive] = useState<ChatMessage[]>([]); const [content, setContent] = useState(''); const [status, setStatus] = useState('reconnecting'); const socket = useRef<ReturnType<typeof connectChat> | null>(null);
  const [readVersion, setReadVersion] = useState(0); const lastRead = useRef<number | null>(null); const scroll = useRef<HTMLDivElement>(null); const scrollHeight = useRef(0); const composing = useRef(false);
  const room = rooms.data?.find((item) => item.roomId === roomId);
  const messages = useMemo(() => mergeMessages(live, ...(history.data?.pages.map((page) => page.messages) ?? [])), [history.data, live]);
  const latest = messages.at(-1)?.id;
  const roomAvailable = Boolean(room);
  useEffect(() => {
    if (!roomAvailable || !Number.isInteger(roomId)) return;
    const connection = connectChat(roomId, {
      onMessage: (message) => { setLive((current) => mergeMessages(current, [message])); void client.invalidateQueries({ queryKey: chatKeys.rooms() }); },
      onRead: () => { setReadVersion((value) => value + 1); void client.invalidateQueries({ queryKey: chatKeys.messages(roomId) }); },
      onConnect: () => { void client.invalidateQueries({ queryKey: chatKeys.messages(roomId) }); void client.invalidateQueries({ queryKey: chatKeys.rooms() }); },
      onStatus: setStatus,
    });
    socket.current = connection;
    return () => { connection.disconnect(); socket.current = null; void client.invalidateQueries({ queryKey: chatKeys.rooms() }); };
  }, [client, roomId, roomAvailable]);
  useEffect(() => {
    if (!latest || document.visibilityState !== 'visible' || !document.hasFocus() || lastRead.current === latest) return;
    const timer = window.setTimeout(() => { if (lastRead.current === latest) return; lastRead.current = latest; void chatService.read(roomId, latest).then(() => client.invalidateQueries({ queryKey: chatKeys.rooms() })).catch(() => { lastRead.current = null; }); }, 400);
    return () => window.clearTimeout(timer);
  }, [latest, roomId, client, readVersion]);
  useEffect(() => { const onFocus = () => setReadVersion((value) => value + 1); window.addEventListener('focus', onFocus); document.addEventListener('visibilitychange', onFocus); return () => { window.removeEventListener('focus', onFocus); document.removeEventListener('visibilitychange', onFocus); }; }, []);
  useEffect(() => { const node = scroll.current; if (!node) return; if (scrollHeight.current) { node.scrollTop = node.scrollHeight - scrollHeight.current + node.scrollTop; scrollHeight.current = 0; } else if (node.scrollHeight - node.scrollTop - node.clientHeight < 180) node.scrollTop = node.scrollHeight; }, [messages.length]);
  const send = () => { if (socket.current?.send(content)) setContent(''); };
  if (rooms.isPending || history.isPending) return <AppShell header={<PageHeader title='동행 채팅' backHref='/chat' />}><Loading /></AppShell>;
  if (rooms.isError || history.isError || !room) return <AppShell header={<PageHeader title='동행 채팅' backHref='/chat' />}><ErrorState description={rooms.isError ? getApiErrorMessage(rooms.error) : history.isError ? getApiErrorMessage(history.error) : '참여 중인 채팅방을 찾을 수 없습니다.'} onRetry={() => { void rooms.refetch(); void history.refetch(); }} /></AppShell>;
  return <AppShell showBottomNavigation={false} header={<PageHeader title={room.title} backHref='/chat' />}><ContentContainer className='flex h-[calc(100dvh-5rem)] flex-col gap-3'>
    {status !== 'connected' ? <p role='status' className='text-sm text-amber-700'>{status === 'error' ? '채팅 연결을 확인해주세요.' : '채팅에 다시 연결하는 중입니다.'}</p> : null}
    <div ref={scroll} className='min-h-0 flex-1 space-y-3 overflow-y-auto' aria-label='채팅 메시지'>
      {history.hasNextPage ? <Button disabled={history.isFetchingNextPage} onClick={() => { scrollHeight.current = scroll.current?.scrollHeight ?? 0; void history.fetchNextPage(); }}>{history.isFetchingNextPage ? '불러오는 중' : '이전 메시지 불러오기'}</Button> : null}
      {messages.length === 0 ? <EmptyState title='아직 메시지가 없습니다.' /> : messages.map((message) => <div key={message.id} className={`rounded-xl p-3 ${message.senderId === profile.data?.id ? 'ml-8 bg-violet-100' : 'mr-8 bg-gray-100'}`}><p className='text-xs font-semibold'>{message.senderNickname}</p><p className='whitespace-pre-wrap break-words text-sm'>{message.content}</p><div className='flex justify-between gap-2'><time dateTime={message.createdAt} className='text-xs text-gray-500'>{new Date(message.createdAt).toLocaleString('ko-KR')}</time>{message.senderId === profile.data?.id ? <span className='text-xs text-gray-500'>읽음 {message.readCount}</span> : null}</div></div>)}
    </div>
    <form className='flex gap-2 pb-4' onSubmit={(event) => { event.preventDefault(); if (!composing.current) send(); }}><label htmlFor='chat-content' className='sr-only'>메시지</label><Input id='chat-content' value={content} maxLength={1000} onChange={(event) => setContent(event.target.value)} onCompositionStart={() => { composing.current = true; }} onCompositionEnd={() => { composing.current = false; }} onKeyDown={(event) => { if (event.key === 'Enter' && (composing.current || event.nativeEvent.isComposing)) event.preventDefault(); }} placeholder='메시지를 입력하세요' /><Button type='submit' disabled={status !== 'connected' || !content.trim()}>전송</Button></form>
  </ContentContainer></AppShell>;
}
