import { notFound } from 'next/navigation';
import { AccommodationScreen, getTripFixture } from '@/features/trip';
import { ApiAccommodationScreen } from '@/features/trip/ui/api-accommodation-screen';
export default async function AccommodationPage({ params }: { params: Promise<{ tripId: string }> }) { const { tripId } = await params; if (process.env.NEXT_PUBLIC_API_BASE_URL && /^\d+$/.test(tripId)) return <ApiAccommodationScreen tripId={Number(tripId)} />; const trip = getTripFixture(tripId); if (!trip) notFound(); return <AccommodationScreen trip={trip} />; }
