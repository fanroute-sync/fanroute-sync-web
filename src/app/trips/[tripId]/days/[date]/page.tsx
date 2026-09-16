import { notFound } from 'next/navigation';

import { DayItineraryScreen, getTripFixture } from '@/features/trip';
import { ApiDayScreen } from '@/features/trip/ui/api-day-screen';

interface TripDayPageProps {
  params: Promise<{ tripId: string; date: string }>;
  searchParams: Promise<{ mode?: string }>;
}

export default async function TripDayPage({ params, searchParams }: TripDayPageProps) {
  const [{ tripId, date }, { mode }] = await Promise.all([params, searchParams]);
  if (process.env.NEXT_PUBLIC_API_BASE_URL && /^\d+$/.test(tripId)) return <ApiDayScreen tripId={Number(tripId)} date={date} />;
  const trip = getTripFixture(tripId);
  const day = trip?.days.find((item) => item.date === date);
  if (!trip || !day) notFound();
  const initialDay = mode === 'manual' ? { ...day, items: day.items.filter((item) => item.type === 'concert') } : day;
  return <DayItineraryScreen trip={trip} initialDay={initialDay} />;
}
