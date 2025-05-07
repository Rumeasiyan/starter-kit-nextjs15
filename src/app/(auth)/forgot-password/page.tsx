'use client';

import dynamic from 'next/dynamic';
import Loading from '@/app/_components/global/Loading';
import { useEffect, useState, useCallback } from 'react';
import { forgetPassword, useSession } from '@/lib/auth/auth-client';
import { useRouter } from 'next/navigation';

const ForgotPassword = dynamic(
  () => import('@/app/(auth)/forgot-password/ForgotPasswordPage'),
  {
    loading: () => <Loading />,
  }
);

export default function VerifyEmailPage() {
  const [email, setEmail] = useState<string>('');
  const { data } = useSession();
  const router = useRouter();
  const [isForgotPasswordSent, setIsForgotPasswordSent] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleForgotPassword = useCallback(async () => {
    setIsLoading(true);
    await forgetPassword({
      email: email,
      redirectTo: '/reset-password',
    });
    setIsForgotPasswordSent(true);
    setIsLoading(false);
  }, [email]);

  useEffect(() => {
    if (data?.user) {
      router.push('/');
    }
  }, [data, router]);

  return (
    <ForgotPassword
      isForgotPasswordSent={isForgotPasswordSent}
      handleForgotPassword={handleForgotPassword}
      email={email}
      setEmail={setEmail}
      isLoading={isLoading}
    />
  );
}
