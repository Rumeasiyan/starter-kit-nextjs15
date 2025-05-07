'use client';

import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, Loader2 } from 'lucide-react';
import { z } from 'zod';

import { Button } from '@/app/_components/ui/button';
import { Input } from '@/app/_components/ui/input';
import { Label } from '@/app/_components/ui/label';
import { Separator } from '@/app/_components/ui/separator';
import { useEffect, useState } from 'react';

interface LoginFormProps {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  loginFormData: {
    email: string;
    password: string;
  };
  setLoginFormData: (formData: LoginFormProps['loginFormData']) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

export function LoginForm({
  handleSubmit,
  loginFormData,
  setLoginFormData,
  isLoading,
  setIsLoading,
}: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFormInvalid, setIsFormInvalid] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (loginFormData?.email && loginFormData?.password) {
      setIsFormInvalid(false);
    } else {
      setIsFormInvalid(true);
    }
  }, [loginFormData]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    const result = loginSchema.safeParse(loginFormData);
    if (!result.success) {
      result.error.errors.forEach((err) => {
        if (err.path[0]) errors[err.path[0] as string] = err.message;
      });
      setFormErrors(errors);
      setIsLoading(false);
      return;
    }

    setFormErrors({});
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
            placeholder="Enter your email"
            className="pl-10"
            required
            onChange={(e) =>
              setLoginFormData({
                ...loginFormData,
                email: e.target.value,
              })
            }
          />
        </div>
        {formErrors.email && (
          <p className="mt-1 text-xs text-red-500">{formErrors.email}</p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">
            Password <span className="text-red-500">*</span>
          </Label>
          <Link
            href="/forgot-password"
            className="text-primary text-sm hover:underline"
          >
            Forgot Password?
          </Link>
        </div>
        <div className="relative">
          <Lock className="text-muted-foreground absolute top-2.5 left-3 h-5 w-5" />
          <Input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            className="pl-10"
            required
            onChange={(e) =>
              setLoginFormData({
                ...loginFormData,
                password: e.target.value,
              })
            }
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
        {formErrors.password && (
          <p className="mt-1 text-xs text-red-500">{formErrors.password}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isFormInvalid || isLoading}
      >
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : isFormInvalid ? (
          'Please fill all required fields'
        ) : (
          'Login'
        )}
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background text-muted-foreground px-2">
            Or login with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          type="button"
          className="w-full"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            className="mr-2 h-5 w-5"
          >
            <path
              fill="#FFC107"
              d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
            />
            <path
              fill="#FF3D00"
              d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
            />
            <path
              fill="#4CAF50"
              d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
            />
            <path
              fill="#1976D2"
              d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
            />
          </svg>
          Google
        </Button>
        <Button
          variant="outline"
          type="button"
          className="w-full"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            className="mr-2 h-5 w-5"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M24 0C10.747 0 0 10.747 0 24c0 10.587 6.874 19.562 16.406 22.729 1.2.222 1.639-.522 1.639-1.16 0-.552-.02-2.019-.031-3.963-6.676 1.45-8.087-3.208-8.087-3.208-1.092-2.778-2.664-3.517-2.664-3.517-2.178-1.488.165-1.458.165-1.458 2.408.17 3.675 2.472 3.675 2.472 2.14 3.666 5.612 2.607 6.985 1.994.215-1.552.835-2.607 1.522-3.209-5.33-.606-10.932-2.664-10.932-11.854 0-2.617.935-4.759 2.469-6.437-.248-.607-1.069-3.044.234-6.343 0 0 2.014-.644 6.6 2.458A23.104 23.104 0 0124 11.687c2.025 0 4.065.273 5.974.797 4.584-3.102 6.597-2.458 6.597-2.458 1.305 3.3.484 5.736.236 6.343 1.536 1.678 2.465 3.82 2.465 6.437 0 9.214-5.611 11.242-10.959 11.836.859.74 1.625 2.2 1.625 4.434 0 3.2-.029 5.78-.029 6.566 0 .644.432 1.392 1.648 1.157C41.134 43.556 48 34.587 48 24 48 10.747 37.255 0 24 0"
              fill="#24292f"
            />
          </svg>
          GitHub
        </Button>
      </div>

      <p className="text-center text-sm">
        Don&apos;t have an account?{' '}
        <Link
          href="/signup"
          className="text-primary hover:underline"
        >
          Sign up
        </Link>
      </p>
    </form>
  );
}
