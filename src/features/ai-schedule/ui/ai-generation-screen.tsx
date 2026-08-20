'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { AppShell, ContentContainer, PageHeader } from '@/components/layout';
import {
  createAiGenerationSuccessFixture,
  generateAiScheduleFixture,
  type AiGenerationService,
} from '@/features/ai-schedule/fixtures/ai-generation-fixture';
import {
  formatScheduleDate,
  type AiGenerationInput,
  type AiGenerationPreview,
  type AiGenerationViewState,
} from '@/features/ai-schedule/model/ai-generation';
import { AiGenerationFailure } from '@/features/ai-schedule/ui/ai-generation-failure';
import { AiGenerationLoading } from '@/features/ai-schedule/ui/ai-generation-loading';
import { AiGenerationSuccess } from '@/features/ai-schedule/ui/ai-generation-success';

interface AiGenerationScreenProps {
  input: AiGenerationInput;
  preview?: AiGenerationPreview;
  service?: AiGenerationService;
}

function getInitialState(input: AiGenerationInput, preview: AiGenerationPreview): AiGenerationViewState {
  if (preview === 'failure') return { status: 'failure' };
  if (preview === 'success') return { status: 'success', result: createAiGenerationSuccessFixture(input) };
  return { status: 'loading' };
}

export function AiGenerationScreen({ input, preview = 'auto', service = generateAiScheduleFixture }: AiGenerationScreenProps) {
  const router = useRouter();
  const stableInput = useMemo(() => input, [input]);
  const [viewState, setViewState] = useState<AiGenerationViewState>(() => getInitialState(stableInput, preview));
  const [isRetrying, setIsRetrying] = useState(false);

  const generate = useCallback(async (isRetry: boolean) => {
    if (isRetry) {
      setIsRetrying(true);
      setViewState({ status: 'loading' });
    }

    try {
      const result = await service(stableInput, 'success');
      setViewState({ status: 'success', result });
    } catch {
      setViewState({ status: 'failure' });
    } finally {
      setIsRetrying(false);
    }
  }, [service, stableInput]);

  useEffect(() => {
    if (preview !== 'auto') return;

    let active = true;
    service(stableInput, 'success').then(
      (result) => {
        if (active) setViewState({ status: 'success', result });
      },
      () => {
        if (active) setViewState({ status: 'failure' });
      }
    );

    return () => {
      active = false;
    };
  }, [preview, service, stableInput]);

  const handleConfirm = () => {
    const query = new URLSearchParams({ concertId: stableInput.concertId, source: 'ai' });
    router.push(`/trips/${stableInput.tripId}/days/${stableInput.targetDate}?${query.toString()}`);
  };

  return (
    <AppShell showBottomNavigation={false} header={<PageHeader title='AI 일정 생성' backHref='/trips/new' />}>
      <ContentContainer>
        {viewState.status === 'loading' ? <AiGenerationLoading targetDateLabel={formatScheduleDate(stableInput.targetDate)} /> : null}
        {viewState.status === 'failure' ? (
          <AiGenerationFailure isRetrying={isRetrying} onRetry={() => void generate(true)} onEditInput={() => router.push('/trips/new')} />
        ) : null}
        {viewState.status === 'success' ? <AiGenerationSuccess result={viewState.result} onConfirm={handleConfirm} /> : null}
      </ContentContainer>
    </AppShell>
  );
}
