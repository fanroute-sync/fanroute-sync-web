'use client';
import { PenLine } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { EmptyState, ErrorState, Loading } from '@/components/common';
import { AppShell, ContentContainer, Header } from '@/components/layout';
import { Button, SearchInput, Tabs } from '@/components/ui';
import { useCommunityPosts } from '../api/community-queries';
import type { CommunityPostType, CommunitySort } from '../model/community';
import { CommunityPostCard } from './community-post-card';
type Filter = 'ALL' | CommunityPostType;
const tabs = [{ value: 'ALL', label: '전체' }, { value: 'INFO', label: '정보 공유' }, { value: 'ROUTE', label: '참고 루트' }, { value: 'COMPANION', label: '동행 모집' }] as const;
export function CommunityListScreen() {
  const [query, setQuery] = useState(''); const [type, setType] = useState<Filter>('ALL');
  const [region, setRegion] = useState('부산 전체'); const [sort, setSort] = useState<CommunitySort>('latest'); const [page, setPage] = useState(0);
  const posts = useCommunityPosts({ ...(type === 'ALL' ? {} : { type }), ...(query.trim() ? { query: query.trim() } : {}), ...(region === '부산 전체' ? {} : { region }), sort, page, size: 20 });
  return <AppShell header={<Header />}><ContentContainer className='space-y-5'>
    <SearchInput aria-label='공연명, 장소, 해시태그 검색' placeholder='공연명 / 장소 / 해시태그 검색' value={query} onChange={(e) => { setQuery(e.target.value); setPage(0); }} onClear={() => { setQuery(''); setPage(0); }} />
    <Tabs items={tabs} value={type} onValueChange={(value) => { setType(value); setPage(0); }} ariaLabel='게시판 타입' className='overflow-x-auto' />
    <div className='flex gap-2'><label className='flex-1'><span className='sr-only'>지역 필터</span><select value={region} onChange={(e) => { setRegion(e.target.value); setPage(0); }} className='h-10 w-full rounded-xl border border-gray-300 bg-white px-3 text-sm'><option>부산 전체</option><option>수영구</option><option>연제구</option><option>해운대구</option></select></label>
    <label><span className='sr-only'>정렬</span><select value={sort} onChange={(e) => { setSort(e.target.value as CommunitySort); setPage(0); }} className='h-10 rounded-xl border border-gray-300 bg-white px-3 text-sm'><option value='latest'>최신순</option><option value='popular'>인기순</option></select></label></div>
    <section aria-label='게시글 목록' className='space-y-3'>{posts.isPending ? <Loading /> : posts.isError ? <ErrorState onRetry={() => void posts.refetch()} /> : posts.data.content.length ? posts.data.content.map((post) => <CommunityPostCard key={post.id} post={post} />) : <EmptyState title='검색 결과가 없습니다' description='검색어나 필터를 변경해보세요.' />}</section>
    {posts.data && posts.data.totalPages > 1 ? <nav aria-label='게시글 페이지' className='flex items-center justify-center gap-4'><Button disabled={posts.data.first} onClick={() => setPage(posts.data.number - 1)}>이전</Button><span>{posts.data.number + 1} / {posts.data.totalPages}</span><Button disabled={posts.data.last} onClick={() => setPage(posts.data.number + 1)}>다음</Button></nav> : null}
    <Link href='/community/write' aria-label='글쓰기' className='fixed bottom-20 right-[max(1.25rem,calc((100vw-28rem)/2+1.25rem))] grid size-14 place-items-center rounded-full bg-violet-600 text-white shadow-lg'><PenLine aria-hidden='true' /></Link>
  </ContentContainer></AppShell>;
}
