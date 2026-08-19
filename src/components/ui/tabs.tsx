'use client';

import type { ReactNode } from 'react';

import { cn } from '@/lib/utils/cn';

export interface TabItem<T extends string> {
  value: T;
  label: ReactNode;
  disabled?: boolean;
}

interface TabsProps<T extends string> {
  items: readonly TabItem<T>[];
  value: T;
  onValueChange: (value: T) => void;
  ariaLabel: string;
  className?: string;
}

export function Tabs<T extends string>({ items, value, onValueChange, ariaLabel, className }: TabsProps<T>) {
  return (
    <div role='tablist' aria-label={ariaLabel} className={cn('flex border-b border-gray-200', className)}>
      {items.map((item) => {
        const selected = item.value === value;

        return (
          <button
            key={item.value}
            type='button'
            role='tab'
            aria-selected={selected}
            disabled={item.disabled}
            onClick={() => onValueChange(item.value)}
            className={cn(
              'min-h-11 flex-1 border-b-2 px-3 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-violet-500 disabled:opacity-40',
              selected ? 'border-violet-600 text-violet-700' : 'border-transparent text-gray-500 hover:text-gray-800'
            )}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
