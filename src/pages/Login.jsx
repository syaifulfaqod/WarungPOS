import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Store, UserCircle, KeyRound, AlertCircle, MapPin, Phone, UserPlus, LogIn } from 'lucide-react';

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  
  // Form states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [storeName, setStoreName] = useState('');
  const [storeAddress, setStoreAddress] = useState('');
  const [storePhone, setStorePhone] = useState('');
  
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  const { login, registerOwner } = useAppContext();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (isRegister) {
      if (!username || !password || !name || !storeName || !storeAddress || !storePhone) {
        setError('Mohon isi semua field untuk registrasi toko');
        return;
      }
      const success = registerOwner({
        username, password, name, storeName, storeAddress, storePhone
      });
      if (success) {
        setSuccessMsg('Registrasi berhasil! Silakan login.');
        setIsRegister(false);
        // Reset specific register fields
        setName(''); setStoreName(''); setStoreAddress(''); setStorePhone('');
      } else {
        setError('Gagal registrasi. Silakan coba lagi.');
      }
    } else {
      if (!username || !password) {
        setError('Mohon isi username dan password');
        return;
      }
      
      const success = login(username, password);
      if (success) {
        navigate('/');
      } else {
        setError('Username atau password salah');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl shadow-indigo-100/50 w-full max-w-md overflow-hidden flex flex-col my-8">
        <div className="bg-indigo-600 p-8 text-center text-white flex flex-col items-center">
          <div className="bg-white/20 p-4 rounded-full mb-4 backdrop-blur-sm">
            <Store size={48} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-wider">WarungPOS</h1>
          <p className="text-indigo-100 mt-2 text-sm opacity-90">Sistem Kasir Pintar UMKM v2</p>
        </div>
        
        <div className="p-8">
          <h2 className="text-xl font-semibold mb-6 text-slate-800 text-center">
            {isRegister ? 'Daftar Toko Baru' : 'Selamat Datang'}
          </h2>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 rounded-xl flex items-center space-x-3 text-red-600 animate-slide-in">
              <AlertCircle size={20} className="shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {successMsg && (
            <div className="mb-6 p-4 bg-green-50 rounded-xl flex items-center space-x-3 text-green-600 animate-slide-in">
              <AlertCircle size={20} className="shrink-0" />
              <p className="text-sm font-medium">{successMsg}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Nama Lengkap Owner</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserPlus size={20} className="text-slate-400" />
                    </div>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 bg-slate-50 focus:bg-white transition-colors" placeholder="John Doe" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Nama Toko</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Store size={20} className="text-slate-400" />
                    </div>
                    <input type="text" value={storeName} onChange={(e) => setStoreName(e.target.value)} className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 bg-slate-50 focus:bg-white transition-colors" placeholder="Toko Berkah" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Alamat Toko</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin size={20} className="text-slate-400" />
                    </div>
                    <input type="text" value={storeAddress} onChange={(e) => setStoreAddress(e.target.value)} className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 bg-slate-50 focus:bg-white transition-colors" placeholder="Jl. Raya No. 1" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Nomor HP Toko</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone size={20} className="text-slate-400" />
                    </div>
                    <input type="tel" value={storePhone} onChange={(e) => setStorePhone(e.target.value)} className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 bg-slate-50 focus:bg-white transition-colors" placeholder="0812..." />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Username / Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserCircle size={20} className="text-slate-400" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 bg-slate-50 focus:bg-white transition-colors"
                  placeholder="Masukkan username"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <KeyRound size={20} className="text-slate-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 bg-slate-50 focus:bg-white transition-colors"
                  placeholder="Masukkan password"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all hover:shadow-lg hover:shadow-indigo-600/30 active:scale-[0.98] mt-6"
            >
              {isRegister ? <><UserPlus size={18} className="mr-2"/> Daftarkan Toko</> : <><LogIn size={18} className="mr-2"/> Masuk ke Sistem</>}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button 
              onClick={() => {
                setIsRegister(!isRegister);
                setError('');
                setSuccessMsg('');
              }}
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              {isRegister ? 'Sudah punya toko? Login di sini' : 'Belum punya toko? Daftar sekarang'}
            </button>
          </div>

          {!isRegister && (
            <div className="mt-8 pt-6 border-t border-slate-100 text-center text-xs text-slate-400">
              <p>Demo Admin: owner / 123</p>
              <p className="mt-1">Demo Kasir: kasir / 123</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
