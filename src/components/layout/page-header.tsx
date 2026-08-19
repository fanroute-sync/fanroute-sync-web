'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  backHref?: string;
  action?: ReactNode;
}

export function PageHeader({ title, backHref, action }: PageHeaderProps) {
  const router = useRouter();
  const backLabel = `${title} 이전 화면으로 이동`;
  const backIcon = <ArrowLeft aria-hidden='true' className='size-5' />;
  const backClassName =
    'flex size-10 items-center justify-center rounded-full text-gray-800 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500';

  return (
    <header className='sticky top-0 z-30 flex min-h-14 items-center border-b border-gray-100 bg-white/95 px-3 backdrop-blur'>
      {backHref ? (
        <Link href={backHref} aria-label={backLabel} className={backClassName}>
          {backIcon}
        </Link>
      ) : (
        <button type='button' aria-label={backLabel} onClick={() => router.back()} className={backClassName}>
          {backIcon}
        </button>
      )}
      <h1 className='min-w-0 flex-1 truncate px-2 text-center text-base font-bold text-gray-950'>{title}</h1>
      <div className='flex min-w-10 items-center justify-end'>{action}</div>
    </header>
  );
}
