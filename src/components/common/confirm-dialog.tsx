'use client';

import { X } from 'lucide-react';
import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

import { Button, type ButtonProps } from '@/components/ui/button';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: ButtonProps['variant'];
  loading?: boolean;
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = '확인',
  cancelLabel = '취소',
  confirmVariant = 'primary',
  loading = false,
  onConfirm,
  onOpenChange,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const previousActiveElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const frame = requestAnimationFrame(() => dialogRef.current?.focus());

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && !loading) onOpenChange(false);

      if (event.key !== 'Tab' || !dialogRef.current) return;

      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      const first = focusable.item(0);
      const last = focusable.item(focusable.length - 1);

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousActiveElement?.focus();
    };
  }, [loading, onOpenChange, open]);

  if (!open || typeof document === 'undefined') return null;

  return createPortal(
    <div
      className='fixed inset-0 z-50 flex items-end justify-center bg-black/45 p-4 sm:items-center'
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !loading) onOpenChange(false);
      }}
    >
      <div
        ref={dialogRef}
        role='alertdialog'
        aria-modal='true'
        aria-labelledby='confirm-dialog-title'
        aria-describedby={description ? 'confirm-dialog-description' : undefined}
        tabIndex={-1}
        className='relative w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl outline-none'
      >
        <button
          type='button'
          aria-label='대화상자 닫기'
          disabled={loading}
          onClick={() => onOpenChange(false)}
          className='absolute right-3 top-3 flex size-9 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 disabled:opacity-50'
        >
          <X aria-hidden='true' className='size-5' />
        </button>
        <h2 id='confirm-dialog-title' className='pr-9 text-lg font-bold text-gray-950'>
          {title}
        </h2>
        {description ? (
          <div id='confirm-dialog-description' className='mt-2 text-sm leading-6 text-gray-600'>
            {description}
          </div>
        ) : null}
        <div className='mt-6 flex gap-2'>
          <Button variant='outline' fullWidth disabled={loading} onClick={() => onOpenChange(false)}>
            {cancelLabel}
          </Button>
          <Button variant={confirmVariant} fullWidth disabled={loading} onClick={onConfirm}>
            {loading ? '처리 중...' : confirmLabel}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}
