'use client';

import type { StallState } from '@/hooks/useChat';

interface TypingIndicatorProps {
  stallState?: StallState;
}

const STALL_MESSAGES: Record<StallState, string | null> = {
  normal: null,
  slow: 'Still thinking...',
  stalled: 'Taking longer than usual...',
};

export function TypingIndicator({ stallState = 'normal' }: TypingIndicatorProps) {
  const stallMessage = STALL_MESSAGES[stallState];

  return (
    <div className="flex justify-start" role="status" aria-label="Coach is typing a response">
      <div className="bg-card border border-border rounded-2xl rounded-bl-md px-4 py-3">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:-0.3s]" />
          <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:-0.15s]" />
          <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" />
        </div>
        {stallMessage && (
          <p className="text-[11px] text-muted-foreground mt-1.5">{stallMessage}</p>
        )}
      </div>
    </div>
  );
}
