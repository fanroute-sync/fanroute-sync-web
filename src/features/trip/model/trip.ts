export type ItineraryItem = ConcertItineraryItem | PlaceItineraryItem;

interface BaseItineraryItem {
  id: string;
  time: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

export interface ConcertItineraryItem extends BaseItineraryItem {
  type: 'concert';
  venue: string;
}

export interface PlaceItineraryItem extends BaseItineraryItem {
  type: 'place';
  category: '관광지' | '음식점' | '카페';
}

export interface TripDay {
  date: string;
  dayNumber: number;
  isConcertDay: boolean;
  summary: string;
  items: ItineraryItem[];
}

export interface Accommodation {
  id: string;
  name: string;
  checkIn: string;
  checkOut: string;
}

export interface TripDetail {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  concert: { id: string; name: string; date: string; venue: string };
  accommodations: Accommodation[];
  days: TripDay[];
  aiUsage: { used: number; limit: number; remaining: number };
  note: string;
}

export interface PlaceSearchResult {
  id: string;
  name: string;
  category: '관광지' | '음식점' | '카페';
  address: string;
  distanceKm: number;
  popularity: number;
}
