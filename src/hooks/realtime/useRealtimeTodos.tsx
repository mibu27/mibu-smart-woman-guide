
import { useState, useEffect, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContext';
import { useErrorHandler } from '../useErrorHandler';
import { TodoItem } from '@/types/shared';

export const useRealtimeTodos = () => {
  const { user } = useAuth();
  const { handleError } = useErrorHandler();
  const [todoItems, setTodoItems] = useState<TodoItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTodos = useCallback(async () => {
    if (!user) {
      setTodoItems([]);
      return;
    }

    try {
      setIsLoading(true);
      const today = new Date().toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('tasks')
        .select('id, title, completed, date')
        .eq('user_id', user.id)
        .eq('date', today)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;

      setTodoItems(data?.map(task => ({
        id: task.id,
        title: task.title,
        completed: task.completed,
        date: task.date
      })) || []);

    } catch (error) {
      handleError(error as Error, 'Error fetching todos');
    } finally {
      setIsLoading(false);
    }
  }, [user, handleError]);

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('todos-realtime')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'tasks',
        filter: `user_id=eq.${user.id}`
      }, () => {
        console.log('Tasks changed, refreshing todos');
        fetchTodos();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchTodos]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  return {
    todoItems,
    isLoading,
    refresh: fetchTodos
  };
};
