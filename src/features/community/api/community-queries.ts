'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { communityPostFixtures } from '@/features/community/fixtures/community-fixtures';
import { communityRepository } from '@/features/community/api/community-repository';
import type { CommunityComment, CommunityPost } from '@/features/community/model/community';

export const communityKeys = {
  all: ['community'] as const,
  lists: () => [...communityKeys.all, 'list'] as const,
  detail: (postId: string) => [...communityKeys.all, 'detail', postId] as const,
};

export function useCommunityPosts() {
  return useQuery({ queryKey: communityKeys.lists(), queryFn: communityRepository.listPosts, placeholderData: communityPostFixtures });
}

export function useCommunityPost(postId: string, initialData?: CommunityPost) {
  return useQuery<CommunityPost>({ queryKey: communityKeys.detail(postId), queryFn: async () => { const post = await communityRepository.getPost(postId); if (!post) throw new Error('NOT_FOUND'); return post; }, initialData });
}

export function useCreatePost() {
  const client = useQueryClient();
  return useMutation({ mutationFn: (post: CommunityPost) => communityRepository.createPost(post), onSuccess: () => client.invalidateQueries({ queryKey: communityKeys.lists() }) });
}

export function useTogglePostLike(postId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: () => communityRepository.togglePostLike(postId),
    onMutate: async () => { await client.cancelQueries({ queryKey: communityKeys.detail(postId) }); const previous = client.getQueryData<CommunityPost>(communityKeys.detail(postId)); client.setQueryData<CommunityPost>(communityKeys.detail(postId), (post) => post ? { ...post, liked: !post.liked, likeCount: post.likeCount + (post.liked ? -1 : 1) } : post); return { previous }; },
    onError: (_error, _variables, context) => client.setQueryData(communityKeys.detail(postId), context?.previous),
    onSettled: () => client.invalidateQueries({ queryKey: communityKeys.detail(postId) }),
  });
}

export function useAddComment(postId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (comment: CommunityComment) => communityRepository.addComment(postId, comment),
    onMutate: async (comment) => { await client.cancelQueries({ queryKey: communityKeys.detail(postId) }); const previous = client.getQueryData<CommunityPost>(communityKeys.detail(postId)); client.setQueryData<CommunityPost>(communityKeys.detail(postId), (post) => post ? { ...post, comments: [...post.comments, comment] } : post); return { previous }; },
    onError: (_error, _comment, context) => client.setQueryData(communityKeys.detail(postId), context?.previous),
    onSettled: () => client.invalidateQueries({ queryKey: communityKeys.detail(postId) }),
  });
}

export function useToggleCommentLike(postId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (commentId: string) => communityRepository.toggleCommentLike(postId, commentId),
    onMutate: async (commentId) => { await client.cancelQueries({ queryKey: communityKeys.detail(postId) }); const previous = client.getQueryData<CommunityPost>(communityKeys.detail(postId)); client.setQueryData<CommunityPost>(communityKeys.detail(postId), (post) => post ? { ...post, comments: post.comments.map((comment) => comment.id === commentId ? { ...comment, liked: !comment.liked, likeCount: comment.likeCount + (comment.liked ? -1 : 1) } : comment) } : post); return { previous }; },
    onError: (_error, _commentId, context) => client.setQueryData(communityKeys.detail(postId), context?.previous),
    onSettled: () => client.invalidateQueries({ queryKey: communityKeys.detail(postId) }),
  });
}

export function useDeletePost(postId: string) {
  const client = useQueryClient();
  return useMutation({ mutationFn: () => communityRepository.deletePost(postId), onSuccess: () => client.invalidateQueries({ queryKey: communityKeys.all }) });
}

export function useDeleteComment(postId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (commentId: string) => communityRepository.deleteComment(postId, commentId),
    onMutate: async (commentId) => { await client.cancelQueries({ queryKey: communityKeys.detail(postId) }); const previous = client.getQueryData<CommunityPost>(communityKeys.detail(postId)); const target = previous?.comments.find((comment) => comment.id === commentId); const rootId = target?.rootCommentId ?? commentId; client.setQueryData<CommunityPost>(communityKeys.detail(postId), (post) => post ? { ...post, comments: post.comments.filter((comment) => comment.id !== commentId && (target?.rootCommentId || comment.rootCommentId !== rootId)) } : post); return { previous }; },
    onError: (_error, _commentId, context) => client.setQueryData(communityKeys.detail(postId), context?.previous),
    onSettled: () => client.invalidateQueries({ queryKey: communityKeys.detail(postId) }),
  });
}
