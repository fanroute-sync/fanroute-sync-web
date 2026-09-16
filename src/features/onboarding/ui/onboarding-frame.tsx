import type { ReactNode } from 'react';

import { AppShell, ContentContainer } from '@/components/layout';

interface OnboardingFrameProps {
  children: ReactNode;
  title: string;
  description: string;
  brand?: ReactNode;
}

export function OnboardingFrame({ children, title, description, brand }: OnboardingFrameProps) {
  return (
    <AppShell showBottomNavigation={false} className='bg-gradient-to-b from-violet-50 to-white'>
      <ContentContainer className='flex min-h-dvh flex-col py-8 sm:min-h-[calc(100dvh-2rem)]'>
        {brand && <div className='mb-8'>{brand}</div>}
        <header className='mb-8'>
          <h1 className='text-2xl font-bold tracking-tight text-gray-950'>{title}</h1>
          <p className='mt-2 text-sm leading-6 text-gray-600'>{description}</p>
        </header>
        {children}
      </ContentContainer>
    </AppShell>
  );
}
