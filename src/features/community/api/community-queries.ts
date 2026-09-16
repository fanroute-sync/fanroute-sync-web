'use client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { communityRepository } from './community-repository';
import type { CommunityPostCreateRequest, CommunityPostListParams } from '../model/community';
export const communityKeys = {
  all: ['community'] as const,
  lists: () => [...communityKeys.all, 'list'] as const,
  list: (params: CommunityPostListParams) => [...communityKeys.lists(), params] as const,
  detail: (postId: number) => [...communityKeys.all, 'detail', postId] as const,
};
export function useCommunityPosts(params: CommunityPostListParams) { return useQuery({ queryKey: communityKeys.list(params), queryFn: () => communityRepository.listPosts(params) }); }
export function useCommunityPost(postId: number) { return useQuery({ queryKey: communityKeys.detail(postId), queryFn: () => communityRepository.getPost(postId), enabled: Number.isInteger(postId) && postId > 0 }); }
export function useCreatePost() { const client = useQueryClient(); return useMutation({ mutationFn: (input: CommunityPostCreateRequest) => communityRepository.createPost(input), onSuccess: () => client.invalidateQueries({ queryKey: communityKeys.lists() }) }); }
export function useDeletePost(postId: number) { const client = useQueryClient(); return useMutation({ mutationFn: () => communityRepository.deletePost(postId), onSuccess: () => client.invalidateQueries({ queryKey: communityKeys.lists() }) }); }
export function useSetPostLike(postId: number) { const client = useQueryClient(); return useMutation({ mutationFn: (liked: boolean) => communityRepository.setPostLike(postId, liked), onSuccess: async () => { await Promise.all([client.invalidateQueries({ queryKey: communityKeys.detail(postId) }), client.invalidateQueries({ queryKey: communityKeys.lists() })]); } }); }
export function useAddComment(postId: number) { const client = useQueryClient(); return useMutation({ mutationFn: (input: { content: string; parentId: number | null }) => communityRepository.addComment(postId, input), onSuccess: async () => { await client.invalidateQueries({ queryKey: communityKeys.detail(postId) }); void client.invalidateQueries({ queryKey: communityKeys.lists() }); } }); }
export function useDeleteComment(postId: number) { const client = useQueryClient(); return useMutation({ mutationFn: (id: number) => communityRepository.deleteComment(postId, id), onSuccess: async () => { await client.invalidateQueries({ queryKey: communityKeys.detail(postId) }); void client.invalidateQueries({ queryKey: communityKeys.lists() }); } }); }
export function useSetCommentLike(postId: number) { const client = useQueryClient(); return useMutation({ mutationFn: ({ id, liked }: { id: number; liked: boolean }) => communityRepository.setCommentLike(postId, id, liked), onSuccess: () => client.invalidateQueries({ queryKey: communityKeys.detail(postId) }) }); }
