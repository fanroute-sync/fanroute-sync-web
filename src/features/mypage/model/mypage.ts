export interface ActivityItem { id: string; type: 'POST' | 'LIKE' | 'COMMENT'; title: string; date: string; description: string; }
export interface AiUsageSnapshot { used: number; limit: number; remaining: number; month: string; history: { id: string; date: string; targetDate: string; status: 'SUCCESS' }[]; }
export interface MyPageData { profile: { nickname: string; imageUrl: string | null }; activityCounts: { posts: number; likes: number; comments: number }; aiUsage: AiUsageSnapshot; activities: ActivityItem[]; appVersion: string; }
