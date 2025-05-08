'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import Loading from '@/app/_components/global/Loading';
import { useEffect, useState, useCallback } from 'react';
import { sendVerificationEmail, useSession } from '@/lib/auth/auth-client';
import { useRouter, useSearchParams } from 'next/navigation';

const VerifyEmail = dynamic(
  () => import('@/app/(auth)/verify-email/VerifyEmailPage'),
  {
    loading: () => <Loading />,
  }
);

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<Loading />}>
      <VerifyEmailContent />
    </Suspense>
  );
}

function VerifyEmailContent() {
  const [email, setEmail] = useState<string>('');
  const { data } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isVerificationEmailSent, setIsVerificationEmailSent] =
    useState<boolean>(false);

  const handleVerifyEmail = useCallback(async () => {
    await sendVerificationEmail({
      email: email,
      callbackURL: '/dashboard',
    });
    setIsVerificationEmailSent(true);
  }, [email]);

  useEffect(() => {
    if (data?.user) {
      router.push('/dashboard');
    }
    if (searchParams.get('email')) {
      setEmail(searchParams.get('email') || '');
      handleVerifyEmail();
    }
  }, [data, router, searchParams, handleVerifyEmail]);

  return (
    <VerifyEmail
      isVerificationEmailSent={isVerificationEmailSent}
      handleVerifyEmail={handleVerifyEmail}
      email={email}
      setEmail={setEmail}
    />
  );
}
