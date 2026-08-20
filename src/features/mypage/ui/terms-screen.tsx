import { ChevronRight, FileText, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { AppShell, ContentContainer, PageHeader } from '@/components/layout';
import { Card } from '@/components/ui';

export function TermsScreen({ version }: { version: string }) { return <AppShell showBottomNavigation={false} header={<PageHeader title='약관' backHref='/my' />}><ContentContainer className='space-y-5'><Card className='py-0 shadow-none'><Link href='/my/terms/service' className='flex min-h-14 items-center gap-3 border-b border-gray-100'><FileText aria-hidden='true' size={19} /><span className='flex-1'>이용약관</span><ChevronRight aria-hidden='true' size={17} /></Link><Link href='/my/terms/privacy' className='flex min-h-14 items-center gap-3'><ShieldCheck aria-hidden='true' size={19} /><span className='flex-1'>개인정보처리방침</span><ChevronRight aria-hidden='true' size={17} /></Link></Card><p className='text-center text-sm text-gray-500'>현재 버전 {version}</p></ContentContainer></AppShell>; }
