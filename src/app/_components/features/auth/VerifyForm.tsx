'use client';

import Link from 'next/link';
import { Mail } from 'lucide-react';
import { Button } from '@/app/_components/ui/button';
import { Input } from '@/app/_components/ui/input';
import { Label } from '@/app/_components/ui/label';

interface VerifyFormProps {
  email: string;
  setEmail: (email: string) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export function VerifyForm({ email, setEmail, handleSubmit }: VerifyFormProps) {
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    handleSubmit(e);
  };

  return (
    <form
      onSubmit={onSubmit}
      className="w-full space-y-4"
    >
      <div className="space-y-2">
        <Label htmlFor="email">
          Email <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <Mail className="text-muted-foreground absolute top-2.5 left-3 h-5 w-5" />
          <Input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="pl-10"
            required
          />
        </div>
      </div>

      <Button
        type="submit"
        className="w-full"
      >
        Verify Email
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
  );
}
