'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const dialogPanelVariants = cva(
  'bg-background/95 fixed z-50 overflow-hidden border shadow-lg backdrop-blur-xl transition-all duration-300 ease-in-out',
  {
    variants: {
      position: {
        center:
          'top-1/2 left-1/2 max-h-[90vh] -translate-x-1/2 -translate-y-1/2 rounded-xl',
        right: 'inset-y-0 right-0 h-full max-w-[95vw] rounded-l-xl',
        left: 'inset-y-0 left-0 h-full max-w-[95vw] rounded-r-xl',
        bottom: 'inset-x-0 bottom-0 max-h-[90vh] w-full rounded-t-xl',
        top: 'inset-x-0 top-0 max-h-[90vh] w-full rounded-b-xl',
      },
      size: {
        sm: 'w-[400px]',
        default: 'w-[500px]',
        lg: 'w-[600px]',
        xl: 'w-[800px]',
        full: 'w-[95vw]',
      },
    },
    defaultVariants: {
      position: 'center',
      size: 'default',
    },
  }
);

export interface DialogPanelProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof dialogPanelVariants> {
  open?: boolean;
  onClose?: () => void;
}

const DialogPanel = React.forwardRef<HTMLDivElement, DialogPanelProps>(
  ({ className, children, position, size, open, onClose, ...props }, ref) => {
    // Handle ESC key to close the dialog
    React.useEffect(() => {
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && onClose) {
          onClose();
        }
      };

      if (open) {
        document.addEventListener('keydown', handleEsc);
        // Prevent scrolling on the body when dialog is open
        document.body.style.overflow = 'hidden';
      }

      return () => {
        document.removeEventListener('keydown', handleEsc);
        document.body.style.overflow = '';
      };
    }, [open, onClose]);

    if (!open) return null;

    return (
      <>
        <button
          type="button"
          className="bg-background/80 fixed inset-0 z-40 backdrop-blur-sm transition-opacity duration-300"
          onClick={onClose}
          style={{
            opacity: open ? 1 : 0,
            pointerEvents: open ? 'auto' : 'none',
          }}
        />
        <div
          className={cn(
            dialogPanelVariants({ position, size }),
            'animate-in fade-in zoom-in-95 duration-300',
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </div>
      </>
    );
  }
);
DialogPanel.displayName = 'DialogPanel';

const DialogPanelHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { onClose?: () => void }
>(({ className, onClose, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex items-center justify-between border-b px-6 py-4',
      className
    )}
    {...props}
  >
    <div className="flex-1">{props.children}</div>
    {onClose && (
      <button
        onClick={onClose}
        className="text-foreground/70 hover:bg-muted hover:text-foreground rounded-full p-1.5 transition-colors duration-200"
      >
        <X className="h-5 w-5" />
        <span className="sr-only">Close</span>
      </button>
    )}
  </div>
));
DialogPanelHeader.displayName = 'DialogPanelHeader';

const DialogPanelBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex-1 overflow-auto', className)}
    {...props}
  />
));
DialogPanelBody.displayName = 'DialogPanelBody';

const DialogPanelFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('border-t px-6 py-4', className)}
    {...props}
  />
));
DialogPanelFooter.displayName = 'DialogPanelFooter';

export { DialogPanel, DialogPanelHeader, DialogPanelBody, DialogPanelFooter };
