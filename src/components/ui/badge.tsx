import { cva, type VariantProps } from 'class-variance-authority';
import type { HTMLAttributes } from 'react';

import { cn } from '@/lib/utils/cn';

const badgeVariants = cva('inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold', {
  variants: {
    variant: {
      neutral: 'bg-gray-100 text-gray-700',
      primary: 'bg-violet-100 text-violet-700',
      success: 'bg-emerald-100 text-emerald-700',
      warning: 'bg-amber-100 text-amber-800',
      danger: 'bg-red-100 text-red-700',
    },
  },
  defaultVariants: { variant: 'neutral' },
});

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
