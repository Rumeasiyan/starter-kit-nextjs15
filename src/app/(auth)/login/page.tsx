'use client';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { signIn, useSession } from '@/lib/auth/auth-client';
import Loading from '@/app/_components/global/Loading';
import { triggerToast } from '@/app/helpers/triggerToast';

const Login = dynamic(() => import('@/app/(auth)/login/LoginPage'), {
  loading: () => <Loading />,
});

export default function LoginPage() {
  const { data } = useSession();
  const [loginFormData, setLoginFormData] = useState({
    email: '',
    password: '',
  });
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (data?.user) {
      router.push('/dashboard');
    }
  }, [data, router]);

  const handleLogin = async () => {
    setIsLoading(true);
    const { data, error } = await signIn.email({
      email: loginFormData.email, // user email address
      password: loginFormData.password, // user password -> min 8 characters by default
      callbackURL: '/dashboard', // A URL to redirect to after the user verifies their email (optional)
    });

    if (error) {
      console.log(error);
      if (error.status === 403) {
        router.push(`/verify-email?email=${loginFormData.email}`);
        triggerToast('Please verify your email to continue', 'success');
        return;
      }
      triggerToast(error.message || 'Something went wrong', 'error');
    }

    if (data) {
      triggerToast('Login successful', 'success');
      router.push('/dashboard');
    }
    setIsLoading(false);
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    const { data, error } = await signIn.social({
      provider: 'google',
    });

    if (error) {
      console.log(error);
      if (error.status === 403) {
        router.push(`/verify-email?email=${loginFormData.email}`);
        triggerToast('Please verify your email to continue', 'success');
        return;
      }
      triggerToast(error.message || 'Something went wrong', 'error');
    }

    if (data) {
      triggerToast('Login successful', 'success');
      router.push('/dashboard');
    }
    setIsLoading(false);
  };

  const handleGithubLogin = async () => {
    setIsLoading(true);
    const { data, error } = await signIn.social({
      provider: 'github',
    });

    if (error) {
      console.log(error);
      if (error.status === 403) {
        router.push(`/verify-email?email=${loginFormData.email}`);
        triggerToast('Please verify your email to continue', 'success');
        return;
      }
      triggerToast(error.message || 'Something went wrong', 'error');
    }

    if (data) {
      triggerToast('Login successful', 'success');
      router.push('/dashboard');
    }
    setIsLoading(false);
  };

  return (
    <Login
      handleLogin={handleLogin}
      handleGoogleLogin={handleGoogleLogin}
      handleGithubLogin={handleGithubLogin}
      loginFormData={loginFormData}
      setLoginFormData={setLoginFormData}
      isLoading={isLoading}
      setIsLoading={setIsLoading}
    />
  );
}
