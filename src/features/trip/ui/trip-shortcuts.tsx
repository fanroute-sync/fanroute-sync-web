import { BedDouble, NotebookPen, SlidersHorizontal } from 'lucide-react';
import Link from 'next/link';

interface TripShortcutsProps {
  tripId: string;
}

export function TripShortcuts({ tripId }: TripShortcutsProps) {
  const items = [
    { href: `/trips/${tripId}/accommodation`, label: '숙박 정보', icon: BedDouble },
    { href: `/trips/${tripId}/style`, label: '여행 스타일', icon: SlidersHorizontal },
    { href: `/trips/${tripId}#trip-note`, label: '메모장', icon: NotebookPen },
  ] as const;

  return (
    <nav aria-label='여행 설정 바로가기' className='grid grid-cols-3 gap-2'>
      {items.map(({ href, label, icon: Icon }) => (
        <Link key={label} href={href} className='flex min-h-20 flex-col items-center justify-center gap-2 rounded-xl bg-gray-50 px-2 text-center text-xs font-semibold text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500'>
          <Icon aria-hidden='true' size={20} className='text-violet-600' />{label}
        </Link>
      ))}
    </nav>
  );
}
