'use client';

import { useState, useEffect, useCallback } from 'react';
import type { GamificationEvent } from '@/lib/types';

const DISPLAY_DURATION = 4000; // 4 seconds
const EXIT_ANIMATION_DURATION = 300; // match CSS transition

export function useGamificationToast(
  events: GamificationEvent[],
  onDismiss: () => void,
) {
  const [currentEvent, setCurrentEvent] = useState<GamificationEvent | null>(null);
  const [visible, setVisible] = useState(false);

  const dismiss = useCallback(() => {
    setVisible(false);
    setTimeout(() => {
      setCurrentEvent(null);
      onDismiss();
    }, EXIT_ANIMATION_DURATION);
  }, [onDismiss]);

  useEffect(() => {
    if (events.length > 0 && !currentEvent) {
      setCurrentEvent(events[0]);
      setVisible(true);

      const timer = setTimeout(dismiss, DISPLAY_DURATION);
      return () => clearTimeout(timer);
    }
  }, [events, currentEvent, dismiss]);

  return { currentEvent, visible, dismiss };
}
