import { Bot, CalendarCheck2 } from 'lucide-react';
import { AppShell, ContentContainer, PageHeader } from '@/components/layout';
import { Card } from '@/components/ui';
import type { AiUsageSnapshot } from '@/features/mypage/model/mypage';

export function AiUsageScreen({ usage }: { usage: AiUsageSnapshot }) {
  return <AppShell showBottomNavigation={false} header={<PageHeader title='AI 루트 사용 현황' backHref='/my' />}><ContentContainer className='space-y-7'><section className='rounded-3xl bg-violet-700 p-6 text-white'><Bot aria-hidden='true' size={30} /><p className='mt-5 text-4xl font-black'>{usage.used} / {usage.limit}회</p><p className='mt-2 text-sm text-violet-100'>{usage.month} 사용한 AI 일정 생성 횟수</p><p className='mt-4 text-xs text-violet-200'>잔여 {usage.remaining}회 · 서버 응답 기준</p></section><section><h2 className='mb-3 text-lg font-bold'>사용 내역</h2><div className='space-y-3'>{usage.history.map((item) => <Card key={item.id} className='flex items-center gap-3 shadow-none'><span className='grid size-10 place-items-center rounded-full bg-emerald-50 text-emerald-600'><CalendarCheck2 aria-hidden='true' size={19} /></span><div><strong className='block text-sm'>{item.date}</strong><span className='text-xs text-gray-500'>{item.targetDate} 일정 생성 성공</span></div></Card>)}</div><p className='mt-3 text-xs leading-5 text-gray-500'>성공한 생성 내역만 서버에서 전달받아 표시합니다. 실패한 생성은 포함되지 않습니다.</p></section></ContentContainer></AppShell>;
}
