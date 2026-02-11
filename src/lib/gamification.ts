import type { LevelInfo, ProgressInfo, UserProfile, BadgeDefinition, GamificationEvent, StreakInfo, XPMultiplierInfo } from './types';
import type { LucideIcon } from 'lucide-react';
import {
  MessageSquare, MessagesSquare, Award, Trophy,
  Flame, Zap, Shield, Crown,
  TrendingUp, Medal, Star, Snowflake,
} from 'lucide-react';

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

// ==========================================
// Badge icon mapping (only the 12 we use)
// ==========================================

export const BADGE_ICONS: Record<string, LucideIcon> = {
  MessageSquare,
  MessagesSquare,
  Award,
  Trophy,
  Flame,
  Zap,
  Shield,
  Crown,
  TrendingUp,
  Medal,
  Star,
  Snowflake,
};

// Default badge definitions for demo mode (when Supabase not configured)
export const DEFAULT_BADGE_DEFINITIONS: BadgeDefinition[] = [
  { id: 'first_message', name: 'First Step', description: 'Send your first message', icon_name: 'MessageSquare', category: 'milestone', unlock_criteria: { message_count: 1 }, sort_order: 1 },
  { id: 'messages_10', name: 'Getting Started', description: 'Send 10 messages to your coach', icon_name: 'MessagesSquare', category: 'volume', unlock_criteria: { message_count: 10 }, sort_order: 2 },
  { id: 'messages_50', name: 'Dedicated', description: 'Send 50 messages to your coach', icon_name: 'Award', category: 'volume', unlock_criteria: { message_count: 50 }, sort_order: 3 },
  { id: 'messages_100', name: 'Centurion', description: 'Send 100 messages to your coach', icon_name: 'Trophy', category: 'volume', unlock_criteria: { message_count: 100 }, sort_order: 4 },
  { id: 'streak_3', name: 'Building Habit', description: 'Maintain a 3-day streak', icon_name: 'Flame', category: 'consistency', unlock_criteria: { current_streak: 3 }, sort_order: 5 },
  { id: 'streak_7', name: 'One Week Strong', description: 'Maintain a 7-day streak', icon_name: 'Zap', category: 'consistency', unlock_criteria: { current_streak: 7 }, sort_order: 6 },
  { id: 'streak_14', name: 'Two Week Warrior', description: 'Maintain a 14-day streak', icon_name: 'Shield', category: 'consistency', unlock_criteria: { current_streak: 14 }, sort_order: 7 },
  { id: 'streak_30', name: 'Monthly Master', description: 'Maintain a 30-day streak', icon_name: 'Crown', category: 'consistency', unlock_criteria: { current_streak: 30 }, sort_order: 8 },
  { id: 'level_3', name: 'Rising Up', description: 'Reach Intermediate level (Level 3)', icon_name: 'TrendingUp', category: 'milestone', unlock_criteria: { current_level: 3 }, sort_order: 9 },
  { id: 'level_5', name: 'Athlete Status', description: 'Reach Athlete level (Level 5)', icon_name: 'Medal', category: 'milestone', unlock_criteria: { current_level: 5 }, sort_order: 10 },
  { id: 'level_6', name: 'Champion', description: 'Reach Champion level (Level 6)', icon_name: 'Star', category: 'milestone', unlock_criteria: { current_level: 6 }, sort_order: 11 },
  { id: 'freeze_used', name: 'Safety Net', description: 'Use your first streak freeze', icon_name: 'Snowflake', category: 'milestone', unlock_criteria: { freeze_used: 1 }, sort_order: 12 },
];

export const STREAK_MILESTONES = [3, 7, 14, 30];

// ==========================================
// Streak functions
// ==========================================

function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

function getYesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}

function getDaysBetween(dateA: string, dateB: string): number {
  const a = new Date(dateA + 'T00:00:00');
  const b = new Date(dateB + 'T00:00:00');
  return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}

export function calculateStreak(profile: UserProfile): StreakInfo {
  const today = getToday();
  const lastActive = profile.last_active_date;
  const isActiveToday = lastActive === today;
  const yesterday = getYesterday();
  const streakAtRisk = !isActiveToday && profile.current_streak > 0 && lastActive === yesterday;

  return {
    currentStreak: profile.current_streak,
    longestStreak: profile.longest_streak,
    lastActiveDate: lastActive,
    streakFreezesAvailable: profile.streak_freezes_available,
    lastFreezeDate: profile.last_freeze_date,
    isActiveToday,
    streakAtRisk,
  };
}

