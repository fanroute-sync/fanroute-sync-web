import type { ConcertOption } from '@/features/trip-create/model/trip-form';

export const concertFixtures: ConcertOption[] = [
  {
    id: 'concert-summer-wave',
    name: 'SUMMER WAVE in BUSAN',
    venue: '부산아시아드주경기장',
    date: '2026-08-23',
    time: '18:00',
  },
  {
    id: 'concert-ocean-stage',
    name: 'OCEAN K-POP STAGE',
    venue: '벡스코 제1전시장',
    date: '2026-09-12',
    time: '19:00',
  },
  {
    id: 'concert-dream-night',
    name: 'BUSAN DREAM NIGHT',
    venue: '부산항국제전시컨벤션센터',
    date: '2026-10-03',
    time: '17:30',
  },
];

export function findConcertFixture(concertId: string) {
  return concertFixtures.find((concert) => concert.id === concertId);
}
