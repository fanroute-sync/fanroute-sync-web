import { Inbox } from 'lucide-react';
import type { ReactNode } from 'react';

import { cn } from '@/lib/utils/cn';

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
  className?: string;
}

export function EmptyState({ title, description, action, icon, className }: EmptyStateProps) {
  return (
    <section className={cn('flex flex-col items-center px-6 py-12 text-center', className)}>
      <div className='mb-4 flex size-12 items-center justify-center rounded-full bg-gray-100 text-gray-500'>
        {icon ?? <Inbox aria-hidden='true' className='size-6' />}
      </div>
      <h2 className='text-base font-semibold text-gray-950'>{title}</h2>
      {description ? <p className='mt-1 text-sm leading-6 text-gray-500'>{description}</p> : null}
      {action ? <div className='mt-5'>{action}</div> : null}
    </section>
  );
}
