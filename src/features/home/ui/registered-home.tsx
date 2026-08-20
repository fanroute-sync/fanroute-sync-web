import { ArrowRight, CalendarDays, MapPin } from 'lucide-react';
import Link from 'next/link';

import { Badge, Card } from '@/components/ui';
import type { RegisteredHomeData } from '@/features/home/model/home';
import { ContentSection } from '@/features/home/ui/content-section';

interface RegisteredHomeProps {
  data: RegisteredHomeData;
}

export function RegisteredHome({ data }: RegisteredHomeProps) {
  const { activeTrip } = data;
  const todayHref = `/trips/${activeTrip.id}/days/${activeTrip.todayDate}`;

  return (
    <div className='space-y-8'>
      <section aria-labelledby='active-concert-title' className='rounded-3xl bg-violet-700 p-5 text-white shadow-lg shadow-violet-200'>
        <div className='flex items-start justify-between gap-4'>
          <div>
            <p className='text-sm font-medium text-violet-100'>공연까지 남은 시간</p>
            <p className='mt-1 text-4xl font-black tracking-tight'>{activeTrip.dDay}</p>
          </div>
          <Badge className='bg-white/15 text-white'>예정된 공연</Badge>
        </div>
        <div className='my-5 h-px bg-white/20' />
        <h2 id='active-concert-title' className='text-lg font-bold'>{activeTrip.concertName}</h2>
        <p className='mt-2 flex items-center gap-2 text-sm text-violet-100'>
          <CalendarDays aria-hidden='true' size={16} /> {activeTrip.concertDate}
        </p>
        <p className='mt-1.5 flex items-center gap-2 text-sm text-violet-100'>
          <MapPin aria-hidden='true' size={16} /> {activeTrip.venue}
        </p>
        <Link href={todayHref} className='mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-white font-semibold text-violet-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-violet-700'>
          오늘 일정 보기 <ArrowRight aria-hidden='true' size={17} />
        </Link>
      </section>

      <section aria-labelledby='past-routes-title'>
        <h2 id='past-routes-title' className='mb-3 text-lg font-bold text-gray-950'>과거에 만든 루트</h2>
        <div className='space-y-3'>
          {data.pastRoutes.map((route) => (
            <Link key={route.id} href={route.href} className='block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500'>
              <Card className='flex items-center gap-3 shadow-none transition-colors hover:bg-gray-50'>
                <div className='min-w-0 flex-1'>
                  <h3 className='truncate font-semibold text-gray-950'>{route.title}</h3>
                  <p className='mt-1 text-sm text-gray-500'>{route.description}</p>
                </div>
                <ArrowRight aria-hidden='true' className='size-5 text-gray-400' />
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby='recommended-route-title'>
        <h2 id='recommended-route-title' className='mb-3 text-lg font-bold text-gray-950'>추천 루트 바로가기</h2>
        <Link href={data.recommendedRoute.href} className='block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500'>
          <Card className='border-violet-200 bg-violet-50 shadow-none'>
            <Badge variant='primary'>Fan Route 추천</Badge>
            <div className='mt-3 flex items-center gap-3'>
              <div className='min-w-0 flex-1'>
                <h3 className='font-semibold text-gray-950'>{data.recommendedRoute.title}</h3>
                <p className='mt-1 text-sm leading-5 text-gray-600'>{data.recommendedRoute.description}</p>
              </div>
              <ArrowRight aria-hidden='true' className='size-5 shrink-0 text-violet-600' />
            </div>
          </Card>
        </Link>
      </section>

      <ContentSection title='부산 콘서트 정보' items={data.concerts} />
    </div>
  );
}
