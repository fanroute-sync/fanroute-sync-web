import { isAxiosError } from 'axios';

const messages: Record<string, string> = {
  COMMON_INVALID_PARAMETER: '입력값을 확인해주세요.',
  AUTHENTICATION_REQUIRED: '로그인이 필요합니다. 다시 로그인해주세요.',
  AUTH_GOOGLE_CODE_INVALID: 'Google 로그인 정보를 확인할 수 없습니다. 다시 로그인해주세요.',
  AUTH_GOOGLE_ID_TOKEN_INVALID: 'Google 로그인 정보를 확인할 수 없습니다. 다시 로그인해주세요.',
  AUTH_REFRESH_TOKEN_INVALID: '로그인 세션이 만료되었습니다. 다시 로그인해주세요.',
  CSRF_HEADER_REQUIRED: '요청을 확인할 수 없습니다. 다시 시도해주세요.',
  AUTH_CSRF_HEADER_REQUIRED: '요청을 확인할 수 없습니다. 다시 시도해주세요.',
  USER_SUSPENDED: '이용이 제한된 계정입니다.',
  USER_WITHDRAWN: '탈퇴 처리된 계정입니다.',
  AI_ITINERARY_GENERATION_LIMIT_EXCEEDED: 'AI 일정 생성 가능 횟수를 모두 사용했습니다.',
  SCHEDULE_AI_ITINERARY_GENERATION_LIMIT_EXCEEDED: 'AI 일정 생성 가능 횟수를 모두 사용했습니다.',
  SCHEDULE_FIXED_ITINERARY_ITEM: '공연 일정은 수정하거나 삭제할 수 없습니다.',
  SCHEDULE_INVALID_ACCOMMODATION: '숙소 정보 또는 숙박 기간이 올바르지 않습니다.',
  CHAT_ROOM_NOT_FOUND: '채팅방을 찾을 수 없습니다.',
  CHAT_FORBIDDEN: '이 채팅방에 접근할 권한이 없습니다.',
  CHAT_INVALID_MESSAGE: '메시지 또는 읽음 대상을 확인해주세요.',
  CHAT_INVALID_COMMENT: '동행 참여자로 채택할 수 없는 댓글입니다.',
  CHAT_CAPACITY_REACHED: '모집 정원이 모두 찼습니다.',
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
