import { useMemo } from 'react';
import { ShoppingBag, TrendingUp, Package, AlertTriangle, Banknote, LineChart, Trophy } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function Dashboard() {
  const { transactions, products, debts, currentUser } = useAppContext();

  const today = new Date().toISOString().split('T')[0];

  const todayTransactions = useMemo(() => {
    return transactions.filter(t => t.date.startsWith(today));
  }, [transactions, today]);

  const todayRevenue = todayTransactions.reduce((sum, t) => sum + t.total, 0);
  const totalItemsSoldToday = todayTransactions.reduce((sum, t) => {
    return sum + t.items.reduce((itemSum, item) => itemSum + item.qty, 0);
  }, 0);

  // Estimasi Laba Hari Ini (Revenue - Cost of Goods Sold)
  const todayProfit = todayTransactions.reduce((sum, t) => {
    const trxProfit = t.items.reduce((itemSum, item) => {
      // If priceBeli exists, profit = (selling price - priceBeli) * qty
      // If not exists, we assume 0 profit for that item or just calculate what we know
      const cost = item.priceBeli || 0;
      const profitPerItem = cost > 0 ? (item.price - cost) : 0;
      return itemSum + (profitPerItem * item.qty);
    }, 0);
    return sum + trxProfit;
  }, 0);

  // Total Hutang Belum Lunas
  const activeDebts = debts.filter(d => d.status !== 'Lunas');
  const totalUnpaidDebts = activeDebts.reduce((sum, d) => sum + d.remainingDebt, 0);

  // Produk Terlaris (All time or today? Let's do all time based on transactions)
  const topProducts = useMemo(() => {
    const productSales = {};
    transactions.forEach(t => {
      t.items.forEach(item => {
        if (!productSales[item.id]) {
          productSales[item.id] = { id: item.id, name: item.name, qty: 0 };
        }
        productSales[item.id].qty += item.qty;
      });
    });
    return Object.values(productSales)
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);
  }, [transactions]);

  const lowStockProducts = products.filter(p => p.stock <= 5);

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Dashboard</h2>
          <p className="text-slate-500">Ringkasan hari ini, {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Card 1 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-4 bg-emerald-100 text-emerald-600 rounded-xl">
            <TrendingUp size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Omzet Hari Ini</p>
            <h3 className="text-2xl font-bold text-slate-800">{formatRupiah(todayRevenue)}</h3>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-4 bg-indigo-100 text-indigo-600 rounded-xl">
            <LineChart size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Estimasi Laba</p>
            <h3 className="text-2xl font-bold text-indigo-700">{formatRupiah(todayProfit)}</h3>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-4 bg-blue-100 text-blue-600 rounded-xl">
            <ShoppingBag size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Transaksi</p>
            <h3 className="text-2xl font-bold text-slate-800">{todayTransactions.length} Trx ({totalItemsSoldToday} Item)</h3>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-4 bg-rose-100 text-rose-600 rounded-xl">
            <Banknote size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Piutang (Belum Lunas)</p>
            <h3 className="text-2xl font-bold text-slate-800">{formatRupiah(totalUnpaidDebts)}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Transaksi Terakhir Hari Ini</h3>
          {todayTransactions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="pb-3 font-medium">Jam</th>
                    <th className="pb-3 font-medium">ID Transaksi</th>
                    <th className="pb-3 font-medium">Metode</th>
                    <th className="pb-3 font-medium">Kasir</th>
                    <th className="pb-3 font-medium text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {todayTransactions.slice(0, 5).map(t => (
                    <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 text-slate-600">{new Date(t.date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</td>
                      <td className="py-3 font-medium text-slate-800">{t.id}</td>
                      <td className="py-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          t.paymentMethod === 'Tunai' ? 'bg-green-100 text-green-700' :
                          t.paymentMethod === 'Hutang' ? 'bg-rose-100 text-rose-700' :
                          t.paymentMethod === 'QRIS' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                        }`}>
                          {t.paymentMethod}
                        </span>
                      </td>
                      <td className="py-3 text-slate-600">{t.cashier}</td>
                      <td className="py-3 text-right font-bold text-slate-800">{formatRupiah(t.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
             <div className="text-center py-8 text-slate-500">Belum ada transaksi hari ini</div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center space-x-2 text-indigo-600 mb-4">
              <Trophy size={20} />
              <h3 className="text-lg font-bold text-slate-800">Produk Terlaris</h3>
            </div>
            
            {topProducts.length > 0 ? (
              <ul className="space-y-4">
                 {topProducts.map((p, index) => (
                   <li key={p.id} className="flex items-center justify-between pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                      <div className="flex items-center space-x-3">
                        <span className="font-bold text-slate-400 w-4">{index + 1}</span>
                        <p className="font-semibold text-slate-800 text-sm truncate max-w-[150px]">{p.name}</p>
                      </div>
                      <p className="text-sm font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">{p.qty}x</p>
                   </li>
                 ))}
              </ul>
            ) : (
              <div className="text-sm text-slate-500 text-center py-8">Belum ada data penjualan</div>
            )}
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center space-x-2 text-rose-600 mb-4">
              <AlertTriangle size={20} />
              <h3 className="text-lg font-bold">Stok Menipis</h3>
            </div>
            
            {lowStockProducts.length > 0 ? (
              <ul className="space-y-4">
                 {lowStockProducts.map(p => (
                   <li key={p.id} className="flex items-center justify-between pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">{p.name}</p>
                        <p className="text-xs text-slate-500">Sisa: <strong className="text-rose-600">{p.stock}</strong></p>
                      </div>
                   </li>
                 ))}
              </ul>
            ) : (
              <div className="text-sm text-slate-500 text-center py-8">Stok produk aman</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
