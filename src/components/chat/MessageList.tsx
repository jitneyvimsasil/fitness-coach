'use client';

import { useEffect, useRef, useState } from 'react';
import { Dumbbell } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import type { Message } from '@/lib/types';
import type { StallState } from '@/hooks/useChat';

interface MessageListProps {
  messages: Message[];
  isLoading?: boolean;
  stallState?: StallState;
  onRetry?: (messageId: string) => void;
}

const VISIBLE_LIMIT = 50;

export function MessageList({ messages, isLoading, stallState, onRetry }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [showAll, setShowAll] = useState(false);

  const visibleMessages = showAll ? messages : messages.slice(-VISIBLE_LIMIT);
  const hasHidden = !showAll && messages.length > VISIBLE_LIMIT;

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (messages.length === 0 && !isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
            <Dumbbell className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Welcome to Fitness Coach
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            I&apos;m here to help with strength training, nutrition, yoga, and mobility.
            Ask me anything about your fitness journey!
          </p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-4 max-w-3xl mx-auto" aria-live="polite" aria-relevant="additions">
        {hasHidden && (
          <div className="text-center">
            <button
              onClick={() => setShowAll(true)}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-md hover:bg-muted"
            >
              Load {messages.length - VISIBLE_LIMIT} earlier messages
            </button>
          </div>
        )}
        {visibleMessages.map((message) => (
          <MessageBubble key={message.id} message={message} onRetry={onRetry} />
        ))}
        {isLoading && <TypingIndicator stallState={stallState} />}
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
}

