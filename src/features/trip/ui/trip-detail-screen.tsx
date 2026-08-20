import { CalendarDays, ChevronRight, MapPin, Share2 } from 'lucide-react';
import Link from 'next/link';

import { AppShell, ContentContainer, PageHeader } from '@/components/layout';
import { Badge, Card } from '@/components/ui';
import type { TripDetail } from '@/features/trip/model/trip';
import { TripShortcuts } from '@/features/trip/ui/trip-shortcuts';

interface TripDetailScreenProps {
  trip: TripDetail;
}

export function TripDetailScreen({ trip }: TripDetailScreenProps) {
  return (
    <AppShell header={<PageHeader title='내 부산 여행 상세' backHref='/' />}>
      <ContentContainer className='space-y-7'>
        <TripShortcuts tripId={trip.id} />

        <section>
          <p className='text-sm font-semibold text-gray-500'>전체 여행 기간</p>
          <h2 className='mt-1 text-xl font-bold text-gray-950'>{trip.startDate} — {trip.endDate} ({trip.days.length}일)</h2>
        </section>

        <Card className='shadow-none'>
          <Badge variant='primary'>공연</Badge>
          <h3 className='mt-3 font-bold text-gray-950'>{trip.concert.name}</h3>
          <p className='mt-2 flex items-center gap-2 text-sm text-gray-600'><CalendarDays aria-hidden='true' size={15} />{trip.concert.date}</p>
          <p className='mt-1.5 flex items-center gap-2 text-sm text-gray-600'><MapPin aria-hidden='true' size={15} />{trip.concert.venue}</p>
        </Card>

        <section aria-labelledby='stay-summary-title'>
          <h2 id='stay-summary-title' className='mb-3 text-lg font-bold text-gray-950'>숙소</h2>
          {trip.accommodations.map((stay) => (
            <Card key={stay.id} className='shadow-none'>
              <p className='font-semibold text-gray-950'>{stay.name}</p>
              <p className='mt-1 text-sm text-gray-500'>{stay.checkIn} — {stay.checkOut}</p>
            </Card>
          ))}
        </section>

        <section aria-labelledby='day-summary-title'>
          <h2 id='day-summary-title' className='mb-3 text-lg font-bold text-gray-950'>일차별 요약</h2>
          <div className='space-y-2'>
            {trip.days.map((day) => (
              <Link key={day.date} href={`/trips/${trip.id}/days/${day.date}`} className='flex items-center gap-3 rounded-2xl border border-gray-200 p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500'>
                <span className='font-bold text-violet-700'>D{day.dayNumber}{day.isConcertDay ? ' ★' : ''}</span>
                <span className='min-w-0 flex-1'><strong className='block truncate text-sm text-gray-950'>{day.summary}</strong><span className='mt-1 block text-xs text-gray-500'>{day.items.length}개 일정</span></span>
                <ChevronRight aria-hidden='true' size={18} className='text-gray-400' />
              </Link>
            ))}
          </div>
        </section>

        <section id='trip-note'>
          <label htmlFor='trip-note-input' className='mb-2 block text-lg font-bold text-gray-950'>메모장</label>
          <textarea id='trip-note-input' defaultValue={trip.note} className='min-h-28 w-full rounded-xl border border-gray-300 p-3 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100' />
          <p className='mt-1 text-xs text-gray-500'>API 연결 후 자동 저장됩니다.</p>
        </section>

        <div className='space-y-3'>
          <Link href={`/community/write?tripId=${trip.id}`} className='flex h-12 items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 font-semibold text-white'><Share2 aria-hidden='true' size={18} />Fan Route에 공유하기</Link>
          <Link href={`/trips/${trip.id}/days/${trip.days[0]?.date}`} className='flex h-12 items-center justify-center rounded-xl border border-gray-300 font-semibold text-gray-900'>일정 편집하기</Link>
        </div>
      </ContentContainer>
    </AppShell>
  );
}
