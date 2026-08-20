import { describe, expect, it } from 'vitest';

import { nicknameSchema } from './nickname';

describe('nicknameSchema', () => {
  it('accepts a valid nickname', () => {
    expect(nicknameSchema.safeParse('부산팬_01').success).toBe(true);
  });

  it.each(['', 'a', '공백 닉네임', 'fan!', '1234567890123'])('rejects invalid nickname: %s', (nickname) => {
    expect(nicknameSchema.safeParse(nickname).success).toBe(false);
  });
});
