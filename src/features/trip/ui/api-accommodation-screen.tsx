'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { AppShell, ContentContainer, PageHeader } from '@/components/layout';
import { ErrorState, Loading } from '@/components/common';
import { Button, Input } from '@/components/ui';
import { getAccommodations, saveAccommodations, tripPlanKeys } from '@/features/trip/api/trip-plan-service';
import { getApiErrorMessage } from '@/lib/api/error-message';

const staySchema = z.object({
  nameOrAddress: z.string().trim().min(1, '숙소 이름 또는 주소를 입력해주세요.'),
  checkinDate: z.iso.date(),
  checkoutDate: z.iso.date(),
}).refine((stay) => stay.checkoutDate > stay.checkinDate, {
  path: ['checkoutDate'], message: '체크아웃은 체크인 이후여야 해요.',
});
const formSchema = z.object({ accommodations: z.array(staySchema).min(1, '숙소를 한 개 이상 입력해주세요.') });
type FormValues = z.infer<typeof formSchema>;

export function ApiAccommodationScreen({ tripId }: { tripId: number }) {
  const client = useQueryClient();
  const existing = useQuery({ queryKey: tripPlanKeys.accommodations(tripId), queryFn: () => getAccommodations(tripId) });
  const { control, register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { accommodations: [{ nameOrAddress: '', checkinDate: '', checkoutDate: '' }] },
  });
  useEffect(() => {
    if (existing.data) reset({ accommodations: existing.data.length ? existing.data.map(({ nameOrAddress, checkinDate, checkoutDate }) => ({ nameOrAddress, checkinDate, checkoutDate })) : [{ nameOrAddress: '', checkinDate: '', checkoutDate: '' }] });
  }, [existing.data, reset]);
  const { fields, append, remove } = useFieldArray({ control, name: 'accommodations' });
  const save = useMutation({
    mutationFn: (values: FormValues) => saveAccommodations(tripId, values.accommodations),
    onSuccess: async (accommodations) => {
      client.setQueryData(tripPlanKeys.accommodations(tripId), accommodations);
      await client.invalidateQueries({ queryKey: tripPlanKeys.detail(tripId) });
      toast.success('숙박 정보를 저장했어요.');
    },
    onError: (error) => toast.error(getApiErrorMessage(error, '숙박 정보를 저장하지 못했어요.')),
  });

  return <AppShell showBottomNavigation={false} header={<PageHeader title='숙박 정보' backHref={`/trips/${tripId}`} />}>
    <ContentContainer>
      {existing.isPending ? <Loading /> : existing.isError ? <ErrorState onRetry={() => void existing.refetch()} /> :
      <form onSubmit={handleSubmit((values) => save.mutate(values))} className='space-y-5'>
        <div className='flex items-center justify-between'>
          <div><h2 className='text-xl font-bold'>숙소 일괄 저장</h2><p className='mt-1 text-sm text-gray-500'>여행 중 묵을 숙소를 모두 입력해주세요. 저장하면 기존 숙소 목록이 입력한 목록으로 바뀝니다.</p></div>
          <Button type='button' variant='secondary' size='sm' onClick={() => append({ nameOrAddress: '', checkinDate: '', checkoutDate: '' })}><Plus aria-hidden='true' size={16} />추가</Button>
        </div>
        {fields.map((field, index) => <fieldset key={field.id} className='space-y-4 rounded-2xl border border-gray-200 p-4'>
          <legend className='px-1 text-sm font-bold'>숙소 {index + 1}</legend>
          <div><label htmlFor={`stay-name-${index}`} className='mb-2 block text-sm font-semibold'>숙소 이름 또는 주소</label><Input id={`stay-name-${index}`} {...register(`accommodations.${index}.nameOrAddress`)} error={Boolean(errors.accommodations?.[index]?.nameOrAddress)} />{errors.accommodations?.[index]?.nameOrAddress ? <p className='mt-1 text-xs text-red-600'>{errors.accommodations[index]?.nameOrAddress?.message}</p> : null}</div>
          <div className='grid grid-cols-2 gap-3'>
            <div><label htmlFor={`check-in-${index}`} className='mb-2 block text-sm font-semibold'>체크인</label><Input id={`check-in-${index}`} type='date' {...register(`accommodations.${index}.checkinDate`)} error={Boolean(errors.accommodations?.[index]?.checkinDate)} /></div>
            <div><label htmlFor={`check-out-${index}`} className='mb-2 block text-sm font-semibold'>체크아웃</label><Input id={`check-out-${index}`} type='date' {...register(`accommodations.${index}.checkoutDate`)} error={Boolean(errors.accommodations?.[index]?.checkoutDate)} /></div>
          </div>
          {errors.accommodations?.[index]?.checkoutDate ? <p className='text-xs text-red-600'>{errors.accommodations[index]?.checkoutDate?.message}</p> : null}
          {fields.length > 1 ? <Button type='button' variant='ghost' size='sm' onClick={() => remove(index)}><Trash2 aria-hidden='true' size={15} />이 숙소 삭제</Button> : null}
        </fieldset>)}
        <Button type='submit' size='lg' fullWidth disabled={save.isPending}>저장</Button>
      </form>}
    </ContentContainer>
  </AppShell>;
}
