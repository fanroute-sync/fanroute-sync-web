import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { getConcert } from '@/features/trip-create/api/concert-service';
import { getTripPlan } from '@/features/trip/api/trip-plan-service';
import { listVenuePlaceCollections } from '@/features/trip/api/venue-place-collection-service';
import { VenuePlaceCollections } from './venue-place-collections';

vi.mock('@/features/trip-create/api/concert-service', async (importOriginal) => ({ ...await importOriginal<typeof import('@/features/trip-create/api/concert-service')>(), getConcert: vi.fn() }));
vi.mock('@/features/trip/api/trip-plan-service', async (importOriginal) => ({ ...await importOriginal<typeof import('@/features/trip/api/trip-plan-service')>(), getTripPlan: vi.fn() }));
vi.mock('@/features/trip/api/venue-place-collection-service', async (importOriginal) => ({ ...await importOriginal<typeof import('@/features/trip/api/venue-place-collection-service')>(), listVenuePlaceCollections: vi.fn() }));

function wrapper({ children }: { children: ReactNode }) {
  return <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>{children}</QueryClientProvider>;
}

afterEach(() => vi.clearAllMocks());

describe('venue place recommendations', () => {
  it('loads collections for the trip concert venue and selects a place', async () => {
    vi.mocked(getTripPlan).mockResolvedValue({ tripPlanId: 3, concertId: 5, arrivalAt: '2026-09-20T09:00:00', departureAt: '2026-09-21T18:00:00', itineraryDays: [] });
    vi.mocked(getConcert).mockResolvedValue({ venueId: 7 });
    vi.mocked(listVenuePlaceCollections).mockResolvedValue([{ id: 1, venueId: 7, name: '공연 전 식사', description: '공연장 인근 식당', type: 'RESTAURANT', items: [{ placeId: 2, placeName: '맛집', category: 'RESTAURANT', tags: ['LOCAL'], sortOrder: 1 }] }]);
    const onSelect = vi.fn();

    render(<VenuePlaceCollections tripId={3} disabled={false} actionLabel='추가' onSelect={onSelect} />, { wrapper });
    expect(await screen.findByText('공연 전 식사')).toBeInTheDocument();
    expect(getConcert).toHaveBeenCalledWith(5);
    expect(listVenuePlaceCollections).toHaveBeenCalledWith(7);
    await userEvent.click(screen.getByRole('button', { name: '추가' }));
    expect(onSelect).toHaveBeenCalledWith({ id: 2, title: '맛집' });
  });
});
