
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Settings, Bell, LogOut, X, User, CreditCard, HelpCircle, Crown, Heart } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar = ({ isOpen, toggleSidebar }: SidebarProps) => {
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
          <Link to="/profile" className="flex items-center py-3 text-gray-700 hover:text-mibu-purple" onClick={toggleSidebar}>
            <User size={20} className="mr-3" />
            <span>Profil Saya</span>
          </Link>
          
          <Link to="/settings" className="flex items-center py-3 text-gray-700 hover:text-mibu-purple" onClick={toggleSidebar}>
            <Settings size={20} className="mr-3" />
            <span>Pengaturan Akun</span>
          </Link>
          
          <Link to="/notifications" className="flex items-center py-3 text-gray-700 hover:text-mibu-purple" onClick={toggleSidebar}>
            <Bell size={20} className="mr-3" />
            <span>Notifikasi</span>
          </Link>
          
          <div className="border-t my-4"></div>
          
          <Link to="/subscription" className="flex items-center py-3 text-gray-700 hover:text-mibu-purple" onClick={toggleSidebar}>
            <Crown size={20} className="mr-3" />
            <span>Langganan Premium</span>
          </Link>
          
          <Link to="/payment-methods" className="flex items-center py-3 text-gray-700 hover:text-mibu-purple" onClick={toggleSidebar}>
            <CreditCard size={20} className="mr-3" />
            <span>Metode Pembayaran</span>
          </Link>
          
          <Link to="/selfcare" className="flex items-center py-3 text-gray-700 hover:text-mibu-purple" onClick={toggleSidebar}>
            <Heart size={20} className="mr-3" />
            <span>Self Care</span>
          </Link>
          
          <div className="border-t my-4"></div>
          
          <Link to="/help" className="flex items-center py-3 text-gray-700 hover:text-mibu-purple" onClick={toggleSidebar}>
            <HelpCircle size={20} className="mr-3" />
            <span>Bantuan</span>
          </Link>
          
          <Link to="/about" className="flex items-center py-3 text-gray-700 hover:text-mibu-purple" onClick={toggleSidebar}>
            <span>Tentang MIBU</span>
          </Link>
        </div>
        
        <div className="p-4 border-t">
          <Button variant="outline" className="flex w-full items-center justify-center text-red-500 hover:bg-red-50 border-red-200">
            <LogOut size={18} className="mr-2" />
            <span>Keluar</span>
          </Button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
