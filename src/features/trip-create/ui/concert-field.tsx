import { CalendarDays, Check, MapPin } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Card, SearchInput } from '@/components/ui';
import type { ConcertOption } from '@/features/trip-create/model/trip-form';

interface ConcertFieldProps {
  concerts: ConcertOption[];
  selectedId: string;
  onSelect: (concertId: string) => void;
  error?: string;
}

export function ConcertField({ concerts, selectedId, onSelect, error }: ConcertFieldProps) {
  const [query, setQuery] = useState('');
  const filteredConcerts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return concerts;
    return concerts.filter((concert) =>
      `${concert.name} ${concert.venue}`.toLowerCase().includes(normalizedQuery)
    );
  }, [concerts, query]);

  return (
    <fieldset>
      <legend className='mb-2 text-sm font-semibold text-gray-900'>관람할 공연</legend>
      <SearchInput
        aria-label='공연명 또는 공연장 검색'
        placeholder='공연명 또는 공연장을 검색하세요'
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onClear={() => setQuery('')}
      />
      <div className='mt-3 space-y-2'>
        {filteredConcerts.length > 0 ? filteredConcerts.map((concert) => {
          const selected = concert.id === selectedId;
          return (
            <button key={concert.id} type='button' className='block w-full rounded-2xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500' onClick={() => onSelect(concert.id)}>
              <Card className={`flex items-start gap-3 shadow-none ${selected ? 'border-violet-600 bg-violet-50' : ''}`}>
                <div className='min-w-0 flex-1'>
                  <p className='font-semibold text-gray-950'>{concert.name}</p>
                  <p className='mt-2 flex items-center gap-1.5 text-sm text-gray-600'><CalendarDays aria-hidden='true' size={15} />{concert.date} · {concert.time}</p>
                  <p className='mt-1 flex items-center gap-1.5 text-sm text-gray-600'><MapPin aria-hidden='true' size={15} />{concert.venue}</p>
                </div>
                <span className={`mt-1 grid size-6 shrink-0 place-items-center rounded-full border ${selected ? 'border-violet-600 bg-violet-600 text-white' : 'border-gray-300'}`}>
                  {selected ? <Check aria-hidden='true' size={14} strokeWidth={3} /> : null}
                </span>
              </Card>
            </button>
          );
        }) : <p className='rounded-xl bg-gray-50 px-4 py-8 text-center text-sm text-gray-500'>검색 결과가 없습니다.</p>}
      </div>
      {error ? <p className='mt-2 text-sm text-red-600'>{error}</p> : null}
    </fieldset>
  );
}
