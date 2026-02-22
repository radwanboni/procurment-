
import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  PlusCircle, 
  Search,
  Settings,
  Bell,
  LogOut,
  Sun,
  Moon,
  Globe,
  Menu,
  X
} from 'lucide-react';
import { Supplier, PurchaseOrder, POStatus, User, ApprovalEntry, CompanyInfo, Theme, Language } from './types';
import { translations } from './translations';
import Dashboard from './components/Dashboard';
import SupplierManagement from './components/SupplierManagement';
import POManagement from './components/POManagement';
import NewPOForm from './components/NewPOForm';
import POView from './components/POView';
import Auth from './components/Auth';
import SettingsPage from './components/SettingsPage';

const DEFAULT_COMPANY: CompanyInfo = {
  nameEn: 'TISSA ATGAHAT CONSTRUCTION',
  nameZh: '九方建设',
  address: 'Industrial Zone B, Riyadh, Saudi Arabia',
  crNumber: '1010123456',
  vatNumber: '300012345600003'
};

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'suppliers' | 'pos' | 'new-po' | 'view-po' | 'settings'>('dashboard');
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);
  const [supplierCategories, setSupplierCategories] = useState<string[]>(['Manpower', 'Equipment', 'Testing', 'Fuel', 'Water', 'Safety Gear', 'Construction Materials']);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>(DEFAULT_COMPANY);
  
  // Theme & Language
  const [theme, setTheme] = useState<Theme>('light');
  const [lang, setLang] = useState<Language>('en');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const t = translations[lang];

  // Auth check on load
  useEffect(() => {
    const savedUser = localStorage.getItem('tissa_procurement_user');
    if (savedUser) {
      const u = JSON.parse(savedUser);
      setCurrentUser(u);
      if (u.theme) setTheme(u.theme as Theme);
      if (u.language) setLang(u.language as Language);
    }

    const savedCompany = localStorage.getItem('tissa_company_info');
    if (savedCompany) setCompanyInfo(JSON.parse(savedCompany));

    const savedPOs = localStorage.getItem('tissa_purchase_orders');
    if (savedPOs) setPurchaseOrders(JSON.parse(savedPOs));

    const savedSuppliers = localStorage.getItem('tissa_suppliers');
    if (savedSuppliers) setSuppliers(JSON.parse(savedSuppliers));

    const savedCategories = localStorage.getItem('tissa_supplier_categories');
    if (savedCategories) setSupplierCategories(JSON.parse(savedCategories));
  }, []);

  // Sync Theme to HTML class
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Sync Language and Direction
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  // Sync Data to LocalStorage
  useEffect(() => {
    localStorage.setItem('tissa_suppliers', JSON.stringify(suppliers));
  }, [suppliers]);

  useEffect(() => {
    localStorage.setItem('tissa_purchase_orders', JSON.stringify(purchaseOrders));
  }, [purchaseOrders]);

  useEffect(() => {
    localStorage.setItem('tissa_supplier_categories', JSON.stringify(supplierCategories));
  }, [supplierCategories]);

  const handleToggleTheme = () => {
    const nextTheme: Theme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    if (currentUser) {
      const updatedUser = { ...currentUser, theme: nextTheme };
      setCurrentUser(updatedUser);
      localStorage.setItem('tissa_procurement_user', JSON.stringify(updatedUser));
    }
  };

  const handleChangeLang = (newLang: Language) => {
    setLang(newLang);
    setLangMenuOpen(false);
    if (currentUser) {
      const updatedUser = { ...currentUser, language: newLang };
      setCurrentUser(updatedUser);
      localStorage.setItem('tissa_procurement_user', JSON.stringify(updatedUser));
    }
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    if (user.theme) setTheme(user.theme);
    if (user.language) setLang(user.language);
    localStorage.setItem('tissa_procurement_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('tissa_procurement_user');
    setActiveTab('dashboard');
  };

  const handleUpdateUserProfile = (updatedUser: User, newPassword?: string) => {
    const registry = JSON.parse(localStorage.getItem('tissa_user_registry') || '[]');
    const userIndex = registry.findIndex((u: any) => u.username === currentUser?.username);
    if (userIndex === -1) return;

    const newEntry = { ...registry[userIndex], ...updatedUser };
    if (newPassword) newEntry.password = newPassword;

    registry[userIndex] = newEntry;
    localStorage.setItem('tissa_user_registry', JSON.stringify(registry));
    setCurrentUser(updatedUser);
    localStorage.setItem('tissa_procurement_user', JSON.stringify(updatedUser));
  };

  const handleUpdateCompanyInfo = (info: CompanyInfo) => {
    setCompanyInfo(info);
    localStorage.setItem('tissa_company_info', JSON.stringify(info));
  };

  if (!currentUser) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className={`flex min-h-screen ${lang === 'ar' ? 'font-arabic' : ''}`}>
      {/* Mobile Menu Backdrop */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setMobileMenuOpen(false)}></div>
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 ${lang === 'ar' ? 'right-0' : 'left-0'} w-64 bg-[#1a3683] dark:bg-slate-950 text-slate-300 no-print border-r dark:border-white/5 z-50 transition-transform md:relative md:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : (lang === 'ar' ? 'translate-x-full' : '-translate-x-full')}`}>
        <div className="p-6">
          <div className="flex flex-col gap-1 text-white">
            <span className="logo-font text-2xl font-bold tracking-tight">{companyInfo.nameZh}</span>
            <div className="h-[2px] w-full bg-[#f39200]"></div>
            <span className="text-[10px] font-black tracking-[0.15em] text-[#f39200] leading-tight truncate uppercase">{companyInfo.nameEn}</span>
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 py-4">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: t.dashboard },
            { id: 'suppliers', icon: Users, label: t.suppliers },
            { id: 'pos', icon: FileText, label: t.pos },
          ].map(item => (
            <button 
              key={item.id}
              onClick={() => { setActiveTab(item.id as any); setMobileMenuOpen(false); }} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === item.id ? 'bg-[#f39200] text-white shadow-lg' : 'hover:bg-white/10'}`}
            >
              <item.icon size={20} /> {item.label}
            </button>
          ))}
          
          <div className="pt-6 pb-2 text-xs font-semibold text-slate-400 uppercase px-4">{t.actions}</div>
          <button 
            onClick={() => { setActiveTab('new-po'); setMobileMenuOpen(false); }} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'new-po' ? 'bg-[#f39200] text-white shadow-lg' : 'hover:bg-white/10 text-[#f39200] font-bold'}`}
          >
            <PlusCircle size={20} /> {t.newPo}
          </button>
          
          <button 
            onClick={() => { setActiveTab('settings'); setMobileMenuOpen(false); }} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'settings' ? 'bg-[#f39200] text-white shadow-lg' : 'hover:bg-white/10'}`}
          >
            <Settings size={20} /> {t.settings}
          </button>
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-2 py-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-white uppercase overflow-hidden border border-white/20">
               {currentUser.profilePhoto ? (
                 <img src={currentUser.profilePhoto} alt="" className="w-full h-full object-cover" />
               ) : (
                 currentUser.username.substring(0, 2)
               )}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold text-white truncate">{currentUser.name}</p>
              <p className="text-[10px] text-[#f39200] font-bold uppercase tracking-widest">{currentUser.role}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2 text-xs font-bold text-rose-400 hover:text-white hover:bg-rose-500/20 rounded-lg transition-all">
            <LogOut size={14} /> {t.logout}
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden dark:bg-slate-900">
        <header className="h-16 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-white/5 flex items-center justify-between px-4 md:px-8 no-print shadow-sm z-30">
          <div className="flex items-center gap-4">
            <button className="md:hidden p-2 text-slate-500" onClick={() => setMobileMenuOpen(true)}>
              <Menu size={24} />
            </button>
            <div className="hidden md:flex flex-col">
              <span className="text-xs font-bold text-slate-900 dark:text-white">{currentUser.name}</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{currentUser.role}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button 
                onClick={handleToggleTheme} 
                className={`p-2 rounded-lg transition-all ${theme === 'light' ? 'bg-white dark:bg-slate-700 text-[#1a3683] shadow-sm' : 'text-slate-400 hover:text-white'}`}
                title={t.light}
              >
                <Sun size={18} />
              </button>
              <button 
                onClick={handleToggleTheme} 
                className={`p-2 rounded-lg transition-all ${theme === 'dark' ? 'bg-white dark:bg-slate-700 text-[#f39200] shadow-sm' : 'text-slate-400 hover:text-white'}`}
                title={t.dark}
              >
                <Moon size={18} />
              </button>
            </div>

            <div className="relative">
              <button 
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all ${langMenuOpen ? 'bg-[#1a3683] text-white shadow-lg' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
              >
                <Globe size={16} />
                <span className="hidden sm:inline uppercase">{lang}</span>
              </button>
              
              {langMenuOpen && (
                <>
                  {/* Backdrop for clicking away */}
                  <div className="fixed inset-0 z-40" onClick={() => setLangMenuOpen(false)}></div>
                  
                  {/* Dropdown Menu */}
                  <div className={`absolute top-full ${lang === 'ar' ? 'left-0' : 'right-0'} mt-2 w-32 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/5 rounded-xl shadow-2xl transition-all z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150`}>
                    <button 
                      onClick={() => handleChangeLang('en')} 
                      className={`w-full px-4 py-3 text-left text-xs font-bold transition-colors hover:bg-slate-50 dark:hover:bg-slate-700 ${lang === 'en' ? 'text-[#1a3683] dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-500/10' : 'text-slate-600 dark:text-slate-300'}`}
                    >
                      {t.english}
                    </button>
                    <button 
                      onClick={() => handleChangeLang('ar')} 
                      className={`w-full px-4 py-3 text-left text-xs font-bold transition-colors hover:bg-slate-50 dark:hover:bg-slate-700 ${lang === 'ar' ? 'text-[#1a3683] dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-500/10' : 'text-slate-600 dark:text-slate-300'}`}
                    >
                      {t.arabic}
                    </button>
                    <button 
                      onClick={() => handleChangeLang('zh')} 
                      className={`w-full px-4 py-3 text-left text-xs font-bold transition-colors hover:bg-slate-50 dark:hover:bg-slate-700 ${lang === 'zh' ? 'text-[#1a3683] dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-500/10' : 'text-slate-600 dark:text-slate-300'}`}
                    >
                      {t.chinese}
                    </button>
                  </div>
                </>
              )}
            </div>

            <button className="p-2 text-slate-500 hover:text-[#1a3683] dark:hover:text-white rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 transition-all relative">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-slate-950"></span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50/50 dark:bg-slate-900/50">
          {activeTab === 'dashboard' && <Dashboard suppliers={suppliers} pos={purchaseOrders} onIssuePO={() => setActiveTab('new-po')} currentLang={lang} />}
          {activeTab === 'suppliers' && (
            <SupplierManagement 
              suppliers={suppliers} 
              onAdd={(s) => setSuppliers([...suppliers, s])} 
              onUpdate={(upd) => setSuppliers(suppliers.map(s => s.id === upd.id ? upd : s))} 
              onDelete={(id) => setSuppliers(suppliers.filter(s => s.id !== id))} 
              canDelete={currentUser.role === 'ADMIN'} 
              categories={supplierCategories}
              onAddCategory={(c) => setSupplierCategories([...supplierCategories, c])}
              onDeleteCategory={(c) => setSupplierCategories(supplierCategories.filter(cat => cat !== c))}
              currentLang={lang}
            />
          )}
          {activeTab === 'pos' && <POManagement pos={purchaseOrders} onView={(p) => { setSelectedPO(p); setActiveTab('view-po'); }} onCreate={() => setActiveTab('new-po')} currentLang={lang} />}
          {activeTab === 'new-po' && <NewPOForm suppliers={suppliers} nextPONumber={`PO-${new Date().getFullYear()}-${String(purchaseOrders.length + 1).padStart(4, '0')}`} currentUser={currentUser} onSubmit={(p) => { setPurchaseOrders([p, ...purchaseOrders]); setActiveTab('pos'); }} onCancel={() => setActiveTab('pos')} currentLang={lang} />}
          {activeTab === 'settings' && <SettingsPage currentUser={currentUser} onUpdateUser={handleUpdateUserProfile} companyInfo={companyInfo} onUpdateCompany={handleUpdateCompanyInfo} currentLang={lang} theme={theme} onThemeChange={handleToggleTheme} onLangChange={handleChangeLang} />}
          {activeTab === 'view-po' && selectedPO && (
            <POView 
              po={selectedPO} 
              supplier={suppliers.find(s => s.id === selectedPO.supplierId)} 
              companyInfo={companyInfo}
              onBack={() => setActiveTab('pos')} 
              onApproveAction={(id, status, comm) => {
                const updated = purchaseOrders.map(p => p.id === id ? { ...p, status, approvalHistory: [...p.approvalHistory, { id: Math.random().toString(), date: new Date().toISOString(), status, userName: currentUser.name, comment: comm }] } : p);
                setPurchaseOrders(updated);
                const updatedPO = updated.find(p => p.id === id);
                if (updatedPO) setSelectedPO(updatedPO);
              }}
              currentUser={currentUser}
              currentLang={lang}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
