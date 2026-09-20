import { z } from 'zod';

import { apiClient } from '@/lib/api/client';
import { envelope } from '@/lib/api/response';

const day = z.object({ id: z.number(), date: z.iso.date(), concertDay: z.boolean() });
const summary = z.object({ tripPlanId: z.number(), concertId: z.number().nullable().optional(), concertTitle: z.string().nullable().optional(), arrivalAt: z.string(), departureAt: z.string() });
const detail = summary.extend({ itineraryDays: z.array(day) });
const item = z.object({ id: z.number(), sortOrder: z.number(), scheduledTime: z.string().nullable().optional(), type: z.enum(['CONCERT', 'PLACE', 'CUSTOM']), title: z.string(), durationMinutes: z.number().nullable().optional(), placeId: z.number().nullable().optional(), concertId: z.number().nullable().optional(), fixed: z.boolean() });
const dayDetail = z.object({ itineraryDayId: z.number(), date: z.iso.date(), concertDay: z.boolean(), items: z.array(item) });
const createdTrip = z.object({ tripPlanId: z.number(), concertId: z.number().nullable().optional(), arrivalAt: z.string(), departureAt: z.string(), itineraryDays: z.array(day) });
const accommodation = z.object({ accommodationId: z.number(), placeId: z.number().nullable(), nameOrAddress: z.string(), latitude: z.number().nullable(), longitude: z.number().nullable(), checkinDate: z.iso.date(), checkoutDate: z.iso.date() });
const travelStyle = z.object({ travelIntensity: z.enum(['RELAXED', 'TIGHT']), companions: z.array(z.string()), travelMbti: z.string() });

export type TripPlanSummary = z.infer<typeof summary>;
export type TripPlanDetail = z.infer<typeof detail>;
export type ItineraryDay = z.infer<typeof dayDetail>;
export type ItineraryItemDto = z.infer<typeof item>;
export type TripTimeSlot = 'MORNING' | 'AFTERNOON' | 'EVENING';
export interface CreateTripPlanInput { arrivalDate: string; arrivalTimeSlot: TripTimeSlot; departureDate: string; departureTimeSlot: TripTimeSlot; concertId?: number }
export type SaveAccommodationInput = { placeId: number; checkinDate: string; checkoutDate: string } | { nameOrAddress: string; checkinDate: string; checkoutDate: string };
export type TravelStyle = z.infer<typeof travelStyle>;

export const tripPlanKeys = {
  all: ['trip-plans'] as const,
  list: () => ['trip-plans', 'list'] as const,
  detail: (id: number) => ['trip-plans', 'detail', id] as const,
  day: (id: number, date: string) => ['trip-plans', 'day', id, date] as const,
  accommodations: (id: number) => ['trip-plans', 'accommodations', id] as const,
  travelStyle: (id: number) => ['trip-plans', 'travel-style', id] as const,
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
export async function saveAccommodations(id: number, accommodations: SaveAccommodationInput[]) {
  const response = await apiClient.put<unknown>(`/trip-plans/${id}/accommodations`, { accommodations });
  return envelope(z.array(accommodation)).parse(response.data).data;
}
export async function getAccommodations(id: number) {
  const response = await apiClient.get<unknown>(`/trip-plans/${id}/accommodations`);
  return envelope(z.array(accommodation)).parse(response.data).data;
}
export async function getTravelStyle(id: number) {
  const response = await apiClient.get<unknown>(`/trip-plans/${id}/travel-style`);
  return envelope(travelStyle).parse(response.data).data;
}
export async function saveTravelStyle(id: number, input: TravelStyle) {
  const response = await apiClient.put<unknown>(`/trip-plans/${id}/travel-style`, input);
  return envelope(travelStyle).parse(response.data).data;
}
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
export async function createItineraryItemFromPlace(dayId: number, placeId: number, scheduledTime?: string) {
  const response = await apiClient.post<unknown>(`/itinerary-days/${dayId}/items/from-place`, { placeId, ...(scheduledTime ? { scheduledTime } : {}) });
  return envelope(item).parse(response.data).data;
}
export async function createItineraryItemsFromTemplate(dayId: number, templateId: number) {
  const response = await apiClient.post<unknown>(`/itinerary-days/${dayId}/items/from-template`, { templateId });
  return envelope(z.array(item)).parse(response.data).data;
}
export async function updateItineraryItem(itemId: number, input: UpdateItemInput) {
  const response = await apiClient.patch<unknown>(`/itinerary-items/${itemId}`, input);
  return envelope(item).parse(response.data).data;
}
export async function deleteItineraryItem(itemId: number) { await apiClient.delete(`/itinerary-items/${itemId}`); }
export async function reorderItineraryItems(dayId: number, itemIds: number[]) { await apiClient.patch(`/itinerary-days/${dayId}/items/order`, { itemIds }); }
