'use client';

import { useState, useCallback } from 'react';
import { v4 as uuid } from 'uuid';
import { sendMessage as apiSendMessage } from '@/lib/api';
import type { Message } from '@/lib/types';

interface UseChatOptions {
  onMessageSent?: () => void;
  userId?: string;
}

export function useChat(options: UseChatOptions = {}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    setError(null);

    // Add user message immediately
    const userMessage: Message = {
      id: uuid(),
      content: content.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await apiSendMessage({
        message: content.trim(),
        userId: options.userId,
      });

      if (response.success) {
        const aiMessage: Message = {
          id: uuid(),
          content: response.data.message,
          isUser: false,
          timestamp: new Date(response.data.timestamp),
        };

        setMessages(prev => [...prev, aiMessage]);

        // Callback for gamification updates
        options.onMessageSent?.();
      } else {
        setError(response.error || 'Failed to get response');
        // Add error message to chat
        const errorMessage: Message = {
          id: uuid(),
          content: "Sorry, I couldn't process your message. Please try again.",
          isUser: false,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (err) {
      console.error('Chat error:', err);
      setError('Network error. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, options]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
  };
}
