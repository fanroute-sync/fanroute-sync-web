'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { EmptyState, ErrorState, Loading } from '@/components/common';
import { AppShell, ContentContainer, PageHeader } from '@/components/layout';
import { Button, Input } from '@/components/ui';
import { listPlaces, placeKeys, type PlaceCategory } from '@/features/trip/api/place-service';
import { createItineraryItemFromPlace, getItineraryDay, tripPlanKeys, updateItineraryItem } from '@/features/trip/api/trip-plan-service';
import { VenuePlaceCollections } from '@/features/trip/ui/venue-place-collections';

function placeIdentity(value: Record<string, unknown>) {
  const id = value.id ?? value.placeId;
  const title = value.title ?? value.name;
  return typeof id === 'number' && typeof title === 'string' ? { id, title, address: typeof value.address === 'string' ? value.address : null } : null;
}

export function ApiPlaceAddScreen({ tripId, date, replaceId }: { tripId: number; date: string; replaceId?: number }) {
  const router = useRouter();
  const client = useQueryClient();
  const [category, setCategory] = useState<PlaceCategory | undefined>();
  const [search, setSearch] = useState('');
  const params = { category, page: 0, size: 100 };
  const places = useQuery({ queryKey: placeKeys.list(params), queryFn: () => listPlaces(params) });
  const day = useQuery({ queryKey: tripPlanKeys.day(tripId, date), queryFn: () => getItineraryDay(tripId, date) });
  const save = useMutation({ mutationFn: async (place: { id: number; title: string }) => {
    if (!day.data) throw new Error('DAY_NOT_LOADED');
    if (replaceId !== undefined) {
      const current = day.data.items.find((item) => item.id === replaceId);
      if (!current || current.fixed) throw new Error('ITEM_NOT_EDITABLE');
      return updateItineraryItem(replaceId, { title: place.title, placeId: place.id, scheduledTime: current.scheduledTime ?? undefined, durationMinutes: current.durationMinutes ?? undefined });
    }
    return createItineraryItemFromPlace(day.data.itineraryDayId, place.id);
  }, onSuccess: async () => { await client.invalidateQueries({ queryKey: tripPlanKeys.day(tripId, date) }); router.push(`/trips/${tripId}/days/${date}`); }, onError: () => toast.error('장소를 일정에 저장하지 못했어요.') });
  const options = places.data?.content.map(placeIdentity).filter((value): value is { id: number; title: string; address: string | null } => value !== null).filter((value) => `${value.title} ${value.address ?? ''}`.toLowerCase().includes(search.toLowerCase())) ?? [];
  return <AppShell showBottomNavigation={false} header={<PageHeader title={replaceId ? '장소 변경' : '장소 추가'} backHref={`/trips/${tripId}/days/${date}`} />}><ContentContainer className='space-y-5'>
    {day.data?.concertDay ? <VenuePlaceCollections tripId={tripId} disabled={save.isPending} actionLabel={replaceId ? '변경' : '추가'} onSelect={(place) => save.mutate(place)} /> : null}
    <label htmlFor='place-search' className='block text-sm font-semibold'>장소 검색</label><Input id='place-search' value={search} onChange={(event) => setSearch(event.target.value)} placeholder='장소 이름 또는 주소' />
    <div className='flex flex-wrap gap-2'>{([undefined, 'ATTRACTION', 'RESTAURANT', 'ACCOMMODATION'] as const).map((value) => <Button key={value ?? 'ALL'} variant={category === value ? 'primary' : 'outline'} size='sm' onClick={() => setCategory(value)}>{value === undefined ? '전체' : value === 'ATTRACTION' ? '관광지' : value === 'RESTAURANT' ? '음식점' : '숙소'}</Button>)}</div>
    {places.isPending || day.isPending ? <Loading /> : places.isError || day.isError ? <ErrorState onRetry={() => { void places.refetch(); void day.refetch(); }} /> : options.length === 0 ? <EmptyState title='검색 결과가 없어요' /> : <ul className='space-y-3'>{options.map((place) => <li key={place.id} className='rounded-xl border border-gray-200 p-4'><h2 className='font-semibold'>{place.title}</h2>{place.address ? <p className='mt-1 text-sm text-gray-500'>{place.address}</p> : null}<Button className='mt-3' size='sm' disabled={save.isPending} onClick={() => save.mutate(place)}>{replaceId ? '변경' : '추가'}</Button></li>)}</ul>}
  </ContentContainer></AppShell>;
}
