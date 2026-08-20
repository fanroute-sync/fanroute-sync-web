import { notFound } from 'next/navigation';

import { getTripFixture, TripDetailScreen } from '@/features/trip';

interface TripDetailPageProps {
  params: Promise<{ tripId: string }>;
}

export default async function TripDetailPage({ params }: TripDetailPageProps) {
  const { tripId } = await params;
  const trip = getTripFixture(tripId);
  if (!trip) notFound();
  return <TripDetailScreen trip={trip} />;
}
