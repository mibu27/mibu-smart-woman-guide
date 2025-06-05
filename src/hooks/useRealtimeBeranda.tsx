
import { useState, useEffect, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContext';
import { useErrorHandler } from './useErrorHandler';

interface TodoItem {
  id: string;
  title: string;
  completed: boolean;
  date: string;
}

interface ImportantEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
}

interface ShoppingItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  purchased?: boolean;
}

interface BerandaData {
  todoItems: TodoItem[];
  importantEvents: ImportantEvent[];
  shoppingList: ShoppingItem[];
  isLoading: boolean;
  lastUpdated: Date;
}

export const useRealtimeBeranda = () => {
  const { user } = useAuth();
  const { handleError } = useErrorHandler();
  const [data, setData] = useState<BerandaData>({
    todoItems: [],
    importantEvents: [],
    shoppingList: [],
    isLoading: true,
    lastUpdated: new Date()
  });

  const fetchBerandaData = useCallback(async () => {
    if (!user) {
      setData(prev => ({ ...prev, isLoading: false }));
      return;
    }

    try {
      setData(prev => ({ ...prev, isLoading: true }));
      const today = new Date().toISOString().split('T')[0];
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);

      console.log('Fetching Beranda data for user:', user.id);

      // Parallel fetch untuk performance
      const [tasksResult, eventsResult, shoppingResult] = await Promise.all([
        supabase
          .from('tasks')
          .select('id, title, completed, date')
          .eq('user_id', user.id)
          .eq('date', today)
          .order('created_at', { ascending: false })
          .limit(5),
        
        supabase
          .from('events')
          .select('id, title, description, date, time')
          .eq('user_id', user.id)
          .gte('date', today)
          .lte('date', nextWeek.toISOString().split('T')[0])
          .order('date', { ascending: true })
          .limit(5),
        
        supabase
          .from('shopping_items')
          .select('id, name, price, quantity')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5)
      ]);

      const newData: BerandaData = {
        todoItems: tasksResult.data?.map(task => ({
          id: task.id,
          title: task.title,
          completed: task.completed,
          date: task.date
        })) || [],
        importantEvents: eventsResult.data?.map(event => ({
          id: event.id,
          title: event.title,
          description: event.description || '',
          date: event.date,
          time: event.time || ''
        })) || [],
        shoppingList: shoppingResult.data?.map(item => ({
          id: item.id,
          name: item.name,
          price: Number(item.price),
          quantity: item.quantity,
          purchased: false
        })) || [],
        isLoading: false,
        lastUpdated: new Date()
      };

      console.log('Beranda data fetched:', newData);
      setData(newData);

      // Log errors if any
      if (tasksResult.error) console.error('Tasks error:', tasksResult.error);
      if (eventsResult.error) console.error('Events error:', eventsResult.error);
      if (shoppingResult.error) console.error('Shopping error:', shoppingResult.error);

    } catch (error) {
      handleError(error as Error, 'Error fetching Beranda data');
      setData(prev => ({ ...prev, isLoading: false }));
    }
  }, [user, handleError]);

  // Setup real-time subscriptions
  useEffect(() => {
    if (!user) return;

    console.log('Setting up real-time subscriptions for Beranda');

    // Subscribe to tasks changes
    const tasksChannel = supabase
      .channel('beranda-tasks')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'tasks',
        filter: `user_id=eq.${user.id}`
      }, () => {
        console.log('Tasks changed, refreshing Beranda');
        fetchBerandaData();
      })
      .subscribe();

    // Subscribe to events changes
    const eventsChannel = supabase
      .channel('beranda-events')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'events',
        filter: `user_id=eq.${user.id}`
      }, () => {
        console.log('Events changed, refreshing Beranda');
        fetchBerandaData();
      })
      .subscribe();

    // Subscribe to shopping items changes
    const shoppingChannel = supabase
      .channel('beranda-shopping')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'shopping_items',
        filter: `user_id=eq.${user.id}`
      }, () => {
        console.log('Shopping items changed, refreshing Beranda');
        fetchBerandaData();
      })
      .subscribe();

    // Subscribe to expenses changes (affects shopping budget)
    const expensesChannel = supabase
      .channel('beranda-expenses')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'expenses',
        filter: `user_id=eq.${user.id}`
      }, () => {
        console.log('Expenses changed, refreshing Beranda');
        fetchBerandaData();
      })
      .subscribe();

    return () => {
      console.log('Cleaning up Beranda real-time subscriptions');
      supabase.removeChannel(tasksChannel);
      supabase.removeChannel(eventsChannel);
      supabase.removeChannel(shoppingChannel);
      supabase.removeChannel(expensesChannel);
    };
  }, [user, fetchBerandaData]);

  // Initial data fetch
  useEffect(() => {
    fetchBerandaData();
  }, [fetchBerandaData]);

  return {
    ...data,
    refresh: fetchBerandaData
  };
};
