'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { AppShell, ContentContainer, PageHeader } from '@/components/layout';
import { Button, Card, Chip } from '@/components/ui';
import type { TripDetail } from '@/features/trip/model/trip';

const companions = ['친구', '연인', '혼자', '부모님', '아이'] as const;
const travelMbtis = ['맛집탐방형', '감성사진형', '역사문화형', '자연힐링형', '쇼핑집중형', '카페투어형', '액티비티형', '로컬체험형', '공연몰입형'] as const;
const travelStyleSchema = z.object({ intensity: z.enum(['RELAXED', 'TIGHT']), companions: z.array(z.string()).min(1, '여행 인원을 선택해주세요.'), mbti: z.string().min(1, '여행 MBTI를 선택해주세요.') });
type TravelStyleValues = z.infer<typeof travelStyleSchema>;

export function TravelStyleScreen({ trip }: { trip: TripDetail }) {
  const { control, handleSubmit, formState: { errors } } = useForm<TravelStyleValues>({ resolver: zodResolver(travelStyleSchema), defaultValues: { intensity: 'RELAXED', companions: ['친구'], mbti: '맛집탐방형' } });
  return (
    <AppShell showBottomNavigation={false} header={<PageHeader title='여행 스타일' backHref={`/trips/${trip.id}`} />}>
      <ContentContainer>
        <form onSubmit={handleSubmit(() => toast.success('여행 스타일을 저장했어요.'))} className='space-y-7'>
          <Controller control={control} name='intensity' render={({ field }) => <fieldset><legend className='mb-3 text-lg font-bold'>여행 강도</legend><div className='grid grid-cols-2 gap-2'><Chip selected={field.value === 'RELAXED'} onClick={() => field.onChange('RELAXED')}>널럴하게</Chip><Chip selected={field.value === 'TIGHT'} onClick={() => field.onChange('TIGHT')}>타이트하게</Chip></div></fieldset>} />
          <Controller control={control} name='companions' render={({ field }) => <fieldset><legend className='mb-3 text-lg font-bold'>여행 인원 구성 <span className='text-xs font-normal text-gray-500'>복수 선택</span></legend><div className='flex flex-wrap gap-2'>{companions.map((item) => <Chip key={item} selected={field.value.includes(item)} onClick={() => field.onChange(field.value.includes(item) ? field.value.filter((value) => value !== item) : [...field.value, item])}>{item}</Chip>)}</div>{errors.companions ? <p className='mt-2 text-sm text-red-600'>{errors.companions.message}</p> : null}</fieldset>} />
          <Controller control={control} name='mbti' render={({ field }) => <fieldset><legend className='mb-3 text-lg font-bold'>나의 여행 MBTI</legend><div className='grid grid-cols-3 gap-2'>{travelMbtis.map((item) => <button key={item} type='button' aria-pressed={field.value === item} onClick={() => field.onChange(item)} className={`min-h-20 rounded-xl border p-2 text-sm font-semibold ${field.value === item ? 'border-violet-600 bg-violet-50 text-violet-700' : 'border-gray-200 text-gray-700'}`}>{item}</button>)}</div>{errors.mbti ? <p className='mt-2 text-sm text-red-600'>{errors.mbti.message}</p> : null}</fieldset>} />
          <Card className='bg-gray-50 text-sm text-gray-600 shadow-none'>여행 스타일은 일정 생성 이후 선택적으로 설정하며 언제든 변경할 수 있어요.</Card>
          <Button type='submit' size='lg' fullWidth>저장</Button>
        </form>
      </ContentContainer>
    </AppShell>
  );
}
