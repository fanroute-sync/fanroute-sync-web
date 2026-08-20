import {
  calculateDayNumber,
  type AiGenerationInput,
  type AiGenerationResult,
} from '@/features/ai-schedule/model/ai-generation';

export type AiGenerationFixtureOutcome = 'success' | 'failure';
export type AiGenerationService = (
  input: AiGenerationInput,
  outcome?: AiGenerationFixtureOutcome
) => Promise<AiGenerationResult>;

export function createAiGenerationSuccessFixture(input: AiGenerationInput): AiGenerationResult {
  return {
    itineraryId: `fixture-${input.targetDate}`,
    targetDate: input.targetDate,
    dayNumber: calculateDayNumber(input.tripStartDate, input.targetDate),
    usage: {
      used: 2,
      limit: 5,
      remaining: 3,
    },
  };
}

/** API 계약 확정 전 상태 확인용 fixture. 네트워크 요청이나 사용 횟수 변경을 수행하지 않는다. */
export const generateAiScheduleFixture: AiGenerationService = async (input, outcome = 'success') => {
  await new Promise((resolve) => window.setTimeout(resolve, 800));

  if (outcome === 'failure') {
    throw new Error('AI_GENERATION_FAILED');
  }

  return createAiGenerationSuccessFixture(input);
};
