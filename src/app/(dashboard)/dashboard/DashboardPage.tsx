interface DashboardPageProps {
  signOut: () => void;
}

export default function DashboardPage({ signOut }: DashboardPageProps) {
  return (
    <div className="gradient-background flex min-h-screen flex-col text-black">
      this is dashboard page
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  );
}
