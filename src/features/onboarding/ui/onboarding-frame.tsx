import type { ReactNode } from 'react';

import { AppShell, ContentContainer } from '@/components/layout';

interface OnboardingFrameProps {
  children: ReactNode;
  step: number;
  title: string;
  description: string;
}

export function OnboardingFrame({ children, step, title, description }: OnboardingFrameProps) {
  return (
    <AppShell showBottomNavigation={false} className='bg-gradient-to-b from-violet-50 to-white'>
      <ContentContainer className='flex min-h-dvh flex-col py-8 sm:min-h-[calc(100dvh-2rem)]'>
        <div aria-label={`온보딩 ${step}/3 단계`} className='mb-10 flex gap-2'>
          {[1, 2, 3].map((item) => (
            <span key={item} className={`h-1.5 flex-1 rounded-full ${item <= step ? 'bg-violet-600' : 'bg-gray-200'}`} />
          ))}
        </div>
        <header className='mb-8'>
          <p className='mb-2 text-sm font-semibold text-violet-600'>STEP {step} OF 3</p>
          <h1 className='text-2xl font-bold tracking-tight text-gray-950'>{title}</h1>
          <p className='mt-2 text-sm leading-6 text-gray-600'>{description}</p>
        </header>
        {children}
      </ContentContainer>
    </AppShell>
  );
}
