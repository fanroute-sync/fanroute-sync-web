import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { communityRepository } from '@/features/community/api/community-repository';
import { communityPostFixtures } from '@/features/community/fixtures/community-fixtures';
import { CommentThread } from '@/features/community/ui/comment-thread';
import { CommunityDetailScreen } from '@/features/community/ui/community-detail-screen';
import { CommunityListScreen } from '@/features/community/ui/community-list-screen';

vi.mock('next/navigation', () => ({ usePathname: () => '/community', useRouter: () => ({ back: vi.fn(), push: vi.fn() }) }));

function wrapper() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
  return function Wrapper({ children }: { children: ReactNode }) { return <QueryClientProvider client={client}>{children}</QueryClientProvider>; };
}

describe('Phase 7 community screens', () => {
  it('searches posts by hashtag and filters by post type', async () => {
    const user = userEvent.setup();
    render(<CommunityListScreen />, { wrapper: wrapper() });
    await user.type(screen.getByLabelText('공연명, 장소, 해시태그 검색'), '맛집위주');
    expect(screen.getByText('공연 전 광안리 맛집 중심 루트')).toBeInTheDocument();
    expect(screen.queryByText('아시아드 공연장 물품보관소 정보')).not.toBeInTheDocument();
    await user.clear(screen.getByLabelText('공연명, 장소, 해시태그 검색'));
    await user.click(screen.getByRole('tab', { name: '동행 모집' }));
    expect(screen.getByText('공연 끝나고 서면까지 같이 가요')).toBeInTheDocument();
  });

  it('renders every nested reply at the same single reply depth', () => {
    const comments = communityPostFixtures[0].comments;
    const { container } = render(<CommentThread comments={comments} onLike={vi.fn()} onReply={vi.fn()} onDelete={vi.fn()} />);
    expect(container.querySelectorAll('[data-reply-depth="1"]')).toHaveLength(2);
    expect(container.querySelectorAll('[data-reply-depth="2"]')).toHaveLength(0);
  });

  it('rolls an optimistic post like back when the mutation fails', async () => {
    const user = userEvent.setup();
    let rejectMutation: (reason: Error) => void = () => undefined;
    const pending = new Promise<never>((_resolve, reject) => { rejectMutation = reject; });
    const spy = vi.spyOn(communityRepository, 'togglePostLike').mockReturnValueOnce(pending);
    render(<CommunityDetailScreen initialPost={structuredClone(communityPostFixtures[0])} />, { wrapper: wrapper() });
    const likeButton = screen.getByRole('button', { name: '게시글 좋아요' });
    await user.click(likeButton);
    expect(likeButton).toHaveTextContent('25');
    rejectMutation(new Error('NETWORK_ERROR'));
    await waitFor(() => expect(likeButton).toHaveTextContent('24'));
    spy.mockRestore();
  });
});
