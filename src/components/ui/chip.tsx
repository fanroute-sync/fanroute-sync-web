import type { ButtonHTMLAttributes } from 'react';

import { cn } from '@/lib/utils/cn';

export interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
}

export function Chip({ className, selected = false, type = 'button', ...props }: ChipProps) {
  return (
    <button
      type={type}
      aria-pressed={selected}
      className={cn(
        'inline-flex h-9 items-center justify-center rounded-full border px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 disabled:pointer-events-none disabled:opacity-50',
        selected
          ? 'border-violet-600 bg-violet-600 text-white'
          : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
        className
      )}
      {...props}
    />
  );
}
