'use client';

import { CalendarDays, LockKeyhole, MapPin, Plus, Sparkles, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

import { AppShell, ContentContainer, PageHeader } from '@/components/layout';
import { Badge, Button, Card } from '@/components/ui';
import type { TripDay, TripDetail } from '@/features/trip/model/trip';
import { KakaoMap } from '@/features/trip/ui/kakao-map';
import { TripShortcuts } from '@/features/trip/ui/trip-shortcuts';

interface DayItineraryScreenProps {
  trip: TripDetail;
  initialDay: TripDay;
}

export function DayItineraryScreen({ trip, initialDay }: DayItineraryScreenProps) {
  const [items, setItems] = useState(initialDay.items);

  const deletePlace = (itemId: string) => {
    setItems((current) => current.filter((item) => item.id !== itemId));
    toast.success('장소를 일정에서 삭제했어요.');
  };

  return (
    <AppShell header={<PageHeader title='내 부산 여행' backHref={`/trips/${trip.id}`} />}>
      <ContentContainer className='space-y-5'>
        <TripShortcuts tripId={trip.id} />
        <nav aria-label='여행 날짜' className='flex gap-2 overflow-x-auto pb-1'>
          {trip.days.map((day) => (
            <Link key={day.date} href={`/trips/${trip.id}/days/${day.date}`} aria-current={day.date === initialDay.date ? 'date' : undefined} className={`min-w-16 rounded-xl px-3 py-2 text-center text-sm font-semibold ${day.date === initialDay.date ? 'bg-violet-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
              <span className='block'>{day.date.slice(5).replace('-', '/')}</span>{day.isConcertDay ? <span className='text-xs'>★ 공연일</span> : null}
            </Link>
          ))}
        </nav>

        <div className='flex gap-2'>
          <Link href={`/trips/${trip.id}/ai-generating?concertId=${trip.concert.id}&tripStartDate=${trip.startDate}&targetDate=${initialDay.date}`} className='flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-violet-50 text-sm font-semibold text-violet-700'><Sparkles aria-hidden='true' size={17} />AI 일정 · 잔여 {trip.aiUsage.remaining}/{trip.aiUsage.limit}</Link>
          <Button variant='outline' size='sm'>편집</Button>
        </div>

        <KakaoMap items={items} />

        <section aria-labelledby='timeline-title'>
          <h2 id='timeline-title' className='mb-3 text-lg font-bold text-gray-950'>Timeline</h2>
          <ol className='space-y-3'>
            {items.map((item, index) => (
              <li key={item.id} className='relative pl-8'>
                {index < items.length - 1 ? <span className='absolute left-[11px] top-7 h-[calc(100%+0.75rem)] w-px bg-gray-200' /> : null}
                <span className='absolute left-0 top-4 grid size-6 place-items-center rounded-full bg-violet-100 text-xs font-bold text-violet-700'>{index + 1}</span>
                <Card className={item.type === 'concert' ? 'border-violet-200 bg-violet-50 shadow-none' : 'shadow-none'}>
                  <div className='flex items-center justify-between gap-2'>
                    <p className='font-bold text-gray-950'>{item.time}</p>
                    {item.type === 'concert' ? <Badge variant='primary'>공연일 · 고정</Badge> : <Badge>{item.category}</Badge>}
                  </div>
                  <h3 className='mt-2 font-semibold text-gray-950'>{item.name}</h3>
                  <p className='mt-1 flex items-center gap-1.5 text-sm text-gray-500'><MapPin aria-hidden='true' size={14} />{item.address}</p>
                  <div className='mt-4 flex gap-2'>
                    {item.type === 'concert' ? (
                      <><Button variant='outline' size='sm'>상세보기</Button><span className='ml-auto flex items-center gap-1 text-xs text-gray-500'><LockKeyhole aria-hidden='true' size={13} />변경·삭제 불가</span></>
                    ) : (
                      <>
                        <Link href={`/trips/${trip.id}/days/${initialDay.date}/places/add?replaceId=${item.id}`} className='inline-flex h-9 items-center rounded-xl border border-gray-300 px-3 text-sm font-semibold'>변경</Link>
                        <Button variant='ghost' size='sm' onClick={() => deletePlace(item.id)}><Trash2 aria-hidden='true' size={15} />삭제</Button>
                      </>
                    )}
                  </div>
                </Card>
              </li>
            ))}
          </ol>
        </section>

        <Link href={`/trips/${trip.id}/days/${initialDay.date}/places/add`} className='flex h-12 items-center justify-center gap-2 rounded-xl border border-violet-300 font-semibold text-violet-700'><Plus aria-hidden='true' size={18} />장소 / 일정 추가하기</Link>
        <p className='flex items-center justify-center gap-1 text-xs text-gray-500'><CalendarDays aria-hidden='true' size={13} />변경 사항은 API 연결 후 자동 저장됩니다.</p>
      </ContentContainer>
    </AppShell>
  );
}
