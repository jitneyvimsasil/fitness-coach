'use client';

import { cn } from '@/lib/utils';

interface BadgeSlotsProps {
  className?: string;
}

// Placeholder for V2 badge system
export function BadgeSlots({ className }: BadgeSlotsProps) {
  const placeholderBadges = [
    { id: 1, locked: true },
    { id: 2, locked: true },
    { id: 3, locked: true },
    { id: 4, locked: true },
  ];

  return (
    <div className={cn('space-y-3', className)}>
      <p className="text-xs text-muted-foreground uppercase tracking-wider">Badges</p>
      <div className="grid grid-cols-4 gap-2">
        {placeholderBadges.map((badge) => (
          <div
            key={badge.id}
            className={cn(
              'aspect-square rounded-lg flex items-center justify-center',
              'bg-muted/50 border border-border/50',
              'transition-all duration-200'
            )}
          >
            <LockIcon className="w-4 h-4 text-muted-foreground/50" />
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground text-center">
        Coming soon
      </p>
    </div>
  );
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
