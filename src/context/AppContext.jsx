import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

const DUMMY_USERS = [
  { id: 1, username: 'owner', password: '123', role: 'Owner', name: 'Syaiful Hidayat' },
  { id: 2, username: 'kasir', password: '123', role: 'Kasir', name: 'Siti Kasir' }
];

const DUMMY_PRODUCTS = [
  { id: 'P001', name: 'Beras Pandan Wangi 5kg', price: 65000, stock: 20, category: 'Sembako' },
  { id: 'P002', name: 'Minyak Goreng Bimoli 2L', price: 35000, stock: 15, category: 'Sembako' },
  { id: 'P003', name: 'Gula Pasir Gulaku 1kg', price: 15000, stock: 30, category: 'Sembako' },
  { id: 'P004', name: 'Indomie Goreng', price: 3000, stock: 100, category: 'Makanan' },
  { id: 'P005', name: 'Kopi Kapal Api 165g', price: 12000, stock: 3, category: 'Minuman' }, // low stock
];

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('warungpos_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('warungpos_users');
    if (saved) return JSON.parse(saved);
    localStorage.setItem('warungpos_users', JSON.stringify(DUMMY_USERS));
    return DUMMY_USERS;
  });

  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('warungpos_products');
    if (saved) return JSON.parse(saved);
    localStorage.setItem('warungpos_products', JSON.stringify(DUMMY_PRODUCTS));
    return DUMMY_PRODUCTS;
  });

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('warungpos_transactions');
    return saved ? JSON.parse(saved) : [];
  });

  // Save to LocalStorage whenever state changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('warungpos_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('warungpos_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('warungpos_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('warungpos_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('warungpos_transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Actions
  const login = (username, password) => {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const addTransaction = (transactionData) => {
    const newTransaction = {
      ...transactionData,
      id: 'TRX-' + Date.now(),
      date: new Date().toISOString(),
      cashier: currentUser.name
    };
    
    // Update stock
    const updatedProducts = [...products];
    transactionData.items.forEach(item => {
      const pIdx = updatedProducts.findIndex(p => p.id === item.id);
      if(pIdx !== -1) {
        updatedProducts[pIdx].stock -= item.qty;
      }
    });

    setProducts(updatedProducts);
    setTransactions([newTransaction, ...transactions]);
    return newTransaction;
  };

  return (
    <AppContext.Provider value={{
      currentUser, users, products, transactions,
      login, logout, setProducts, setUsers, addTransaction
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
