'use client';

import type { JSX, ReactNode } from 'react';

interface ProvidersProps {
  children: ReactNode;
}

export async function Providers({
  children,
}: ProvidersProps): Promise<JSX.Element> {
  return <>{children}</>;
}
