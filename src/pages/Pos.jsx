import { useState, useRef, useEffect } from 'react';
import { Search, ShoppingCart, Plus, Minus, Trash2, Receipt, MonitorCheck, Image as ImageIcon, ScanLine, User, Phone, Calendar } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function Pos() {
  const { products, addTransaction } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('Tunai');
  const [priceType, setPriceType] = useState('Normal'); // Normal, Grosir, Partai
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastTransaction, setLastTransaction] = useState(null);
  const searchInputRef = useRef(null);

  // Debt Form State
  const [debtData, setDebtData] = useState({ customerName: '', customerPhone: '', dueDate: '', note: '' });

  // Barcode scanner usually triggers "Enter"
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchTerm) return;
    
    // Check if it matches a barcode exactly
    const matchedProduct = products.find(p => p.barcode === searchTerm);
    if (matchedProduct && matchedProduct.stock > 0) {
      addToCart(matchedProduct);
      setSearchTerm(''); // clear after scan
    } else if (matchedProduct && matchedProduct.stock <= 0) {
      alert('Stok produk habis!');
    }
  };

  const availableProducts = products.filter(p => 
    p.stock > 0 && (
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (p.barcode && p.barcode.includes(searchTerm))
    )
  );

  const formatRupiah = (number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);

  const getActivePrice = (product) => {
    if (priceType === 'Grosir' && product.priceGrosir) return product.priceGrosir;
    if (priceType === 'Partai' && product.pricePartai) return product.pricePartai;
    return product.price; // fallback to normal
  };

  const addToCart = (product) => {
    if (priceType === 'Grosir' && !product.priceGrosir) {
      alert(`Peringatan: Harga Grosir untuk ${product.name} tidak diatur. Menggunakan Harga Normal.`);
    } else if (priceType === 'Partai' && !product.pricePartai) {
      alert(`Peringatan: Harga Partai untuk ${product.name} tidak diatur. Menggunakan Harga Normal.`);
    }

    const activePrice = getActivePrice(product);

    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      if (existing.qty < product.stock) {
        setCart(cart.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
      }
    } else {
      setCart([...cart, { 
        id: product.id,
        name: product.name,
        price: activePrice,
        priceBeli: product.priceBeli || 0,
        qty: 1 
      }]);
    }
  };

  const updateQty = (id, delta) => {
    const item = cart.find(i => i.id === id);
    const product = products.find(p => p.id === id);
    if (!item || !product) return;

    let newQty = item.qty + delta;
    if (newQty > product.stock) newQty = product.stock;
    
    if (newQty <= 0) {
      setCart(cart.filter(i => i.id !== id));
    } else {
      setCart(cart.map(i => i.id === id ? { ...i, qty: newQty } : i));
    }
  };

  // Re-calculate prices in cart if priceType changes
  useEffect(() => {
    setCart(prevCart => prevCart.map(item => {
      const product = products.find(p => p.id === item.id);
      if (!product) return item;
      return { ...item, price: getActivePrice(product) };
    }));
  }, [priceType]);

  const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    if (paymentMethod === 'Hutang' && (!debtData.customerName || !debtData.dueDate)) {
      alert('Nama Pelanggan dan Tanggal Jatuh Tempo wajib diisi untuk transaksi hutang!');
      return;
    }

    const trxData = {
      items: [...cart],
      total,
      paymentMethod,
      priceType,
      debtData: paymentMethod === 'Hutang' ? { ...debtData } : null
    };

    const savedTrx = addTransaction(trxData);
    setLastTransaction(savedTrx);
    setShowReceipt(true);
    setCart([]); // reset cart
    setDebtData({ customerName: '', customerPhone: '', dueDate: '', note: '' }); // reset debt form
  };

  if (showReceipt && lastTransaction) {
    return (
       <div className="bg-white max-w-md mx-auto p-8 rounded-2xl shadow-lg border border-slate-100 text-center animate-slide-in my-8">
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
                    <p className="text-slate-500">{item.qty} x {formatRupiah(item.price)}</p>
                  </div>
                  <p className="font-semibold text-slate-800">{formatRupiah(item.qty * item.price)}</p>
                </div>
             ))}
             <div className="border-t border-dashed border-slate-300 pt-3 flex justify-between font-bold text-lg">
                <span>TOTAL</span>
                <span>{formatRupiah(lastTransaction.total)}</span>
             </div>
             <div className="flex justify-between text-slate-500 text-xs mt-2">
                <span>Metode: {lastTransaction.paymentMethod}</span>
                <span>Kasir: {lastTransaction.cashier}</span>
             </div>
             <div className="flex justify-between text-slate-500 text-xs mt-1">
                <span>Jenis Harga: {lastTransaction.priceType}</span>
             </div>
             {lastTransaction.paymentMethod === 'Hutang' && lastTransaction.debtData && (
                <div className="mt-4 p-3 bg-rose-50 rounded-lg text-rose-700 text-xs border border-rose-100">
                  <p className="font-bold mb-1">DETAIL HUTANG:</p>
                  <p>Pelanggan: {lastTransaction.debtData.customerName}</p>
                  <p>Jatuh Tempo: {lastTransaction.debtData.dueDate}</p>
                </div>
             )}
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
           <form onSubmit={handleSearchSubmit} className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
             <input 
               ref={searchInputRef}
               type="text" 
               placeholder="Cari nama produk atau scan barcode... (Tekan Enter)" 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 transition"
             />
             <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-600 p-1 hover:bg-indigo-50 rounded-lg">
                <ScanLine size={18} />
             </button>
           </form>
           
           <div className="mt-4 flex items-center justify-between">
              <label className="text-sm font-bold text-slate-600">Pilih Jenis Harga:</label>
              <div className="flex space-x-2 bg-slate-100 p-1 rounded-xl">
                 {['Normal', 'Grosir', 'Partai'].map(pt => (
                   <button 
                     key={pt}
                     onClick={() => setPriceType(pt)}
                     className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition ${priceType === pt ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                   >
                     {pt}
                   </button>
                 ))}
              </div>
           </div>
        </div>
        
        <div className="flex-1 p-4 overflow-y-auto bg-slate-50/50">
           <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
              {availableProducts.map(p => {
                 const activePrice = getActivePrice(p);
                 return (
                   <button 
                    key={p.id} 
                    onClick={() => addToCart(p)}
                    className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 text-left hover:border-indigo-300 hover:shadow-md transition-all active:scale-[0.98] group flex flex-col h-full"
                   >
                     <div className="w-full aspect-square bg-slate-50 rounded-lg mb-3 flex items-center justify-center overflow-hidden border border-slate-100">
                        {p.image ? (
                          <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon size={32} className="text-slate-300" />
                        )}
                     </div>
                     <h3 className="font-bold text-slate-800 leading-tight mb-1 text-sm">{p.name}</h3>
                     {p.barcode && <p className="text-[10px] text-slate-400 font-mono mb-2">{p.barcode}</p>}
                     <div className="mt-auto pt-2 border-t border-slate-50 flex items-end justify-between">
                       <div>
                         <p className="text-indigo-600 font-bold text-sm">{formatRupiah(activePrice)}</p>
                         <p className="text-[10px] text-slate-400 mt-0.5">Stok: {p.stock}</p>
                       </div>
                       <div className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                         <Plus size={14} />
                       </div>
                     </div>
                   </button>
                 );
              })}
              {availableProducts.length === 0 && (
                <div className="col-span-full py-12 text-center text-slate-500">Produk tidak ditemukan</div>
              )}
           </div>
        </div>
      </div>

      {/* Cart Widget */}
      <div className="w-full lg:w-[400px] flex flex-col bg-white rounded-2xl shadow-sm border border-slate-100 lg:h-[calc(100vh-6rem)]">
         <div className="p-4 bg-indigo-900 text-white rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ShoppingCart size={20} />
              <h2 className="font-bold text-lg">Keranjang</h2>
            </div>
            <span className="bg-indigo-800 px-3 py-1 rounded-full text-xs font-bold">{cart.length} Item</span>
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
                    <div className="flex-1 pr-2">
                      <p className="font-semibold text-slate-800 text-sm leading-tight mb-1">{item.name}</p>
                      <p className="text-indigo-600 font-bold text-xs">{formatRupiah(item.price)}</p>
                    </div>
                    <div className="flex items-center space-x-3 bg-slate-50 rounded-lg p-1 border border-slate-200 shrink-0">
                      <button onClick={() => updateQty(item.id, -1)} className="p-1 hover:bg-white rounded text-slate-500 shadow-sm border border-transparent hover:border-slate-200 transition">
                        {item.qty === 1 ? <Trash2 size={14} className="text-red-500" /> : <Minus size={14} />}
                      </button>
                      <span className="font-semibold text-sm w-5 text-center text-slate-800">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)} className="p-1 hover:bg-white rounded text-slate-500 shadow-sm border border-transparent hover:border-slate-200 transition">
                        <Plus size={14} />
                      </button>
                    </div>
                 </div>
               ))
            )}
         </div>

         <div className="p-4 bg-slate-50 rounded-b-2xl border-t border-slate-200 overflow-y-auto max-h-[50vh]">
            <div className="mb-4">
              <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">Metode Pembayaran</label>
              <div className="grid grid-cols-2 gap-2">
                 {['Tunai', 'QRIS', 'E-Wallet', 'Hutang'].map(m => (
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

            {/* Form Hutang */}
            {paymentMethod === 'Hutang' && (
              <div className="mb-4 p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-3 animate-slide-in">
                <h4 className="text-sm font-bold text-rose-800 flex items-center"><User size={16} className="mr-2"/> Data Pelanggan Hutang</h4>
                <div>
                   <input required type="text" placeholder="Nama Pelanggan" value={debtData.customerName} onChange={e => setDebtData({...debtData, customerName: e.target.value})} className="w-full px-3 py-2 text-sm bg-white border border-rose-200 rounded-lg focus:ring-1 focus:ring-rose-500" />
                </div>
                <div>
                   <input type="tel" placeholder="Nomor HP (Opsional)" value={debtData.customerPhone} onChange={e => setDebtData({...debtData, customerPhone: e.target.value})} className="w-full px-3 py-2 text-sm bg-white border border-rose-200 rounded-lg focus:ring-1 focus:ring-rose-500" />
                </div>
                <div>
                   <label className="block text-xs font-medium text-rose-700 mb-1">Tanggal Jatuh Tempo</label>
                   <input required type="date" value={debtData.dueDate} onChange={e => setDebtData({...debtData, dueDate: e.target.value})} className="w-full px-3 py-2 text-sm bg-white border border-rose-200 rounded-lg focus:ring-1 focus:ring-rose-500" />
                </div>
                <div>
                   <input type="text" placeholder="Catatan (Opsional)" value={debtData.note} onChange={e => setDebtData({...debtData, note: e.target.value})} className="w-full px-3 py-2 text-sm bg-white border border-rose-200 rounded-lg focus:ring-1 focus:ring-rose-500" />
                </div>
              </div>
            )}

            <div className="flex justify-between items-end mb-4 pt-2 border-t border-slate-200">
               <span className="text-slate-500 font-medium">Total Tagihan</span>
               <span className="text-3xl font-bold text-indigo-700 tracking-tight">{formatRupiah(total)}</span>
            </div>
            
            <button 
              disabled={cart.length === 0}
              onClick={handleCheckout}
              className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all active:scale-[0.98] flex items-center justify-center space-x-2 text-lg disabled:bg-slate-300 disabled:cursor-not-allowed ${paymentMethod === 'Hutang' ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/30' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/30'}`}
            >
              <span>{paymentMethod === 'Hutang' ? 'Simpan Hutang' : 'Bayar Transaksi'}</span>
            </button>
         </div>
      </div>
    </div>
  );
}
