'use client';

import React from 'react';
import { Flame, Snowflake, MessageCircle } from 'lucide-react';
import { getXPMultiplierInfo } from '@/lib/gamification';
import { CountUp } from '@/components/ui/count-up';
import { cn } from '@/lib/utils';
import type { StreakInfo } from '@/lib/types';

interface StreakCounterProps {
  streakInfo: StreakInfo | null;
  messageCount: number;
  className?: string;
}

export const StreakCounter = React.memo(function StreakCounter({
  streakInfo,
  messageCount,
  className,
}: StreakCounterProps) {
  // Fallback: no streak data (demo mode or new user) — show message count
  if (!streakInfo) {
    return (
      <div className={cn('flex items-center gap-3', className)}>
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted">
          <MessageCircle className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
        </div>
        <div>
          <p className="text-2xl font-bold tabular-nums"><CountUp to={messageCount} /></p>
          <p className="text-xs text-muted-foreground">Total messages</p>
        </div>
      </div>
    );
  }

  const { currentStreak, streakAtRisk, isActiveToday, streakFreezesAvailable } = streakInfo;
  const xpInfo = getXPMultiplierInfo(currentStreak);

  return (
    <div className={cn('space-y-2', className)}>
      {/* Main streak display */}
      <div className="flex items-center gap-3">
        <div className={cn(
          'flex items-center justify-center w-10 h-10 rounded-lg',
          streakAtRisk ? 'bg-amber-900/30' : currentStreak > 0 ? 'bg-orange-900/30' : 'bg-muted',
          streakAtRisk && 'animate-pulse',
        )}>
          <Flame
            className={cn(
              'w-5 h-5',
              streakAtRisk ? 'text-amber-400' : currentStreak > 0 ? 'text-orange-400' : 'text-muted-foreground',
            )}
            aria-hidden="true"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold tabular-nums"><CountUp to={currentStreak} /></p>
            {xpInfo.multiplier > 1 && (
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-primary/15 text-primary">
                {xpInfo.multiplier}x XP
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {streakAtRisk
              ? 'Streak at risk! Send a message today'
              : isActiveToday
                ? 'day streak — active today'
                : currentStreak > 0
                  ? 'day streak'
                  : 'Start your streak today'}
          </p>
        </div>
      </div>

      {/* Streak freezes */}
      {streakFreezesAvailable > 0 && (
        <div className="flex items-center gap-1.5 pl-[52px]">
          <Snowflake className="w-3 h-3 text-blue-400" aria-hidden="true" />
          <span className="text-[10px] text-muted-foreground">
            {streakFreezesAvailable} freeze{streakFreezesAvailable !== 1 ? 's' : ''} available
          </span>
        </div>
      )}
    </div>
  );
});
