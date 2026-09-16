import { z } from 'zod';

import { apiClient } from '@/lib/api/client';
import { envelope } from '@/lib/api/response';

const day = z.object({ id: z.number(), date: z.iso.date(), concertDay: z.boolean() });
const summary = z.object({ tripPlanId: z.number(), concertId: z.number().nullable().optional(), concertTitle: z.string().nullable().optional(), arrivalAt: z.string(), departureAt: z.string() });
const detail = summary.extend({ itineraryDays: z.array(day) });
const item = z.object({ id: z.number(), sortOrder: z.number(), scheduledTime: z.string().nullable().optional(), type: z.enum(['CONCERT', 'PLACE', 'CUSTOM']), title: z.string(), durationMinutes: z.number().nullable().optional(), placeId: z.number().nullable().optional(), concertId: z.number().nullable().optional(), fixed: z.boolean() });
const dayDetail = z.object({ itineraryDayId: z.number(), date: z.iso.date(), concertDay: z.boolean(), items: z.array(item) });
const createdTrip = z.object({ tripPlanId: z.number(), concertId: z.number().nullable().optional(), arrivalAt: z.string(), departureAt: z.string(), itineraryDays: z.array(day) });

export type TripPlanSummary = z.infer<typeof summary>;
export type TripPlanDetail = z.infer<typeof detail>;
export type ItineraryDay = z.infer<typeof dayDetail>;
export type ItineraryItemDto = z.infer<typeof item>;
export type TripTimeSlot = 'MORNING' | 'AFTERNOON' | 'EVENING';
export interface CreateTripPlanInput { arrivalDate: string; arrivalTimeSlot: TripTimeSlot; departureDate: string; departureTimeSlot: TripTimeSlot; concertId?: number }

export const tripPlanKeys = {
  all: ['trip-plans'] as const,
  list: () => ['trip-plans', 'list'] as const,
  detail: (id: number) => ['trip-plans', 'detail', id] as const,
  day: (id: number, date: string) => ['trip-plans', 'day', id, date] as const,
};

export async function listTripPlans() {
  const response = await apiClient.get<unknown>('/trip-plans');
  return envelope(z.array(summary)).parse(response.data).data;
}
export async function getTripPlan(id: number) {
  const response = await apiClient.get<unknown>(`/trip-plans/${id}`);
  return envelope(detail).parse(response.data).data;
}
export async function createTripPlan(input: CreateTripPlanInput) {
  const response = await apiClient.post<unknown>('/trip-plans', input);
  return envelope(createdTrip).parse(response.data).data;
}
export async function deleteTripPlan(id: number) { await apiClient.delete(`/trip-plans/${id}`); }
export async function getItineraryDay(id: number, date: string) {
  const response = await apiClient.get<unknown>(`/trip-plans/${id}/itinerary-days/${date}`);
  return envelope(dayDetail).parse(response.data).data;
}

export interface CreateItemInput { type: 'PLACE' | 'CUSTOM'; scheduledTime?: string; title: string; durationMinutes?: number; placeId?: number }
export interface UpdateItemInput { scheduledTime?: string; title: string; durationMinutes?: number; placeId?: number }
export async function createItineraryItem(dayId: number, input: CreateItemInput) {
  const response = await apiClient.post<unknown>(`/itinerary-days/${dayId}/items`, input);
  return envelope(item).parse(response.data).data;
}
export async function updateItineraryItem(itemId: number, input: UpdateItemInput) {
  const response = await apiClient.patch<unknown>(`/itinerary-items/${itemId}`, input);
  return envelope(item).parse(response.data).data;
}
export async function deleteItineraryItem(itemId: number) { await apiClient.delete(`/itinerary-items/${itemId}`); }
export async function reorderItineraryItems(dayId: number, itemIds: number[]) { await apiClient.patch(`/itinerary-days/${dayId}/items/order`, { itemIds }); }
