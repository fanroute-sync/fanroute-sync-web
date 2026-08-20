import { Route, Sparkles } from 'lucide-react';

import { Button, Card } from '@/components/ui';
import type { ConcertOption } from '@/features/trip-create/model/trip-form';

interface RecommendationStepProps {
  concert: ConcertOption;
  onBack: () => void;
  onSelect: (recommended: boolean) => void;
}

export function RecommendationStep({ concert, onBack, onSelect }: RecommendationStepProps) {
  return (
    <div className='flex min-h-[calc(100dvh-7rem)] flex-col'>
      <div className='mb-3 flex items-center gap-2 text-sm font-semibold text-violet-600'><span>2</span><span>/ 2</span></div>
      <h2 className='text-2xl font-bold tracking-tight text-gray-950'>공연일 추천 일정을<br />제공해드릴까요?</h2>
      <p className='mt-3 text-sm leading-6 text-gray-600'>{concert.name} 공연장 주변을 기준으로 동선을 추천해드려요.</p>

      <div className='mt-8 space-y-3'>
        <button type='button' className='block w-full rounded-2xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500' onClick={() => onSelect(true)}>
          <Card className='flex items-center gap-4 border-violet-200 bg-violet-50 shadow-none'>
            <span className='grid size-11 place-items-center rounded-full bg-violet-600 text-white'><Sparkles aria-hidden='true' size={21} /></span>
            <span><strong className='block text-gray-950'>예, 추천받을게요</strong><span className='mt-1 block text-sm text-gray-600'>AI 일정 생성으로 이동해요.</span></span>
          </Card>
        </button>
        <button type='button' className='block w-full rounded-2xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500' onClick={() => onSelect(false)}>
          <Card className='flex items-center gap-4 shadow-none'>
            <span className='grid size-11 place-items-center rounded-full bg-gray-100 text-gray-600'><Route aria-hidden='true' size={21} /></span>
            <span><strong className='block text-gray-950'>아니오, 직접 구성할게요</strong><span className='mt-1 block text-sm text-gray-600'>공연 일정만 담긴 빈 일정으로 이동해요.</span></span>
          </Card>
        </button>
      </div>

      <Button variant='ghost' className='mt-auto' onClick={onBack}>이전 단계로</Button>
    </div>
  );
}
