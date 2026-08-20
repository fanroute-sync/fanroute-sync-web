import { CalendarDays, LockKeyhole, MapPin, Plus } from 'lucide-react';

import { EmptyState } from '@/components/common';
import { AppShell, ContentContainer, PageHeader } from '@/components/layout';
import { Badge, Card } from '@/components/ui';
import type { ConcertOption } from '@/features/trip-create/model/trip-form';

interface ManualItineraryScreenProps {
  concert: ConcertOption;
}

export function ManualItineraryScreen({ concert }: ManualItineraryScreenProps) {
  return (
    <AppShell header={<PageHeader title='내 부산 여행' backHref='/trips/new' />}>
      <ContentContainer className='space-y-5'>
        <div>
          <p className='text-sm font-semibold text-violet-600'>공연일 · {concert.date}</p>
          <h2 className='mt-1 text-xl font-bold text-gray-950'>직접 일정을 구성해보세요</h2>
        </div>

        <Card className='border-violet-200 bg-violet-50 shadow-none'>
          <div className='flex items-center justify-between gap-3'>
            <Badge variant='primary'>공연일 · 고정</Badge>
            <span className='flex items-center gap-1 text-xs font-medium text-gray-500'><LockKeyhole aria-hidden='true' size={13} />변경 불가</span>
          </div>
          <h3 className='mt-3 font-bold text-gray-950'>{concert.name}</h3>
          <p className='mt-2 flex items-center gap-2 text-sm text-gray-600'><CalendarDays aria-hidden='true' size={15} />{concert.time}</p>
          <p className='mt-1.5 flex items-center gap-2 text-sm text-gray-600'><MapPin aria-hidden='true' size={15} />{concert.venue}</p>
        </Card>

        <EmptyState
          className='rounded-2xl border border-dashed border-gray-300 py-10'
          icon={<Plus aria-hidden='true' className='size-6' />}
          title='아직 추가된 장소가 없어요'
          description='공연 일정 외에는 직접 채워보세요.'
        />
        <p className='text-center text-xs text-gray-500'>AI 일정을 생성하지 않아 사용 횟수가 차감되지 않았어요.</p>
      </ContentContainer>
    </AppShell>
  );
}
