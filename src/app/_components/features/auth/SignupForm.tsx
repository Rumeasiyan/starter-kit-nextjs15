'use client';

import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, User, X, Loader2 } from 'lucide-react';
import { z } from 'zod';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { Button } from '@/app/_components/ui/button';
import { Input } from '@/app/_components/ui/input';
import { Label } from '@/app/_components/ui/label';
import { Separator } from '@/app/_components/ui/separator';
import { useEffect, useState } from 'react';
import Image from 'next/image';

interface AuthFormProps {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleGoogleSignup: () => void;
  handleGithubSignup: () => void;
  signupFormData: {
    image: string;
    email: string;
    name: string;
    password: string;
    confirmPassword: string;
  };
  setSignupFormData: (formData: AuthFormProps['signupFormData']) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

const signupSchema = z
  .object({
    image: z.string().optional(),
    email: z.string().email({ message: 'Invalid email address' }),
    name: z.string().min(1, { message: 'Name is required' }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters' })
      .max(64, { message: 'Password must be less than 64 characters' }),
    confirmPassword: z
      .string()
      .min(1, { message: 'Please confirm your password' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export function SignupForm({
  handleSubmit,
  handleGoogleSignup,
  handleGithubSignup,
  signupFormData,
  setSignupFormData,
  isLoading,
  setIsLoading,
}: AuthFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isFormInvalid, setIsFormInvalid] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (
      signupFormData?.email &&
      signupFormData?.password &&
      signupFormData?.confirmPassword
    ) {
      setIsFormInvalid(false);
    } else {
      setIsFormInvalid(true);
    }
  }, [signupFormData]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    const result = signupSchema.safeParse(signupFormData);

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

  const handleGoogleSignupButtonClick = () => {
    handleGoogleSignup();
  };

  const handleGithubSignupButtonClick = () => {
    handleGithubSignup();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSignupFormData({
          ...signupFormData,
          image: reader.result as string,
        });
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageRemove = () => {
    setSignupFormData({
      ...signupFormData,
      image: '',
    });
    setImagePreview(null);
  };

  return (
    <form
      onSubmit={onSubmit}
      className="w-full space-y-4"
    >
      <div className="space-y-2">
        <Label htmlFor="image">Profile Image (optional)</Label>
        <div className="flex flex-col gap-4">
          {imagePreview && (
            <div className="relative flex items-center justify-center">
              <Image
                src={imagePreview}
                alt="Profile Image"
                width={100}
                height={100}
                className="h-24 w-24 rounded-full"
              />
            </div>
          )}
          <div className="relative cursor-pointer">
            <User className="text-muted-foreground absolute top-2.5 left-3 h-5 w-5" />
            <Input
              id="image"
              name="image"
              placeholder="Enter your image"
              className="cursor-pointer pl-10"
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e)}
            />
            {imagePreview && (
              <X
                className="text-muted-foreground absolute top-2.5 right-3 h-5 w-5 cursor-pointer"
                onClick={handleImageRemove}
              />
            )}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">
          Your name <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <User className="text-muted-foreground absolute top-2.5 left-3 h-5 w-5" />
          <Input
            id="name"
            name="name"
            placeholder="Enter your name"
            className="pl-10"
            required
            onChange={(e) =>
              setSignupFormData({
                ...signupFormData,
                name: e.target.value,
              })
            }
          />
        </div>
        {formErrors.name && (
          <p className="mt-1 text-xs text-red-500">{formErrors.name}</p>
        )}
      </div>

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
              setSignupFormData({
                ...signupFormData,
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
              setSignupFormData({
                ...signupFormData,
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

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">
          Confirm Password <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <Lock className="text-muted-foreground absolute top-2.5 left-3 h-5 w-5" />
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm your password"
            className="pl-10"
            required
            onChange={(e) =>
              setSignupFormData({
                ...signupFormData,
                confirmPassword: e.target.value,
              })
            }
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
        {formErrors.confirmPassword && (
          <p className="mt-1 text-xs text-red-500">
            {formErrors.confirmPassword}
          </p>
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
          'Sign up'
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
          onClick={handleGoogleSignupButtonClick}
        >
          <FcGoogle className="mr-2 h-5 w-5" />
          Google
        </Button>
        <Button
          variant="outline"
          type="button"
          className="w-full"
          onClick={handleGithubSignupButtonClick}
        >
          <FaGithub className="mr-2 h-5 w-5" />
          GitHub
        </Button>
      </div>

      <p className="text-center text-sm">
        Already have an account?{' '}
        <Link
          href="/login"
          className="text-primary hover:underline"
        >
          Login
        </Link>
      </p>
    </form>
  );
}
