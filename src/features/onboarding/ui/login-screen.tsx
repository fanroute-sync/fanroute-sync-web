'use client';

import { Apple, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

import { BrandLockup } from '@/components/common';
import { Badge, Button } from '@/components/ui';
import { OnboardingFrame } from '@/features/onboarding/ui/onboarding-frame';
import { createGoogleAuthorizationUrl } from '@/features/onboarding/model/google-auth';

function GoogleMark() {
  return <span aria-hidden='true' className='text-lg font-bold text-blue-600'>G</span>;
}

export function LoginScreen() {
  const handleGoogleLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) {
      toast.error('Google 로그인 설정을 확인해주세요.');
      return;
    }
    window.location.assign(createGoogleAuthorizationUrl(window.location.origin, clientId));
  };

  return (
    <OnboardingFrame step={2} brand={<BrandLockup />} title='Troadie 시작하기' description='소셜 계정으로 간편하게 로그인하세요.'>
      <div className='mt-8 space-y-3'>
        <Button variant='outline' size='lg' fullWidth onClick={handleGoogleLogin}>
          <GoogleMark /> Google로 계속하기
        </Button>
        <Button variant='outline' size='lg' fullWidth disabled>
          <Apple aria-hidden='true' size={20} /> Apple로 계속하기 <Badge className='ml-auto'>준비 중</Badge>
        </Button>
        <Button variant='outline' size='lg' fullWidth disabled>
          <MessageCircle aria-hidden='true' size={20} /> Meta로 계속하기 <Badge className='ml-auto'>준비 중</Badge>
        </Button>
      </div>
      <p className='mt-auto pt-8 text-center text-xs leading-5 text-gray-500'>계속하면 서비스 이용약관 및 개인정보처리방침에 동의하는 것으로 간주됩니다.</p>
    </OnboardingFrame>
  );
}
