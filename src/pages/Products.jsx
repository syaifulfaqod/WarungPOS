import { useState, useRef } from 'react';
import { Package, Plus, Edit2, Trash2, X, Save, Image as ImageIcon } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function Products() {
  const { products, setProducts, currentUser } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name: '',
    category: 'Sembako',
    price: '',
    priceGrosir: '',
    pricePartai: '',
    priceBeli: '',
    stock: '',
    barcode: '',
    image: null
  });

  if (currentUser?.role !== 'Owner') {
    return <div className="p-8 text-center text-red-500 font-bold">Akses Ditolak</div>;
  }

  const formatRupiah = (number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);

  const handleOpenModal = (product = null) => {
    if (product) {
      setFormData({
        name: product.name,
        category: product.category,
        price: product.price?.toString() || '',
        priceGrosir: product.priceGrosir?.toString() || '',
        pricePartai: product.pricePartai?.toString() || '',
        priceBeli: product.priceBeli?.toString() || '',
        stock: product.stock?.toString() || '0',
        barcode: product.barcode || '',
        image: product.image || null
      });
      setEditingId(product.id);
    } else {
      setFormData({ 
        name: '', category: 'Sembako', price: '', priceGrosir: '', 
        pricePartai: '', priceBeli: '', stock: '', barcode: '', image: null 
      });
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm('Yakin ingin menghapus produk ini?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newProduct = {
      id: editingId || 'P' + Date.now().toString().slice(-4),
      storeId: currentUser.storeId,
      name: formData.name,
      category: formData.category,
      price: parseInt(formData.price) || 0,
      priceGrosir: formData.priceGrosir ? parseInt(formData.priceGrosir) : null,
      pricePartai: formData.pricePartai ? parseInt(formData.pricePartai) : null,
      priceBeli: formData.priceBeli ? parseInt(formData.priceBeli) : null,
      stock: parseInt(formData.stock) || 0,
      barcode: formData.barcode,
      image: formData.image
    };

    if (editingId) {
      setProducts(products.map(p => p.id === editingId ? newProduct : p));
    } else {
      setProducts([...products, newProduct]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
             <Package size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Manajemen Produk</h2>
            <p className="text-slate-500 text-sm">Kelola daftar barang, harga (Normal/Grosir/Partai), dan stok</p>
          </div>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition flex items-center space-x-2"
        >
          <Plus size={18} />
          <span>Tambah Produk</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
              <tr>
                <th className="py-4 px-6 md:w-20">Foto</th>
                <th className="py-4 px-6">Produk</th>
                <th className="py-4 px-6">Kategori</th>
                <th className="py-4 px-6 text-right">Harga Normal</th>
                <th className="py-4 px-6 text-center">Stok</th>
                <th className="py-4 px-6 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {products.map(product => (
                <tr key={product.id} className="hover:bg-slate-50/50 transition">
                  <td className="py-4 px-6">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded-lg border border-slate-200" />
                    ) : (
                      <div className="w-12 h-12 bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400">
                        <ImageIcon size={20} />
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-semibold text-slate-800">{product.name}</p>
                    {product.barcode && <p className="text-xs text-slate-400 font-mono mt-0.5">{product.barcode}</p>}
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-3 py-1 bg-slate-100 border border-slate-200 rounded-full text-xs font-medium text-slate-600">
                      {product.category}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right font-medium text-indigo-600">{formatRupiah(product.price)}</td>
                  <td className="py-4 px-6 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      product.stock <= 5 ? 'bg-rose-100 text-rose-700 border border-rose-200' : 
                      'bg-emerald-100 text-emerald-700 border border-emerald-200'
                    }`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex justify-center space-x-2">
                       <button onClick={() => handleOpenModal(product)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Edit">
                          <Edit2 size={16} />
                       </button>
                       <button onClick={() => handleDelete(product.id)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition" title="Hapus">
                          <Trash2 size={16} />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                   <td colSpan="6" className="py-8 text-center text-slate-500">Belum ada data produk</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white rounded-2xl w-full max-w-2xl z-10 shadow-xl overflow-hidden animate-slide-in flex flex-col max-h-[90vh]">
             <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50 shrink-0">
               <h3 className="text-lg font-bold text-slate-800">{editingId ? 'Edit Produk' : 'Tambah Produk Baru'}</h3>
               <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                 <X size={20} />
               </button>
             </div>
             
             <div className="p-6 overflow-y-auto">
               <form id="productForm" onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Photo & Basic Info */}
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-1/3 flex flex-col items-center">
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full aspect-square bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center text-slate-400 hover:bg-slate-100 hover:border-indigo-400 cursor-pointer overflow-hidden transition-colors"
                      >
                        {formData.image ? (
                          <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <>
                            <ImageIcon size={32} className="mb-2" />
                            <span className="text-xs font-medium">Upload Foto</span>
                          </>
                        )}
                      </div>
                      <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
                      {formData.image && (
                        <button type="button" onClick={() => setFormData({...formData, image: null})} className="mt-2 text-xs text-rose-500 font-medium">Hapus Foto</button>
                      )}
                    </div>
                    
                    <div className="flex-1 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Nama Produk</label>
                        <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1.5">Kategori</label>
                          <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600">
                              <option>Sembako</option>
                              <option>Makanan</option>
                              <option>Minuman</option>
                              <option>Rokok</option>
                              <option>Bumbu</option>
                              <option>Lainnya</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1.5">Barcode</label>
                          <input type="text" value={formData.barcode} onChange={e => setFormData({...formData, barcode: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 font-mono text-sm" placeholder="Opsional" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Stok Awal</label>
                        <input required type="number" min="0" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600" />
                      </div>
                    </div>
                  </div>

                  <hr className="border-slate-100" />

                  {/* Pricing Tiers */}
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 mb-4">Pengaturan Harga</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Harga Jual Normal (Wajib)</label>
                        <input required type="number" min="0" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600" placeholder="Rp" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Harga Grosir (Opsional)</label>
                        <input type="number" min="0" value={formData.priceGrosir} onChange={e => setFormData({...formData, priceGrosir: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600" placeholder="Rp" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Harga Partai (Opsional)</label>
                        <input type="number" min="0" value={formData.pricePartai} onChange={e => setFormData({...formData, pricePartai: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600" placeholder="Rp" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Harga Beli / Modal (Opsional)</label>
                        <input type="number" min="0" value={formData.priceBeli} onChange={e => setFormData({...formData, priceBeli: e.target.value})} className="w-full px-4 py-2 bg-rose-50 border border-rose-200 rounded-xl focus:ring-2 focus:ring-rose-600" placeholder="Rp (Untuk hitung laba)" />
                      </div>
                    </div>
                  </div>

               </form>
             </div>

             <div className="p-6 border-t border-slate-100 bg-slate-50 shrink-0 flex space-x-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 border border-slate-200 text-slate-600 font-medium rounded-xl hover:bg-slate-100 transition">Batal</button>
                <button type="submit" form="productForm" className="flex-1 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 flex justify-center items-center transition">
                  <Save size={18} className="mr-2" /> Simpan Produk
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
