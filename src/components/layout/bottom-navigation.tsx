'use client';

import { CalendarDays, Home, MessageCircle, UserRound } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils/cn';

const navigationItems = [
  { href: '/', label: '메인', icon: Home },
  { href: '/trips', label: '일정', icon: CalendarDays },
  { href: '/community', label: '커뮤니티', icon: MessageCircle },
  { href: '/my', label: '마이페이지', icon: UserRound },
] as const;

function isActiveRoute(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav
      aria-label='주요 메뉴'
      className='fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-md border-t border-gray-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur'
    >
      <ul className='grid h-16 grid-cols-4'>
        {navigationItems.map(({ href, label, icon: Icon }) => {
          const active = isActiveRoute(pathname, href);

          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex h-full flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-violet-500',
                  active ? 'text-violet-700' : 'text-gray-500 hover:text-gray-800'
                )}
              >
                <Icon aria-hidden='true' className='size-5' strokeWidth={active ? 2.5 : 2} />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
