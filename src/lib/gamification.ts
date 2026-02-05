import type { LevelInfo, ProgressInfo } from './types';

export const LEVELS: LevelInfo[] = [
  { level: 1, name: 'Beginner', minMessages: 0, xpToNext: 5 },
  { level: 2, name: 'Rookie', minMessages: 5, xpToNext: 10 },
  { level: 3, name: 'Intermediate', minMessages: 15, xpToNext: 15 },
  { level: 4, name: 'Advanced', minMessages: 30, xpToNext: 20 },
  { level: 5, name: 'Athlete', minMessages: 50, xpToNext: 30 },
  { level: 6, name: 'Champion', minMessages: 80, xpToNext: null },
];

export function calculateProgress(messageCount: number): ProgressInfo {
  // Find current level
  let currentLevelIndex = 0;
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (messageCount >= LEVELS[i].minMessages) {
      currentLevelIndex = i;
      break;
    }
  }

  const currentLevel = LEVELS[currentLevelIndex];
  const nextLevel = LEVELS[currentLevelIndex + 1];

  // Calculate progress within current level
  const messagesInLevel = messageCount - currentLevel.minMessages;
  const messagesToNext = nextLevel
    ? nextLevel.minMessages - currentLevel.minMessages
    : 0;

  const progress = messagesToNext > 0
    ? Math.min((messagesInLevel / messagesToNext) * 100, 100)
    : 100;

  return {
    level: currentLevel.level,
    name: currentLevel.name,
    xpCurrent: messagesInLevel,
    xpToNext: messagesToNext,
    progress,
    messagesInLevel,
    messagesToNext: nextLevel ? nextLevel.minMessages - messageCount : 0,
  };
}

export function getLevelName(level: number): string {
  const levelInfo = LEVELS.find(l => l.level === level);
  return levelInfo?.name ?? 'Unknown';
}

export function getNextLevelRequirement(messageCount: number): number | null {
  for (const level of LEVELS) {
    if (messageCount < level.minMessages) {
      return level.minMessages;
    }
  }
  return null;
}

// Level colors for visual theming
export const LEVEL_COLORS: Record<number, { bg: string; text: string; glow: string }> = {
  1: { bg: 'bg-zinc-700', text: 'text-zinc-300', glow: '' },
  2: { bg: 'bg-emerald-900/50', text: 'text-emerald-400', glow: '' },
  3: { bg: 'bg-blue-900/50', text: 'text-blue-400', glow: '' },
  4: { bg: 'bg-purple-900/50', text: 'text-purple-400', glow: '' },
  5: { bg: 'bg-amber-900/50', text: 'text-amber-400', glow: 'shadow-amber-500/20' },
  6: { bg: 'bg-gradient-to-r from-amber-600 to-yellow-500', text: 'text-white', glow: 'shadow-lg shadow-yellow-500/30' },
};
