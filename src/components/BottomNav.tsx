
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingCart, Calendar, BarChart } from 'lucide-react';

const BottomNav = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    return currentPath === path ? 'text-mibu-purple' : 'text-gray-500';
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center py-2 px-1 z-50">
      <Link to="/" className="flex flex-col items-center justify-center p-2">
        <Home size={24} className={isActive('/')} />
        <span className={`text-xs mt-1 ${isActive('/')}`}>Beranda</span>
      </Link>
      
      <Link to="/belanja" className="flex flex-col items-center justify-center p-2">
        <ShoppingCart size={24} className={isActive('/belanja')} />
        <span className={`text-xs mt-1 ${isActive('/belanja')}`}>BelanjaKu</span>
      </Link>
      
      <Link to="/jadwal" className="flex flex-col items-center justify-center p-2">
        <Calendar size={24} className={isActive('/jadwal')} />
        <span className={`text-xs mt-1 ${isActive('/jadwal')}`}>JadwalKu</span>
      </Link>
      
      <Link to="/laporan" className="flex flex-col items-center justify-center p-2">
        <BarChart size={24} className={isActive('/laporan')} />
        <span className={`text-xs mt-1 ${isActive('/laporan')}`}>Laporan</span>
      </Link>
    </div>
  );
};

export default BottomNav;
