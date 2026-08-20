import { differenceInCalendarDays, format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';

export interface AiGenerationInput {
  tripId: string;
  targetDate: string;
  tripStartDate: string;
  concertId: string;
}

export interface AiUsageSnapshot {
  used: number;
  limit: number;
  remaining: number;
}

export interface AiGenerationResult {
  itineraryId: string;
  targetDate: string;
  dayNumber: number;
  usage: AiUsageSnapshot;
}

export type AiGenerationPreview = 'auto' | 'loading' | 'failure' | 'success';
export type AiGenerationViewState =
  | { status: 'loading' }
  | { status: 'failure' }
  | { status: 'success'; result: AiGenerationResult };

export function calculateDayNumber(tripStartDate: string, targetDate: string) {
  return differenceInCalendarDays(parseISO(targetDate), parseISO(tripStartDate)) + 1;
}

export function formatScheduleDate(targetDate: string) {
  return format(parseISO(targetDate), 'M월 d일', { locale: ko });
}
