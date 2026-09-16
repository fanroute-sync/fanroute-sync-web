'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';

import { EmptyState, ErrorState, Loading } from '@/components/common';
import { AppShell, ContentContainer, Header } from '@/components/layout';
import { listTripPlans, tripPlanKeys } from '@/features/trip/api/trip-plan-service';

export function ApiHomeScreen() {
  const trips = useQuery({ queryKey: tripPlanKeys.list(), queryFn: listTripPlans });
  return <AppShell header={<Header title='Troadie' />}><ContentContainer className='space-y-5'>
    <h1 className='text-2xl font-bold'>내 부산 여행</h1>
    {trips.isPending ? <Loading /> : trips.isError ? <ErrorState onRetry={() => void trips.refetch()} /> : trips.data.length === 0 ? <EmptyState title='아직 여행 일정이 없어요' description='부산 공연과 함께할 여행을 계획해보세요.' action={<Link href='/trips/new' className='rounded-xl bg-violet-600 px-5 py-3 font-semibold text-white'>여행 일정 만들기</Link>} /> : <ul className='space-y-3'>{trips.data.map((trip) => <li key={trip.tripPlanId}><Link href={`/trips/${trip.tripPlanId}`} className='block rounded-xl border border-gray-200 p-4'><strong className='block'>{trip.concertTitle ?? '부산 여행'}</strong><span className='mt-1 block text-sm text-gray-600'>{trip.arrivalAt.slice(0, 10)} — {trip.departureAt.slice(0, 10)}</span></Link></li>)}</ul>}
    <Link href='/trips/new' className='block rounded-xl border border-violet-300 p-3 text-center font-semibold text-violet-700'>새 여행 만들기</Link>
  </ContentContainer></AppShell>;
}
