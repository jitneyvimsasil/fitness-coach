'use client';

import { cn } from '@/lib/utils';
import { LEVEL_COLORS } from '@/lib/gamification';

interface LevelDisplayProps {
  level: number;
  name: string;
  className?: string;
}

export function LevelDisplay({ level, name, className }: LevelDisplayProps) {
  const colors = LEVEL_COLORS[level] || LEVEL_COLORS[1];

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div
        className={cn(
          'flex items-center justify-center w-10 h-10 rounded-lg font-bold text-lg',
          colors.bg,
          colors.text,
          colors.glow && `shadow-lg ${colors.glow}`
        )}
      >
        {level}
      </div>
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-wider">Level</p>
        <p className={cn('font-semibold', colors.text)}>{name}</p>
      </div>
    </div>
  );
}
