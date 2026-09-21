import { beforeEach, describe, expect, it, vi } from 'vitest';
import { apiClient } from '@/lib/api/client';
import { chatService, mergeMessages, type ChatMessage } from './chat-service';
import { chatSocketUrl } from './chat-socket';

const ok = (data: unknown) => ({ data: { success: true, status: 200, code: 'OK', message: 'OK', data } });
const message = (id: number): ChatMessage => ({ id, roomId: 10, senderId: 1, senderNickname: '팬', content: `${id}`, createdAt: '2026-09-21T10:00:00', readCount: 0 });
beforeEach(() => vi.restoreAllMocks());
describe('chat REST', () => {
  it('loads rooms including an empty room', async () => {
    vi.spyOn(apiClient, 'get').mockResolvedValueOnce(ok([{ roomId: 10, companionPostId: 5, title: '동행', lastMessage: null, lastMessageAt: null, unreadCount: 2 }]));
    expect((await chatService.rooms())[0]).toMatchObject({ roomId: 10, lastMessage: null, unreadCount: 2 });
    expect(apiClient.get).toHaveBeenCalledWith('/chat/rooms');
  });
  it('uses the cursor and page size and preserves server order', async () => {
    vi.spyOn(apiClient, 'get').mockResolvedValueOnce(ok({ messages: [message(1), message(2)], hasNext: false, nextBeforeMessageId: null }));
    expect((await chatService.messages(10, 3)).messages.map((item) => item.id)).toEqual([1, 2]);
    expect(apiClient.get).toHaveBeenCalledWith('/chat/rooms/10/messages', { params: { beforeMessageId: 3, size: 50 } });
    await expect(chatService.messages(10, undefined, 101)).rejects.toThrow('INVALID_PAGE_SIZE');
  });
  it('sends adoption and read requests with server IDs', async () => {
    vi.spyOn(apiClient, 'post').mockResolvedValueOnce(ok(undefined));
    vi.spyOn(apiClient, 'patch').mockResolvedValueOnce(ok(undefined));
    await chatService.accept(10, 123); await chatService.read(10, 456);
    expect(apiClient.post).toHaveBeenCalledWith('/chat/rooms/10/members', { commentId: 123 });
    expect(apiClient.patch).toHaveBeenCalledWith('/chat/rooms/10/read', { lastReadMessageId: 456 });
  });
});
it('merges paginated and live messages once by ID', () => {
  expect(mergeMessages([message(2), message(3)], [message(1), message(2)]).map((item) => item.id)).toEqual([1, 2, 3]);
});
it('converts the API URL to a native WebSocket URL', () => {
  expect(chatSocketUrl('https://api.example.com/api/v1')).toBe('wss://api.example.com/ws/chat');
  expect(chatSocketUrl('http://localhost:8080')).toBe('ws://localhost:8080/ws/chat');
});
