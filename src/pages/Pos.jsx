import { useState } from 'react';
import { Search, ShoppingCart, Plus, Minus, Trash2, Receipt, MonitorCheck } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function Pos() {
  const { products, addTransaction } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('Tunai');
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastTransaction, setLastTransaction] = useState(null);

  const availableProducts = products.filter(p => 
    p.stock > 0 && p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatRupiah = (number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);

  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      if (existing.qty < product.stock) {
        setCart(cart.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
      }
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const updateQty = (id, delta) => {
    const item = cart.find(i => i.id === id);
    const product = products.find(p => p.id === id);
    if (!item) return;

    let newQty = item.qty + delta;
    if (newQty > product.stock) newQty = product.stock;
    
    if (newQty <= 0) {
      setCart(cart.filter(i => i.id !== id));
    } else {
      setCart(cart.map(i => i.id === id ? { ...i, qty: newQty } : i));
    }
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    const trxData = {
      items: [...cart],
      total,
      paymentMethod
    };
    const savedTrx = addTransaction(trxData);
    setLastTransaction(savedTrx);
    setShowReceipt(true);
    setCart([]); // reset cart
  };

  if (showReceipt && lastTransaction) {
    return (
       <div className="bg-white max-w-md mx-auto p-8 rounded-2xl shadow-lg border border-slate-100 text-center animate-slide-in">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <MonitorCheck size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Transaksi Berhasil</h2>
          <p className="text-slate-500 mb-6 border-b border-slate-100 pb-6">ID: {lastTransaction.id}</p>
          
          <div className="text-left space-y-3 mb-6 font-mono text-sm">
             {lastTransaction.items.map(item => (
                <div key={item.id} className="flex justify-between">
                  <div>
                    <p className="font-semibold text-slate-800">{item.name}</p>
                    <p className="text-slate-500">{item.qty} x {item.price}</p>
                  </div>
                  <p className="font-semibold text-slate-800">{formatRupiah(item.qty * item.price)}</p>
                </div>
             ))}
             <div className="border-t border-dashed border-slate-300 pt-3 flex justify-between font-bold text-lg">
                <span>TOTAL</span>
                <span>{formatRupiah(lastTransaction.total)}</span>
             </div>
             <div className="flex justify-between text-slate-500 text-xs">
                <span>Metode: {lastTransaction.paymentMethod}</span>
                <span>Kasir: {lastTransaction.cashier}</span>
             </div>
          </div>

          <div className="flex space-x-3">
             <button 
              onClick={() => window.print()}
              className="flex-1 bg-slate-800 text-white py-3 rounded-xl font-semibold flex items-center justify-center hover:bg-slate-700 transition"
             >
                <Receipt size={18} className="mr-2" /> Cetak
             </button>
             <button 
              onClick={() => setShowReceipt(false)}
              className="flex-1 bg-indigo-100 text-indigo-700 py-3 rounded-xl font-semibold hover:bg-indigo-200 transition"
             >
                Transaksi Baru
             </button>
          </div>
       </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* Product List */}
      <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100">
           <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
             <input 
               type="text" 
               placeholder="Cari produk..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-600 transition"
             />
           </div>
        </div>
        
        <div className="flex-1 p-4 overflow-y-auto bg-slate-50/50">
           <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
              {availableProducts.map(p => (
                 <button 
                  key={p.id} 
                  onClick={() => addToCart(p)}
                  className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 text-left hover:border-indigo-300 hover:shadow-md transition-all active:scale-[0.98] group relative"
                 >
                   <div className="text-sm text-indigo-600 font-semibold mb-1 opacity-0 group-hover:opacity-100 transition absolute top-2 right-3">+{p.price / 1000}k</div>
                   <h3 className="font-bold text-slate-800 leading-tight mb-2 pr-6">{p.name}</h3>
                   <div className="mt-auto">
                     <p className="text-indigo-600 font-bold">{formatRupiah(p.price)}</p>
                     <p className="text-xs text-slate-400 mt-1">Stok: {p.stock}</p>
                   </div>
                 </button>
              ))}
              {availableProducts.length === 0 && (
                <div className="col-span-full py-12 text-center text-slate-500">Produk tidak ditemukan</div>
              )}
           </div>
        </div>
      </div>

      {/* Cart Widget */}
      <div className="w-full lg:w-96 flex flex-col bg-white rounded-2xl shadow-sm border border-slate-100 lg:h-[calc(100vh-6rem)]">
         <div className="p-4 bg-indigo-900 text-white rounded-t-2xl flex items-center space-x-3">
            <ShoppingCart size={20} />
            <h2 className="font-bold text-lg">Keranjang</h2>
         </div>

         <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {cart.length === 0 ? (
               <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-3 opacity-60">
                 <ShoppingCart size={48} />
                 <p>Belum ada produk</p>
               </div>
            ) : (
               cart.map(item => (
                 <div key={item.id} className="flex justify-between items-center border-b border-slate-100 pb-4 last:border-0">
                    <div className="flex-1">
                      <p className="font-semibold text-slate-800 text-sm leading-tight mb-1">{item.name}</p>
                      <p className="text-indigo-600 font-bold text-xs">{formatRupiah(item.price)}</p>
                    </div>
                    <div className="flex items-center space-x-3 bg-slate-50 rounded-lg p-1 border border-slate-200">
                      <button onClick={() => updateQty(item.id, -1)} className="p-1 hover:bg-white rounded text-slate-500 shadow-sm border border-transparent hover:border-slate-200 transition">
                        {item.qty === 1 ? <Trash2 size={14} className="text-red-500" /> : <Minus size={14} />}
                      </button>
                      <span className="font-semibold text-sm w-4 text-center text-slate-800">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)} className="p-1 hover:bg-white rounded text-slate-500 shadow-sm border border-transparent hover:border-slate-200 transition">
                        <Plus size={14} />
                      </button>
                    </div>
                 </div>
               ))
            )}
         </div>

         <div className="p-4 bg-slate-50 rounded-b-2xl border-t border-slate-200">
            <div className="mb-4">
              <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">Metode Pembayaran</label>
              <div className="grid grid-cols-3 gap-2">
                 {['Tunai', 'QRIS', 'E-Wallet'].map(m => (
                    <button 
                      key={m}
                      onClick={() => setPaymentMethod(m)}
                      className={`py-2 text-sm font-semibold rounded-lg border transition ${paymentMethod === m ? 'bg-indigo-100 border-indigo-600 text-indigo-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                    >
                      {m}
                    </button>
                 ))}
              </div>
            </div>

            <div className="flex justify-between items-end mb-4">
               <span className="text-slate-500 font-medium">Total</span>
               <span className="text-3xl font-bold text-indigo-700 tracking-tight">{formatRupiah(total)}</span>
            </div>
            
            <button 
              disabled={cart.length === 0}
              onClick={handleCheckout}
              className="w-full py-4 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/30 transition-all active:scale-[0.98] flex items-center justify-center space-x-2 text-lg"
            >
              <span>Bayar Transaksi</span>
            </button>
         </div>
      </div>
    </div>
  );
}
