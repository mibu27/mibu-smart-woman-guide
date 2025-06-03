
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, RefreshCw } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { BudgetAlert } from '@/components/beranda/BudgetAlert';
import { ShortcutsSection } from '@/components/beranda/ShortcutsSection';

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
}

const Beranda = () => {
  const { user } = useAuth();
  const [todoItems, setTodoItems] = useState<TodoItem[]>([]);
  const [importantEvents, setImportantEvents] = useState<ImportantEvent[]>([]);
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [budgetInfo, setBudgetInfo] = useState({ batasHarian: 0, totalSpending: 0 });

  const fetchData = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      const startTime = Date.now();
      const today = new Date().toISOString().split('T')[0];

      // Fetch today's tasks
      const { data: tasksData, error: tasksError } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .limit(3);

      if (tasksError) {
        console.error('Error fetching tasks:', tasksError);
      } else if (tasksData) {
        setTodoItems(tasksData.map(task => ({
          id: task.id,
          title: task.title,
          completed: task.completed,
          date: task.date
        })));
      }

      // Fetch upcoming events (next 7 days)
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', today)
        .lte('date', nextWeek.toISOString().split('T')[0])
        .order('date', { ascending: true })
        .limit(3);

      if (eventsError) {
        console.error('Error fetching events:', eventsError);
      } else if (eventsData) {
        setImportantEvents(eventsData.map(event => ({
          id: event.id,
          title: event.title,
          description: event.description || '',
          date: event.date,
          time: event.time || ''
        })));
      }

      // Fetch recent shopping items
      const { data: shoppingData, error: shoppingError } = await supabase
        .from('shopping_items')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3);

      if (shoppingError) {
        console.error('Error fetching shopping items:', shoppingError);
      } else if (shoppingData) {
        setShoppingList(shoppingData.map(item => ({
          id: item.id,
          name: item.name,
          price: Number(item.price),
          quantity: item.quantity
        })));
      }

      // Fetch budget information and actual expenses
      const { data: budgetData, error: budgetError } = await supabase
        .from('budget_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (!budgetError && budgetData) {
        const currentDate = new Date();
        const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
        const dailyLimit = (budgetData.monthly_salary - (budgetData.fixed_expenses || 0)) / daysInMonth;
        const batasHarian = Math.max(0, dailyLimit);
        
        // Fetch today's actual expenses from expenses table
        const { data: expensesData, error: expensesError } = await supabase
          .from('expenses')
          .select('amount')
          .eq('user_id', user.id)
          .eq('date', today);

        let totalSpending = 0;
        if (!expensesError && expensesData) {
          totalSpending = expensesData.reduce((sum, expense) => sum + Number(expense.amount), 0);
        }
        
        setBudgetInfo({ batasHarian, totalSpending });
      }

      // Ensure minimum loading time for better UX
      const minLoadTime = 500;
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime < minLoadTime) {
        await new Promise(resolve => setTimeout(resolve, minLoadTime - elapsedTime));
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
    await fetchData();
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  // Format for displaying IDR
  const formatIDR = (value: number): string => {
    return value.toLocaleString('id-ID');
  };

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
    return (
      <MainLayout title="Beranda">
        <div className="text-center py-8">
          <p className="text-gray-500">Silakan login untuk menggunakan fitur aplikasi</p>
        </div>
      </MainLayout>
    );
  }

  // Check if over budget
  const isOverBudget = budgetInfo.batasHarian > 0 && budgetInfo.totalSpending > budgetInfo.batasHarian;

  return (
    <MainLayout title="Beranda">
      <div className="space-y-6">
        {/* Header with refresh button */}
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold">Selamat datang!</h1>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh} 
            disabled={refreshing} 
            className="text-mibu-purple border-mibu-purple"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Budget Alert - Show if over budget */}
        <BudgetAlert 
          isOverBudget={isOverBudget}
          totalSpending={budgetInfo.totalSpending}
          batasHarian={budgetInfo.batasHarian}
          formatIDR={formatIDR}
        />

        {/* Shortcuts */}
        <ShortcutsSection />

        {/* Shopping List */}
        <section className="border border-gray-200 rounded-lg p-3">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-medium">Rencana Belanja Hari Ini</h2>
            <Link to="/belanja" className="text-sm text-mibu-purple hover:underline">
              Lihat Semua
            </Link>
          </div>
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
                        <div className="w-4 h-4 rounded border border-gray-300"></div>
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-mibu-purple font-medium">
                          Rp {formatIDR(item.price)}
                        </div>
                        <div className="text-xs text-gray-500">
                          Qty: {item.quantity}
                        </div>
                      </div>
                    </div>
                  ))}
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

        {/* To Do List */}
        <section className="border border-gray-200 rounded-lg p-3">
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
                      <div className={`w-4 h-4 rounded-full border-2 mr-3 ${todo.completed ? 'bg-mibu-purple border-mibu-purple' : 'border-gray-300'}`}></div>
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
        <section className="border border-gray-200 rounded-lg p-3">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-medium">Acara Penting</h2>
            <Link to="/jadwal" className="text-sm text-mibu-purple hover:underline">
              Lihat Semua
            </Link>
          </div>
          <Card className="border-2">
            <CardContent className="p-4">
              {isLoading ? (
                <div className="text-center py-4 text-gray-500">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                  <p className="mt-2">Memuat acara penting...</p>
                </div>
              ) : importantEvents.length > 0 ? (
                <div className="space-y-3">
                  {importantEvents.map(event => (
                    <div key={event.id} className="p-3 bg-mibu-lightgray rounded-lg border border-gray-200">
                      <div className="font-medium text-gray-800">{event.title}</div>
                      {event.description && <div className="text-sm text-gray-600 mt-1">{event.description}</div>}
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-mibu-purple">
                          {formatDate(event.date)}
                        </span>
                        {event.time && (
                          <span className="text-sm text-gray-500">
                            {event.time}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Belum ada acara penting minggu ini.
                  <br />
                  <Link to="/jadwal" className="text-mibu-purple hover:underline mt-2 inline-block">
                    Tambahkan acara baru
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </MainLayout>
  );
};

export default Beranda;
