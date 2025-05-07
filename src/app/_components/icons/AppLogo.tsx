import Link from 'next/link';

export const AppLogo = () => {
  return (
    <Link
      href="/"
      className="mb-8 flex items-center space-x-2"
    >
      <span className="text-xl font-bold">
        {process.env.NEXT_PUBLIC_APP_NAME}
      </span>
    </Link>
  );
};
