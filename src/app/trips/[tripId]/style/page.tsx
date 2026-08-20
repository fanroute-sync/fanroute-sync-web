import { notFound } from 'next/navigation';
import { getTripFixture, TravelStyleScreen } from '@/features/trip';
export default async function StylePage({ params }: { params: Promise<{ tripId: string }> }) { const { tripId } = await params; const trip = getTripFixture(tripId); if (!trip) notFound(); return <TravelStyleScreen trip={trip} />; }
