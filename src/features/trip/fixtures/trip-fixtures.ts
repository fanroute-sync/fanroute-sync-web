import type { PlaceSearchResult, TripDetail } from '@/features/trip/model/trip';

export const tripFixture: TripDetail = {
  id: 'trip-busan-2026',
  title: 'SUMMER WAVE 부산 여행',
  startDate: '2026-08-22',
  endDate: '2026-08-24',
  concert: {
    id: 'concert-summer-wave',
    name: 'SUMMER WAVE in BUSAN',
    date: '2026-08-23',
    venue: '부산아시아드주경기장',
  },
  accommodations: [
    { id: 'stay-1', name: '광안리 오션 스테이', checkIn: '2026-08-22', checkOut: '2026-08-24' },
  ],
  days: [
    {
      date: '2026-08-22',
      dayNumber: 1,
      isConcertDay: false,
      summary: '부산 도착 · 광안리 산책',
      items: [
        { id: 'place-1', type: 'place', time: '15:00', name: '광안리 해수욕장', category: '관광지', address: '부산 수영구 광안해변로 219', latitude: 35.1532, longitude: 129.1187 },
        { id: 'place-2', type: 'place', time: '18:00', name: '민락회타운', category: '음식점', address: '부산 수영구 민락수변로 1', latitude: 35.1568, longitude: 129.1314 },
      ],
    },
    {
      date: '2026-08-23',
      dayNumber: 2,
      isConcertDay: true,
      summary: '공연일 · 아시아드 주변',
      items: [
        { id: 'place-3', type: 'place', time: '11:30', name: '사직동 로컬 키친', category: '음식점', address: '부산 동래구 사직로 45', latitude: 35.1948, longitude: 129.0613 },
        { id: 'concert-1', type: 'concert', time: '18:00', name: 'SUMMER WAVE in BUSAN', venue: '부산아시아드주경기장', address: '부산 연제구 월드컵대로 344', latitude: 35.1904, longitude: 129.0581 },
      ],
    },
    {
      date: '2026-08-24',
      dayNumber: 3,
      isConcertDay: false,
      summary: '해운대 · 부산 출발',
      items: [
        { id: 'place-4', type: 'place', time: '10:00', name: '해운대 해수욕장', category: '관광지', address: '부산 해운대구 우동', latitude: 35.1587, longitude: 129.1604 },
        { id: 'place-5', type: 'place', time: '12:30', name: '해리단길 브런치 카페', category: '카페', address: '부산 해운대구 우동1로 20번길', latitude: 35.1631, longitude: 129.1592 },
      ],
    },
  ],
  aiUsage: { used: 2, limit: 5, remaining: 3 },
  note: '공연 티켓과 응원봉 챙기기',
};

export const placeSearchFixtures: PlaceSearchResult[] = [
  { id: 'search-1', name: '감천문화마을', category: '관광지', address: '부산 사하구 감내2로 203', distanceKm: 13.2, popularity: 98 },
  { id: 'search-2', name: '초량밀면', category: '음식점', address: '부산 동구 중앙대로 225', distanceKm: 0.8, popularity: 91 },
  { id: 'search-3', name: '모모스커피', category: '카페', address: '부산 금정구 오시게로 18-1', distanceKm: 8.4, popularity: 95 },
  { id: 'search-4', name: '흰여울문화마을', category: '관광지', address: '부산 영도구 영선동4가 605-3', distanceKm: 7.1, popularity: 96 },
  { id: 'search-5', name: '해운대암소갈비집', category: '음식점', address: '부산 해운대구 중동2로10번길 32-10', distanceKm: 14.3, popularity: 99 },
  { id: 'search-6', name: '웨이브온 커피', category: '카페', address: '부산 기장군 해맞이로 286', distanceKm: 31.5, popularity: 90 },
];

export function getTripFixture(tripId: string) {
  return tripId === 'draft' || tripId === tripFixture.id ? tripFixture : undefined;
}
