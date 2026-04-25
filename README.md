# WarungPOS

Sistem Kasir Pintar Sederhana untuk UMKM dan Warung. Dibangun dengan fokus pada kemudahan penggunaan, kecepatan transaksi, dan tanpa perlu instalasi backend rumit. Sangat cocok digunakan untuk digitalisasi warung kelontong sederhana hingga menengah.

---

## 1. Jenis Produk dan Market
* **Produk:** New Product
* **Market:** Present Market (Membidik pasar UMKM yang sudah ada solusi lain seperti Moka POS, Kasir Pintar, dll namun menawarkan solusi yang lebih ringan, cepat, tanpa server/langganan bulanan).

---

## 2. Daftar Fitur Utama
- **Multi-Role Login System:** Akses terpisah untuk Owner (Admin) dan Kasir.
- **Dashboard Analitik:** Ringkasan pendapatan harian, status stok, dan log transaksi terakhir.
- **Manajemen Inventori (Produk):** Tambah, Edit, Hapus data barang berserta pengaturan stok dan harga.
- **Point of Sale (POS):** Layar kasir cepat untuk melayani transaksi (pilih produk, hitung otomatis, opsi metode pembayaran).
- **Cetak Struk:** Struk digital yang siap di-print melalui perangkat thermal atau printer biasa.
- **Notifikasi Stok Menipis:** Peringatan visual jika stok mencapai ambang batas minimum.
- **Laporan & Riwayat:** Laporan produk terlaris sepanjang waktu dan log riwayat tiap transaksi.
- **Manajemen Karyawan:** Owner dapat dengan mudah menambah/menghapus akun untuk kasir baru.

---

## 3. Use Case Diagram

```mermaid
usecaseDiagram
    actor Owner
    actor Kasir
    actor Customer

    Owner --> (Login Aplikasi)
    Kasir --> (Login Aplikasi)

    Owner --> (Kelola Produk)
    Owner --> (Kelola Stok)
    Owner --> (Lihat Laporan Penjualan)
    Owner --> (Kelola Akun User)

    Kasir --> (Input Transaksi di POS)
    Kasir --> (Proses Pembayaran)
    Kasir --> (Cetak Struk Transaksi)
    
    Customer --> (Membayar Pesanan) : Tunai, QRIS, E-Wallet
    
    (Proses Pembayaran) ..> (Membayar Pesanan) : include
    (Proses Pembayaran) ..> (Update Stok Sistem) : include
    (Proses Pembayaran) ..> (Simpan Riwayat Transaksi) : include
    
    (Update Stok Sistem) ..> (Kirim Notifikasi Stok Menipis) : extend
```

---

## 4. Persyaratan & Cara Menjalankan Lokal (Development)

Pastikan di perangkat Anda telah ter-install [Node.js](https://nodejs.org/) (versi 16 atau lebih baru).

1. Buka terminal, lalu masuk ke dalam folder project (`d:\app-KasirKita\WarungPOS` jika Anda membukanya secara lokal, atau cukup hasil clone).
2. Instal semua dependensi:
   ```bash
   npm install
   ```
3. Jalankan development server:
   ```bash
   npm run dev
   ```
4. Buka browser dan arahkan ke alamat lokal yang muncul di terminal (contoh: `http://localhost:5173`).
5. **Akses Default:**
   * Owner: `owner` / password: `123`
   * Kasir: `kasir` / password: `123`

---

## 5. Deployment / Publish

### A. Publish Source Code ke GitHub
1. Buat repository baru di GitHub secara online tanpa file awal (no README/gitignore).
2. Di terminal PC Anda, jalankan urutan berikut dari direktori aplikasi ini:
   ```bash
   git init
   git add .
   git commit -m "first commit - WarungPOS MVP"
   git branch -M main
   git remote add origin https://github.com/USERNAME/namarepo.git
   git push -u origin main
   ```
   *Gantilah URL origin dengan link repository baru milik Anda.*

**Link GitHub:** [masukkan link GitHub]

### B. Publish ke Vercel atau Netlify
Aplikasi ini berbasis React (Vite) Front-End Only (menggunakan LocalStorage), sangat mudah dihosting gratis:
- **Netlify:** Cukup drag & drop folder `dist` (hasil dari `npm run build`) ke halaman deploy Netlify, ATAU hubungkan langsung repository GitHub Anda. Setting Build command: `npm run build`, Publish directory: `dist`.
- **Vercel:** Login ke Vercel, pilih Add New Project, import akun GitHub Anda untuk repo ini. Vercel otomatis mendeteksi setup Vite. Klik Deploy.

**Link Live App:** [masukkan link publish web]

---

## 6. Tabel Pengujian Kualitas Aplikasi

| No | Aspek Kualitas | Skenario Pengujian | Hasil yang Diharapkan | Status |
|---|---|---|---|---|
| 1 | Functionality | User login sebagai Owner/Kasir | Sistem berhasil masuk sesuai role | Berhasil |
| 2 | Functionality | Owner menambahkan produk baru | Produk tampil di daftar produk | Berhasil |
| 3 | Functionality | Kasir melakukan transaksi | Transaksi tersimpan dan total benar | Berhasil |
| 4 | Reliability | Stok produk berkurang setelah transaksi | Stok otomatis terupdate | Berhasil |
| 5 | Usability | User menggunakan menu dashboard | Navigasi mudah dipahami | Berhasil |
| 6 | Performance | Membuka halaman dashboard | Halaman tampil cepat | Berhasil |
| 7 | Security | Kasir mencoba akses menu User | Akses dibatasi sesuai role (Ditolak) | Berhasil |
| 8 | Maintainability | Data produk tersimpan di localStorage | Data tetap tersedia setelah refresh page | Berhasil |

---

## 7. Profil Pembuat
- **Nama**: Syaiful Hidayat
- **NIM**: 202310370311169
