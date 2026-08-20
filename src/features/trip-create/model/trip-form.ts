import { z } from 'zod';

export const TIME_PERIODS = ['MORNING', 'AFTERNOON', 'EVENING'] as const;
export type TimePeriod = (typeof TIME_PERIODS)[number];

export const TIME_PERIOD_LABELS: Record<TimePeriod, string> = {
  MORNING: '아침',
  AFTERNOON: '점심',
  EVENING: '저녁',
};

const timePeriodOrder: Record<TimePeriod, number> = {
  MORNING: 0,
  AFTERNOON: 1,
  EVENING: 2,
};

export interface ConcertOption {
  id: string;
  name: string;
  venue: string;
  date: string;
  time: string;
}

const tripFormFields = z.object({
  arrivalDate: z.string().min(1, '부산 도착 날짜를 선택해주세요.'),
  arrivalPeriod: z.enum(TIME_PERIODS, { message: '도착 시간대를 선택해주세요.' }),
  departureDate: z.string().min(1, '부산 출발 날짜를 선택해주세요.'),
  departurePeriod: z.enum(TIME_PERIODS, { message: '출발 시간대를 선택해주세요.' }),
  concertId: z.string().min(1, '관람할 공연을 선택해주세요.'),
});

export type TripFormValues = z.infer<typeof tripFormFields>;

export function createTripFormSchema(concerts: ConcertOption[]) {
  return tripFormFields.superRefine((values, context) => {
    if (!values.arrivalDate || !values.departureDate) return;

    if (values.departureDate < values.arrivalDate) {
      context.addIssue({
        code: 'custom',
        path: ['departureDate'],
        message: '출발일은 도착일보다 이전일 수 없어요.',
      });
      return;
    }

    if (
      values.departureDate === values.arrivalDate &&
      timePeriodOrder[values.departurePeriod] <= timePeriodOrder[values.arrivalPeriod]
    ) {
      context.addIssue({
        code: 'custom',
        path: ['departurePeriod'],
        message: '같은 날짜에는 출발 시간이 도착 시간보다 이후여야 해요.',
      });
    }

    const concert = concerts.find((item) => item.id === values.concertId);
    if (concert && (concert.date < values.arrivalDate || concert.date > values.departureDate)) {
      context.addIssue({
        code: 'custom',
        path: ['concertId'],
        message: '여행 기간 안에 열리는 공연을 선택해주세요.',
      });
    }
  });
}
