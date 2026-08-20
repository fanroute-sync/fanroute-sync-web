import { z } from 'zod';

export const nicknameSchema = z
  .string()
  .trim()
  .min(2, '닉네임은 2자 이상 입력해주세요.')
  .max(12, '닉네임은 12자 이하로 입력해주세요.')
  .regex(/^[가-힣a-zA-Z0-9_]+$/, '한글, 영문, 숫자, 밑줄만 사용할 수 있어요.');

export type NicknameAvailability = 'idle' | 'checking' | 'available' | 'duplicate' | 'error';
