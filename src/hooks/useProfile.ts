'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { calculateProgress } from '@/lib/gamification';
import type { UserProfile, ProgressInfo } from '@/lib/types';
import type { AuthChangeEvent } from '@supabase/supabase-js';

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [progress, setProgress] = useState<ProgressInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isConfigured = useMemo(() => isSupabaseConfigured(), []);
  const supabase = useMemo(() => isConfigured ? createClient() : null, [isConfigured]);

  // Fetch profile
  const fetchProfile = useCallback(async () => {
    if (!supabase) {
      setLoading(false);
      // Set default progress for demo mode
      setProgress(calculateProgress(0));
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setProfile(null);
        setProgress(null);
        setLoading(false);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (fetchError) {
        // Profile might not exist yet (new user)
        if (fetchError.code === 'PGRST116') {
          // Create initial profile
          const newProfile: Partial<UserProfile> = {
            id: user.id,
            email: user.email || '',
            display_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
            message_count: 0,
            current_level: 1,
            level_name: 'Beginner',
          };

          const { data: created, error: createError } = await supabase
            .from('profiles')
            .insert(newProfile)
            .select()
            .single();

          if (createError) throw createError;
          setProfile(created);
          setProgress(calculateProgress(0));
        } else {
          throw fetchError;
        }
      } else {
        setProfile(data);
        setProgress(calculateProgress(data.message_count));
      }
    } catch (err) {
      console.error('Profile fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  // Increment message count
  const incrementMessageCount = useCallback(async () => {
    if (!supabase || !profile) {
      // Demo mode: just update local state
      setProfile(prev => {
        if (!prev) return prev;
        const newCount = prev.message_count + 1;
        const newProgress = calculateProgress(newCount);
        setProgress(newProgress);
        return { ...prev, message_count: newCount, current_level: newProgress.level, level_name: newProgress.name };
      });
      return;
    }

    const newCount = profile.message_count + 1;
    const newProgress = calculateProgress(newCount);

    // Optimistically update local state
    setProfile(prev => prev ? { ...prev, message_count: newCount, current_level: newProgress.level, level_name: newProgress.name } : null);
    setProgress(newProgress);

    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          message_count: newCount,
          current_level: newProgress.level,
          level_name: newProgress.name,
          updated_at: new Date().toISOString(),
        })
        .eq('id', profile.id);

      if (updateError) throw updateError;
    } catch (err) {
      console.error('Failed to update message count:', err);
      // Revert optimistic update
      setProfile(prev => prev ? { ...prev, message_count: profile.message_count } : null);
      setProgress(calculateProgress(profile.message_count));
    }
  }, [profile, supabase]);

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
    incrementMessageCount,
    refreshProfile: fetchProfile,
    isConfigured,
  };
}
