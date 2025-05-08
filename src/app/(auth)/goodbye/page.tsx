'use client';

import dynamic from 'next/dynamic';
import Loading from '@/app/_components/global/Loading';

const AccountDeletedPage = dynamic(
  () => import('@/app/(auth)/goodbye/GoodByePage'),
  {
    loading: () => <Loading />,
  }
);

export default function GoodbyePage() {
  return <AccountDeletedPage />;
}
