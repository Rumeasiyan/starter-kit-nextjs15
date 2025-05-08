'use client';

import Loading from '@/app/_components/global/Loading';
import React from 'react';
import dynamic from 'next/dynamic';

const PageContainer = dynamic(
  () => import('@/app/_components/layouts/PageContainer'),
  {
    loading: () => <Loading />,
  }
);

const DashboardPage = dynamic(() => import('./DashboardPage'), {
  loading: () => <Loading />,
});

const Page = () => {
  return (
    <PageContainer>
      <DashboardPage />
    </PageContainer>
  );
};

export default Page;
