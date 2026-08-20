'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';

import { AppShell, ContentContainer, PageHeader } from '@/components/layout';
import { Button, Input } from '@/components/ui';
import { concertFixtures } from '@/features/trip-create/fixtures/concert-fixtures';
import { createTripFormSchema, type TripFormValues } from '@/features/trip-create/model/trip-form';
import { ConcertField } from '@/features/trip-create/ui/concert-field';
import { RecommendationStep } from '@/features/trip-create/ui/recommendation-step';
import { TimePeriodField } from '@/features/trip-create/ui/time-period-field';

const tripFormSchema = createTripFormSchema(concertFixtures);

export function TripCreateScreen() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TripFormValues>({
    resolver: zodResolver(tripFormSchema),
    defaultValues: {
      arrivalDate: '',
      arrivalPeriod: 'MORNING',
      departureDate: '',
      departurePeriod: 'EVENING',
      concertId: '',
    },
  });
  const formValues = useWatch({ control });
  const selectedConcert = concertFixtures.find((concert) => concert.id === formValues.concertId);

  const moveToRecommendation = () => setStep(2);
  const selectRecommendation = (recommended: boolean) => {
    if (!selectedConcert) return;
    const query = new URLSearchParams({ concertId: selectedConcert.id });
    if (recommended) {
      router.push(`/trips/draft/ai-generating?${query.toString()}`);
      return;
    }
    router.push(`/trips/draft/days/${selectedConcert.date}?${query.toString()}`);
  };

  return (
    <AppShell showBottomNavigation={false} header={<PageHeader title='여행 일정 만들기' backHref='/' />}>
      <ContentContainer>
        {step === 1 ? (
          <form onSubmit={handleSubmit(moveToRecommendation)} className='space-y-7'>
            <div>
              <div className='mb-3 flex items-center gap-2 text-sm font-semibold text-violet-600'><span>1</span><span>/ 2</span></div>
              <h2 className='text-2xl font-bold tracking-tight text-gray-950'>부산 여행 일정을<br />알려주세요</h2>
              <p className='mt-2 text-sm leading-6 text-gray-600'>도착과 출발 일정에 맞는 공연을 선택해주세요.</p>
            </div>

            <div className='space-y-4 rounded-2xl border border-gray-200 p-4'>
              <div>
                <label htmlFor='arrival-date' className='mb-2 block text-sm font-semibold text-gray-900'>부산 도착 날짜</label>
                <Input id='arrival-date' type='date' error={Boolean(errors.arrivalDate)} {...register('arrivalDate')} />
                {errors.arrivalDate ? <p className='mt-2 text-sm text-red-600'>{errors.arrivalDate.message}</p> : null}
              </div>
              <Controller control={control} name='arrivalPeriod' render={({ field }) => <TimePeriodField legend='부산 도착 시간대' value={field.value} onChange={field.onChange} error={errors.arrivalPeriod?.message} />} />
            </div>

            <div className='space-y-4 rounded-2xl border border-gray-200 p-4'>
              <div>
                <label htmlFor='departure-date' className='mb-2 block text-sm font-semibold text-gray-900'>부산 출발 날짜</label>
                <Input id='departure-date' type='date' error={Boolean(errors.departureDate)} {...register('departureDate')} />
                {errors.departureDate ? <p className='mt-2 text-sm text-red-600'>{errors.departureDate.message}</p> : null}
              </div>
              <Controller control={control} name='departurePeriod' render={({ field }) => <TimePeriodField legend='부산 출발 시간대' value={field.value} onChange={field.onChange} error={errors.departurePeriod?.message} />} />
            </div>

            <Controller control={control} name='concertId' render={({ field }) => <ConcertField concerts={concertFixtures} selectedId={field.value} onSelect={field.onChange} error={errors.concertId?.message} />} />
            <Button type='submit' size='lg' fullWidth>다음</Button>
          </form>
        ) : selectedConcert ? (
          <RecommendationStep concert={selectedConcert} onBack={() => setStep(1)} onSelect={selectRecommendation} />
        ) : null}
      </ContentContainer>
    </AppShell>
  );
}
