import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Package, History, Users, BarChart3, LogOut, Menu, X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function Layout() {
  const { currentUser, logout, products } = useAppContext();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { path: '/', name: 'Dashboard', icon: <LayoutDashboard size={20} />, roles: ['Owner', 'Kasir'] },
    { path: '/pos', name: 'Kasir (POS)', icon: <ShoppingCart size={20} />, roles: ['Owner', 'Kasir'] },
    { path: '/products', name: 'Produk', icon: <Package size={20} />, roles: ['Owner'] },
    { path: '/history', name: 'Riwayat Transaksi', icon: <History size={20} />, roles: ['Owner', 'Kasir'] },
    { path: '/reports', name: 'Laporan', icon: <BarChart3 size={20} />, roles: ['Owner'] },
    { path: '/users', name: 'Manajemen User', icon: <Users size={20} />, roles: ['Owner'] },
  ];

  const allowedMenus = menuItems.filter(m => m.roles.includes(currentUser?.role));
  const lowStockCount = products.filter(p => p.stock <= 5).length;

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar Desktop */}
      <aside className="w-64 bg-indigo-900 text-white hidden md:flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold tracking-wider text-indigo-100">Warung<span className="text-white">POS</span></h1>
          <p className="text-indigo-300 text-sm mt-1">{currentUser?.role}</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {allowedMenus.map((menu) => (
            <NavLink
              key={menu.path}
              to={menu.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                    : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'
                }`
              }
            >
              {menu.icon}
              <span className="font-medium">{menu.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-indigo-800">
          <div className="flex items-center justify-between mb-4 px-2">
            <div>
              <p className="text-sm font-semibold">{currentUser?.name}</p>
              <p className="text-xs text-indigo-300">Aktif</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-2 px-4 py-2 bg-indigo-800 hover:bg-red-500 hover:text-white text-indigo-200 rounded-lg transition-colors"
          >
            <LogOut size={18} />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header Mobile & Notifications */}
        <header className="bg-white px-6 py-4 shadow-sm flex items-center justify-between z-10">
          <div className="flex items-center">
            <button 
              className="md:hidden mr-4 text-slate-500 hover:text-slate-700"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h2 className="text-xl font-semibold text-slate-800 md:hidden">WarungPOS</h2>
          </div>
          
          <div className="flex items-center space-x-4">
            {lowStockCount > 0 && currentUser?.role === 'Owner' && (
              <div className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium animate-pulse border border-amber-200">
                {lowStockCount} Produk Menipis
              </div>
            )}
            <div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold border-2 border-indigo-200">
              {currentUser?.name.charAt(0)}
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-64 bg-indigo-900 text-white flex flex-col animate-slide-in">
            <div className="flex items-center justify-between p-6">
              <h1 className="text-2xl font-bold">WarungPOS</h1>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-indigo-200 hover:text-white">
                <X size={24} />
              </button>
            </div>
            <nav className="flex-1 px-4 space-y-2">
              {allowedMenus.map((menu) => (
                <NavLink
                  key={menu.path}
                  to={menu.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-xl ${
                      isActive ? 'bg-indigo-600 text-white' : 'text-indigo-200 hover:bg-indigo-800'
                    }`
                  }
                >
                  {menu.icon}
                  <span className="font-medium">{menu.name}</span>
                </NavLink>
              ))}
            </nav>
            <div className="p-4 border-t border-indigo-800">
               <button 
                onClick={handleLogout}
                className="w-full flex items-center space-x-2 px-4 py-2 text-indigo-200 hover:bg-red-500 hover:text-white rounded-lg transition-colors"
               >
                <LogOut size={18} />
                <span>Keluar</span>
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
