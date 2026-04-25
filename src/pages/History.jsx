import { useState } from 'react';
import { History as HistoryIcon, Search, Calendar } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function History() {
  const { transactions } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  
  const formatRupiah = (number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);

  const filteredTransactions = transactions.filter(t => 
    t.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.cashier.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 flex flex-col h-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 shrink-0">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
             <HistoryIcon size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Riwayat Transaksi</h2>
            <p className="text-slate-500 text-sm">Lihat semua catatan penjualan</p>
          </div>
        </div>
        
        <div className="relative w-full md:w-64">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
           <input 
             type="text" 
             placeholder="Cari ID / Kasir..." 
             value={searchTerm}
             onChange={e => setSearchTerm(e.target.value)}
             className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 text-sm"
           />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex-1 overflow-hidden flex flex-col">
        <div className="overflow-auto flex-1 p-0">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold sticky top-0 z-10">
              <tr>
                <th className="py-4 px-6 md:w-48">Tanggal & Jam</th>
                <th className="py-4 px-6">ID Transaksi</th>
                <th className="py-4 px-6">Kasir</th>
                <th className="py-4 px-6">Metode</th>
                <th className="py-4 px-6">Item (Qty)</th>
                <th className="py-4 px-6 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredTransactions.map(t => (
                <tr key={t.id} className="hover:bg-slate-50/50 transition">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2 text-slate-500">
                      <Calendar size={14} />
                      <span>{new Date(t.date).toLocaleString('id-ID')}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-mono text-xs font-bold text-indigo-600">{t.id}</td>
                  <td className="py-4 px-6 font-medium">{t.cashier}</td>
                  <td className="py-4 px-6">
                     <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          t.paymentMethod === 'Tunai' ? 'bg-green-100 text-green-700' :
                          t.paymentMethod === 'QRIS' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                        }`}>
                      {t.paymentMethod}
                     </span>
                  </td>
                  <td className="py-4 px-6">
                     <div className="text-xs space-y-1">
                        {t.items.slice(0, 2).map((item, i) => (
                           <div key={i} className="text-slate-500 truncate max-w-[200px]">{item.name} <span className="font-bold text-slate-700">x{item.qty}</span></div>
                        ))}
                        {t.items.length > 2 && <div className="text-indigo-400 font-medium">+{t.items.length - 2} item lainnya</div>}
                     </div>
                  </td>
                  <td className="py-4 px-6 text-right font-bold text-slate-800">{formatRupiah(t.total)}</td>
                </tr>
              ))}
              {filteredTransactions.length === 0 && (
                <tr>
                   <td colSpan="6" className="py-12 text-center text-slate-500">Tidak ada data transaksi yang sesuai</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
