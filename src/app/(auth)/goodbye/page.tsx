'use client';

import dynamic from 'next/dynamic';
import Loading from '@/app/_components/global/Loading';
import { Suspense } from 'react';

const AccountDeletedPage = dynamic(
  () => import('@/app/(auth)/goodbye/GoodByePage'),
  {
    loading: () => <Loading />,
    ssr: false,
  }
);

export default function GoodbyePage() {
  return (
    <Suspense fallback={<Loading />}>
      <AccountDeletedPage />
    </Suspense>
  );
}
