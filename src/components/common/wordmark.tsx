import { cn } from '@/lib/utils/cn';

interface WordmarkProps {
  className?: string;
}

export function Wordmark({ className }: WordmarkProps) {
  return (
    <span className={cn('font-bold tracking-tight', className)}>
      T<span className='text-violet-600'>ROAD</span>IE
    </span>
  );
}
