'use client';

import { User } from 'lucide-react';

export function AvatarPanel() {
  return (
    <aside className="flex w-72 border-r border-border flex-col items-center justify-center bg-card/50 flex-shrink-0 overflow-hidden">
      <div className="w-32 h-32 rounded-full bg-muted/50 border border-border/50 flex items-center justify-center">
        <User className="w-16 h-16 text-muted-foreground/30" />
      </div>
      <p className="text-xs text-muted-foreground mt-4">3D Avatar</p>
    </aside>
  );
}
