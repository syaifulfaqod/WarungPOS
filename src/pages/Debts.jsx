import { useState } from 'react';
import { BookOpen, Search, CheckCircle2, Circle, AlertCircle, ChevronRight, FileText, Banknote } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function Debts() {
  const { debts, addDebtPayment, currentUser } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDebt, setSelectedDebt] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const formatRupiah = (number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);

  const filteredDebts = debts.filter(d => 
    d.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePay = (e) => {
    e.preventDefault();
    if (!paymentAmount || isNaN(paymentAmount) || Number(paymentAmount) <= 0) {
      alert('Masukkan jumlah pembayaran yang valid');
      return;
    }
    
    let amount = Number(paymentAmount);
    if (amount > selectedDebt.remainingDebt) {
      amount = selectedDebt.remainingDebt; // clamp to remaining
    }

    addDebtPayment(selectedDebt.id, amount);
    setShowPaymentModal(false);
    setSelectedDebt(null);
    setPaymentAmount('');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Lunas':
        return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold border border-green-200">Lunas</span>;
      case 'Sebagian':
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold border border-yellow-200">Sebagian</span>;
      default:
        return <span className="px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-xs font-bold border border-rose-200">Belum Lunas</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
             <BookOpen size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Buku Hutang</h2>
            <p className="text-slate-500 text-sm">Kelola piutang pelanggan</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Debt List */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-[calc(100vh-14rem)]">
          <div className="p-4 border-b border-slate-100">
             <div className="relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
               <input 
                 type="text" 
                 placeholder="Cari nama pelanggan atau ID Transaksi..." 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 transition"
               />
             </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredDebts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8">
                <FileText size={48} className="mb-4 opacity-50" />
                <p>Belum ada data hutang</p>
              </div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {filteredDebts.map(debt => (
                  <li 
                    key={debt.id} 
                    onClick={() => setSelectedDebt(debt)}
                    className={`p-4 cursor-pointer transition-colors hover:bg-indigo-50/50 flex items-center justify-between ${selectedDebt?.id === debt.id ? 'bg-indigo-50 border-l-4 border-indigo-600' : 'border-l-4 border-transparent'}`}
                  >
                    <div>
                      <p className="font-bold text-slate-800">{debt.customerName}</p>
                      <div className="flex items-center space-x-2 text-xs text-slate-500 mt-1">
                        <span className="font-mono">{debt.transactionId}</span>
                        <span>•</span>
                        <span>{new Date(debt.transactionDate).toLocaleDateString('id-ID')}</span>
                      </div>
                    </div>
                    <div className="text-right flex items-center space-x-4">
                      <div>
                        <p className="font-bold text-indigo-700">{formatRupiah(debt.remainingDebt)}</p>
                        <div className="mt-1">{getStatusBadge(debt.status)}</div>
                      </div>
                      <ChevronRight size={20} className="text-slate-300" />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Debt Detail Panel */}
        {selectedDebt ? (
          <div className="w-full lg:w-[450px] bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-[calc(100vh-14rem)] animate-slide-in">
            <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-800">Detail Piutang</h3>
              {getStatusBadge(selectedDebt.status)}
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div>
                <p className="text-sm text-slate-500 mb-1">Pelanggan</p>
                <p className="font-bold text-lg text-slate-800">{selectedDebt.customerName}</p>
                {selectedDebt.customerPhone && <p className="text-slate-600 text-sm mt-0.5">{selectedDebt.customerPhone}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-xs text-slate-500 mb-1">Total Hutang Awal</p>
                  <p className="font-bold text-slate-800">{formatRupiah(selectedDebt.totalDebt)}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-xs text-slate-500 mb-1">Sisa Pembayaran</p>
                  <p className="font-bold text-rose-600">{formatRupiah(selectedDebt.remainingDebt)}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm py-2 border-b border-slate-100">
                  <span className="text-slate-500">Jatuh Tempo</span>
                  <span className="font-semibold text-slate-800">{new Date(selectedDebt.dueDate).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div className="flex justify-between text-sm py-2 border-b border-slate-100">
                  <span className="text-slate-500">Sudah Dibayar</span>
                  <span className="font-semibold text-emerald-600">{formatRupiah(selectedDebt.paidAmount)}</span>
                </div>
                {selectedDebt.note && (
                  <div className="py-2 text-sm">
                    <span className="text-slate-500 block mb-1">Catatan:</span>
                    <span className="text-slate-800 italic bg-amber-50 p-3 rounded-lg block border border-amber-100">{selectedDebt.note}</span>
                  </div>
                )}
              </div>

              {/* Payment History */}
              {selectedDebt.history && selectedDebt.history.length > 0 && (
                <div>
                  <h4 className="font-bold text-slate-800 mb-3 text-sm">Riwayat Pembayaran</h4>
                  <div className="space-y-3">
                    {selectedDebt.history.map((h, i) => (
                      <div key={i} className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg border border-emerald-100 text-sm">
                        <span className="text-emerald-800">{new Date(h.date).toLocaleDateString('id-ID')}</span>
                        <span className="font-bold text-emerald-700">+{formatRupiah(h.amount)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            {selectedDebt.status !== 'Lunas' && (
              <div className="p-6 border-t border-slate-100 bg-white space-y-3">
                <button 
                  onClick={() => setShowPaymentModal(true)}
                  className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold flex justify-center items-center hover:bg-indigo-700 transition"
                >
                  <Banknote size={18} className="mr-2" /> Bayar Sebagian / Lunas
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="hidden lg:flex w-[450px] bg-slate-50 rounded-2xl border border-slate-100 border-dashed items-center justify-center text-slate-400">
            <p>Pilih data hutang untuk melihat detail</p>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedDebt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowPaymentModal(false)}></div>
          <div className="bg-white rounded-2xl w-full max-w-sm z-10 shadow-xl overflow-hidden animate-slide-in">
             <div className="p-6 border-b border-slate-100 bg-slate-50">
               <h3 className="text-lg font-bold text-slate-800">Bayar Hutang</h3>
               <p className="text-sm text-slate-500">{selectedDebt.customerName}</p>
             </div>
             
             <form onSubmit={handlePay} className="p-6 space-y-4">
                <div className="p-4 bg-rose-50 rounded-xl border border-rose-100 mb-6 text-center">
                  <p className="text-xs font-bold text-rose-700 mb-1">Sisa Hutang</p>
                  <p className="text-2xl font-bold text-rose-800">{formatRupiah(selectedDebt.remainingDebt)}</p>
                </div>

                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1.5">Jumlah Bayar (Rp)</label>
                   <input required type="number" min="1" max={selectedDebt.remainingDebt} value={paymentAmount} onChange={e => setPaymentAmount(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 text-lg font-bold text-indigo-700" placeholder="0" />
                </div>
                
                <div className="flex space-x-2">
                  <button type="button" onClick={() => setPaymentAmount(selectedDebt.remainingDebt)} className="flex-1 py-2 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-200 hover:bg-emerald-200">Lunasi Semua</button>
                  <button type="button" onClick={() => setPaymentAmount(Math.round(selectedDebt.remainingDebt / 2))} className="flex-1 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg border border-slate-200 hover:bg-slate-200">Bayar Setengah</button>
                </div>

                <div className="pt-4 flex space-x-3 mt-4">
                   <button type="button" onClick={() => setShowPaymentModal(false)} className="flex-1 py-3 border border-slate-200 text-slate-600 font-medium rounded-xl hover:bg-slate-50">Batal</button>
                   <button type="submit" className="flex-1 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 flex justify-center items-center">
                     Simpan
                   </button>
                </div>
             </form>
          </div>
        </div>
      )}

    </div>
  );
}
