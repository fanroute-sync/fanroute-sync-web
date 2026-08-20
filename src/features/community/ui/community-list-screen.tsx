'use client';

import { PenLine } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

import { EmptyState } from '@/components/common';
import { AppShell, ContentContainer, Header } from '@/components/layout';
import { SearchInput, Tabs } from '@/components/ui';
import { useCommunityPosts } from '@/features/community/api/community-queries';
import type { CommunityPostType, CommunitySort } from '@/features/community/model/community';
import { CommunityPostCard } from '@/features/community/ui/community-post-card';

type TypeFilter = 'ALL' | CommunityPostType;
const typeTabs = [{ value: 'ALL', label: '전체' }, { value: 'INFO', label: '정보 공유' }, { value: 'REFERENCE_ROUTE', label: '참고 루트' }, { value: 'COMPANION', label: '동행 모집' }] as const;

export function CommunityListScreen() {
  const { data: posts = [] } = useCommunityPosts();
  const [query, setQuery] = useState('');
  const [type, setType] = useState<TypeFilter>('ALL');
  const [region, setRegion] = useState('부산 전체');
  const [sort, setSort] = useState<CommunitySort>('latest');
  const filteredPosts = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return posts.filter((post) => type === 'ALL' || post.type === type)
      .filter((post) => region === '부산 전체' || post.region === region)
      .filter((post) => !normalized || [post.concertName ?? '', ...post.placeNames, ...post.tags].join(' ').toLowerCase().includes(normalized))
      .toSorted((a, b) => sort === 'popular' ? b.likeCount - a.likeCount : b.createdAt.localeCompare(a.createdAt));
  }, [posts, query, region, sort, type]);

  return (
    <AppShell header={<Header title='Fan Route Sync' />}>
      <ContentContainer className='space-y-5'>
        <SearchInput aria-label='공연명, 장소, 해시태그 검색' placeholder='공연명 / 장소 / 해시태그 검색' value={query} onChange={(event) => setQuery(event.target.value)} onClear={() => setQuery('')} />
        <Tabs items={typeTabs} value={type} onValueChange={setType} ariaLabel='게시판 타입' className='overflow-x-auto' />
        <div className='flex gap-2'>
          <label className='flex-1'><span className='sr-only'>지역 필터</span><select value={region} onChange={(event) => setRegion(event.target.value)} className='h-10 w-full rounded-xl border border-gray-300 bg-white px-3 text-sm'><option>부산 전체</option><option>수영구</option><option>연제구</option><option>해운대구</option></select></label>
          <label><span className='sr-only'>정렬</span><select value={sort} onChange={(event) => setSort(event.target.value as CommunitySort)} className='h-10 rounded-xl border border-gray-300 bg-white px-3 text-sm'><option value='latest'>최신순</option><option value='popular'>인기순</option></select></label>
        </div>
        <section aria-label='게시글 목록' className='space-y-3'>{filteredPosts.length ? filteredPosts.map((post) => <CommunityPostCard key={post.id} post={post} />) : <EmptyState title='검색 결과가 없습니다' description='검색어나 필터를 변경해보세요.' />}</section>
        <Link href='/community/write' aria-label='글쓰기' className='fixed bottom-20 right-[max(1.25rem,calc((100vw-28rem)/2+1.25rem))] grid size-14 place-items-center rounded-full bg-violet-600 text-white shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2'><PenLine aria-hidden='true' /></Link>
      </ContentContainer>
    </AppShell>
  );
}
