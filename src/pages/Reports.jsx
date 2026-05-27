import { useMemo } from 'react';
import { BarChart3, TrendingUp, Trophy, Banknote, LineChart, FileText } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function Reports() {
  const { transactions, debts, currentUser } = useAppContext();

  if (currentUser?.role !== 'Owner') {
    return <div className="p-8 text-center text-red-500 font-bold">Akses Ditolak</div>;
  }

  const formatRupiah = (number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);

  const { totalRevenue, totalProfit, totalTx, bestSellers } = useMemo(() => {
    let rev = 0;
    let profit = 0;
    let itemsMap = {};

    transactions.forEach(t => {
      rev += t.total;
      t.items.forEach(item => {
        // Calculate Profit
        const cost = item.priceBeli || 0;
        const profitPerItem = cost > 0 ? (item.price - cost) : 0;
        profit += (profitPerItem * item.qty);

        // Best Sellers
        if (!itemsMap[item.id]) {
          itemsMap[item.id] = { name: item.name, qty: 0, revenue: 0 };
        }
        itemsMap[item.id].qty += item.qty;
        itemsMap[item.id].revenue += (item.qty * item.price);
      });
    });

    const best = Object.values(itemsMap).sort((a, b) => b.qty - a.qty).slice(0, 10);

    return { totalRevenue: rev, totalProfit: profit, totalTx: transactions.length, bestSellers: best };
  }, [transactions]);

  const { totalDebt, remainingDebt } = useMemo(() => {
    let tDebt = 0;
    let rDebt = 0;
    debts.forEach(d => {
      tDebt += d.totalDebt;
      rDebt += d.remainingDebt;
    });
    return { totalDebt: tDebt, remainingDebt: rDebt };
  }, [debts]);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
        <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
           <BarChart3 size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Laporan Keuangan</h2>
          <p className="text-slate-500 text-sm">Analisis performa penjualan, laba, dan hutang (Sepanjang Waktu)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
           <div className="flex items-center space-x-3 text-emerald-600 mb-2">
             <TrendingUp size={20} />
             <h3 className="font-semibold text-sm">Total Penjualan</h3>
           </div>
           <p className="text-2xl font-bold text-slate-800">{formatRupiah(totalRevenue)}</p>
           <p className="text-xs text-slate-500 mt-2">{totalTx} Transaksi Sukses</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
           <div className="flex items-center space-x-3 text-indigo-600 mb-2">
             <LineChart size={20} />
             <h3 className="font-semibold text-sm">Estimasi Laba Kotor</h3>
           </div>
           <p className="text-2xl font-bold text-slate-800">{formatRupiah(totalProfit)}</p>
           <p className="text-xs text-slate-500 mt-2">Dihitung dari modal produk</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
           <div className="flex items-center space-x-3 text-amber-500 mb-2">
             <FileText size={20} />
             <h3 className="font-semibold text-sm">Total Hutang Tercatat</h3>
           </div>
           <p className="text-2xl font-bold text-slate-800">{formatRupiah(totalDebt)}</p>
           <p className="text-xs text-slate-500 mt-2">{debts.length} Data Hutang</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
           <div className="flex items-center space-x-3 text-rose-600 mb-2">
             <Banknote size={20} />
             <h3 className="font-semibold text-sm">Sisa Piutang Aktif</h3>
           </div>
           <p className="text-2xl font-bold text-slate-800">{formatRupiah(remainingDebt)}</p>
           <p className="text-xs text-slate-500 mt-2">Belum dilunasi</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-2xl p-6 text-white shadow-lg shadow-indigo-200 flex flex-col justify-center h-full min-h-[200px]">
           <p className="text-indigo-100 font-medium mb-2 text-lg">Ringkasan Laba</p>
           <h3 className="text-5xl font-bold tracking-tight mb-4">{formatRupiah(totalProfit)}</h3>
           <p className="text-sm text-indigo-200 leading-relaxed">
             Pastikan Anda telah mengisi <strong>Harga Beli / Modal</strong> pada setiap produk untuk mendapatkan estimasi laba yang akurat.
           </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
           <div className="flex items-center space-x-2 text-amber-500 mb-6 font-bold text-lg">
             <Trophy size={20} />
             <h3>Produk Terlaris</h3>
           </div>
           
           <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
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
