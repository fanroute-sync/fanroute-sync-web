import type { HTMLAttributes } from 'react';

import { cn } from '@/lib/utils/cn';

export function ContentContainer({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('w-full px-5 py-6', className)} {...props} />;
}
