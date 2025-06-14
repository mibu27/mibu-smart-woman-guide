
import { useState, useEffect, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContext';
import { useErrorHandler } from '../useErrorHandler';
import { ImportantEvent } from '@/types/shared';

export const useRealtimeEvents = () => {
  const { user } = useAuth();
  const { handleError } = useErrorHandler();
  const [importantEvents, setImportantEvents] = useState<ImportantEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchEvents = useCallback(async () => {
    if (!user) {
      setImportantEvents([]);
      return;
    }

    try {
      setIsLoading(true);
      const today = new Date().toISOString().split('T')[0];
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);

      const { data, error } = await supabase
        .from('events')
        .select('id, title, description, date, time')
        .eq('user_id', user.id)
        .gte('date', today)
        .lte('date', nextWeek.toISOString().split('T')[0])
        .order('date', { ascending: true })
        .limit(5);

      if (error) throw error;

      setImportantEvents(data?.map(event => ({
        id: event.id,
        title: event.title,
        description: event.description || '',
        date: event.date,
        time: event.time || ''
      })) || []);

    } catch (error) {
      handleError(error as Error, 'Error fetching events');
    } finally {
      setIsLoading(false);
    }
  }, [user, handleError]);

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('events-realtime')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'events',
        filter: `user_id=eq.${user.id}`
      }, () => {
        console.log('Events changed, refreshing events');
        fetchEvents();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchEvents]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return {
    importantEvents,
    isLoading,
    refresh: fetchEvents
  };
};
