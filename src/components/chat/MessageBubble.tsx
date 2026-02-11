'use client';

import React from 'react';
import { m } from 'motion/react';
import { Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTTS } from '@/hooks/useTTS';
import type { Message } from '@/lib/types';

interface MessageBubbleProps {
  message: Message;
  onRetry?: (messageId: string) => void;
}

export const MessageBubble = React.memo(function MessageBubble({ message, onRetry }: MessageBubbleProps) {
  const { id, content, isUser, timestamp, isError, retryContent } = message;
  const { speak, stop, isSpeaking, isSupported } = useTTS();

  return (
    <m.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
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
        <div className={cn(
          'flex items-center gap-2 mt-1.5',
          isUser ? 'justify-end' : 'justify-start'
        )}>
          <time
            className="text-[10px] opacity-60"
            aria-label={`Sent at ${timestamp.toLocaleTimeString('en-US')}`}
          >
            {timestamp.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </time>
          {!isUser && isSupported && (
            <button
              onClick={() => isSpeaking ? stop() : speak(content)}
              className="text-muted-foreground/40 hover:text-primary transition-colors"
              aria-label={isSpeaking ? 'Stop speaking' : 'Read aloud'}
            >
              {isSpeaking
                ? <VolumeX className="w-3.5 h-3.5" />
                : <Volume2 className="w-3.5 h-3.5" />
              }
            </button>
          )}
        </div>
      </div>
    </m.div>
  );
});
