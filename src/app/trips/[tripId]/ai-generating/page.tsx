import { notFound } from 'next/navigation';

import { AiGenerationScreen, type AiGenerationPreview } from '@/features/ai-schedule';
import { getTripFixture } from '@/features/trip';
import { findConcertFixture } from '@/features/trip-create';

interface AiGeneratingRoutePageProps {
  params: Promise<{ tripId: string }>;
  searchParams: Promise<{ concertId?: string; tripStartDate?: string; targetDate?: string; preview?: string }>;
}

const previews: AiGenerationPreview[] = ['auto', 'loading', 'failure', 'success'];

export default async function AiGeneratingRoutePage({ params, searchParams }: AiGeneratingRoutePageProps) {
  const [{ tripId }, { concertId, tripStartDate, targetDate, preview }] = await Promise.all([params, searchParams]);
  const concert = concertId ? findConcertFixture(concertId) : undefined;
  const trip = getTripFixture(tripId);

  if (!concert || (tripId !== 'draft' && !trip) || (trip && targetDate && !trip.days.some((day) => day.date === targetDate))) notFound();

  const selectedPreview = previews.find((item) => item === preview) ?? 'auto';
  const input = {
    tripId,
    concertId: concert.id,
    targetDate: targetDate ?? concert.date,
    tripStartDate: tripStartDate ?? trip?.startDate ?? concert.date,
  };

  return <AiGenerationScreen input={input} preview={selectedPreview} />;
}
