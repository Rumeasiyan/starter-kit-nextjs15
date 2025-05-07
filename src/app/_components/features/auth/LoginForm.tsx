'use client';

import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, Loader2 } from 'lucide-react';
import { z } from 'zod';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { Button } from '@/app/_components/ui/button';
import { Input } from '@/app/_components/ui/input';
import { Label } from '@/app/_components/ui/label';
import { Separator } from '@/app/_components/ui/separator';
import { useEffect, useState } from 'react';

interface LoginFormProps {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleGoogleLogin: () => void;
  handleGithubLogin: () => void;
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
  handleGoogleLogin,
  handleGithubLogin,
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

  const handleGoogleLoginButtonClick = () => {
    handleGoogleLogin();
  };

  const handleGithubLoginButtonClick = () => {
    handleGithubLogin();
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
          onClick={handleGoogleLoginButtonClick}
        >
          <FcGoogle className="mr-2 h-5 w-5" />
          Google
        </Button>
        <Button
          variant="outline"
          type="button"
          className="w-full"
          onClick={handleGithubLoginButtonClick}
        >
          <FaGithub className="mr-2 h-5 w-5" />
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
