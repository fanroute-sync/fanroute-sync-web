import { afterEach, describe, expect, it, vi } from 'vitest';

import { createItineraryItemFromPlace, createItineraryItemsFromTemplate, createTripPlan, getAccommodations, getItineraryDay, getTravelStyle, listTripPlans, saveAccommodations, saveTravelStyle } from '@/features/trip/api/trip-plan-service';
import { apiClient } from '@/lib/api/client';

afterEach(() => vi.restoreAllMocks());

describe('trip plan API contract', () => {
  it('sends the backend time slot fields and reads the created trip ID', async () => {
    const post = vi.spyOn(apiClient, 'post').mockResolvedValue({ data: {
      success: true, status: 201, code: 'OK', message: 'created',
      data: { tripPlanId: 12, concertId: null, arrivalAt: '2026-09-20T09:00:00', departureAt: '2026-09-22T18:00:00', itineraryDays: [{ id: 4, date: '2026-09-20', concertDay: false }] },
    } });
    const input = { arrivalDate: '2026-09-20', arrivalTimeSlot: 'MORNING' as const, departureDate: '2026-09-22', departureTimeSlot: 'EVENING' as const };
    expect((await createTripPlan(input)).tripPlanId).toBe(12);
    expect(post).toHaveBeenCalledWith('/trip-plans', input);
  });

  it('accepts an empty trip list and a day with no items', async () => {
    vi.spyOn(apiClient, 'get').mockImplementation(async (url) => ({ data: {
      success: true, status: 200, code: 'OK', message: 'ok',
      data: url === '/trip-plans' ? [] : { itineraryDayId: 4, date: '2026-09-20', concertDay: false, items: [] },
    } }));
    expect(await listTripPlans()).toEqual([]);
    expect((await getItineraryDay(12, '2026-09-20')).items).toEqual([]);
  });

  it('sends manually entered stays without a place ID and parses the saved stays', async () => {
    const put = vi.spyOn(apiClient, 'put').mockResolvedValue({ data: {
      success: true, status: 200, code: 'OK', message: 'ok',
      data: [{ accommodationId: 1, placeId: null, nameOrAddress: '부산 숙소', latitude: null, longitude: null, checkinDate: '2026-09-20', checkoutDate: '2026-09-22' }],
    } });
    const stays = [{ nameOrAddress: '부산 숙소', checkinDate: '2026-09-20', checkoutDate: '2026-09-22' }];
    expect((await saveAccommodations(12, stays))[0].placeId).toBeNull();
    expect(put).toHaveBeenCalledWith('/trip-plans/12/accommodations', { accommodations: stays });
  });

  it('loads saved stays and the Korean travel style values', async () => {
    const get = vi.spyOn(apiClient, 'get').mockImplementation(async (url) => ({ data: {
      success: true, status: 200, code: 'OK', message: 'ok', data: url.endsWith('/accommodations')
        ? [{ accommodationId: 1, placeId: null, nameOrAddress: '숙소', latitude: null, longitude: null, checkinDate: '2026-09-20', checkoutDate: '2026-09-22' }]
        : { travelIntensity: 'RELAXED', companions: ['친구'], travelMbti: '맛집탐방형' },
    } }));
    expect((await getAccommodations(12))[0].nameOrAddress).toBe('숙소');
    expect((await getTravelStyle(12)).travelMbti).toBe('맛집탐방형');
    expect(get).toHaveBeenCalledWith('/trip-plans/12/travel-style');
  });

  it('sends style and dedicated place/template requests', async () => {
    const style = { travelIntensity: 'TIGHT' as const, companions: ['연인'], travelMbti: '카페투어형' };
    const put = vi.spyOn(apiClient, 'put').mockResolvedValue({ data: { success: true, status: 200, code: 'OK', message: 'ok', data: style } });
    const item = { id: 1, sortOrder: 0, type: 'PLACE', title: '장소', fixed: false };
    const post = vi.spyOn(apiClient, 'post').mockImplementation(async (url) => ({ data: { success: true, status: 201, code: 'OK', message: 'ok', data: url.endsWith('/from-template') ? [item] : item } }));
    await saveTravelStyle(12, style);
    await createItineraryItemFromPlace(4, 7, '10:30:00');
    await createItineraryItemsFromTemplate(4, 9);
    expect(put).toHaveBeenCalledWith('/trip-plans/12/travel-style', style);
    expect(post).toHaveBeenCalledWith('/itinerary-days/4/items/from-place', { placeId: 7, scheduledTime: '10:30:00' });
    expect(post).toHaveBeenCalledWith('/itinerary-days/4/items/from-template', { templateId: 9 });
  });
});
