'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { AppShell, ContentContainer, PageHeader } from '@/components/layout';
import { Tabs } from '@/components/ui';
import { useCreatePost } from '@/features/community/api/community-queries';
import type { CommunityPost, CommunityPostType } from '@/features/community/model/community';
import { CompanionPostForm, type CompanionPostValues } from '@/features/community/ui/forms/companion-post-form';
import { InfoPostForm, type InfoPostValues } from '@/features/community/ui/forms/info-post-form';
import { RoutePostForm, type RoutePostValues } from '@/features/community/ui/forms/route-post-form';

const tabs = [{ value: 'INFO', label: '정보 공유' }, { value: 'REFERENCE_ROUTE', label: '참고 루트' }, { value: 'COMPANION', label: '동행 모집' }] as const;
const tags = (value: string) => value.split(',').map((tag) => tag.trim().replace(/^#/, '')).filter(Boolean);

export function CommunityWriteScreen({ initialType = 'INFO', initialTripId = '' }: { initialType?: CommunityPostType; initialTripId?: string }) {
  const router = useRouter();
  const [type, setType] = useState<CommunityPostType>(initialType);
  const createPost = useCreatePost();
  const publish = (post: CommunityPost) => createPost.mutate(post, { onSuccess: (createdPost) => { toast.success('게시글을 등록했어요.'); router.push(`/community/${createdPost.id}`); } });
  const base = (postType: CommunityPostType): Omit<CommunityPost, 'title' | 'content' | 'tags'> => ({ id: `post-${Date.now()}`, type: postType, author: '부산원정러', createdAt: new Date().toISOString(), region: '부산 전체', placeNames: [], likeCount: 0, liked: false, mine: true, comments: [] });
  const submitInfo = (values: InfoPostValues) => publish({ ...base('INFO'), ...values, tags: tags(values.tags) });
  const submitRoute = (values: RoutePostValues) => publish({ ...base('REFERENCE_ROUTE'), title: values.title, content: '내 저장 일정을 공유합니다.', tags: tags(values.tags), route: { tripId: values.tripId, period: '2026.08.22 — 08.24', places: ['광안리 해수욕장', '부산아시아드주경기장'], shareLink: `https://fanroute.example/routes/${Date.now()}` } });
  const submitCompanion = (values: CompanionPostValues) => publish({ ...base('COMPANION'), title: values.title, content: values.content, tags: ['동행'], concertName: concertOptionsLabel(values.concertId), companion: { date: values.date, currentMembers: 1, maxMembers: values.maxMembers } });
  return <AppShell showBottomNavigation={false} header={<PageHeader title='글쓰기' backHref='/community' />}><ContentContainer className='space-y-6'><Tabs items={tabs} value={type} onValueChange={setType} ariaLabel='게시글 타입' />{type === 'INFO' ? <InfoPostForm onSubmit={submitInfo} loading={createPost.isPending} /> : null}{type === 'REFERENCE_ROUTE' ? <RoutePostForm onSubmit={submitRoute} loading={createPost.isPending} defaultTripId={initialTripId} /> : null}{type === 'COMPANION' ? <CompanionPostForm onSubmit={submitCompanion} loading={createPost.isPending} /> : null}</ContentContainer></AppShell>;
}

function concertOptionsLabel(concertId: string) { return concertId === 'concert-summer-wave' ? 'SUMMER WAVE in BUSAN' : concertId; }
