'use client';

import { Apple, MessageCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Badge, Button } from '@/components/ui';
import { OnboardingFrame } from '@/features/onboarding/ui/onboarding-frame';

function GoogleMark() {
  return <span aria-hidden='true' className='text-lg font-bold text-blue-600'>G</span>;
}

export function LoginScreen() {
  const router = useRouter();

  const handleGoogleLogin = () => {
    const oauthUrl = process.env.NEXT_PUBLIC_GOOGLE_OAUTH_URL;

    if (oauthUrl) {
      window.location.assign(oauthUrl);
      return;
    }

    toast.info('Google OAuth 연결 전이라 프로필 설정 화면으로 이동합니다.');
    router.push('/onboarding/profile');
  };

  return (
    <OnboardingFrame step={2} title='Fan Route Sync 시작하기' description='소셜 계정으로 간편하게 로그인하세요.'>
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
