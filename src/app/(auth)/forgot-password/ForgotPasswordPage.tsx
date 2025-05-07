import { AuthLayout } from '@/app/_components/layouts/auth/AuthLayout';
import { AppLogo } from '@/app/_components/icons/AppLogo';
import { Loader2, Mail } from 'lucide-react';
import { Button } from '@/app/_components/ui/button';
import { Input } from '@/app/_components/ui/input';
import { Label } from '@/app/_components/ui/label';
import Link from 'next/link';

interface ForgotPasswordProps {
  isForgotPasswordSent: boolean;
  handleForgotPassword: (e: React.FormEvent<HTMLFormElement>) => void;
  email: string;
  setEmail: (email: string) => void;
  isLoading: boolean;
}

export default function ForgotPassword({
  isForgotPasswordSent,
  handleForgotPassword,
  email,
  setEmail,
  isLoading,
}: ForgotPasswordProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    handleForgotPassword(e);
  };

  return (
    <AuthLayout
      logo={<AppLogo />}
      title={`Forgot Password`}
      description="Enter your email below to reset your password"
    >
      {!isForgotPasswordSent ? (
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="text-muted-foreground absolute top-2.5 left-3 h-5 w-5" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="pl-10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || email === '' || isForgotPasswordSent}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'Send Reset Link'
            )}
          </Button>
          <div className="text-center">
            <Link
              href="/login"
              className="text-primary text-sm hover:underline"
            >
              Back to login
            </Link>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <p className="text-center">
            We&apos;ve sent a password reset link to <strong>{email}</strong>
          </p>
          <p className="text-muted-foreground text-center text-sm">
            Check your email and follow the instructions to reset your password.
          </p>
          <Button
            asChild
            className="w-full"
          >
            <Link href="/login">Back to login</Link>
          </Button>
        </div>
      )}
    </AuthLayout>
  );
}
