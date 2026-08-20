import { CalendarPlus } from 'lucide-react';
import Link from 'next/link';

import { EmptyState } from '@/components/common';
import type { EmptyHomeData } from '@/features/home/model/home';
import { ContentSection } from '@/features/home/ui/content-section';

interface EmptyHomeProps {
  data: EmptyHomeData;
}

export function EmptyHome({ data }: EmptyHomeProps) {
  return (
    <div className='space-y-8'>
      <EmptyState
        className='rounded-2xl bg-violet-50 py-10'
        icon={<CalendarPlus aria-hidden='true' className='size-6' />}
        title='아직 등록된 일정이 없어요'
        description='공연 일정에 맞춘 나만의 부산 여행을 만들어보세요.'
        action={
          <Link href='/trips/new' className='inline-flex h-11 items-center justify-center rounded-xl bg-violet-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-violet-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2'>
            여행 일정 만들기
          </Link>
        }
      />
      <ContentSection title='부산 콘서트 정보' items={data.concerts} />
      <ContentSection title='매거진' items={data.magazines} />
      <ContentSection title='공지사항' items={data.notices} />
    </div>
  );
}
