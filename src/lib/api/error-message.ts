import { isAxiosError } from 'axios';

const messages: Record<string, string> = {
  COMMON_INVALID_PARAMETER: '입력값을 확인해주세요.',
  AUTH_GOOGLE_CODE_INVALID: 'Google 로그인 정보를 확인할 수 없습니다. 다시 로그인해주세요.',
  AUTH_GOOGLE_ID_TOKEN_INVALID: 'Google 로그인 정보를 확인할 수 없습니다. 다시 로그인해주세요.',
  AUTH_REFRESH_TOKEN_INVALID: '로그인 세션이 만료되었습니다. 다시 로그인해주세요.',
  CSRF_HEADER_REQUIRED: '요청을 확인할 수 없습니다. 다시 시도해주세요.',
  USER_SUSPENDED: '이용이 제한된 계정입니다.',
  USER_WITHDRAWN: '탈퇴 처리된 계정입니다.',
  AI_ITINERARY_GENERATION_LIMIT_EXCEEDED: 'AI 일정 생성 가능 횟수를 모두 사용했습니다.',
  SCHEDULE_FIXED_ITINERARY_ITEM: '공연 일정은 수정하거나 삭제할 수 없습니다.',
};

export function getApiErrorCode(error: unknown): string | null {
  if (!isAxiosError(error)) return null;
  const body: unknown = error.response?.data;
  if (typeof body !== 'object' || body === null || !('code' in body)) return null;
  return typeof body.code === 'string' ? body.code : null;
}

export function getApiErrorMessage(error: unknown, fallback = '잠시 후 다시 시도해주세요.'): string {
  const code = getApiErrorCode(error);
  return code ? messages[code] ?? fallback : fallback;
}
