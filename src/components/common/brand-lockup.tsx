import { RouteMark } from '@/components/common/route-mark';
import { cn } from '@/lib/utils/cn';

interface BrandLockupProps {
  className?: string;
}

export function BrandLockup({ className }: BrandLockupProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <RouteMark className='size-8' />
      <span className='text-2xl font-bold tracking-tight text-gray-950'>Troadie</span>
    </div>
  );
}
