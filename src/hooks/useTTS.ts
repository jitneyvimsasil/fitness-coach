'use client';

import { useState, useCallback, useEffect, useRef } from 'react';

interface UseTTSReturn {
  speak: (text: string) => void;
  stop: () => void;
  isSpeaking: boolean;
  isSupported: boolean;
}

function getPreferredVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  // Prefer high-quality English voices
  const preferred = ['Google', 'Natural', 'Enhanced', 'Premium', 'Microsoft'];
  const english = voices.filter(v => v.lang.startsWith('en'));

  for (const keyword of preferred) {
    const match = english.find(v => v.name.includes(keyword));
    if (match) return match;
  }

  // Fallback to any English voice, or first available
  return english[0] || voices[0] || null;
}

export function useTTS(): UseTTSReturn {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const isSupported =
    typeof window !== 'undefined' && 'speechSynthesis' in window;

  const stop = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    utteranceRef.current = null;
  }, [isSupported]);

  const speak = useCallback(
    (text: string) => {
      if (!isSupported) return;

      // Stop any current speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      // Select best voice
      const voices = window.speechSynthesis.getVoices();
      const voice = getPreferredVoice(voices);
      if (voice) utterance.voice = voice;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        utteranceRef.current = null;
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
        utteranceRef.current = null;
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [isSupported],
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isSupported) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isSupported]);

  return { speak, stop, isSpeaking, isSupported };
}
