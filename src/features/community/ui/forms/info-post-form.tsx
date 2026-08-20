'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button, Input } from '@/components/ui';
import { FormField, Textarea } from '@/features/community/ui/forms/form-field';

const schema = z.object({ title: z.string().trim().min(2, '제목을 입력해주세요.'), content: z.string().trim().min(5, '내용을 5자 이상 입력해주세요.'), tags: z.string() });
export type InfoPostValues = z.infer<typeof schema>;
export function InfoPostForm({ onSubmit, loading }: { onSubmit: (values: InfoPostValues) => void; loading: boolean }) {
  const { register, handleSubmit, formState: { errors } } = useForm<InfoPostValues>({ resolver: zodResolver(schema), defaultValues: { title: '', content: '', tags: '' } });
  return <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'><FormField label='제목' error={errors.title?.message}><Input {...register('title')} /></FormField><FormField label='내용' error={errors.content?.message}><Textarea {...register('content')} /></FormField><FormField label='태그'><Input placeholder='맛집, 교통, 공연장' {...register('tags')} /></FormField><Button type='submit' size='lg' fullWidth disabled={loading}>게시</Button></form>;
}
