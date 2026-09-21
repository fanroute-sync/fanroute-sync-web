'use client';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { chatService } from './chat-service';
export const chatKeys = { all: ['chat'] as const, rooms: () => [...chatKeys.all, 'rooms'] as const, messages: (id: number) => [...chatKeys.all, 'messages', id] as const };
export function useChatRooms() { return useQuery({ queryKey: chatKeys.rooms(), queryFn: chatService.rooms }); }
export function useChatMessages(roomId: number) { return useInfiniteQuery({ queryKey: chatKeys.messages(roomId), queryFn: ({ pageParam }) => chatService.messages(roomId, pageParam), initialPageParam: undefined as number | undefined, getNextPageParam: (page) => page.hasNext ? page.nextBeforeMessageId ?? undefined : undefined, enabled: Number.isInteger(roomId) && roomId > 0 }); }
export function useAcceptChatMember(roomId: number) { const client = useQueryClient(); return useMutation({ mutationFn: (commentId: number) => chatService.accept(roomId, commentId), onSuccess: () => { void client.invalidateQueries({ queryKey: chatKeys.rooms() }); } }); }
