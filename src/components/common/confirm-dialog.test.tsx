import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ConfirmDialog } from './confirm-dialog';

describe('ConfirmDialog', () => {
  it('calls confirm and close handlers', () => {
    const onConfirm = vi.fn();
    const onOpenChange = vi.fn();

    render(
      <ConfirmDialog
        open
        title='일정을 삭제할까요?'
        description='삭제한 일정은 복구할 수 없습니다.'
        confirmLabel='삭제'
        onConfirm={onConfirm}
        onOpenChange={onOpenChange}
      />
    );

    expect(screen.getByRole('alertdialog')).toHaveAccessibleName('일정을 삭제할까요?');
    fireEvent.click(screen.getByRole('button', { name: '삭제' }));
    expect(onConfirm).toHaveBeenCalledOnce();

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('does not close while a confirmation is loading', () => {
    const onOpenChange = vi.fn();

    render(
      <ConfirmDialog open title='저장 중' loading onConfirm={vi.fn()} onOpenChange={onOpenChange} />
    );

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onOpenChange).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: '처리 중...' })).toBeDisabled();
  });
});
