'use client';

import React from 'react';
import { m } from 'motion/react';
import { cn } from '@/lib/utils';
import { LEVEL_COLORS } from '@/lib/gamification';

interface LevelDisplayProps {
  level: number;
  name: string;
  className?: string;
}

export const LevelDisplay = React.memo(function LevelDisplay({ level, name, className }: LevelDisplayProps) {
  const colors = LEVEL_COLORS[level] || LEVEL_COLORS[1];

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <m.div
        key={level}
        initial={{ scale: 1.3 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 500, damping: 15 }}
        className={cn(
          'flex items-center justify-center w-10 h-10 rounded-lg font-bold text-lg',
          colors.bg,
          colors.text,
          colors.glow && `shadow-lg ${colors.glow}`
        )}
      >
        {level}
      </m.div>
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-wider">Level</p>
        <p className={cn('font-semibold', colors.text)}>{name}</p>
      </div>
    </div>
  );
});
