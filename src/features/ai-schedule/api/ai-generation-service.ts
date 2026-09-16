import { z } from 'zod';

import { apiClient } from '@/lib/api/client';
import { envelope } from '@/lib/api/response';

const creation = z.object({ generationId: z.number() }).passthrough();
const status = z.object({ generationId: z.number(), itineraryDayId: z.number(), date: z.iso.date(), status: z.enum(['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED']) });
export type AiGenerationStatusDto = z.infer<typeof status>;
export const aiGenerationKeys = { detail: (id: number) => ['ai-generations', id] as const };

export async function startAiGeneration(dayId: number) {
  const response = await apiClient.post<unknown>(`/itinerary-days/${dayId}/ai-generations`);
  return envelope(creation).parse(response.data).data;
}
export async function getAiGeneration(id: number) {
  const response = await apiClient.get<unknown>(`/ai-itinerary-generations/${id}`);
  return envelope(status).parse(response.data).data;
}
export async function retryAiGeneration(id: number) {
  const response = await apiClient.post<unknown>(`/ai-itinerary-generations/${id}/retry`);
  return envelope(creation).parse(response.data).data;
}
export async function cancelAiGeneration(id: number) {
  const response = await apiClient.delete<unknown>(`/ai-itinerary-generations/${id}`);
  return envelope(status).parse(response.data).data;
}
