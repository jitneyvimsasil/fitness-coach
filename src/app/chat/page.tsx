'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChatContainer } from '@/components/chat/ChatContainer';
import { GamificationPanel } from '@/components/gamification/GamificationPanel';
import { Button } from '@/components/ui/button';
import { Dumbbell } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useChat } from '@/hooks/useChat';
import { useProfile } from '@/hooks/useProfile';

export default function ChatPage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const { profile, progress, loading: profileLoading, incrementMessageCount } = useProfile();
  const router = useRouter();

  const { messages, isLoading, stallState, sendMessage, retryMessage } = useChat({
    userId: user?.id,
    onMessageSent: incrementMessageCount,
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [authLoading, user, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">
          <div className="w-12 h-12 rounded-xl bg-primary/20" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Dumbbell className="w-4 h-4 text-primary" />
          </div>
          <h1 className="font-semibold">Fitness Coach</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground hidden sm:block">
            {profile?.display_name || user?.email}
          </span>
          <Button variant="ghost" size="sm" onClick={handleSignOut}>
            Sign out
          </Button>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat area */}
        <main className="flex-1 flex flex-col min-w-0">
          <ChatContainer
            messages={messages}
            isLoading={isLoading}
            stallState={stallState}
            onSend={sendMessage}
            onRetry={retryMessage}
          />
        </main>

        {/* Gamification sidebar - hidden on mobile */}
        <aside className="hidden lg:block w-80 border-l border-border overflow-y-auto">
          <div className="p-4">
            <GamificationPanel
              progress={progress}
              messageCount={profile?.message_count || 0}
              loading={profileLoading}
            />
          </div>
        </aside>
      </div>

      {/* Mobile gamification bar - shown on mobile only */}
      <div className="lg:hidden border-t border-border bg-card p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <span className="text-sm font-bold text-primary">
                {progress?.level || 1}
              </span>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Level</p>
              <p className="text-sm font-medium">{progress?.name || 'Beginner'}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Messages</p>
            <p className="text-sm font-bold">{profile?.message_count || 0}</p>
          </div>
          <div className="w-24">
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${progress?.progress || 0}%` }}
              />
            </div>
            <p className="text-[10px] text-muted-foreground mt-0.5 text-center">
              {progress?.messagesToNext || 0} to next
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

