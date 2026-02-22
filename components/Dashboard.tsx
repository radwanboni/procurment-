
import React, { useMemo, useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  FileText, 
  CreditCard, 
  Clock, 
  Sparkles,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Supplier, PurchaseOrder, POStatus, Language } from '../types';
import { translations } from '../translations';
import { getProcurementInsights } from '../services/geminiService';

interface DashboardProps {
  suppliers: Supplier[];
  pos: PurchaseOrder[];
  onIssuePO: () => void;
  currentLang: Language;
}

const Dashboard: React.FC<DashboardProps> = ({ suppliers, pos, onIssuePO, currentLang }) => {
  const [insights, setInsights] = useState<any[]>([]);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const t = translations[currentLang];

  useEffect(() => {
    const fetchInsights = async () => {
      if (suppliers.length === 0 && pos.length === 0) return;
      setLoadingInsights(true);
      const res = await getProcurementInsights({ suppliers, purchaseOrders: pos });
      setInsights(res);
      setLoadingInsights(false);
    };
    fetchInsights();
  }, [suppliers, pos]);

  const stats = useMemo(() => {
    // Corrected Calculations
    const totalSpendValue = pos.reduce((acc, curr) => acc + (Number(curr.totalAmount) || 0), 0);
    const pendingCount = pos.filter(p => 
      p.status === POStatus.PENDING_REVIEW || 
      p.status === POStatus.PENDING_APPROVAL || 
      p.status === POStatus.PENDING
    ).length;
    const supplierCount = suppliers.length;
    const orderCount = pos.length;

    return [
      { 
        label: t.totalSpend, 
        value: `SAR ${totalSpendValue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`, 
        icon: CreditCard, 
        color: 'text-emerald-600 dark:text-emerald-400', 
        bg: 'bg-emerald-50 dark:bg-emerald-500/10' 
      },
      { 
        label: t.activeSuppliers, 
        value: supplierCount, 
        icon: Users, 
        color: 'text-indigo-600 dark:text-indigo-400', 
        bg: 'bg-indigo-50 dark:bg-indigo-500/10' 
      },
      { 
        label: t.totalOrders, 
        value: orderCount, 
        icon: FileText, 
        color: 'text-amber-600 dark:text-amber-400', 
        bg: 'bg-amber-50 dark:bg-amber-500/10' 
      },
      { 
        label: t.pendingApproval, 
        value: pendingCount, 
        icon: Clock, 
        color: 'text-rose-600 dark:text-rose-400', 
        bg: 'bg-rose-50 dark:bg-rose-500/10' 
      },
    ];
  }, [suppliers, pos, t]);

  const chartData = useMemo(() => {
    const monthsEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();
    const monthlyData: Record<string, number> = {};
    monthsEn.forEach(m => monthlyData[m] = 0);

    pos.forEach(po => {
      const poDate = new Date(po.date);
      if (poDate.getFullYear() === currentYear) {
        const monthName = monthsEn[poDate.getMonth()];
        monthlyData[monthName] += Number(po.totalAmount) || 0;
      }
    });

    return monthsEn.map(name => ({
      name,
      total: monthlyData[name]
    })).filter((_, i) => i <= new Date().getMonth() || monthlyData[monthsEn[i]] > 0);
  }, [pos]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t.dashboard}</h1>
          <p className="text-slate-500 dark:text-slate-400">TISSA ATGAHAT Procurement System</p>
        </div>
        <button 
          onClick={onIssuePO}
          className="bg-[#1a3683] dark:bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-slate-800 transition-all shadow-sm flex items-center justify-center gap-2"
        >
          <TrendingUp size={18} /> {t.newPo}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-white/5 shadow-sm transition-transform hover:scale-[1.02]">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Live</span>
            </div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-white/5 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">Expenditure Analysis</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" opacity={0.1} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                <Tooltip 
                  formatter={(value: number) => [`SAR ${value.toLocaleString()}`, 'Total Spend']}
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }}
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                />
                <Bar dataKey="total" fill="#1a3683" radius={[6, 6, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#1a3683] dark:bg-slate-950 rounded-xl p-6 text-white relative overflow-hidden shadow-lg border dark:border-white/10">
          <Sparkles className="absolute top-4 right-4 text-[#f39200] opacity-50" size={24} />
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">AI Insights</h3>
          
          <div className="space-y-4 relative z-10">
            {loadingInsights ? (
              <div className="space-y-3 opacity-50 animate-pulse">
                <div className="h-20 bg-white/5 rounded-2xl"></div>
                <div className="h-20 bg-white/5 rounded-2xl"></div>
              </div>
            ) : insights.map((insight, idx) => (
              <div key={idx} className="bg-white/10 p-4 rounded-xl border border-white/5 relative group">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-bold text-sm">{insight.title}</h4>
                  <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${
                    insight.priority === 'High' ? 'bg-rose-500 text-white' : 
                    insight.priority === 'Medium' ? 'bg-amber-500 text-white' : 'bg-emerald-500 text-white'
                  }`}>
                    {insight.priority}
                  </span>
                </div>
                <p className="text-xs text-slate-100/70 line-clamp-2 group-hover:line-clamp-none transition-all">{insight.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
