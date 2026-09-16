import { beforeEach, describe, expect, it, vi } from 'vitest';
import { apiClient } from '@/lib/api/client';
import { communityRepository } from './community-repository';
vi.mock('@/lib/api/client', () => ({ apiClient: { get: vi.fn(), post: vi.fn(), delete: vi.fn(), request: vi.fn() } }));
const post = { id: 1, type: 'INFO', title: '부산', content: '내용', tags: [], authorId: 2, authorNickname: '팬', concertId: null, concertTitle: null, tripPlanId: null, companionDate: null, capacity: null, currentMembers: null, region: null, likeCount: 4, likedByMe: true, commentCount: 1, createdAt: '2026-09-17T00:00:00' };
const comment = { id: 3, parentId: null, authorId: 2, authorNickname: '팬', content: '댓글', likeCount: 0, likedByMe: false, createdAt: '2026-09-17T00:00:00' };
const wrap = (data: unknown) => ({ data: { success: true, status: 200, code: 'OK', message: 'OK', data } });
beforeEach(() => vi.clearAllMocks());
describe('community API', () => {
  it('reads the Spring Page content and forwards only selected filters', async () => {
    vi.mocked(apiClient.get).mockResolvedValue(wrap({ content: [post], number: 0, size: 20, totalElements: 1, totalPages: 1, first: true, last: true }));
    const params = { type: 'INFO' as const, query: '부산', sort: 'popular' as const, page: 0, size: 20 };
    expect((await communityRepository.listPosts(params)).content).toEqual([post]);
    expect(apiClient.get).toHaveBeenCalledWith('/community/posts', { params });
    expect(apiClient.get).not.toHaveBeenCalledWith('/community/posts', { params: expect.objectContaining({ region: expect.anything() }) });
  });
  it('reads detail.post and detail.comments', async () => {
    vi.mocked(apiClient.get).mockResolvedValue(wrap({ post, comments: [comment] }));
    expect(await communityRepository.getPost(1)).toEqual({ post, comments: [comment] });
  });
  it.each([
    { type: 'INFO' as const, title: '정보', tags: [], content: '본문' },
    { type: 'ROUTE' as const, title: '루트', tags: [], tripPlanId: 12 },
    { type: 'COMPANION' as const, title: '동행', tags: [], concertId: 5, companionDate: '2026-09-17', capacity: 3 },
  ])('sends the $type request without invented fields', async (input) => {
    vi.mocked(apiClient.post).mockResolvedValue(wrap(post));
    await communityRepository.createPost(input);
    expect(apiClient.post).toHaveBeenCalledWith('/community/posts', input);
  });
  it('sends root and reply parent IDs', async () => {
    vi.mocked(apiClient.post).mockResolvedValue(wrap(comment));
    await communityRepository.addComment(1, { content: '댓글', parentId: null });
    await communityRepository.addComment(1, { content: '답글', parentId: 3 });
    expect(apiClient.post).toHaveBeenNthCalledWith(1, '/community/posts/1/comments', { content: '댓글', parentId: null });
    expect(apiClient.post).toHaveBeenNthCalledWith(2, '/community/posts/1/comments', { content: '답글', parentId: 3 });
  });
  it('uses delete and both like methods', async () => {
    await communityRepository.deletePost(1); await communityRepository.deleteComment(1, 3);
    await communityRepository.setPostLike(1, true); await communityRepository.setPostLike(1, false);
    await communityRepository.setCommentLike(1, 3, true); await communityRepository.setCommentLike(1, 3, false);
    expect(apiClient.delete).toHaveBeenCalledWith('/community/posts/1');
    expect(apiClient.delete).toHaveBeenCalledWith('/community/posts/1/comments/3');
    expect(apiClient.request).toHaveBeenCalledWith({ url: '/community/posts/1/like', method: 'PUT' });
    expect(apiClient.request).toHaveBeenCalledWith({ url: '/community/posts/1/like', method: 'DELETE' });
    expect(apiClient.request).toHaveBeenCalledWith({ url: '/community/posts/1/comments/3/like', method: 'PUT' });
    expect(apiClient.request).toHaveBeenCalledWith({ url: '/community/posts/1/comments/3/like', method: 'DELETE' });
  });
});
