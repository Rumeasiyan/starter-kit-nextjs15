import type React from 'react';
import Link from 'next/link';

import { TestimonialCarousel } from '@/app/_components/features/auth/TestimonialCarousel';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  showImage?: boolean;
  logo?: React.ReactNode;
}

export function AuthLayout({
  children,
  title,
  description,
  showImage = true,
  logo,
}: AuthLayoutProps) {
  return (
    <div className="grid min-h-screen md:grid-cols-2 lg:grid-cols-3">
      {showImage && (
        <div className="hidden p-6 md:col-span-1 md:flex md:items-center md:justify-center lg:col-span-2">
          <div className="h-full w-full overflow-hidden rounded-3xl shadow-xl">
            <TestimonialCarousel />
          </div>
        </div>
      )}

      <div className="col-span-1 flex flex-col justify-center px-4 py-12 md:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-sm">
          {logo ? (
            <div className="mb-8">{logo}</div>
          ) : (
            <Link
              href="/"
              className="mb-8 flex items-center space-x-2"
            >
              <span className="text-xl font-bold">
                {process.env.NEXT_PUBLIC_APP_NAME}
              </span>
            </Link>
          )}
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">{title}</h1>
            {description && (
              <p className="text-muted-foreground">{description}</p>
            )}
          </div>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
