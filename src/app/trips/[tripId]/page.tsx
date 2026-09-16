import { notFound } from 'next/navigation';

import { getTripFixture, TripDetailScreen } from '@/features/trip';
import { ApiTripDetailScreen } from '@/features/trip/ui/api-trip-detail-screen';

interface TripDetailPageProps {
  params: Promise<{ tripId: string }>;
}

export default async function TripDetailPage({ params }: TripDetailPageProps) {
  const { tripId } = await params;
  if (process.env.NEXT_PUBLIC_API_BASE_URL && /^\d+$/.test(tripId)) return <ApiTripDetailScreen tripId={Number(tripId)} />;
  const trip = getTripFixture(tripId);
  if (!trip) notFound();
  return <TripDetailScreen trip={trip} />;
}
