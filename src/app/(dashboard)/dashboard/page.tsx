'use client';

import Loading from '@/app/_components/global/Loading';
import { signOut } from '@/lib/auth/auth-client';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();

  const handleSignOut = () => {
    signOut();
    router.push('/login');
  };

  return (
    <PageContainer>
      <DashboardPage signOut={handleSignOut} />
    </PageContainer>
  );
};

export default Page;
