import { VerifyForm } from '@/app/_components/features/auth/VerifyForm';
import { AuthLayout } from '@/app/_components/layouts/auth/AuthLayout';
import { AppLogo } from '@/app/_components/icons/AppLogo';

interface VerifyEmailProps {
  email: string;
  setEmail: (email: string) => void;
  handleVerifyEmail: () => void;
  isVerificationEmailSent: boolean;
}

export default function VerifyEmail({
  email,
  setEmail,
  handleVerifyEmail,
  isVerificationEmailSent,
}: VerifyEmailProps) {
  return (
    <AuthLayout
      logo={<AppLogo />}
      title={`Verify Email`}
      description="Enter your email below to verify your account"
    >
      {isVerificationEmailSent ? (
        <div className="flex h-full flex-col items-center justify-center rounded-md bg-green-100 p-4">
          <h1 className="text-md font-bold">Verification Email Sent</h1>
          <p className="text-muted-foreground text-sm">
            Please check your email for a verification link.
          </p>
        </div>
      ) : (
        <VerifyForm
          handleSubmit={handleVerifyEmail}
          email={email}
          setEmail={setEmail}
        />
      )}
    </AuthLayout>
  );
}
