import { TripListScreen, tripFixture } from '@/features/trip';
import { ApiTripListScreen } from '@/features/trip/ui/api-trip-list-screen';
export default function TripsPage() { return process.env.NEXT_PUBLIC_API_BASE_URL ? <ApiTripListScreen /> : <TripListScreen trips={[tripFixture]} />; }
