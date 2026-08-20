import { CircleAlert } from 'lucide-react';

import { Button } from '@/components/ui';

interface AiGenerationFailureProps {
  isRetrying: boolean;
  onRetry: () => void;
  onEditInput: () => void;
}

export function AiGenerationFailure({ isRetrying, onRetry, onEditInput }: AiGenerationFailureProps) {
  return (
    <section role='alert' className='flex min-h-[65dvh] flex-col items-center justify-center text-center'>
      <div className='grid size-16 place-items-center rounded-full bg-red-50 text-red-600'>
        <CircleAlert aria-hidden='true' size={32} />
      </div>
      <h2 className='mt-6 text-xl font-bold text-gray-950'>일정 생성에 실패했어요</h2>
      <p className='mt-2 text-sm leading-6 text-gray-600'>일시적인 오류가 발생했습니다.<br />다시 시도해보시겠어요?</p>
      <div className='mt-8 w-full space-y-3'>
        <Button size='lg' fullWidth onClick={onRetry} disabled={isRetrying}>
          {isRetrying ? '동일한 입력으로 재시도 중...' : '재시도하기'}
        </Button>
        <Button size='lg' variant='outline' fullWidth onClick={onEditInput}>입력값 다시 수정하기</Button>
      </div>
      <p className='mt-5 text-xs text-gray-500'>실패한 생성은 AI 사용 횟수에 포함되지 않아요.</p>
    </section>
  );
}
