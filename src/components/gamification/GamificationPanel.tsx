'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ProgressRing } from './ProgressRing';
import { LevelDisplay } from './LevelDisplay';
import { StreakCounter } from './StreakCounter';
import { BadgeSlots } from './BadgeSlots';
import type { ProgressInfo, StreakInfo, BadgeWithStatus } from '@/lib/types';
import { cn } from '@/lib/utils';

interface GamificationPanelProps {
  progress: ProgressInfo | null;
  messageCount: number;
  streakInfo: StreakInfo | null;
  badges: BadgeWithStatus[];
  loading?: boolean;
  className?: string;
}

export const GamificationPanel = React.memo(function GamificationPanel({
  progress,
  messageCount,
  streakInfo,
  badges,
  loading,
  className,
}: GamificationPanelProps) {
  if (loading) {
    return (
      <Card className={cn('p-6 space-y-6', className)}>
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-32 w-32 rounded-full mx-auto" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-24 w-full" />
      </Card>
    );
  }

  if (!progress) {
    return (
      <Card className={cn('p-6', className)}>
        <p className="text-muted-foreground text-center text-sm">
          Sign in to track your progress
        </p>
      </Card>
    );
  }

  return (
    <Card className={cn('p-6 space-y-6', className)}>
      {/* Header */}
      <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
        Your Progress
      </h2>

      {/* Progress Ring */}
      <div className="flex justify-center">
        <ProgressRing progress={progress.progress} size={140} strokeWidth={10}>
          <div className="text-center">
            <p className="text-2xl font-bold">{Math.round(progress.progress)}%</p>
            <p className="text-xs text-muted-foreground">to next level</p>
          </div>
        </ProgressRing>
      </div>

      {/* Level Display */}
      <LevelDisplay level={progress.level} name={progress.name} />

      {/* Streak Counter */}
      <StreakCounter streakInfo={streakInfo} messageCount={messageCount} />

      {/* Next Level Info */}
      {progress.messagesToNext > 0 && (
        <div className="pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground">
            <span className="text-primary font-medium">{progress.messagesToNext}</span> more messages to reach the next level
          </p>
        </div>
      )}

      {/* Badge Slots */}
      <div className="pt-4 border-t border-border">
        <BadgeSlots badges={badges} />
      </div>
    </Card>
  );
});
