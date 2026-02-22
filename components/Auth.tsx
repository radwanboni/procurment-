
import React, { useState, useEffect } from 'react';
import { Lock, User as UserIcon, ShieldCheck, ArrowRight, AlertCircle } from 'lucide-react';
import { User, Role } from '../types';

interface AuthProps {
  onLogin: (user: User) => void;
}

const DEFAULT_USERS = [
  { username: 'admin', password: 'admin123', role: 'ADMIN' as Role, name: 'System Administrator' },
  { username: 'user', password: 'user123', role: 'USER' as Role, name: 'Operations Staff' }
];

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Initialize user registry if not exists
    if (!localStorage.getItem('tissa_user_registry')) {
      localStorage.setItem('tissa_user_registry', JSON.stringify(DEFAULT_USERS));
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const registry = JSON.parse(localStorage.getItem('tissa_user_registry') || '[]');
    const foundUser = registry.find((u: any) => u.username === username && u.password === password);

    if (foundUser) {
      onLogin({ 
        username: foundUser.username, 
        role: foundUser.role, 
        name: foundUser.name 
      });
    } else {
      setError('Invalid username or password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="inline-flex flex-col mb-6">
            <span className="logo-font text-5xl font-black text-[#1a3683] leading-none mb-2">九方建设</span>
            <div className="h-[3px] w-full bg-[#f39200] mb-2"></div>
            <span className="text-xl font-black tracking-[0.2em] text-[#f39200]">TISSA ATGAHAT</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Procurement Portal</h2>
          <p className="text-slate-500 mt-2">Sign in to manage P.O. records and suppliers</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 md:p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#1a3683]/5 rounded-full -mr-16 -mt-16"></div>
          
          <form onSubmit={handleLogin} className="space-y-6 relative z-10">
            {error && (
              <div className="bg-rose-50 border border-rose-100 text-rose-600 px-4 py-3 rounded-xl flex items-center gap-3 text-sm animate-shake">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                <UserIcon size={16} className="text-slate-400" /> Username
              </label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-[#1a3683] transition-all"
                placeholder="Enter your username"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                <Lock size={16} className="text-slate-400" /> Password
              </label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-[#1a3683] transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-[#1a3683] text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-[#1a3683]/90 shadow-xl shadow-indigo-100 transition-all flex items-center justify-center gap-2 group"
            >
              Sign In <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-100 grid grid-cols-2 gap-4 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            <div className="flex items-center gap-2">
              <ShieldCheck size={14} className="text-emerald-500" /> Secure SSL
            </div>
            <div className="text-right">
              v2.5.0 Stable
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-6 text-xs font-bold text-slate-400 uppercase tracking-widest">
          <div className="flex items-center gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-[#f39200]"></div> Admin: admin/admin123
          </div>
          <div className="flex items-center gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div> User: user/user123
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
