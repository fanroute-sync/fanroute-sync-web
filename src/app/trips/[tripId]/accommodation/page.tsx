import { notFound } from 'next/navigation';
import { AccommodationScreen, getTripFixture } from '@/features/trip';
export default async function AccommodationPage({ params }: { params: Promise<{ tripId: string }> }) { const { tripId } = await params; const trip = getTripFixture(tripId); if (!trip) notFound(); return <AccommodationScreen trip={trip} />; }
