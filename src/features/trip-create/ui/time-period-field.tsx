import { Chip } from '@/components/ui';
import { TIME_PERIODS, TIME_PERIOD_LABELS, type TimePeriod } from '@/features/trip-create/model/trip-form';

interface TimePeriodFieldProps {
  legend: string;
  value: TimePeriod;
  onChange: (value: TimePeriod) => void;
  error?: string;
}

export function TimePeriodField({ legend, value, onChange, error }: TimePeriodFieldProps) {
  return (
    <fieldset>
      <legend className='mb-2 text-sm font-semibold text-gray-900'>{legend}</legend>
      <div className='grid grid-cols-3 gap-2'>
        {TIME_PERIODS.map((period) => (
          <Chip key={period} selected={value === period} onClick={() => onChange(period)}>
            {TIME_PERIOD_LABELS[period]}
          </Chip>
        ))}
      </div>
      {error ? <p className='mt-2 text-sm text-red-600'>{error}</p> : null}
    </fieldset>
  );
}
