# WarungPOS v2

Sistem Kasir Pintar Sederhana untuk UMKM dan Warung. Dibangun dengan fokus pada kemudahan penggunaan, kecepatan transaksi, dan tanpa perlu instalasi backend rumit. Sangat cocok digunakan untuk digitalisasi warung kelontong sederhana hingga menengah. Pada versi v2, WarungPOS mendukung fitur Multi-Toko, Kasbon (Buku Hutang), Barcode Scanner, serta Multi-Harga (Normal, Grosir, Partai).

---

## 1. Jenis Produk dan Market
* **Produk:** New Product / Major Upgrade (v2)
* **Market:** Present Market (Membidik pasar UMKM yang sudah ada solusi lain seperti Moka POS, Kasir Pintar, dll namun menawarkan solusi yang lebih ringan, cepat, tanpa server/langganan bulanan).

---

## 2. Daftar Fitur Utama
- **Sistem Multi-Toko (Multi-Tenant):** Setiap Owner memiliki `storeId` sendiri, menjamin data terpisah antar toko.
- **Multi-Role Login System:** Akses terpisah untuk Owner (Admin) dan Kasir. Owner dapat membuat akun kasir.
- **Dashboard Analitik:** Ringkasan pendapatan harian, estimasi laba, status stok menipis, produk terlaris, dan sisa piutang.
- **Manajemen Inventori Lanjutan:** Dukungan upload foto produk, input barcode, dan penentuan harga bertingkat (Harga Beli, Normal, Grosir, Partai).
- **Point of Sale (POS) Modern:** Dukungan pemindaian barcode otomatis, pemilihan jenis harga saat transaksi, serta metode pembayaran Hutang.
- **Buku Hutang (Piutang):** Manajemen piutang pelanggan lengkap dengan jatuh tempo, cicilan pembayaran (sebagian/lunas), dan riwayat cicilan.
- **Cetak Struk:** Struk digital yang siap di-print melalui perangkat thermal atau printer biasa.
- **Laporan Keuangan:** Laporan total penjualan, estimasi laba kotor, dan ringkasan piutang sepanjang waktu.

---

## 3. Use Case Diagram

```mermaid
usecaseDiagram
    actor Owner
    actor Kasir
    actor Customer

    Owner --> (Registrasi Toko Baru)
    Owner --> (Login Aplikasi)
    Kasir --> (Login Aplikasi)

    Owner --> (Kelola Produk & Harga)
    Owner --> (Kelola Stok & Barcode)
    Owner --> (Lihat Laporan Keuangan)
    Owner --> (Kelola Akun Kasir)

    Kasir --> (Input Transaksi di POS)
    Kasir --> (Scan Barcode Produk)
    Kasir --> (Proses Pembayaran Tunai/QRIS/Hutang)
    Kasir --> (Cetak Struk Transaksi)
    
    Kasir --> (Kelola Buku Hutang)
    Kasir --> (Terima Cicilan Hutang)
    
    Customer --> (Membayar Belanjaan)
    Customer --> (Membayar Tagihan Hutang)
    
    (Proses Pembayaran Tunai/QRIS/Hutang) ..> (Membayar Belanjaan) : include
    (Proses Pembayaran Tunai/QRIS/Hutang) ..> (Update Stok Sistem) : include
    (Proses Pembayaran Tunai/QRIS/Hutang) ..> (Simpan Riwayat Transaksi) : include
    (Terima Cicilan Hutang) ..> (Membayar Tagihan Hutang) : include
    
    (Update Stok Sistem) ..> (Kirim Notifikasi Stok Menipis) : extend
```

---

## 4. Persyaratan & Cara Menjalankan Lokal (Development)

Pastikan di perangkat Anda telah ter-install [Node.js](https://nodejs.org/) (versi 16 atau lebih baru).

1. Buka terminal, lalu masuk ke dalam folder project (`d:\Semester 6\Rekayasa Kebutuhan\WarungPOS` jika Anda membukanya secara lokal, atau cukup hasil clone).
2. Instal semua dependensi:
   ```bash
   npm install
   ```
3. Jalankan development server:
   ```bash
   npm run dev
   ```
4. Buka browser dan arahkan ke alamat lokal yang muncul di terminal (contoh: `http://localhost:5173`).
5. **Akses Default (Data v1 Migrasi Otomatis):**
   * Owner: `owner` / password: `123`
   * Kasir: `kasir` / password: `123`
   * *Anda juga dapat mencoba fitur Multi-Toko dengan mendaftarkan akun Owner baru di halaman Login.*

---

## 5. Deployment / Publish

### A. Publish Source Code ke GitHub
1. Buat repository baru di GitHub secara online tanpa file awal (no README/gitignore).
2. Di terminal PC Anda, jalankan urutan berikut dari direktori aplikasi ini:
   ```bash
   git init
   git add .
   git commit -m "first commit - WarungPOS MVP v2"
   git branch -M main
   git remote add origin https://github.com/USERNAME/namarepo.git
   git push -u origin main
   ```
   *Gantilah URL origin dengan link repository baru milik Anda.*

**Link GitHub:** [masukkan link GitHub]

### B. Publish ke Vercel atau Netlify
Aplikasi ini berbasis React (Vite) Front-End Only (menggunakan LocalStorage dengan Data Abstraction Layer), sangat mudah dihosting gratis:
- **Netlify:** Cukup drag & drop folder `dist` (hasil dari `npm run build`) ke halaman deploy Netlify, ATAU hubungkan langsung repository GitHub Anda. Setting Build command: `npm run build`, Publish directory: `dist`.
- **Vercel:** Login ke Vercel, pilih Add New Project, import akun GitHub Anda untuk repo ini. Vercel otomatis mendeteksi setup Vite. Klik Deploy.

**Link Live App:** [masukkan link publish web]

---

## 6. Tabel Pengujian Kualitas Aplikasi (Test Scenarios v2)

| No | Aspek Kualitas | Skenario Pengujian | Hasil yang Diharapkan | Status |
|---|---|---|---|---|
| 1 | Functionality | Owner daftar akun baru di Login page | Masuk dashboard dengan toko kosong baru | Berhasil |
| 2 | Functionality | Kasir membuat transaksi dengan metode "Hutang" | Wajib isi nama dan tgl jatuh tempo, data masuk ke Buku Hutang | Berhasil |
| 3 | Functionality | Kasir membayar hutang sebagian di Buku Hutang | Sisa hutang berkurang, status menjadi "Sebagian", history tercatat | Berhasil |
| 4 | Functionality | Kasir scan barcode di POS (`Enter` search input) | Produk otomatis masuk ke keranjang | Berhasil |
| 5 | Functionality | Kasir pilih "Harga Grosir" saat transaksi | Harga item di keranjang berubah ke harga grosir (jika ada) | Berhasil |
| 6 | Reliability | Data localStorage dimigrasi dari versi 1 ke versi 2 | Data lama mendapat storeId 'STORE-DEFAULT', aplikasi tidak crash | Berhasil |
| 7 | Security | Pemisahan data antar Toko (Multi-Tenant) | User Toko A tidak bisa melihat produk dan transaksi Toko B | Berhasil |
| 8 | Usability | Owner upload foto produk base64 | Foto tampil di tabel produk dan grid POS dengan baik | Berhasil |

---

## 7. Profil Pembuat
- **Nama**: Syaiful Hidayat
- **NIM**: 202310370311169
