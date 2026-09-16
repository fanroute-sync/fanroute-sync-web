'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { EmptyState, ErrorState, Loading } from '@/components/common';
import { AppShell, ContentContainer, PageHeader } from '@/components/layout';
import { Button } from '@/components/ui';
import { deleteTripPlan, getTripPlan, tripPlanKeys } from '@/features/trip/api/trip-plan-service';

export function ApiTripDetailScreen({ tripId }: { tripId: number }) {
  const router = useRouter();
  const client = useQueryClient();
  const trip = useQuery({ queryKey: tripPlanKeys.detail(tripId), queryFn: () => getTripPlan(tripId) });
  const remove = useMutation({ mutationFn: () => deleteTripPlan(tripId), onSuccess: async () => {
    await client.invalidateQueries({ queryKey: tripPlanKeys.all });
    router.replace('/trips');
  }, onError: () => toast.error('여행 일정을 삭제하지 못했어요.') });
  return <AppShell header={<PageHeader title='내 부산 여행 상세' backHref='/trips' />}><ContentContainer className='space-y-6'>
    {trip.isPending ? <Loading /> : trip.isError ? <ErrorState onRetry={() => void trip.refetch()} /> : <>
      <section><h2 className='text-xl font-bold'>{trip.data.concertTitle ?? '부산 여행'}</h2><p className='mt-2 text-sm text-gray-600'>{trip.data.arrivalAt.slice(0, 10)} — {trip.data.departureAt.slice(0, 10)}</p></section>
      <section><h3 className='mb-3 font-semibold'>일차별 일정</h3>{trip.data.itineraryDays.length === 0 ? <EmptyState title='아직 일정이 없어요' /> : <ul className='space-y-2'>{trip.data.itineraryDays.map((day) => <li key={day.id}><Link href={`/trips/${tripId}/days/${day.date}`} className='block rounded-xl border border-gray-200 p-4'>{day.date}{day.concertDay ? ' · 공연일' : ''}</Link></li>)}</ul>}</section>
      <Button variant='outline' fullWidth disabled={remove.isPending} onClick={() => { if (window.confirm('여행 일정을 삭제할까요?')) remove.mutate(); }}>여행 일정 삭제</Button>
    </>}
  </ContentContainer></AppShell>;
}
