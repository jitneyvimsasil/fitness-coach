'use client';

import { useState, useCallback, KeyboardEvent } from 'react';
import { Button } from '@/components/ui/button';
import { MAX_MESSAGE_LENGTH } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

const CHAR_WARNING_THRESHOLD = Math.floor(MAX_MESSAGE_LENGTH * 0.8);

export function ChatInput({ onSend, disabled, placeholder = "Ask your fitness coach..." }: ChatInputProps) {
  const [input, setInput] = useState('');

  const isOverLimit = input.length > MAX_MESSAGE_LENGTH;
  const showCounter = input.length >= CHAR_WARNING_THRESHOLD;

  const handleSend = useCallback(() => {
    if (input.trim() && !disabled && !isOverLimit) {
      onSend(input.trim());
      setInput('');
    }
  }, [input, disabled, isOverLimit, onSend]);

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  return (
    <div className="flex items-end gap-3 p-4 bg-background border-t border-border">
      <div className="relative flex-1">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={MAX_MESSAGE_LENGTH + 100}
          rows={1}
          aria-label="Type your message to the fitness coach"
          className={cn(
            'w-full resize-none rounded-xl border border-border bg-input',
            'px-4 py-3 text-sm md:text-base',
            'placeholder:text-muted-foreground',
            'focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary',
            'transition-all duration-200',
            'min-h-[48px] max-h-[120px]',
            'scrollbar-thin',
            disabled && 'opacity-50 cursor-not-allowed',
            isOverLimit && 'border-destructive focus:ring-destructive/50'
          )}
          style={{
            height: 'auto',
            minHeight: '48px',
          }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = 'auto';
            target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
          }}
        />
        {showCounter && (
          <span
            className={cn(
              'absolute bottom-1.5 right-3 text-[10px]',
              isOverLimit ? 'text-destructive' : 'text-muted-foreground'
            )}
          >
            {input.length}/{MAX_MESSAGE_LENGTH}
          </span>
        )}
      </div>
      <Button
        onClick={handleSend}
        disabled={disabled || !input.trim() || isOverLimit}
        size="lg"
        className={cn(
          'h-12 px-6 rounded-xl',
          'bg-primary hover:bg-primary/90',
          'transition-all duration-200',
          'disabled:opacity-50 disabled:cursor-not-allowed'
        )}
      >
        <SendIcon className="w-5 h-5" />
        <span className="sr-only">Send message</span>
      </Button>
    </div>
  );
}

function SendIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}
