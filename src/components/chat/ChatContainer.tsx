'use client';

import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import type { Message } from '@/lib/types';

interface ChatContainerProps {
  messages: Message[];
  isLoading: boolean;
  onSend: (message: string) => void;
}

export function ChatContainer({ messages, isLoading, onSend }: ChatContainerProps) {
  return (
    <div className="flex flex-col h-full bg-background">
      <MessageList messages={messages} isLoading={isLoading} />
      <ChatInput onSend={onSend} disabled={isLoading} />
    </div>
  );
}
