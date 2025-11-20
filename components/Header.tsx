import React from 'react';
import { useAuth } from '../App';
import { Menu, User, Bell } from 'lucide-react';

export const Header = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
  const { user } = useAuth();

  return (
    <header className="bg-white h-16 shadow-sm flex items-center justify-between px-6 z-10">
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600">
          <Menu size={24} />
        </button>
        <h2 className="text-xl font-serif text-hotel-navy font-semibold hidden sm:block">
          Overview
        </h2>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative p-2 text-slate-400 hover:text-hotel-gold transition-colors">
          <Bell size={22} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>
        
        <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-800">{user?.name}</p>
            <p className="text-xs text-hotel-goldDark font-medium uppercase tracking-wide">{user?.role}</p>
          </div>
          <div className="w-10 h-10 bg-hotel-navy rounded-full flex items-center justify-center text-hotel-gold border-2 border-hotel-gold">
            <User size={20} />
          </div>
        </div>
      </div>
    </header>
  );
};