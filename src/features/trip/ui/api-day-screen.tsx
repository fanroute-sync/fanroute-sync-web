'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

import { EmptyState, ErrorState, Loading } from '@/components/common';
import { AppShell, ContentContainer, PageHeader } from '@/components/layout';
import { Button, Input } from '@/components/ui';
import { createItineraryItem, deleteItineraryItem, getItineraryDay, getTripPlan, reorderItineraryItems, tripPlanKeys } from '@/features/trip/api/trip-plan-service';

export function ApiDayScreen({ tripId, date }: { tripId: number; date: string }) {
  const client = useQueryClient();
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const trip = useQuery({ queryKey: tripPlanKeys.detail(tripId), queryFn: () => getTripPlan(tripId) });
  const day = useQuery({ queryKey: tripPlanKeys.day(tripId, date), queryFn: () => getItineraryDay(tripId, date) });
  const refresh = () => client.invalidateQueries({ queryKey: tripPlanKeys.day(tripId, date) });
  const add = useMutation({ mutationFn: () => {
    if (!day.data) throw new Error('DAY_NOT_LOADED');
    return createItineraryItem(day.data.itineraryDayId, { type: 'CUSTOM', title: title.trim(), scheduledTime: time || undefined });
  }, onSuccess: async () => { setTitle(''); setTime(''); await refresh(); }, onError: () => toast.error('일정을 추가하지 못했어요.') });
  const remove = useMutation({ mutationFn: deleteItineraryItem, onSuccess: refresh, onError: () => toast.error('일정을 삭제하지 못했어요.') });
  const reorder = useMutation({ mutationFn: (ids: number[]) => {
    if (!day.data) throw new Error('DAY_NOT_LOADED');
    return reorderItineraryItems(day.data.itineraryDayId, ids);
  }, onSuccess: refresh, onError: () => toast.error('순서를 바꾸지 못했어요.') });
  const move = (index: number, direction: -1 | 1) => {
    if (!day.data) return;
    const ids = day.data.items.map((item) => item.id);
    const target = index + direction;
    if (target < 0 || target >= ids.length) return;
    [ids[index], ids[target]] = [ids[target], ids[index]];
    reorder.mutate(ids);
  };
  return <AppShell header={<PageHeader title='내 부산 여행' backHref={`/trips/${tripId}`} />}><ContentContainer className='space-y-5'>
    {trip.isPending || day.isPending ? <Loading /> : trip.isError || day.isError ? <ErrorState onRetry={() => { void trip.refetch(); void day.refetch(); }} /> : <>
      <nav aria-label='여행 날짜' className='flex gap-2 overflow-x-auto'>{trip.data.itineraryDays.map((entry) => <Link key={entry.id} href={`/trips/${tripId}/days/${entry.date}`} aria-current={entry.date === date ? 'date' : undefined} className={`rounded-xl px-3 py-2 text-sm ${entry.date === date ? 'bg-violet-600 text-white' : 'bg-gray-100'}`}>{entry.date.slice(5)}{entry.concertDay ? ' ★' : ''}</Link>)}</nav>
      <div><h2 className='text-lg font-bold'>{date}{day.data.concertDay ? ' · 공연일' : ''}</h2><p className='text-sm text-gray-500'>일정 {day.data.items.length}개</p></div>
      {!day.data.concertDay ? <Link className='block rounded-xl bg-violet-50 p-3 text-center font-semibold text-violet-700' href={`/trips/${tripId}/ai-generating?targetDate=${date}`}>AI 일정 생성</Link> : null}
      {day.data.items.length === 0 ? <EmptyState title='아직 추가된 일정이 없어요' /> : <ol className='space-y-3'>{day.data.items.map((item, index) => <li key={item.id} className='rounded-2xl border border-gray-200 p-4'><p className='text-sm text-gray-500'>{item.scheduledTime ?? '시간 미정'} · {item.type}</p><h3 className='mt-1 font-semibold'>{item.title}</h3>{item.fixed ? <span className='text-xs text-violet-700'>공연 고정 일정</span> : <div className='mt-3 flex flex-wrap gap-2'><Button size='sm' variant='outline' disabled={index === 0 || reorder.isPending} onClick={() => move(index, -1)}>위로</Button><Button size='sm' variant='outline' disabled={index === day.data.items.length - 1 || reorder.isPending} onClick={() => move(index, 1)}>아래로</Button>{item.type === 'PLACE' ? <Link className='inline-flex h-9 items-center rounded-xl border border-gray-300 px-3 text-sm' href={`/trips/${tripId}/days/${date}/places/add?replaceId=${item.id}`}>장소 변경</Link> : null}<Button size='sm' variant='ghost' disabled={remove.isPending} onClick={() => remove.mutate(item.id)}>삭제</Button></div>}</li>)}</ol>}
      <form className='space-y-3 rounded-2xl border border-gray-200 p-4' onSubmit={(event) => { event.preventDefault(); if (title.trim()) add.mutate(); }}><h3 className='font-semibold'>직접 일정 추가</h3><label htmlFor='custom-title' className='block text-sm'>일정 이름</label><Input id='custom-title' value={title} onChange={(event) => setTitle(event.target.value)} required /><label htmlFor='custom-time' className='block text-sm'>시간</label><Input id='custom-time' type='time' value={time} onChange={(event) => setTime(event.target.value)} /><Button type='submit' disabled={add.isPending || !title.trim()}>추가</Button></form>
      <Link className='block rounded-xl border border-violet-300 p-3 text-center font-semibold text-violet-700' href={`/trips/${tripId}/days/${date}/places/add`}>장소 추가</Link>
    </>}
  </ContentContainer></AppShell>;
}
