import type { ReactNode } from 'react';

import { cn } from '@/lib/utils/cn';

interface HeaderProps {
  title?: string;
  leading?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function Header({ title = 'Fan Route Sync', leading, action, className }: HeaderProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-30 flex min-h-14 items-center border-b border-gray-100 bg-white/95 px-5 backdrop-blur',
        className
      )}
    >
      <div className='flex min-w-10 items-center justify-start'>{leading}</div>
      <h1 className='min-w-0 flex-1 truncate text-center text-lg font-bold text-gray-950'>{title}</h1>
      <div className='flex min-w-10 items-center justify-end'>{action}</div>
    </header>
  );
}
