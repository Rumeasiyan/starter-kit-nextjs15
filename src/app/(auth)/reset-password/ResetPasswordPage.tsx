import { AuthLayout } from '@/app/_components/layouts/auth/AuthLayout';
import { AppLogo } from '@/app/_components/icons/AppLogo';
import { Button } from '@/app/_components/ui/button';
import { Input } from '@/app/_components/ui/input';
import { Label } from '@/app/_components/ui/label';
import Link from 'next/link';
import { Eye, EyeOff, Loader2, Lock } from 'lucide-react';
import { useState } from 'react';

interface ResetPasswordProps {
  password: string;
  setPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (confirmPassword: string) => void;
  handleResetPassword: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}

export default function ResetPassword({
  handleResetPassword,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  isLoading,
}: ResetPasswordProps) {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    handleResetPassword(e);
  };

  return (
    <AuthLayout
      logo={<AppLogo />}
      title={`Reset Password`}
      description="Create your new password below to reset your password"
    >
      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <div className="space-y-2">
          <Label htmlFor="password">New Password</Label>
          <div className="relative">
            <Lock className="text-muted-foreground absolute top-2.5 left-3 h-5 w-5" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter new password"
              className="pl-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground absolute top-0 right-0 hover:bg-transparent focus-visible:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
              <span className="sr-only">
                {showPassword ? 'Hide password' : 'Show password'}
              </span>
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm New Password</Label>
          <div className="relative">
            <Lock className="text-muted-foreground absolute top-2.5 left-3 h-5 w-5" />
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm new password"
              className="pl-10"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground absolute top-0 right-0 hover:bg-transparent focus-visible:bg-transparent"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
              <span className="sr-only">
                {showConfirmPassword ? 'Hide password' : 'Show password'}
              </span>
            </Button>
          </div>
        </div>

        {error && <p className="text-destructive text-sm">{error}</p>}

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading || password === '' || confirmPassword === ''}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            'Reset Password'
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
    </AuthLayout>
  );
}
