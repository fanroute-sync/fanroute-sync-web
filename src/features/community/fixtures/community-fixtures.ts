import type { CommunityPost } from '@/features/community/model/community';

export const communityPostFixtures: CommunityPost[] = [
  {
    id: 'route-post-1', type: 'REFERENCE_ROUTE', title: '공연 전 광안리 맛집 중심 루트', content: '이동 시간을 줄이고 공연 전에 든든하게 먹을 수 있는 코스예요.', author: '부산원정러', createdAt: '2026-08-19T13:00:00+09:00', tags: ['맛집위주', '혼자여행'], region: '수영구', concertName: 'SUMMER WAVE in BUSAN', placeNames: ['광안리 해수욕장', '민락회타운'], likeCount: 24, liked: false, mine: true,
    route: { tripId: 'trip-busan-2026', period: '2026.08.22 — 08.24', places: ['광안리 해수욕장', '민락회타운', '부산아시아드주경기장'], shareLink: 'https://fanroute.example/routes/route-post-1' },
    comments: [
      { id: 'comment-1', author: '해운대팬', content: '공연장 이동은 얼마나 걸렸나요?', createdAt: '2026-08-19T14:00:00+09:00', likeCount: 3, liked: false, rootCommentId: null, mine: false },
      { id: 'reply-1', author: '부산원정러', content: '지하철로 약 35분 걸렸어요!', createdAt: '2026-08-19T14:10:00+09:00', likeCount: 1, liked: false, rootCommentId: 'comment-1', mine: true },
      { id: 'reply-2', author: '광안리팬', content: '답변 덕분에 참고했어요.', createdAt: '2026-08-19T14:20:00+09:00', likeCount: 0, liked: false, rootCommentId: 'comment-1', mine: false },
    ],
  },
  { id: 'info-post-1', type: 'INFO', title: '아시아드 공연장 물품보관소 정보', content: '종합운동장역 9번 출구 쪽 보관함이 비교적 여유 있었어요.', author: '콘서트여행자', createdAt: '2026-08-20T09:00:00+09:00', tags: ['아시아드', '물품보관'], region: '연제구', concertName: 'SUMMER WAVE in BUSAN', placeNames: ['부산아시아드주경기장'], likeCount: 18, liked: true, mine: false, comments: [] },
  { id: 'companion-post-1', type: 'COMPANION', title: '공연 끝나고 서면까지 같이 가요', content: '공연 종료 후 택시를 같이 타실 분을 댓글로 모집합니다.', author: '동행구해요', createdAt: '2026-08-18T18:30:00+09:00', tags: ['동행', '택시'], region: '연제구', concertName: 'SUMMER WAVE in BUSAN', placeNames: ['부산아시아드주경기장', '서면'], likeCount: 9, liked: false, mine: false, companion: { date: '2026-08-23', currentMembers: 1, maxMembers: 3 }, comments: [] },
];

export const savedTripOptions = [{ id: 'trip-busan-2026', label: 'SUMMER WAVE 부산 여행 · 8/22—8/24' }];
export const concertOptions = [{ id: 'concert-summer-wave', label: 'SUMMER WAVE in BUSAN' }];
