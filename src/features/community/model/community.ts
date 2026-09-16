export type CommunityPostType = 'INFO' | 'ROUTE' | 'COMPANION';
export type CommunitySort = 'latest' | 'popular';
export interface CommunityPost {
  id: number; type: CommunityPostType; title: string; content: string; tags: string[];
  authorId: number; authorNickname: string; concertId: number | null; concertTitle: string | null;
  tripPlanId: number | null; companionDate: string | null; capacity: number | null;
  currentMembers: number | null; region: string | null; likeCount: number; likedByMe: boolean;
  commentCount: number; createdAt: string;
}
export type CommunityPostSummary = CommunityPost;
export interface CommunityComment {
  id: number; parentId: number | null; authorId: number; authorNickname: string;
  content: string; likeCount: number; likedByMe: boolean; createdAt: string;
}
export interface CommunityPostDetail { post: CommunityPost; comments: CommunityComment[] }
export type CommunityPostCreateRequest =
  | { type: 'INFO'; title: string; tags: string[]; region?: string; content: string }
  | { type: 'ROUTE'; title: string; tags: string[]; region?: string; tripPlanId: number }
  | { type: 'COMPANION'; title: string; tags: string[]; region?: string; concertId: number; companionDate: string; capacity: number };
export interface CommunityPostListParams { type?: CommunityPostType; query?: string; region?: string; sort: CommunitySort; page: number; size: number }
export const POST_TYPE_LABELS: Record<CommunityPostType, string> = { INFO: '정보 공유', ROUTE: '참고 루트', COMPANION: '동행 모집' };
