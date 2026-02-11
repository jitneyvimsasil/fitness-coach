'use client';

import React from 'react';
import { m } from 'motion/react';
import { Dumbbell, Apple, Heart, Compass } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SuggestionCard {
  icon: LucideIcon;
  title: string;
  question: string;
}

const SUGGESTIONS: SuggestionCard[] = [
  {
    icon: Dumbbell,
    title: 'Workout Plan',
    question: 'Can you create a beginner-friendly full-body workout I can do 3 days a week?',
  },
  {
    icon: Apple,
    title: 'Nutrition Tips',
    question: 'What should I eat before and after a workout to maximize results?',
  },
  {
    icon: Heart,
    title: 'Health & Recovery',
    question: 'How can I improve my sleep quality to support muscle recovery?',
  },
  {
    icon: Compass,
    title: 'Getting Started',
    question: "I'm new to fitness. Where should I start and what goals should I set?",
  },
];

interface SuggestionCardsProps {
  onSend: (message: string) => void;
}

export const SuggestionCards = React.memo(function SuggestionCards({ onSend }: SuggestionCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
      {SUGGESTIONS.map((card, index) => {
        const Icon = card.icon;
        return (
          <m.button
            key={card.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 24,
              delay: index * 0.08,
            }}
            onClick={() => onSend(card.question)}
            className={cn(
              'flex items-start gap-3 p-4 rounded-xl text-left',
              'bg-card border border-border',
              'hover:border-primary/40 hover:bg-card/80',
              'active:scale-[0.98]',
              'transition-colors duration-200',
              'cursor-pointer',
            )}
          >
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 flex-shrink-0">
              <Icon className="w-4.5 h-4.5 text-primary" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground">{card.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{card.question}</p>
            </div>
          </m.button>
        );
      })}
    </div>
  );
});
