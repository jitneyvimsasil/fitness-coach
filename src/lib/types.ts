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

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon_name: string;
  unlock_criteria: Record<string, number>;
  earned_at?: string;
}

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
