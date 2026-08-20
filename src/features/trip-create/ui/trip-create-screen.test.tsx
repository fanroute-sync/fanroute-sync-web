import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { TripCreateScreen } from '@/features/trip-create/ui/trip-create-screen';

const { push } = vi.hoisted(() => ({ push: vi.fn() }));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ back: vi.fn(), push }),
}));

async function completeTripForm() {
  const user = userEvent.setup();
  render(<TripCreateScreen />);

  fireEvent.change(screen.getByLabelText('부산 도착 날짜'), { target: { value: '2026-08-22' } });
  fireEvent.change(screen.getByLabelText('부산 출발 날짜'), { target: { value: '2026-08-24' } });
  await user.click(screen.getByRole('button', { name: /SUMMER WAVE in BUSAN/ }));
  await user.click(screen.getByRole('button', { name: '다음' }));

  return user;
}

describe('TripCreateScreen recommendation flow', () => {
  beforeEach(() => push.mockReset());

  it('routes recommendation yes to AI generation without implementing the Phase 5 screen', async () => {
    const user = await completeTripForm();
    await user.click(screen.getByRole('button', { name: /예, 추천받을게요/ }));

    expect(push).toHaveBeenCalledWith(
      '/trips/draft/ai-generating?concertId=concert-summer-wave&tripStartDate=2026-08-22'
    );
  });

  it('routes recommendation no directly to the empty day itinerary', async () => {
    const user = await completeTripForm();
    await user.click(screen.getByRole('button', { name: /아니오, 직접 구성할게요/ }));

    expect(push).toHaveBeenCalledWith(
      '/trips/draft/days/2026-08-23?concertId=concert-summer-wave&tripStartDate=2026-08-22'
    );
  });
});
