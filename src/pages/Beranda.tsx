
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Wallet, ShoppingBag, Calendar, Heart, BookOpen, Users, AlertTriangle, Check
} from 'lucide-react';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContext';
import { Progress } from "@/components/ui/progress";

const shortcuts = [
  {
    icon: <Wallet size={20} className="text-mibu-purple mb-1" />,
    label: "Gajiku",
    to: "/belanja/gaji" 
  },
  {
    icon: <ShoppingBag size={20} className="text-mibu-purple mb-1" />,
    label: "BelanjaKu",
    to: "/belanja"
  },
  {
    icon: <Calendar size={20} className="text-mibu-purple mb-1" />,
    label: "JadwalKu",
    to: "/jadwal"
  },
  {
    icon: <Heart size={20} className="text-mibu-purple mb-1" />,
    label: "Selfcare",
    to: "/diaryku/selfcare"
  },
  {
    icon: <BookOpen size={20} className="text-mibu-purple mb-1" />,
    label: "Diaryku",
    to: "/diaryku"
  },
  {
    icon: <Users size={20} className="text-mibu-purple mb-1" />,
    label: "Komuniku",
    to: "/komunitas"
  }
];

// TypeScript interfaces for our data types
interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

interface ImportantEvent {
  id: string;
  text: string;
  location: string;
  date: Date;
}

interface ShoppingItem {
  id: string;
  name: string;
  price: number;
}

