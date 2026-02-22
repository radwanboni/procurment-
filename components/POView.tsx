
import React, { useState } from 'react';
import { 
  ChevronLeft, Printer, Download, MapPin, Briefcase, Truck, FlaskConical, 
  Droplet, Fuel, LayoutGrid, Building, CheckCircle2, XCircle, ListTodo, 
  Send, History, MoveUp, MoveDown, CreditCard, Building2, Landmark, Hash, AlertTriangle,
  // Fix: Added missing icons to the imports
  Clock, ShieldCheck
} from 'lucide-react';
import { PurchaseOrder, Supplier, POStatus, POCategory, User, CompanyInfo, Language } from '../types';
import { translations } from '../translations';

interface POViewProps {
  po: PurchaseOrder;
  supplier: Supplier | undefined;
  companyInfo: CompanyInfo;
  onBack: () => void;
  onApproveAction: (poId: string, nextStatus: POStatus, comment?: string) => void;
  currentUser: User;
  currentLang: Language;
}

const POView: React.FC<POViewProps> = ({ po, supplier, companyInfo, onBack, onApproveAction, currentUser, currentLang }) => {
  const t = translations[currentLang];
  const [comment, setComment] = useState('');

  if (!supplier) {
    return (
      <div className="max-w-xl mx-auto mt-20 p-8 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-white/5 shadow-xl text-center">
        <AlertTriangle size={48} className="mx-auto text-rose-500 mb-4" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Supplier Data Missing</h2>
        <button onClick={onBack} className="mt-6 bg-[#1a3683] text-white px-6 py-2 rounded-xl font-bold">{t.backToRecords}</button>
      </div>
    );
  }

  const qrData = `${companyInfo.nameEn}|PO:${po.poNumber}|AMT:${po.totalAmount}|SUP:${supplier.name}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrData)}`;

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = () => {
    const element = document.getElementById('po-document');
    if (!element) return;
    
    const opt = {
      margin: 0,
      filename: `PO_${po.poNumber}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // @ts-ignore
    html2pdf().set(opt).from(element).save();
  };

  const getCategoryTheme = () => {
    switch(po.category) {
      case POCategory.MANPOWER: return { icon: Briefcase, label: 'Manpower Supply', descHead: 'Role / Position', qtyHead: 'HC' };
      case POCategory.EQUIPMENT: return { icon: Truck, label: 'Equipment Rental', descHead: 'Model', qtyHead: 'Qty' };
      case POCategory.TESTING: return { icon: FlaskConical, label: 'Testing & Calibration', descHead: 'Test Item', qtyHead: 'Count' };
      case POCategory.FUEL: return { icon: Fuel, label: 'Fuel Supply', descHead: 'Fuel Type', qtyHead: 'Liters' };
      case POCategory.WATER: return { icon: Droplet, label: 'Water Supply', descHead: 'Service', qtyHead: 'Units' };
      default: return { icon: LayoutGrid, label: 'Purchase Order', descHead: 'Description', qtyHead: 'Qty' };
    }
  };

  const theme = getCategoryTheme();
  const isAdmin = currentUser.role === 'ADMIN';
  const canReview = isAdmin && po.status === POStatus.PENDING_REVIEW;

  return (
    <div className="max-w-5xl mx-auto pb-24">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 no-print">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-[#1a3683] font-bold uppercase tracking-widest text-xs transition-colors">
          <ChevronLeft size={16} /> {t.backToRecords}
        </button>
        <div className="flex gap-2">
          <button onClick={handlePrint} className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/5 px-5 py-2.5 rounded-xl text-slate-700 dark:text-white font-bold text-sm shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
            <Printer size={18} /> {t.printDoc}
          </button>
          <button onClick={handleExportPDF} className="flex items-center gap-2 bg-[#1a3683] dark:bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-xl transition-all hover:bg-slate-800 dark:hover:bg-indigo-700">
            <Download size={18} /> {t.exportPdf}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8">
          <div id="po-document" className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative print:shadow-none print:border-none print:m-0 print:p-0">
             {/* Watermark - Only visible in print/export */}
             <div className="watermark-container hidden print:flex">
                {companyInfo.logo && <img src={companyInfo.logo} alt="" />}
             </div>

             <div className="p-8 md:p-12 pb-24">
                {/* Document Header */}
                <div className="flex justify-between items-start mb-12">
                   <div className="flex gap-6 items-start">
                      {companyInfo.logo && <img src={companyInfo.logo} alt="Logo" className="w-20 h-20 object-contain" />}
                      <div>
                        <h1 className="text-2xl font-black text-[#1a3683] leading-none mb-1">{companyInfo.nameEn}</h1>
                        <h2 className="text-xl font-bold text-slate-400 mb-4">{companyInfo.nameZh}</h2>
                        <div className="text-[10px] text-slate-500 space-y-0.5 leading-relaxed">
                          <p className="flex items-center gap-1"><MapPin size={10} /> {companyInfo.address}</p>
                          <p>C.R. No: {companyInfo.crNumber} | VAT No: {companyInfo.vatNumber}</p>
                        </div>
                      </div>
                   </div>
                   <div className="text-right flex flex-col items-end">
                      <div className="bg-[#1a3683] text-white px-4 py-2 rounded-lg mb-4 print:bg-[#1a3683]">
                         <span className="text-[9px] font-black uppercase tracking-widest block opacity-70">Document Type</span>
                         <span className="text-sm font-bold uppercase">{theme.label}</span>
                      </div>
                      <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{t.poNumber}</span>
                      <p className="text-2xl font-mono font-black text-[#1a3683]">{po.poNumber}</p>
                      <p className="text-xs text-slate-400 mt-1 font-bold">{new Date(po.date).toLocaleDateString()}</p>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-12 mb-12 border-y border-slate-100 py-8">
                   <div className="space-y-4">
                      <div>
                        <h3 className="text-[10px] font-black text-[#1a3683] uppercase tracking-widest mb-2">Vendor Details</h3>
                        <p className="font-bold text-slate-900 text-base">{supplier.name}</p>
                        <p className="text-xs text-slate-500 mt-1">{supplier.address}</p>
                        <div className="mt-3 text-[10px] text-slate-600 space-y-1">
                          <p>Contact: {supplier.contactPerson}</p>
                          <p>Email: {supplier.email}</p>
                          <p>Phone: {supplier.phone}</p>
                        </div>
                      </div>
                   </div>
                   <div className="text-right space-y-4">
                      <div>
                        <h3 className="text-[10px] font-black text-[#1a3683] uppercase tracking-widest mb-2">{t.project}</h3>
                        <p className="font-bold text-slate-900 text-base">{po.project}</p>
                        <p className="text-xs text-slate-500 mt-1">Delivery: {po.deliveryDate ? new Date(po.deliveryDate).toLocaleDateString() : 'TBD'}</p>
                      </div>
                      <div className="flex justify-end">
                        <img src={qrUrl} alt="Verify PO" className="w-24 h-24 border border-slate-100 rounded p-1" />
                      </div>
                   </div>
                </div>

                {/* Items Table */}
                <div className="mb-12 overflow-hidden rounded-xl border border-slate-100">
                   <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50">
                         <tr className="text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
                            <th className="py-4 px-6">{theme.descHead}</th>
                            <th className="py-4 px-4 text-center">{theme.qtyHead}</th>
                            <th className="py-4 px-4 text-center">Unit</th>
                            <th className="py-4 px-4 text-right">{t.price}</th>
                            <th className="py-4 px-6 text-right">{t.total}</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                         {po.items.map((item, idx) => (
                           <tr key={idx}>
                              <td className="py-4 px-6 font-bold text-slate-800">{item.description}</td>
                              <td className="py-4 px-4 text-center font-medium">{item.quantity}</td>
                              <td className="py-4 px-4 text-center text-slate-500">{item.unit}</td>
                              <td className="py-4 px-4 text-right text-slate-600">SAR {item.unitPrice.toLocaleString()}</td>
                              <td className="py-4 px-6 text-right font-mono font-bold text-slate-900">SAR {item.total.toLocaleString()}</td>
                           </tr>
                         ))}
                      </tbody>
                   </table>
                </div>

                {/* Bank & Financials */}
                <div className="grid grid-cols-2 gap-8 mb-12">
                   <div className="space-y-6">
                      {supplier.bankName && (
                        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                          <h3 className="text-[10px] font-black text-[#1a3683] uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Landmark size={14} /> {t.bankInfo}
                          </h3>
                          <div className="space-y-3 text-[11px]">
                            <div className="flex justify-between">
                              <span className="text-slate-500">Bank:</span>
                              <span className="font-bold text-slate-900">{supplier.bankName}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">Account #:</span>
                              <span className="font-mono font-bold text-slate-900">{supplier.accountNumber}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">IBAN:</span>
                              <span className="font-mono font-bold text-slate-900">{supplier.iban}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">SWIFT:</span>
                              <span className="font-mono font-bold text-slate-900">{supplier.swiftCode}</span>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {po.notes && (
                        <div>
                          <h3 className="text-[10px] font-black text-[#1a3683] uppercase tracking-widest mb-2">{t.notes}</h3>
                          <p className="text-xs text-slate-600 italic leading-relaxed">{po.notes}</p>
                        </div>
                      )}
                   </div>

                   <div className="space-y-3">
                      <div className="flex justify-between text-xs text-slate-500">
                         <span>Subtotal</span>
                         <span className="font-bold">SAR {po.subtotal.toLocaleString()}</span>
                      </div>
                      {po.mobCost !== undefined && po.mobCost > 0 && (
                        <div className="flex justify-between text-xs text-slate-500">
                           <span>Mobilization Cost</span>
                           <span className="font-bold">SAR {po.mobCost.toLocaleString()}</span>
                        </div>
                      )}
                      {po.demobCost !== undefined && po.demobCost > 0 && (
                        <div className="flex justify-between text-xs text-slate-500">
                           <span>Demobilization Cost</span>
                           <span className="font-bold">SAR {po.demobCost.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-xs text-slate-500">
                         <span>VAT (15%)</span>
                         <span className="font-bold">SAR {po.tax.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-xl font-black text-[#1a3683] pt-4 border-t-2 border-[#1a3683]/10">
                         <span>{t.totalAmount}</span>
                         <span className="font-mono">SAR {po.totalAmount.toLocaleString()}</span>
                      </div>
                   </div>
                </div>

                {/* Terms and Conditions Section */}
                <div className="mb-12 pt-8 border-t border-slate-100">
                  <h3 className="text-[10px] font-black text-[#1a3683] uppercase tracking-widest mb-4">{t.terms}</h3>
                  <div className="text-[9px] text-slate-500 whitespace-pre-wrap leading-relaxed max-h-64 overflow-hidden print:max-h-none">
                    {po.termsAndConditions}
                  </div>
                </div>

                {/* Signatories Section */}
                <div className="grid grid-cols-2 gap-12 pt-16 mt-8 border-t border-slate-100">
                   <div className="space-y-12">
                      <div className="h-16 border-b border-slate-200"></div>
                      <div className="text-center">
                         <p className="text-xs font-black text-[#1a3683] uppercase tracking-widest">Authorized Signature</p>
                         <p className="font-bold text-slate-900 text-sm mt-1">{po.companySignatoryName || companyInfo.nameEn}</p>
                         <p className="text-[10px] text-slate-500 italic">{po.companySignatoryPosition || 'Authorized Personnel'}</p>
                      </div>
                   </div>
                   <div className="space-y-12">
                      <div className="h-16 border-b border-slate-200"></div>
                      <div className="text-center">
                         <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Vendor Acceptance</p>
                         <p className="font-bold text-slate-900 text-sm mt-1">{po.supplierSignatoryName || supplier.name}</p>
                         <p className="text-[10px] text-slate-500 italic">{po.supplierSignatoryPosition || 'Representative'}</p>
                      </div>
                   </div>
                </div>
             </div>

             {/* Print Footer - Barcode & Page Number */}
             <div className="print-footer hidden print:flex">
                <div className="flex items-center gap-4">
                   <img 
                     src={`https://bwipjs-api.metafloor.com/?bcid=code128&text=${po.poNumber}&scale=1&rotate=N&includetext=false`} 
                     alt="Barcode" 
                     className="h-8"
                   />
                   <span className="font-mono font-bold text-[10px]">{po.poNumber}</span>
                </div>
                <div className="text-right">
                   <p className="font-bold uppercase tracking-tighter mb-0.5">{companyInfo.nameEn}</p>
                   <span className="page-number"></span>
                </div>
             </div>
          </div>
        </div>

        {/* Sidebar Controls - Hidden when printing */}
        <div className="lg:col-span-4 space-y-6 no-print">
           {/* Current Status Badge */}
           <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-white/5 p-6 shadow-xl">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Current Status</h3>
              <div className="flex items-center gap-3">
                 <div className={`p-2 rounded-lg ${
                    po.status === POStatus.APPROVED ? 'bg-emerald-50 text-emerald-600' : 
                    po.status === POStatus.REJECTED ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
                 }`}>
                    {po.status === POStatus.APPROVED ? <CheckCircle2 size={24} /> : 
                     po.status === POStatus.REJECTED ? <XCircle size={24} /> : <Clock size={24} />}
                 </div>
                 <div>
                    <p className="font-bold text-slate-900 dark:text-white uppercase text-sm tracking-wide">{po.status}</p>
                    <p className="text-xs text-slate-500">Updated on {new Date(po.date).toLocaleDateString()}</p>
                 </div>
              </div>
           </div>

           {/* Approval Action Panel */}
           {canReview && (
             <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-white/5 p-6 shadow-xl space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-[#1a3683] dark:text-indigo-400 flex items-center gap-2">
                  <ShieldCheck size={16} /> Workflow Approval
                </h3>
                <textarea 
                  placeholder="Review comments (optional)..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#1a3683]"
                  rows={3}
                />
                <div className="flex gap-2">
                   <button 
                     onClick={() => onApproveAction(po.id, POStatus.REJECTED, comment)}
                     className="flex-1 bg-rose-50 text-rose-600 border border-rose-100 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-rose-100 transition-colors"
                   >
                     Reject
                   </button>
                   <button 
                     onClick={() => onApproveAction(po.id, POStatus.APPROVED, comment)} 
                     className="flex-1 bg-[#1a3683] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors shadow-lg shadow-indigo-100"
                   >
                     Approve
                   </button>
                </div>
             </div>
           )}

           {/* Audit Trail */}
           <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-white/5 p-6 shadow-xl">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                <History size={16} /> Approval History
              </h3>
              <div className="space-y-6 relative before:absolute before:inset-0 before:left-3 before:border-l-2 before:border-slate-100 dark:before:border-white/5">
                 {po.approvalHistory.map((entry, idx) => (
                   <div key={idx} className="relative pl-8">
                      <div className={`absolute left-1.5 top-0 w-3 h-3 rounded-full border-2 border-white dark:border-slate-800 ${
                         entry.status === POStatus.APPROVED ? 'bg-emerald-500' : 
                         entry.status === POStatus.REJECTED ? 'bg-rose-500' : 'bg-amber-500'
                      }`}></div>
                      <div className="text-xs">
                         <p className="font-bold text-slate-900 dark:text-white uppercase tracking-wider">{entry.status}</p>
                         <p className="text-slate-500 mt-1">by <span className="font-medium">{entry.userName}</span></p>
                         <p className="text-slate-400 mt-0.5">{new Date(entry.date).toLocaleString()}</p>
                         {entry.comment && <p className="mt-2 p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg text-slate-600 dark:text-slate-400 italic">"{entry.comment}"</p>}
                      </div>
                   </div>
                 ))}
              </div>
           </div>
         </div>
       </div>
     </div>
   );
 };

export default POView;
