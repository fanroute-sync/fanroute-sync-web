import { z } from 'zod';

import { apiClient } from '@/lib/api/client';
import { envelope } from '@/lib/api/response';

const collectionItem = z.object({
  placeId: z.number(),
  placeName: z.string(),
  category: z.string(),
  tags: z.array(z.string()),
  sortOrder: z.number(),
});

const collection = z.object({
  id: z.number(),
  venueId: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  type: z.string(),
  items: z.array(collectionItem),
});

export type VenuePlaceCollection = z.infer<typeof collection>;

export const venuePlaceCollectionKeys = {
  list: (venueId: number) => ['venues', venueId, 'place-collections'] as const,
};

export async function listVenuePlaceCollections(venueId: number): Promise<VenuePlaceCollection[]> {
  const response = await apiClient.get<unknown>(`/venues/${venueId}/place-collections`);
  return envelope(z.array(collection)).parse(response.data).data;
}
