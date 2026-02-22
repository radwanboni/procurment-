
import React, { useState } from 'react';
import { Search, Filter, Eye, Calendar, FileText, Briefcase, Truck, PlusCircle, Building, FlaskConical, Fuel, Droplet, LayoutGrid } from 'lucide-react';
import { PurchaseOrder, POStatus, POCategory, Language } from '../types';
import { translations } from '../translations';

interface POManagementProps {
  pos: PurchaseOrder[];
  onView: (po: PurchaseOrder) => void;
  onCreate: () => void;
  currentLang: Language;
}

const POManagement: React.FC<POManagementProps> = ({ pos, onView, onCreate, currentLang }) => {
  const t = translations[currentLang];
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPOs = pos.filter(po => 
    po.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    po.project.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: POStatus) => {
    switch (status) {
      case POStatus.APPROVED: return 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20';
      case POStatus.PENDING: return 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20';
      case POStatus.CANCELLED: return 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20';
      case POStatus.COMPLETED: return 'bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20';
      default: return 'bg-slate-50 text-slate-600 border-slate-100 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20';
    }
  };

  const getCategoryIcon = (cat: POCategory) => {
    switch(cat) {
      case POCategory.MANPOWER: return <Briefcase size={14} className="text-[#f39200]" />;
      case POCategory.EQUIPMENT: return <Truck size={14} className="text-[#f39200]" />;
      case POCategory.TESTING: return <FlaskConical size={14} className="text-[#f39200]" />;
      case POCategory.FUEL: return <Fuel size={14} className="text-[#f39200]" />;
      case POCategory.WATER: return <Droplet size={14} className="text-[#f39200]" />;
      default: return <LayoutGrid size={14} className="text-[#f39200]" />;
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t.pos}</h1>
          <p className="text-slate-500 dark:text-slate-400">Track and manage all your outgoing purchase orders.</p>
        </div>
        <button 
          onClick={onCreate}
          className="bg-[#1a3683] dark:bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition-all shadow-sm flex items-center gap-2"
        >
          <PlusCircle size={18} /> {t.newPo}
        </button>
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
              className="w-full bg-white dark:bg-slate-700 border border-slate-200 dark:border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 border border-slate-200 dark:border-white/10 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-600">
              <Filter size={18} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {filteredPOs.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-white/5 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                  <th className="px-6 py-4">{t.poNumber}</th>
                  <th className="px-6 py-4">{t.project}</th>
                  <th className="px-6 py-4">{t.category}</th>
                  <th className="px-6 py-4 text-center">{t.issueDate}</th>
                  <th className="px-6 py-4 text-center">{t.status}</th>
                  <th className="px-6 py-4 text-right">{t.amount}</th>
                  <th className="px-6 py-4 text-right">{t.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {filteredPOs.map((po) => (
                  <tr key={po.id} className="hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="font-mono font-bold text-[#1a3683] dark:text-indigo-400">{po.poNumber}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <Building size={14} className="text-slate-400" />
                          {po.project}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400">
                        {getCategoryIcon(po.category)}
                        {po.category}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                        <Calendar size={14} className="text-slate-400" />
                        {new Date(po.date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border tracking-wider inline-block ${getStatusColor(po.status)}`}>
                        {po.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">SAR {po.totalAmount.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => onView(po)}
                        className="p-2 text-slate-400 hover:text-[#1a3683] dark:hover:text-white transition-colors rounded-lg hover:bg-indigo-50 dark:hover:bg-slate-600"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-20 flex flex-col items-center justify-center text-slate-400">
              <FileText size={48} className="mb-4 opacity-20" />
              <p className="text-lg font-medium">{t.noRecords}</p>
              <button onClick={onCreate} className="mt-2 text-[#1a3683] dark:text-indigo-400 hover:underline">{t.newPo}</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default POManagement;
