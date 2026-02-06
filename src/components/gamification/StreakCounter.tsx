'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StreakCounterProps {
  count: number;
  label?: string;
  className?: string;
}

export const StreakCounter = React.memo(function StreakCounter({ count, label = "Messages", className }: StreakCounterProps) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted">
        <MessageCircle className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
      </div>
      <div>
        <p className="text-2xl font-bold tabular-nums">{count}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
});
