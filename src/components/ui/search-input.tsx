import { Search, X } from 'lucide-react';
import { forwardRef, type InputHTMLAttributes } from 'react';

import { cn } from '@/lib/utils/cn';

export interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  onClear?: () => void;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(function SearchInput(
  { className, onClear, value, defaultValue, ...props },
  ref
) {
  const hasControlledValue = typeof value === 'string' && value.length > 0;

  return (
    <div className='relative'>
      <Search aria-hidden='true' className='pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-gray-400' />
      <input
        ref={ref}
        type='search'
        value={value}
        defaultValue={defaultValue}
        className={cn(
          'h-11 w-full rounded-xl border border-gray-300 bg-white py-2 pl-10 pr-10 text-base text-gray-950 outline-none placeholder:text-gray-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 disabled:cursor-not-allowed disabled:bg-gray-100',
          className
        )}
        {...props}
      />
      {onClear && hasControlledValue ? (
        <button
          type='button'
          aria-label='검색어 지우기'
          onClick={onClear}
          className='absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500'
        >
          <X aria-hidden='true' className='size-4' />
        </button>
      ) : null}
    </div>
  );
});
