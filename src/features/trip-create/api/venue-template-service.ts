import { z } from 'zod';

import { apiClient } from '@/lib/api/client';
import { envelope } from '@/lib/api/response';

const templateItem = z.object({
  placeId: z.number(),
  placeName: z.string(),
  category: z.string(),
  tags: z.array(z.string()),
  sortOrder: z.number(),
  defaultTime: z.string().nullable(),
  defaultDurationMinutes: z.number().nullable(),
});

const template = z.object({
  id: z.number(),
  venueId: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  items: z.array(templateItem),
});

export type VenueItineraryTemplate = z.infer<typeof template>;

export const venueTemplateKeys = {
  list: (venueId: number) => ['venues', venueId, 'itinerary-templates'] as const,
};

export async function listVenueItineraryTemplates(venueId: number): Promise<VenueItineraryTemplate[]> {
  const response = await apiClient.get<unknown>(`/venues/${venueId}/itinerary-templates`);
  return envelope(z.array(template)).parse(response.data).data;
}
