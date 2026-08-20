import { LoaderCircle, MapPinned, Route } from 'lucide-react';

interface AiGenerationLoadingProps {
  targetDateLabel: string;
}

export function AiGenerationLoading({ targetDateLabel }: AiGenerationLoadingProps) {
  return (
    <section role='status' className='flex min-h-[65dvh] flex-col items-center justify-center text-center'>
      <div className='relative grid size-24 place-items-center rounded-full bg-violet-50 text-violet-600'>
        <LoaderCircle aria-hidden='true' className='size-12 animate-spin' />
        <Route aria-hidden='true' className='absolute size-5' />
      </div>
      <p className='mt-7 text-sm font-semibold text-violet-600'>{targetDateLabel} 일정</p>
      <h2 className='mt-2 text-xl font-bold text-gray-950'>AI가 여행 일정을 생성하고 있어요</h2>
      <p className='mt-3 flex items-center gap-1.5 text-sm leading-6 text-gray-600'>
        <MapPinned aria-hidden='true' size={16} /> 공연장 위치를 기준으로 최적의 동선을 계산하는 중입니다.
      </p>
      <p className='mt-6 text-xs text-gray-500'>보통 10~20초 정도 걸려요.</p>
    </section>
  );
}
