import { CalendarDays, ChevronRight, MapPin, Plus } from 'lucide-react';
import Link from 'next/link';

import { AppShell, ContentContainer, Header } from '@/components/layout';
import { Badge, Card } from '@/components/ui';
import type { TripDetail } from '@/features/trip/model/trip';

export function TripListScreen({ trips }: { trips: TripDetail[] }) {
  return <AppShell header={<Header title='내 여행 일정' />}><ContentContainer className='space-y-5'><Link href='/trips/new' className='flex h-12 items-center justify-center gap-2 rounded-xl bg-violet-600 font-semibold text-white'><Plus aria-hidden='true' size={18} />여행 일정 만들기</Link><section aria-label='저장한 여행 일정' className='space-y-3'>{trips.map((trip) => <Link key={trip.id} href={`/trips/${trip.id}`} className='block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500'><Card className='shadow-none'><div className='flex items-start gap-3'><span className='grid size-11 place-items-center rounded-full bg-violet-50 text-violet-600'><CalendarDays aria-hidden='true' size={21} /></span><div className='min-w-0 flex-1'><Badge variant='primary'>{trip.days.length}일 여행</Badge><h2 className='mt-2 truncate font-bold'>{trip.title}</h2><p className='mt-1 text-sm text-gray-500'>{trip.startDate} — {trip.endDate}</p><p className='mt-1 flex items-center gap-1 text-xs text-gray-500'><MapPin aria-hidden='true' size={13} />{trip.concert.venue}</p></div><ChevronRight aria-hidden='true' className='mt-3 text-gray-400' size={19} /></div></Card></Link>)}</section></ContentContainer></AppShell>;
}
