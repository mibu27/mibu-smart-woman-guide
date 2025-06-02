
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContext';
import { toast } from "sonner";

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  date: string;
}

interface ImportantEvent {
  id: string;
  text: string;
  location: string;
  date: Date;
  time?: string;
}

export const useJadwal = () => {
  const { user } = useAuth();
  const [todoList, setTodoList] = useState<TodoItem[]>([]);
  const [importantEvents, setImportantEvents] = useState<ImportantEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data from database
  const fetchData = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      
      // Fetch today's tasks
      const today = new Date().toISOString().split('T')[0];
      const { data: tasksData, error: tasksError } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today);

      if (tasksError) throw tasksError;

      if (tasksData) {
        setTodoList(tasksData.map(task => ({
          id: task.id,
          text: task.title,
          completed: task.completed,
          date: task.date
        })));
      }

      // Fetch events
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: true });

      if (eventsError) throw eventsError;

      if (eventsData) {
        setImportantEvents(eventsData.map(event => ({
          id: event.id,
          text: event.title,
          location: event.description || '',
          date: new Date(event.date),
          time: event.time || undefined
        })));
      }

    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Gagal memuat data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  // Add new todo
  const addTodo = async (text: string) => {
    if (!user || !text.trim()) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          user_id: user.id,
          title: text,
          date: today,
          completed: false,
          category: 'umum'
        })
        .select()
        .single();

      if (error) throw error;

      const newTodo: TodoItem = {
        id: data.id,
        text: data.title,
        completed: data.completed,
        date: data.date
      };

      setTodoList(prev => [...prev, newTodo]);
      toast.success('Tugas berhasil ditambahkan');
    } catch (error) {
      console.error('Error adding todo:', error);
      toast.error('Gagal menambah tugas');
    }
  };

  // Toggle todo completion
  const toggleTodo = async (id: string) => {
    try {
      const todo = todoList.find(t => t.id === id);
      if (!todo) return;

      const { error } = await supabase
        .from('tasks')
        .update({ completed: !todo.completed })
        .eq('id', id);

      if (error) throw error;

      setTodoList(prev => prev.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      ));
    } catch (error) {
      console.error('Error updating todo:', error);
      toast.error('Gagal mengupdate tugas');
    }
  };

  // Remove todo
  const removeTodo = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTodoList(prev => prev.filter(todo => todo.id !== id));
      toast.success('Tugas berhasil dihapus');
    } catch (error) {
      console.error('Error removing todo:', error);
      toast.error('Gagal menghapus tugas');
    }
  };

  // Add new event
  const addEvent = async (text: string, location: string, date: Date, time?: string) => {
    if (!user || !text.trim() || !location.trim()) return;

    try {
      const { data, error } = await supabase
        .from('events')
        .insert({
          user_id: user.id,
          title: text,
          description: location,
          date: date.toISOString().split('T')[0],
          time: time || null,
          category: 'umum'
        })
        .select()
        .single();

      if (error) throw error;

      const newEvent: ImportantEvent = {
        id: data.id,
        text: data.title,
        location: data.description || '',
        date: new Date(data.date),
        time: data.time || undefined
      };

      setImportantEvents(prev => [...prev, newEvent]);
      toast.success('Acara berhasil ditambahkan');
    } catch (error) {
      console.error('Error adding event:', error);
      toast.error('Gagal menambah acara');
    }
  };

  // Remove event
  const removeEvent = async (id: string) => {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setImportantEvents(prev => prev.filter(event => event.id !== id));
      toast.success('Acara berhasil dihapus');
    } catch (error) {
      console.error('Error removing event:', error);
      toast.error('Gagal menghapus acara');
    }
  };

  // Update event date
  const updateEventDate = async (id: string, newDate: Date) => {
    try {
      const { error } = await supabase
        .from('events')
        .update({ date: newDate.toISOString().split('T')[0] })
        .eq('id', id);

      if (error) throw error;

      setImportantEvents(prev => prev.map(event => 
        event.id === id ? { ...event, date: newDate } : event
      ));
    } catch (error) {
      console.error('Error updating event date:', error);
      toast.error('Gagal mengupdate tanggal acara');
    }
  };

  return {
    todoList,
    importantEvents,
    isLoading,
    addTodo,
    toggleTodo,
    removeTodo,
    addEvent,
    removeEvent,
    updateEventDate,
    refreshData: fetchData
  };
};
