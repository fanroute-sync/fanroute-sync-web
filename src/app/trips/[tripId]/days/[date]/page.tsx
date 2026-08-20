import { notFound } from 'next/navigation';

import { DayItineraryScreen, getTripFixture } from '@/features/trip';

interface TripDayPageProps {
  params: Promise<{ tripId: string; date: string }>;
}

export default async function TripDayPage({ params }: TripDayPageProps) {
  const { tripId, date } = await params;
  const trip = getTripFixture(tripId);
  const day = trip?.days.find((item) => item.date === date);
  if (!trip || !day) notFound();
  return <DayItineraryScreen trip={trip} initialDay={day} />;
}
