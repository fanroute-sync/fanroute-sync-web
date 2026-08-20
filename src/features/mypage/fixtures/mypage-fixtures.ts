import type { MyPageData } from '@/features/mypage/model/mypage';

export const myPageFixture: MyPageData = {
  profile: { nickname: '부산원정러', imageUrl: null },
  activityCounts: { posts: 12, likes: 34, comments: 21 },
  aiUsage: {
    used: 4, limit: 5, remaining: 1, month: '2026년 8월',
    history: [
      { id: 'usage-1', date: '2026-08-18', targetDate: '2026-08-23', status: 'SUCCESS' },
      { id: 'usage-2', date: '2026-08-10', targetDate: '2026-08-22', status: 'SUCCESS' },
      { id: 'usage-3', date: '2026-08-05', targetDate: '2026-08-24', status: 'SUCCESS' },
      { id: 'usage-4', date: '2026-08-01', targetDate: '2026-08-23', status: 'SUCCESS' },
    ],
  },
  activities: [
    { id: 'activity-1', type: 'POST', title: '공연 전 광안리 맛집 중심 루트', date: '2026-08-20', description: '참고 루트 게시글을 작성했어요.' },
    { id: 'activity-2', type: 'LIKE', title: '아시아드 공연장 물품보관소 정보', date: '2026-08-19', description: '게시글을 좋아합니다.' },
    { id: 'activity-3', type: 'COMMENT', title: '공연 끝나고 서면까지 같이 가요', date: '2026-08-18', description: '저도 같이 이동하고 싶어요!' },
  ],
  appVersion: 'v0.1.0',
};
