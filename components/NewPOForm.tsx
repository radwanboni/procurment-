
import React, { useState, useMemo } from 'react';
import { Plus, Trash2, ChevronLeft, Save, ShoppingCart, Calculator, Briefcase, Truck, FlaskConical, Droplet, Fuel, LayoutGrid, Building, UserCheck, MoveUp, MoveDown, Info, ShieldCheck } from 'lucide-react';
import { Supplier, PurchaseOrder, POItem, POStatus, POCategory, User, Language } from '../types';
import { translations } from '../translations';

interface NewPOFormProps {
  suppliers: Supplier[];
  nextPONumber: string;
  currentUser: User;
  onSubmit: (po: PurchaseOrder) => void;
  onCancel: () => void;
  currentLang: Language;
}

const DEFAULT_TERMS = `1. Payment Terms: within 30 days after receiving the tax invoice and signed timesheet.
2. Party A is responsible for the supply of all gate passes and licenses.
3. Vendor is responsible for equipment insurance and maintenance.
4. Replacement shall be provided within 24 hours in case of breakdown.
5. Bad weather days are non-chargeable.
6. This PO is subject to TISSA ATGAHAT general procurement policies.`;

const NewPOForm: React.FC<NewPOFormProps> = ({ suppliers, nextPONumber, currentUser, onSubmit, onCancel, currentLang }) => {
  const t = translations[currentLang];
  const [category, setCategory] = useState<POCategory>(POCategory.MANPOWER);
  const [supplierId, setSupplierId] = useState('');
  const [project, setProject] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [notes, setNotes] = useState('');
  const [terms, setTerms] = useState(DEFAULT_TERMS);
  
  const [mobCost, setMobCost] = useState<string>('0');
  const [demobCost, setDemobCost] = useState<string>('0');

  const [companySignatoryName, setCompanySignatoryName] = useState(currentUser.name);
  const [companySignatoryPosition, setCompanySignatoryPosition] = useState(currentUser.role === 'ADMIN' ? 'Procurement Manager' : 'Operations Coordinator');
  const [supplierSignatoryName, setSupplierSignatoryName] = useState('');
  const [supplierSignatoryPosition, setSupplierSignatoryPosition] = useState('Authorized Representative');

  const [items, setItems] = useState<POItem[]>([
    { id: '1', description: '', quantity: 1, unit: 'Days', unitPrice: 0, total: 0 }
  ]);

  const itemsSubtotal = useMemo(() => items.reduce((acc, item) => acc + item.total, 0), [items]);
  const financialSubtotal = itemsSubtotal + (category === POCategory.EQUIPMENT ? (Number(mobCost) + Number(demobCost)) : 0);
  const tax = financialSubtotal * 0.15;
  const totalAmount = financialSubtotal + tax;

  const handleAddItem = () => {
    let defaultUnit = 'Units';
    if (category === POCategory.MANPOWER) defaultUnit = 'Days';
    else if (category === POCategory.EQUIPMENT) defaultUnit = 'Monthly';
    else if (category === POCategory.FUEL || category === POCategory.WATER) defaultUnit = 'Liters';

    setItems([...items, { 
      id: Math.random().toString(36).substr(2, 9), 
      description: '', 
      quantity: 1, 
      unit: defaultUnit, 
      unitPrice: 0, 
      total: 0 
    }]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length > 1) setItems(items.filter(item => item.id !== id));
  };

  const handleUpdateItem = (id: string, field: keyof POItem, value: any) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
          updatedItem.total = Number(updatedItem.quantity) * Number(updatedItem.unitPrice);
        }
        return updatedItem;
      }
      return item;
    }));
  };

  const changeCategory = (newCat: POCategory) => {
    setCategory(newCat);
    if (newCat !== POCategory.EQUIPMENT) {
      setMobCost('0');
      setDemobCost('0');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplierId) return alert('Please select a supplier');
    if (!project) return alert('Please enter a project name');

    const timestamp = new Date().toISOString();
    const newPO: PurchaseOrder = {
      id: Math.random().toString(36).substr(2, 9),
      poNumber: nextPONumber,
      category,
      supplierId,
      project,
      date: timestamp,
      deliveryDate,
      items,
      subtotal: financialSubtotal,
      mobCost: category === POCategory.EQUIPMENT ? Number(mobCost) : undefined,
      demobCost: category === POCategory.EQUIPMENT ? Number(demobCost) : undefined,
      tax,
      totalAmount,
      status: POStatus.PENDING_REVIEW,
      notes,
      termsAndConditions: terms,
      companySignatoryName,
      companySignatoryPosition,
      supplierSignatoryName,
      supplierSignatoryPosition,
      approvalHistory: [
        {
          id: Math.random().toString(36).substr(2, 9),
          date: timestamp,
          status: POStatus.PENDING_REVIEW,
          userName: currentUser.name,
          comment: 'PO submitted for review.'
        }
      ]
    };

    onSubmit(newPO);
  };

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="mb-6 flex items-center justify-between">
        <button onClick={onCancel} className="flex items-center gap-2 text-slate-500 hover:text-[#1a3683] font-bold uppercase tracking-widest text-xs">
          <ChevronLeft size={16} /> {t.backToRecords}
        </button>
        <div className="flex items-center gap-4">
          <span className="text-xl font-black text-[#1a3683] dark:text-indigo-400 font-mono bg-indigo-50 dark:bg-indigo-500/10 px-4 py-1.5 rounded-xl border border-indigo-100 dark:border-indigo-500/20">{nextPONumber}</span>
        </div>
      </div>

      <div className="mb-8 p-1.5 bg-slate-200/50 dark:bg-slate-800 rounded-2xl flex flex-wrap gap-1">
        {(Object.values(POCategory)).map((cat) => (
          <button 
            key={cat}
            type="button"
            onClick={() => changeCategory(cat as POCategory)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${category === cat ? 'bg-[#1a3683] text-white shadow-lg scale-105' : 'text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-700'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          {/* Main Info */}
          <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-white/5 shadow-xl">
            <h3 className="text-sm font-black text-[#1a3683] dark:text-indigo-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
               <Building size={16} /> Primary Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{t.suppliers}</label>
                <select 
                  value={supplierId}
                  onChange={(e) => setSupplierId(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#1a3683] text-slate-900 dark:text-white font-bold"
                  required
                >
                  <option value="">Select Vendor...</option>
                  {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{t.project}</label>
                <input 
                  type="text" 
                  value={project}
                  onChange={(e) => setProject(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none" 
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{t.requestedStartDate}</label>
                <input 
                  type="date" 
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none" 
                  required
                />
              </div>
            </div>
          </div>

          {/* Line Items */}
          <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-white/5 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-black text-[#1a3683] dark:text-indigo-400 uppercase tracking-[0.2em] flex items-center gap-2">
                 <ShoppingCart size={16} /> {t.lineItems}
              </h3>
              <button type="button" onClick={handleAddItem} className="bg-indigo-50 dark:bg-indigo-500/10 text-[#1a3683] dark:text-indigo-400 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#1a3683] hover:text-white transition-all">
                + Add Row
              </button>
            </div>
            <div className="space-y-3">
              {items.map((item, idx) => (
                <div key={item.id} className="grid grid-cols-12 gap-3 items-end p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-white/5 group">
                  <div className="col-span-4">
                    <label className="text-[9px] font-black text-slate-400 uppercase mb-1 block">Description</label>
                    <input value={item.description} onChange={e => handleUpdateItem(item.id, 'description', e.target.value)} className="w-full bg-white dark:bg-slate-800 border-none rounded-lg px-3 py-2 text-sm" required />
                  </div>
                  <div className="col-span-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase mb-1 block">Qty</label>
                    <input type="number" value={item.quantity} onChange={e => handleUpdateItem(item.id, 'quantity', e.target.value)} className="w-full bg-white dark:bg-slate-800 border-none rounded-lg px-3 py-2 text-sm" required />
                  </div>
                  <div className="col-span-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase mb-1 block">Unit</label>
                    <select 
                      value={item.unit} 
                      onChange={e => handleUpdateItem(item.id, 'unit', e.target.value)} 
                      className="w-full bg-white dark:bg-slate-800 border-none rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="Units">Units</option>
                      <option value="Monthly">Monthly</option>
                      <option value="Days">Days</option>
                      <option value="Hours">Hours</option>
                      <option value="Liters">Liters</option>
                      <option value="Months">Months</option>
                      <option value="Kg">Kg</option>
                      <option value="Meters">Meters</option>
                      <option value="LS">Lump Sum</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase mb-1 block">Price</label>
                    <input type="number" value={item.unitPrice} onChange={e => handleUpdateItem(item.id, 'unitPrice', e.target.value)} className="w-full bg-white dark:bg-slate-800 border-none rounded-lg px-3 py-2 text-sm" required />
                  </div>
                  <div className="col-span-2 flex items-center gap-2">
                    <div className="flex-1 text-right font-bold text-xs">SAR {item.total.toLocaleString()}</div>
                    <button type="button" onClick={() => handleRemoveItem(item.id)} className="text-rose-400 hover:text-rose-600 transition-colors"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Signatories Section */}
          <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-white/5 shadow-xl">
             <h3 className="text-sm font-black text-[#1a3683] dark:text-indigo-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
               <ShieldCheck size={16} /> Signatory Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                 <p className="text-[10px] font-black text-slate-400 uppercase border-b dark:border-white/5 pb-2">TISSA ATGAHAT Signatory</p>
                 <input placeholder="Signatory Name" value={companySignatoryName} onChange={e => setCompanySignatoryName(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-2.5 text-sm" />
                 <input placeholder="Signatory Position" value={companySignatoryPosition} onChange={e => setCompanySignatoryPosition(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-2.5 text-sm" />
              </div>
              <div className="space-y-4">
                 <p className="text-[10px] font-black text-slate-400 uppercase border-b dark:border-white/5 pb-2">Vendor Signatory</p>
                 <input placeholder="Signatory Name" value={supplierSignatoryName} onChange={e => setSupplierSignatoryName(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-2.5 text-sm" />
                 <input placeholder="Signatory Position" value={supplierSignatoryPosition} onChange={e => setSupplierSignatoryPosition(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-2.5 text-sm" />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          {/* Financials & Adjustments */}
          <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-white/5 shadow-xl sticky top-8">
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-6">Financial Summary</h3>
            
            {category === POCategory.EQUIPMENT && (
              <div className="space-y-4 mb-6 p-4 bg-indigo-50/50 dark:bg-indigo-500/5 rounded-2xl border border-indigo-100/50 dark:border-indigo-500/10">
                <p className="text-[10px] font-black text-[#1a3683] dark:text-indigo-400 uppercase mb-2 flex items-center gap-1">
                  <Info size={12} /> Rental Specifics
                </p>
                <div>
                  <label className="text-[10px] font-bold text-slate-500">Mobilization Cost (SAR)</label>
                  <input type="number" value={mobCost} onChange={e => setMobCost(e.target.value)} className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/5 rounded-lg px-3 py-2 text-sm font-mono mt-1" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500">Demobilization Cost (SAR)</label>
                  <input type="number" value={demobCost} onChange={e => setDemobCost(e.target.value)} className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/5 rounded-lg px-3 py-2 text-sm font-mono mt-1" />
                </div>
              </div>
            )}

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-slate-500">
                <span>Items Subtotal</span>
                <span className="font-mono">SAR {itemsSubtotal.toLocaleString()}</span>
              </div>
              {category === POCategory.EQUIPMENT && (
                <div className="flex justify-between text-slate-500">
                  <span>Logistics Total</span>
                  <span className="font-mono">SAR {(Number(mobCost) + Number(demobCost)).toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-500">
                <span>VAT (15%)</span>
                <span className="font-mono">SAR {tax.toLocaleString()}</span>
              </div>
              <div className="pt-4 border-t border-slate-100 dark:border-white/10">
                <div className="flex justify-between text-2xl font-black text-[#1a3683] dark:text-indigo-400">
                  <span>Total</span>
                  <span className="font-mono leading-none">{totalAmount.toLocaleString()}</span>
                </div>
                <p className="text-[10px] text-slate-400 text-right mt-1 font-bold uppercase tracking-widest">Saudi Riyals</p>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <button type="submit" className="w-full bg-[#1a3683] text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-indigo-100 dark:shadow-none hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                <Save size={20} /> Issue Purchase Order
              </button>
              <button type="button" onClick={onCancel} className="w-full py-4 text-slate-400 font-bold uppercase tracking-widest text-xs hover:text-rose-500 transition-colors">
                Discard Draft
              </button>
            </div>
          </div>

          <div className="bg-slate-100/50 dark:bg-slate-900/50 p-6 rounded-3xl border border-slate-200 dark:border-white/5">
             <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Terms & Conditions Editor</h3>
             <textarea 
               value={terms}
               onChange={e => setTerms(e.target.value)}
               className="w-full h-48 bg-transparent border-none text-[10px] text-slate-500 leading-relaxed outline-none resize-none font-mono"
             />
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewPOForm;
