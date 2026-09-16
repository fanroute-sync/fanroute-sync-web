'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';

import { EmptyState, ErrorState, Loading } from '@/components/common';
import { AppShell, ContentContainer, Header } from '@/components/layout';
import { listTripPlans, tripPlanKeys } from '@/features/trip/api/trip-plan-service';

export function ApiTripListScreen() {
  const trips = useQuery({ queryKey: tripPlanKeys.list(), queryFn: listTripPlans });
  return <AppShell header={<Header title='내 여행 일정' />}><ContentContainer className='space-y-5'>
    <Link href='/trips/new' className='flex h-12 items-center justify-center rounded-xl bg-violet-600 font-semibold text-white'>여행 일정 만들기</Link>
    {trips.isPending ? <Loading /> : trips.isError ? <ErrorState onRetry={() => void trips.refetch()} /> : trips.data.length === 0 ? <EmptyState title='저장한 여행 일정이 없어요' description='새 여행 일정을 만들어보세요.' /> :
      <ul className='space-y-3'>{trips.data.map((trip) => <li key={trip.tripPlanId}><Link className='block rounded-2xl border border-gray-200 p-4' href={`/trips/${trip.tripPlanId}`}><strong className='block'>{trip.concertTitle ?? '부산 여행'}</strong><span className='mt-2 block text-sm text-gray-600'>{trip.arrivalAt.slice(0, 10)} — {trip.departureAt.slice(0, 10)}</span></Link></li>)}</ul>}
  </ContentContainer></AppShell>;
}
