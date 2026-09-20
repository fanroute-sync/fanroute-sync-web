'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';

import { ErrorState, Loading } from '@/components/common';
import { AppShell, ContentContainer, PageHeader } from '@/components/layout';
import { Button, Chip } from '@/components/ui';
import { getTravelStyle, saveTravelStyle, tripPlanKeys, type TravelStyle } from '@/features/trip/api/trip-plan-service';
import { getApiErrorMessage } from '@/lib/api/error-message';

const companions = ['친구', '연인', '혼자', '부모님', '아이'];
const mbtis = ['맛집탐방형', '감성사진형', '역사문화형', '자연힐링형', '쇼핑집중형', '카페투어형', '액티비티형', '로컬체험형', '공연몰입형'];

export function ApiTravelStyleScreen({ tripId }: { tripId: number }) {
  const existing = useQuery({ queryKey: tripPlanKeys.travelStyle(tripId), queryFn: () => getTravelStyle(tripId) });
  return <AppShell showBottomNavigation={false} header={<PageHeader title='여행 스타일' backHref={`/trips/${tripId}`} />}><ContentContainer className='space-y-7'>
    {existing.isPending ? <Loading /> : existing.isError ? <ErrorState onRetry={() => void existing.refetch()} /> : <TravelStyleForm tripId={tripId} initial={existing.data} />}
  </ContentContainer></AppShell>;
}

function TravelStyleForm({ tripId, initial }: { tripId: number; initial: TravelStyle }) {
  const client = useQueryClient();
  const [style, setStyle] = useState<TravelStyle>(initial);
  const save = useMutation({ mutationFn: (value: TravelStyle) => saveTravelStyle(tripId, value), onSuccess: (value) => { client.setQueryData(tripPlanKeys.travelStyle(tripId), value); toast.success('여행 스타일을 저장했어요.'); }, onError: (error) => toast.error(getApiErrorMessage(error, '여행 스타일을 저장하지 못했어요.')) });

  return <form className='space-y-7' onSubmit={(event) => { event.preventDefault(); if (style.companions.length < 1 || style.companions.length > 10 || !style.travelMbti) { toast.error('여행 인원과 여행 MBTI를 선택해주세요.'); return; } save.mutate(style); }}>
      <fieldset><legend className='mb-3 font-bold'>여행 강도</legend><div className='flex gap-2'>{(['RELAXED', 'TIGHT'] as const).map((value) => <Chip key={value} selected={style.travelIntensity === value} onClick={() => setStyle({ ...style, travelIntensity: value })}>{value === 'RELAXED' ? '널럴하게' : '타이트하게'}</Chip>)}</div></fieldset>
      <fieldset><legend className='mb-3 font-bold'>여행 인원 구성</legend><div className='flex flex-wrap gap-2'>{[...new Set([...companions, ...style.companions])].map((value) => <Chip key={value} selected={style.companions.includes(value)} onClick={() => setStyle({ ...style, companions: style.companions.includes(value) ? style.companions.filter((item) => item !== value) : [...style.companions, value] })}>{value}</Chip>)}</div></fieldset>
      <fieldset><legend className='mb-3 font-bold'>여행 MBTI</legend><div className='grid grid-cols-3 gap-2'>{[...new Set([...mbtis, style.travelMbti].filter(Boolean))].map((value) => <button key={value} type='button' aria-pressed={style.travelMbti === value} onClick={() => setStyle({ ...style, travelMbti: value })} className={`min-h-16 rounded-xl border p-2 text-sm ${style.travelMbti === value ? 'border-violet-600 bg-violet-50' : 'border-gray-200'}`}>{value}</button>)}</div></fieldset>
      <Button type='submit' size='lg' fullWidth disabled={save.isPending}>저장</Button>
    </form>;
}
