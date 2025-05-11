'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import Loading from '@/app/_components/global/Loading';
import { useEffect, useState, useCallback } from 'react';
import { resetPassword, useSession } from '@/lib/auth/auth-client';
import { useRouter, useSearchParams } from 'next/navigation';
import { triggerToast } from '@/helpers/triggerToast';

const ResetPassword = dynamic(
  () => import('@/app/(auth)/reset-password/ResetPasswordPage'),
  {
    loading: () => <Loading />,
  }
);

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ResetPasswordContent />
    </Suspense>
  );
}

function ResetPasswordContent() {
  const [token, setToken] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const { data } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleResetPassword = useCallback(async () => {
    if (password !== confirmPassword) {
      triggerToast('Passwords do not match', 'error');
      return;
    }

    setIsLoading(true);
    const { data, error } = await resetPassword({
      newPassword: password,
      token: token,
    });

    if (error) {
      triggerToast(error.message || 'Something went wrong', 'error');
      setIsLoading(false);
      return;
    }

    if (data) {
      triggerToast('Password reset successfully', 'success');
      router.push('/login');
    }
    setIsLoading(false);
  }, [token, password, confirmPassword, router]);

  useEffect(() => {
    if (searchParams.get('token')) {
      setToken(searchParams.get('token') || '');
    } else {
      triggerToast('Invalid token', 'error');
      router.push('/');
    }
  }, [data, router, searchParams]);

  return (
    <ResetPassword
      handleResetPassword={handleResetPassword}
      password={password}
      setPassword={setPassword}
      confirmPassword={confirmPassword}
      setConfirmPassword={setConfirmPassword}
      isLoading={isLoading}
    />
  );
}
