'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { v4 as uuid } from 'uuid';
import { sendMessage as apiSendMessage } from '@/lib/api';
import type { Message } from '@/lib/types';

interface UseChatOptions {
  onMessageSent?: () => void;
  userId?: string;
}

export type StallState = 'normal' | 'slow' | 'stalled';

const STORAGE_KEY = 'fitness-coach-messages';
const SLOW_THRESHOLD_MS = 8_000;
const STALLED_THRESHOLD_MS = 20_000;

function loadMessages(): Message[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return parsed.map((m: Message & { timestamp: string }) => ({
      ...m,
      timestamp: new Date(m.timestamp),
    }));
  } catch {
    return [];
  }
}

function saveMessages(messages: Message[]) {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch {
    // sessionStorage full or unavailable
  }
}

export function useChat(options: UseChatOptions = {}) {
  const { onMessageSent, userId } = options;

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stallState, setStallState] = useState<StallState>('normal');

  const abortRef = useRef<AbortController | null>(null);
  const stallTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const hasMounted = useRef(false);

  // Load messages from sessionStorage after mount (avoids hydration mismatch)
  useEffect(() => {
    const stored = loadMessages();
    if (stored.length > 0) {
      setMessages(stored);
    }
    hasMounted.current = true;
  }, []);

  // Persist messages to sessionStorage (skip until after initial load)
  useEffect(() => {
    if (hasMounted.current) {
      saveMessages(messages);
    }
  }, [messages]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      stallTimersRef.current.forEach(clearTimeout);
    };
  }, []);

  const clearStallTimers = useCallback(() => {
    stallTimersRef.current.forEach(clearTimeout);
    stallTimersRef.current = [];
    setStallState('normal');
  }, []);

  const startStallTimers = useCallback(() => {
    clearStallTimers();
    stallTimersRef.current.push(
      setTimeout(() => setStallState('slow'), SLOW_THRESHOLD_MS),
      setTimeout(() => setStallState('stalled'), STALLED_THRESHOLD_MS),
    );
  }, [clearStallTimers]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    // Abort any in-flight request
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    setError(null);

    const userMessage: Message = {
      id: uuid(),
      content: content.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    startStallTimers();

    try {
      const response = await apiSendMessage(
        { message: content.trim(), userId },
        abortRef.current.signal,
      );

      clearStallTimers();

      if (response.success) {
        const aiMessage: Message = {
          id: uuid(),
          content: response.data.message,
          isUser: false,
          timestamp: new Date(response.data.timestamp),
        };

        setMessages(prev => [...prev, aiMessage]);
        onMessageSent?.();
      } else {
        setError(response.error || 'Failed to get response');
        const errorMessage: Message = {
          id: uuid(),
          content: response.error || "Sorry, I couldn't process your message. Please try again.",
          isUser: false,
          timestamp: new Date(),
          isError: true,
          retryContent: content.trim(),
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (err) {
      clearStallTimers();
      if (err instanceof DOMException && err.name === 'AbortError') return;
      console.error('Chat error:', err);
      setError('Network error. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, userId, onMessageSent, startStallTimers, clearStallTimers]);

  const retryMessage = useCallback((messageId: string) => {
    const errorMsg = messages.find(m => m.id === messageId);
    if (!errorMsg?.retryContent) return;

    // Remove the error message before retrying
    setMessages(prev => prev.filter(m => m.id !== messageId));
    sendMessage(errorMsg.retryContent);
  }, [messages, sendMessage]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
    sessionStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    messages,
    isLoading,
    error,
    stallState,
    sendMessage,
    retryMessage,
    clearMessages,
  };
}
