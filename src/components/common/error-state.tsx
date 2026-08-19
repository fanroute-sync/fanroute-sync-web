import { CircleAlert } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';

interface ErrorStateProps {
  title?: string;
  description?: string;
  retryLabel?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = '문제가 발생했어요',
  description = '잠시 후 다시 시도해주세요.',
  retryLabel = '다시 시도',
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <section role='alert' className={cn('flex flex-col items-center px-6 py-12 text-center', className)}>
      <div className='mb-4 flex size-12 items-center justify-center rounded-full bg-red-50 text-red-600'>
        <CircleAlert aria-hidden='true' className='size-6' />
      </div>
      <h2 className='text-base font-semibold text-gray-950'>{title}</h2>
      <p className='mt-1 text-sm leading-6 text-gray-500'>{description}</p>
      {onRetry ? (
        <Button variant='outline' className='mt-5' onClick={onRetry}>
          {retryLabel}
        </Button>
      ) : null}
    </section>
  );
}
