// TODO: Migrate to Supabase/Firebase in the future.
// Currently this service wraps localStorage to provide a central data layer and support multi-store setup.

const PREFIX = 'warungpos_v2_';

// Initial migrations or defaults
const getDefaultStoreId = () => {
  return 'STORE-DEFAULT';
};

const getStorageItem = (key, defaultValue) => {
  try {
    const saved = localStorage.getItem(PREFIX + key);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch (error) {
    console.error(`Error reading ${key} from storage:`, error);
    return defaultValue;
  }
};

const setStorageItem = (key, value) => {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to storage:`, error);
  }
};

// Migrate old data if necessary (to prevent losing old V1 data)
export const migrateV1Data = () => {
  const isMigrated = localStorage.getItem(PREFIX + 'migrated');
  if (isMigrated) return;

  const defaultStoreId = getDefaultStoreId();

  // Migrate Users
  let oldUsers = JSON.parse(localStorage.getItem('warungpos_users') || '[]');
  if (oldUsers.length > 0) {
    oldUsers = oldUsers.map(u => ({ ...u, storeId: u.storeId || defaultStoreId }));
    setStorageItem('users', oldUsers);
  }

  // Migrate Products
  let oldProducts = JSON.parse(localStorage.getItem('warungpos_products') || '[]');
  if (oldProducts.length > 0) {
    oldProducts = oldProducts.map(p => ({
      ...p,
      storeId: p.storeId || defaultStoreId,
      priceGrosir: p.priceGrosir || null,
      pricePartai: p.pricePartai || null,
      priceBeli: p.priceBeli || null,
      barcode: p.barcode || '',
      image: p.image || null
    }));
    setStorageItem('products', oldProducts);
  }

  // Migrate Transactions
  let oldTransactions = JSON.parse(localStorage.getItem('warungpos_transactions') || '[]');
  if (oldTransactions.length > 0) {
    oldTransactions = oldTransactions.map(t => ({ ...t, storeId: t.storeId || defaultStoreId }));
    setStorageItem('transactions', oldTransactions);
  }

  localStorage.setItem(PREFIX + 'migrated', 'true');
};

export const storageService = {
  // === CURRENT USER ===
  getCurrentUser: () => getStorageItem('user', null),
  setCurrentUser: (user) => {
    if (user) {
      setStorageItem('user', user);
    } else {
      localStorage.removeItem(PREFIX + 'user');
    }
  },

  // === USERS ===
  getAllUsers: () => getStorageItem('users', []),
  saveAllUsers: (users) => setStorageItem('users', users),
  getUsersByStore: (storeId) => storageService.getAllUsers().filter(u => u.storeId === storeId),

  // === PRODUCTS ===
  getAllProducts: () => getStorageItem('products', []),
  saveAllProducts: (products) => setStorageItem('products', products),
  getProductsByStore: (storeId) => storageService.getAllProducts().filter(p => p.storeId === storeId),

  // === TRANSACTIONS ===
  getAllTransactions: () => getStorageItem('transactions', []),
  saveAllTransactions: (transactions) => setStorageItem('transactions', transactions),
  getTransactionsByStore: (storeId) => storageService.getAllTransactions().filter(t => t.storeId === storeId),

  // === DEBTS ===
  getAllDebts: () => getStorageItem('debts', []),
  saveAllDebts: (debts) => setStorageItem('debts', debts),
  getDebtsByStore: (storeId) => storageService.getAllDebts().filter(d => d.storeId === storeId),
};
