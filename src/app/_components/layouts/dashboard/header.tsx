'use client';

import { User } from 'lucide-react';
import { Button } from '@/app/_components/ui/button';
import { AppLogo } from '../../icons/AppLogo';
import { useSession } from '@/lib/auth/auth-client';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';

interface DashboardHeaderProps {
  setProfileOpen: (open: boolean) => void;
}

export default function DashboardHeader({
  setProfileOpen,
}: DashboardHeaderProps) {
  const { data } = useSession();

  return (
    <header className="bg-background/80 sticky top-0 z-30 flex h-16 items-center gap-4 border-b px-4 backdrop-blur-sm md:px-6">
      <AppLogo className="mb-0" />
      <div className="ml-auto flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={() => setProfileOpen(true)}
        >
          <Avatar>
            <AvatarImage src={data?.user?.image ?? ''} />
            <AvatarFallback>
              <User className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <span className="sr-only">Profile</span>
        </Button>
      </div>
    </header>
  );
}
