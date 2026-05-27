import { createContext, useContext, useState, useEffect } from 'react';
import { storageService, migrateV1Data } from '../services/storageService';

// Ensure data is migrated if coming from older version
migrateV1Data();

const AppContext = createContext();

const DUMMY_USERS = [
  { id: 1, username: 'owner', password: '123', role: 'Owner', name: 'Syaiful Hidayat', storeId: 'STORE-DEFAULT' },
  { id: 2, username: 'kasir', password: '123', role: 'Kasir', name: 'Siti Kasir', storeId: 'STORE-DEFAULT' }
];

const DUMMY_PRODUCTS = [
  { id: 'P001', name: 'Beras Pandan Wangi 5kg', price: 65000, stock: 20, category: 'Sembako', storeId: 'STORE-DEFAULT', priceGrosir: 63000, pricePartai: 60000, priceBeli: 58000, barcode: '123456789' },
  { id: 'P002', name: 'Minyak Goreng Bimoli 2L', price: 35000, stock: 15, category: 'Sembako', storeId: 'STORE-DEFAULT', priceGrosir: null, pricePartai: null, priceBeli: 33000, barcode: '' },
  { id: 'P003', name: 'Gula Pasir Gulaku 1kg', price: 15000, stock: 30, category: 'Sembako', storeId: 'STORE-DEFAULT', priceGrosir: 14500, pricePartai: 14000, priceBeli: 13500, barcode: '' },
  { id: 'P004', name: 'Indomie Goreng', price: 3000, stock: 100, category: 'Makanan', storeId: 'STORE-DEFAULT', priceGrosir: 2900, pricePartai: 2800, priceBeli: 2500, barcode: '' },
  { id: 'P005', name: 'Kopi Kapal Api 165g', price: 12000, stock: 3, category: 'Minuman', storeId: 'STORE-DEFAULT', priceGrosir: 11500, pricePartai: 11000, priceBeli: 10000, barcode: '' },
];

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(storageService.getCurrentUser());
  
  // Initialize Global States (all data)
  const [allUsers, setAllUsers] = useState(() => {
    const saved = storageService.getAllUsers();
    if (saved && saved.length > 0) return saved;
    return DUMMY_USERS;
  });

  const [allProducts, setAllProducts] = useState(() => {
    const saved = storageService.getAllProducts();
    if (saved && saved.length > 0) return saved;
    return DUMMY_PRODUCTS;
  });

  const [allTransactions, setAllTransactions] = useState(storageService.getAllTransactions());
  const [allDebts, setAllDebts] = useState(storageService.getAllDebts());

  // Save to storage on change
  useEffect(() => storageService.setCurrentUser(currentUser), [currentUser]);
  useEffect(() => storageService.saveAllUsers(allUsers), [allUsers]);
  useEffect(() => storageService.saveAllProducts(allProducts), [allProducts]);
  useEffect(() => storageService.saveAllTransactions(allTransactions), [allTransactions]);
  useEffect(() => storageService.saveAllDebts(allDebts), [allDebts]);

  // Derived state: scoped by storeId
  const currentStoreId = currentUser?.storeId;
  const users = currentStoreId ? allUsers.filter(u => u.storeId === currentStoreId) : [];
  const products = currentStoreId ? allProducts.filter(p => p.storeId === currentStoreId) : [];
  const transactions = currentStoreId ? allTransactions.filter(t => t.storeId === currentStoreId) : [];
  const debts = currentStoreId ? allDebts.filter(d => d.storeId === currentStoreId) : [];

  // Override setter logic to update global state safely
  const setUsers = (newUsers) => {
    setAllUsers(prev => [...prev.filter(u => u.storeId !== currentStoreId), ...newUsers]);
  };
  const setProducts = (newProducts) => {
    setAllProducts(prev => [...prev.filter(p => p.storeId !== currentStoreId), ...newProducts]);
  };
  const setDebts = (newDebts) => {
    setAllDebts(prev => [...prev.filter(d => d.storeId !== currentStoreId), ...newDebts]);
  };

  // Actions
  const login = (username, password) => {
    const user = allUsers.find(u => u.username === username && u.password === password);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const registerOwner = (ownerData) => {
    const storeId = 'STORE-' + Date.now();
    const newUser = {
      id: Date.now(),
      username: ownerData.username,
      password: ownerData.password,
      role: 'Owner',
      name: ownerData.name,
      storeName: ownerData.storeName,
      storeAddress: ownerData.storeAddress,
      storePhone: ownerData.storePhone,
      storeId: storeId
    };
    setAllUsers([...allUsers, newUser]);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const addTransaction = (transactionData) => {
    const newTransaction = {
      ...transactionData,
      id: 'TRX-' + Date.now(),
      date: new Date().toISOString(),
      cashier: currentUser.name,
      storeId: currentStoreId
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
    setAllTransactions([newTransaction, ...allTransactions]);

    // Handle Debt
    if (transactionData.paymentMethod === 'Hutang' && transactionData.debtData) {
      const newDebt = {
        id: 'DBT-' + Date.now(),
        storeId: currentStoreId,
        transactionId: newTransaction.id,
        customerName: transactionData.debtData.customerName,
        customerPhone: transactionData.debtData.customerPhone,
        totalDebt: transactionData.total,
        paidAmount: 0,
        remainingDebt: transactionData.total,
        transactionDate: newTransaction.date,
        dueDate: transactionData.debtData.dueDate,
        note: transactionData.debtData.note,
        status: 'Belum Lunas',
        history: []
      };
      setAllDebts([newDebt, ...allDebts]);
    }

    return newTransaction;
  };

  const addDebtPayment = (debtId, amount) => {
    const updatedDebts = debts.map(debt => {
      if (debt.id === debtId) {
        const newPaidAmount = debt.paidAmount + amount;
        const newRemaining = debt.totalDebt - newPaidAmount;
        let newStatus = debt.status;
        
        if (newRemaining <= 0) {
          newStatus = 'Lunas';
        } else if (newPaidAmount > 0) {
          newStatus = 'Sebagian';
        }

        return {
          ...debt,
          paidAmount: newPaidAmount,
          remainingDebt: newRemaining,
          status: newStatus,
          history: [...debt.history, { date: new Date().toISOString(), amount }]
        };
      }
      return debt;
    });
    setDebts(updatedDebts);
  };

  return (
    <AppContext.Provider value={{
      currentUser, users, products, transactions, debts,
      login, registerOwner, logout, setProducts, setUsers, addTransaction, addDebtPayment, setDebts
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
