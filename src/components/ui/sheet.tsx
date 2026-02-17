import * as React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { cn } from '@/lib/utils';

export const Sheet = Dialog.Root;
export const SheetTrigger = Dialog.Trigger;

type Side = 'bottom' | 'right' | 'left' | 'top';

const sideStyles: Record<Side, string> = {
  bottom:
    'inset-x-0 bottom-0 rounded-t-3xl border-t data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom',
  right:
    'inset-y-0 right-0 w-[420px] max-w-full border-l data-[state=open]:animate-in data-[state=open]:slide-in-from-right',
  left:
    'inset-y-0 left-0 w-[320px] max-w-full border-r data-[state=open]:animate-in data-[state=open]:slide-in-from-left',
  top:
    'inset-x-0 top-0 rounded-b-3xl border-b data-[state=open]:animate-in data-[state=open]:slide-in-from-top',
};

export const SheetContent = ({
  side = 'bottom',
  className,
  children,
}: {
  side?: Side;
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-50 bg-black/30 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=open]:fade-in" />
      <Dialog.Content
        className={cn(
          'fixed z-50 bg-[var(--color-bg-elev)] border-[var(--color-line)] p-4 shadow-xl flex flex-col gap-3 max-h-[90vh] overflow-y-auto scrollbar-thin',
          sideStyles[side],
          className,
        )}
      >
        {children}
      </Dialog.Content>
    </Dialog.Portal>
  );
};

export const SheetTitle = Dialog.Title;
export const SheetDescription = Dialog.Description;
export const SheetClose = Dialog.Close;
