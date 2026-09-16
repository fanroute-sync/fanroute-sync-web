import { z } from 'zod';

import { apiClient } from '@/lib/api/client';
import { envelope, page } from '@/lib/api/response';

const record = z.record(z.string(), z.unknown());
export type PlaceCategory = 'ACCOMMODATION' | 'ATTRACTION' | 'RESTAURANT';
export const placeKeys = {
  list: (params: { category?: PlaceCategory; page?: number; size?: number }) => ['places', 'list', params] as const,
  detail: (id: number) => ['places', 'detail', id] as const,
};
export async function listPlaces(params: { category?: PlaceCategory; page?: number; size?: number } = {}) {
  const response = await apiClient.get<unknown>('/places', { params });
  return envelope(page(record)).parse(response.data).data;
}
export async function getPlace(id: number) {
  const response = await apiClient.get<unknown>(`/places/${id}`);
  return envelope(record).parse(response.data).data;
}
