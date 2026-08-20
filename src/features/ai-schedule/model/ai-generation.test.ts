import { describe, expect, it } from 'vitest';

import { calculateDayNumber, formatScheduleDate } from '@/features/ai-schedule/model/ai-generation';

describe('AI schedule date helpers', () => {
  it('calculates the day number from the trip start date', () => {
    expect(calculateDayNumber('2026-07-29', '2026-07-29')).toBe(1);
    expect(calculateDayNumber('2026-07-29', '2026-07-31')).toBe(3);
  });

  it('formats one target date for the completion message', () => {
    expect(formatScheduleDate('2026-07-29')).toBe('7월 29일');
  });
});
