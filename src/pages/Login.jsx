import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Store, UserCircle, KeyRound, AlertCircle } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAppContext();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
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
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl shadow-indigo-100/50 w-full max-w-md overflow-hidden flex flex-col">
        <div className="bg-indigo-600 p-8 text-center text-white flex flex-col items-center">
          <div className="bg-white/20 p-4 rounded-full mb-4 backdrop-blur-sm">
            <Store size={48} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-wider">WarungPOS</h1>
          <p className="text-indigo-100 mt-2 text-sm opacity-90">Sistem Kasir Pintar UMKM</p>
        </div>
        
        <div className="p-8">
          <h2 className="text-xl font-semibold mb-6 text-slate-800 text-center">Selamat Datang</h2>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 rounded-xl flex items-center space-x-3 text-red-600 animate-slide-in">
              <AlertCircle size={20} />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserCircle size={20} className="text-slate-400" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm bg-slate-50 focus:bg-white transition-colors"
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
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm bg-slate-50 focus:bg-white transition-colors"
                  placeholder="Masukkan password"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all hover:shadow-lg hover:shadow-indigo-600/30 active:scale-[0.98]"
            >
              Masuk ke Sistem
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-500">
            <p>Admin Login: <span className="font-semibold text-slate-700">owner</span> / <span className="font-semibold text-slate-700">123</span></p>
            <p className="mt-1">Kasir Login: <span className="font-semibold text-slate-700">kasir</span> / <span className="font-semibold text-slate-700">123</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
