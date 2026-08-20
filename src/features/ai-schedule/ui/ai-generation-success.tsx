import { Check } from 'lucide-react';

import { Button } from '@/components/ui';
import type { AiGenerationResult } from '@/features/ai-schedule/model/ai-generation';
import { formatScheduleDate } from '@/features/ai-schedule/model/ai-generation';

interface AiGenerationSuccessProps {
  result: AiGenerationResult;
  onConfirm: () => void;
}

export function AiGenerationSuccess({ result, onConfirm }: AiGenerationSuccessProps) {
  return (
    <section className='flex min-h-[65dvh] flex-col items-center justify-center text-center'>
      <div className='grid size-16 place-items-center rounded-full bg-emerald-100 text-emerald-700'>
        <Check aria-hidden='true' size={34} strokeWidth={3} />
      </div>
      <p className='mt-6 text-base font-semibold text-violet-600'>
        {formatScheduleDate(result.targetDate)} ({result.dayNumber}일차)
      </p>
      <h2 className='mt-2 text-2xl font-bold text-gray-950'>일정이 생성되었습니다!</h2>
      <p className='mt-3 text-sm leading-6 text-gray-600'>공연장 위치를 기준으로<br />동선을 최적화했어요.</p>
      <Button size='lg' fullWidth className='mt-9' onClick={onConfirm}>확인</Button>
    </section>
  );
}
