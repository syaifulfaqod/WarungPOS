import { useState } from 'react';
import { Users as UsersIcon, Plus, UserPlus, KeyRound, Shield, Trash2, X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function Users() {
  const { users, setUsers, currentUser } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', username: '', password: '', role: 'Kasir' });

  if (currentUser?.role !== 'Owner') {
    return <div className="p-8 text-center text-red-500 font-bold">Akses Ditolak</div>;
  }

  const handleDelete = (id) => {
    if (confirm('Yakin ingin menghapus user ini?')) {
      if (currentUser.id === id) {
         alert('Gagal: Anda tidak dapat menghapus akun Anda sendiri.');
         return;
      }
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if(users.some(u => u.username === formData.username)) {
      alert('Gagal: Username sudah digunakan.');
      return;
    }
    const newUser = {
      id: Date.now(),
      ...formData
    };
    setUsers([...users, newUser]);
    setIsModalOpen(false);
    setFormData({ name: '', username: '', password: '', role: 'Kasir' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
             <UsersIcon size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Manajemen Pengguna</h2>
            <p className="text-slate-500 text-sm">Kelola akses Owner dan Kasir</p>
          </div>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition flex items-center space-x-2"
        >
          <UserPlus size={18} />
          <span>Tambah User</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map(user => (
           <div key={user.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 relative group transition hover:shadow-md">
              {user.id !== currentUser.id && (
                 <button 
                   onClick={() => handleDelete(user.id)}
                   className="absolute top-4 right-4 p-2 text-rose-500 hover:bg-rose-50 rounded-lg opacity-0 group-hover:opacity-100 transition"
                   title="Hapus User"
                 >
                   <Trash2 size={16} />
                 </button>
              )}
              
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xl mb-4 border border-slate-200">
                 {user.name.charAt(0)}
              </div>
              
              <h3 className="font-bold text-lg text-slate-800">{user.name}</h3>
              <div className="flex items-center space-x-1 mt-1 mb-4 text-xs font-semibold">
                 {user.role === 'Owner' ? (
                   <span className="flex items-center text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md"><Shield size={12} className="mr-1" /> Owner</span>
                 ) : (
                   <span className="flex items-center text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">Kasir</span>
                 )}
              </div>

              <div className="space-y-2 mt-4 pt-4 border-t border-slate-100 text-sm">
                 <div className="flex items-center text-slate-500">
                   <KeyRound size={14} className="mr-2" /> 
                   <span className="font-medium">Username:</span>
                   <span className="ml-2 text-slate-800">{user.username}</span>
                 </div>
              </div>
           </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white rounded-2xl w-full max-w-md z-10 shadow-xl overflow-hidden animate-slide-in">
             <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50">
               <h3 className="text-lg font-bold text-slate-800">Tambah Pengguna Baru</h3>
               <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                 <X size={20} />
               </button>
             </div>
             
             <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1.5">Nama Lengkap</label>
                   <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600" />
                </div>
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1.5">Username</label>
                   <input required type="text" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600" />
                </div>
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                   <input required type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600" />
                </div>
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1.5">Role</label>
                   <select required value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600">
                      <option value="Kasir">Kasir</option>
                      <option value="Owner">Owner</option>
                   </select>
                </div>

                <div className="pt-4 flex space-x-3">
                   <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 border border-slate-200 text-slate-600 font-medium rounded-xl hover:bg-slate-50">Batal</button>
                   <button type="submit" className="flex-1 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 flex justify-center items-center">
                     <Plus size={18} className="mr-2" /> Tambah User
                   </button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
}
