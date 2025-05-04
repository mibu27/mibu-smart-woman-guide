
import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent } from "@/components/ui/card";
import { 
  Wallet, ShoppingBag, Calendar, Heart, BookOpen, Users 
} from 'lucide-react';

const shortcuts = [
  {
    icon: <Wallet size={28} className="text-mibu-purple mb-1" />,
    label: "Gajiku",
    to: "/belanja/gaji"
  },
  {
    icon: <ShoppingBag size={28} className="text-mibu-purple mb-1" />,
    label: "Belanja",
    to: "/belanja"
  },
  {
    icon: <Calendar size={28} className="text-mibu-purple mb-1" />,
    label: "Hari Ini",
    to: "/jadwal"
  },
  {
    icon: <Heart size={28} className="text-mibu-purple mb-1" />,
    label: "Selfcare",
    to: "/diaryku/selfcare"
  },
  {
    icon: <BookOpen size={28} className="text-mibu-purple mb-1" />,
    label: "Diaryku",
    to: "/diaryku"
  },
  {
    icon: <Users size={28} className="text-mibu-purple mb-1" />,
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
  { id: 1, text: "Pengajian ibu-ibu 19:30", location: "Masjid Al-Ikhlas" },
  { id: 2, text: "Ulang tahun suami", location: "Rumah" }
];

const shoppingList = [
  { id: 1, name: "Beras 5kg", price: 70000 },
  { id: 2, name: "Sayur dan Buah", price: 50000 },
  { id: 3, name: "Daging Ayam 1kg", price: 45000 }
];

const Beranda = () => {
  return (
    <MainLayout title="Beranda">
      {/* Shortcuts */}
      <section className="mb-6 animate-fade-in">
        <div className="grid grid-cols-3 gap-3 mt-2">
          {shortcuts.map((item, index) => (
            <Link 
              key={index} 
              to={item.to}
              className="mibu-shortcut"
            >
              {item.icon}
              <span className="text-sm mt-1">{item.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* To Do List */}
      <section className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-medium">To Do List Hari Ini</h2>
          <Link to="/jadwal" className="text-sm text-mibu-purple">Lihat Semua</Link>
        </div>
        <Card>
          <CardContent className="p-4">
            <ul className="space-y-2">
              {todoItems.map((item) => (
                <li key={item.id} className="flex items-start gap-3">
                  <div className={`mt-1 w-4 h-4 rounded-full border ${item.completed ? 'bg-mibu-purple border-mibu-purple' : 'border-gray-300'}`}></div>
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
      <section className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-medium">Kegiatan Penting</h2>
          <Link to="/jadwal" className="text-sm text-mibu-purple">Lihat Semua</Link>
        </div>
        <Card>
          <CardContent className="p-4">
            <ul className="space-y-3">
              {importantEvents.map((event) => (
                <li key={event.id} className="p-2 bg-mibu-lightgray rounded-lg">
                  <div className="font-medium">{event.text}</div>
                  <div className="text-sm text-mibu-gray">{event.location}</div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* Shopping List */}
      <section className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-medium">Daftar Belanja</h2>
          <Link to="/belanja" className="text-sm text-mibu-purple">Lihat Semua</Link>
        </div>
        <Card>
          <CardContent className="p-4">
            <ul className="space-y-2">
              {shoppingList.map((item) => (
                <li key={item.id} className="flex justify-between">
                  <span>{item.name}</span>
                  <span className="font-medium">Rp {item.price.toLocaleString()}</span>
                </li>
              ))}
              <li className="flex justify-between pt-2 border-t mt-2">
                <span className="font-medium">Total</span>
                <span className="font-medium">Rp {shoppingList.reduce((sum, item) => sum + item.price, 0).toLocaleString()}</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </section>
    </MainLayout>
  );
};

export default Beranda;
