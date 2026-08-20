import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createAiGenerationSuccessFixture } from '@/features/ai-schedule/fixtures/ai-generation-fixture';
import type { AiGenerationInput } from '@/features/ai-schedule/model/ai-generation';
import { AiGenerationScreen } from '@/features/ai-schedule/ui/ai-generation-screen';

const { push } = vi.hoisted(() => ({ push: vi.fn() }));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ back: vi.fn(), push }),
}));

const input: AiGenerationInput = {
  tripId: 'draft',
  concertId: 'concert-summer-wave',
  tripStartDate: '2026-08-22',
  targetDate: '2026-08-23',
};

describe('AiGenerationScreen', () => {
  beforeEach(() => push.mockReset());

  it('retries with the exact same single-date input', async () => {
    const user = userEvent.setup();
    const service = vi.fn().mockResolvedValue(createAiGenerationSuccessFixture(input));
    render(<AiGenerationScreen input={input} preview='failure' service={service} />);

    await user.click(screen.getByRole('button', { name: '재시도하기' }));

    await waitFor(() => expect(service).toHaveBeenCalledWith(input, 'success'));
    expect(service).toHaveBeenCalledTimes(1);
    expect(await screen.findByText('8월 23일 (2일차)')).toBeInTheDocument();
  });

  it('returns to Step 1 from the failure state', async () => {
    const user = userEvent.setup();
    render(<AiGenerationScreen input={input} preview='failure' />);

    await user.click(screen.getByRole('button', { name: '입력값 다시 수정하기' }));
    expect(push).toHaveBeenCalledWith('/trips/new');
  });

  it('opens the generated target date after confirmation', async () => {
    const user = userEvent.setup();
    render(<AiGenerationScreen input={input} preview='success' />);

    expect(screen.getByText('일정이 생성되었습니다!')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '확인' }));

    expect(push).toHaveBeenCalledWith(
      '/trips/draft/days/2026-08-23?concertId=concert-summer-wave&source=ai'
    );
  });
});
