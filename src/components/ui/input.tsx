import { forwardRef, type InputHTMLAttributes } from 'react';

import { cn } from '@/lib/utils/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, error = false, ...props },
  ref
) {
  return (
    <input
      ref={ref}
      aria-invalid={error || undefined}
      className={cn(
        'h-11 w-full rounded-xl border border-gray-300 bg-white px-3 text-base text-gray-950 outline-none placeholder:text-gray-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500',
        error && 'border-red-500 focus:border-red-500 focus:ring-red-100',
        className
      )}
      {...props}
    />
  );
});
