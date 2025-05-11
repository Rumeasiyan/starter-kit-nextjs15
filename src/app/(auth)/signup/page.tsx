'use client';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { signIn, signUp, useSession } from '@/lib/auth/auth-client';
import Loading from '@/app/_components/global/Loading';
import { triggerToast } from '@/helpers/triggerToast';

const Signup = dynamic(() => import('@/app/(auth)/signup/SignupPage'), {
  loading: () => <Loading />,
  ssr: false,
});

export default function SignupPage() {
  const { data } = useSession();
  const [signupFormData, setSignupFormData] = useState({
    image: '',
    email: '',
    name: '',
    password: '',
    confirmPassword: '',
  });
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (data?.user) {
      router.push('/dashboard');
    }
  }, [data, router]);

  const handleSignup = async () => {
    setIsLoading(true);
    const { data, error } = await signUp.email({
      email: signupFormData.email, // user email address
      password: signupFormData.password, // user password -> min 8 characters by default
      name: signupFormData.name, // user display name
      image: signupFormData.image, // User image URL (optional)
      callbackURL: '/dashboard', // A URL to redirect to after the user verifies their email (optional)
    });

    if (error) {
      console.log(error);
      triggerToast(error.message || 'Something went wrong', 'error');
    }

    if (data) {
      triggerToast('Signup successful', 'success');
      router.push(`/verify-email?email=${signupFormData.email}`);
    }
    setIsLoading(false);
  };

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    const { data, error } = await signIn.social({
      provider: 'google',
    });

    if (error) {
      console.log(error);
      triggerToast(error.message || 'Something went wrong', 'error');
    }

    if (data) {
      triggerToast('Signup successful', 'success');
      router.push(`/verify-email?email=${signupFormData.email}`);
    }
    setIsLoading(false);
  };

  const handleGithubSignup = async () => {
    setIsLoading(true);
    const { data, error } = await signIn.social({
      provider: 'github',
    });

    if (error) {
      console.log(error);
      triggerToast(error.message || 'Something went wrong', 'error');
    }

    if (data) {
      triggerToast('Signup successful', 'success');
      router.push(`/verify-email?email=${signupFormData.email}`);
    }
    setIsLoading(false);
  };

  return (
    <Suspense fallback={<Loading />}>
      <Signup
        handleSignup={handleSignup}
        handleGoogleSignup={handleGoogleSignup}
        handleGithubSignup={handleGithubSignup}
        signupFormData={signupFormData}
        setSignupFormData={setSignupFormData}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />
    </Suspense>
  );
}