export function computeStreakUpdate(profile: UserProfile): {
  updates: Partial<UserProfile>;
  events: GamificationEvent[];
} {
  const today = getToday();
  const lastActive = profile.last_active_date;
  const events: GamificationEvent[] = [];
  const updates: Partial<UserProfile> = {
    last_active_date: today,
  };

  // Already active today — no streak change
  if (lastActive === today) {
    return { updates, events };
  }

  // New active day — increment total
  updates.total_active_days = (profile.total_active_days || 0) + 1;

  const yesterday = getYesterday();

  if (!lastActive || lastActive === yesterday) {
    // Continuing or starting streak
    const newStreak = profile.current_streak + 1;
    updates.current_streak = newStreak;
    updates.longest_streak = Math.max(newStreak, profile.longest_streak);

    // Check streak milestones
    for (const milestone of STREAK_MILESTONES) {
      if (newStreak === milestone) {
        events.push({ type: 'streak_milestone', days: milestone });
      }
    }

    // Award streak freeze every 7 days
    if (newStreak > 0 && newStreak % 7 === 0) {
      updates.streak_freezes_available = profile.streak_freezes_available + 1;
      events.push({ type: 'streak_freeze_earned' });
    }
  } else if (lastActive) {
    const daysMissed = getDaysBetween(lastActive, today);

    if (daysMissed === 2 && profile.streak_freezes_available > 0) {
      // Missed exactly 1 day — auto-use freeze
      const newStreak = profile.current_streak + 1;
      updates.current_streak = newStreak;
      updates.longest_streak = Math.max(newStreak, profile.longest_streak);
      updates.streak_freezes_available = profile.streak_freezes_available - 1;
      updates.last_freeze_date = yesterday;
      events.push({ type: 'streak_freeze_used' });

      // Still check milestones after freeze
      for (const milestone of STREAK_MILESTONES) {
        if (newStreak === milestone) {
          events.push({ type: 'streak_milestone', days: milestone });
        }
      }
    } else {
      // Streak broken — restart at 1
      updates.current_streak = 1;
    }
  }

  return { updates, events };
}

// ==========================================
// Level-up detection
// ==========================================

export function detectLevelUp(
  oldMessageCount: number,
  newMessageCount: number,
): GamificationEvent | null {
  const oldProgress = calculateProgress(oldMessageCount);
  const newProgress = calculateProgress(newMessageCount);

  if (newProgress.level > oldProgress.level) {
    return { type: 'level_up', newLevel: newProgress.level, newName: newProgress.name };
  }
  return null;
}

// ==========================================
// XP multiplier (cosmetic)
// ==========================================

export function calculateXPMultiplier(streak: number): number {
  if (streak >= 30) return 2.0;
  if (streak >= 7) return 1.5;
  return 1.0;
}

export function getXPMultiplierInfo(streak: number): XPMultiplierInfo {
  if (streak >= 30) return { multiplier: 2.0, reason: '30-day streak: 2x XP' };
  if (streak >= 7) return { multiplier: 1.5, reason: '7-day streak: 1.5x XP' };
  return { multiplier: 1.0, reason: '' };
}

// ==========================================
// Badge unlock checking
// ==========================================

export function checkBadgeUnlocks(
  profile: UserProfile,
  allBadges: BadgeDefinition[],
  earnedBadgeIds: Set<string>,
  extraContext?: { freezeUsed?: boolean },
): BadgeDefinition[] {
  const newlyEarned: BadgeDefinition[] = [];

  for (const badge of allBadges) {
    if (earnedBadgeIds.has(badge.id)) continue;

    let qualifies = true;
    for (const [key, threshold] of Object.entries(badge.unlock_criteria)) {
      if (key === 'message_count' && profile.message_count < threshold) {
        qualifies = false;
      } else if (key === 'current_streak' && profile.current_streak < threshold) {
        qualifies = false;
      } else if (key === 'current_level' && profile.current_level < threshold) {
        qualifies = false;
      } else if (key === 'freeze_used' && !extraContext?.freezeUsed) {
        qualifies = false;
      }
    }

    if (qualifies) {
      newlyEarned.push(badge);
    }
  }

  return newlyEarned;
}
