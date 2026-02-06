'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import type { Message } from '@/lib/types';

interface MessageBubbleProps {
  message: Message;
  onRetry?: (messageId: string) => void;
}

export const MessageBubble = React.memo(function MessageBubble({ message, onRetry }: MessageBubbleProps) {
  const { id, content, isUser, timestamp, isError, retryContent } = message;

  return (
    <div
      className={cn(
        'flex w-full',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={cn(
          'max-w-[85%] md:max-w-[75%] rounded-2xl px-4 py-3',
          'transition-all duration-200',
          isUser
            ? 'bg-primary text-primary-foreground rounded-br-md'
            : 'bg-card text-card-foreground rounded-bl-md border border-border',
          isError && 'border-destructive/50 bg-destructive/5'
        )}
      >
        <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap break-words">
          {content}
        </p>
        {isError && retryContent && onRetry && (
          <button
            onClick={() => onRetry(id)}
            className="mt-2 text-xs text-primary hover:text-primary/80 font-medium transition-colors"
          >
            Retry message
          </button>
        )}
        <time
          className={cn(
            'block text-[10px] mt-1.5 opacity-60',
            isUser ? 'text-right' : 'text-left'
          )}
          aria-label={`Sent at ${timestamp.toLocaleTimeString()}`}
        >
          {timestamp.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </time>
      </div>
    </div>
  );
});
