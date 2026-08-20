import { notFound } from 'next/navigation';

import { AiGenerationScreen, type AiGenerationPreview } from '@/features/ai-schedule';
import { findConcertFixture } from '@/features/trip-create';

interface AiGeneratingRoutePageProps {
  params: Promise<{ tripId: string }>;
  searchParams: Promise<{ concertId?: string; tripStartDate?: string; preview?: string }>;
}

const previews: AiGenerationPreview[] = ['auto', 'loading', 'failure', 'success'];

export default async function AiGeneratingRoutePage({ params, searchParams }: AiGeneratingRoutePageProps) {
  const [{ tripId }, { concertId, tripStartDate, preview }] = await Promise.all([params, searchParams]);
  const concert = concertId ? findConcertFixture(concertId) : undefined;

  if (tripId !== 'draft' || !concert) notFound();

  const selectedPreview = previews.find((item) => item === preview) ?? 'auto';
  const input = {
    tripId,
    concertId: concert.id,
    targetDate: concert.date,
    tripStartDate: tripStartDate ?? concert.date,
  };

  return <AiGenerationScreen input={input} preview={selectedPreview} />;
}
