'use client';

import { AppShell, ContentContainer, PageHeader } from '@/components/layout';
import { Badge, Card, Tabs } from '@/components/ui';
import type { ActivityItem, MyPageData } from '@/features/mypage/model/mypage';

type ActivityType = ActivityItem['type'];
const tabs = [{ value: 'POST', label: '게시글' }, { value: 'LIKE', label: '좋아요' }, { value: 'COMMENT', label: '댓글' }] as const;
export function ActivityScreen({ data, activeType, onTypeChange }: { data: MyPageData; activeType: ActivityType; onTypeChange: (type: ActivityType) => void }) {
  const counts = { POST: data.activityCounts.posts, LIKE: data.activityCounts.likes, COMMENT: data.activityCounts.comments };
  const items = data.activities.filter((item) => item.type === activeType).toSorted((a, b) => b.date.localeCompare(a.date));
  return <AppShell showBottomNavigation={false} header={<PageHeader title='내 활동' backHref='/my' />}><ContentContainer className='space-y-5'><Tabs items={tabs.map((tab) => ({ ...tab, label: <>{tab.label}<span className='ml-1 text-xs'>{counts[tab.value]}</span></> }))} value={activeType} onValueChange={onTypeChange} ariaLabel='활동 타입' /><div className='flex justify-end'><Badge>최신순</Badge></div><section aria-label='활동 내역' className='space-y-3'>{items.map((item) => <Card key={item.id} className='shadow-none'><p className='text-xs text-gray-400'>{item.date}</p><h2 className='mt-2 font-semibold'>{item.title}</h2><p className='mt-1 text-sm text-gray-600'>{item.description}</p></Card>)}</section></ContentContainer></AppShell>;
}
