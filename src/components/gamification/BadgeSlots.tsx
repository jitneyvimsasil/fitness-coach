'use client';

import React from 'react';
import { Lock } from 'lucide-react';
import { BADGE_ICONS } from '@/lib/gamification';
import { cn } from '@/lib/utils';
import type { BadgeWithStatus } from '@/lib/types';

interface BadgeSlotsProps {
  badges: BadgeWithStatus[];
  className?: string;
}

export const BadgeSlots = React.memo(function BadgeSlots({ badges, className }: BadgeSlotsProps) {
  if (badges.length === 0) {
    return (
      <div className={cn('space-y-3', className)}>
        <p className="text-xs text-muted-foreground uppercase tracking-wider">Badges</p>
        <p className="text-xs text-muted-foreground text-center py-2">Loading badges...</p>
      </div>
    );
  }

  const earnedCount = badges.filter(b => b.earned).length;

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground uppercase tracking-wider">Badges</p>
        <p className="text-xs text-muted-foreground">{earnedCount}/{badges.length}</p>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {badges.map((badge) => {
          const Icon = badge.earned
            ? (BADGE_ICONS[badge.icon_name] || Lock)
            : Lock;

          // Check if recently earned (within 60 seconds)
          const isRecent = badge.earned_at &&
            (Date.now() - new Date(badge.earned_at).getTime()) < 60000;

          return (
            <div
              key={badge.id}
              className="group relative"
            >
              <div
                className={cn(
                  'aspect-square rounded-lg flex items-center justify-center',
                  'transition-all duration-200',
                  badge.earned
                    ? 'bg-primary/10 border border-primary/20 hover:border-primary/40'
                    : 'bg-muted/50 border border-border/50 hover:border-border',
                  isRecent && 'animate-pulse',
                )}
              >
                <Icon
                  className={cn(
                    'w-4 h-4',
                    badge.earned ? 'text-primary' : 'text-muted-foreground/50',
                  )}
                  aria-hidden="true"
                />
              </div>

              {/* Tooltip */}
              <div className={cn(
                'absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-10',
                'pointer-events-none opacity-0 group-hover:opacity-100',
                'transition-opacity duration-150',
                'w-36 p-2 rounded-lg',
                'bg-popover border border-border shadow-lg',
                'text-center',
              )}>
                <p className="text-xs font-medium text-foreground">{badge.name}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {badge.earned
                    ? `Earned ${badge.earned_at ? new Date(badge.earned_at).toLocaleDateString() : ''}`
                    : badge.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});
