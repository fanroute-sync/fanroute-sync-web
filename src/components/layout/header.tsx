import type { ReactNode } from 'react';

import { BrandLockup } from '@/components/common/brand-lockup';
import { cn } from '@/lib/utils/cn';

interface HeaderProps {
  title?: ReactNode;
  leading?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function Header({ title, leading, action, className }: HeaderProps) {
  const isBrand = title === undefined;

  return (
    <header
      className={cn(
        'sticky top-0 z-30 flex min-h-14 items-center border-b border-gray-100 bg-white/95 px-5 backdrop-blur',
        className
      )}
    >
      {leading && <div className='flex min-w-10 items-center justify-start'>{leading}</div>}
      <h1 className={cn('min-w-0 flex-1 truncate text-lg font-bold text-gray-950', isBrand ? 'text-left' : 'text-center')}>
        {title ?? <BrandLockup size='sm' />}
      </h1>
      {action && <div className='flex min-w-10 items-center justify-end'>{action}</div>}
    </header>
  );
}
