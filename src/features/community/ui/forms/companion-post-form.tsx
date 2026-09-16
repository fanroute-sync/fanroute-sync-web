'use client';
import { useQuery } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { ErrorState, Loading } from '@/components/common';
import { Button, Input } from '@/components/ui';
import { concertKeys, listConcerts } from '@/features/trip-create/api/concert-service';
import { FormField } from './form-field';
const schema = z.object({ concertId: z.string().min(1, '공연을 선택해주세요.'), date: z.iso.date(), maxMembers: z.number().int().min(2), title: z.string().trim().min(2).max(200) });
export type CompanionPostValues = z.infer<typeof schema>;
export function CompanionPostForm({ onSubmit, loading }: { onSubmit: (values: CompanionPostValues) => void; loading: boolean }) {
  const params = { size: 100 }; const concerts = useQuery({ queryKey: concertKeys.list(params), queryFn: () => listConcerts(params) });
  const options = concerts.data?.content.flatMap((value) => { const id = value.id ?? value.concertId; const title = value.title ?? value.name ?? value.concertTitle; return typeof id === 'number' && typeof title === 'string' ? [{ id, title }] : []; }) ?? [];
  const { register, handleSubmit, formState: { errors } } = useForm<CompanionPostValues>({ resolver: zodResolver(schema), defaultValues: { concertId: '', date: '', maxMembers: 3, title: '' } });
  return <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'><FormField label='공연' error={errors.concertId?.message}>{concerts.isPending ? <Loading /> : concerts.isError ? <ErrorState onRetry={() => void concerts.refetch()} /> : <select className='h-11 w-full rounded-xl border border-gray-300 bg-white px-3' {...register('concertId')}><option value=''>공연을 선택하세요</option>{options.map((concert) => <option key={concert.id} value={concert.id}>{concert.title}</option>)}</select>}</FormField><div className='grid grid-cols-2 gap-3'><FormField label='날짜' error={errors.date?.message}><Input type='date' {...register('date')} /></FormField><FormField label='모집 인원' error={errors.maxMembers?.message}><Input type='number' min={2} {...register('maxMembers', { valueAsNumber: true })} /></FormField></div><FormField label='제목' error={errors.title?.message}><Input maxLength={200} {...register('title')} /></FormField><p className='text-xs text-gray-500'>연락은 댓글을 통해 진행됩니다.</p><Button type='submit' size='lg' fullWidth disabled={loading || !concerts.isSuccess || options.length === 0}>게시</Button></form>;
}
