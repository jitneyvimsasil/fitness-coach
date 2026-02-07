'use client';

import { useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { GamificationPanel } from './GamificationPanel';
import { ProgressRing } from './ProgressRing';
import type { ProgressInfo, StreakInfo, BadgeWithStatus } from '@/lib/types';
import { cn } from '@/lib/utils';

interface GamificationSheetProps {
  progress: ProgressInfo | null;
  messageCount: number;
  streakInfo: StreakInfo | null;
  badges: BadgeWithStatus[];
  loading?: boolean;
}

export function GamificationSheet({
  progress,
  messageCount,
  streakInfo,
  badges,
  loading,
}: GamificationSheetProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {/* Floating Action Button — visible only below lg breakpoint */}
      <Button
        onClick={() => setOpen(true)}
        className={cn(
          'fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom,0px))] right-6 z-40',
          'lg:hidden',
          'size-14 rounded-full shadow-lg shadow-primary/20',
          'bg-primary hover:bg-primary/90',
          'transition-all duration-200',
        )}
        aria-label="View your progress and badges"
      >
        {progress && !loading ? (
          <ProgressRing progress={progress.progress} size={40} strokeWidth={3}>
            <span className="text-[10px] font-bold text-primary-foreground">
              L{progress.level}
            </span>
          </ProgressRing>
        ) : (
          <TrendingUp className="size-6" />
        )}
      </Button>

      <SheetContent side="bottom" className="h-[85dvh] rounded-t-2xl p-0">
        <div className="h-full overflow-y-auto overscroll-contain">
          <SheetHeader className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border px-6 py-4">
            <SheetTitle>Your Progress</SheetTitle>
            <SheetDescription className="sr-only">
              View your fitness progress, streaks, and badges
            </SheetDescription>
          </SheetHeader>
          <div className="px-6 py-4">
            <GamificationPanel
              progress={progress}
              messageCount={messageCount}
              streakInfo={streakInfo}
              badges={badges}
              loading={loading}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
