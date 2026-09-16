'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { AppShell, ContentContainer, PageHeader } from '@/components/layout';
import { Tabs } from '@/components/ui';
import { getApiErrorMessage } from '@/lib/api/error-message';
import { useCreatePost } from '../api/community-queries';
import type { CommunityPostCreateRequest, CommunityPostType } from '../model/community';
import { CompanionPostForm, type CompanionPostValues } from './forms/companion-post-form';
import { InfoPostForm, type InfoPostValues } from './forms/info-post-form';
import { RoutePostForm, type RoutePostValues } from './forms/route-post-form';
const tabs = [{ value: 'INFO', label: '정보 공유' }, { value: 'ROUTE', label: '참고 루트' }, { value: 'COMPANION', label: '동행 모집' }] as const;
const tags = (value: string) => value.split(',').map((tag) => tag.trim().replace(/^#/, '')).filter(Boolean);
export function CommunityWriteScreen({ initialType = 'INFO', initialTripId = '' }: { initialType?: CommunityPostType; initialTripId?: string }) {
  const router = useRouter(); const [type, setType] = useState<CommunityPostType>(initialType); const create = useCreatePost();
  const publish = (input: CommunityPostCreateRequest) => { if (create.isPending) return; create.mutate(input, { onSuccess: (post) => { toast.success('게시글을 등록했어요.'); router.push(`/community/${post.id}`); }, onError: (error) => toast.error(getApiErrorMessage(error)) }); };
  const info = (v: InfoPostValues) => publish({ type: 'INFO', title: v.title, content: v.content, tags: tags(v.tags) });
  const route = (v: RoutePostValues) => publish({ type: 'ROUTE', title: v.title, tripPlanId: Number(v.tripId), tags: tags(v.tags) });
  const companion = (v: CompanionPostValues) => publish({ type: 'COMPANION', title: v.title, concertId: Number(v.concertId), companionDate: v.date, capacity: v.maxMembers, tags: [] });
  return <AppShell showBottomNavigation={false} header={<PageHeader title='글쓰기' backHref='/community' />}><ContentContainer className='space-y-6'><Tabs items={tabs} value={type} onValueChange={setType} ariaLabel='게시글 타입' />{type === 'INFO' ? <InfoPostForm onSubmit={info} loading={create.isPending} /> : null}{type === 'ROUTE' ? <RoutePostForm onSubmit={route} loading={create.isPending} defaultTripId={initialTripId} /> : null}{type === 'COMPANION' ? <CompanionPostForm onSubmit={companion} loading={create.isPending} /> : null}</ContentContainer></AppShell>;
}
