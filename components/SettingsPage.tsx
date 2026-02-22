
import React, { useState, useRef } from 'react';
import { User as UserIcon, Lock, CheckCircle2, ShieldAlert, KeyRound, Save, Camera, Calendar, CreditCard, Building, Globe, MapPin, Hash, Sun, Moon } from 'lucide-react';
import { User, CompanyInfo, Theme, Language } from '../types';
import { translations } from '../translations';

interface SettingsPageProps {
  currentUser: User;
  onUpdateUser: (updatedUser: User, newPassword?: string) => void;
  companyInfo: CompanyInfo;
  onUpdateCompany: (info: CompanyInfo) => void;
  currentLang: Language;
  theme: Theme;
  onThemeChange: () => void;
  onLangChange: (lang: Language) => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ 
  currentUser, onUpdateUser, companyInfo, onUpdateCompany, 
  currentLang, theme, onThemeChange, onLangChange 
}) => {
  const t = translations[currentLang];
  
  // User states
  const [name, setName] = useState(currentUser.name);
  const [username, setUsername] = useState(currentUser.username);
  const [dob, setDob] = useState(currentUser.dob || '');
  const [iqamaNumber, setIqamaNumber] = useState(currentUser.iqamaNumber || '');
  const [profilePhoto, setProfilePhoto] = useState(currentUser.profilePhoto || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Company states
  const [nameEn, setNameEn] = useState(companyInfo.nameEn);
  const [nameZh, setNameZh] = useState(companyInfo.nameZh);
  const [address, setAddress] = useState(companyInfo.address);
  const [crNumber, setCrNumber] = useState(companyInfo.crNumber);
  const [vatNumber, setVatNumber] = useState(companyInfo.vatNumber);
  const [companyLogo, setCompanyLogo] = useState(companyInfo.logo || '');

  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'company' | 'preferences'>('profile');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const companyLogoRef = useRef<HTMLInputElement>(null);

  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password && password !== confirmPassword) {
      setStatus({ type: 'error', message: 'Passwords do not match.' });
      return;
    }
    onUpdateUser({ ...currentUser, name, username, dob, iqamaNumber, profilePhoto }, password || undefined);
    setStatus({ type: 'success', message: 'Profile updated successfully!' });
    setPassword('');
    setConfirmPassword('');
    setTimeout(() => setStatus(null), 3000);
  };

  const handleCompanySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateCompany({ nameEn, nameZh, address, crNumber, vatNumber, logo: companyLogo });
    setStatus({ type: 'success', message: 'Company information updated!' });
    setTimeout(() => setStatus(null), 3000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{t.settings}</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage your personal and business configurations.</p>
        </div>
        <div className="flex bg-slate-200/50 dark:bg-slate-800 p-1 rounded-xl self-start">
           <button onClick={() => setActiveTab('profile')} className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'profile' ? 'bg-white dark:bg-slate-700 text-[#1a3683] dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>My Profile</button>
           {currentUser.role === 'ADMIN' && (
             <button onClick={() => setActiveTab('company')} className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'company' ? 'bg-white dark:bg-slate-700 text-[#1a3683] dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>Company</button>
           )}
           <button onClick={() => setActiveTab('preferences')} className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'preferences' ? 'bg-white dark:bg-slate-700 text-[#1a3683] dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>Preferences</button>
        </div>
      </div>

      {status && (
        <div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${status.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' : 'bg-rose-50 text-rose-700 border border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20'}`}>
          {status.type === 'success' ? <CheckCircle2 size={20} /> : <ShieldAlert size={20} />}
          <span className="font-bold text-sm">{status.message}</span>
        </div>
      )}

      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-white/5 shadow-xl overflow-hidden">
        {activeTab === 'preferences' && (
          <div className="p-8 space-y-8">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b dark:border-white/10 pb-4 flex items-center gap-2">
              <Globe size={20} className="text-[#1a3683] dark:text-indigo-400" /> Display & Language
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest">{t.theme}</label>
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={onThemeChange} className={`flex items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all ${theme === 'light' ? 'border-[#1a3683] bg-indigo-50 dark:bg-indigo-500/10' : 'border-slate-100 dark:border-white/5'}`}>
                    <Sun size={20} className="text-[#1a3683]" />
                    <span className="font-bold">{t.light}</span>
                  </button>
                  <button onClick={onThemeChange} className={`flex items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all ${theme === 'dark' ? 'border-[#f39200] bg-orange-50 dark:bg-orange-500/10' : 'border-slate-100 dark:border-white/5'}`}>
                    <Moon size={20} className="text-[#f39200]" />
                    <span className="font-bold">{t.dark}</span>
                  </button>
                </div>
              </div>
              <div className="space-y-4">
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest">{t.language}</label>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { id: 'en', label: t.english },
                    { id: 'ar', label: t.arabic },
                    { id: 'zh', label: t.chinese }
                  ].map(l => (
                    <button 
                      key={l.id} 
                      onClick={() => onLangChange(l.id as Language)}
                      className={`flex items-center justify-between p-3 rounded-xl border transition-all ${currentLang === l.id ? 'border-[#1a3683] bg-indigo-50 dark:bg-indigo-500/10' : 'border-slate-100 dark:border-white/5'}`}
                    >
                      <span className="font-bold">{l.label}</span>
                      {currentLang === l.id && <CheckCircle2 size={16} className="text-[#1a3683]" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <form onSubmit={handleUserSubmit} className="p-8 space-y-8">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full bg-slate-100 dark:bg-slate-700 border-4 border-white dark:border-slate-800 shadow-lg overflow-hidden flex items-center justify-center">
                  {profilePhoto ? (
                    <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon size={48} className="text-slate-300" />
                  )}
                </div>
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 p-2 bg-[#1a3683] text-white rounded-full shadow-lg hover:scale-110 transition-transform"
                >
                  <Camera size={16} />
                </button>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={e => handleFileChange(e, setProfilePhoto)} />
              </div>
              
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Full Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-white/5 rounded-xl px-10 py-3 outline-none focus:ring-2 focus:ring-[#1a3683]" required />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Username</label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-white/5 rounded-xl px-10 py-3 outline-none focus:ring-2 focus:ring-[#1a3683]" required />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Date of Birth</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input type="date" value={dob} onChange={e => setDob(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-white/5 rounded-xl px-10 py-3 outline-none focus:ring-2 focus:ring-[#1a3683]" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Iqama / ID Number</label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input type="text" value={iqamaNumber} onChange={e => setIqamaNumber(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-white/5 rounded-xl px-10 py-3 outline-none focus:ring-2 focus:ring-[#1a3683]" />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t dark:border-white/10">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <Lock size={18} className="text-rose-500" /> Security Settings
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">New Password</label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Leave blank to keep current" className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-white/5 rounded-xl px-10 py-3 outline-none focus:ring-2 focus:ring-[#1a3683]" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Confirm Password</label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm new password" className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-white/5 rounded-xl px-10 py-3 outline-none focus:ring-2 focus:ring-[#1a3683]" />
                  </div>
                </div>
              </div>
            </div>

            <button type="submit" className="w-full bg-[#1a3683] text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
              <Save size={20} /> Save Profile Changes
            </button>
          </form>
        )}

        {activeTab === 'company' && (
          <form onSubmit={handleCompanySubmit} className="p-8 space-y-8">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="relative group">
                <div className="w-32 h-32 rounded-2xl bg-slate-100 dark:bg-slate-700 border-4 border-white dark:border-slate-800 shadow-lg overflow-hidden flex items-center justify-center">
                  {companyLogo ? (
                    <img src={companyLogo} alt="Logo" className="w-full h-full object-contain p-2" />
                  ) : (
                    <Building size={48} className="text-slate-300" />
                  )}
                </div>
                <button 
                  type="button"
                  onClick={() => companyLogoRef.current?.click()}
                  className="absolute bottom-0 right-0 p-2 bg-[#1a3683] text-white rounded-full shadow-lg hover:scale-110 transition-transform"
                >
                  <Camera size={16} />
                </button>
                <input type="file" ref={companyLogoRef} className="hidden" accept="image/*" onChange={e => handleFileChange(e, setCompanyLogo)} />
              </div>
              
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Company Name (English)</label>
                  <input type="text" value={nameEn} onChange={e => setNameEn(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#1a3683]" required />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Company Name (Chinese)</label>
                  <input type="text" value={nameZh} onChange={e => setNameZh(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#1a3683]" required />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Business Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 text-slate-400" size={16} />
                    <textarea value={address} onChange={e => setAddress(e.target.value)} rows={2} className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-white/5 rounded-xl px-10 py-3 outline-none focus:ring-2 focus:ring-[#1a3683]" required />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">C.R. Number</label>
                  <input type="text" value={crNumber} onChange={e => setCrNumber(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#1a3683]" required />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">VAT Number</label>
                  <input type="text" value={vatNumber} onChange={e => setVatNumber(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#1a3683]" required />
                </div>
              </div>
            </div>

            <button type="submit" className="w-full bg-[#1a3683] text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
              <Save size={20} /> Update Company Info
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;
