import type { EmptyHomeData, RegisteredHomeData } from '@/features/home/model/home';

const concerts = [
  {
    id: 'concert-1',
    title: '부산에서 만나는 여름 K-POP 콘서트',
    description: '공연 일정과 주변 여행 정보를 확인해보세요.',
    category: '콘서트',
  },
  {
    id: 'concert-2',
    title: '부산 아시아드 공연 관람 가이드',
    description: '교통편부터 입장 전 체크리스트까지 모았어요.',
    category: '공연 가이드',
  },
];

const magazines = [
  {
    id: 'magazine-1',
    title: '공연 전 들르기 좋은 광안리 카페',
    description: '바다를 보며 여유롭게 준비하는 부산 여행 코스',
    category: '매거진',
  },
];

const notices = [
  {
    id: 'notice-1',
    title: 'Fan Route Sync 이용 안내',
    description: '나만의 부산 콘서트 여행을 만드는 방법을 알려드려요.',
    category: '공지',
  },
];

export const emptyHomeFixture: EmptyHomeData = {
  status: 'empty',
  concerts,
  magazines,
  notices,
};

export const registeredHomeFixture: RegisteredHomeData = {
  status: 'registered',
  concerts,
  magazines,
  notices,
  activeTrip: {
    id: 'trip-busan-2026',
    dDay: 'D-3',
    concertName: 'SUMMER WAVE in BUSAN',
    concertDate: '8월 23일',
    venue: '부산아시아드주경기장',
    todayDate: '2026-08-23',
  },
  pastRoutes: [
    {
      id: 'past-route-1',
      title: '광안리와 해운대를 잇는 하루',
      description: '2025.06.14 · 5개 장소',
      href: '/trips/trip-busan-2026',
    },
    {
      id: 'past-route-2',
      title: '서면 맛집 중심 공연 원정',
      description: '2025.03.09 · 4개 장소',
      href: '/trips/trip-busan-2026',
    },
  ],
  recommendedRoute: {
    id: 'recommended-route-1',
    title: '공연장 근처 반나절 추천 루트',
    description: '이동은 짧게, 부산의 분위기는 충분히 즐겨보세요.',
    href: '/community/route-post-1',
  },
};
