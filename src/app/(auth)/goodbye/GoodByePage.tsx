'use client';

import type React from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Frown, ArrowRight } from 'lucide-react';
import { Button } from '@/app/_components/ui/button';
import { AuthLayout } from '@/app/_components/layouts/auth/AuthLayout';

export default function AccountDeletedPage() {
  const router = useRouter();

  return (
    <AuthLayout
      title="Your Account Has Been Deleted"
      description="We're sorry to see you go"
      showImage={true}
    >
      <div className="space-y-6">
        <div className="flex justify-center">
          <div className="bg-muted flex h-32 w-32 items-center justify-center rounded-full">
            <Frown className="text-muted-foreground h-32 w-32 rounded-full" />
          </div>
        </div>

        <div className="space-y-2 text-center">
          <h2 className="text-xl font-semibold">
            We&apos;re sad to see you go
          </h2>
          <p className="text-muted-foreground">
            Your account and all associated data have been permanently deleted
            from our system.
          </p>
        </div>

        <div className="space-y-4 pt-4">
          <Button
            className="w-full"
            onClick={() => router.push('/')}
          >
            Return to Homepage
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>

          <div className="flex flex-col space-y-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push('/signup')}
            >
              Create a New Account
            </Button>
          </div>
        </div>

        <div className="text-muted-foreground text-center text-sm">
          <p className="mt-2">
            If you change your mind, you can{' '}
            <Link
              href="/signup"
              className="text-primary hover:underline"
            >
              create a new account
            </Link>{' '}
            anytime.
          </p>
        </div>

        <div className="text-muted-foreground mt-12 text-center text-sm">
          <p className="bg-muted rounded-md p-2 text-sm">
            If you haven&apos;t verified your deletion, please check your email
            and verify it through the link we&apos;ve sent you.
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
