'use client';

import { useState } from 'react';
import { UserProfilePanel } from '@/app/_components/features/user-profile/user-profile-panel';
import DashboardHeader from '@/app/_components/layouts/dashboard/header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader setProfileOpen={setProfileOpen} />
      <main className="flex-1 p-4 md:p-6">{children}</main>

      <UserProfilePanel
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
      />
    </div>
  );
}
