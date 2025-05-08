'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Mail, AlertCircle } from 'lucide-react';
import { Button } from '@/app/_components/ui/button';
import { Label } from '@/app/_components/ui/label';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/app/_components/ui/alert';
import { Progress } from '@/app/_components/ui/progress';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/app/_components/ui/input-otp';
import Link from 'next/link';

interface TwoFactorAuthFormProps {
  email?: string;
}

export function TwoFactorAuthForm({ email }: TwoFactorAuthFormProps) {
  const router = useRouter();
  const [verificationCode, setVerificationCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds

  // Countdown timer for code expiration
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();

    if (verificationCode.length !== 6) {
      setError('Please enter all 6 digits of the verification code');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    // Simulate API call to verify code
    setTimeout(() => {
      // For demo purposes, let's say "123456" is the valid code
      if (verificationCode === '123456') {
        setIsSubmitting(false);
        router.push('/dashboard');
      } else {
        setIsSubmitting(false);
        setError('Invalid verification code. Please try again.');
      }
    }, 1500);
  };

  const handleResendCode = () => {
    setIsSubmitting(true);
    setError(null);
    setVerificationCode('');

    // Simulate API call to resend verification code
    setTimeout(() => {
      setIsSubmitting(false);
      setTimeLeft(300); // Reset timer to 5 minutes
    }, 1500);
  };

  const formatTimeLeft = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <form
      onSubmit={handleVerifyCode}
      className="space-y-6"
    >
      <div className="bg-muted/30 rounded-lg border p-4">
        <div className="flex items-start gap-4">
          <div className="bg-primary/10 rounded-full p-2">
            <Mail className="text-primary h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-medium">
              Two-Factor Authentication Required
            </h4>
            <p className="text-muted-foreground mt-1 text-sm">
              We&apos;ve sent a 6-digit verification code to {email}. Enter the
              code below to continue.
            </p>
          </div>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="verification-code">Verification Code</Label>
        <div className="flex justify-center">
          <InputOTP
            maxLength={6}
            value={verificationCode}
            onChange={(value) => setVerificationCode(value)}
            disabled={isSubmitting}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <p className="text-muted-foreground text-xs">
            Code expires in{' '}
            <span className="font-medium">{formatTimeLeft()}</span>
          </p>
          <Button
            type="button"
            variant="link"
            size="sm"
            className="h-auto p-0 text-xs"
            onClick={handleResendCode}
            disabled={isSubmitting || timeLeft > 270} // Disable resend for first 30 seconds
          >
            Resend code
          </Button>
        </div>
        <Progress
          value={(timeLeft / 300) * 100}
          className="mt-1 h-1"
        />
      </div>

      <div className="flex flex-col space-y-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? 'Verifying...' : 'Verify and Continue'}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>

        <div className="text-center">
          <Button
            variant="link"
            asChild
            className="text-sm"
          >
            <Link href="/login">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to login
            </Link>
          </Button>
        </div>
      </div>
    </form>
  );
}
