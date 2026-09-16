'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { ErrorState, Loading } from '@/components/common';
import { AppShell, ContentContainer, PageHeader } from '@/components/layout';
import { Button } from '@/components/ui';
import { aiGenerationKeys, cancelAiGeneration, getAiGeneration, retryAiGeneration, startAiGeneration } from '@/features/ai-schedule/api/ai-generation-service';
import { getItineraryDay, tripPlanKeys } from '@/features/trip/api/trip-plan-service';

export function ApiAiGenerationScreen({ tripId, date }: { tripId: number; date: string }) {
  const router = useRouter();
  const client = useQueryClient();
  const day = useQuery({ queryKey: tripPlanKeys.day(tripId, date), queryFn: () => getItineraryDay(tripId, date) });
  const creationKey = ['ai-generations', 'start', tripId, date] as const;
  const start = useQuery({ queryKey: creationKey, queryFn: () => startAiGeneration(day.data?.itineraryDayId ?? 0), enabled: Boolean(day.data && !day.data.concertDay), staleTime: Infinity, retry: false });
  const generationId = start.data?.generationId;
  const status = useQuery({ queryKey: aiGenerationKeys.detail(generationId ?? 0), queryFn: () => getAiGeneration(generationId ?? 0), enabled: generationId !== undefined, refetchInterval: (query) => ['PENDING', 'PROCESSING'].includes(query.state.data?.status ?? '') ? 2000 : false });
  const retry = useMutation({ mutationFn: () => retryAiGeneration(generationId ?? 0), onSuccess: async (result) => { client.setQueryData(creationKey, result); await client.invalidateQueries({ queryKey: aiGenerationKeys.detail(result.generationId) }); }, onError: () => toast.error('AI 일정 재시도에 실패했어요.') });
  const cancel = useMutation({ mutationFn: () => cancelAiGeneration(generationId ?? 0), onSuccess: () => router.replace(`/trips/${tripId}/days/${date}`), onError: () => toast.error('AI 일정 생성을 취소하지 못했어요.') });
  return <AppShell showBottomNavigation={false} header={<PageHeader title='AI 일정 생성' backHref={`/trips/${tripId}/days/${date}`} />}><ContentContainer className='space-y-5 py-8 text-center'>
    {day.isPending ? <Loading /> : day.isError ? <ErrorState onRetry={() => void day.refetch()} /> : day.data.concertDay ? <ErrorState title='공연일에는 AI 일정을 만들 수 없어요' /> : start.isError ? <ErrorState title='AI 생성 요청에 실패했어요' onRetry={() => void start.refetch()} /> : status.isError ? <ErrorState title='AI 생성 상태를 확인하지 못했어요' onRetry={() => void status.refetch()} /> : start.isPending || status.isPending ? <Loading label='AI 일정을 생성하고 있어요' /> : <>
      <h2 className='text-xl font-bold'>{status.data.status === 'COMPLETED' ? '일정이 생성되었습니다!' : status.data.status === 'FAILED' ? 'AI 일정 생성에 실패했어요' : status.data.status === 'CANCELLED' ? '생성이 취소되었어요' : 'AI 일정을 생성하고 있어요'}</h2>
      <p className='text-sm text-gray-600'>{date} · {status.data.status}</p>
      {status.data.status === 'COMPLETED' ? <Link href={`/trips/${tripId}/days/${date}`} className='block rounded-xl bg-violet-600 p-3 font-semibold text-white'>일정 확인</Link> : null}
      {status.data.status === 'FAILED' ? <Button disabled={retry.isPending} onClick={() => retry.mutate()}>다시 시도</Button> : null}
      {status.data.status === 'PENDING' ? <Button variant='outline' disabled={cancel.isPending} onClick={() => cancel.mutate()}>생성 취소</Button> : null}
    </>}
  </ContentContainer></AppShell>;
}
