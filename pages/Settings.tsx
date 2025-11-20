import React from 'react';
import { Save } from 'lucide-react';
import toast from 'react-hot-toast';

export const Settings = () => {
  const handleSave = (e: React.FormEvent) => {
      e.preventDefault();
      toast.success("Settings saved successfully");
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-serif font-bold text-slate-800 mb-2">Settings</h1>
      <p className="text-slate-500 mb-8">Configure hotel details and system preferences.</p>

      <form onSubmit={handleSave} className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 space-y-8">
          
          <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-800 pb-2 border-b border-slate-100">General Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Hotel Name</label>
                      <input type="text" defaultValue="LuxStay Hotel" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-hotel-gold outline-none" />
                  </div>
                   <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Contact Email</label>
                      <input type="email" defaultValue="admin@luxstay.com" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-hotel-gold outline-none" />
                  </div>
                   <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                      <input type="text" defaultValue="+1 (555) 123-4567" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-hotel-gold outline-none" />
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Currency</label>
                      <select className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-hotel-gold outline-none">
                          <option>USD ($)</option>
                          <option>EUR (€)</option>
                          <option>GBP (£)</option>
                      </select>
                  </div>
              </div>
          </div>

          <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-800 pb-2 border-b border-slate-100">Inventory Preferences</h3>
               <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                   <div>
                       <p className="font-medium text-slate-800">Low Stock Alerts</p>
                       <p className="text-sm text-slate-500">Notify via email when stock goes below minimum level.</p>
                   </div>
                   <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-hotel-gold"></div>
                    </label>
               </div>
          </div>

          <div className="pt-4 flex justify-end">
               <button type="submit" className="flex items-center gap-2 bg-hotel-navy text-white px-6 py-3 rounded-lg hover:bg-slate-800 transition-all shadow-lg">
                   <Save size={18} />
                   <span>Save Changes</span>
               </button>
          </div>

      </form>
    </div>
  );
};