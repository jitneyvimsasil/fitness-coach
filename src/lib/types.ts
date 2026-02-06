export const MAX_MESSAGE_LENGTH = 2000;

export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  isError?: boolean;
  retryContent?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  display_name: string;
  message_count: number;
  current_level: number;
  level_name: string;
  current_streak: number;
  longest_streak: number;
  last_active_date: string | null;
  streak_freezes_available: number;
  last_freeze_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface LevelInfo {
  level: number;
  name: string;
  minMessages: number;
  xpToNext: number | null;
}

export interface ProgressInfo {
  level: number;
  name: string;
  xpCurrent: number;
  xpToNext: number;
  progress: number;
  messagesInLevel: number;
  messagesToNext: number;
}

// --- Badge types ---
export interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  icon_name: string;
  category: 'milestone' | 'consistency' | 'volume' | 'exploration';
  unlock_criteria: Record<string, number>;
  sort_order: number;
}

/** @deprecated Use BadgeDefinition instead */
export type Badge = BadgeDefinition;

export interface EarnedBadge {
  badge_id: string;
  earned_at: string;
}

export interface BadgeWithStatus extends BadgeDefinition {
  earned: boolean;
  earned_at?: string;
}

// --- Streak types ---
export interface StreakInfo {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null;
  streakFreezesAvailable: number;
  lastFreezeDate: string | null;
  isActiveToday: boolean;
  streakAtRisk: boolean;
}

export interface XPMultiplierInfo {
  multiplier: number;
  reason: string;
}

// --- Gamification events for celebrations ---
export type GamificationEvent =
  | { type: 'level_up'; newLevel: number; newName: string }
  | { type: 'badge_earned'; badge: BadgeDefinition }
  | { type: 'streak_milestone'; days: number }
  | { type: 'streak_freeze_used' }
  | { type: 'streak_freeze_earned' };

export interface ChatResponse {
  success: boolean;
  data: {
    message: string;
    timestamp: string;
  };
  error?: string;
}

export interface ChatRequest {
  message: string;
  userId?: string;
}
