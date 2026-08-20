'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button, Input } from '@/components/ui';
import { concertOptions } from '@/features/community/fixtures/community-fixtures';
import { FormField, Textarea } from '@/features/community/ui/forms/form-field';

const schema = z.object({ concertId: z.string().min(1, '공연을 선택해주세요.'), date: z.string().min(1, '날짜를 선택해주세요.'), maxMembers: z.number().int().min(2).max(10), title: z.string().trim().min(2, '제목을 입력해주세요.'), content: z.string().trim().min(5, '내용을 5자 이상 입력해주세요.') });
export type CompanionPostValues = z.infer<typeof schema>;
export function CompanionPostForm({ onSubmit, loading }: { onSubmit: (values: CompanionPostValues) => void; loading: boolean }) {
  const { register, handleSubmit, formState: { errors } } = useForm<CompanionPostValues>({ resolver: zodResolver(schema), defaultValues: { concertId: '', date: '', maxMembers: 3, title: '', content: '' } });
  return <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'><FormField label='공연' error={errors.concertId?.message}><select className='h-11 w-full rounded-xl border border-gray-300 bg-white px-3' {...register('concertId')}><option value=''>공연을 선택하세요</option>{concertOptions.map((concert) => <option key={concert.id} value={concert.id}>{concert.label}</option>)}</select></FormField><div className='grid grid-cols-2 gap-3'><FormField label='날짜' error={errors.date?.message}><Input type='date' {...register('date')} /></FormField><FormField label='모집 인원'><Input type='number' min={2} max={10} {...register('maxMembers', { valueAsNumber: true })} /></FormField></div><FormField label='제목' error={errors.title?.message}><Input {...register('title')} /></FormField><FormField label='내용' error={errors.content?.message}><Textarea {...register('content')} /></FormField><p className='text-xs text-gray-500'>신청과 연락은 댓글을 통해 진행됩니다.</p><Button type='submit' size='lg' fullWidth disabled={loading}>게시</Button></form>;
}
