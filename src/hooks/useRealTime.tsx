import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface CheckIn {
  id: string;
  user_id: string;
  weather_condition: string;
  temperature: number;
  location: string;
  mood?: string;
  notes?: string;
  created_at: string;
  check_in_date: string;
  display_name?: string;
}

interface UserPresence {
  user_id: string;
  display_name: string;
  online_at: string;
  location: string;
}

export const useRealTime = () => {
  const { user } = useAuth();
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<UserPresence[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch initial check-ins
  const fetchCheckIns = useCallback(async () => {
    const { data: checkInData, error } = await supabase
      .from('check_ins')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    if (!error && checkInData) {
      // Fetch profile data separately for each check-in
      const checkInsWithProfiles = await Promise.all(
        checkInData.map(async (checkIn) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('display_name')
            .eq('user_id', checkIn.user_id)
            .single();
          
          return {
            ...checkIn,
            display_name: profile?.display_name || 'Anonymous'
          };
        })
      );
      
      setCheckIns(checkInsWithProfiles);
    }
    setLoading(false);
  }, []);

  // Update user presence
  const updatePresence = useCallback(async (location: string) => {
    if (!user) return;

    const channel = supabase.channel('user_presence');
    
    const userStatus = {
      user_id: user.id,
      display_name: user.email?.split('@')[0] || 'Anonymous',
      online_at: new Date().toISOString(),
      location
    };

    await channel.track(userStatus);
  }, [user]);

  // Subscribe to presence changes
  useEffect(() => {
    if (!user) return;

    const channel = supabase.channel('user_presence')
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState<UserPresence>();
        const users = Object.values(state).flat();
        setOnlineUsers(users.filter(u => u.user_id !== user.id));
      })
      .on('presence', { event: 'join' }, ({ newPresences }) => {
        console.log('User joined:', newPresences);
      })
      .on('presence', { event: 'leave' }, ({ leftPresences }) => {
        console.log('User left:', leftPresences);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // Subscribe to real-time check-ins
  useEffect(() => {
    if (!user) return;

    fetchCheckIns();

    const channel = supabase
      .channel('check_ins_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'check_ins'
        },
        async (payload) => {
          // Fetch the new check-in with profile data
          const { data: checkInData } = await supabase
            .from('check_ins')
            .select('*')
            .eq('id', payload.new.id)
            .single();

          if (checkInData) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('display_name')
              .eq('user_id', checkInData.user_id)
              .single();

            const checkInWithProfile = {
              ...checkInData,
              display_name: profile?.display_name || 'Anonymous'
            };

            setCheckIns(prev => [checkInWithProfile, ...prev.slice(0, 19)]);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'check_ins'
        },
        async (payload) => {
          const { data: checkInData } = await supabase
            .from('check_ins')
            .select('*')
            .eq('id', payload.new.id)
            .single();

          if (checkInData) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('display_name')
              .eq('user_id', checkInData.user_id)
              .single();

            const checkInWithProfile = {
              ...checkInData,
              display_name: profile?.display_name || 'Anonymous'
            };

            setCheckIns(prev => 
              prev.map(item => item.id === checkInWithProfile.id ? checkInWithProfile : item)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchCheckIns]);

  // Create a new check-in
  const createCheckIn = async (checkInData: {
    weather_condition: string;
    temperature: number;
    location: string;
    mood?: string;
    notes?: string;
  }) => {
    if (!user) return { error: 'User not authenticated' };

    const { data, error } = await supabase
      .from('check_ins')
      .insert([{
        ...checkInData,
        user_id: user.id
      }])
      .select()
      .single();

    return { data, error };
  };

  return {
    checkIns,
    onlineUsers,
    loading,
    createCheckIn,
    updatePresence
  };
};