
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Wallet, ShoppingBag, Calendar, Heart, BookOpen, Users
} from 'lucide-react';
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
  
  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        // Fetch today's tasks
        const today = new Date().toISOString().split('T')[0];
        const { data: tasksData } = await supabase
          .from('tasks')
          .select('*')
          .eq('user_id', user.id)
          .eq('date', today)
          .limit(3);

        if (tasksData) {
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
        
        const { data: eventsData } = await supabase
          .from('events')
          .select('*')
          .eq('user_id', user.id)
          .gte('date', today)
          .lte('date', nextWeek.toISOString().split('T')[0])
          .limit(3);

        if (eventsData) {
          setImportantEvents(eventsData.map(event => ({
            id: event.id,
            title: event.title,
            description: event.description || '',
            date: event.date,
            time: event.time || ''
          })));
        }

        // Fetch recent shopping items
        const { data: shoppingData } = await supabase
          .from('shopping_items')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(3);

        if (shoppingData) {
          setShoppingList(shoppingData.map(item => ({
            id: item.id,
            name: item.name,
            price: Number(item.price),
            quantity: item.quantity
          })));
        }

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
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
  
  return (
    <MainLayout title="Beranda">
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
              <div className="text-center py-4 text-gray-500">Memuat...</div>
            ) : shoppingList.length > 0 ? (
              <div className="space-y-2">
                {shoppingList.map(item => (
                  <div key={item.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                    <span className="font-medium">{item.name}</span>
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
              <div className="text-center py-4 text-gray-500">Memuat...</div>
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
              <div className="text-center py-4 text-gray-500">Memuat...</div>
            ) : importantEvents.length > 0 ? (
              <div className="space-y-3">
                {importantEvents.map(event => (
                  <div key={event.id} className="p-3 bg-mibu-lightgray rounded-lg border border-gray-200">
                    <div className="font-medium text-gray-800">{event.title}</div>
                    {event.description && (
                      <div className="text-sm text-gray-600 mt-1">{event.description}</div>
                    )}
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
