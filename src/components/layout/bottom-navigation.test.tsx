import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { BottomNavigation } from './bottom-navigation';

const navigationMock = vi.hoisted(() => ({ pathname: '/' }));

vi.mock('next/navigation', () => ({
  usePathname: () => navigationMock.pathname,
}));

describe('BottomNavigation', () => {
  beforeEach(() => {
    navigationMock.pathname = '/';
  });

  it('marks only the main tab active on the root route', () => {
    render(<BottomNavigation />);

    expect(screen.getByRole('link', { name: '메인' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: '일정' })).not.toHaveAttribute('aria-current');
  });

  it('marks a tab active on its nested routes', () => {
    navigationMock.pathname = '/community/42';

    render(<BottomNavigation />);

    expect(screen.getByRole('link', { name: '커뮤니티' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: '메인' })).not.toHaveAttribute('aria-current');
  });
});
