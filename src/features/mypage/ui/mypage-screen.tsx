'use client';

import { useQueryClient } from '@tanstack/react-query';
import { Bot, ChevronRight, FileText, Globe2, Heart, LogOut, MessageCircle, Pencil, UserRound } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { ConfirmDialog } from '@/components/common';
import { AppShell, ContentContainer, Header } from '@/components/layout';
import { Card } from '@/components/ui';
import type { MyPageData } from '@/features/mypage/model/mypage';

export function MyPageScreen({ data }: { data: MyPageData }) {
  const router = useRouter(); const queryClient = useQueryClient(); const [logoutOpen, setLogoutOpen] = useState(false);
  const logout = () => { localStorage.removeItem('accessToken'); queryClient.clear(); router.replace('/login'); };
  const menuClass = 'flex min-h-12 items-center gap-3 border-b border-gray-100 py-3 last:border-0';
  return <AppShell header={<Header title='마이페이지' />}><ContentContainer className='space-y-7'>
    <section className='flex items-center gap-4'><span className='grid size-16 place-items-center rounded-full bg-violet-100 text-violet-600'><UserRound aria-hidden='true' size={30} /></span><div className='min-w-0 flex-1'><h2 className='text-xl font-bold'>{data.profile.nickname}</h2><p className='text-sm text-gray-500'>Fan Route 여행자</p></div><Link href='/my/profile' aria-label='프로필 수정' className='grid size-10 place-items-center rounded-full bg-gray-100'><Pencil aria-hidden='true' size={18} /></Link></section>
    <section><h2 className='mb-3 text-lg font-bold'>내 활동</h2><Card className='grid grid-cols-3 divide-x p-0 shadow-none'><Link href='/my/activity?tab=POST' className='py-4 text-center'><FileText aria-hidden='true' className='mx-auto text-violet-600' size={19} /><strong className='mt-2 block'>{data.activityCounts.posts}개</strong><span className='text-xs text-gray-500'>게시글</span></Link><Link href='/my/activity?tab=LIKE' className='py-4 text-center'><Heart aria-hidden='true' className='mx-auto text-violet-600' size={19} /><strong className='mt-2 block'>{data.activityCounts.likes}개</strong><span className='text-xs text-gray-500'>좋아요</span></Link><Link href='/my/activity?tab=COMMENT' className='py-4 text-center'><MessageCircle aria-hidden='true' className='mx-auto text-violet-600' size={19} /><strong className='mt-2 block'>{data.activityCounts.comments}개</strong><span className='text-xs text-gray-500'>댓글</span></Link></Card></section>
    <Link href='/my/ai-usage' className='flex items-center gap-4 rounded-2xl bg-violet-700 p-5 text-white'><Bot aria-hidden='true' size={28} /><span className='flex-1'><strong className='block'>AI 루트 사용 현황</strong><span className='mt-1 block text-sm text-violet-100'>{data.aiUsage.used} / {data.aiUsage.limit}회 사용</span></span><ChevronRight aria-hidden='true' /></Link>
    <section><h2 className='mb-2 text-lg font-bold'>설정</h2><Card className='py-0 shadow-none'><Link href='/my/language' className={menuClass}><Globe2 aria-hidden='true' size={19} /><span className='flex-1'>언어 설정</span><ChevronRight aria-hidden='true' size={17} /></Link><Link href='/my/terms' className={menuClass}><FileText aria-hidden='true' size={19} /><span className='flex-1'>약관</span><ChevronRight aria-hidden='true' size={17} /></Link><button type='button' onClick={() => setLogoutOpen(true)} className={`${menuClass} w-full text-left text-red-600`}><LogOut aria-hidden='true' size={19} /><span className='flex-1'>로그아웃</span></button></Card></section>
  </ContentContainer><ConfirmDialog open={logoutOpen} title='로그아웃 하시겠어요?' description={<>저장된 일정과 활동 내역은<br />그대로 유지됩니다.</>} confirmLabel='로그아웃' confirmVariant='danger' onOpenChange={setLogoutOpen} onConfirm={logout} /></AppShell>;
}
