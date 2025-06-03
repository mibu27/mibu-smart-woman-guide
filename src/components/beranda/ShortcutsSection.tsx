
import React from 'react';
import { Link } from 'react-router-dom';
import { Wallet, ShoppingBag, Calendar, Heart, BookOpen, Users } from 'lucide-react';

const shortcuts = [{
  icon: <Wallet size={20} className="text-mibu-purple mb-1" />,
  label: "Gajiku",
  to: "/belanja/gaji"
}, {
  icon: <ShoppingBag size={20} className="text-mibu-purple mb-1" />,
  label: "BelanjaKu",
  to: "/belanja"
}, {
  icon: <Calendar size={20} className="text-mibu-purple mb-1" />,
  label: "JadwalKu",
  to: "/jadwal"
}, {
  icon: <Heart size={20} className="text-mibu-purple mb-1" />,
  label: "Selfcare",
  to: "/diaryku/selfcare"
}, {
  icon: <BookOpen size={20} className="text-mibu-purple mb-1" />,
  label: "Diaryku",
  to: "/diaryku"
}, {
  icon: <Users size={20} className="text-mibu-purple mb-1" />,
  label: "Komuniku",
  to: "/komunitas"
}];

export const ShortcutsSection = () => {
  return (
    <section className="border border-gray-200 rounded-lg p-3">
      <div className="grid grid-cols-3 gap-3 mt-2">
        {shortcuts.map((item, index) => (
          <Link key={index} to={item.to} className="mibu-shortcut border border-gray-200">
            {item.icon}
            <span className="text-sm mt-1">{item.label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
};
