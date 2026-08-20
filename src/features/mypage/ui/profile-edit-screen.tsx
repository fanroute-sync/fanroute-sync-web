'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, ImagePlus, LoaderCircle, UserRound, XCircle } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { AppShell, ContentContainer, PageHeader } from '@/components/layout';
import { Button, Input } from '@/components/ui';
import { onboardingFixtureService } from '@/features/onboarding/api/onboarding-service';
import { nicknameSchema, type NicknameAvailability } from '@/features/onboarding/model/nickname';

const schema = z.object({ nickname: nicknameSchema }); type Values = z.infer<typeof schema>;

export function ProfileEditScreen({ initialNickname }: { initialNickname: string }) {
  const router = useRouter(); const [image, setImage] = useState<File | null>(null); const [preview, setPreview] = useState<string | null>(null); const [result, setResult] = useState<{ nickname: string; status: 'available' | 'duplicate' | 'error' } | null>(null);
  const { register, control, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<Values>({ resolver: zodResolver(schema), mode: 'onChange', defaultValues: { nickname: initialNickname } });
  const nickname = useWatch({ control, name: 'nickname' }); const parsed = nicknameSchema.safeParse(nickname);
  const availability: NicknameAvailability = !parsed.success ? 'idle' : result?.nickname === parsed.data ? result.status : 'checking';
  useEffect(() => { const value = nicknameSchema.safeParse(nickname); if (!value.success) return; let active = true; const timer = window.setTimeout(() => { onboardingFixtureService.checkNickname(value.data).then((response) => { if (active) setResult({ nickname: value.data, status: response.available ? 'available' : 'duplicate' }); }, () => { if (active) setResult({ nickname: value.data, status: 'error' }); }); }, 500); return () => { active = false; window.clearTimeout(timer); }; }, [nickname]);
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);
  const chooseImage = (file: File | null) => { if (preview) URL.revokeObjectURL(preview); setImage(file); setPreview(file ? URL.createObjectURL(file) : null); };
  const submit = async (values: Values) => { try { await onboardingFixtureService.completeProfile({ nickname: values.nickname, profileImage: image }); toast.success('내 정보를 저장했어요.'); router.push('/my'); } catch (error) { if (error instanceof Error && error.message === 'NICKNAME_DUPLICATE') { setResult({ nickname: values.nickname, status: 'duplicate' }); setError('nickname', { message: '이미 사용 중인 닉네임이에요.' }); } else toast.error('저장하지 못했어요.'); } };
  return <AppShell showBottomNavigation={false} header={<PageHeader title='내 정보 수정' backHref='/my' />}><ContentContainer><form onSubmit={handleSubmit(submit)} className='space-y-8'>
    <section className='flex flex-col items-center'><div className='grid size-24 overflow-hidden rounded-full bg-violet-100 text-violet-600'>{preview ? <Image src={preview} alt='선택한 프로필 이미지' width={96} height={96} className='size-24 object-cover' unoptimized /> : <UserRound aria-hidden='true' className='m-auto' size={42} />}</div><div className='mt-4 flex gap-2'><label className='inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl bg-violet-50 px-3 text-sm font-semibold text-violet-700'><ImagePlus aria-hidden='true' size={16} />앨범에서 선택<input type='file' accept='image/png,image/jpeg,image/webp' className='sr-only' onChange={(event) => chooseImage(event.target.files?.[0] ?? null)} /></label><Button variant='outline' size='sm' onClick={() => chooseImage(null)}>기본 이미지로 변경</Button></div></section>
    <section><label htmlFor='edit-nickname' className='mb-2 block text-sm font-semibold'>닉네임</label><Input id='edit-nickname' {...register('nickname')} error={Boolean(errors.nickname) || availability === 'duplicate'} aria-describedby='edit-nickname-message' /><div id='edit-nickname-message' aria-live='polite' className='mt-2 min-h-5 text-sm'>{errors.nickname ? <p className='text-red-600'>{errors.nickname.message}</p> : availability === 'checking' ? <p className='flex items-center gap-1 text-gray-500'><LoaderCircle aria-hidden='true' className='animate-spin' size={15} />중복 확인 중...</p> : availability === 'available' ? <p className='flex items-center gap-1 text-emerald-600'><CheckCircle2 aria-hidden='true' size={15} />사용할 수 있는 닉네임이에요.</p> : availability === 'duplicate' ? <p className='flex items-center gap-1 text-red-600'><XCircle aria-hidden='true' size={15} />이미 사용 중인 닉네임이에요.</p> : null}</div><p className='mt-2 text-xs text-gray-500'>저장 시 서버에서 중복 여부를 최종 확인합니다.</p></section>
    <Button type='submit' size='lg' fullWidth disabled={isSubmitting || availability !== 'available'}>{isSubmitting ? '최종 확인 중...' : '저장하기'}</Button>
  </form></ContentContainer></AppShell>;
}
