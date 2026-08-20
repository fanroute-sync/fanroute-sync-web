import { describe, expect, it } from 'vitest';

import { concertFixtures } from '@/features/trip-create/fixtures/concert-fixtures';
import { createTripFormSchema, type TripFormValues } from '@/features/trip-create/model/trip-form';

const schema = createTripFormSchema(concertFixtures);
const validValues: TripFormValues = {
  arrivalDate: '2026-08-22',
  arrivalPeriod: 'MORNING',
  departureDate: '2026-08-24',
  departurePeriod: 'EVENING',
  concertId: 'concert-summer-wave',
};

describe('trip form validation', () => {
  it('accepts a concert within the travel period', () => {
    expect(schema.safeParse(validValues).success).toBe(true);
  });

  it('rejects a departure date before arrival', () => {
    const result = schema.safeParse({ ...validValues, departureDate: '2026-08-21' });
    expect(result.success).toBe(false);
  });

  it('requires departure time to be later for a same-day trip', () => {
    const result = schema.safeParse({
      ...validValues,
      arrivalDate: '2026-08-23',
      arrivalPeriod: 'EVENING',
      departureDate: '2026-08-23',
      departurePeriod: 'EVENING',
    });
    expect(result.success).toBe(false);
  });

  it('rejects a concert outside the travel period', () => {
    const result = schema.safeParse({
      ...validValues,
      arrivalDate: '2026-08-24',
      departureDate: '2026-08-25',
    });
    expect(result.success).toBe(false);
  });
});
