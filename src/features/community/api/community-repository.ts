import { z } from 'zod';
import { apiClient } from '@/lib/api/client';
import { envelope, page } from '@/lib/api/response';
import type { CommunityPostCreateRequest, CommunityPostListParams } from '../model/community';

const post = z.object({
  id: z.number(), type: z.enum(['INFO', 'ROUTE', 'COMPANION']), title: z.string(), content: z.string(), tags: z.array(z.string()),
  authorId: z.number(), authorNickname: z.string(), concertId: z.number().nullable(), concertTitle: z.string().nullable(),
  tripPlanId: z.number().nullable(), companionDate: z.string().nullable(), capacity: z.number().nullable(),
  currentMembers: z.number().nullable(), region: z.string().nullable(), likeCount: z.number(), likedByMe: z.boolean(), commentCount: z.number(), createdAt: z.string(),
});
const comment = z.object({ id: z.number(), parentId: z.number().nullable(), authorId: z.number(), authorNickname: z.string(), content: z.string(), likeCount: z.number(), likedByMe: z.boolean(), createdAt: z.string() });
const detail = z.object({ post, comments: z.array(comment) });
const postPage = page(post).extend({ first: z.boolean(), last: z.boolean() });
export const communityRepository = {
  async listPosts(params: CommunityPostListParams) { const response = await apiClient.get<unknown>('/community/posts', { params }); return envelope(postPage).parse(response.data).data; },
  async getPost(postId: number) { const response = await apiClient.get<unknown>(`/community/posts/${postId}`); return envelope(detail).parse(response.data).data; },
  async createPost(input: CommunityPostCreateRequest) { const response = await apiClient.post<unknown>('/community/posts', input); return envelope(post).parse(response.data).data; },
  async deletePost(postId: number) { await apiClient.delete(`/community/posts/${postId}`); },
  async setPostLike(postId: number, liked: boolean) { await apiClient.request({ url: `/community/posts/${postId}/like`, method: liked ? 'PUT' : 'DELETE' }); },
  async addComment(postId: number, input: { content: string; parentId: number | null }) { const response = await apiClient.post<unknown>(`/community/posts/${postId}/comments`, input); return envelope(comment).parse(response.data).data; },
  async deleteComment(postId: number, commentId: number) { await apiClient.delete(`/community/posts/${postId}/comments/${commentId}`); },
  async setCommentLike(postId: number, commentId: number, liked: boolean) { await apiClient.request({ url: `/community/posts/${postId}/comments/${commentId}/like`, method: liked ? 'PUT' : 'DELETE' }); },
};
