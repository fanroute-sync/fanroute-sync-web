'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef, useState } from 'react';

import { exchangeGoogleAuthorizationCode } from '@/features/onboarding/api/google-auth-service';
import { consumeGoogleOAuthState } from '@/features/onboarding/model/google-auth';

function GoogleAuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const started = useRef(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const code = searchParams.get('code');
    const validState = consumeGoogleOAuthState(searchParams.get('state'));
    if (!validState || !code || searchParams.has('error')) {
      queueMicrotask(() => setErrorMessage('Google 인증을 확인하지 못했어요. 다시 로그인해주세요.'));
      return;
    }

    void exchangeGoogleAuthorizationCode(code)
      .then(({ accessToken, newUser }) => {
        localStorage.setItem('accessToken', accessToken);
        router.replace(newUser ? '/onboarding/profile' : '/');
      })
      .catch(() => setErrorMessage('로그인에 실패했어요. 잠시 후 다시 시도해주세요.'));
  }, [router, searchParams]);

  return (
    <main className='mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-4 px-6 text-center'>
      {errorMessage ? <><p role='alert'>{errorMessage}</p><a className='text-violet-600 underline' href='/login'>로그인으로 돌아가기</a></> : <p role='status'>Google 로그인을 완료하고 있어요.</p>}
    </main>
  );
}

export default function GoogleAuthCallbackPage() {
  return <Suspense fallback={<p role='status'>Google 로그인을 완료하고 있어요.</p>}><GoogleAuthCallbackContent /></Suspense>;
}
