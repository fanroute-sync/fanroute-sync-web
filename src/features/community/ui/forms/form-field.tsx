import type { ReactNode, TextareaHTMLAttributes } from 'react';

export function FormField({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return <label className='block'><span className='mb-2 block text-sm font-semibold text-gray-900'>{label}</span>{children}{error ? <span className='mt-1 block text-xs text-red-600'>{error}</span> : null}</label>;
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className='min-h-32 w-full rounded-xl border border-gray-300 p-3 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100' {...props} />;
}
