import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { myPageFixture } from '@/features/mypage/fixtures/mypage-fixtures';
import { AiUsageScreen } from '@/features/mypage/ui/ai-usage-screen';
import { LanguageSettingsScreen } from '@/features/mypage/ui/language-settings-screen';
import { MyPageScreen } from '@/features/mypage/ui/mypage-screen';

const { replace } = vi.hoisted(() => ({ replace: vi.fn() }));
vi.mock('next/navigation', () => ({ usePathname: () => '/my', useRouter: () => ({ back: vi.fn(), push: vi.fn(), replace }) }));

function wrapper({ children }: { children: ReactNode }) { return <QueryClientProvider client={new QueryClient()}>{children}</QueryClientProvider>; }

describe('Phase 8 my page screens', () => {
  beforeEach(() => { replace.mockReset(); localStorage.clear(); });

  it('confirms logout, clears the session, and redirects to login', async () => {
    const user = userEvent.setup(); localStorage.setItem('accessToken', 'fixture-token');
    render(<MyPageScreen data={myPageFixture} />, { wrapper });
    expect(screen.queryByText('알림 설정')).not.toBeInTheDocument();
    expect(screen.queryByText('회원탈퇴')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '로그아웃' }));
    const dialog = screen.getByRole('alertdialog');
    expect(dialog).toHaveTextContent('저장된 일정과 활동 내역은그대로 유지됩니다.');
    await user.click(within(dialog).getByRole('button', { name: '로그아웃' }));
    expect(localStorage.getItem('accessToken')).toBeNull();
    expect(replace).toHaveBeenCalledWith('/login');
  });

  it('keeps Korean active and marks three languages as Phase 2', () => {
    render(<LanguageSettingsScreen />);
    expect(screen.getByText('한국어')).toBeInTheDocument();
    expect(screen.getAllByText('Phase 2')).toHaveLength(3);
  });

  it('renders only the successful server AI usage snapshot', () => {
    render(<AiUsageScreen usage={myPageFixture.aiUsage} />);
    expect(screen.getByText('4 / 5회')).toBeInTheDocument();
    expect(screen.getAllByText(/일정 생성 성공/)).toHaveLength(4);
    expect(screen.getByText(/실패한 생성은 포함되지 않습니다/)).toBeInTheDocument();
  });
});
