'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';

interface AppLogoProps {
  className?: string;
}

export const AppLogo = ({ className }: AppLogoProps) => {
  return (
    <Link
      href="/"
      className={cn('mb-8 flex items-center space-x-2', className)}
    >
      <span className="text-xl font-bold">
        {process.env.NEXT_PUBLIC_APP_NAME}
      </span>
    </Link>
  );
};
