import { AuthLayout } from '@/app/_components/layouts/auth/AuthLayout';
import { AppLogo } from '@/app/_components/icons/AppLogo';
import { LoginForm } from '@/app/_components/features/auth/LoginForm';
interface LoginProps {
  handleLogin: () => void;
  handleGoogleLogin: () => void;
  handleGithubLogin: () => void;
  loginFormData: {
    email: string;
    password: string;
  };
  setLoginFormData: (formData: LoginProps['loginFormData']) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

export default function Login({
  handleLogin,
  handleGoogleLogin,
  handleGithubLogin,
  loginFormData,
  setLoginFormData,
  isLoading,
  setIsLoading,
}: LoginProps) {
  return (
    <AuthLayout
      logo={<AppLogo />}
      title={`Login`}
      description="Enter your email below to login to your account"
    >
      <LoginForm
        handleSubmit={handleLogin}
        handleGoogleLogin={handleGoogleLogin}
        handleGithubLogin={handleGithubLogin}
        loginFormData={loginFormData}
        setLoginFormData={setLoginFormData}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />
    </AuthLayout>
  );
}
