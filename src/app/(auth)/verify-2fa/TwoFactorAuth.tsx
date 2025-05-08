'use client';

import { TwoFactorAuthForm } from '@/app/_components/features/auth/TwoFactorAuthForm';
import { AuthLayout } from '@/app/_components/layouts/auth/AuthLayout';
import { AppLogo } from '@/app/_components/icons/AppLogo';

interface TwoFactorAuthProps {
  email: string;
}

export default function TwoFactorAuth({ email }: TwoFactorAuthProps) {
  return (
    <AuthLayout
      logo={<AppLogo />}
      title="Two-Factor Authentication"
      description="Enter the verification code sent to your email"
    >
      <TwoFactorAuthForm email={email} />
    </AuthLayout>
  );
}
