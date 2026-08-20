'use client';

import { Link2, MapPin, Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { AppShell, ContentContainer, PageHeader } from '@/components/layout';
import { Badge, Button, Card, Chip, Input, SearchInput } from '@/components/ui';
import { placeSearchFixtures } from '@/features/trip/fixtures/trip-fixtures';
import type { PlaceSearchResult, TripDay, TripDetail } from '@/features/trip/model/trip';

type Sort = 'popular' | 'distance';
type Category = '전체' | PlaceSearchResult['category'];

export function PlaceAddScreen({ trip, day, replaceId }: { trip: TripDetail; day: TripDay; replaceId?: string }) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<Sort>('popular');
  const [category, setCategory] = useState<Category>('전체');
  const [communityLink, setCommunityLink] = useState('');
  const replaceIndex = replaceId ? day.items.findIndex((item) => item.id === replaceId) : -1;
  const previousPlace = replaceId ? day.items[replaceIndex - 1] : day.items.at(-1);
  const distanceOrigin = previousPlace?.name ?? '부산역';
  const results = useMemo(() => placeSearchFixtures
    .filter((place) => category === '전체' || place.category === category)
    .filter((place) => `${place.name} ${place.address}`.toLowerCase().includes(query.trim().toLowerCase()))
    .sort((a, b) => sort === 'popular' ? b.popularity - a.popularity : a.distanceKm - b.distanceKm), [category, query, sort]);

  const selectPlace = (place: PlaceSearchResult) => {
    toast.success(`${place.name}을(를) ${replaceId ? '변경' : '추가'}했어요.`);
    router.back();
  };

  return (
    <AppShell showBottomNavigation={false} header={<PageHeader title={replaceId ? '장소 변경' : '장소 / 일정 추가'} backHref={`/trips/${trip.id}/days/${day.date}`} />}>
      <ContentContainer className='space-y-6'>
        <SearchInput aria-label='장소 검색' placeholder='장소를 검색하세요' value={query} onChange={(event) => setQuery(event.target.value)} onClear={() => setQuery('')} />
        <div><div className='flex gap-2'><Chip selected={sort === 'popular'} onClick={() => setSort('popular')}>인기순</Chip><Chip selected={sort === 'distance'} onClick={() => setSort('distance')}>거리순</Chip></div>{sort === 'distance' ? <p className='mt-2 text-xs text-gray-500'>거리 기준: {distanceOrigin}{previousPlace ? ' 이후 장소' : ' (첫 일정 기본값)'}</p> : null}</div>
        <div className='flex gap-2'>{(['전체', '관광지', '음식점', '카페'] as const).map((item) => <Chip key={item} selected={category === item} onClick={() => setCategory(item)}>{item}</Chip>)}</div>
        <section aria-labelledby='place-results-title'><h2 id='place-results-title' className='mb-3 text-lg font-bold'>검색 결과</h2><div className='space-y-3'>{results.map((place) => <Card key={place.id} className='shadow-none'><div className='flex items-start justify-between gap-3'><div><Badge>{place.category}</Badge><h3 className='mt-2 font-semibold'>{place.name}</h3><p className='mt-1 flex items-center gap-1 text-sm text-gray-500'><MapPin aria-hidden='true' size={14} />{place.address}</p><p className='mt-1 text-xs text-gray-400'>{place.distanceKm}km</p></div><Button size='sm' onClick={() => selectPlace(place)}><Plus aria-hidden='true' size={15} />{replaceId ? '변경' : '추가'}</Button></div></Card>)}</div></section>
        <section className='rounded-2xl bg-violet-50 p-4'><h2 className='flex items-center gap-2 font-bold text-gray-950'><Link2 aria-hidden='true' size={18} />커뮤니티 일정 링크로 추가</h2><p className='mt-1 text-sm text-gray-600'>복사한 Fan Route 링크를 붙여넣으세요.</p><div className='mt-3 flex gap-2'><Input aria-label='커뮤니티 일정 링크' placeholder='https://...' value={communityLink} onChange={(event) => setCommunityLink(event.target.value)} /><Button variant='secondary' disabled={!communityLink.trim()} onClick={() => toast.info('API 연결 후 링크 일정을 불러옵니다.')}>붙여넣기</Button></div></section>
      </ContentContainer>
    </AppShell>
  );
}
