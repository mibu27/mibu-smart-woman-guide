
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Settings, Bell, LogOut, X, User, CreditCard, HelpCircle, Crown, Heart, Home, ShoppingCart, Calendar, BarChart, Shield, Phone, Info } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar = ({ isOpen, toggleSidebar }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLogout = () => {
    // In a real app, we would clear authentication state here
    toast.success("Berhasil keluar dari akun");
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
      
      {/* Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${isOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-medium text-mibu-darkpurple">Menu</h2>
          <button onClick={toggleSidebar} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        
        <div className="py-4 px-6 flex-grow overflow-auto">
          <div className="mb-4 border-b pb-4">
            <div className="text-xs text-gray-500 mb-1">NAVIGASI UTAMA</div>
            <Link 
              to="/" 
              className={`flex items-center py-2 hover:text-mibu-purple ${isActive('/') ? 'text-mibu-purple font-medium' : 'text-gray-700'}`} 
              onClick={toggleSidebar}
            >
              <Home size={20} className="mr-3" />
              <span>Beranda</span>
            </Link>
            <Link 
              to="/belanja" 
              className={`flex items-center py-2 hover:text-mibu-purple ${isActive('/belanja') ? 'text-mibu-purple font-medium' : 'text-gray-700'}`} 
              onClick={toggleSidebar}
            >
              <ShoppingCart size={20} className="mr-3" />
              <span>BelanjaKu</span>
            </Link>
            <Link 
              to="/jadwal" 
              className={`flex items-center py-2 hover:text-mibu-purple ${isActive('/jadwal') ? 'text-mibu-purple font-medium' : 'text-gray-700'}`} 
              onClick={toggleSidebar}
            >
              <Calendar size={20} className="mr-3" />
              <span>JadwalKu</span>
            </Link>
            <Link 
              to="/laporan" 
              className={`flex items-center py-2 hover:text-mibu-purple ${isActive('/laporan') ? 'text-mibu-purple font-medium' : 'text-gray-700'}`} 
              onClick={toggleSidebar}
            >
              <BarChart size={20} className="mr-3" />
              <span>Laporan</span>
            </Link>
          </div>
        
          <Link 
            to="/profile" 
            className={`flex items-center py-3 hover:text-mibu-purple ${isActive('/profile') ? 'text-mibu-purple font-medium' : 'text-gray-700'}`} 
            onClick={toggleSidebar}
          >
            <User size={20} className="mr-3" />
            <span>Profil Saya</span>
          </Link>
          
          <Link 
            to="/settings" 
            className={`flex items-center py-3 hover:text-mibu-purple ${isActive('/settings') ? 'text-mibu-purple font-medium' : 'text-gray-700'}`} 
            onClick={toggleSidebar}
          >
            <Settings size={20} className="mr-3" />
            <span>Pengaturan Akun</span>
          </Link>
          
          <Link 
            to="/notifications" 
            className={`flex items-center py-3 hover:text-mibu-purple ${isActive('/notifications') ? 'text-mibu-purple font-medium' : 'text-gray-700'}`} 
            onClick={toggleSidebar}
          >
            <Bell size={20} className="mr-3" />
            <span>Notifikasi</span>
          </Link>
          
          <div className="border-t my-4"></div>
          
          <Link 
            to="/subscription" 
            className={`flex items-center py-3 hover:text-mibu-purple ${isActive('/subscription') ? 'text-mibu-purple font-medium' : 'text-gray-700'}`} 
            onClick={toggleSidebar}
          >
            <Crown size={20} className="mr-3" />
            <span>Langganan Premium</span>
          </Link>
          
          <Link 
            to="/payment-methods" 
            className={`flex items-center py-3 hover:text-mibu-purple ${isActive('/payment-methods') ? 'text-mibu-purple font-medium' : 'text-gray-700'}`} 
            onClick={toggleSidebar}
          >
            <CreditCard size={20} className="mr-3" />
            <span>Metode Pembayaran</span>
          </Link>
          
          <Link 
            to="/selfcare" 
            className={`flex items-center py-3 hover:text-mibu-purple ${isActive('/selfcare') ? 'text-mibu-purple font-medium' : 'text-gray-700'}`} 
            onClick={toggleSidebar}
          >
            <Heart size={20} className="mr-3" />
            <span>Self Care</span>
          </Link>
          
          <div className="border-t my-4"></div>
          
          <Link 
            to="/privacy" 
            className={`flex items-center py-3 hover:text-mibu-purple ${isActive('/privacy') ? 'text-mibu-purple font-medium' : 'text-gray-700'}`} 
            onClick={toggleSidebar}
          >
            <Shield size={20} className="mr-3" />
            <span>Privasi & Keamanan</span>
          </Link>
          
          <Link 
            to="/help" 
            className={`flex items-center py-3 hover:text-mibu-purple ${isActive('/help') ? 'text-mibu-purple font-medium' : 'text-gray-700'}`} 
            onClick={toggleSidebar}
          >
            <HelpCircle size={20} className="mr-3" />
            <span>Bantuan</span>
          </Link>
          
          <Link 
            to="/contact" 
            className={`flex items-center py-3 hover:text-mibu-purple ${isActive('/contact') ? 'text-mibu-purple font-medium' : 'text-gray-700'}`} 
            onClick={toggleSidebar}
          >
            <Phone size={20} className="mr-3" />
            <span>Hubungi Kami</span>
          </Link>
          
          <Link 
            to="/about" 
            className={`flex items-center py-3 hover:text-mibu-purple ${isActive('/about') ? 'text-mibu-purple font-medium' : 'text-gray-700'}`} 
            onClick={toggleSidebar}
          >
            <Info size={20} className="mr-3" />
            <span>Tentang MIBU</span>
          </Link>
        </div>
        
        <div className="p-4 border-t">
          <Button 
            variant="outline" 
            className="flex w-full items-center justify-center text-red-500 hover:bg-red-50 border-red-200"
            onClick={handleLogout}
          >
            <LogOut size={18} className="mr-2" />
            <span>Keluar</span>
          </Button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
