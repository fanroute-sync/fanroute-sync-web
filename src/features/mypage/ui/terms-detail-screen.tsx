import { AppShell, ContentContainer, PageHeader } from '@/components/layout';
import type { termsFixtures } from '@/features/mypage/fixtures/terms-fixtures';

type TermsContent = (typeof termsFixtures)[keyof typeof termsFixtures];
export function TermsDetailScreen({ terms }: { terms: TermsContent }) { return <AppShell showBottomNavigation={false} header={<PageHeader title={terms.title} backHref='/my/terms' />}><ContentContainer><article className='space-y-7'>{terms.sections.map((section) => <section key={section.heading}><h2 className='text-lg font-bold'>{section.heading}</h2><p className='mt-2 text-sm leading-7 text-gray-600'>{section.content}</p></section>)}</article></ContentContainer></AppShell>; }
