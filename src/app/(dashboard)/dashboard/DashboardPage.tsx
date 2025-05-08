'use client';

import { useSession } from '@/lib/auth/auth-client';

export default function DashboardPage() {
  const { data } = useSession();

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your dashboard,{' '}
          <span className="font-bold">{data?.user?.name}</span>
        </p>
      </div>
    </div>
  );
}
