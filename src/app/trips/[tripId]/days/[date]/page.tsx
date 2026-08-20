import { notFound } from 'next/navigation';

import { findConcertFixture, ManualItineraryScreen } from '@/features/trip-create';

interface TripDayPageProps {
  params: Promise<{ tripId: string; date: string }>;
  searchParams: Promise<{ concertId?: string }>;
}

export default async function TripDayPage({ params, searchParams }: TripDayPageProps) {
  const [{ tripId, date }, { concertId }] = await Promise.all([params, searchParams]);
  const concert = concertId ? findConcertFixture(concertId) : undefined;

  if (tripId !== 'draft' || !concert || concert.date !== date) notFound();

  return <ManualItineraryScreen concert={concert} />;
}
