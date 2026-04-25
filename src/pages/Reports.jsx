import { useMemo } from 'react';
import { BarChart3, TrendingUp, Trophy } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function Reports() {
  const { transactions, currentUser } = useAppContext();

  if (currentUser?.role !== 'Owner') {
    return <div className="p-8 text-center text-red-500 font-bold">Akses Ditolak</div>;
  }

  const formatRupiah = (number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);

  const { totalRevenue, totalTx, bestSellers } = useMemo(() => {
    let rev = 0;
    let itemsMap = {};

    transactions.forEach(t => {
      rev += t.total;
      t.items.forEach(item => {
        if (!itemsMap[item.id]) {
          itemsMap[item.id] = { name: item.name, qty: 0, revenue: 0 };
        }
        itemsMap[item.id].qty += item.qty;
        itemsMap[item.id].revenue += (item.qty * item.price);
      });
    });

    const best = Object.values(itemsMap).sort((a, b) => b.qty - a.qty).slice(0, 10);

    return { totalRevenue: rev, totalTx: transactions.length, bestSellers: best };
  }, [transactions]);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
        <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
           <BarChart3 size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Laporan Penjualan</h2>
          <p className="text-slate-500 text-sm">Analisis performa toko Anda (Sepanjang Waktu)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-2xl p-6 text-white shadow-lg shadow-indigo-200">
           <div className="flex justify-between items-start">
             <div>
               <p className="text-indigo-100 font-medium mb-1">Total Pendapatan</p>
               <h3 className="text-4xl font-bold tracking-tight">{formatRupiah(totalRevenue)}</h3>
             </div>
             <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <TrendingUp size={24} className="text-white" />
             </div>
           </div>
           <div className="mt-8 pt-4 border-t border-indigo-400/50 flex justify-between text-sm text-indigo-100">
              <span className="font-medium">{totalTx} Transaksi Sukses</span>
           </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
           <div className="flex items-center space-x-2 text-amber-500 mb-6 font-bold text-lg">
             <Trophy size={20} />
             <h3>Produk Terlaris</h3>
           </div>
           
           <div className="space-y-4">
              {bestSellers.map((item, index) => (
                 <div key={index} className="flex justify-between items-center group">
                    <div className="flex items-center space-x-3 w-1/2">
                       <div className="w-6 h-6 rounded bg-slate-100 text-slate-500 text-xs font-bold flex justify-center items-center group-hover:bg-indigo-100 group-hover:text-indigo-600 transition">
                         {index + 1}
                       </div>
                       <p className="font-semibold text-slate-700 truncate text-sm">{item.name}</p>
                    </div>
                    <div className="text-right">
                       <p className="font-bold text-slate-800">{item.qty} <span className="text-xs text-slate-400 font-medium ml-1">terjual</span></p>
                       <p className="text-xs text-indigo-600 font-semibold">{formatRupiah(item.revenue)}</p>
                    </div>
                 </div>
              ))}
              {bestSellers.length === 0 && <p className="text-sm text-slate-500 text-center">Belum ada data penjualan.</p>}
           </div>
        </div>
      </div>
    </div>
  );
}
