
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
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      setIsLoading(false);
    };
    
    fetchData();
  }, [user]);

  // Format for displaying IDR
  const formatIDR = (value: number): string => {
    return value.toLocaleString('id-ID');
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
            <div className="text-center py-8 text-gray-500">
              Belum ada daftar belanja. 
              <br/>
              <Link to="/belanja" className="text-mibu-purple hover:underline mt-2 inline-block">
                Tambahkan item belanja
              </Link>
            </div>
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
            <div className="text-center py-8 text-gray-500">
              Tidak ada tugas untuk hari ini.
              <br/>
              <Link to="/jadwal" className="text-mibu-purple hover:underline mt-2 inline-block">
                Tambahkan tugas baru
              </Link>
            </div>
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
            <div className="text-center py-8 text-gray-500">
              Belum ada acara penting.
              <br/>
              <Link to="/jadwal" className="text-mibu-purple hover:underline mt-2 inline-block">
                Tambahkan acara baru
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>
    </MainLayout>
  );
};

export default Beranda;
