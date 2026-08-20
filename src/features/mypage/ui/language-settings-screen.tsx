import { Check, Languages } from 'lucide-react';
import { AppShell, ContentContainer, PageHeader } from '@/components/layout';
import { Badge, Card } from '@/components/ui';

const languages = [{ label: '한국어', active: true }, { label: 'English', active: false }, { label: '中文', active: false }, { label: '日本語', active: false }] as const;
export function LanguageSettingsScreen() { return <AppShell showBottomNavigation={false} header={<PageHeader title='언어 설정' backHref='/my' />}><ContentContainer className='space-y-3'>{languages.map((language) => <Card key={language.label} aria-disabled={!language.active || undefined} className={`flex items-center gap-3 shadow-none ${language.active ? 'border-violet-600 bg-violet-50' : 'bg-gray-50 opacity-70'}`}><Languages aria-hidden='true' size={20} className={language.active ? 'text-violet-600' : 'text-gray-400'} /><strong className='flex-1'>{language.label}</strong>{language.active ? <span className='grid size-6 place-items-center rounded-full bg-violet-600 text-white'><Check aria-hidden='true' size={15} /></span> : <Badge>Phase 2</Badge>}</Card>)}</ContentContainer></AppShell>; }