const Beranda = () => {
  const { user } = useAuth();
  const [todoItems, setTodoItems] = useState<TodoItem[]>([]);
  const [importantEvents, setImportantEvents] = useState<ImportantEvent[]>([]);
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([]);
  const [batasHarian, setBatasHarian] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  // Calculate total from shopping list
  const totalSpending = shoppingList.reduce((sum, item) => sum + item.price, 0);
  const isOverBudget = batasHarian > 0 && totalSpending > batasHarian;

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      setIsLoading(true);
      
      try {
        // Fetch tasks (todo items)
        const { data: tasksData, error: tasksError } = await supabase
          .from('tasks')
          .select('*')
          .eq('user_id', user.id)
          .eq('date', new Date().toISOString().split('T')[0]);
        
        if (tasksError) throw tasksError;
        
        if (tasksData) {
          setTodoItems(tasksData.map(task => ({
            id: task.id,
            text: task.title,
            completed: task.completed
          })));
        }
        
        // Fetch events (important events)
        const { data: eventsData, error: eventsError } = await supabase
          .from('events')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: true })
          .limit(5);
        
        if (eventsError) throw eventsError;
        
        if (eventsData) {
          setImportantEvents(eventsData.map(event => ({
            id: event.id,
            text: event.title,
            location: event.description || 'Tidak ada lokasi',
            date: new Date(event.date)
          })));
        }
        
        // Fetch shopping items
        const { data: shoppingData, error: shoppingError } = await supabase
          .from('shopping_items')
          .select('*')
          .eq('user_id', user.id);
        
        if (shoppingError) throw shoppingError;
        
        if (shoppingData) {
          setShoppingList(shoppingData.map(item => ({
            id: item.id,
            name: item.name,
            price: parseFloat(item.price.toString()) // Convert to number safely
          })));
        }
        
        // Fetch budget settings for daily limit
        const { data: budgetData, error: budgetError } = await supabase
          .from('budget_settings')
          .select('monthly_salary, fixed_expenses')
          .eq('user_id', user.id)
          .single();
        
        if (budgetError && budgetError.code !== 'PGRST116') {
          throw budgetError;
        }
        
        if (budgetData) {
          const currentDate = new Date();
          const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
          const dailyLimit = (budgetData.monthly_salary - (budgetData.fixed_expenses || 0)) / daysInMonth;
          setBatasHarian(Math.max(0, dailyLimit));
        }
      } catch (error) {
        console.error('Error fetching data for homepage:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [user]);

  const handleToggleTodo = async (id: string) => {
    if (!user) return;
    
    try {
      const todoToUpdate = todoItems.find(item => item.id === id);
      if (!todoToUpdate) return;
      
      const newCompletedState = !todoToUpdate.completed;
      
      // Update in Supabase
      const { error } = await supabase
        .from('tasks')
        .update({ completed: newCompletedState })
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      // Update local state
      setTodoItems(todoItems.map(todo => 
        todo.id === id ? { ...todo, completed: newCompletedState } : todo
      ));
    } catch (error) {
      console.error('Error toggling todo:', error);
    }
  };

  // Format for displaying IDR
  const formatIDR = (value: number): string => {
    return value.toLocaleString('id-ID');
  };
  
  return (
    <MainLayout title="Beranda">
      {/* Budget Alert */}
      {isOverBudget && (
        <Alert variant="destructive" className="mb-4 bg-red-50 text-red-800 border-red-200">
          <AlertTriangle className="h-4 w-4 mr-2" />
          <AlertDescription>
            Belanja hari ini melebihi batas harian! (Rp {formatIDR(totalSpending)} dari batas Rp {formatIDR(batasHarian)})
          </AlertDescription>
        </Alert>
      )}
      
      {/* Shortcuts */}
      <section className="mb-6 animate-fade-in border border-gray-200 rounded-lg p-3">
        <div className="grid grid-cols-3 gap-3 mt-2">
          {shortcuts.map((item, index) => (
            <Link 
              key={index} 
              to={item.to}
              className="mibu-shortcut border border-gray-200"
            >
              {item.icon}
              <span className="text-sm mt-1">{item.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Shopping List */}
      <section className="mb-6 border border-gray-200 rounded-lg p-3">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-medium">Daftar Belanja</h2>
          <Link to="/belanja" className="text-sm text-mibu-purple">Lihat Semua</Link>
        </div>
        <Card className="border-2">
          <CardContent className="p-4">
            {isLoading ? (
              <div className="text-center py-4 text-gray-500">
                Memuat data...
              </div>
            ) : shoppingList.length > 0 ? (
              <ul className="space-y-2">
                {shoppingList.map((item) => (
                  <li key={item.id} className="flex justify-between">
                    <span>{item.name}</span>
                    <span className="font-medium">Rp {formatIDR(item.price)}</span>
                  </li>
                ))}
                <li className="flex justify-between pt-2 border-t mt-2">
                  <span className="font-medium">Total</span>
                  <span className={`font-medium ${isOverBudget ? 'text-red-600' : ''}`}>
                    Rp {formatIDR(totalSpending)}
                  </span>
                </li>
                
                {batasHarian > 0 && (
                  <li className="pt-2 mt-2">
                    <div className="font-medium">Batas Belanja Harian</div>
                    <div className="text-sm text-mibu-purple">
                      Rp {formatIDR(batasHarian)}
                    </div>
                    <div className="flex flex-col gap-1 mt-2">
                      <Progress value={Math.min((totalSpending/batasHarian) * 100, 100)} className="h-2" />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>0%</span>
                        <span>{Math.round((totalSpending/batasHarian) * 100)}% digunakan</span>
                        <span>100%</span>
                      </div>
                    </div>
                  </li>
                )}
              </ul>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Belum ada daftar belanja. 
                <br/>
                <Link to="/belanja" className="text-mibu-purple hover:underline mt-2 inline-block">
                  Tambahkan item belanja
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* To Do List */}
      <section className="mb-6 border border-gray-200 rounded-lg p-3">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-medium">To Do List Hari Ini</h2>
          <Link to="/jadwal" className="text-sm text-mibu-purple">Lihat Semua</Link>
        </div>
        <Card className="border-2">
          <CardContent className="p-4">
            {isLoading ? (
              <div className="text-center py-4 text-gray-500">
                Memuat data...
              </div>
            ) : todoItems.length > 0 ? (
              <ul className="space-y-2">
                {todoItems.map((item) => (
                  <li key={item.id} className="flex items-start gap-3">
                    <div 
                      onClick={() => handleToggleTodo(item.id)}
                      className={`mt-1 w-4 h-4 rounded-full flex items-center justify-center cursor-pointer border ${item.completed ? 'bg-mibu-purple border-mibu-purple' : 'border-gray-300'}`}
                    >
                      {item.completed && <Check size={12} className="text-white" />}
                    </div>
                    <span className={item.completed ? 'line-through text-gray-400' : ''}>
                      {item.text}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Tidak ada tugas untuk hari ini.
                <br/>
                <Link to="/jadwal" className="text-mibu-purple hover:underline mt-2 inline-block">
                  Tambahkan tugas baru
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Important Events */}
      <section className="mb-6 border border-gray-200 rounded-lg p-3">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-medium">Acara Penting</h2>
          <Link to="/jadwal" className="text-sm text-mibu-purple">Lihat Semua</Link>
        </div>
        <Card className="border-2">
          <CardContent className="p-4">
            {isLoading ? (
              <div className="text-center py-4 text-gray-500">
                Memuat data...
              </div>
            ) : importantEvents.length > 0 ? (
              <ul className="space-y-3">
                {importantEvents.map((event) => (
                  <li key={event.id} className="p-2 bg-mibu-lightgray rounded-lg">
                    <div className="font-medium">{event.text}</div>
                    <div className="text-sm text-mibu-gray">{event.location}</div>
                    <div className="text-sm text-mibu-purple mt-1">
                      {format(event.date, "EEEE, d MMMM yyyy", { locale: idLocale })}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Belum ada acara penting.
                <br/>
                <Link to="/jadwal" className="text-mibu-purple hover:underline mt-2 inline-block">
                  Tambahkan acara baru
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </MainLayout>
  );
};

export default Beranda;
