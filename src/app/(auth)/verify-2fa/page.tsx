'use client';

import dynamic from 'next/dynamic';
import Loading from '@/app/_components/global/Loading';
import { useSession } from '@/lib/auth/auth-client';
import { triggerToast } from '@/helpers/triggerToast';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const TwoFactorAuth = dynamic(
  () => import('@/app/(auth)/verify-2fa/TwoFactorAuth'),
  {
    loading: () => <Loading />,
  }
);

export default function TwoFactorAuthPage() {
  const { data } = useSession();
  const router = useRouter();

  useEffect(() => {
    console.log('data', data?.user?.email);
    if (!data?.user?.email) {
      triggerToast('No email found', 'error');
      // router.push('/login');
    }
  }, [data, router]);

  if (!data?.user?.email) {
    return null;
  }

  return <TwoFactorAuth email={data.user.email} />;
}
