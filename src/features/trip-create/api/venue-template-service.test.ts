import { afterEach, describe, expect, it, vi } from 'vitest';

import { apiClient } from '@/lib/api/client';
import { listVenueItineraryTemplates } from './venue-template-service';

afterEach(() => vi.restoreAllMocks());

describe('venue itinerary templates API', () => {
  it('requests the selected venue and parses its templates', async () => {
    const get = vi.spyOn(apiClient, 'get').mockResolvedValue({ data: {
      success: true, status: 200, code: 'OK', message: 'ok',
      data: [{ id: 1, venueId: 7, name: '공연 전 코스', description: '공연 전 3시간 코스', items: [{ placeId: 2, placeName: '맛집', category: 'RESTAURANT', tags: ['LOCAL'], sortOrder: 1, defaultTime: '17:00:00', defaultDurationMinutes: 60 }] }],
    } });
    const templates = await listVenueItineraryTemplates(7);
    expect(get).toHaveBeenCalledWith('/venues/7/itinerary-templates');
    expect(templates[0].items[0].placeName).toBe('맛집');
  });
});
