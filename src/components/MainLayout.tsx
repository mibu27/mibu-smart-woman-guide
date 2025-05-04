
import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';

interface MainLayoutProps {
  children: React.ReactNode;
  title: string;
}

const MainLayout = ({ children, title }: MainLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="pb-16">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white z-30 border-b border-gray-200">
        <div className="mibu-container flex justify-between items-center py-3">
          <h1 className="text-xl font-semibold text-mibu-darkpurple">{title}</h1>
          <button 
            onClick={toggleSidebar}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <Settings size={24} className="text-mibu-darkpurple" />
          </button>
        </div>
      </header>

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <main className="mibu-container pt-16 pb-4">
        {children}
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default MainLayout;
