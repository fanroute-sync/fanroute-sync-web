import { z } from 'zod';
import { apiClient } from '@/lib/api/client';
import { envelope } from '@/lib/api/response';

export const chatMessageSchema = z.object({ id: z.number(), roomId: z.number(), senderId: z.number(), senderNickname: z.string(), content: z.string(), createdAt: z.string(), readCount: z.number() });
export const chatReadSchema = z.object({ roomId: z.number(), userId: z.number(), lastReadMessageId: z.number() });
const roomSchema = z.object({ roomId: z.number(), companionPostId: z.number(), title: z.string(), lastMessageAt: z.string().nullable(), lastMessage: z.string().nullable(), unreadCount: z.number() });
const historySchema = z.object({ messages: z.array(chatMessageSchema), hasNext: z.boolean(), nextBeforeMessageId: z.number().nullable() });
export type ChatRoom = z.infer<typeof roomSchema>;
export type ChatMessage = z.infer<typeof chatMessageSchema>;
export type ChatReadEvent = z.infer<typeof chatReadSchema>;
export type ChatHistory = z.infer<typeof historySchema>;

const path = '/chat/rooms';
export const chatService = {
  async rooms(): Promise<ChatRoom[]> { const response = await apiClient.get<unknown>(path); return envelope(z.array(roomSchema)).parse(response.data).data; },
  async messages(roomId: number, beforeMessageId?: number, size = 50): Promise<ChatHistory> {
    if (!Number.isInteger(size) || size < 1 || size > 100) throw new Error('INVALID_PAGE_SIZE');
    const response = await apiClient.get<unknown>(`${path}/${roomId}/messages`, { params: { ...(beforeMessageId === undefined ? {} : { beforeMessageId }), size } });
    return envelope(historySchema).parse(response.data).data;
  },
  async accept(roomId: number, commentId: number): Promise<void> { await apiClient.post(`${path}/${roomId}/members`, { commentId }); },
  async read(roomId: number, lastReadMessageId: number): Promise<void> { await apiClient.patch(`${path}/${roomId}/read`, { lastReadMessageId }); },
};

export function mergeMessages(...groups: ChatMessage[][]): ChatMessage[] {
  return [...new Map(groups.flat().map((message) => [message.id, message])).values()].sort((a, b) => a.id - b.id);
}
