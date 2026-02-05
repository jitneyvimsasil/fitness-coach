'use client';

import { cn } from '@/lib/utils';

interface StreakCounterProps {
  count: number;
  label?: string;
  className?: string;
}

export function StreakCounter({ count, label = "Messages", className }: StreakCounterProps) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted">
        <MessageIcon className="w-5 h-5 text-muted-foreground" />
      </div>
      <div>
        <p className="text-2xl font-bold tabular-nums">{count}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

function MessageIcon({ className }: { className?: string }) {
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
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>
  );
}
