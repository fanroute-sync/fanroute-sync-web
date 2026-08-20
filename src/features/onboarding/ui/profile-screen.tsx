'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Camera, CheckCircle2, LoaderCircle, UserRound, XCircle } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button, Input } from '@/components/ui';
import { onboardingFixtureService } from '@/features/onboarding/api/onboarding-service';
import { type NicknameAvailability, nicknameSchema } from '@/features/onboarding/model/nickname';
import { OnboardingFrame } from '@/features/onboarding/ui/onboarding-frame';

const profileSchema = z.object({ nickname: nicknameSchema });
type ProfileFormValues = z.infer<typeof profileSchema>;

const statusMessages: Record<Exclude<NicknameAvailability, 'idle'>, string> = {
  checking: '닉네임을 확인하고 있어요.',
  available: '사용할 수 있는 닉네임이에요.',
  duplicate: '이미 사용 중인 닉네임이에요.',
  error: '확인하지 못했어요. 잠시 후 다시 시도해주세요.',
};

export function ProfileScreen() {
  const router = useRouter();
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [nicknameResult, setNicknameResult] = useState<{ nickname: string; status: Exclude<NicknameAvailability, 'idle' | 'checking'> } | null>(null);
  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({ resolver: zodResolver(profileSchema), mode: 'onChange', defaultValues: { nickname: '' } });
  const nickname = useWatch({ control, name: 'nickname' });
  const parsedNickname = nicknameSchema.safeParse(nickname);
  const availability: NicknameAvailability = !parsedNickname.success
    ? 'idle'
    : nicknameResult?.nickname === parsedNickname.data
      ? nicknameResult.status
      : 'checking';

  useEffect(() => {
    const parsedValue = nicknameSchema.safeParse(nickname);
    if (!parsedValue.success) return;

    let active = true;
    const timer = window.setTimeout(async () => {
      try {
        const result = await onboardingFixtureService.checkNickname(parsedValue.data);
        if (active) setNicknameResult({ nickname: parsedValue.data, status: result.available ? 'available' : 'duplicate' });
      } catch {
        if (active) setNicknameResult({ nickname: parsedValue.data, status: 'error' });
      }
    }, 500);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [nickname]);

  useEffect(() => () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setProfileImage(file);
    setPreviewUrl(file ? URL.createObjectURL(file) : null);
  };

  const submitProfile = async ({ nickname: submittedNickname }: ProfileFormValues) => {
    try {
      await onboardingFixtureService.completeProfile({ nickname: submittedNickname, profileImage });
      toast.success('프로필 설정이 완료되었어요.');
      router.push('/');
    } catch (error) {
      if (error instanceof Error && error.message === 'NICKNAME_DUPLICATE') {
        setNicknameResult({ nickname: submittedNickname, status: 'duplicate' });
        setError('nickname', { message: '이미 사용 중인 닉네임이에요.' });
        return;
      }
      toast.error('프로필을 저장하지 못했어요. 다시 시도해주세요.');
    }
  };

  const statusColor = availability === 'available' ? 'text-emerald-600' : availability === 'checking' ? 'text-gray-500' : 'text-red-600';

  return (
    <OnboardingFrame step={3} title='프로필을 설정해주세요' description='프로필 사진은 나중에 추가하거나 변경할 수 있어요.'>
      <form className='flex flex-1 flex-col' onSubmit={handleSubmit(submitProfile)}>
        <div className='mb-8 flex flex-col items-center'>
          <div className='relative'>
            <div className='grid size-24 overflow-hidden rounded-full bg-violet-100 text-violet-500'>
              {previewUrl ? <Image src={previewUrl} alt='선택한 프로필 사진 미리보기' width={96} height={96} className='size-24 object-cover' unoptimized /> : <UserRound aria-hidden='true' className='m-auto' size={42} />}
            </div>
            <label htmlFor='profile-image' className='absolute -bottom-1 -right-1 grid size-9 cursor-pointer place-items-center rounded-full bg-violet-600 text-white shadow-md focus-within:ring-2 focus-within:ring-violet-500 focus-within:ring-offset-2'>
              <Camera aria-hidden='true' size={18} />
              <span className='sr-only'>프로필 사진 선택</span>
              <input id='profile-image' type='file' accept='image/png,image/jpeg,image/webp' className='sr-only' onChange={handleImageChange} />
            </label>
          </div>
          <p className='mt-3 text-sm text-gray-500'>프로필 사진 (선택)</p>
        </div>

        <div>
          <label htmlFor='nickname' className='mb-2 block text-sm font-semibold text-gray-900'>닉네임 <span className='text-violet-600'>*</span></label>
          <Input id='nickname' placeholder='2~12자로 입력해주세요' autoComplete='nickname' error={Boolean(errors.nickname) || availability === 'duplicate'} aria-describedby='nickname-message' {...register('nickname')} />
          <div id='nickname-message' aria-live='polite' className='mt-2 min-h-5 text-sm'>
            {errors.nickname ? <p className='text-red-600'>{errors.nickname.message}</p> : availability !== 'idle' ? (
              <p className={`flex items-center gap-1.5 ${statusColor}`}>
                {availability === 'checking' ? <LoaderCircle aria-hidden='true' className='animate-spin' size={15} /> : availability === 'available' ? <CheckCircle2 aria-hidden='true' size={15} /> : <XCircle aria-hidden='true' size={15} />}
                {statusMessages[availability]}
              </p>
            ) : <p className='text-gray-500'>한글, 영문, 숫자, 밑줄을 사용할 수 있어요.</p>}
          </div>
        </div>

        <div className='mt-auto pt-8'>
          <Button type='submit' size='lg' fullWidth disabled={isSubmitting || availability !== 'available'}>
            {isSubmitting ? '서버에서 최종 확인 중...' : '시작하기'}
          </Button>
          <p className='mt-3 text-center text-xs text-gray-500'>저장할 때 서버에서 닉네임 중복 여부를 다시 확인합니다.</p>
        </div>
      </form>
    </OnboardingFrame>
  );
}
