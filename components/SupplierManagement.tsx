
import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  ExternalLink, 
  Trash2, 
  Edit, 
  X, 
  Tags,
  AlertCircle,
  CheckCircle2,
  Filter,
  CreditCard,
  Building2,
  FileDown,
  Printer,
  Download
} from 'lucide-react';
import { Supplier, Language, CompanyInfo } from '../types';
import { translations } from '../translations';

interface SupplierManagementProps {
  suppliers: Supplier[];
  onAdd: (supplier: Supplier) => void;
  onUpdate: (supplier: Supplier) => void;
  onDelete: (id: string) => void;
  canDelete: boolean;
  categories: string[];
  onAddCategory: (cat: string) => void;
  onDeleteCategory: (cat: string) => void;
  currentLang: Language;
  companyInfo: CompanyInfo;
}

const SupplierManagement: React.FC<SupplierManagementProps> = ({ 
  suppliers, 
  onAdd, 
  onUpdate, 
  onDelete, 
  canDelete, 
  categories,
  onAddCategory,
  onDeleteCategory,
  currentLang,
  companyInfo
}) => {
  const t = translations[currentLang];
  const [searchTerm, setSearchTerm] = useState('');
  const [showFormModal, setShowFormModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [viewingSupplier, setViewingSupplier] = useState<Supplier | null>(null);
  const [newCatName, setNewCatName] = useState('');
  const [selectedFilterCategory, setSelectedFilterCategory] = useState<string>('All');

  const filteredSuppliers = suppliers.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          s.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedFilterCategory === 'All' || s.category === selectedFilterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleOpenEdit = (supplier: Supplier) => {
    if (!canDelete) return alert('Admin access required');
    setEditingSupplier(supplier);
    setShowFormModal(true);
  };

  const handleAddCatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    onAddCategory(newCatName.trim());
    setNewCatName('');
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const categoryValue = formData.get('category') as string;

    const commonData = {
      name: formData.get('name') as string,
      contactPerson: formData.get('contact') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      address: formData.get('address') as string,
      category: categoryValue,
      bankName: formData.get('bankName') as string,
      accountNumber: formData.get('accountNumber') as string,
      iban: formData.get('iban') as string,
      swiftCode: formData.get('swiftCode') as string,
      performanceMetrics: {
        quality: Number(formData.get('qualityRating') || 5),
        delivery: Number(formData.get('deliveryRating') || 5),
        communication: Number(formData.get('communicationRating') || 5),
      }
    };

    if (editingSupplier) {
      onUpdate({
        ...editingSupplier,
        ...commonData,
      });
    } else {
      onAdd({
        id: Math.random().toString(36).substr(2, 9),
        ...commonData,
        createdAt: new Date().toISOString()
      });
    }
    setShowFormModal(false);
    setEditingSupplier(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t.supplierDirectory}</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage your vendor relationships and bank details.</p>
        </div>
        <div className="flex gap-2">
          {canDelete && (
            <>
              <button 
                onClick={() => setShowReportModal(true)}
                className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/5 px-4 py-2.5 rounded-lg font-semibold hover:bg-slate-50 transition-all flex items-center gap-2"
              >
                <FileDown size={18} /> {t.generateReport}
              </button>
              <button 
                onClick={() => setShowCategoryModal(true)}
                className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/5 px-4 py-2.5 rounded-lg font-semibold hover:bg-slate-50 transition-all flex items-center gap-2"
              >
                <Tags size={18} /> {t.categories}
              </button>
            </>
          )}
          <button 
            onClick={() => { setEditingSupplier(null); setShowFormModal(true); }}
            className="bg-[#1a3683] dark:bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-slate-800 shadow-sm flex items-center gap-2"
          >
            <Plus size={18} /> {t.addSupplier}
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-white/5 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder={t.search} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white dark:bg-slate-700 border border-slate-200 dark:border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-[#1a3683] outline-none text-slate-900 dark:text-white"
            />
          </div>
          <div className="flex items-center gap-3">
             <Filter size={18} className="text-slate-400" />
             <select 
               value={selectedFilterCategory}
               onChange={(e) => setSelectedFilterCategory(e.target.value)}
               className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1a3683] outline-none text-slate-900 dark:text-white"
             >
               <option value="All">All Categories</option>
               {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
             </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 dark:border-white/5 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                <th className="px-6 py-4">{t.companyName}</th>
                <th className="px-6 py-4">{t.contactPerson}</th>
                <th className="px-6 py-4">{t.category}</th>
                <th className="px-6 py-4">{t.overallRating}</th>
                <th className="px-6 py-4 text-right">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {filteredSuppliers.length > 0 ? filteredSuppliers.map((supplier) => (
                <tr key={supplier.id} className="hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-900 dark:text-white group-hover:text-[#1a3683] dark:group-hover:text-indigo-400 transition-colors">{supplier.name}</span>
                      <span className="text-xs text-slate-400 truncate max-w-[200px]">{supplier.address}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{supplier.contactPerson}</span>
                      <span className="text-xs text-slate-400">{supplier.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-[#1a3683] dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest border border-indigo-100 dark:border-indigo-500/20">
                      {supplier.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      {(() => {
                        const rating = supplier.performanceMetrics ? (supplier.performanceMetrics.quality + supplier.performanceMetrics.delivery + supplier.performanceMetrics.communication) / 3 : 0;
                        return (
                          <>
                            {[1, 2, 3, 4, 5].map((star) => (
                              <div 
                                key={star} 
                                className={`w-2 h-2 rounded-full ${star <= Math.round(rating) ? 'bg-amber-400' : 'bg-slate-200 dark:bg-slate-700'}`}
                              />
                            ))}
                            <span className="text-xs font-bold text-slate-600 dark:text-slate-400 ml-1">
                              {supplier.performanceMetrics ? rating.toFixed(1) : 'N/A'}
                            </span>
                          </>
                        );
                      })()}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                       <button 
                         onClick={() => { setViewingSupplier(supplier); setShowProfileModal(true); }} 
                         className="p-2 text-slate-400 hover:text-[#1a3683] dark:hover:text-white hover:bg-white dark:hover:bg-slate-600 rounded-lg transition-all"
                         title="View Profile"
                       >
                         <ExternalLink size={18} />
                       </button>
                       {canDelete && (
                         <>
                           <button 
                             onClick={() => handleOpenEdit(supplier)} 
                             className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-slate-600 rounded-lg transition-all"
                             title="Edit"
                           >
                             <Edit size={18} />
                           </button>
                           <button 
                             onClick={() => onDelete(supplier.id)} 
                             className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-white dark:hover:bg-slate-600 rounded-lg transition-all"
                             title="Delete"
                           >
                             <Trash2 size={18} />
                           </button>
                         </>
                       )}
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-slate-400 italic">{t.noRecords}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Supplier Form Modal */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300 max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50 dark:bg-slate-900 shrink-0">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">{editingSupplier ? t.editSupplier : t.addSupplier}</h2>
              <button onClick={() => setShowFormModal(false)} className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-full transition-colors"><X size={20} className="text-slate-400" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto">
               <div className="space-y-4">
                 <h3 className="text-sm font-bold text-[#1a3683] dark:text-indigo-400 border-b dark:border-white/5 pb-2">General Information</h3>
                 <div>
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1">{t.companyName}</label>
                    <input name="name" defaultValue={editingSupplier?.name || ''} required className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#1a3683] text-slate-900 dark:text-white" />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                   <div>
                      <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1">{t.contactPerson}</label>
                      <input name="contact" defaultValue={editingSupplier?.contactPerson || ''} required className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#1a3683] text-slate-900 dark:text-white" />
                   </div>
                   <div>
                      <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1">{t.category}</label>
                      <select 
                        name="category" 
                        defaultValue={editingSupplier?.category || categories[0]} 
                        className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#1a3683] text-slate-900 dark:text-white"
                      >
                         {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                   </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                   <div>
                      <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1">{t.email}</label>
                      <input name="email" type="email" defaultValue={editingSupplier?.email || ''} required className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#1a3683] text-slate-900 dark:text-white" />
                   </div>
                   <div>
                      <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1">{t.phone}</label>
                      <input name="phone" defaultValue={editingSupplier?.phone || ''} required className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#1a3683] text-slate-900 dark:text-white" />
                   </div>
                 </div>
                 <div>
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1">{t.address}</label>
                    <textarea name="address" rows={2} defaultValue={editingSupplier?.address || ''} required className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#1a3683] text-slate-900 dark:text-white" />
                 </div>
               </div>

               <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-white/5">
                 <h3 className="text-sm font-bold text-[#1a3683] dark:text-indigo-400 border-b dark:border-white/5 pb-2 flex items-center gap-2">
                   <CreditCard size={16} /> {t.bankInfo}
                 </h3>
                 <div className="grid grid-cols-2 gap-4">
                   <div>
                      <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1">{t.bankName}</label>
                      <input name="bankName" defaultValue={editingSupplier?.bankName || ''} placeholder="E.g. Al Rajhi Bank" className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#1a3683] text-slate-900 dark:text-white" />
                   </div>
                   <div>
                      <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1">{t.accountNumber}</label>
                      <input name="accountNumber" defaultValue={editingSupplier?.accountNumber || ''} placeholder="Account #" className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#1a3683] text-slate-900 dark:text-white" />
                   </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                   <div>
                      <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1">{t.iban}</label>
                      <input name="iban" defaultValue={editingSupplier?.iban || ''} placeholder="SA..." className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#1a3683] text-slate-900 dark:text-white" />
                   </div>
                   <div>
                      <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1">{t.swiftCode}</label>
                      <input name="swiftCode" defaultValue={editingSupplier?.swiftCode || ''} placeholder="SWIFT/BIC" className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#1a3683] text-slate-900 dark:text-white" />
                   </div>
                 </div>
               </div>

               <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-[#1a3683] dark:text-indigo-400 border-b dark:border-white/5 pb-2 flex items-center gap-2">
                    <CheckCircle2 size={16} /> {t.performanceMetrics}
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                       <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1">{t.qualityRating}</label>
                       <select name="qualityRating" defaultValue={editingSupplier?.performanceMetrics?.quality || 5} className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#1a3683] text-slate-900 dark:text-white">
                         {[1, 2, 3, 4, 5].map(v => <option key={v} value={v}>{v}</option>)}
                       </select>
                    </div>
                    <div>
                       <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1">{t.deliveryRating}</label>
                       <select name="deliveryRating" defaultValue={editingSupplier?.performanceMetrics?.delivery || 5} className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#1a3683] text-slate-900 dark:text-white">
                         {[1, 2, 3, 4, 5].map(v => <option key={v} value={v}>{v}</option>)}
                       </select>
                    </div>
                    <div>
                       <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1">{t.communicationRating}</label>
                       <select name="communicationRating" defaultValue={editingSupplier?.performanceMetrics?.communication || 5} className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#1a3683] text-slate-900 dark:text-white">
                         {[1, 2, 3, 4, 5].map(v => <option key={v} value={v}>{v}</option>)}
                       </select>
                    </div>
                  </div>
                </div>

               <div className="pt-4 flex gap-3 pb-2">
                  <button type="button" onClick={() => setShowFormModal(false)} className="flex-1 px-4 py-3 border border-slate-200 dark:border-white/5 rounded-xl font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">{t.cancel}</button>
                  <button type="submit" className="flex-1 px-4 py-3 bg-[#1a3683] dark:bg-indigo-600 text-white rounded-xl font-bold hover:bg-slate-800 shadow-lg shadow-indigo-100 transition-colors">{t.saveSupplier}</button>
               </div>
            </form>
          </div>
        </div>
      )}

      {/* Supplier Profile Modal */}
      {showProfileModal && viewingSupplier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300 max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50 dark:bg-slate-900 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#1a3683] flex items-center justify-center text-white font-bold text-xl">
                  {viewingSupplier.name.substring(0, 1)}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">{viewingSupplier.name}</h2>
                  <span className="text-xs font-bold text-[#f39200] uppercase tracking-widest">{viewingSupplier.category}</span>
                </div>
              </div>
              <button onClick={() => setShowProfileModal(false)} className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-full transition-colors"><X size={20} className="text-slate-400" /></button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b dark:border-white/5 pb-2 flex items-center gap-2">
                    <Building2 size={16} className="text-[#1a3683]" /> {t.company}
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.contactPerson}</p>
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{viewingSupplier.contactPerson}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.email}</p>
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{viewingSupplier.email}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.phone}</p>
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{viewingSupplier.phone}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.address}</p>
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{viewingSupplier.address}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b dark:border-white/5 pb-2 flex items-center gap-2">
                    <CreditCard size={16} className="text-[#1a3683]" /> {t.bankInfo}
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.bankName}</p>
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{viewingSupplier.bankName || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.accountNumber}</p>
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{viewingSupplier.accountNumber || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.iban}</p>
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-200 font-mono">{viewingSupplier.iban || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.swiftCode}</p>
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-200 font-mono">{viewingSupplier.swiftCode || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b dark:border-white/5 pb-2 flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[#1a3683]" /> {t.performanceMetrics}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { label: t.qualityRating, value: viewingSupplier.performanceMetrics?.quality || 0 },
                    { label: t.deliveryRating, value: viewingSupplier.performanceMetrics?.delivery || 0 },
                    { label: t.communicationRating, value: viewingSupplier.performanceMetrics?.communication || 0 },
                  ].map((metric, idx) => (
                    <div key={idx} className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-white/5">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{metric.label}</p>
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map(star => (
                            <div key={star} className={`w-3 h-3 rounded-full ${star <= metric.value ? 'bg-amber-400' : 'bg-slate-200 dark:bg-slate-700'}`} />
                          ))}
                        </div>
                        <span className="text-lg font-bold text-slate-900 dark:text-white">{metric.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-[#1a3683] dark:bg-indigo-600/20 p-6 rounded-2xl flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">{t.overallRating}</p>
                    <p className="text-white text-3xl font-black">
                      {viewingSupplier.performanceMetrics ? ((viewingSupplier.performanceMetrics.quality + viewingSupplier.performanceMetrics.delivery + viewingSupplier.performanceMetrics.communication) / 3).toFixed(1) : 'N/A'}
                    </p>
                  </div>
                  <div className="w-16 h-16 rounded-full border-4 border-white/20 flex items-center justify-center">
                     <CheckCircle2 size={32} className="text-[#f39200]" />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-slate-900 flex justify-end shrink-0">
              <button onClick={() => setShowProfileModal(false)} className="px-8 py-3 bg-[#1a3683] dark:bg-indigo-600 text-white rounded-xl font-bold hover:bg-slate-800 shadow-lg transition-colors">Close Profile</button>
            </div>
          </div>
        </div>
      )}

      {/* Category Management Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
            <div className="p-6 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50 dark:bg-slate-900">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t.categories}</h2>
              <button onClick={() => setShowCategoryModal(false)} className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-full transition-colors"><X size={20} className="text-slate-400" /></button>
            </div>
            <div className="p-6 space-y-6">
              <form onSubmit={handleAddCatSubmit} className="flex gap-2">
                <input 
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="New category name..."
                  className="flex-1 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1a3683] text-slate-900 dark:text-white"
                />
                <button type="submit" className="bg-[#1a3683] text-white p-2 rounded-xl hover:bg-slate-800 transition-colors">
                  <Plus size={20} />
                </button>
              </form>
              
              <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                {categories.map(cat => (
                  <div key={cat} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-white/5 group">
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{cat}</span>
                    <button 
                      onClick={() => onDeleteCategory(cat)}
                      className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 dark:border-white/5 flex justify-end">
              <button onClick={() => setShowCategoryModal(false)} className="px-6 py-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg font-bold hover:bg-slate-200 transition-colors">Done</button>
            </div>
          </div>
        </div>
      )}

      {/* Supplier Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300 max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50 dark:bg-slate-900 shrink-0 no-print">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t.generateReport}</h2>
              <div className="flex gap-2">
                <button onClick={() => window.print()} className="flex items-center gap-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-white/10 px-4 py-2 rounded-xl text-slate-700 dark:text-white font-bold text-sm hover:bg-slate-50 transition-all">
                  <Printer size={18} /> {t.printDoc}
                </button>
                <button onClick={() => setShowReportModal(false)} className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-full transition-colors"><X size={20} className="text-slate-400" /></button>
              </div>
            </div>
            
            <div id="supplier-report" className="p-8 md:p-12 overflow-y-auto bg-white text-slate-900">
              <div className="flex justify-between items-start mb-12">
                <div className="flex gap-6 items-start">
                  {companyInfo.logo && <img src={companyInfo.logo} alt="Logo" className="w-20 h-20 object-contain" />}
                  <div>
                    <h1 className="text-2xl font-black text-[#1a3683] leading-none mb-1">{companyInfo.nameEn}</h1>
                    <h2 className="text-xl font-bold text-slate-400 mb-4">{companyInfo.nameZh}</h2>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Supplier Performance Report</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400 font-bold">{new Date().toLocaleDateString()}</p>
                  <p className="text-xs text-slate-400">Total Suppliers: {suppliers.length}</p>
                </div>
              </div>

              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-y border-slate-200">
                    <th className="py-3 px-4 font-black uppercase tracking-widest text-[#1a3683]">Supplier Name</th>
                    <th className="py-3 px-4 font-black uppercase tracking-widest text-[#1a3683]">Category</th>
                    <th className="py-3 px-4 font-black uppercase tracking-widest text-[#1a3683]">Quality</th>
                    <th className="py-3 px-4 font-black uppercase tracking-widest text-[#1a3683]">Delivery</th>
                    <th className="py-3 px-4 font-black uppercase tracking-widest text-[#1a3683]">Comm.</th>
                    <th className="py-3 px-4 font-black uppercase tracking-widest text-[#1a3683] text-right">Overall</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {suppliers.map(s => {
                    const rating = s.performanceMetrics ? (s.performanceMetrics.quality + s.performanceMetrics.delivery + s.performanceMetrics.communication) / 3 : 5;
                    return (
                      <tr key={s.id}>
                        <td className="py-3 px-4 font-bold">{s.name}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[9px] font-bold uppercase tracking-wider">
                            {s.category}
                          </span>
                        </td>
                        <td className="py-3 px-4">{s.performanceMetrics?.quality || 5}/5</td>
                        <td className="py-3 px-4">{s.performanceMetrics?.delivery || 5}/5</td>
                        <td className="py-3 px-4">{s.performanceMetrics?.communication || 5}/5</td>
                        <td className="py-3 px-4 text-right font-black text-[#1a3683]">{rating.toFixed(1)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              
              <div className="mt-12 pt-8 border-t border-slate-100 grid grid-cols-2 gap-8">
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Report Summary</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-slate-500">Average Quality Rating:</span>
                      <span className="font-bold">{(suppliers.reduce((acc, s) => acc + (s.performanceMetrics?.quality || 5), 0) / (suppliers.length || 1)).toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between text-[10px]">
                      <span className="text-slate-500">Average Delivery Rating:</span>
                      <span className="font-bold">{(suppliers.reduce((acc, s) => acc + (s.performanceMetrics?.delivery || 5), 0) / (suppliers.length || 1)).toFixed(1)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end justify-end">
                  <div className="w-48 border-b border-slate-200 mb-2"></div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Authorized Signature</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplierManagement;
