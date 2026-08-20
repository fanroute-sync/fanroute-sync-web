import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactElement, ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

import AiGeneratingRoutePage from '@/app/trips/[tripId]/ai-generating/page';
import TripDayPage from '@/app/trips/[tripId]/days/[date]/page';
import type { AiGenerationInput } from '@/features/ai-schedule/model/ai-generation';
import { CommunityWriteScreen } from '@/features/community/ui/community-write-screen';
import { registeredHomeFixture } from '@/features/home/fixtures/home-fixtures';
import { LanguageScreen } from '@/features/onboarding/ui/language-screen';
import { LoginScreen } from '@/features/onboarding/ui/login-screen';
import { TripCreateScreen } from '@/features/trip-create/ui/trip-create-screen';
import type { TripDay } from '@/features/trip/model/trip';
import { TripListScreen } from '@/features/trip/ui/trip-list-screen';

const { push } = vi.hoisted(() => ({ push: vi.fn() }));
vi.mock('next/navigation', async (importOriginal) => {
  const original = await importOriginal<typeof import('next/navigation')>();
  return { ...original, usePathname: () => '/community/write', useRouter: () => ({ back: vi.fn(), push, replace: vi.fn() }) };
});

function wrapper({ children }: { children: ReactNode }) { return <QueryClientProvider client={new QueryClient()}>{children}</QueryClientProvider>; }

describe('Rev.3 integrated flows', () => {
  it('keeps recommendation no on a concert-only manual day', async () => {
    const element = await TripDayPage({ params: Promise.resolve({ tripId: 'draft', date: '2026-08-23' }), searchParams: Promise.resolve({ mode: 'manual' }) }) as ReactElement<{ initialDay: TripDay }>;
    expect(element.props.initialDay.items).toHaveLength(1);
    expect(element.props.initialDay.items.every((item) => item.type === 'concert')).toBe(true);
  });

  it('keeps initial trip creation free of accommodation and travel style fields', () => {
    render(<TripCreateScreen />);
    expect(screen.queryByText('숙박 정보')).not.toBeInTheDocument();
    expect(screen.queryByText('여행 스타일')).not.toBeInTheDocument();
  });

  it('enables only Korean and Google during onboarding', () => {
    const { unmount } = render(<LanguageScreen />);
    expect(screen.getAllByText('Phase 2')).toHaveLength(3);
    unmount();
    render(<LoginScreen />);
    expect(screen.getByRole('button', { name: /Google로 계속하기/ })).toBeEnabled();
    expect(screen.getByRole('button', { name: /Apple로 계속하기/ })).toBeDisabled();
    expect(screen.getByRole('button', { name: /Meta로 계속하기/ })).toBeDisabled();
  });

  it('accepts a real trip id for single-date AI generation', async () => {
    const element = await AiGeneratingRoutePage({ params: Promise.resolve({ tripId: 'trip-busan-2026' }), searchParams: Promise.resolve({ concertId: 'concert-summer-wave', tripStartDate: '2026-08-22', targetDate: '2026-08-24' }) }) as ReactElement<{ input: AiGenerationInput }>;
    expect(element.props.input).toMatchObject({ tripId: 'trip-busan-2026', targetDate: '2026-08-24' });
  });

  it('points registered home cards only to implemented fixture details', () => {
    expect(registeredHomeFixture.activeTrip.todayDate).toBe('2026-08-23');
    expect(registeredHomeFixture.pastRoutes.every((route) => route.href === '/trips/trip-busan-2026')).toBe(true);
    expect(registeredHomeFixture.recommendedRoute.href).toBe('/community/route-post-1');
  });

  it('provides the schedule bottom-tab destination', () => {
    render(<TripListScreen trips={[]} />);
    expect(screen.getByRole('heading', { name: '내 여행 일정' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '여행 일정 만들기' })).toHaveAttribute('href', '/trips/new');
  });

  it('preselects a shared trip and opens the created route detail', async () => {
    push.mockReset(); const user = userEvent.setup();
    render(<CommunityWriteScreen initialType='REFERENCE_ROUTE' initialTripId='trip-busan-2026' />, { wrapper });
    expect(screen.getByRole('tab', { name: '참고 루트' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByLabelText('내 저장 일정')).toHaveValue('trip-busan-2026');
    await user.type(screen.getByLabelText('제목'), '통합 점검 공유 루트');
    await user.type(screen.getByLabelText('태그'), '공연, 부산');
    await user.click(screen.getByRole('button', { name: '게시' }));
    await waitFor(() => expect(push).toHaveBeenCalledWith(expect.stringMatching(/^\/community\/post-/)));
  });
});
