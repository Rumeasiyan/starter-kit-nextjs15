'use client';

import Loading from '@/app/_components/global/Loading';
import dynamic from 'next/dynamic';
import React, { Suspense } from 'react';

const PageContainer = dynamic(
  () => import('@/app/_components/layouts/PageContainer'),
  {
    loading: () => <Loading />,
    ssr: false,
  }
);

const DashboardPage = dynamic(() => import('./DashboardPage'), {
  loading: () => <Loading />,
  ssr: false,
});

const Page = () => {
  return (
    <Suspense fallback={<Loading />}>
      <PageContainer>
        <DashboardPage />
      </PageContainer>
    </Suspense>
  );
};

export default Page;
