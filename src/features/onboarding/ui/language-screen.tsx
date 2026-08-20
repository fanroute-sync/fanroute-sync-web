import { Check, Languages } from 'lucide-react';
import Link from 'next/link';

import { Badge, Card } from '@/components/ui';
import { OnboardingFrame } from '@/features/onboarding/ui/onboarding-frame';

const languages = [
  { name: '한국어', enabled: true },
  { name: 'English', enabled: false },
  { name: '中文', enabled: false },
  { name: '日本語', enabled: false },
] as const;

export function LanguageScreen() {
  return (
    <OnboardingFrame step={1} title='언어를 선택해주세요' description='서비스에서 사용할 언어를 선택할 수 있어요.'>
      <div role='radiogroup' aria-label='언어' className='space-y-3'>
        {languages.map((language) => (
          <Card
            key={language.name}
            aria-disabled={!language.enabled || undefined}
            className={`flex items-center gap-4 shadow-none ${language.enabled ? 'border-violet-600 bg-violet-50' : 'bg-gray-50 opacity-70'}`}
          >
            <span className={`grid size-10 place-items-center rounded-full ${language.enabled ? 'bg-violet-100 text-violet-700' : 'bg-gray-200 text-gray-500'}`}>
              <Languages aria-hidden='true' size={20} />
            </span>
            <span className='flex-1 font-semibold text-gray-900'>{language.name}</span>
            {language.enabled ? (
              <span role='radio' aria-checked='true' aria-label='한국어 선택됨' className='grid size-6 place-items-center rounded-full bg-violet-600 text-white'>
                <Check aria-hidden='true' size={15} strokeWidth={3} />
              </span>
            ) : (
              <Badge>Phase 2</Badge>
            )}
          </Card>
        ))}
      </div>
      <div className='mt-auto pt-8'>
        <Link href='/login' className='flex h-12 w-full items-center justify-center rounded-xl bg-violet-600 px-5 font-semibold text-white transition-colors hover:bg-violet-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2'>
          다음
        </Link>
      </div>
    </OnboardingFrame>
  );
}
