import { AuthLayout } from '@/app/_components/layouts/auth/AuthLayout';
import { AppLogo } from '@/app/_components/icons/AppLogo';
import { LoginForm } from '@/app/_components/features/auth/LoginForm';
interface LoginProps {
  loginFormData: {
    email: string;
    password: string;
  };
  setLoginFormData: (formData: LoginProps['loginFormData']) => void;
  handleLogin: () => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

export default function Login({
  handleLogin,
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
        loginFormData={loginFormData}
        setLoginFormData={setLoginFormData}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />
    </AuthLayout>
  );
}
