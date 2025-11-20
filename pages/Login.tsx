import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { Role } from '../types';
import { Hotel } from 'lucide-react';

export const Login = () => {
  const [username, setUsername] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role>(Role.ADMIN);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) return;
    login(username, selectedRole);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-hotel-navy flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-hotel-gold via-hotel-navy to-black"></div>
      
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative z-10">
        <div className="p-8 pt-12 text-center">
            <div className="mx-auto w-16 h-16 bg-hotel-navy rounded-full flex items-center justify-center text-hotel-gold mb-6 shadow-lg border-4 border-hotel-cream">
                <Hotel size={32} />
            </div>
            <h1 className="text-3xl font-serif font-bold text-hotel-navy mb-2">Welcome Back</h1>
            <p className="text-slate-500 text-sm">LuxStay Hotel Inventory System</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 pt-4 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-hotel-gold focus:border-hotel-gold outline-none transition-all"
              placeholder="Enter your username"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Select Role (Demo Mode)</label>
            <div className="grid grid-cols-3 gap-2">
              {Object.values(Role).map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setSelectedRole(role)}
                  className={`py-2 px-1 text-xs font-semibold rounded border transition-all ${selectedRole === role ? 'bg-hotel-navy text-hotel-gold border-hotel-navy' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-hotel-gold text-white font-semibold rounded-lg hover:bg-hotel-goldDark transition-colors shadow-lg shadow-orange-200"
          >
            Access Dashboard
          </button>
          
          <div className="text-center">
             <p className="text-xs text-slate-400">Protected System • Authorized Personnel Only</p>
          </div>
        </form>
      </div>
    </div>
  );
};