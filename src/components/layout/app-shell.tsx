import type { ReactNode } from 'react';

import { BottomNavigation } from '@/components/layout/bottom-navigation';
import { cn } from '@/lib/utils/cn';

interface AppShellProps {
  children: ReactNode;
  header?: ReactNode;
  showBottomNavigation?: boolean;
  className?: string;
}

export function AppShell({ children, header, showBottomNavigation = true, className }: AppShellProps) {
  return (
    <div className='min-h-dvh bg-gray-100 sm:py-4'>
      <div
        className={cn(
          'relative mx-auto flex min-h-dvh w-full max-w-md flex-col bg-white sm:min-h-[calc(100dvh-2rem)] sm:overflow-hidden sm:rounded-3xl sm:shadow-lg',
          className
        )}
      >
        {header}
        <main className={cn('min-h-0 flex-1', showBottomNavigation && 'pb-[calc(4rem+env(safe-area-inset-bottom))]')}>
          {children}
        </main>
      </div>
      {showBottomNavigation ? <BottomNavigation /> : null}
    </div>
  );
}
