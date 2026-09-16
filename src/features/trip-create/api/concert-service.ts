import { z } from 'zod';

import { apiClient } from '@/lib/api/client';
import { envelope, page } from '@/lib/api/response';

// Swagger currently merges unrelated response DTOs under "Response". Keep records unknown
// until the backend exposes distinct concert schemas or a non-empty response can be checked.
const record = z.record(z.string(), z.unknown());
const schedule = z.object({ id: z.number(), concertId: z.number(), round: z.number(), performanceDate: z.iso.date(), performanceTime: z.string(), provisional: z.boolean(), source: z.enum(['KOPIS_PARSED', 'MANUAL']) });
export const concertKeys = {
  list: (params: { genreName?: string; page?: number; size?: number }) => ['concerts', 'list', params] as const,
  detail: (id: number) => ['concerts', 'detail', id] as const,
  schedules: (concertId: number) => ['concerts', 'schedules', concertId] as const,
};
export async function listConcerts(params: { genreName?: string; page?: number; size?: number } = {}) {
  const response = await apiClient.get<unknown>('/concerts', { params });
  return envelope(page(record)).parse(response.data).data;
}
export async function getConcert(id: number) {
  const response = await apiClient.get<unknown>(`/concerts/${id}`);
  return envelope(record).parse(response.data).data;
}
export async function getConcertSchedules(concertId: number) {
  const response = await apiClient.get<unknown>('/concert-schedules', { params: { concertId } });
  return envelope(z.array(schedule)).parse(response.data).data;
}
