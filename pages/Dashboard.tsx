import React, { useEffect, useState } from 'react';
import { MockDB } from '../services/db';
import { ActivityLog, Role, StockRequest } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { AlertTriangle, Package, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { useAuth } from '../App';

export const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalProducts: 0, lowStock: 0, totalValue: 0, pendingRequests: 0 });
  const [recentLogs, setRecentLogs] = useState<ActivityLog[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const s = MockDB.getStats();
    setStats(s);
    setRecentLogs(MockDB.getLogs().slice(0, 5));

    // Prepare chart data by category
    const products = MockDB.getProducts();
    const categoryCount: {[key: string]: number} = {};
    products.forEach(p => {
        categoryCount[p.category] = (categoryCount[p.category] || 0) + p.quantity;
    });
    
    setChartData(Object.keys(categoryCount).map(key => ({
        name: key,
        stock: categoryCount[key]
    })));

  }, []);

  const StatCard = ({ icon: Icon, label, value, colorClass, bgClass }: any) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${bgClass} ${colorClass}`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-sm text-slate-500 font-medium">{label}</p>
        <h3 className="text-2xl font-bold text-slate-800">{typeof value === 'number' ? value.toLocaleString() : value}</h3>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-500">Welcome back, {user?.name}. Here is what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={Package} 
          label="Total Products" 
          value={stats.totalProducts} 
          colorClass="text-blue-600" 
          bgClass="bg-blue-50" 
        />
        <StatCard 
          icon={AlertTriangle} 
          label="Low Stock Alerts" 
          value={stats.lowStock} 
          colorClass="text-red-600" 
          bgClass="bg-red-50" 
        />
        <StatCard 
          icon={TrendingUp} 
          label="Inventory Value" 
          value={`$${stats.totalValue.toFixed(0)}`} 
          colorClass="text-green-600" 
          bgClass="bg-green-50" 
        />
        <StatCard 
          icon={Clock} 
          label="Pending Requests" 
          value={stats.pendingRequests} 
          colorClass="text-hotel-gold" 
          bgClass="bg-yellow-50" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-6 font-serif">Stock Levels by Category</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} tickMargin={10} />
                <YAxis axisLine={false} tickLine={false} fontSize={12} />
                <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} 
                />
                <Bar dataKey="stock" fill="#0f172a" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Activity Log Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
           <h3 className="font-bold text-slate-800 mb-4 font-serif">Recent Activity</h3>
           <div className="space-y-4">
             {recentLogs.length === 0 && <p className="text-slate-400 text-sm italic">No recent activity.</p>}
             {recentLogs.map(log => (
               <div key={log.id} className="flex gap-3 pb-3 border-b border-slate-50 last:border-0">
                 <div className="mt-1 w-2 h-2 rounded-full bg-hotel-gold shrink-0"></div>
                 <div>
                   <p className="text-xs text-slate-400 mb-0.5">{new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                   <p className="text-sm text-slate-700 font-medium">{log.action}</p>
                   <p className="text-xs text-slate-500">{log.details}</p>
                 </div>
               </div>
             ))}
           </div>
           {user?.role === Role.ADMIN && (
             <button className="w-full mt-4 py-2 text-sm text-hotel-navy hover:bg-slate-50 rounded border border-slate-200 transition-colors">
               View All Logs
             </button>
           )}
        </div>
      </div>
    </div>
  );
};