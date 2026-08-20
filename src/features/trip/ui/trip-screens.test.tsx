import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { tripFixture } from '@/features/trip/fixtures/trip-fixtures';
import { DayItineraryScreen } from '@/features/trip/ui/day-itinerary-screen';
import { PlaceAddScreen } from '@/features/trip/ui/place-add-screen';
import { TripDetailScreen } from '@/features/trip/ui/trip-detail-screen';

vi.mock('next/navigation', () => ({
  usePathname: () => '/trips/trip-busan-2026',
  useRouter: () => ({ back: vi.fn(), push: vi.fn() }),
}));

describe('Phase 6 trip screens', () => {
  it('renders trip summary and marks the concert day', () => {
    render(<TripDetailScreen trip={tripFixture} />);
    expect(screen.getByRole('heading', { name: /2026-08-22 — 2026-08-24/ })).toBeInTheDocument();
    expect(screen.getByText('D2 ★')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Fan Route에 공유하기/ })).toBeInTheDocument();
  });

  it('never exposes change or delete controls on a concert card', () => {
    const concertDay = tripFixture.days[1];
    render(<DayItineraryScreen trip={tripFixture} initialDay={concertDay} />);
    const concertTitle = screen.getByRole('heading', { name: 'SUMMER WAVE in BUSAN' });
    const concertCard = concertTitle.closest('div.rounded-2xl');
    expect(concertCard).not.toBeNull();
    const card = within(concertCard as HTMLElement);
    expect(card.getByText('공연일 · 고정')).toBeInTheDocument();
    expect(card.queryByRole('link', { name: '변경' })).not.toBeInTheDocument();
    expect(card.queryByRole('button', { name: /삭제/ })).not.toBeInTheDocument();
  });

  it('uses the previous itinerary place as the distance origin', async () => {
    const user = userEvent.setup();
    const day = tripFixture.days[0];
    render(<PlaceAddScreen trip={tripFixture} day={day} />);
    await user.click(screen.getByRole('button', { name: '거리순' }));
    expect(screen.getByText(/거리 기준: 민락회타운 이후 장소/)).toBeInTheDocument();
  });
});
