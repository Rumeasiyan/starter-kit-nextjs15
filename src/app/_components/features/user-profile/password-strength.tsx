'use client';

import { cn } from '@/lib/utils';

interface PasswordStrengthProps {
  password: string;
  className?: string;
}

export function PasswordStrength({
  password,
  className,
}: PasswordStrengthProps) {
  // Calculate password strength
  const getStrength = (password: string): number => {
    let strength = 0;

    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    return strength;
  };

  const strength = getStrength(password);

  // Get appropriate label and color based on strength
  const getLabel = (strength: number): string => {
    if (strength === 0) return 'Too weak';
    if (strength === 1) return 'Weak';
    if (strength === 2) return 'Fair';
    if (strength === 3) return 'Good';
    if (strength === 4) return 'Strong';
    return 'Very strong';
  };

  const getColor = (strength: number): string => {
    if (strength === 0) return 'bg-gray-200';
    if (strength === 1) return 'bg-red-500';
    if (strength === 2) return 'bg-orange-500';
    if (strength === 3) return 'bg-yellow-500';
    if (strength === 4) return 'bg-green-500';
    return 'bg-green-600';
  };

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex h-2 w-full gap-1 rounded-full bg-gray-100">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={cn(
              'h-full flex-1 rounded-full transition-colors duration-300',
              i < strength ? getColor(strength) : 'bg-gray-200'
            )}
          />
        ))}
      </div>
      <p className="text-muted-foreground text-xs">
        Password strength:{' '}
        <span className="font-medium">{getLabel(strength)}</span>
      </p>
    </div>
  );
}
