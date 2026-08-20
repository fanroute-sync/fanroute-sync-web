import { CommunityWriteScreen } from '@/features/community';
export default async function CommunityWritePage({ searchParams }: { searchParams: Promise<{ tripId?: string }> }) { const { tripId } = await searchParams; return <CommunityWriteScreen initialType={tripId ? 'REFERENCE_ROUTE' : 'INFO'} initialTripId={tripId} />; }
