import type { ReactNode } from 'react';

export interface GlobalDialogProps {
  isOpen: boolean;
  alertDialogClassNames?: string;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children?: ReactNode;
  primaryButton?: {
    text: string;
    type?: 'button' | 'submit' | 'reset';
    onClick: () => void;
    isDisabled?: boolean;
    className?: string;
  };
  secondaryButton?: {
    text: string;
    type?: 'button' | 'submit' | 'reset';
    onClick: () => void;
    isDisabled?: boolean;
    className?: string;
  };
  dialogFooterClassNames?: string;
}
