
import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Wallet, ShoppingBag, Calendar, Heart, BookOpen, Users, AlertTriangle, Check
} from 'lucide-react';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';

const shortcuts = [
  {
    icon: <Wallet size={20} className="text-mibu-purple mb-1" />,
    label: "Gajiku",
    to: "/belanja/gaji" // Make sure it points to the correct path
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

// Example data (would come from a backend/state in a real app)
const todoItems = [
  { id: 1, text: "Pertemuan dengan guru 09:00", completed: false },
  { id: 2, text: "Antar anak les 15:30", completed: true },
  { id: 3, text: "Belanja bahan masakan", completed: false }
];

const importantEvents = [
  { id: 1, text: "Pengajian ibu-ibu 19:30", location: "Masjid Al-Ikhlas", date: new Date() },
  { id: 2, text: "Ulang tahun suami", location: "Rumah", date: new Date(new Date().setDate(new Date().getDate() + 5)) }
];

// For demo, we'll make these empty by default
const shoppingList = [];

// Since the shopping list is empty, the total is 0
const totalSpending = 0;
const batasHarian = 150000;
const isOverBudget = false; // Since shopping list is empty, it's not over budget

const Beranda = () => {
  const handleToggleTodo = (id) => {
    // In a real app, this would update state/context
    console.log("Toggled todo with id:", id);
  };

  return (
    <MainLayout title="Beranda">
      {/* Budget Alert */}
      {isOverBudget && (
        <Alert variant="destructive" className="mb-4 bg-red-50 text-red-800 border-red-200">
          <AlertTriangle className="h-4 w-4 mr-2" />
          <AlertDescription>
            Belanja hari ini melebihi batas harian! (Rp {totalSpending.toLocaleString('id-ID')} dari batas Rp {batasHarian.toLocaleString('id-ID')})
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

      {/* To Do List */}
      <section className="mb-6 border border-gray-200 rounded-lg p-3">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-medium">To Do List Hari Ini</h2>
          <Link to="/jadwal" className="text-sm text-mibu-purple">Lihat Semua</Link>
        </div>
        <Card className="border-2">
          <CardContent className="p-4">
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
          </CardContent>
        </Card>
      </section>

      {/* Shopping List */}
      <section className="mb-6 border border-gray-200 rounded-lg p-3">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-medium">Daftar Belanja</h2>
          <Link to="/belanja" className="text-sm text-mibu-purple">Lihat Semua</Link>
        </div>
        <Card className="border-2">
          <CardContent className="p-4">
            {shoppingList.length > 0 ? (
              <ul className="space-y-2">
                {shoppingList.map((item) => (
                  <li key={item.id} className="flex justify-between">
                    <span>{item.name}</span>
                    <span className="font-medium">Rp {item.price.toLocaleString()}</span>
                  </li>
                ))}
                <li className="flex justify-between pt-2 border-t mt-2">
                  <span className="font-medium">Total</span>
                  <span className={`font-medium ${isOverBudget ? 'text-red-600' : ''}`}>
                    Rp {totalSpending.toLocaleString()}
                  </span>
                </li>
              </ul>
            ) : (
              <div className="text-center py-4 text-gray-500">
                Belum ada daftar belanja
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </MainLayout>
  );
};

export default Beranda;
