export type CommunityPostType = 'INFO' | 'REFERENCE_ROUTE' | 'COMPANION';
export type CommunitySort = 'latest' | 'popular';

export interface CommunityComment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
  likeCount: number;
  liked: boolean;
  rootCommentId: string | null;
  mine: boolean;
}

export interface CommunityPost {
  id: string;
  type: CommunityPostType;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  tags: string[];
  region: string;
  concertName?: string;
  placeNames: string[];
  likeCount: number;
  liked: boolean;
  mine: boolean;
  comments: CommunityComment[];
  route?: { tripId: string; period: string; places: string[]; shareLink: string };
  companion?: { date: string; currentMembers: number; maxMembers: number };
}

export const POST_TYPE_LABELS: Record<CommunityPostType, string> = {
  INFO: '정보 공유',
  REFERENCE_ROUTE: '참고 루트',
  COMPANION: '동행 모집',
};
