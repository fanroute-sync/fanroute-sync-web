import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AuthGate } from './auth-gate';

const navigation = vi.hoisted(() => ({ pathname: '/', replace: vi.fn() }));
vi.mock('next/navigation', () => ({
  usePathname: () => navigation.pathname,
  useRouter: () => ({ replace: navigation.replace }),
}));

describe('AuthGate', () => {
  beforeEach(() => {
    localStorage.clear();
    navigation.pathname = '/';
    navigation.replace.mockClear();
  });

  it('sends visitors without a token to login without showing service content', async () => {
    render(<AuthGate><p>서비스 화면</p></AuthGate>);
    expect(screen.queryByText('서비스 화면')).not.toBeInTheDocument();
    await waitFor(() => expect(navigation.replace).toHaveBeenCalledWith('/login'));
  });

  it('shows the service after a token is stored', () => {
    localStorage.setItem('accessToken', 'token');
    render(<AuthGate><p>서비스 화면</p></AuthGate>);
    expect(screen.getByText('서비스 화면')).toBeInTheDocument();
    expect(navigation.replace).not.toHaveBeenCalled();
  });

  it('keeps the login page available to visitors', () => {
    navigation.pathname = '/login';
    render(<AuthGate><p>로그인 화면</p></AuthGate>);
    expect(screen.getByText('로그인 화면')).toBeInTheDocument();
  });
});
