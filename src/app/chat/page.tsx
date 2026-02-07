'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChatContainer } from '@/components/chat/ChatContainer';
import { GamificationPanel } from '@/components/gamification/GamificationPanel';
import { Button } from '@/components/ui/button';
import { Dumbbell, LogOut, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useChat } from '@/hooks/useChat';
import { useProfile } from '@/hooks/useProfile';
import { useGamificationToast } from '@/hooks/useGamificationToast';
import { CelebrationToast } from '@/components/gamification/CelebrationToast';
import { GamificationSheet } from '@/components/gamification/GamificationSheet';
import { AvatarPanel } from '@/components/avatar/AvatarPanel';

export default function ChatPage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const {
    profile, progress, loading: profileLoading, incrementMessageCount,
    streakInfo, badgesWithStatus, gamificationEvents, dismissEvent,
  } = useProfile();
  const router = useRouter();

  const { messages, isLoading, stallState, sendMessage, retryMessage, clearMessages } = useChat({
    userId: user?.id,
    onMessageSent: incrementMessageCount,
  });

  const { currentEvent, visible, dismiss } = useGamificationToast(gamificationEvents, dismissEvent);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [authLoading, user, router]);

  const handleSignOut = async () => {
    clearMessages();
    await signOut();
    router.push('/login');
  };

  if (authLoading) {
    return (
      <div className="h-dvh flex items-center justify-center">
        <div className="animate-pulse">
          <div className="w-12 h-12 rounded-xl bg-primary/20" />
        </div>
      </div>
    );
  }

  return (
    <div className="h-dvh flex flex-col overflow-hidden">
      {/* Celebration toast overlay */}
      <CelebrationToast event={currentEvent} visible={visible} onDismiss={dismiss} />

      {/* Header */}
      <header className="flex items-center justify-between px-3 sm:px-4 lg:px-6 py-3 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Dumbbell className="w-4 h-4 text-primary" />
          </div>
          <h1 className="font-semibold">Fitness Coach</h1>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Mobile: avatar + truncated name */}
          <div className="flex items-center gap-2 2xl:hidden">
            <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
              <User className="w-3.5 h-3.5 text-muted-foreground" />
            </div>
            <span className="text-sm text-muted-foreground truncate max-w-[120px] sm:max-w-[200px]">
              {profile?.display_name || user?.email}
            </span>
          </div>
          {/* Desktop (2xl): just name, no avatar (avatar panel visible) */}
          <span className="text-sm text-muted-foreground hidden 2xl:block">
            {profile?.display_name || user?.email}
          </span>
          {/* Sign out: icon on mobile, text on sm+ */}
          <Button variant="ghost" size="sm" onClick={handleSignOut} className="flex-shrink-0">
            <LogOut className="w-4 h-4 sm:hidden" />
            <span className="hidden sm:inline">Sign out</span>
            <span className="sr-only sm:hidden">Sign out</span>
          </Button>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Avatar panel — large desktop only */}
        <div className="hidden 2xl:contents">
          <AvatarPanel />
        </div>

        {/* Chat area */}
        <main className="flex-1 flex flex-col min-w-0 min-h-0">
          <ChatContainer
            messages={messages}
            isLoading={isLoading}
            stallState={stallState}
            onSend={sendMessage}
            onRetry={retryMessage}
          />
        </main>

        {/* Gamification sidebar — desktop only */}
        <aside className="hidden lg:block w-80 border-l border-border overflow-y-auto flex-shrink-0 bg-card/50">
          <div className="p-4">
            <GamificationPanel
              progress={progress}
              messageCount={profile?.message_count || 0}
              streakInfo={streakInfo}
              badges={badgesWithStatus}
              loading={profileLoading}
            />
          </div>
        </aside>
      </div>

      {/* Mobile/tablet gamification access — FAB + bottom sheet */}
      <GamificationSheet
        progress={progress}
        messageCount={profile?.message_count || 0}
        streakInfo={streakInfo}
        badges={badgesWithStatus}
        loading={profileLoading}
      />
    </div>
  );
}

