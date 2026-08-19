import { LoaderCircle } from 'lucide-react';

import { cn } from '@/lib/utils/cn';

interface LoadingProps {
  label?: string;
  className?: string;
}

export function Loading({ label = '불러오는 중', className }: LoadingProps) {
  return (
    <div role='status' className={cn('flex flex-col items-center justify-center gap-3 px-6 py-12', className)}>
      <LoaderCircle aria-hidden='true' className='size-7 animate-spin text-violet-600' />
      <span className='text-sm text-gray-600'>{label}</span>
    </div>
  );
}
