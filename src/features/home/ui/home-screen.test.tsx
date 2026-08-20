import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { emptyHomeFixture, registeredHomeFixture } from '@/features/home/fixtures/home-fixtures';
import { HomeScreen } from '@/features/home/ui/home-screen';

vi.mock('next/navigation', () => ({ usePathname: () => '/' }));

describe('HomeScreen', () => {
  it('renders the empty trip state and common content', () => {
    render(<HomeScreen data={emptyHomeFixture} />);

    expect(screen.getByText('아직 등록된 일정이 없어요')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '여행 일정 만들기' })).toHaveAttribute('href', '/trips/new');
    expect(screen.getByRole('heading', { name: '부산 콘서트 정보' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '매거진' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '공지사항' })).toBeInTheDocument();
  });

  it('renders the registered trip state', () => {
    render(<HomeScreen data={registeredHomeFixture} />);

    expect(screen.getByText('D-3')).toBeInTheDocument();
    expect(screen.getByText('SUMMER WAVE in BUSAN')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /오늘 일정 보기/ })).toHaveAttribute(
      'href',
      '/trips/trip-busan-2026/days/2026-08-20'
    );
    expect(screen.getByRole('heading', { name: '과거에 만든 루트' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '추천 루트 바로가기' })).toBeInTheDocument();
  });
});
