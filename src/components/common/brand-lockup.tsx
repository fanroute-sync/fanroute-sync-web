import { RouteMark } from '@/components/common/route-mark';
import { cn } from '@/lib/utils/cn';

interface BrandLockupProps {
  size?: 'sm' | 'lg';
  className?: string;
}

const sizeStyles = {
  sm: { icon: 'size-6', text: 'text-lg' },
  lg: { icon: 'size-10', text: 'text-2xl' },
} as const;

export function BrandLockup({ size = 'lg', className }: BrandLockupProps) {
  const styles = sizeStyles[size];

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <RouteMark className={styles.icon} />
      <span className={cn('font-bold tracking-tight text-gray-950', styles.text)}>Troadie</span>
    </div>
  );
}
