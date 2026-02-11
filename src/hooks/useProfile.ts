'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import {
  calculateProgress,
  calculateStreak,
  computeStreakUpdate,
  detectLevelUp,
  checkBadgeUnlocks,
  DEFAULT_BADGE_DEFINITIONS,
} from '@/lib/gamification';
import type {
  UserProfile,
  ProgressInfo,
  StreakInfo,
  BadgeDefinition,
  EarnedBadge,
  BadgeWithStatus,
  GamificationEvent,
} from '@/lib/types';
import type { AuthChangeEvent } from '@supabase/supabase-js';

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [progress, setProgress] = useState<ProgressInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [streakInfo, setStreakInfo] = useState<StreakInfo | null>(null);
  const [badgeDefinitions, setBadgeDefinitions] = useState<BadgeDefinition[]>([]);
  const [earnedBadges, setEarnedBadges] = useState<EarnedBadge[]>([]);
  const [gamificationEvents, setGamificationEvents] = useState<GamificationEvent[]>([]);
  const earnedBadgeIdsRef = useRef(new Set<string>());

  const isConfigured = useMemo(() => isSupabaseConfigured(), []);
  const supabase = useMemo(() => isConfigured ? createClient() : null, [isConfigured]);

  // Merge badge definitions with earned status
  const badgesWithStatus: BadgeWithStatus[] = useMemo(() => {
    const earnedMap = new Map(earnedBadges.map(b => [b.badge_id, b.earned_at]));
    return badgeDefinitions.map(def => ({
      ...def,
      earned: earnedMap.has(def.id),
      earned_at: earnedMap.get(def.id),
    }));
  }, [badgeDefinitions, earnedBadges]);

  // Keep ref in sync with earned badges state
  useEffect(() => {
    earnedBadgeIdsRef.current = new Set(earnedBadges.map(b => b.badge_id));
  }, [earnedBadges]);

  // Dismiss the first event in the queue
  const dismissEvent = useCallback(() => {
    setGamificationEvents(prev => prev.slice(1));
  }, []);

  // Fetch profile + badges
  const fetchProfile = useCallback(async () => {
    if (!supabase) {
      setLoading(false);
      setProgress(calculateProgress(0));
      setBadgeDefinitions(DEFAULT_BADGE_DEFINITIONS);
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setProfile(null);
        setProgress(null);
        setStreakInfo(null);
        setEarnedBadges([]);
        setLoading(false);
        return;
      }

      // Fetch profile, badge definitions, and earned badges in parallel
      const [profileResult, badgeDefsResult, earnedResult] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('badge_definitions').select('*').order('sort_order'),
        supabase.from('user_badges').select('badge_id, earned_at').eq('user_id', user.id),
      ]);

      // Set badge definitions (fallback to defaults if table doesn't exist yet)
      if (badgeDefsResult.data && badgeDefsResult.data.length > 0) {
        setBadgeDefinitions(badgeDefsResult.data);
      } else {
        setBadgeDefinitions(DEFAULT_BADGE_DEFINITIONS);
      }

      // Set earned badges
      if (earnedResult.data) {
        setEarnedBadges(earnedResult.data);
      }

      if (profileResult.error) {
        if (profileResult.error.code === 'PGRST116') {
          // Create initial profile for new user
          const newProfile: Partial<UserProfile> = {
            id: user.id,
            email: user.email || '',
            display_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
            message_count: 0,
            current_level: 1,
            level_name: 'Beginner',
            current_streak: 0,
            longest_streak: 0,
            last_active_date: null,
            streak_freezes_available: 0,
            last_freeze_date: null,
            total_active_days: 0,
          };

          const { data: created, error: createError } = await supabase
            .from('profiles')
            .insert(newProfile)
            .select()
            .single();

          if (createError) throw createError;
          setProfile(created);
          setProgress(calculateProgress(0));
          setStreakInfo(calculateStreak(created));
        } else {
          throw profileResult.error;
        }
      } else {
        const data = profileResult.data;
        setProfile(data);
        setProgress(calculateProgress(data.message_count));
        setStreakInfo(calculateStreak(data));
      }
    } catch (err) {
      console.error('Profile fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  // Increment message count with full gamification logic
  const incrementMessageCount = useCallback(async () => {
    if (!profile) return;

    const oldCount = profile.message_count;
    const newCount = oldCount + 1;
    const newProgress = calculateProgress(newCount);
    const events: GamificationEvent[] = [];

    // 1. Detect level-up
    const levelEvent = detectLevelUp(oldCount, newCount);
    if (levelEvent) events.push(levelEvent);

    // 2. Compute streak update
    const { updates: streakUpdates, events: streakEvents } = computeStreakUpdate(profile);
    events.push(...streakEvents);

    // 3. Build updated profile for badge checking
    const updatedProfile: UserProfile = {
      ...profile,
      message_count: newCount,
      current_level: newProgress.level,
      level_name: newProgress.name,
      ...streakUpdates,
      updated_at: new Date().toISOString(),
    };

    // 4. Check badge unlocks (use ref for always-current earned set)
    const freezeUsed = streakEvents.some(e => e.type === 'streak_freeze_used');
    const newBadges = checkBadgeUnlocks(
      updatedProfile,
      badgeDefinitions,
      earnedBadgeIdsRef.current,
      { freezeUsed },
    );
    for (const badge of newBadges) {
      events.push({ type: 'badge_earned', badge });
    }

    // 5. Optimistic local updates
    setProfile(updatedProfile);
    setProgress(newProgress);
    setStreakInfo(calculateStreak(updatedProfile));
    if (newBadges.length > 0) {
      // Update ref immediately to prevent duplicates on rapid calls
      for (const b of newBadges) {
        earnedBadgeIdsRef.current.add(b.id);
      }
      setEarnedBadges(prev => [
        ...prev,
        ...newBadges.map(b => ({ badge_id: b.id, earned_at: new Date().toISOString() })),
      ]);
    }
    if (events.length > 0) {
      setGamificationEvents(prev => [...prev, ...events]);
    }

    // 6. Persist to Supabase
    if (supabase) {
      try {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            message_count: newCount,
            current_level: newProgress.level,
            level_name: newProgress.name,
            ...streakUpdates,
            updated_at: new Date().toISOString(),
          })
          .eq('id', profile.id);

        if (updateError) throw updateError;

        // Upsert newly earned badges (ignoreDuplicates prevents constraint errors)
        if (newBadges.length > 0) {
          const { error: badgeError } = await supabase.from('user_badges').upsert(
            newBadges.map(b => ({
              user_id: profile.id,
              badge_id: b.id,
              earned_at: new Date().toISOString(),
            })),
            { onConflict: 'user_id,badge_id', ignoreDuplicates: true },
          );
          if (badgeError) console.error('Badge persistence failed:', badgeError.message, badgeError.code, badgeError.details);
        }
      } catch (err) {
        console.error('Failed to update profile:', err);
        // Revert optimistic update
        setProfile(profile);
        setProgress(calculateProgress(oldCount));
        setStreakInfo(calculateStreak(profile));
        if (newBadges.length > 0) {
          // Revert ref
          for (const b of newBadges) {
            earnedBadgeIdsRef.current.delete(b.id);
          }
          setEarnedBadges(prev => prev.filter(
            b => !newBadges.some(nb => nb.id === b.badge_id),
          ));
        }
        setGamificationEvents(prev => prev.filter(e => !events.includes(e)));
      }
    }
  }, [profile, supabase, badgeDefinitions]);

  // Initial fetch
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Listen for auth changes
  useEffect(() => {
    if (!supabase) return;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent) => {
        if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
          fetchProfile();
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase, fetchProfile]);

  return {
    profile,
    progress,
    loading,
    error,
    streakInfo,
    badgesWithStatus,
    gamificationEvents,
    dismissEvent,
    incrementMessageCount,
    refreshProfile: fetchProfile,
    isConfigured,
  };
}
