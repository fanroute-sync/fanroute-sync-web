'use client';

import { useQuery } from '@tanstack/react-query';

import { ErrorState, Loading } from '@/components/common';
import { Button } from '@/components/ui';
import { concertKeys, getConcert } from '@/features/trip-create/api/concert-service';
import { getTripPlan, tripPlanKeys } from '@/features/trip/api/trip-plan-service';
import { listVenuePlaceCollections, venuePlaceCollectionKeys } from '@/features/trip/api/venue-place-collection-service';

interface VenuePlaceCollectionsProps {
  tripId: number;
  disabled: boolean;
  actionLabel: string;
  onSelect: (place: { id: number; title: string }) => void;
}

export function VenuePlaceCollections({ tripId, disabled, actionLabel, onSelect }: VenuePlaceCollectionsProps) {
  const trip = useQuery({ queryKey: tripPlanKeys.detail(tripId), queryFn: () => getTripPlan(tripId) });
  const concertId = trip.data?.concertId ?? undefined;
  const concert = useQuery({ queryKey: concertKeys.detail(concertId ?? 0), queryFn: () => getConcert(concertId ?? 0), enabled: concertId !== undefined });
  const venueId = concert.data?.venueId;
  const selectedVenueId = typeof venueId === 'number' ? venueId : undefined;
  const collections = useQuery({ queryKey: venuePlaceCollectionKeys.list(selectedVenueId ?? 0), queryFn: () => listVenuePlaceCollections(selectedVenueId ?? 0), enabled: selectedVenueId !== undefined });

  return <section aria-labelledby='venue-collections-title' className='space-y-3'>
    <h2 id='venue-collections-title' className='font-semibold'>공연장 주변 추천 장소</h2>
    {trip.isPending || concertId !== undefined && concert.isPending || selectedVenueId !== undefined && collections.isPending ? <Loading label='추천 장소를 확인하고 있어요' />
      : trip.isError || concertId !== undefined && concert.isError || selectedVenueId !== undefined && collections.isError ? <ErrorState onRetry={() => { void trip.refetch(); if (concertId !== undefined) void concert.refetch(); if (selectedVenueId !== undefined) void collections.refetch(); }} />
      : selectedVenueId === undefined ? <p className='text-sm text-gray-600'>공연장 정보를 확인할 수 없어 추천 장소를 표시할 수 없어요.</p>
      : collections.data?.length === 0 ? <p className='text-sm text-gray-600'>이 공연장에 등록된 추천 장소가 없어요.</p>
      : <ul className='space-y-3'>{collections.data?.map((collection) => <li key={collection.id} className='rounded-xl border border-gray-200 p-4'>
        <h3 className='font-semibold'>{collection.name}</h3>
        {collection.description ? <p className='mt-1 text-sm text-gray-600'>{collection.description}</p> : null}
        {collection.items.length === 0 ? <p className='mt-2 text-sm text-gray-500'>등록된 장소가 없어요.</p> : <ol className='mt-3 space-y-2'>{[...collection.items].sort((a, b) => a.sortOrder - b.sortOrder).map((item) => <li key={`${item.sortOrder}-${item.placeId}`} className='flex items-center justify-between gap-3'>
          <span className='text-sm'>{item.placeName}</span>
          <Button size='sm' variant='outline' disabled={disabled} onClick={() => onSelect({ id: item.placeId, title: item.placeName })}>{actionLabel}</Button>
        </li>)}</ol>}
      </li>)}</ul>}
  </section>;
}
