import { useState } from 'react';
import { Package, Plus, Edit2, Trash2, X, Save } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function Products() {
  const { products, setProducts, currentUser } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    category: 'Sembako',
    price: '',
    stock: ''
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
        price: product.price.toString(),
        stock: product.stock.toString()
      });
      setEditingId(product.id);
    } else {
      setFormData({ name: '', category: 'Sembako', price: '', stock: '' });
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm('Yakin ingin menghapus produk ini?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newProduct = {
      id: editingId || 'P' + Date.now().toString().slice(-4),
      name: formData.name,
      category: formData.category,
      price: parseInt(formData.price),
      stock: parseInt(formData.stock)
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
            <p className="text-slate-500 text-sm">Kelola daftar barang, harga, dan stok</p>
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
                <th className="py-4 px-6 md:w-20">ID</th>
                <th className="py-4 px-6">Nama Produk</th>
                <th className="py-4 px-6">Kategori</th>
                <th className="py-4 px-6 text-right">Harga</th>
                <th className="py-4 px-6 text-center">Stok</th>
                <th className="py-4 px-6 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {products.map(product => (
                <tr key={product.id} className="hover:bg-slate-50/50 transition">
                  <td className="py-4 px-6 font-mono text-xs font-semibold text-slate-500">{product.id}</td>
                  <td className="py-4 px-6 font-semibold text-slate-800">{product.name}</td>
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
          <div className="bg-white rounded-2xl w-full max-w-md z-10 shadow-xl overflow-hidden animate-slide-in">
             <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50">
               <h3 className="text-lg font-bold text-slate-800">{editingId ? 'Edit Produk' : 'Tambah Produk Baru'}</h3>
               <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                 <X size={20} />
               </button>
             </div>
             
             <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1.5">Nama Produk</label>
                   <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600" />
                </div>
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
                <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="block text-sm font-medium text-slate-700 mb-1.5">Harga Dasar (Rp)</label>
                     <input required type="number" min="0" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600" />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-slate-700 mb-1.5">Stok Awal</label>
                     <input required type="number" min="0" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600" />
                   </div>
                </div>

                <div className="pt-4 flex space-x-3">
                   <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 border border-slate-200 text-slate-600 font-medium rounded-xl hover:bg-slate-50">Batal</button>
                   <button type="submit" className="flex-1 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 flex justify-center items-center">
                     <Save size={18} className="mr-2" /> Simpan
                   </button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
}
