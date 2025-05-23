import { SignupForm } from '@/app/_components/features/auth/SignupForm';
import { AuthLayout } from '@/app/_components/layouts/auth/AuthLayout';
import { AppLogo } from '@/app/_components/icons/AppLogo';

interface SignupProps {
  handleSignup: () => void;
  handleGoogleSignup: () => void;
  handleGithubSignup: () => void;
  signupFormData: {
    image: string;
    email: string;
    name: string;
    password: string;
    confirmPassword: string;
  };
  setSignupFormData: (formData: SignupProps['signupFormData']) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

export default function Signup({
  handleSignup,
  handleGoogleSignup,
  handleGithubSignup,
  signupFormData,
  setSignupFormData,
  isLoading,
  setIsLoading,
}: SignupProps) {
  return (
    <AuthLayout
      logo={<AppLogo />}
      title={`Signup`}
      description="Enter your email below to signup to your account"
    >
      <SignupForm
        handleSubmit={handleSignup}
        handleGoogleSignup={handleGoogleSignup}
        handleGithubSignup={handleGithubSignup}
        signupFormData={signupFormData}
        setSignupFormData={setSignupFormData}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />
    </AuthLayout>
  );
}
