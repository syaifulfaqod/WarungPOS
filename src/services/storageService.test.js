import { describe, it, expect, beforeEach } from 'vitest';
import { storageService, migrateV1Data } from './storageService';

const fakeStorage = {};
const fakeLocalStorage = {
  getItem: (key) => fakeStorage[key] || null,
  setItem: (key, value) => { fakeStorage[key] = String(value); },
  removeItem: (key) => { delete fakeStorage[key]; },
  clear: () => { Object.keys(fakeStorage).forEach(k => delete fakeStorage[k]); }
};

beforeEach(() => {
  fakeLocalStorage.clear();
  global.localStorage = fakeLocalStorage;
});

describe('storageService - Users', () => {
  it('getAllUsers mengembalikan array kosong kalau belum ada data', () => {
    const result = storageService.getAllUsers();
    expect(result).toEqual([]);
  });

  it('saveAllUsers dan getAllUsers bisa simpan dan ambil data user', () => {
    const users = [
      { id: 1, username: 'budi', role: 'Kasir', storeId: 'STORE-1' },
      { id: 2, username: 'ani', role: 'Owner', storeId: 'STORE-1' }
    ];
    storageService.saveAllUsers(users);
    expect(storageService.getAllUsers()).toEqual(users);
  });

  it('getUsersByStore cuma ambil user sesuai storeId', () => {
    const users = [
      { id: 1, username: 'budi', storeId: 'STORE-1' },
      { id: 2, username: 'ani', storeId: 'STORE-2' },
      { id: 3, username: 'caca', storeId: 'STORE-1' }
    ];
    storageService.saveAllUsers(users);

    const result = storageService.getUsersByStore('STORE-1');
    expect(result.length).toBe(2);
    expect(result[0].username).toBe('budi');
    expect(result[1].username).toBe('caca');
  });
});

describe('storageService - Products', () => {
  it('getAllProducts return kosong kalau storage masih kosong', () => {
    expect(storageService.getAllProducts()).toEqual([]);
  });

  it('bisa simpan dan ambil list produk', () => {
    const produk = [
      { id: 'P001', name: 'Beras 5kg', price: 65000, stock: 20, storeId: 'STORE-1' },
      { id: 'P002', name: 'Minyak 2L', price: 35000, stock: 10, storeId: 'STORE-1' }
    ];
    storageService.saveAllProducts(produk);
    expect(storageService.getAllProducts()).toEqual(produk);
  });

  it('getProductsByStore filter produk berdasarkan toko', () => {
    const produk = [
      { id: 'P001', name: 'Beras', storeId: 'TOKO-A' },
      { id: 'P002', name: 'Gula', storeId: 'TOKO-B' },
      { id: 'P003', name: 'Kopi', storeId: 'TOKO-A' }
    ];
    storageService.saveAllProducts(produk);

    const hasilA = storageService.getProductsByStore('TOKO-A');
    expect(hasilA.length).toBe(2);

    const hasilB = storageService.getProductsByStore('TOKO-B');
    expect(hasilB.length).toBe(1);
    expect(hasilB[0].name).toBe('Gula');
  });
});

describe('storageService - Transactions', () => {
  it('default transaksi kosong', () => {
    expect(storageService.getAllTransactions()).toEqual([]);
  });

  it('simpan dan ambil data transaksi', () => {
    const trx = [
      { id: 'TRX-001', total: 50000, storeId: 'STORE-1' },
      { id: 'TRX-002', total: 120000, storeId: 'STORE-1' }
    ];
    storageService.saveAllTransactions(trx);
    expect(storageService.getAllTransactions()).toEqual(trx);
  });

  it('getTransactionsByStore filter sesuai storeId', () => {
    const trx = [
      { id: 'TRX-001', total: 50000, storeId: 'STORE-1' },
      { id: 'TRX-002', total: 30000, storeId: 'STORE-2' }
    ];
    storageService.saveAllTransactions(trx);

    expect(storageService.getTransactionsByStore('STORE-1').length).toBe(1);
    expect(storageService.getTransactionsByStore('STORE-2')[0].total).toBe(30000);
  });
});

describe('storageService - Debts', () => {
  it('default hutang kosong', () => {
    expect(storageService.getAllDebts()).toEqual([]);
  });

  it('simpan dan baca data hutang', () => {
    const debts = [
      { id: 'DBT-001', customerName: 'Pak Joko', totalDebt: 75000, storeId: 'STORE-1' }
    ];
    storageService.saveAllDebts(debts);
    expect(storageService.getAllDebts()).toEqual(debts);
  });

  it('getDebtsByStore filter hutang per toko', () => {
    const debts = [
      { id: 'DBT-001', customerName: 'Pak Joko', storeId: 'STORE-1' },
      { id: 'DBT-002', customerName: 'Bu Sari', storeId: 'STORE-2' },
      { id: 'DBT-003', customerName: 'Mas Doni', storeId: 'STORE-1' }
    ];
    storageService.saveAllDebts(debts);

    const store1 = storageService.getDebtsByStore('STORE-1');
    expect(store1.length).toBe(2);

    const store2 = storageService.getDebtsByStore('STORE-2');
    expect(store2.length).toBe(1);
  });
});

describe('storageService - Current User', () => {
  it('getCurrentUser null kalau belum login', () => {
    expect(storageService.getCurrentUser()).toBeNull();
  });

  it('setCurrentUser bisa set dan get user yang login', () => {
    const user = { id: 1, username: 'budi', role: 'Kasir', storeId: 'STORE-1' };
    storageService.setCurrentUser(user);
    expect(storageService.getCurrentUser()).toEqual(user);
  });

  it('setCurrentUser null untuk logout (hapus dari storage)', () => {
    const user = { id: 1, username: 'budi', role: 'Kasir' };
    storageService.setCurrentUser(user);
    storageService.setCurrentUser(null);
    expect(storageService.getCurrentUser()).toBeNull();
  });
});

describe('migrateV1Data', () => {
  it('migrasi data users lama ke format v2 dengan storeId default', () => {
    fakeLocalStorage.setItem('warungpos_users', JSON.stringify([
      { id: 1, username: 'owner', role: 'Owner' }
    ]));

    migrateV1Data();

    const migrated = storageService.getAllUsers();
    expect(migrated.length).toBe(1);
    expect(migrated[0].storeId).toBe('STORE-DEFAULT');
  });

  it('migrasi data products lama dan tambah field baru', () => {
    fakeLocalStorage.setItem('warungpos_products', JSON.stringify([
      { id: 'P001', name: 'Beras', price: 60000, stock: 10 }
    ]));

    migrateV1Data();

    const migrated = storageService.getAllProducts();
    expect(migrated[0].storeId).toBe('STORE-DEFAULT');
    expect(migrated[0].priceGrosir).toBeNull();
    expect(migrated[0].barcode).toBe('');
  });

  it('tidak migrasi ulang kalau sudah pernah dimigrasi', () => {
    fakeLocalStorage.setItem('warungpos_v2_migrated', 'true');
    fakeLocalStorage.setItem('warungpos_users', JSON.stringify([
      { id: 99, username: 'test' }
    ]));

    migrateV1Data();

    expect(storageService.getAllUsers()).toEqual([]);
  });
});
