import { notFound } from 'next/navigation';
import { getTripFixture, PlaceAddScreen } from '@/features/trip';
export default async function PlaceAddPage({ params, searchParams }: { params: Promise<{ tripId: string; date: string }>; searchParams: Promise<{ replaceId?: string }> }) { const [{ tripId, date }, { replaceId }] = await Promise.all([params, searchParams]); const trip = getTripFixture(tripId); const day = trip?.days.find((item) => item.date === date); if (!trip || !day) notFound(); return <PlaceAddScreen trip={trip} day={day} replaceId={replaceId} />; }
