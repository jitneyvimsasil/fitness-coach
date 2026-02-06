'use client';

import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { ErrorBoundary, ChatErrorFallback } from '@/components/ErrorBoundary';
import type { Message } from '@/lib/types';
import type { StallState } from '@/hooks/useChat';

interface ChatContainerProps {
  messages: Message[];
  isLoading: boolean;
  stallState?: StallState;
  onSend: (message: string) => void;
  onRetry?: (messageId: string) => void;
}

export function ChatContainer({ messages, isLoading, stallState, onSend, onRetry }: ChatContainerProps) {
  return (
    <div className="flex flex-col h-full bg-background">
      <ErrorBoundary fallback={<ChatErrorFallback />}>
        <MessageList messages={messages} isLoading={isLoading} stallState={stallState} onRetry={onRetry} />
      </ErrorBoundary>
      <ChatInput onSend={onSend} disabled={isLoading} />
    </div>
  );
}
