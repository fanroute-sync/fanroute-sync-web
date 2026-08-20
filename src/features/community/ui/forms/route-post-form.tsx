'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button, Input } from '@/components/ui';
import { savedTripOptions } from '@/features/community/fixtures/community-fixtures';
import { FormField } from '@/features/community/ui/forms/form-field';

const schema = z.object({ tripId: z.string().min(1, '저장 일정을 선택해주세요.'), title: z.string().trim().min(2, '제목을 입력해주세요.'), tags: z.string().trim().min(1, '태그를 입력해주세요.') });
export type RoutePostValues = z.infer<typeof schema>;
export function RoutePostForm({ onSubmit, loading }: { onSubmit: (values: RoutePostValues) => void; loading: boolean }) {
  const { register, handleSubmit, formState: { errors } } = useForm<RoutePostValues>({ resolver: zodResolver(schema), defaultValues: { tripId: '', title: '', tags: '' } });
  return <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'><FormField label='내 저장 일정' error={errors.tripId?.message}><select className='h-11 w-full rounded-xl border border-gray-300 bg-white px-3' {...register('tripId')}><option value=''>일정을 선택하세요</option>{savedTripOptions.map((trip) => <option key={trip.id} value={trip.id}>{trip.label}</option>)}</select></FormField><FormField label='제목' error={errors.title?.message}><Input {...register('title')} /></FormField><FormField label='태그' error={errors.tags?.message}><Input placeholder='맛집위주, 혼자여행' {...register('tags')} /></FormField><Button type='submit' size='lg' fullWidth disabled={loading}>게시</Button></form>;
}
