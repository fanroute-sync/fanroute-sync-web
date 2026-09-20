import { notFound } from 'next/navigation';
import { getTripFixture, TravelStyleScreen } from '@/features/trip';
import { ApiTravelStyleScreen } from '@/features/trip/ui/api-travel-style-screen';
export default async function StylePage({ params }: { params: Promise<{ tripId: string }> }) { const { tripId } = await params; if (process.env.NEXT_PUBLIC_API_BASE_URL && /^\d+$/.test(tripId)) return <ApiTravelStyleScreen tripId={Number(tripId)} />; const trip = getTripFixture(tripId); if (!trip) notFound(); return <TravelStyleScreen trip={trip} />; }
