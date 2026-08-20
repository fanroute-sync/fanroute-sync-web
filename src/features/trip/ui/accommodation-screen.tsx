'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2 } from 'lucide-react';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { AppShell, ContentContainer, PageHeader } from '@/components/layout';
import { Button, Input } from '@/components/ui';
import type { TripDetail } from '@/features/trip/model/trip';

const accommodationSchema = z.object({
  accommodations: z.array(z.object({
    id: z.string(),
    name: z.string().trim().min(1, '숙소 이름을 입력해주세요.'),
    checkIn: z.string().min(1, '체크인 날짜를 선택해주세요.'),
    checkOut: z.string().min(1, '체크아웃 날짜를 선택해주세요.'),
  }).refine((stay) => stay.checkOut > stay.checkIn, { path: ['checkOut'], message: '체크아웃은 체크인 이후여야 해요.' })).min(1, '숙소를 한 개 이상 등록해주세요.'),
});
type AccommodationFormValues = z.infer<typeof accommodationSchema>;

export function AccommodationScreen({ trip }: { trip: TripDetail }) {
  const { control, register, handleSubmit, formState: { errors } } = useForm<AccommodationFormValues>({
    resolver: zodResolver(accommodationSchema),
    defaultValues: { accommodations: trip.accommodations },
  });
  const { fields, append, remove } = useFieldArray({ control, name: 'accommodations', keyName: 'fieldKey' });

  return (
    <AppShell showBottomNavigation={false} header={<PageHeader title='숙박 정보' backHref={`/trips/${trip.id}`} />}>
      <ContentContainer>
        <form onSubmit={handleSubmit(() => toast.success('숙박 정보를 저장했어요.'))} className='space-y-5'>
          <div className='flex items-center justify-between'>
            <div><h2 className='text-xl font-bold text-gray-950'>등록한 숙소</h2><p className='mt-1 text-sm text-gray-500'>여행 중 여러 숙소를 등록할 수 있어요.</p></div>
            <Button variant='secondary' size='sm' onClick={() => append({ id: `stay-${fields.length + 1}`, name: '', checkIn: trip.startDate, checkOut: trip.endDate })}><Plus aria-hidden='true' size={16} />추가</Button>
          </div>
          {fields.map((field, index) => (
            <fieldset key={field.fieldKey} className='space-y-4 rounded-2xl border border-gray-200 p-4'>
              <legend className='px-1 text-sm font-bold text-gray-900'>숙소 {index + 1}</legend>
              <input type='hidden' {...register(`accommodations.${index}.id`)} />
              <div><label htmlFor={`stay-name-${index}`} className='mb-2 block text-sm font-semibold'>숙소 이름</label><Input id={`stay-name-${index}`} {...register(`accommodations.${index}.name`)} error={Boolean(errors.accommodations?.[index]?.name)} />{errors.accommodations?.[index]?.name ? <p className='mt-1 text-xs text-red-600'>{errors.accommodations[index]?.name?.message}</p> : null}</div>
              <div className='grid grid-cols-2 gap-3'>
                <div><label htmlFor={`check-in-${index}`} className='mb-2 block text-sm font-semibold'>체크인</label><Input id={`check-in-${index}`} type='date' {...register(`accommodations.${index}.checkIn`)} /></div>
                <div><label htmlFor={`check-out-${index}`} className='mb-2 block text-sm font-semibold'>체크아웃</label><Input id={`check-out-${index}`} type='date' {...register(`accommodations.${index}.checkOut`)} error={Boolean(errors.accommodations?.[index]?.checkOut)} /></div>
              </div>
              {errors.accommodations?.[index]?.checkOut ? <p className='text-xs text-red-600'>{errors.accommodations[index]?.checkOut?.message}</p> : null}
              {fields.length > 1 ? <Button variant='ghost' size='sm' onClick={() => remove(index)}><Trash2 aria-hidden='true' size={15} />이 숙소 삭제</Button> : null}
            </fieldset>
          ))}
          <p className='text-xs leading-5 text-gray-500'>* 숙소는 날짜별 출발·도착 기점으로 자동 설정됩니다.</p>
          <Button type='submit' size='lg' fullWidth>저장</Button>
        </form>
      </ContentContainer>
    </AppShell>
  );
}
