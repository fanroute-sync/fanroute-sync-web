import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Tabs } from './tabs';

describe('Tabs', () => {
  it('exposes selection and reports tab changes', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <Tabs
        ariaLabel='게시글 유형'
        items={[
          { value: 'all', label: '전체' },
          { value: 'info', label: '정보 공유' },
        ]}
        value='all'
        onValueChange={onValueChange}
      />
    );

    expect(screen.getByRole('tab', { name: '전체' })).toHaveAttribute('aria-selected', 'true');
    await user.click(screen.getByRole('tab', { name: '정보 공유' }));
    expect(onValueChange).toHaveBeenCalledWith('info');
  });
});
