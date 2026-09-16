import { afterEach, describe, expect, it, vi } from 'vitest';

import { createTripPlan, getItineraryDay, listTripPlans } from '@/features/trip/api/trip-plan-service';
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
});
