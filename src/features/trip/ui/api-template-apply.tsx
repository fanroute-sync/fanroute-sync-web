'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { ErrorState, Loading } from '@/components/common';
import { Button } from '@/components/ui';
import { concertKeys, getConcert } from '@/features/trip-create/api/concert-service';
import { listVenueItineraryTemplates, venueTemplateKeys } from '@/features/trip-create/api/venue-template-service';
import { createItineraryItemsFromTemplate, tripPlanKeys } from '@/features/trip/api/trip-plan-service';
import { getApiErrorMessage } from '@/lib/api/error-message';

export function ApiTemplateApply({ concertId, dayId, tripId, date }: { concertId: number; dayId: number; tripId: number; date: string }) {
  const client = useQueryClient();
  const concert = useQuery({ queryKey: concertKeys.detail(concertId), queryFn: () => getConcert(concertId) });
  const venueId = typeof concert.data?.venueId === 'number' ? concert.data.venueId : undefined;
  const templates = useQuery({ queryKey: venueTemplateKeys.list(venueId ?? 0), queryFn: () => listVenueItineraryTemplates(venueId ?? 0), enabled: venueId !== undefined });
  const apply = useMutation({ mutationFn: (templateId: number) => createItineraryItemsFromTemplate(dayId, templateId), onSuccess: async () => { await client.invalidateQueries({ queryKey: tripPlanKeys.day(tripId, date) }); toast.success('추천 일정을 적용했어요.'); }, onError: (error) => toast.error(getApiErrorMessage(error, '추천 일정을 적용하지 못했어요.')) });
  return <section className='space-y-3'><h3 className='font-semibold'>공연일 추천 일정 적용</h3>
    {concert.isPending || (venueId !== undefined && templates.isPending) ? <Loading /> : concert.isError || templates.isError ? <ErrorState onRetry={() => { void concert.refetch(); void templates.refetch(); }} /> : venueId === undefined ? <p className='text-sm text-gray-500'>공연장 정보가 없어요.</p> : templates.data?.length === 0 ? <p className='text-sm text-gray-500'>등록된 추천 일정이 없어요.</p> : <ul className='space-y-2'>{templates.data?.map((template) => <li key={template.id} className='rounded-xl border p-3'><strong>{template.name}</strong>{template.description ? <p className='text-sm text-gray-600'>{template.description}</p> : null}<Button size='sm' className='mt-2' disabled={apply.isPending} onClick={() => apply.mutate(template.id)}>일정에 적용</Button></li>)}</ul>}
  </section>;
}
