import { TripCreateScreen } from '@/features/trip-create';
import { ApiTripCreateScreen } from '@/features/trip-create/ui/api-trip-create-screen';

export default function NewTripPage() {
  return process.env.NEXT_PUBLIC_API_BASE_URL ? <ApiTripCreateScreen /> : <TripCreateScreen />;
}
