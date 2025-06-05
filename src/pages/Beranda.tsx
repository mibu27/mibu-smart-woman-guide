import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, RefreshCw } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { BudgetAlert } from '@/components/beranda/BudgetAlert';
import { ShortcutsSection } from '@/components/beranda/ShortcutsSection';
import { useExpenseRecording } from '@/hooks/useExpenseRecording';
import { useCentralizedBudget } from '@/hooks/useCentralizedBudget';
import { toast } from "sonner";

// TypeScript interfaces for our data types
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

const Beranda = () => {
  const { user } = useAuth();
  const { recordExpense, removeExpense } = useExpenseRecording();
  const { 
    batasHarian, 
    totalSpending, 
    isOverBudget, 
    formatIDR, 
    refreshBudgetData,
    loading: budgetLoading 
  } = useCentralizedBudget();
  
  const [todoItems, setTodoItems] = useState<TodoItem[]>([]);
  const [importantEvents, setImportantEvents] = useState<ImportantEvent[]>([]);
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    try {
      const today = new Date().toISOString().split('T')[0];

      // Use Promise.all for parallel data fetching to improve performance
      const [tasksResult, eventsResult, shoppingResult] = await Promise.all([
        // Fetch today's tasks
        supabase.from('tasks').select('id, title, completed, date').eq('user_id', user.id).eq('date', today).limit(3),
        
        // Fetch upcoming events (next 7 days)
        (() => {
          const nextWeek = new Date();
          nextWeek.setDate(nextWeek.getDate() + 7);
          return supabase.from('events').select('id, title, description, date, time').eq('user_id', user.id).gte('date', today).lte('date', nextWeek.toISOString().split('T')[0]).order('date', { ascending: true }).limit(3);
        })(),
        
        // Fetch recent shopping items
        supabase.from('shopping_items').select('id, name, price, quantity').eq('user_id', user.id).order('created_at', { ascending: false }).limit(3)
      ]);

      // Process tasks
      if (tasksResult.error) {
        console.error('Error fetching tasks:', tasksResult.error);
      } else if (tasksResult.data) {
        setTodoItems(tasksResult.data.map(task => ({
          id: task.id,
          title: task.title,
          completed: task.completed,
          date: task.date
        })));
      }

      // Process events
      if (eventsResult.error) {
        console.error('Error fetching events:', eventsResult.error);
      } else if (eventsResult.data) {
        setImportantEvents(eventsResult.data.map(event => ({
          id: event.id,
          title: event.title,
          description: event.description || '',
          date: event.date,
          time: event.time || ''
        })));
      }

      // Process shopping items
      if (shoppingResult.error) {
        console.error('Error fetching shopping items:', shoppingResult.error);
      } else if (shoppingResult.data) {
        setShoppingList(shoppingResult.data.map(item => ({
          id: item.id,
          name: item.name,
          price: Number(item.price),
          quantity: item.quantity,
          purchased: false
        })));
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchData(), refreshBudgetData()]);
  };

  // Add toggle function for todo items
  const toggleTodoItem = async (todoId: string) => {
    const todo = todoItems.find(item => item.id === todoId);
    if (!todo) return;

    const newCompletedState = !todo.completed;
    
    // Optimistic update
    setTodoItems(prev => 
      prev.map(item => 
        item.id === todoId 
          ? { ...item, completed: newCompletedState }
          : item
      )
    );

    try {
      const { error } = await supabase
        .from('tasks')
        .update({ completed: newCompletedState })
        .eq('id', todoId);

      if (error) throw error;
      
      toast.success(newCompletedState ? 'Tugas diselesaikan!' : 'Tugas dibatalkan');
    } catch (error) {
      // Revert optimistic update on error
      setTodoItems(prev => 
        prev.map(item => 
          item.id === todoId 
            ? { ...item, completed: !newCompletedState }
            : item
        )
      );
      console.error('Error updating todo:', error);
      toast.error('Gagal mengupdate tugas');
    }
  };

  const toggleShoppingItem = async (itemId: string) => {
    const item = shoppingList.find(item => item.id === itemId);
    if (!item) return;

    const newPurchasedState = !item.purchased;
    
    // Update local state
    setShoppingList(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { ...item, purchased: newPurchasedState }
          : item
      )
    );

    // Record or remove expense based on new state
    if (newPurchasedState) {
      await recordExpense(item.name, item.price);
      // Refresh budget data to reflect new expense
      await refreshBudgetData();
    } else {
      await removeExpense(item.name, item.price);
      // Refresh budget data to reflect removed expense
      await refreshBudgetData();
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  };

  if (!user) {
    return <MainLayout title="Beranda">
        <div className="text-center py-8">
          <p className="text-gray-500">Silakan login untuk menggunakan fitur aplikasi</p>
        </div>
      </MainLayout>;
  }
  
  return <MainLayout title="Beranda">
      <div className="space-y-6">
        {/* Header with refresh button */}
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold">Selamat datang!</h1>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing || budgetLoading} className="text-mibu-purple border-mibu-purple">
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Budget Alert - Show if over budget */}
        <BudgetAlert isOverBudget={isOverBudget} totalSpending={totalSpending} batasHarian={batasHarian} formatIDR={formatIDR} />

        {/* Shortcuts */}
        <ShortcutsSection />

        {/* Shopping List */}
        <section className="border border-gray-200 rounded-lg p-3 bg-slate-300">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-medium">Rencana Belanja Hari Ini</h2>
            <Link to="/belanja" className="text-sm text-mibu-purple hover:underline">
              Lihat Semua
            </Link>
          </div>
          
          {/* Daily Budget Limit Display - Now properly synchronized */}
          {batasHarian > 0 && (
            <div className="mb-2 p-2 bg-blue-50 border border-blue-200 rounded text-sm">
              <div className="flex justify-between items-center">
                <span className="text-blue-800">
                  Batas Belanja Harian: Rp {formatIDR(batasHarian)}
                </span>
                {totalSpending > 0 && (
                  <span className={`${isOverBudget ? 'text-red-600 font-bold' : 'text-green-600'}`}>
                    Terpakai: Rp {formatIDR(totalSpending)} ({Math.round((totalSpending/batasHarian)*100)}%)
                  </span>
                )}
              </div>
              {isOverBudget && (
                <div className="text-red-600 text-xs mt-1 font-medium">
                  ⚠️ Sudah melebihi batas harian sebesar Rp {formatIDR(totalSpending - batasHarian)}
                </div>
              )}
            </div>
          )}
          
          <Card className="border-2">
            <CardContent className="p-4">
              {isLoading ? (
                <div className="text-center py-4 text-gray-500">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                  <p className="mt-2">Memuat daftar belanja...</p>
                </div>
              ) : shoppingList.length > 0 ? (
                <div className="space-y-2">
                  {shoppingList.map(item => (
                    <div key={item.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={item.purchased || false}
                          onCheckedChange={() => toggleShoppingItem(item.id)}
                          className="data-[state=checked]:bg-mibu-purple data-[state=checked]:border-mibu-purple"
                        />
                        <span className={`font-medium ${item.purchased ? 'line-through text-gray-400' : ''}`}>
                          {item.name}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm text-mibu-purple font-medium ${item.purchased ? 'line-through text-gray-400' : ''}`}>
                          Rp {formatIDR(item.price)}
                        </div>
                        <div className="text-xs text-gray-500">
                          Qty: {item.quantity}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Shopping Summary */}
                  <div className="pt-2 mt-2 border-t">
                    <div className="flex justify-between text-sm">
                      <span>Sisa Budget:</span>
                      <span className={batasHarian - totalSpending >= 0 ? 'text-green-600' : 'text-red-600'}>
                        Rp {formatIDR(Math.max(0, batasHarian - totalSpending))}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Belum ada daftar belanja. 
                  <br />
                  <Link to="/belanja" className="text-mibu-purple hover:underline mt-2 inline-block">
                    Tambahkan item belanja
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        {/* To Do List - Now with working checkboxes */}
        <section className="border border-gray-200 rounded-lg p-3 bg-slate-200">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-medium">To Do List Hari Ini</h2>
            <Link to="/jadwal" className="text-sm text-mibu-purple hover:underline">
              Lihat Semua
            </Link>
          </div>
          <Card className="border-2">
            <CardContent className="p-4">
              {isLoading ? (
                <div className="text-center py-4 text-gray-500">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                  <p className="mt-2">Memuat tugas hari ini...</p>
                </div>
              ) : todoItems.length > 0 ? (
                <div className="space-y-2">
                  {todoItems.map(todo => (
                    <div key={todo.id} className="flex items-center py-2">
                      <Checkbox
                        checked={todo.completed}
                        onCheckedChange={() => toggleTodoItem(todo.id)}
                        className="mr-3 data-[state=checked]:bg-mibu-purple data-[state=checked]:border-mibu-purple"
                      />
                      <span className={`${todo.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                        {todo.title}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Tidak ada tugas untuk hari ini.
                  <br />
                  <Link to="/jadwal" className="text-mibu-purple hover:underline mt-2 inline-block">
                    Tambahkan tugas baru
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Important Events */}
        <section className="border border-gray-200 rounded-lg p-3 bg-slate-100">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-medium">Acara Penting</h2>
            <Link to="/jadwal" className="text-sm text-mibu-purple hover:underline">
              Lihat Semua
            </Link>
          </div>
          <Card className="border-2">
            <CardContent className="p-4">
              {isLoading ? <div className="text-center py-4 text-gray-500">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                  <p className="mt-2">Memuat acara penting...</p>
                </div> : importantEvents.length > 0 ? <div className="space-y-3">
                  {importantEvents.map(event => <div key={event.id} className="p-3 bg-mibu-lightgray rounded-lg border border-gray-200">
                      <div className="font-medium text-gray-800">{event.title}</div>
                      {event.description && <div className="text-sm text-gray-600 mt-1">{event.description}</div>}
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-mibu-purple">
                          {formatDate(event.date)}
                        </span>
                        {event.time && <span className="text-sm text-gray-500">
                            {event.time}
                          </span>}
                      </div>
                    </div>)}
                </div> : <div className="text-center py-8 text-gray-500">
                  Belum ada acara penting minggu ini.
                  <br />
                  <Link to="/jadwal" className="text-mibu-purple hover:underline mt-2 inline-block">
                    Tambahkan acara baru
                  </Link>
                </div>}
            </CardContent>
          </Card>
        </section>
      </div>
    </MainLayout>;
};

export default Beranda;
