import { afterEach, describe, expect, it, vi } from 'vitest';

import { apiClient } from '@/lib/api/client';
import { listVenuePlaceCollections } from './venue-place-collection-service';

afterEach(() => vi.restoreAllMocks());

describe('venue place collections API', () => {
  it('requests the selected venue and parses its collections', async () => {
    const get = vi.spyOn(apiClient, 'get').mockResolvedValue({ data: {
      success: true, status: 200, code: 'OK', message: 'ok',
      data: [{ id: 1, venueId: 7, name: '공연 전 식사', description: '공연장 인근 식당', type: 'RESTAURANT', items: [{ placeId: 2, placeName: '맛집', category: 'RESTAURANT', tags: ['LOCAL'], sortOrder: 1 }] }],
    } });

    const collections = await listVenuePlaceCollections(7);
    expect(get).toHaveBeenCalledWith('/venues/7/place-collections');
    expect(collections[0].items[0].placeName).toBe('맛집');
  });
});
