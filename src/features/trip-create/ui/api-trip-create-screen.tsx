'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { ErrorState, Loading } from '@/components/common';
import { AppShell, ContentContainer, PageHeader } from '@/components/layout';
import { Button, Input } from '@/components/ui';
import { concertKeys, getConcert, getConcertSchedules, listConcerts } from '@/features/trip-create/api/concert-service';
import { listVenueItineraryTemplates, venueTemplateKeys } from '@/features/trip-create/api/venue-template-service';
import { TIME_PERIOD_LABELS, type TimePeriod } from '@/features/trip-create/model/trip-form';
import { createTripPlan, tripPlanKeys } from '@/features/trip/api/trip-plan-service';

function concertIdentity(value: Record<string, unknown>) {
  const id = value.id ?? value.concertId;
  const title = value.title ?? value.name ?? value.concertTitle;
  return typeof id === 'number' && typeof title === 'string' ? { id, title } : null;
}

export function ApiTripCreateScreen() {
  const router = useRouter();
  const client = useQueryClient();
  const params = { page: 0, size: 100 };
  const concerts = useQuery({ queryKey: concertKeys.list(params), queryFn: () => listConcerts(params) });
  const [arrivalDate, setArrivalDate] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [arrivalTimeSlot, setArrivalTimeSlot] = useState<TimePeriod>('MORNING');
  const [departureTimeSlot, setDepartureTimeSlot] = useState<TimePeriod>('EVENING');
  const [concertId, setConcertId] = useState<number | undefined>();
  const schedules = useQuery({ queryKey: concertKeys.schedules(concertId ?? 0), queryFn: () => getConcertSchedules(concertId ?? 0), enabled: concertId !== undefined });
  const concert = useQuery({ queryKey: concertKeys.detail(concertId ?? 0), queryFn: () => getConcert(concertId ?? 0), enabled: concertId !== undefined });
  const venueId = concert.data?.venueId;
  const selectedVenueId = typeof venueId === 'number' ? venueId : undefined;
  const templates = useQuery({ queryKey: venueTemplateKeys.list(selectedVenueId ?? 0), queryFn: () => listVenueItineraryTemplates(selectedVenueId ?? 0), enabled: selectedVenueId !== undefined });
  const create = useMutation({ mutationFn: createTripPlan, onSuccess: async (trip) => { await client.invalidateQueries({ queryKey: tripPlanKeys.all }); router.push(`/trips/${trip.tripPlanId}`); }, onError: () => toast.error('여행 일정을 만들지 못했어요. 입력값을 확인해주세요.') });
  const options = concerts.data?.content.map(concertIdentity).filter((value): value is { id: number; title: string } => value !== null) ?? [];
  return <AppShell showBottomNavigation={false} header={<PageHeader title='여행 일정 만들기' backHref='/trips' />}><ContentContainer>
    <form className='space-y-5' onSubmit={(event) => { event.preventDefault(); if (departureDate < arrivalDate) { toast.error('출발일은 도착일보다 빠를 수 없어요.'); return; } create.mutate({ arrivalDate, arrivalTimeSlot, departureDate, departureTimeSlot, ...(concertId === undefined ? {} : { concertId }) }); }}>
      <h2 className='text-2xl font-bold'>부산 여행 일정을 알려주세요</h2>
      <label htmlFor='api-arrival-date' className='block text-sm font-semibold'>부산 도착 날짜</label><Input id='api-arrival-date' type='date' value={arrivalDate} onChange={(event) => setArrivalDate(event.target.value)} required />
      <fieldset><legend className='mb-2 text-sm font-semibold'>부산 도착 시간대</legend><div className='flex gap-2'>{(Object.keys(TIME_PERIOD_LABELS) as TimePeriod[]).map((value) => <Button key={value} type='button' variant={arrivalTimeSlot === value ? 'primary' : 'outline'} onClick={() => setArrivalTimeSlot(value)}>{TIME_PERIOD_LABELS[value]}</Button>)}</div></fieldset>
      <label htmlFor='api-departure-date' className='block text-sm font-semibold'>부산 출발 날짜</label><Input id='api-departure-date' type='date' value={departureDate} onChange={(event) => setDepartureDate(event.target.value)} required />
      <fieldset><legend className='mb-2 text-sm font-semibold'>부산 출발 시간대</legend><div className='flex gap-2'>{(Object.keys(TIME_PERIOD_LABELS) as TimePeriod[]).map((value) => <Button key={value} type='button' variant={departureTimeSlot === value ? 'primary' : 'outline'} onClick={() => setDepartureTimeSlot(value)}>{TIME_PERIOD_LABELS[value]}</Button>)}</div></fieldset>
      <fieldset><legend className='mb-2 text-sm font-semibold'>공연 선택 (선택)</legend>{concerts.isPending ? <Loading /> : concerts.isError ? <ErrorState onRetry={() => void concerts.refetch()} /> : options.length === 0 ? <p className='rounded-xl bg-gray-50 p-4 text-sm text-gray-600'>등록된 공연이 없어요. 공연 없이 일정을 만들 수 있습니다.</p> : <div className='space-y-2'>{options.map((option) => <button key={option.id} type='button' aria-pressed={concertId === option.id} className={`block w-full rounded-xl border p-3 text-left ${concertId === option.id ? 'border-violet-600 bg-violet-50' : 'border-gray-200'}`} onClick={() => setConcertId(concertId === option.id ? undefined : option.id)}>{option.title}</button>)}</div>}{concertId !== undefined ? schedules.isPending ? <Loading label='공연 회차를 확인하고 있어요' /> : schedules.isError ? <ErrorState onRetry={() => void schedules.refetch()} /> : <ul className='mt-3 space-y-1 text-sm text-gray-600'>{schedules.data.map((schedule) => <li key={schedule.id}>{schedule.performanceDate} {schedule.provisional ? '시각 미정' : schedule.performanceTime} · {schedule.round}회차</li>)}</ul> : null}</fieldset>
      {concertId !== undefined ? <section aria-labelledby='venue-templates-title' className='space-y-3'><h3 id='venue-templates-title' className='font-semibold'>공연일 추천 일정</h3>{concert.isPending || (selectedVenueId !== undefined && templates.isPending) ? <Loading label='추천 일정을 확인하고 있어요' /> : concert.isError || (selectedVenueId !== undefined && templates.isError) ? <ErrorState onRetry={() => { void concert.refetch(); if (selectedVenueId !== undefined) void templates.refetch(); }} /> : selectedVenueId === undefined ? <p className='text-sm text-gray-600'>공연장 정보를 확인할 수 없어 추천 일정을 표시할 수 없어요.</p> : templates.data?.length === 0 ? <p className='text-sm text-gray-600'>이 공연장에 등록된 추천 일정이 없어요.</p> : <ul className='space-y-3'>{templates.data?.map((template) => <li key={template.id} className='rounded-xl border border-gray-200 p-4'><h4 className='font-semibold'>{template.name}</h4>{template.description ? <p className='mt-1 text-sm text-gray-600'>{template.description}</p> : null}<ol className='mt-2 space-y-1 text-sm text-gray-700'>{[...template.items].sort((a, b) => a.sortOrder - b.sortOrder).map((item) => <li key={`${item.sortOrder}-${item.placeId}`}>{item.defaultTime?.slice(0, 5) ?? '시간 미정'} · {item.placeName}</li>)}</ol></li>)}</ul>}</section> : null}
      <Button type='submit' size='lg' fullWidth disabled={create.isPending}>여행 일정 만들기</Button>
    </form>
  </ContentContainer></AppShell>;
}
