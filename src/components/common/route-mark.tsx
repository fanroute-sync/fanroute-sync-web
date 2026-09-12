import { cn } from '@/lib/utils/cn';

interface RouteMarkProps {
  className?: string;
}

export function RouteMark({ className }: RouteMarkProps) {
  return (
    <svg viewBox='0 0 48 48' fill='none' aria-hidden='true' className={cn('text-violet-600', className)}>
      <path d='M6 40C6 28 18 30 20 20C22 10 34 12 34 6' stroke='currentColor' strokeWidth={7} strokeLinecap='round' />
      <path
        d='M6 40C6 28 18 30 20 20C22 10 34 12 34 6'
        stroke='#ffffff'
        strokeOpacity={0.75}
        strokeWidth={1.4}
        strokeDasharray='3 4'
        strokeLinecap='round'
      />
      <circle cx={34} cy={6} r={5} fill='currentColor' />
    </svg>
  );
}
