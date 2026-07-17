import { describe, expect, it } from 'vitest';

import { calculateRemainingCount } from './calculate-remaining-count';

describe('calculateRemainingCount', () => {
  it('returns the remaining count', () => {
    expect(calculateRemainingCount(2, 5)).toBe(3);
  });

  it('does not return a negative value', () => {
    expect(calculateRemainingCount(6, 5)).toBe(0);
  });
});
