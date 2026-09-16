'use client';
import { useQuery } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { ErrorState, Loading } from '@/components/common';
import { Button, Input } from '@/components/ui';
import { listTripPlans, tripPlanKeys } from '@/features/trip/api/trip-plan-service';
import { FormField } from './form-field';
const schema = z.object({ tripId: z.string().min(1, '저장 일정을 선택해주세요.'), title: z.string().trim().min(2).max(200), tags: z.string() });
export type RoutePostValues = z.infer<typeof schema>;
export function RoutePostForm({ onSubmit, loading, defaultTripId = '' }: { onSubmit: (values: RoutePostValues) => void; loading: boolean; defaultTripId?: string }) {
  const trips = useQuery({ queryKey: tripPlanKeys.list(), queryFn: listTripPlans });
  const { register, handleSubmit, formState: { errors } } = useForm<RoutePostValues>({ resolver: zodResolver(schema), defaultValues: { tripId: defaultTripId, title: '', tags: '' } });
  return <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'><FormField label='내 저장 일정' error={errors.tripId?.message}>{trips.isPending ? <Loading /> : trips.isError ? <ErrorState onRetry={() => void trips.refetch()} /> : <select className='h-11 w-full rounded-xl border border-gray-300 bg-white px-3' {...register('tripId')}><option value=''>일정을 선택하세요</option>{trips.data.map((trip) => <option key={trip.tripPlanId} value={trip.tripPlanId}>{trip.concertTitle ?? '부산 여행'} · {trip.arrivalAt.slice(0, 10)} — {trip.departureAt.slice(0, 10)}</option>)}</select>}</FormField><FormField label='제목' error={errors.title?.message}><Input maxLength={200} {...register('title')} /></FormField><FormField label='태그'><Input placeholder='맛집위주, 혼자여행' {...register('tags')} /></FormField><Button type='submit' size='lg' fullWidth disabled={loading || !trips.isSuccess || trips.data.length === 0}>게시</Button></form>;
}
