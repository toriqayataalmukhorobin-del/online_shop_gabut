# 🛍️ API Toko Online Sederhana (E-Commerce)

<p align="center">
  <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&weight=600&size=24&pause=1000&color=36BCF7&center=true&vCenter=true&width=700&lines=Aplikasi+E-Commerce+Full-Stack;Dibangun+dengan+Node.js+%26+Express;Sistem+Autentikasi+JWT+%26+Role+Access" alt="Typing SVG" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Backend-Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Framework-Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/Database-MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL" />
  <img src="https://img.shields.io/badge/Status-Completed-success?style=for-the-badge" alt="Status" />
</p>

---

### 📝 Tentang Proyek

Aplikasi ini adalah **Platform E-Commerce Full-Stack** siap pakai yang mengintegrasikan sistem backend berbasis RESTful API dengan antarmuka frontend yang responsif. Menggunakan Node.js sebagai penggerak utama dan MySQL untuk manajemen data relasional, sistem ini dirancang untuk menangani transaksi toko online mulai dari manajemen produk hingga proses *checkout* pesanan secara otomatis.

---

### 🚀 Fitur Utama Aplikasi

- 📦 **Manajemen Produk & Kategori:** Operasi CRUD lengkap untuk produk (termasuk unggah gambar) dan pengelompokan kategori.
- 🛒 **Sistem Keranjang & Checkout:** Menambah produk ke keranjang, memperbarui kuantitas, kalkulasi total harga otomatis, dan pengurangan stok produk saat checkout.
- 🔐 **Autentikasi Pengguna (JWT):** Registrasi dan login aman menggunakan enkripsi token JWT dengan pembagian hak akses (*Role-based*) antara Admin dan User biasa.
- 📊 **Dashboard Admin & Riwayat:** Halaman khusus admin untuk memantau statistik penjualan serta halaman pengguna untuk melihat riwayat pesanan.
- 🔍 **Pencarian & Filter:** Menemukan produk berdasarkan nama atau deskripsi, serta memfilter barang berdasarkan kategori terkait.

---

### 🛠️ Kebutuhan Sistem (Tech Stack)

<p align="left">
  <a href="https://skillicons.dev">
    <img src="https://skillicons.dev/icons?i=nodejs,express,mysql,bootstrap,js,vscode&theme=dark" />
  </a>
</p>

| Komponen | Teknologi & Pustaka | Kegunaan |
| :--- | :--- | :--- |
| **Backend** | Node.js / Express.js | Kerangka kerja server dan routing RESTful API. |
| **Database** | MySQL | Penyimpanan data relasional (User, Produk, Transaksi). |
| **Frontend** | Bootstrap 5 / Vanilla JS | Desain antarmuka responsif tanpa framework berat. |
| **Keamanan** | JWT & Bcryptjs | Pembuatan token sesi dan hashing password user. |
| **Media** | Multer | Menangani proses unggah berkas gambar produk. |

---

## 💻 Panduan Cara Pemasangan (Lokal)

Ikuti langkah-langkah di bawah ini secara berurutan untuk menjalankan aplikasi di komputer kamu:

### 1. Unduh (Clone) Repositori
Buka terminal atau CMD, lalu jalankan perintah berikut:
```bash
git clone <repository-url>
cd toko-online-api

```
### 2. Pasang Package Dependency
Pasang seluruh pustaka (*library*) Node.js yang tercantum pada file package.json:
```bash
npm install

```
### 3. Konfigurasi Environment File (.env)
Salin berkas template lingkungan bawaan untuk membuat konfigurasi baru:
```bash
cp .env.example .env

```
Buka file .env baru tersebut menggunakan text editor (seperti VS Code) lalu isi nilai konfigurasinya sesuai database lokal kamu:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=toko_online
JWT_SECRET=kunci_rahasia_jwt_kamu
PORT=3000

```
> ⚠️ **CATATAN:** Pastikan aplikasi **XAMPP** (Apache & MySQL) atau server MySQL mandiri milikmu sudah aktif sebelum melangkah ke tahap berikutnya.
> 
### 4. Membuat Database Lokal
Masuk ke terminal MySQL atau buka localhost/phpmyadmin di browser, lalu buat database baru:
```sql
CREATE DATABASE toko_online;

```
Setelah database dibuat, import struktur tabel menggunakan file schema yang sudah disediakan melalui terminal:
```bash
mysql -u root -p toko_online < database-schema.sql

```
### 5. Jalankan Aplikasi
Nyalakan server development lokal menggunakan perintah:
```bash
npm start

```
Buka browser favoritmu dan akses tautan: 👉 **http://localhost:3000**
## 📁 Struktur Dokumen Utama
```text
toko-online-api/
├── public/                 # File statis frontend (HTML, CSS, JS)
│   ├── index.html          # Halaman katalog utama
│   ├── login.html          # Halaman masuk log
│   └── uploads/            # Tempat penyimpanan gambar produk hasil upload
├── src/                    # Source code utama aplikasi backend
│   ├── config/             # Pengaturan koneksi database MySQL
│   ├── controllers/        # Logika bisnis penanganan request (Auth, Cart, Product)
│   ├── middleware/         # Validasi token keamanan dan konfigurasi Multer
│   └── routes/             # Pemetaan endpoint rute URL API
├── database-schema.sql     # Skrip SQL untuk struktur tabel database
└── index.js                # Berkas utama entry-point aplikasi server

```
## 📡 Daftar Endpoint API Utama
### Autentikasi Pengguna
 * POST /auth/register - Mendaftarkan akun pengguna baru.
 * POST /auth/login - Melakukan masuk log untuk mendapatkan token JWT.
 * GET /auth/profile - Mengambil informasi profil pengguna yang sedang login.
### Produk & Kategori
 * GET /products - Menampilkan seluruh daftar produk toko.
 * POST /products - Menambahkan produk baru ke sistem (*Khusus Admin*).
 * PUT /products/:id - Memperbarui data produk berdasarkan ID (*Khusus Admin*).
 * DELETE /products/:id - Menghapus produk dari sistem (*Khusus Admin*).
### Keranjang & Transaksi
 * GET /cart - Melihat isi keranjang belanja pengguna.
 * POST /cart - Memasukkan produk pilihan ke dalam keranjang.
 * POST /cart/checkout - Melakukan proses checkout untuk menerbitkan pesanan baru.
## 🛠️ Panduan Pengembangan Lebih Lanjut (Development)
Jika kamu ingin melakukan modifikasi kode dan ingin server melakukan muat ulang (*auto-restart*) secara otomatis setiap ada perubahan file, gunakan **Nodemon**:
```bash
# Instal nodemon secara global (juku belum punya)
npm install -g nodemon

# Jalankan aplikasi dengan nodemon
nodemon index.js

```
## 🔒 Catatan Keamanan Produksi
 * Pastikan untuk selalu mengubah nilai variabel JWT_SECRET pada file .env sebelum melakukan deployment ke server publik.
 * Selalu gunakan protokol HTTPS pada server produksi demi mengamankan pengiriman token JWT dari sisi client ke server.
 * Lakukan pembaruan dependensi berkala menggunakan npm update untuk menghindari celah keamanan (*vulnerability*).
```

```
