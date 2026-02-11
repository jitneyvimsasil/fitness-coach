'use client';

import React from 'react';
import { Calendar, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CountUp } from '@/components/ui/count-up';

interface UsageStatsProps {
  createdAt: string;
  totalActiveDays: number;
  className?: string;
}

function daysSince(dateString: string): number {
  const created = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - created.getTime();
  return Math.max(1, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
}

export const UsageStats = React.memo(function UsageStats({
  createdAt,
  totalActiveDays,
  className,
}: UsageStatsProps) {
  const memberDays = daysSince(createdAt);
  const consistencyPercent = memberDays > 0
    ? Math.min(Math.round((totalActiveDays / memberDays) * 100), 100)
    : 0;

  return (
    <div className={cn('grid grid-cols-2 gap-3', className)}>
      {/* Member since */}
      <div className="flex items-center gap-2.5">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-muted flex-shrink-0">
          <Calendar className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="text-lg font-bold tabular-nums leading-tight">
            <CountUp to={memberDays} />
          </p>
          <p className="text-[10px] text-muted-foreground">days as member</p>
        </div>
      </div>

      {/* Active days */}
      <div className="flex items-center gap-2.5">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-emerald-900/30 flex-shrink-0">
          <Activity className="w-4 h-4 text-emerald-400" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="text-lg font-bold tabular-nums leading-tight">
            <CountUp to={totalActiveDays} />
          </p>
          <p className="text-[10px] text-muted-foreground">
            active days
            {consistencyPercent > 0 && (
              <span className="text-primary"> ({consistencyPercent}%)</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
});
