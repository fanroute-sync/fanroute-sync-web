import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { communityRepository } from '../api/community-repository';
import { getMyProfile } from '@/features/onboarding/api/user-service';
import { CommentThread } from './comment-thread';
import { CommunityDetailScreen } from './community-detail-screen';
import { CommunityListScreen } from './community-list-screen';
vi.mock('next/navigation', () => ({ usePathname: () => '/community', useRouter: () => ({ push: vi.fn() }) }));
vi.mock('@/features/onboarding/api/user-service', async (importOriginal) => {
  const original = await importOriginal<typeof import('@/features/onboarding/api/user-service')>();
  return { ...original, getMyProfile: vi.fn() };
});
function wrapper({ children }: { children: ReactNode }) { return <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>{children}</QueryClientProvider>; }
const post = { id: 1, type: 'INFO' as const, title: '실제 게시글', content: '본문', tags: ['부산'], authorId: 2, authorNickname: '팬', concertId: null, concertTitle: null, tripPlanId: null, companionDate: null, capacity: null, currentMembers: null, region: null, likeCount: 2, likedByMe: true, commentCount: 1, createdAt: '2026-09-17T00:00:00' };
describe('community screens', () => {
  it('renders page content and sends server filters and sort', async () => {
    const user = userEvent.setup();
    const spy = vi.spyOn(communityRepository, 'listPosts').mockResolvedValue({ content: [post], number: 0, size: 20, totalElements: 1, totalPages: 1, first: true, last: true });
    render(<CommunityListScreen />, { wrapper });
    expect(await screen.findByText('실제 게시글')).toBeInTheDocument();
    expect(screen.getByLabelText('좋아요 누른 게시글')).toBeInTheDocument();
    expect(spy).toHaveBeenCalledWith({ sort: 'latest', page: 0, size: 20 });
    await user.click(screen.getByRole('tab', { name: '정보 공유' }));
    await waitFor(() => expect(spy).toHaveBeenCalledWith({ type: 'INFO', sort: 'latest', page: 0, size: 20 }));
    await user.type(screen.getByLabelText('공연명, 장소, 해시태그 검색'), '공연');
    await waitFor(() => expect(spy).toHaveBeenCalledWith({ type: 'INFO', query: '공연', sort: 'latest', page: 0, size: 20 }));
    await user.selectOptions(screen.getByLabelText('정렬'), 'popular');
    await waitFor(() => expect(spy).toHaveBeenCalledWith({ type: 'INFO', query: '공연', sort: 'popular', page: 0, size: 20 }));
    await user.selectOptions(screen.getByLabelText('지역 필터'), '수영구');
    await waitFor(() => expect(spy).toHaveBeenCalledWith({ type: 'INFO', query: '공연', region: '수영구', sort: 'popular', page: 0, size: 20 }));
    spy.mockRestore();
  });
  it('indents replies once and uses each API likedByMe value', () => {
    const comments = [
      { id: 1, parentId: null, authorId: 2, authorNickname: '팬', content: '댓글', likeCount: 2, likedByMe: false, createdAt: '2026-09-17T00:00:00' },
      { id: 2, parentId: 1, authorId: 3, authorNickname: '답글러', content: '답글', likeCount: 1, likedByMe: true, createdAt: '2026-09-17T00:00:00' },
    ];
    const { container } = render(<CommentThread comments={comments} userId={null} onLike={vi.fn()} onReply={vi.fn()} onDelete={vi.fn()} />);
    expect(container.querySelectorAll('[data-reply-depth="1"]')).toHaveLength(1);
    expect(container.querySelectorAll('[data-reply-depth="2"]')).toHaveLength(0);
    expect(screen.getByRole('button', { name: '팬 댓글 좋아요' })).not.toHaveClass('text-red-600');
    expect(screen.getByRole('button', { name: '답글러 댓글 좋아요' })).toHaveAttribute('aria-pressed', 'true');
  });
  it('uses fetched like state, then refetched server state after post and comment likes', async () => {
    const user = userEvent.setup();
    vi.mocked(getMyProfile).mockResolvedValue({ id: 9 });
    let liked = true;
    const comment = { id: 3, parentId: null, authorId: 2, authorNickname: '팬', content: '댓글', likeCount: 2, likedByMe: true, createdAt: '2026-09-17T00:00:00' };
    const detailSpy = vi.spyOn(communityRepository, 'getPost').mockImplementation(async () => ({ post: { ...post, likedByMe: liked, likeCount: liked ? 2 : 1 }, comments: [{ ...comment, likedByMe: liked, likeCount: liked ? 2 : 1 }] }));
    const postSpy = vi.spyOn(communityRepository, 'setPostLike').mockImplementation(async (_id, next) => { liked = next; });
    const commentSpy = vi.spyOn(communityRepository, 'setCommentLike').mockImplementation(async (_id, _commentId, next) => { liked = next; });
    render(<CommunityDetailScreen postId='1' />, { wrapper });
    const postButton = await screen.findByRole('button', { name: '게시글 좋아요' });
    expect(postButton).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: '팬 댓글 좋아요' })).toHaveAttribute('aria-pressed', 'true');
    await user.click(postButton);
    await waitFor(() => expect(postSpy).toHaveBeenCalledWith(1, false));
    await waitFor(() => expect(postButton).toHaveAttribute('aria-pressed', 'false'));
    await user.click(screen.getByRole('button', { name: '팬 댓글 좋아요' }));
    await waitFor(() => expect(commentSpy).toHaveBeenCalledWith(1, 3, true));
    await waitFor(() => expect(screen.getByRole('button', { name: '팬 댓글 좋아요' })).toHaveAttribute('aria-pressed', 'true'));
    expect(detailSpy).toHaveBeenCalledTimes(3);
    detailSpy.mockRestore(); postSpy.mockRestore(); commentSpy.mockRestore();
  });
});
