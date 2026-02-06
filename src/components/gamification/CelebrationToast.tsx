'use client';

import React from 'react';
import { Flame, Snowflake, Shield, Star } from 'lucide-react';
import { BADGE_ICONS } from '@/lib/gamification';
import { cn } from '@/lib/utils';
import type { GamificationEvent } from '@/lib/types';

interface CelebrationToastProps {
  event: GamificationEvent | null;
  visible: boolean;
  onDismiss: () => void;
}

function getEventConfig(event: GamificationEvent) {
  switch (event.type) {
    case 'level_up':
      return {
        icon: Star,
        title: 'Level Up!',
        message: `You're now ${event.newName} (Level ${event.newLevel})`,
        accent: 'from-amber-500/20 to-yellow-500/20',
        iconColor: 'text-yellow-400',
        borderColor: 'border-yellow-500/30',
      };
    case 'badge_earned': {
      const BadgeIcon = BADGE_ICONS[event.badge.icon_name] || Star;
      return {
        icon: BadgeIcon,
        title: 'Badge Earned!',
        message: event.badge.name,
        accent: 'from-primary/20 to-emerald-500/20',
        iconColor: 'text-primary',
        borderColor: 'border-primary/30',
      };
    }
    case 'streak_milestone':
      return {
        icon: Flame,
        title: `${event.days}-Day Streak!`,
        message: 'Keep the momentum going!',
        accent: 'from-orange-500/20 to-red-500/20',
        iconColor: 'text-orange-400',
        borderColor: 'border-orange-500/30',
      };
    case 'streak_freeze_used':
      return {
        icon: Snowflake,
        title: 'Streak Saved!',
        message: 'Your streak freeze was used automatically',
        accent: 'from-blue-500/20 to-cyan-500/20',
        iconColor: 'text-blue-400',
        borderColor: 'border-blue-500/30',
      };
    case 'streak_freeze_earned':
      return {
        icon: Shield,
        title: 'Freeze Earned!',
        message: 'You earned a streak freeze for your 7-day streak',
        accent: 'from-emerald-500/20 to-teal-500/20',
        iconColor: 'text-emerald-400',
        borderColor: 'border-emerald-500/30',
      };
  }
}

export const CelebrationToast = React.memo(function CelebrationToast({
  event,
  visible,
  onDismiss,
}: CelebrationToastProps) {
  if (!event) return null;

  const config = getEventConfig(event);
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'fixed top-4 left-1/2 -translate-x-1/2 z-50 pointer-events-auto',
        'transition-all duration-300 ease-out',
        visible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 -translate-y-4',
      )}
    >
      <button
        onClick={onDismiss}
        className={cn(
          'flex items-center gap-3 px-5 py-3 rounded-xl',
          'bg-gradient-to-r', config.accent,
          'border', config.borderColor,
          'backdrop-blur-md bg-card/80',
          'shadow-lg shadow-black/20',
          'cursor-pointer hover:scale-[1.02] active:scale-[0.98]',
          'transition-transform duration-150',
        )}
      >
        <div className={cn(
          'flex items-center justify-center w-10 h-10 rounded-lg',
          'bg-background/50',
        )}>
          <Icon className={cn('w-5 h-5', config.iconColor)} />
        </div>
        <div className="text-left">
          <p className="text-sm font-semibold text-foreground">{config.title}</p>
          <p className="text-xs text-muted-foreground">{config.message}</p>
        </div>
      </button>
    </div>
  );
});
