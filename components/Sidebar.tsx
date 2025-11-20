import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../App';
import { Role } from '../types';
import { LayoutDashboard, Package, ShoppingCart, FileText, Settings, LogOut, Hotel, ClipboardList, History } from 'lucide-react';

export const Sidebar = ({ isOpen }: { isOpen: boolean }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!isOpen) return null;

  const NavItem = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => {
    const active = location.pathname === to;
    return (
      <Link to={to} className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${active ? 'bg-hotel-gold text-white shadow-md' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
        <Icon size={20} />
        <span className="font-medium">{label}</span>
      </Link>
    );
  };

  return (
    <div className="w-64 bg-hotel-navy text-white flex flex-col h-full shadow-xl border-r border-slate-800">
      <div className="p-6 flex flex-col items-center border-b border-slate-800">
        <Hotel className="text-hotel-gold mb-2" size={40} />
        <h1 className="text-xl font-serif font-bold tracking-wide text-center text-white">LUXSTAY <span className="text-hotel-gold">HOTEL</span></h1>
        <p className="text-xs text-slate-400 mt-1 tracking-widest uppercase">Inventory System</p>
      </div>

      <nav className="flex-1 px-4 py-6 overflow-y-auto">
        <div className="mb-2 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Main</div>
        <NavItem to="/" icon={LayoutDashboard} label="Dashboard" />
        
        <div className="mt-6 mb-2 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Inventory</div>
        {(user?.role === Role.ADMIN || user?.role === Role.RECEPTIONIST || user?.role === Role.CASHIER) && (
           <NavItem to="/inventory" icon={Package} label="Products & Stock" />
        )}
        <NavItem to="/requests" icon={ClipboardList} label="Requisitions" />
        
        {user?.role === Role.ADMIN && (
          <>
            <div className="mt-6 mb-2 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Admin</div>
            <NavItem to="/reports" icon={FileText} label="Reports & Logs" />
            <NavItem to="/settings" icon={Settings} label="Settings" />
          </>
        )}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button onClick={logout} className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-red-400 hover:bg-slate-800 transition-colors">
          <LogOut size={20} />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
};