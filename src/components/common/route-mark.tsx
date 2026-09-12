import { cn } from '@/lib/utils/cn';

interface RouteMarkProps {
  className?: string;
}

export function RouteMark({ className }: RouteMarkProps) {
  return (
    <svg viewBox='0 0 48 48' fill='none' aria-hidden='true' className={cn('text-violet-600', className)}>
      <path d='M6 40C6 28 18 30 20 20C22 10 34 12 34 6' stroke='currentColor' strokeWidth={7} strokeLinecap='round' fill='none' />
      <path
        d='M6 40C6 28 18 30 20 20C22 10 34 12 34 6'
        stroke='#ffffff'
        strokeOpacity={0.85}
        strokeWidth={1.6}
        strokeDasharray='3 3.5'
        strokeLinecap='round'
        fill='none'
      />
      <circle cx={34} cy={6} r={6.5} fill='currentColor' />
    </svg>
  );
}
